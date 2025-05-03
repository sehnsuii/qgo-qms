<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Queue;
use App\Models\Counters;
use App\Models\Services;

class QueueController extends Controller
{
    public function showAll()
    {
        $queues = Queue::with('counter')->orderBy('created_at', 'desc')->paginate(6);
        return view('debug.index', ['queues' => $queues]);
    }

    public function show(Queue $queue)
    {
        $queue->load('counter');
        return response()->json($queue);
    }

    public function create()
    {
        $counters = Counters::all();
        $services = Services::all();
        return view('debug.form', [
            'counters' => $counters,
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'created_at' => 'nullable|date',
            'customer_type' => 'required|in:Regular,Priority',
            'service_id' => 'required|exists:services,id',
        ]);

        $createdAt = isset($validated->created_at) ? Carbon::parse($validated['created_at']) : now();

        $lastQueueToday = Queue::whereDate('created_at', $createdAt->toDateString())
            ->where('customer_type', $validated['customer_type'])
            ->latest()
            ->first();

        $validated['created_at'] = $createdAt;
        $validated['queue_number'] = $lastQueueToday ? $lastQueueToday->queue_number + 1 : 1;

        $validated['status'] = 'Waiting';
        $validated['counter_id'] = null;

        Queue::create($validated);
        return redirect()->route('debug.index')->with('success', 'Queue created successfully.');
    }

    public function setWaiting(Queue $queue)
    {
        $queue->status = 'Waiting';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }

    public function setServing(Queue $queue)
    {
        $queue->status = 'Now Serving';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }

    public function setComplete(Queue $queue)
    {
        $queue->status = 'Completed';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }

    public function setCancelled(Queue $queue)
    {
        $queue->status = 'Cancelled';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' has been Cancelled');
    }
}
