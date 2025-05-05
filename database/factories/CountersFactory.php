<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Counters>
 */
class CountersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => 'NotReady', // Default status for a counter when created/assigned
            'queue_id' => null,  // Default to no queue assigned
            'user_id' => null,   // Default to no user assigned
        ];
    }
}
