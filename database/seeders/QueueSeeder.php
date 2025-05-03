<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Models\Queue;

class QueueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $totalQueues = 50;
        $queuesCreated = 0;
        $currentDate = Carbon::today();

        while ($queuesCreated < $totalQueues) {
            $queuesToday = rand(1, min(10, $totalQueues - $queuesCreated));
            for ($i = 1; $i <= $queuesToday; $i++) {
                Queue::factory()->create([
                    'queue_number' => $i,
                    'created_at' => $currentDate->copy(),
                    'updated_at' => $currentDate->copy(),
                ]);
            }

            $queuesCreated += $queuesToday;
            $currentDate->addDay();
        }
    }
}
