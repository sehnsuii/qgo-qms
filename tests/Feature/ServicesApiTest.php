<?php

namespace Tests\Feature;

use App\Models\Services;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ServicesApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test if the API can return a list of services ordered by name.
     *
     * @return void
     */
    public function test_can_get_services_list(): void
    {
        // Arrange: Create some services in a specific order to test sorting
        $serviceC = Services::factory()->create(['name' => 'Service C']);
        $serviceA = Services::factory()->create(['name' => 'Service A']);
        $serviceB = Services::factory()->create(['name' => 'Service B']);

        // Act: Make a GET request to the services API endpoint
        $response = $this->getJson('/api/services');

        // Assert: Check the response
        $response
            ->assertStatus(200) // Check for successful response
            ->assertJsonStructure([ // Check the basic JSON structure
                'services' => [
                    '*' => ['id', 'name'] // Each item in 'services' should have 'id' and 'name'
                ]
            ])
            ->assertJsonCount(3, 'services') // Check if all 3 services were returned
            ->assertJsonPath('services.0.name', $serviceA->name) // Check if the first service is 'Service A' (ordered)
            ->assertJsonPath('services.1.name', $serviceB->name) // Check if the second service is 'Service B'
            ->assertJsonPath('services.2.name', $serviceC->name); // Check if the third service is 'Service C'
    }
}
