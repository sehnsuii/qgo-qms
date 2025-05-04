<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Counters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CounterController extends Controller
{
    public function displayDebug()
    {
        $counters = Counters::with('queue')->orderBy('id', 'asc')->get();
        return view('debug.display', ['counters' => $counters]);
    }
    public function showDebug(Counters $counter)
    {
        $counter->load('queue');
        return view('debug.counter', ['counter' => $counter]);
    }
    public function setWaitingDebug(Counters $counter)
    {
        $queue = $counter->queue;
        if ($queue) {
            $queue->status = 'Waiting';
            $queue->save();
        }

        $counter->status = 'ready';
        $counter->queue_id = null;
        $counter->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }
    public function setCompletedDebug(Counters $counter)
    {
        $queue = $counter->queue;
        if ($queue) {
            $queue->status = 'Completed';
            $queue->save();
        }

        $counter->status = 'ready';
        $counter->queue_id = null;
        $counter->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }
    public function setCancelledDebug(Counters $counter)
    {
        $queue = $counter->queue;
        if ($queue) {
            $queue->status = 'Cancelled';
            $queue->save();
        }

        $counter->status = 'ready';
        $counter->queue_id = null;
        $counter->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }

    // ---------------------------------------------------------------------------------------

    /**
     * Display a listing of the counters.
     * API Endpoint.
     *
     * @return JsonResponse
     */
    public function indexApi(): JsonResponse
    {
        $counters = Counters::with('queue')->orderBy('id', 'asc')->get();
        return response()->json($counters);
    }

    /**
     * Display the specified counter.
     * API Endpoint.
     *
     * @param Counters $counter
     * @return JsonResponse
     */
    public function showApi(Counters $counter): JsonResponse
    {
        $counter->load('queue.service');
        return response()->json($counter);
    }

    /**
     * Update the status of the specified counter.
     * API Endpoint.
     *
     * @param Counters $counter
     * @param Request $request
     * @return JsonResponse
     */
    public function updateStatusApi(Counters $counter, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:online,offline', // Validate incoming status
        ]);

        // Map 'online' from frontend to 'ready' for backend
        $newStatus = $validated['status'] === 'online' ? 'ready' : 'offline';

        // Ensure the status is valid according to the database enum
        if (!in_array($newStatus, ['ready', 'offline'])) {
             return response()->json(['message' => 'Invalid status provided.'], 422);
        }

        // Prevent setting to ready if the counter is busy
        if ($newStatus === 'ready' && $counter->queue_id !== null) {
             return response()->json(['message' => 'Cannot set counter to ready while serving a customer.'], 409); // Conflict
        }

        $counter->status = $newStatus;

        // If going offline, ensure no queue is assigned (optional, depends on desired logic)
        // if ($newStatus === 'offline') {
        //     $counter->queue_id = null;
        // }

        $counter->save();
        $counter->load('queue.service'); // Reload relations for consistent response

        return response()->json($counter);
    }

    /**
     * Call the next queue for the specified counter.
     * API Endpoint.
     *
     * @param Counters $counter
     * @return JsonResponse
     */
    public function callNextQueueApi(Counters $counter): JsonResponse
    {
        // Check if the counter is ready
        if ($counter->status !== 'ready') {
            return response()->json(['message' => 'Counter is not ready.'], 409); // Conflict
        }

        // Get the next queue for the counter
        $nextQueue = Queue::where('status', 'Waiting')
            // ->where('service_id', $counter->service_id)
            ->orderBy('created_at', 'asc')
            ->first();

        if (!$nextQueue) {
            return response()->json(['message' => 'No waiting queues available.'], 404); // Not Found
        }

        // Update the queue status and assign it to the counter
        $nextQueue->status = 'Now Serving';
        $nextQueue->save();

        $counter->queue_id = $nextQueue->id;
        $counter->save();

        return response()->json($nextQueue);
    }
}
