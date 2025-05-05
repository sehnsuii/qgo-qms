<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('123qwe');
        
        $users = [
            [
            'name' => 'Test User 1',
            'email' => 'a@a.com',
            'email_verified_at' => now(),
            'password' => $password,
            'created_at' => now(),
            'updated_at' => now(),
            ],
            [
            'name' => 'Test User 2',
            'email' => 'b@b.com',
            'email_verified_at' => now(),
            'password' => $password,
            'created_at' => now(),
            'updated_at' => now(),
            ],
            [
            'name' => 'Test User 3',
            'email' => 'c@c.com',
            'email_verified_at' => now(),
            'password' => $password,
            'created_at' => now(),
            'updated_at' => now(),
            ],
            [
            'name' => 'Test User 4',
            'email' => 'd@d.com',
            'email_verified_at' => now(),
            'password' => $password,
            'created_at' => now(),
            'updated_at' => now(),
            ],
            [
            'name' => 'Test User 5',
            'email' => 'e@e.com',
            'email_verified_at' => now(),
            'password' => $password,
            'created_at' => now(),
            'updated_at' => now(),
            ],
            [
            'name' => 'Test User 6',
            'email' => 'f@f.com',
            'email_verified_at' => now(),
            'password' => $password,
            'created_at' => now(),
            'updated_at' => now(),
            ],
        ];
        
        DB::table('users')->insert($users);
    }
}
