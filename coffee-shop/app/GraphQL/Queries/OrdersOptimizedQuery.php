<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Order;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class OrdersOptimizedQuery extends Query
{
    protected $attributes = [
        'name' => 'ordersOptimized',
        'description' => 'Orders query with eager loading to avoid N+1',
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
            ->with(['user', 'items.drink'])
            ->latest()
            ->limit($args['limit'])
            ->get()
            ->all();
    }
}
