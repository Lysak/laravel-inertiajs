<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Drink>
 */
class DrinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => fake()->unique()->randomElement([
                'Espresso',
                'Cappuccino',
                'Latte',
                'Flat White',
                'Americano',
                'Matcha',
                'Lemonade',
            ]),
            'price' => fake()->randomFloat(2, 2.5, 8.5),
            'is_available' => fake()->boolean(85),
        ];
    }
}
