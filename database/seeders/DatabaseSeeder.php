<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Support\CustomerUsers;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);

        User::factory()->create([
            'name' => 'Barista User',
            'email' => 'barista@example.com',
            'role' => 'barista',
            'password' => Hash::make('password'),
        ]);

        CustomerUsers::anonymousCustomer();

        $customers = User::factory(8)->create();
        $customers->prepend($admin);

        $catalog = [
            'Coffee' => [
                ['name' => 'Espresso', 'price' => 2.80],
                ['name' => 'Americano', 'price' => 3.20],
                ['name' => 'Cappuccino', 'price' => 4.20],
                ['name' => 'Flat White', 'price' => 4.50],
            ],
            'Tea' => [
                ['name' => 'Matcha Latte', 'price' => 4.90],
                ['name' => 'English Breakfast', 'price' => 3.10],
            ],
            'Cold Drinks' => [
                ['name' => 'Iced Latte', 'price' => 4.60],
                ['name' => 'Lemonade', 'price' => 3.40],
            ],
        ];

        foreach ($catalog as $categoryName => $drinks) {
            $category = Category::query()->create(['name' => $categoryName]);

            foreach ($drinks as $drink) {
                Drink::query()->create([
                    'category_id' => $category->id,
                    'name' => $drink['name'],
                    'price' => $drink['price'],
                    'is_available' => true,
                ]);
            }
        }

        $allDrinks = Drink::query()->get();
        foreach ($customers as $customer) {
            $ordersCount = fake()->numberBetween(1, 3);

            for ($i = 0; $i < $ordersCount; $i++) {
                $order = Order::query()->create([
                    'user_id' => $customer->id,
                    'status' => fake()->randomElement(['in_progress', 'paid', 'completed']),
                    'created_at' => now()->subDays(fake()->numberBetween(0, 14)),
                    'updated_at' => now(),
                ]);

                $picked = $allDrinks->random(fake()->numberBetween(1, 3));
                foreach ($picked as $drink) {
                    OrderItem::query()->create([
                        'order_id' => $order->id,
                        'drink_id' => $drink->id,
                        'quantity' => fake()->numberBetween(1, 3),
                        'unit_price' => $drink->price,
                    ]);
                }
            }
        }
    }
}
