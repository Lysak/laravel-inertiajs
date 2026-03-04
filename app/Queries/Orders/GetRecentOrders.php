<?php

namespace App\Queries\Orders;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;

class GetRecentOrders
{
    /**
     * @return Collection<int, Order>
     */
    public function handle(int $limit = 25): Collection
    {
        return Order::query()
            ->with(['user', 'items.drink'])
            ->orderByRaw("CASE WHEN status = 'in_progress' THEN 0 WHEN status = 'new' THEN 1 ELSE 2 END")
            ->latest()
            ->limit($limit)
            ->get();
    }
}
