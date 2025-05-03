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

Route::get('/debug', [QueueController::class, 'showAll'])->name('debug.index');
Route::get('/debug/form', [QueueController::class, 'create'])->name('debug.form');
Route::get('/debug/display', [CounterController::class, 'display'])->name('debug.display');

Route::patch('/queues/{queue}/wait', [QueueController::class, 'setWaiting'])->name('queues.wait');
Route::patch('/queues/{queue}/serve', [QueueController::class, 'setServing'])->name('queues.serve');
Route::patch('/queues/{queue}/complete', [QueueController::class, 'setComplete'])->name('queues.complete');
Route::patch('/queues/{queue}/cancel', [QueueController::class, 'setCancelled'])->name('queues.cancel');

Route::post('/queues', [QueueController::class, 'store'])->name('queues.store');

require __DIR__ . '/auth.php';
