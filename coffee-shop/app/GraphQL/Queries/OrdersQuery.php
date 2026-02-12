<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Order;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class OrdersQuery extends Query
{
    protected $attributes = [
        'name' => 'orders',
        'description' => 'Orders query that can trigger N+1 on nested items/drinks',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Order'));
    }

    public function args(): array
    {
        return [
            'limit' => [
                'type' => Type::int(),
                'defaultValue' => 25,
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): array
    {
        return Order::query()
            ->latest()
            ->limit($args['limit'])
            ->get()
            ->all();
    }
}
