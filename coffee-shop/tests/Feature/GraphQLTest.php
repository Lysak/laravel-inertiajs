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

    public function test_create_drink_mutation_creates_catalog_item(): void
    {
        $category = Category::factory()->create(['name' => 'Seasonal']);

        $response = $this->postJson('/graphql', [
            'query' => '
                mutation CreateDrink($input: CreateDrinkInput!) {
                    createDrink(input: $input) {
                        id
                        name
                        price
                        is_available
                        category {
                            id
                            name
                        }
                    }
                }
            ',
            'variables' => [
                'input' => [
                    'category_id' => $category->id,
                    'name' => 'Orange Tonic',
                    'price' => 4.75,
                    'is_available' => true,
                ],
            ],
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.createDrink.name', 'Orange Tonic')
            ->assertJsonPath('data.createDrink.category.name', 'Seasonal')
            ->assertJsonPath('data.createDrink.is_available', true);

        $this->assertDatabaseHas('drinks', [
            'category_id' => $category->id,
            'name' => 'Orange Tonic',
        ]);
    }

    public function test_drinks_query_supports_filtering_sorting_and_requested_fields(): void
    {
        $seasonal = Category::factory()->create(['name' => 'Seasonal']);
        $classics = Category::factory()->create(['name' => 'Classics']);

        Drink::factory()->create([
            'category_id' => $seasonal->id,
            'name' => 'Orange Tonic',
            'price' => 4.75,
            'is_available' => true,
        ]);
        Drink::factory()->create([
            'category_id' => $seasonal->id,
            'name' => 'Cherry Soda',
            'price' => 3.20,
            'is_available' => true,
        ]);
        Drink::factory()->create([
            'category_id' => $classics->id,
            'name' => 'Espresso',
            'price' => 2.80,
            'is_available' => false,
        ]);

        $response = $this->postJson('/graphql', [
            'query' => '
                query FilteredDrinks($categoryId: ID!) {
                    drinks(
                        category_id: $categoryId
                        search: "tonic"
                        is_available: true
                        min_price: 4
                        sort_by: "price"
                        sort_direction: "desc"
                    ) {
                        id
                        name
                        price
                        category {
                            name
                        }
                    }
                }
            ',
            'variables' => [
                'categoryId' => $seasonal->id,
            ],
        ]);

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data.drinks')
            ->assertJsonPath('data.drinks.0.name', 'Orange Tonic')
            ->assertJsonPath('data.drinks.0.category.name', 'Seasonal');
    }
}
