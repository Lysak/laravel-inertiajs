<?php

namespace App\Queries\Orders;

use App\Models\Order;
use App\Support\ReadModelCache;
use Illuminate\Database\Eloquent\Collection;

readonly class GetRecentOrders
{
    public function __construct(private ReadModelCache $readModelCache) {}

    /**
     * @return Collection<int, Order>
     */
    public function handle(int $limit = 25): Collection
    {
        /** @var Collection<int, Order> $orders */
        $orders = $this->readModelCache->remember(
            ['orders'],
            'recent-orders:limit:' . $limit,
            (int) config('read-model-cache.ttls.orders', 30),
            fn (): Collection => Order::query()
                ->with(['user', 'items.drink'])
                ->orderByRaw("CASE WHEN status = 'in_progress' THEN 0 WHEN status = 'new' THEN 1 ELSE 2 END")
                ->latest()
                ->limit($limit)
                ->get(),
        );

        return $orders;
    }
}
