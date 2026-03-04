<?php

namespace App\Queries\Orders;

use App\Models\Order;

readonly class GetOrderDetails
{
    public function __construct(private GetOrderWithDetails $getOrderWithDetails)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function handle(Order $order): array
    {
        $order = $this->getOrderWithDetails->handle($order);

        return [
            'id' => $order->id,
            'status' => $order->status,
            'customer_name' => $order->customer_name ?? $order->user?->name ?? 'Unknown',
            'customer_email' => $order->user?->isAnonymousCustomer() === true
                ? null
                : $order->user?->email,
            'created_at' => $order->created_at?->toDateTimeString(),
            'total' => $order->total,
            'items' => $order->items->map(static fn ($item): array => [
                'id' => $item->id,
                'drink_name' => $item->drink?->name ?? 'Unknown drink',
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'line_total' => $item->line_total,
            ]),
        ];
    }
}
