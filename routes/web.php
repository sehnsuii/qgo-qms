<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Models\Counters;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/counters', function () {
    return Inertia::render('QueueDisplay');
});

Route::get('/counter/{counter}', function (Counters $counter) {
    if (Auth::id() !== $counter->user_id) {
        Log::warning("User " . Auth::id() . " attempted to access Counter {$counter->id} without authorization.");
        abort(403, 'You are not assigned to this counter.');
    }
    return Inertia::render('Counter', [
        'counterId' => $counter->id
        // 'counter' => $counter->load('queue.service') // Pass the full counter object if needed by the Counter component
    ]);
})->middleware(['auth', 'verified'])->name('counter.show');

Route::get('/counter/{counter}/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('counter.login.create');

Route::post('/counter/{counter}/login', [AuthenticatedSessionController::class, 'storeCounterLogin'])
    ->middleware('guest')
    ->name('counter.login.store');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/debug.php';
