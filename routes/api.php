<?php

use App\Http\Controllers\CounterController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\ServicesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are typically stateless.
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Queue API Routes
Route::get('/queues', [QueueController::class, 'indexApi']);
Route::get('/queues/form-data', [QueueController::class, 'createApi']);
Route::get('/queues/dates', [QueueController::class, 'getQueueDatesApi']);
Route::post('/queues', [QueueController::class, 'storeApi']);
Route::get('/queues/{queue}/print', [QueueController::class, 'printApi']);
Route::patch('/queues/{queue}/wait', [QueueController::class, 'setWaitingApi']);
Route::patch('/queues/{queue}/serve', [QueueController::class, 'setServingApi']);
Route::patch('/queues/{queue}/complete', [QueueController::class, 'setCompletedApi']);
Route::patch('/queues/{queue}/cancel', [QueueController::class, 'setCancelledApi']);

// Counter API Routes
Route::get('/counters', [CounterController::class, 'indexApi']);
Route::get('/counters/{counter}', [CounterController::class, 'showApi']);
Route::patch('/counters/{counter}/readiness', [CounterController::class, 'updateReadinessApi']);
Route::post('/counters/{counter}/call-next', [CounterController::class, 'callNextQueueApi']);

// Services API Route
Route::get('/services', [ServicesController::class, 'index']);
