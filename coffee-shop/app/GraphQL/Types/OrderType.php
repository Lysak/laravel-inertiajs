<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use App\Models\Order;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class OrderType extends GraphQLType
{
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
            'created_at' => [
                'type' => Type::string(),
            ],
            'updated_at' => [
                'type' => Type::string(),
            ],
            'total' => [
                'type' => Type::nonNull(Type::float()),
                'resolve' => static fn (Order $order): float => $order->total,
            ],
            'user' => [
                'type' => GraphQL::type('User'),
            ],
            'items' => [
                'type' => Type::listOf(GraphQL::type('OrderItem')),
            ],
        ];
    }
}
