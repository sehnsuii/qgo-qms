<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Queue;
use App\Models\Counters;

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
        $customerTypes = ['Priority', 'Regular'];

        return [
            'customer_type' => $this->faker->randomElement($customerTypes),
            // 'service_id' => null,
            'status' => $this->faker->randomElement(['Waiting', 'Served', 'Completed', 'Cancelled']),
            'counter_id' => Counters::inRandomOrder()->first()->id,
        ];
    }
}
