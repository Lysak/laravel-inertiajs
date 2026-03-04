<?php

namespace App\Queries\Orders;

use App\Models\Order;

class GetOrderWithDetails
{
    public function handle(Order $order): Order
    {
        return $order->load(['user', 'items.drink']);
    }
}
