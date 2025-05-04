<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Queue;
use App\Models\Counters;
use App\Models\Services;

class QueueController extends Controller
{
    public function display()
    {
        $queues = Queue::with('service')->with('counter')->orderBy('created_at', 'desc')->paginate(6);
        return view('debug.index', ['queues' => $queues]);
    }

    public function print(Queue $queue)
    {
        $queue->load('service');
        $queue->load('counter');
        return view('debug.print', ['queue' => $queue]);
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

        Queue::create($validated);
        return redirect()->route('queues.display')->with('success', 'Queue created successfully.');
    }

    public function setWaiting(Queue $queue)
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Waiting';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }

    public function setServing(Queue $queue)
    {
        $counter = Counters::where('status', 'ready')->first();
        if ($counter) {
            $counter->status = 'busy';
            $counter->queue_id = $queue->id;
            $counter->save();
        }

        $queue->status = 'Now Serving';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }

    public function setComplete(Queue $queue)
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Completed';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' is ' . $queue->status);
    }

    public function setCancelled(Queue $queue)
    {
        $counter = Counters::where('queue_id', $queue->id)->first();
        if ($counter) {
            $counter->status = 'ready';
            $counter->queue_id = null;
            $counter->save();
        }

        $queue->status = 'Cancelled';
        $queue->save();
        return back()->with('success', 'Q-' . $queue->queue_number . ' has been Cancelled');
    }
}
