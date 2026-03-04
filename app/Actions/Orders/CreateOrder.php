<?php

namespace App\Actions\Orders;

use App\Models\Order;
use App\Services\OrderService;
use App\Support\CustomerUsers;

readonly class CreateOrder
{
    public function __construct(
        private OrderService $orderService,
    ) {}

    /**
     * @param  array<int, array{drink_id:int, quantity:int}>  $items
     */
    public function handle(?string $customerName, array $items): Order
    {
        $customer = CustomerUsers::anonymousCustomer();

        return $this->orderService->createOrder(
            $customer,
            $items,
            $customerName !== null && $customerName !== '' ? $customerName : null,
        );
    }
}
