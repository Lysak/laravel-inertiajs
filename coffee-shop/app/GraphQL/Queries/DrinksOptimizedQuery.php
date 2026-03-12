<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Drink;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class DrinksOptimizedQuery extends Query
{
    use ResolvesGraphQLTypes;

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
        // TODO: current `with('category')` prevents N+1 for category relation.
        // Consider SelectFields/$getSelectFields so relations are eager loaded only when requested by GraphQL fields.
        return Drink::query()
            ->catalogWithCategory((int) $args['limit'])
            ->get()
            ->all();
    }
}
