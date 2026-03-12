<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Order;
use App\Queries\Orders\GetOrderWithDetails;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class OrderQuery extends Query
{
    use ResolvesGraphQLTypes;

    public function __construct(private readonly GetOrderWithDetails $getOrderWithDetails)
    {
    }

    protected $attributes = [
        'name' => 'order',
        'description' => 'Single order with nested details',
    ];

    public function type(): Type
    {
        return Type::nonNull($this->nullableType('Order'));
    }

    public function args(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
                'rules' => ['required', 'exists:orders,id'],
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): Order
    {
        $order = Order::query()->findOrFail((int) $args['id']);

        return $this->getOrderWithDetails->handle($order);
    }
}
