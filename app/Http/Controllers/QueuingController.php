<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateQueuingRequest;
use App\Models\Counter;
use App\Models\Queuing;
use Illuminate\Http\Request;

class QueuingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Queuing::with('counter')->counter()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateQueuingRequest $request)
    {
        $queue = Queuing::create($request->validated());
        $queue->update(['queue_no' => 'Q-' . $queue->id]);
        $availableCounter = Counter::where(['is_available' => 1, 'is_open' => 1])->first();
        if ($availableCounter) {
            $queue->update([
                'counter_id' => $availableCounter->id,
                'status' => 'Now Serving'
            ]);
            $availableCounter->update(['is_available' => 0]);
        }
        return $queue->fresh();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
