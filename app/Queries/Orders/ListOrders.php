<?php

namespace App\Queries\Orders;

use App\Models\Order;
use Illuminate\Support\Collection;

readonly class ListOrders
{
    public function __construct(private GetRecentOrders $getRecentOrders)
    {
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(int $limit = 25): Collection
    {
        return $this->getRecentOrders
            ->handle($limit)
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'status' => $order->status,
                'customer_name' => $order->customer_name ?? $order->user?->name ?? 'Unknown',
                'items_count' => $order->items->sum('quantity'),
                'total' => $order->total,
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);
    }
}
