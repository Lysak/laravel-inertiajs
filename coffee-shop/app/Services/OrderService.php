<?php

namespace App\Services;

use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * @param  array<int, array{drink_id:int, quantity:int}>  $items
     */
    public function createOrder(User $user, array $items): Order
    {
        return DB::transaction(function () use ($user, $items): Order {
            $normalizedItems = collect($items)
                ->groupBy('drink_id')
                ->map(static fn ($lines) => [
                    'drink_id' => (int) $lines[0]['drink_id'],
                    'quantity' => (int) collect($lines)->sum('quantity'),
                ])
                ->values();

            $drinkIds = $normalizedItems->pluck('drink_id');

            /** @var Collection<int, Drink> $drinks */
            $drinks = Drink::query()
                ->whereIn('id', $drinkIds)
                ->where('is_available', true)
                ->get()
                ->keyBy('id');

            if ($drinks->count() !== $drinkIds->count()) {
                throw ValidationException::withMessages([
                    'items' => 'One or more selected drinks are not available.',
                ]);
            }

            $order = Order::query()->create([
                'user_id' => $user->id,
                'status' => 'new',
            ]);

            foreach ($normalizedItems as $item) {
                $drink = $drinks->get($item['drink_id']);

                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'drink_id' => $drink->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $drink->price,
                ]);
            }

            return $order->load(['user', 'items.drink']);
        });
    }

    public function markPaid(Order $order): Order
    {
        if ($order->status === 'new') {
            $order->update(['status' => 'paid']);
        }

        return $order->load(['user', 'items.drink']);
    }
}
