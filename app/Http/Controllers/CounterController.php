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

        $counter->status = 'Ready';
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

        $counter->status = 'Ready';
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

        $counter->status = 'Ready';
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
        // Load both queue and user relationships
        $counters = Counters::with(['queue', 'user'])->orderBy('id', 'asc')->get();
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
        $waitingList = Queue::where('status', 'Waiting')
                            ->whereDate('created_at', today())
                            ->with('service')
                            ->orderBy('created_at', 'asc')
                            ->get();

        $responseData = $counter->toArray();
        $responseData['waiting_list'] = $waitingList;
        return response()->json($responseData);
    }

    /**
     * Update the readiness status of the specified counter (Toggle Ready/Not Ready).
     * API Endpoint.
     * Renamed from updateStatusApi to updateReadinessApi for clarity.
     *
     * @param Counters $counter
     * @param Request $request // Request should contain the desired state ('Ready' or 'Not Ready')
     * @return JsonResponse
     */
    public function updateReadinessApi(Counters $counter, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Ready,Not Ready',
        ]);

        $newStatus = $validated['status'];

        // Ensure counter is not busy
        if ($counter->status === 'Busy') {
            return response()->json(['message' => 'Cannot change readiness while serving a customer.'], 409); // Conflict
        }

        // Ensure the requested status is different from the current one
        if ($counter->status === $newStatus) {
            $counter->load('queue.service');
            return response()->json($counter); // No change needed, return current state
        }

        // Prevent setting to Ready if the counter has no assigned user (implies offline)
        // This check might be redundant if UI prevents access, but good for API robustness
        if ($newStatus === 'Ready' && $counter->user_id === null) {
             return response()->json(['message' => 'Cannot set counter to Ready without an assigned user.'], 409);
        }

        $counter->status = $newStatus;
        $counter->save();
        $counter->load('queue.service');

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
      
        if ($counter->status !== 'Ready') {
            return response()->json(['message' => 'Counter is not ready.'], 409); 
        }

        $nextQueue = Queue::where('status', 'Waiting')
            ->where('customer_type', 'Priority')
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'asc')
            ->first();
            
        // If no priority customer is waiting, get a regular customer
        if (!$nextQueue) {
            $nextQueue = Queue::where('status', 'Waiting')
            ->where('customer_type', 'Regular')
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'asc')
            ->first();
        }

        if (!$nextQueue) {
            return response()->json(['message' => 'No waiting queues available.'], 404); // Not Found
        }
        // Update the queue status and assign it to the counter
        $nextQueue->status = 'Now Serving';
        $nextQueue->save();

        $counter->queue_id = $nextQueue->id;
        $counter->status = 'Busy'; // set status to busy
        $counter->save();

        $counter->load('queue.service');
        return response()->json($counter);
    }
}
