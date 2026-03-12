<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Order;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class OrderType extends GraphQLType
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'Order',
        'description' => 'Customer order',
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
            'status' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'customer_name' => [
                'type' => Type::nonNull(Type::string()),
                'resolve' => static fn (Order $order): string => $order->customer_name ?? $order->user?->name ?? 'Unknown',
            ],
            'customer_email' => [
                'type' => Type::string(),
                'resolve' => static fn (Order $order): ?string => $order->user?->isAnonymousCustomer() === true
                    ? null
                    : $order->user?->email,
            ],
            'created_at' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'updated_at' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'total' => [
                'type' => Type::nonNull(Type::float()),
                'resolve' => static fn (Order $order): float => $order->total,
            ],
            'user' => [
                'type' => GraphQL::type('User'),
            ],
            'items' => [
                'type' => Type::nonNull(Type::listOf(Type::nonNull($this->nullableType('OrderItem')))),
            ],
            'items_count' => [
                'type' => Type::nonNull(Type::int()),
                'resolve' => static fn (Order $order): int => $order->relationLoaded('items')
                    ? (int) $order->items->sum('quantity')
                    : (int) $order->items()->sum('quantity'),
            ],
        ];
    }
}
