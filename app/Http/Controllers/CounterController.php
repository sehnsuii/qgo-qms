<?php

namespace App\Http\Controllers;

use App\Models\Counters;
use Illuminate\Http\JsonResponse;

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
        $counter->load('queue');
        return response()->json($counter);
    }

    /**
     * Set the associated queue status to 'Waiting' and reset the counter.
     * API Endpoint.
     *
     * @param Counters $counter
     * @return JsonResponse
     */
    public function setWaitingApi(Counters $counter): JsonResponse
    {
        $queue = $counter->queue;
        if ($queue) {
            $queue->status = 'Waiting';
            $queue->save();
        }

        $counter->status = 'ready';
        $counter->queue_id = null;
        $counter->save();
        $counter->load('queue');

        return response()->json($counter);
    }

    /**
     * Set the associated queue status to 'Completed' and reset the counter.
     * API Endpoint.
     *
     * @param Counters $counter
     * @return JsonResponse
     */
    public function setCompletedApi(Counters $counter): JsonResponse
    {
        $queue = $counter->queue;
        if ($queue) {
            $queue->status = 'Completed';
            $queue->save();
        }

        $counter->status = 'ready';
        $counter->queue_id = null;
        $counter->save();
        $counter->load('queue');

        return response()->json($counter);
    }

    /**
     * Set the associated queue status to 'Cancelled' and reset the counter.
     * API Endpoint.
     *
     * @param Counters $counter
     * @return JsonResponse
     */
    public function setCancelledApi(Counters $counter): JsonResponse
    {
        $queue = $counter->queue;
        if ($queue) {
            $queue->status = 'Cancelled';
            $queue->save();
        }

        $counter->status = 'ready';
        $counter->queue_id = null;
        $counter->save();
        $counter->load('queue');

        return response()->json($counter);
    }
}
