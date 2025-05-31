<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Queue;
use App\Models\Counters;
use App\Models\Services;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Queue>
 */
class QueueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Queue::class;
    public function definition(): array
    {
        return [
            'queue_number' => $this->faker->unique()->numberBetween(1, 1000),
            'customer_type' => $this->faker->randomElement(['Priority', 'Regular']),
            'service_id' => Services::inRandomOrder()->first()->id,
            'status' => $this->faker->randomElement(['Waiting', 'Now Serving', 'Completed', 'Cancelled']),
        ];
    }
}
