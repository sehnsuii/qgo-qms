<?php

namespace App\Http\Controllers;

use App\Models\Counters;
use Illuminate\Http\Request;

class CounterController extends Controller
{
    public function display()
    {
        $counters = Counters::with('queue')->orderBy('id', 'asc')->get();
        return view('debug.display', ['counters' => $counters]);
    }

    public function counter(Counters $counter)
    {
        $counter->load('queue');
        return view('debug.counter', ['counter' => $counter]);
    }

    public function setWaiting(Counters $counter)
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

    public function setCompleted(Counters $counter)
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

    public function setCancelled(Counters $counter)
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
}
