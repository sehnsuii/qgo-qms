<?php

namespace App\Http\Controllers\Auth;

use App\Models\Counters;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request, ?Counters $counter = null): Response
    {
        // Check if the 'counter' parameter exists in the route
        // $counter = $request->route('counter'); // Alternative way to get route parameter if not using binding

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'counter' => $counter, // Pass the counter model (or null if standard login)
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        session(['is_counter_login' => false]); // Flag for standard login
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Handle an incoming authentication request for a specific counter.
     */
    public function storeCounterLogin(LoginRequest $request, Counters $counter): RedirectResponse
    {
        // 1. Authenticate the user (same as regular login)
        $request->authenticate();

        // 2. Regenerate session
        $request->session()->regenerate();
        session(['is_counter_login' => true]); // Flag for counter login

        // 3. Assign the user to the counter
        $user = $request->user();
        try {
            $alreadyAssigned = Counters::where('user_id', $user->id)->where('id', '!=', $counter->id)->first();
            if ($alreadyAssigned) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                Log::warning("Login attempt for Counter {$counter->id} failed: User {$user->id} already assigned to Counter {$alreadyAssigned->id}.");
                return redirect()->route('counter.login.create', ['counter' => $counter->id])
                                 ->withErrors(['email' => 'You are already assigned to another counter (Counter ' . $alreadyAssigned->id . '). Please log out there first.']);
            }

            DB::beginTransaction();
            $counterToAssign = Counters::where('id', $counter->id)->lockForUpdate()->first();

            if ($counterToAssign->user_id !== null && $counterToAssign->user_id !== $user->id) {
                DB::rollBack();
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                Log::warning("Login attempt for Counter {$counter->id} failed: Already occupied by User {$counterToAssign->user_id}.");
                return redirect()->route('counter.login.create', ['counter' => $counter->id])
                                 ->withErrors(['email' => 'This counter is currently occupied by another user.']);
            }

            if ($counterToAssign->user_id !== $user->id) {
                $counterToAssign->user_id = $user->id;
                $counterToAssign->status = 'Not Ready';
                $counterToAssign->save();
                Log::info("User {$user->id} assigned to Counter {$counterToAssign->id} via counter login.");
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            Log::error("Failed to assign Counter {$counter->id} to User {$user->id} during counter login: " . $e->getMessage());
            return redirect()->route('counter.login.create', ['counter' => $counter->id])
                             ->withErrors(['email' => 'An error occurred assigning the counter. Please try again.']);
        }

        // 4. Redirect to the counter's page
        return redirect()->intended(route('counter.show', ['counter' => $counter->id], absolute: false));
    }

    /**
     * Destroy an authenticated session.
     * (Ensure logout also unassigns the counter)
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        $counterId = null; // Variable to store counter ID if applicable
        if ($user) {
            try {
                $assignedCounter = Counters::where('user_id', $user->id)->first();

                if ($assignedCounter) {
                    $assignedCounter->user_id = null;
                    $assignedCounter->status = 'Not Ready';
                    $assignedCounter->queue_id = null;
                    $assignedCounter->save();
                    $counterId = $assignedCounter->id; // Store the ID for redirect
                    Log::info("Counter {$assignedCounter->id} unassigned from User {$user->id} during logout.");
                }
            } catch (\Exception $e) {
                Log::error("Failed to unassign counter from User {$user->id} during logout: " . $e->getMessage());
            }
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // Redirect based on whether a counter was associated
        if ($counterId) {
            return redirect()->route('counter.login.create', ['counter' => $counterId]);
        } else {
            return redirect()->route('login');
        }
    }
}
