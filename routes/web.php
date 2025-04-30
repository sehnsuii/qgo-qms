<?php
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
Route::get('/Back', function () {
    return Inertia::render('Back'); // 
});

require __DIR__.'/auth.php';
