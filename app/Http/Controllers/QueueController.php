<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Queue;
use App\Models\Counters;
use App\Models\Services;

class QueueController extends Controller
{
    public function displayDebug()
    {
        $queues = Queue::with('service')->with('counter')->orderBy('created_at', 'desc')->paginate(6);
        return view('debug.index', ['queues' => $queues]);
    }
    public function printDebug(Queue $queue)
    {
        $queue->load('service');
        $queue->load('counter');
        return view('debug.print', ['queue' => $queue]);
    }
    public function createDebug()
    {
        $counters = Counters::all();
        $services = Services::all();
        return view('debug.form', [
            'counters' => $counters,
            'services' => $services,
        ]);
    }
    public function storeDebug(Request $request)
    {
        $validated = $request->validate([
            'created_at' => 'nullable|date',
            'customer_type' => 'required|in:Regular,Priority',
            'service_id' => 'required|exists:services,id',
        ]);

        $createdAt = isset($validated['created_at']) ? Carbon::parse($validated['created_at']) : now();
        $lastQueueToday = Queue::whereDate('created_at', $createdAt->toDateString())
            ->where('customer_type', $validated['customer_type'])
            ->latest()
            ->first();

        $validated['created_at'] = $createdAt;
        $validated['queue_number'] = $lastQueueToday ? $lastQueueToday->queue_number + 1 : 1;
        $validated['status'] = 'Waiting';

        Queue::create($validated);
        return redirect()->route('queues.display.debug')->with('success', 'Queue created successfully.');
    }
    public function setWaitingDebug(Queue $queue)
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'Ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Waiting';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }
    public function setServingDebug(Queue $queue)
    {
        $counter = Counters::where('status', 'Ready')->first();
        if ($counter) {
            $counter->status = 'Busy';
            $counter->queue_id = $queue->id;
            $counter->save();
        }

        $queue->status = 'Now Serving';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }
    public function setCompletedDebug(Queue $queue)
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'Ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Completed';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }
    public function setCancelledDebug(Queue $queue)
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'Ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Cancelled';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' has been Cancelled');
    }

    // ---------------------------------------------------------------------------------------

    /**
     * Display a paginated list of queues with relations.
     * API Endpoint for dashboard.
     *
     * @return JsonResponse
     */
    public function indexApi(Request $request): JsonResponse
    {
        $query = Queue::with('service', 'counter')->orderBy('created_at', 'desc');
        if ($request->has('status')) {
            $statuses = explode(',', $request->query('status'));
            if (!empty($statuses)) {
                $query->whereIn('status', $statuses);
            }
        }
        $queues = $query->paginate(15);
        return response()->json($queues);
    }

    /**
     * Get data for printing a specific queue.
     * API Endpoint.
     *
     * @param Queue $queue
     * @return JsonResponse
     */
    public function printApi(Queue $queue): JsonResponse
    {
        $queue->load('service', 'counter');
        return response()->json($queue);
    }

    /**
     * Get data needed to populate the queue creation form.
     * API Endpoint.
     *
     * @return JsonResponse
     */
    public function createApi(): JsonResponse
    {
        // Provides data needed for the creation form (e.g., dropdown options)
        // $counters = Counters::all(); // Only include if needed for the form
        $services = Services::select('id', 'name')->get();
        return response()->json([
            // 'counters' => $counters, // Uncomment if counters are needed for selection
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created queue in storage.
     * API Endpoint.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeApi(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_type' => 'required|in:Regular,Priority',
            'service_id' => 'required|exists:services,id',
        ]);

        $createdAt = now();
        $lastQueueToday = Queue::whereDate('created_at', $createdAt->toDateString())
            ->where('customer_type', $validated['customer_type'])
            ->orderBy('queue_number', 'desc')
            ->first();

        $validated['created_at'] = $createdAt;
        $validated['queue_number'] = $lastQueueToday ? $lastQueueToday->queue_number + 1 : 1;
        $validated['status'] = 'Waiting';

        $queue = Queue::create($validated);
        $queue->load('service');

        return response()->json($queue, 201);
    }

    /**
     * Update the specified queue's status to 'Waiting'.
     * API Endpoint.
     *
     * @param Queue $queue
     * @return JsonResponse
     */
    public function setWaitingApi(Queue $queue): JsonResponse
    {
        // Logic to potentially detach from counter
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'Ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Waiting';
        $queue->save();
        $queue->load('service', 'counter');

        return response()->json($queue);
    }

    /**
     * Update the specified queue's status to 'Now Serving'.
     * API Endpoint.
     *
     * @param Queue $queue
     * @return JsonResponse
     */
    public function setServingApi(Queue $queue): JsonResponse
    {
        $counter = Counters::where('status', 'Ready')->first();
        if ($counter) {
            $counter->status = 'Busy';
            $counter->queue_id = $queue->id;
            $counter->save();
        } else {
            return response()->json(['error' => 'No available counters'], 409);
        }

        $queue->status = 'Now Serving';
        $queue->save();
        $queue->load('service', 'counter');

        return response()->json($queue);
    }

    /**
     * Update the specified queue's status to 'Completed'.
     * API Endpoint.
     *
     * @param Queue $queue
     * @return JsonResponse
     */
    public function setCompletedApi(Queue $queue): JsonResponse
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'Ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Completed';
        $queue->save();
        $queue->load('service', 'counter');

        return response()->json($queue);
    }

    /**
     * Update the specified queue's status to 'Cancelled'.
     * API Endpoint.
     *
     * @param Queue $queue
     * @return JsonResponse
     */
    public function setCancelledApi(Queue $queue): JsonResponse
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'Ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Cancelled';
        $queue->save();
        $queue->load('service', 'counter');

        return response()->json($queue);
    }
}
