<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Drink;
use App\Services\StatsService;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class DrinksWithStatsOptimizedQuery extends Query
{
    use ResolvesGraphQLTypes;

    public function __construct(private readonly StatsService $statsService) {}

    protected $attributes = [
        'name' => 'drinksWithStatsOptimized',
        'description' => 'Drinks with eager loaded category and batched stats',
    ];

    public function type(): Type
    {
        return Type::listOf($this->nullableType('Drink'));
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
            ->catalogWithCategory((int) $args['limit'])
            ->get();

        $statsByDrink = $this->statsService->forDrinkIds($drinks->pluck('id')->all());

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
