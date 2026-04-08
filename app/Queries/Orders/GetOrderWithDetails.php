<?php

namespace App\Queries\Orders;

use App\Models\Order;
use App\Support\ReadModelCache;

class GetOrderWithDetails
{
    public function __construct(private readonly ReadModelCache $readModelCache) {}

    public function handle(Order $order): Order
    {
        /** @var Order $resolvedOrder */
        $resolvedOrder = $this->readModelCache->remember(
            ['orders'],
            'order-details:' . $order->getKey(),
            (int) config('read-model-cache.ttls.orders', 30),
            fn (): Order => $order->fresh(['user', 'items.drink']) ?? $order->load(['user', 'items.drink']),
        );

        return $resolvedOrder;
    }
}
