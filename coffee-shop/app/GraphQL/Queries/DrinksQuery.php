<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Drink;
use App\Services\StatsService;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Illuminate\Database\Eloquent\Builder;
use Rebing\GraphQL\Support\Query;

class DrinksQuery extends Query
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'drinks',
        'description' => 'Catalog drinks with eager loaded category',
    ];

    public function __construct(
        private readonly StatsService $statsService,
    ) {}

    public function type(): Type
    {
        return Type::nonNull(Type::listOf(Type::nonNull($this->nullableType('Drink'))));
    }

    public function args(): array
    {
        return [
            'limit' => [
                'type' => Type::int(),
            ],
            'search' => [
                'type' => Type::string(),
            ],
            'category_id' => [
                'type' => Type::id(),
            ],
            'is_available' => [
                'type' => Type::boolean(),
            ],
            'min_price' => [
                'type' => Type::float(),
            ],
            'max_price' => [
                'type' => Type::float(),
            ],
            'sort_by' => [
                'type' => Type::string(),
                'defaultValue' => 'name',
            ],
            'sort_direction' => [
                'type' => Type::string(),
                'defaultValue' => 'asc',
            ],
            'with_stats' => [
                'type' => Type::boolean(),
                'defaultValue' => false,
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): array
    {
        $query = Drink::query()->with('category');

        $query
            ->when(
                filled($args['search'] ?? null),
                fn (Builder $builder) => $builder->where('name', 'like', '%'.$args['search'].'%')
            )
            ->when(
                isset($args['category_id']),
                fn (Builder $builder) => $builder->where('category_id', (int) $args['category_id'])
            )
            ->when(
                isset($args['is_available']),
                fn (Builder $builder) => $builder->where('is_available', (bool) $args['is_available'])
            )
            ->when(
                isset($args['min_price']),
                fn (Builder $builder) => $builder->where('price', '>=', $args['min_price'])
            )
            ->when(
                isset($args['max_price']),
                fn (Builder $builder) => $builder->where('price', '<=', $args['max_price'])
            );

        $sortBy = in_array($args['sort_by'], ['name', 'price', 'created_at'], true)
            ? $args['sort_by']
            : 'name';
        $sortDirection = strtolower((string) $args['sort_direction']) === 'desc' ? 'desc' : 'asc';

        $drinks = $query
            ->orderBy($sortBy, $sortDirection)
            ->when(
                isset($args['limit']),
                fn (Builder $builder) => $builder->limit((int) $args['limit'])
            )
            ->get();

        if (($args['with_stats'] ?? false) !== true) {
            return $drinks->all();
        }

        $statsByDrink = $this->statsService->forDrinkIds($drinks->pluck('id')->all());

        return $drinks
            ->map(function (Drink $drink) use ($statsByDrink): array {
                return [
                    ...$drink->toArray(),
                    'stats' => $statsByDrink[$drink->id] ?? [
                        'total_sold' => 0,
                        'revenue' => 0.0,
                    ],
                ];
            })
            ->all();
    }
}
