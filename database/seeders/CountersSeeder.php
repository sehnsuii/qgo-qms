<?php

namespace Database\Seeders;

use App\Models\Counters;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Counters::factory()->count(6)->create();
    }
}
