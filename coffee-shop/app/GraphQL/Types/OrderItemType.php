<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use App\Models\OrderItem;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class OrderItemType extends GraphQLType
{
    protected $attributes = [
        'name' => 'OrderItem',
        'description' => 'Single line item within order',
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
            'quantity' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'unit_price' => [
                'type' => Type::nonNull(Type::float()),
            ],
            'drink_name' => [
                'type' => Type::nonNull(Type::string()),
                'resolve' => static fn (OrderItem $item): string => $item->drink?->name ?? 'Unknown drink',
            ],
            'line_total' => [
                'type' => Type::nonNull(Type::float()),
                'resolve' => static fn (OrderItem $item): float => $item->line_total,
            ],
            'drink' => [
                'type' => GraphQL::type('Drink'),
            ],
        ];
    }
}
