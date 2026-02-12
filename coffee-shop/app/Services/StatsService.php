<?php

namespace App\Services;

use App\Models\OrderItem;

class StatsService
{
    /**
     * @param  array<int, int>  $drinkIds
     * @return array<int, array{total_sold:int, revenue:float}>
     */
    public function forDrinkIds(array $drinkIds): array
    {
        if ($drinkIds === []) {
            return [];
        }

        $rows = OrderItem::query()
            ->selectRaw('drink_id, COALESCE(SUM(quantity), 0) as total_sold, COALESCE(SUM(quantity * unit_price), 0) as revenue')
            ->whereIn('drink_id', $drinkIds)
            ->groupBy('drink_id')
            ->get();

        $stats = [];
        foreach ($drinkIds as $drinkId) {
            $stats[$drinkId] = [
                'total_sold' => 0,
                'revenue' => 0.0,
            ];
        }

        foreach ($rows as $row) {
            $stats[(int) $row->drink_id] = [
                'total_sold' => (int) $row->total_sold,
                'revenue' => (float) $row->revenue,
            ];
        }

        return $stats;
    }

    /**
     * @return array{total_sold:int, revenue:float}
     */
    public function forDrink(int $drinkId): array
    {
        $stats = $this->forDrinkIds([$drinkId]);

        return $stats[$drinkId] ?? [
            'total_sold' => 0,
            'revenue' => 0.0,
        ];
    }
}
