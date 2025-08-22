<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
{
    User::factory()->count(10)->create();
    \App\Models\Plan::factory()->count(3)->create();
    // \App\Models\Subscription::factory()->count(10)->create();
    \App\Models\Testimonial::factory()->count(5)->create();
    \App\Models\Faq::factory()->count(5)->create();
    \App\Models\Classe::factory()->count(8)->create();
    \App\Models\Contacter::factory()->count(2)->create();
}

}
