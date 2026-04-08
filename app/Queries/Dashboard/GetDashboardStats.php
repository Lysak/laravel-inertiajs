<?php

declare(strict_types=1);

namespace App\Queries\Dashboard;

use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

class GetDashboardStats
{
    public function __construct(private readonly DashboardStatsCache $dashboardStatsCache)
    {
    }

    /**
     * @return array{orders:int, drinks:int, customers:int, revenue:float}
     */
    public function handle(): array
    {
        return $this->dashboardStatsCache->remember(fn (): array => $this->resolveStats());
    }

    /**
     * @return array{orders:int, drinks:int, customers:int, revenue:float}
     */
    private function resolveStats(): array
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
