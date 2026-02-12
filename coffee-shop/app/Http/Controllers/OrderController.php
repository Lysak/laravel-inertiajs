<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with(['user', 'items.drink'])
            ->latest()
            ->limit(25)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'status' => $order->status,
                'customer_name' => $order->user?->name ?? 'Unknown',
                'items_count' => $order->items->sum('quantity'),
                'total' => $order->total,
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items.drink']);

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'customer_name' => $order->user?->name ?? 'Unknown',
                'customer_email' => $order->user?->email,
                'created_at' => $order->created_at?->toDateTimeString(),
                'total' => $order->total,
                'items' => $order->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'drink_name' => $item->drink?->name ?? 'Unknown drink',
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'line_total' => $item->line_total,
                ]),
            ],
        ]);
    }
}
