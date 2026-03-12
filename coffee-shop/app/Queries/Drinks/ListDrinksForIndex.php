<?php

namespace App\Queries\Drinks;

use App\Models\Drink;
use App\Queries\Drinks\Data\DrinkIndexData;
use App\Services\StatsService;

readonly class ListDrinksForIndex
{
    public function __construct(
        private readonly StatsService $statsService,
    ) {}

    /**
     * @return array<int, DrinkIndexData>
     */
    public function handle(): array
    {
        $drinks = Drink::query()
            ->with('category')
            ->orderBy('name')
            ->get();

        $statsByDrink = $this->statsService->forDrinkIds($drinks->pluck('id')->all());

        return $drinks->map(static function (Drink $drink) use ($statsByDrink): DrinkIndexData {
            $stats = $statsByDrink[$drink->id] ?? ['total_sold' => 0, 'revenue' => 0.0];

            return new DrinkIndexData(
                id: $drink->id,
                name: $drink->name,
                price: (float) $drink->price,
                isAvailable: $drink->is_available,
                category: $drink->category?->name,
                totalSold: $stats['total_sold'],
                revenue: $stats['revenue'],
            );
        })->all();
    }
}
