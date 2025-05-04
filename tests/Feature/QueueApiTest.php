<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Queue;
use App\Models\Services; // Assuming you have a Service model
use App\Models\Counters; // Needed for the update logic side effects

class QueueApiTest extends TestCase
{
    use RefreshDatabase; // Resets the database for each test

    /**
     * Test creating a new queue via the API.
     * POST /api/queues
     *
     * @return void
     */
    public function test_can_create_queue_via_api(): void
    {
        // Arrange: Create a prerequisite service
        $service = Services::factory()->create();

        $queueData = [
            'customer_type' => 'Regular',
            'service_id' => $service->id,
        ];

        // Act: Send POST request to the API endpoint
        $response = $this->postJson('/api/queues', $queueData);

        // Assert: Check the response and database
        $response
            ->assertStatus(201) // Check for HTTP 201 Created status
            ->assertJson([ // Check if the response contains the created data (structure)
                'customer_type' => 'Regular',
                'service_id' => $service->id,
                'status' => 'Waiting', // Default status
                // 'queue_number' => 1, // Queue number might be tricky to assert exactly without more context
            ])
            ->assertJsonStructure([ // Ensure expected keys are present
                'id',
                'queue_number',
                'customer_type',
                'service_id',
                'status',
                'created_at',
                'updated_at',
                'service' => ['id', 'name'], // Check nested service structure
            ]);

        // Assert: Check if the queue was actually created in the database
        $this->assertDatabaseHas('queues', [
            'customer_type' => 'Regular',
            'service_id' => $service->id,
            'status' => 'Waiting',
        ]);
    }

