<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Drink;
use App\Support\ReadModelCache;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class DrinksOptimizedQuery extends Query
{
    use ResolvesGraphQLTypes;

    public function __construct(private readonly ReadModelCache $readModelCache) {}

    protected $attributes = [
        'name' => 'drinksOptimized',
        'description' => 'Catalog drinks with eager loaded category',
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
        /** @var array<int, Drink> $drinks */
        $drinks = $this->readModelCache->remember(
            ['catalog'],
            'graphql:drinks-optimized:limit:' . (int) $args['limit'],
            (int) config('read-model-cache.ttls.catalog', 300),
            fn (): array => Drink::query()
                ->catalogWithCategory((int) $args['limit'])
                ->get()
                ->all(),
        );

        return $drinks;
    }
}
