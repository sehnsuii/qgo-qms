<?php

use App\Http\Controllers\CounterController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/Welcome', function () {
    return Inertia::render('Welcome');
});
Route::get('/QueueDisplay', function () {
    return Inertia::render('QueueDisplay');
});
Route::get('/FormWizard', function () {
    return Inertia::render('FormWizard');
});
Route::get('/CustomerSelection', function () {
    return Inertia::render('CustomerSelection');
});
Route::get('/ServiceSelection', function () {
    return Inertia::render('ServiceSelection');
});
Route::get('/DetailSummary', function () {
    return Inertia::render('DetailSummary');
});
Route::get('/PrintQueue', function () {
    return Inertia::render('PrintQueue');
});


// Form Functions
Route::get('/debug', [QueueController::class, 'display'])->name('queues.display');
Route::get('/debug-form', [QueueController::class, 'create'])->name('queues.create');
Route::post('/queues', [QueueController::class, 'store'])->name('queues.store');
Route::get('/Q-{queue}', [QueueController::class, 'print'])->name('queue.print');
Route::patch('/Q-{queue}/wait', [QueueController::class, 'setWaiting'])->name('queue.wait');
Route::patch('/Q-{queue}/serve', [QueueController::class, 'setServing'])->name('queue.serve');
Route::patch('/Q-{queue}/complete', [QueueController::class, 'setComplete'])->name('queue.complete');
Route::patch('/Q-{queue}/cancel', [QueueController::class, 'setCancelled'])->name('queue.cancel');

// Counter Functions
Route::get('/debug-display', [CounterController::class, 'display'])->name('counters.display');
Route::get('/C-{counter}', [CounterController::class, 'counter'])->name('counter.show');
Route::patch('/C-{counter}/wait', [CounterController::class, 'setWaiting'])->name('counter.wait');
Route::patch('/C-{counter}/complete', [CounterController::class, 'setCompleted'])->name('counter.complete');
Route::patch('/C-{counter}/cancel', [CounterController::class, 'setCancelled'])->name('counter.cancel');

require __DIR__ . '/auth.php';
