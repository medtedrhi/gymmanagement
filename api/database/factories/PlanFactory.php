<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->word() . ' Plan',
            'price' => $this->faker->randomFloat(2, 10, 100),
            'duration' => $this->faker->randomElement([1, 3, 6]),
            'description' => $this->faker->sentence(),
            'is_recommended' => $this->faker->boolean(),
        ];
    }
}
