<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Queries\Orders\GetRecentOrders;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class OrdersOptimizedQuery extends Query
{
    use ResolvesGraphQLTypes;

    public function __construct(private readonly GetRecentOrders $getRecentOrders)
    {
    }

    protected $attributes = [
        'name' => 'ordersOptimized',
        'description' => 'Orders query with eager loading to avoid N+1',
    ];

    public function type(): Type
    {
        return Type::listOf($this->nullableType('Order'));
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
        // TODO: use field-aware loading if GraphQL starts needing different relation graphs per query.
        return $this->getRecentOrders->handle($args['limit'])->all();
    }
}
