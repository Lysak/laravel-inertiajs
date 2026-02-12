<?php

namespace App\Http\Controllers;

use App\Models\Drink;
use App\Services\StatsService;
use Inertia\Inertia;
use Inertia\Response;

class DrinkController extends Controller
{
    public function index(StatsService $statsService): Response
    {
        $drinks = Drink::query()
            ->with('category')
            ->orderBy('name')
            ->get();

        $statsByDrink = $statsService->forDrinkIds($drinks->pluck('id')->all());

        return Inertia::render('Drinks/Index', [
            'drinks' => $drinks->map(function (Drink $drink) use ($statsByDrink): array {
                $stats = $statsByDrink[$drink->id] ?? ['total_sold' => 0, 'revenue' => 0.0];

                return [
                    'id' => $drink->id,
                    'name' => $drink->name,
                    'price' => (float) $drink->price,
                    'is_available' => $drink->is_available,
                    'category' => $drink->category?->name,
                    'total_sold' => $stats['total_sold'],
                    'revenue' => $stats['revenue'],
                ];
            }),
        ]);
    }
}
