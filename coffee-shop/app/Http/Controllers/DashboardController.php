<?php

namespace App\Http\Controllers;

use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $recentOrders = Order::query()
            ->with(['user', 'items.drink'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'status' => $order->status,
                'customer_name' => $order->user?->name ?? 'Unknown',
                'items_count' => $order->items->sum('quantity'),
                'total' => $order->total,
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'orders' => Order::query()->count(),
                'drinks' => Drink::query()->count(),
                'customers' => User::query()->where('role', 'customer')->count(),
                'revenue' => (float) OrderItem::query()
                    ->selectRaw('COALESCE(SUM(quantity * unit_price), 0) as revenue')
                    ->value('revenue'),
            ],
            'recentOrders' => $recentOrders,
            'graphqlEndpoint' => url('/graphql'),
        ]);
    }
}
