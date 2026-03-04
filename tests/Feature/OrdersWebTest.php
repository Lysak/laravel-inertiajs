<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Drink;
use App\Models\User;
use App\Support\CustomerUsers;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrdersWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_barista_can_create_order_for_anonymous_guest(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);
        $category = Category::factory()->create();
        $drink = Drink::factory()->create([
            'category_id' => $category->id,
            'is_available' => true,
            'price' => 4.20,
        ]);

        $response = $this
            ->actingAs($barista)
            ->post(route('orders.store'), [
                'customer_name' => '',
                'items' => [
                    [
                        'drink_id' => $drink->id,
                        'quantity' => 2,
                    ],
                ],
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'user_id' => CustomerUsers::anonymousCustomer()->id,
            'customer_name' => null,
            'status' => 'in_progress',
        ]);

        $this->assertDatabaseHas('order_items', [
            'drink_id' => $drink->id,
            'quantity' => 2,
            'unit_price' => 4.20,
        ]);
    }

    public function test_barista_can_save_optional_customer_name_on_order(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);
        $category = Category::factory()->create();
        $drink = Drink::factory()->create([
            'category_id' => $category->id,
            'is_available' => true,
        ]);

        $response = $this
            ->actingAs($barista)
            ->post(route('orders.store'), [
                'customer_name' => 'Marta',
                'items' => [
                    [
                        'drink_id' => $drink->id,
                        'quantity' => 1,
                    ],
                ],
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'user_id' => CustomerUsers::anonymousCustomer()->id,
            'customer_name' => 'Marta',
            'status' => 'in_progress',
        ]);
    }
}
