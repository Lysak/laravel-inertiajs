<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Drink;
use App\Services\StatsService;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class DrinksWithStatsQuery extends Query
{
    protected $attributes = [
        'name' => 'drinksWithStats',
        'description' => 'Drinks with per-item stats query (intentionally N+1 style)',
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
        $statsService = app(StatsService::class);

        return Drink::query()
            ->orderBy('name')
            ->limit($args['limit'])
            ->get()
            ->map(static function (Drink $drink) use ($statsService): array {
                return [
                    'id' => $drink->id,
                    'name' => $drink->name,
                    'price' => (float) $drink->price,
                    'is_available' => $drink->is_available,
                    'category' => $drink->category, // lazy-loaded on purpose for N+1 demonstration
                    'stats' => $statsService->forDrink($drink->id),
                ];
            })
            ->all();
    }
}
