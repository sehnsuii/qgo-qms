<?php

namespace Database\Seeders;

use App\Models\Counter;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        User::factory()->count(5)->create()->each(function ($user) {
            Counter::factory()->create([
                'user_id' => $user->id,
                'name' => 'Çounter ' . $user->id
            ]);
        });
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'newadmin@example.com',
        // ]);
    }
}
