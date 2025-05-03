<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Queue;

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

    public function store(Request $request)
    {
        $queue = new Queue();
        $queue->customer_id = $request->input('customer_id');
        $queue->service_id = $request->input('service_id');
        $queue->counter_id = $request->input('counter_id');
        $queue->status = 'waiting';
        $queue->save();

        return response()->json($queue);
    }

    public function update(Queue $queue)
    {
        if ($queue->status === 'waiting') {
            $queue->status = 'serving';
        } else {
            $queue->status = 'completed';
        }
        $queue->save();
        return response()->json($queue);
    }
}
