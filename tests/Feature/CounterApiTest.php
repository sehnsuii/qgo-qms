<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Counters;
use App\Models\Queue;
use App\Models\Services;

class CounterApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test listing counters via the API.
     * GET /api/counters
     *
     * @return void
     */
    public function test_can_list_counters_via_api(): void
    {
        // Arrange: Create some counters
        Counters::factory(3)->create();

        // Act: Send GET request
        $response = $this->getJson('/api/counters');

        // Assert
        $response
            ->assertStatus(200)
            ->assertJsonStructure([ // Expecting a simple array of counters
                '*' => [
                    'id',
                    'status',
                    'queue_id', // Can be null
                    'created_at',
                    'updated_at',
                    'queue', // Relation can be null
                ]
            ])
            ->assertJsonCount(3); // Check if 3 counters were returned
    }

    /**
     * Test showing a specific counter via the API.
     * GET /api/counters/{counter}
     *
     * @return void
     */
    public function test_can_show_counter_via_api(): void
    {
        // Arrange: Create a counter, optionally with a queue
        Services::factory()->create(); // Needed for QueueFactory
        $queue = Queue::factory()->create();
        $counter = Counters::factory()->create(['queue_id' => $queue->id]);

        // Act: Send GET request
        $response = $this->getJson("/api/counters/{$counter->id}");

        // Assert
        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $counter->id,
                'queue_id' => $queue->id,
            ])
            ->assertJsonStructure([
                'id',
                'status',
                'queue_id',
                'created_at',
                'updated_at',
                'queue' => [ // Expect queue details
                    'id',
                    'queue_number',
                    // Add other queue fields if needed
                ],
            ]);
    }

    /**
     * Test setting associated queue to 'Waiting' via counter API.
     * PATCH /api/counters/{counter}/wait
     *
     * @return void
     */
    public function test_can_set_queue_waiting_via_counter_api(): void
    {
        // Arrange: Create a service, queue, and a counter linked to the queue
        Services::factory()->create();
        $queue = Queue::factory()->create(['status' => 'Now Serving']); // Or any status other than Waiting
        $counter = Counters::factory()->create(['status' => 'Busy', 'queue_id' => $queue->id]);

        // Act: Send PATCH request
        $response = $this->patchJson("/api/counters/{$counter->id}/wait");

        // Assert: Check response (updated counter)
        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $counter->id,
                'status' => 'Ready', // Counter should be ready
                'queue_id' => null,   // Counter should be unlinked
            ]);

        // Assert: Check database state
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'status' => 'Ready',
            'queue_id' => null,
        ]);
        $this->assertDatabaseHas('queues', [ // Check side effect on queue
            'id' => $queue->id,
            'status' => 'Waiting',
        ]);
    }

    /**
     * Test setting associated queue to 'Completed' via counter API.
     * PATCH /api/counters/{counter}/complete
     *
     * @return void
     */
    public function test_can_set_queue_completed_via_counter_api(): void
    {
        // Arrange: Create a service, queue, and a counter linked to the queue
        Services::factory()->create();
        $queue = Queue::factory()->create(['status' => 'Now Serving']); // Or any status other than Completed
        $counter = Counters::factory()->create(['status' => 'Busy', 'queue_id' => $queue->id]);

        // Act: Send PATCH request
        $response = $this->patchJson("/api/counters/{$counter->id}/complete");

        // Assert: Check response (updated counter)
        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $counter->id,
                'status' => 'Ready', // Counter should be ready
                'queue_id' => null,   // Counter should be unlinked
            ]);

        // Assert: Check database state
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'status' => 'Ready',
            'queue_id' => null,
        ]);
        $this->assertDatabaseHas('queues', [ // Check side effect on queue
            'id' => $queue->id,
            'status' => 'Completed',
        ]);
    }

    /**
     * Test setting associated queue to 'Cancelled' via counter API.
     * PATCH /api/counters/{counter}/cancel
     *
     * @return void
     */
    public function test_can_set_queue_cancelled_via_counter_api(): void
    {
        // Arrange: Create a service, queue, and a counter linked to the queue
        Services::factory()->create();
        $queue = Queue::factory()->create(['status' => 'Now Serving']); // Or any status other than Cancelled
        $counter = Counters::factory()->create(['status' => 'Busy', 'queue_id' => $queue->id]);

        // Act: Send PATCH request
        $response = $this->patchJson("/api/counters/{$counter->id}/cancel");

        // Assert: Check response (updated counter)
        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $counter->id,
                'status' => 'Ready', // Counter should be ready
                'queue_id' => null,   // Counter should be unlinked
            ]);

        // Assert: Check database state
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'status' => 'Ready',
            'queue_id' => null,
        ]);
        $this->assertDatabaseHas('queues', [ // Check side effect on queue
            'id' => $queue->id,
            'status' => 'Cancelled',
        ]);
    }
}
