<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GraphQLTest extends TestCase
{
    use RefreshDatabase;

    public function test_orders_optimized_query_returns_nested_data(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $category = Category::factory()->create();
        $drink = Drink::factory()->create(['category_id' => $category->id]);
        $order = Order::factory()->create(['user_id' => $customer->id, 'status' => 'new']);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'drink_id' => $drink->id,
            'quantity' => 2,
            'unit_price' => $drink->price,
        ]);

        $response = $this->postJson('/graphql', [
            'query' => '
                query {
                    ordersOptimized(limit: 5) {
                        id
                        status
                        total
                        user { id name }
                        items {
                            id
                            quantity
                            drink { id name }
                        }
                    }
                }
            ',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.ordersOptimized.0.id', (string) $order->id)
            ->assertJsonPath('data.ordersOptimized.0.items.0.quantity', 2)
            ->assertJsonPath('data.ordersOptimized.0.user.id', (string) $customer->id);
    }

    public function test_create_order_mutation_creates_order_and_items(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $drink = Drink::factory()->create(['is_available' => true]);

        $response = $this->postJson('/graphql', [
            'query' => '
                mutation CreateOrder($input: CreateOrderInput!) {
                    createOrder(input: $input) {
                        id
                        status
                        items {
                            quantity
                            drink { id }
                        }
                    }
                }
            ',
            'variables' => [
                'input' => [
                    'user_id' => $customer->id,
                    'items' => [
                        [
                            'drink_id' => $drink->id,
                            'quantity' => 3,
                        ],
                    ],
                ],
            ],
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.createOrder.status', 'new')
            ->assertJsonPath('data.createOrder.items.0.quantity', 3)
            ->assertJsonPath('data.createOrder.items.0.drink.id', (string) $drink->id);

        $this->assertDatabaseHas('orders', [
            'user_id' => $customer->id,
            'status' => 'new',
        ]);
    }
}
