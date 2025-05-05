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
        $totalQueues = 0;
        $queuesCreated = 0;
        $currentDate = Carbon::today();

        while ($queuesCreated < $totalQueues) {
            $queuesToday = rand(1, min(10, $totalQueues - $queuesCreated));
            for ($i = 1; $i <= $queuesToday; $i++) {
                $randomHour = rand(8, 17);
                $randomMinute = rand(0, 59);
                $randomSecond = rand(0, 59);
                
                $randomTime = $currentDate->copy()->setTime($randomHour, $randomMinute, $randomSecond);
                
                Queue::factory()->create([
                    'queue_number' => $i,
                    'created_at' => $randomTime,
                    'updated_at' => $randomTime,
                ]);
            }

            $queuesCreated += $queuesToday;
            $currentDate->addDay();
        }
    }
}
