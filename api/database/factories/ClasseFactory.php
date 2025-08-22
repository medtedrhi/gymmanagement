<?php

namespace Database\Factories;

use App\Models\Classe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClasseFactory extends Factory
{
    protected $model = Classe::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'class_time' => $this->faker->time('H:i:s'),
            'class_date' => $this->faker->date(),
            'trainer_id' => User::factory(),
            'participants_count' => $this->faker->numberBetween(1, 20),
        ];
    }
}