    /**
     * Test updating a queue status to 'Now Serving' via the API.
     * PATCH /api/queues/{queue}/serve
     *
     * @return void
     */
    public function test_can_update_queue_status_to_serving_via_api(): void
    {
        // Arrange: Create a service, a queue and a ready counter
        Services::factory()->create(); // Ensure a service exists for the QueueFactory
        $queue = Queue::factory()->create(['status' => 'Waiting']);
        $counter = Counters::factory()->create(['status' => 'ready', 'queue_id' => null]); // Ensure a counter is available

        // Act: Send PATCH request to the specific queue's 'serve' endpoint
        $response = $this->patchJson("/api/queues/{$queue->id}/serve");

        // Assert: Check the response and database state
        $response
            ->assertStatus(200) // Check for HTTP 200 OK status
            ->assertJson([
                'id' => $queue->id,
                'status' => 'Now Serving', // Check if the status was updated in the response
            ]);

        // Assert: Check if the queue status was updated in the database
        $this->assertDatabaseHas('queues', [
            'id' => $queue->id,
            'status' => 'Now Serving',
        ]);

        // Assert: Check if the counter was updated (side effect)
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'status' => 'busy',
            'queue_id' => $queue->id,
        ]);
    }

    /**
     * Test updating a queue status to 'Completed' via the API.
     * PATCH /api/queues/{queue}/complete
     *
     * @return void
     */
    public function test_can_update_queue_status_to_completed_via_api(): void
    {
        // Arrange: Create a service, a counter, and a queue being served
        Services::factory()->create(); // Ensure a service exists for the QueueFactory
        $counter = Counters::factory()->create(['status' => 'busy']);
        $queue = Queue::factory()->create([
            'status' => 'Now Serving',
            // If your Queue model has a counter_id relationship:
            // 'counter_id' => $counter->id,
        ]);
        // Manually link counter if needed by controller logic
        $counter->update(['queue_id' => $queue->id]);


        // Act: Send PATCH request to the specific queue's 'complete' endpoint
        $response = $this->patchJson("/api/queues/{$queue->id}/complete");

        // Assert: Check the response and database state
        $response
            ->assertStatus(200) // Check for HTTP 200 OK status
            ->assertJson([
                'id' => $queue->id,
                'status' => 'Completed', // Check if the status was updated in the response
            ]);

        // Assert: Check if the queue status was updated in the database
        $this->assertDatabaseHas('queues', [
            'id' => $queue->id,
            'status' => 'Completed',
        ]);

        // Assert: Check if the counter was reset (side effect)
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'status' => 'ready', // Should be reset
            'queue_id' => null,   // Should be reset
        ]);
    }

    /**
     * Test listing queues via the API.
     * GET /api/queues
     *
     * @return void
     */
    public function test_can_list_queues_via_api(): void
    {
        // Arrange: Create some services and queues
        Services::factory(2)->create();
        Queue::factory(5)->create();

        // Act: Send GET request
        $response = $this->getJson('/api/queues');

        // Assert
        $response
            ->assertStatus(200)
            ->assertJsonStructure([ // Check pagination structure
                'data' => [
                    '*' => [ // Check structure for each item in 'data'
                        'id',
                        'queue_number',
                        'customer_type',
                        'service_id',
                        'status',
                        'created_at',
                        'updated_at',
                        'service', // Ensure relation is loaded
                        'counter', // Ensure relation is loaded (can be null)
                    ]
                ],
                'links', // Check for links key
                // 'meta', // Temporarily remove meta check
            ])
            ->assertJsonCount(5, 'data'); // Check if 5 queues were returned on the first page
    }

    /**
     * Test getting form data for creating queues.
     * GET /api/queues/form-data
     *
     * @return void
     */
    public function test_can_get_form_data_via_api(): void
    {
        // Arrange: Create some services
        Services::factory(3)->create();

        // Act: Send GET request
        $response = $this->getJson('/api/queues/form-data');

        // Assert
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'services' => [
                    '*' => ['id', 'name']
                ]
            ])
            ->assertJsonCount(3, 'services');
    }

    /**
     * Test getting print data for a specific queue.
     * GET /api/queues/{queue}/print
     *
     * @return void
     */
    public function test_can_get_print_data_for_queue_via_api(): void
    {
        // Arrange: Create a service and a queue
        Services::factory()->create();
        $queue = Queue::factory()->create();

        // Act: Send GET request
        $response = $this->getJson("/api/queues/{$queue->id}/print");

        // Assert
        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $queue->id,
                'queue_number' => $queue->queue_number,
                // Add other expected fields
            ])
            ->assertJsonStructure([ // Ensure expected structure including relations
                'id',
                'queue_number',
                'customer_type',
                'service_id',
                'status',
                'created_at',
                'updated_at',
                'service',
                'counter',
            ]);
    }

    /**
     * Test updating a queue status to 'Waiting' via the API.
     * PATCH /api/queues/{queue}/wait
     *
     * @return void
     */
    public function test_can_update_queue_status_to_waiting_via_api(): void
    {
        // Arrange: Create a service, a counter serving a queue
        Services::factory()->create();
        $counter = Counters::factory()->create(['status' => 'busy']);
        $queue = Queue::factory()->create(['status' => 'Now Serving']);
        $counter->update(['queue_id' => $queue->id]); // Link them

        // Act: Send PATCH request
        $response = $this->patchJson("/api/queues/{$queue->id}/wait");

        // Assert: Check response and database
        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $queue->id,
                'status' => 'Waiting',
            ]);

        $this->assertDatabaseHas('queues', [
            'id' => $queue->id,
            'status' => 'Waiting',
        ]);

        // Assert: Check counter side effect
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'status' => 'ready',
            'queue_id' => null,
        ]);
    }

    /**
     * Test updating a queue status to 'Cancelled' via the API.
     * PATCH /api/queues/{queue}/cancel
     *
     * @return void
     */
    public function test_can_update_queue_status_to_cancelled_via_api(): void
    {
        // Arrange: Create a service, a counter, and a queue (can be waiting or serving)
        Services::factory()->create();
        $counter = Counters::factory()->create(['status' => 'busy']);
        $queue = Queue::factory()->create(['status' => 'Now Serving']);
        $counter->update(['queue_id' => $queue->id]); // Link them

        // Act: Send PATCH request
        $response = $this->patchJson("/api/queues/{$queue->id}/cancel");

        // Assert: Check response and database
        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $queue->id,
                'status' => 'Cancelled',
            ]);

        $this->assertDatabaseHas('queues', [
            'id' => $queue->id,
            'status' => 'Cancelled',
        ]);

        // Assert: Check counter side effect (should also be reset)
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'status' => 'ready',
            'queue_id' => null,
        ]);
    }
}
