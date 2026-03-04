<?php

namespace Database\Factories;

use App\Models\Drink;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 2.5, 8.5);

        return [
            'order_id' => Order::factory(),
            'drink_id' => Drink::factory(),
            'quantity' => fake()->numberBetween(1, 4),
            'unit_price' => $price,
        ];
    }
}
