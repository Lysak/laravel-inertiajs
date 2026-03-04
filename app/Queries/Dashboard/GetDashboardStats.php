<?php

declare(strict_types=1);

namespace App\Queries\Dashboard;

use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

class GetDashboardStats
{
    /**
     * @return array{orders:int, drinks:int, customers:int, revenue:float}
     */
    public function handle(): array
    {
        return [
            'orders' => Order::query()->count(),
            'drinks' => Drink::query()->count(),
            'customers' => User::query()->where('role', 'customer')->count(),
            'revenue' => (float) OrderItem::query()
                ->selectRaw('COALESCE(SUM(quantity * unit_price), 0) as revenue')
                ->value('revenue'),
        ];
    }
}
