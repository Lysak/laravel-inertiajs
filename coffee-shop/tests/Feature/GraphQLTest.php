<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Support\CustomerUsers;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GraphQLTest extends TestCase
{
    use RefreshDatabase;

    public function test_graphql_endpoint_requires_authentication(): void
    {
        $response = $this->postJson('/graphql', [
            'query' => '
                query {
                    dashboardStats {
                        orders
                    }
                }
            ',
        ]);

        $response->assertUnauthorized();
    }

    public function test_graphql_endpoint_accepts_session_authenticated_user_after_login(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect(route('dashboard', absolute: false));

        $response = $this->postJson('/graphql', [
            'query' => '
                query {
                    dashboardStats {
                        orders
                    }
                }
            ',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.dashboardStats.orders', 0);
    }

    public function test_dashboard_stats_query_returns_aggregate_data(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $drink = Drink::factory()->create(['price' => 4.25]);
        $order = Order::factory()->create(['user_id' => $user->id, 'status' => 'paid']);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'drink_id' => $drink->id,
            'quantity' => 2,
            'unit_price' => 4.25,
        ]);

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
                'query' => '
                    query {
                        dashboardStats {
                            orders
                            drinks
                            customers
                            revenue
                        }
                    }
                ',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.dashboardStats.orders', 1)
            ->assertJsonPath('data.dashboardStats.drinks', 1)
            ->assertJsonPath('data.dashboardStats.customers', 1)
            ->assertJsonPath('data.dashboardStats.revenue', 8.5);
    }

    public function test_order_query_returns_detail_payload(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $category = Category::factory()->create();
        $drink = Drink::factory()->create(['category_id' => $category->id, 'name' => 'Cappuccino']);
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'customer_name' => 'Marta',
            'status' => 'in_progress',
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'drink_id' => $drink->id,
            'quantity' => 2,
            'unit_price' => 5.10,
        ]);

        $response = $this
            ->actingAs($customer)
            ->postJson('/graphql', [
                'query' => '
                    query OrderQuery($id: ID!) {
                        order(id: $id) {
                            id
                            customer_name
                            customer_email
                            status
                            total
                            items {
                                id
                                drink_name
                                quantity
                                unit_price
                                line_total
                            }
                        }
                    }
                ',
                'variables' => [
                    'id' => $order->id,
                ],
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.order.id', (string) $order->id)
            ->assertJsonPath('data.order.customer_name', 'Marta')
            ->assertJsonPath('data.order.customer_email', $customer->email)
            ->assertJsonPath('data.order.items.0.drink_name', 'Cappuccino')
            ->assertJsonPath('data.order.items.0.line_total', 10.2);
    }

    public function test_order_create_data_query_returns_anonymous_customer_and_available_categories(): void
    {
        $user = User::factory()->create();
        $seasonal = Category::factory()->create(['name' => 'Seasonal']);
        $hidden = Category::factory()->create(['name' => 'Hidden']);
        Drink::factory()->create([
            'category_id' => $seasonal->id,
            'name' => 'Orange Tonic',
            'is_available' => true,
        ]);
        Drink::factory()->create([
            'category_id' => $hidden->id,
            'name' => 'Unavailable Drink',
            'is_available' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
                'query' => '
                    query {
                        orderCreateData {
                            anonymous_customer {
                                id
                                name
                            }
                            categories {
                                id
                                name
                                drinks {
                                    id
                                    name
                                    price
                                }
                            }
                        }
                    }
                ',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.orderCreateData.anonymous_customer.name',
                CustomerUsers::ANONYMOUS_NAME,
            )
            ->assertJsonCount(1, 'data.orderCreateData.categories')
            ->assertJsonPath('data.orderCreateData.categories.0.name', 'Seasonal')
            ->assertJsonPath('data.orderCreateData.categories.0.drinks.0.name', 'Orange Tonic');
    }

    public function test_orders_optimized_query_returns_nested_data(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $category = Category::factory()->create();
        $drink = Drink::factory()->create(['category_id' => $category->id]);
        $order = Order::factory()->create(['user_id' => $customer->id, 'status' => 'in_progress']);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'drink_id' => $drink->id,
            'quantity' => 2,
            'unit_price' => $drink->price,
        ]);

        $response = $this
            ->actingAs($customer)
            ->postJson('/graphql', [
                'query' => '
                    query {
                        ordersOptimized(limit: 5) {
                            id
                            status
                            total
                            customer_name
                            items_count
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
            ->assertJsonPath('data.ordersOptimized.0.customer_name', $customer->name)
            ->assertJsonPath('data.ordersOptimized.0.items_count', 2)
            ->assertJsonPath('data.ordersOptimized.0.items.0.quantity', 2)
            ->assertJsonPath('data.ordersOptimized.0.user.id', (string) $customer->id);
    }

    public function test_create_order_mutation_creates_order_and_items(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $drink = Drink::factory()->create(['is_available' => true]);

        $response = $this
            ->actingAs($customer)
            ->postJson('/graphql', [
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
            ->assertJsonPath('data.createOrder.status', 'in_progress')
            ->assertJsonPath('data.createOrder.items.0.quantity', 3)
            ->assertJsonPath('data.createOrder.items.0.drink.id', (string) $drink->id);

        $this->assertDatabaseHas('orders', [
            'user_id' => $customer->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_mark_order_paid_mutation_marks_in_progress_order_as_paid(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'in_progress',
        ]);

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
                'query' => '
                    mutation MarkOrderPaid($orderId: ID!) {
                        markOrderPaid(order_id: $orderId) {
                            id
                            status
                        }
                    }
                ',
                'variables' => [
                    'orderId' => $order->id,
                ],
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.markOrderPaid.id', (string) $order->id)
            ->assertJsonPath('data.markOrderPaid.status', 'paid');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'paid',
        ]);
    }

    public function test_mark_order_paid_mutation_leaves_paid_order_paid(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'paid',
        ]);

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
                'query' => '
                    mutation MarkOrderPaid($orderId: ID!) {
                        markOrderPaid(order_id: $orderId) {
                            id
                            status
                        }
                    }
                ',
                'variables' => [
                    'orderId' => $order->id,
                ],
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.markOrderPaid.id', (string) $order->id)
            ->assertJsonPath('data.markOrderPaid.status', 'paid');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'paid',
        ]);
    }

    public function test_create_drink_mutation_creates_catalog_item(): void
    {
        $category = Category::factory()->create(['name' => 'Seasonal']);
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
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

    public function test_categories_query_returns_categories_ordered_by_name(): void
    {
        $user = User::factory()->create();

        Category::factory()->create(['name' => 'Seasonal']);
        Category::factory()->create(['name' => 'Classics']);

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
                'query' => '
                    query {
                        categories {
                            id
                            name
                        }
                    }
                ',
            ]);

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data.categories')
            ->assertJsonPath('data.categories.0.name', 'Classics')
            ->assertJsonPath('data.categories.1.name', 'Seasonal');
    }

    public function test_drinks_query_supports_filtering_sorting_and_requested_fields(): void
    {
        $user = User::factory()->create();
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

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
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

    public function test_drinks_query_returns_all_items_when_limit_is_omitted(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        foreach (range(1, 26) as $index) {
            Drink::query()->create([
                'category_id' => $category->id,
                'name' => "Catalog Drink {$index}",
                'price' => 3.50 + ($index / 100),
                'is_available' => true,
            ]);
        }

        $response = $this
            ->actingAs($user)
            ->postJson('/graphql', [
                'query' => '
                    query {
                        drinks {
                            id
                        }
                    }
                ',
            ]);

        $response
            ->assertOk()
            ->assertJsonCount(26, 'data.drinks');
    }
}
