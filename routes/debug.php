<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\QueueController;

Route::get('/debug', [QueueController::class, 'displayDebug'])->name('queues.display.debug');
Route::get('/debug/form', [QueueController::class, 'createDebug'])->name('queues.create.debug');
Route::post('/debug/queues', [QueueController::class, 'storeDebug'])->name('queues.store.debug');
Route::get('/debug/Q-{queue}', [QueueController::class, 'printDebug'])->name('queue.print.debug');
Route::patch('/debug/Q-{queue}/wait', [QueueController::class, 'setWaitingDebug'])->name('queue.wait.debug');
Route::patch('/debug/Q-{queue}/serve', [QueueController::class, 'setServingDebug'])->name('queue.serve.debug');
Route::patch('/debug/Q-{queue}/complete', [QueueController::class, 'setCompletedDebug'])->name('queue.complete.debug');
Route::patch('/debug/Q-{queue}/cancel', [QueueController::class, 'setCancelledDebug'])->name('queue.cancel.debug');

Route::get('/debug/display', [CounterController::class, 'displayDebug'])->name('counters.display.debug');
Route::get('/debug/C-{counter}', [CounterController::class, 'showDebug'])->name('counter.show.debug');
Route::patch('/debug/C-{counter}/wait', [CounterController::class, 'setWaitingDebug'])->name('counter.wait.debug');
Route::patch('/debug/C-{counter}/complete', [CounterController::class, 'setCompletedDebug'])->name('counter.complete.debug');
Route::patch('/debug/C-{counter}/cancel', [CounterController::class, 'setCancelledDebug'])->name('counter.cancel.debug');
