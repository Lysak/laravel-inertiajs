<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Drink;
use App\Services\StatsService;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class DrinksWithStatsOptimizedQuery extends Query
{
    protected $attributes = [
        'name' => 'drinksWithStatsOptimized',
        'description' => 'Drinks with eager loaded category and batched stats',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Drink'));
    }

    public function args(): array
    {
        return [
            'limit' => [
                'type' => Type::int(),
                'defaultValue' => 25,
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): array
    {
        $drinks = Drink::query()
            ->with('category')
            ->orderBy('name')
            ->limit($args['limit'])
            ->get();

        $statsByDrink = app(StatsService::class)->forDrinkIds($drinks->pluck('id')->all());

        return $drinks->map(static function (Drink $drink) use ($statsByDrink): array {
            return [
                'id' => $drink->id,
                'name' => $drink->name,
                'price' => (float) $drink->price,
                'is_available' => $drink->is_available,
                'category' => $drink->category,
                'stats' => $statsByDrink[$drink->id] ?? ['total_sold' => 0, 'revenue' => 0.0],
            ];
        })->all();
    }
}
