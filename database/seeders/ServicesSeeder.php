<?php

namespace Database\Seeders;

use App\Models\Services;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Services::insert([
            [
                'created_at' => now(),
                'updated_at' => now(),
                'name' => 'Burial Assistance',
                'description' => 'Financial assistance for burial expenses to support families in need.',
            ],
            [
                'created_at' => now(),
                'updated_at' => now(),
                'name' => 'Educational Assistance',
                'description' => 'Financial support for educational expenses to help students succeed.',
            ],
            [
                'created_at' => now(),
                'updated_at' => now(),
                'name' => 'Medical Assistance',
                'description' => 'Financial support for medical expenses to help individuals in need.',
            ],
            [
                'created_at' => now(),
                'updated_at' => now(),
                'name' => 'Receiving',
                'description' => 'Documents are submitted to the office for processing.',
            ],
            [
                'created_at' => now(),
                'updated_at' => now(),
                'name' => 'Schedule an Appointment',
                'description' => 'Schedule an appointment for a future service.',
            ],
        ]);
    }
}
