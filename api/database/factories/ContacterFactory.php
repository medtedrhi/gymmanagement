<?php

namespace Database\Factories;

use App\Models\Contacter;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContacterFactory extends Factory
{
    protected $model = Contacter::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->safeEmail(),
            'message' => $this->faker->paragraph(),
        ];
    }
}
