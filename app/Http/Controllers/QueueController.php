<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Queue;

class QueueController extends Controller
{
    public function show(Queue $queue)
    {
        $queue->load('counter');
        // return view('queue.show', ['queue' => $queue,]);
    }
    public function store(Request $request) {}
    public function update(Queue $queue) {}
}
