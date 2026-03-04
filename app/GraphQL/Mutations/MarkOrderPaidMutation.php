<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Order;
use App\Services\OrderService;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;

class MarkOrderPaidMutation extends Mutation
{
    public function __construct(private readonly OrderService $orderService) {}

    protected $attributes = [
        'name' => 'markOrderPaid',
        'description' => 'Mark order as paid',
    ];

    public function type(): Type
    {
        return GraphQL::type('Order');
    }

    public function args(): array
    {
        return [
            'order_id' => [
                'name' => 'order_id',
                'type' => Type::nonNull(Type::id()),
                'rules' => ['required', 'exists:orders,id'],
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo)
    {
        $order = Order::query()->findOrFail($args['order_id']);

        return $this->orderService->markPaid($order);
    }
}
