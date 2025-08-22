<?php

namespace Database\Factories;

use App\Models\Subscription;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionFactory extends Factory
{
    protected $model = Subscription::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'plan_id' => $this->faker->randomElement([1, 2, 3]),
            'start_date' => now(),
            'end_date' => now()->addMonth(),
            'status' => $this->faker->randomElement(['active', 'expired', 'cancelled']),
        ];
    }
}
