<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Drink;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class DrinksOptimizedQuery extends Query
{
    protected $attributes = [
        'name' => 'drinksOptimized',
        'description' => 'Catalog drinks with eager loaded category',
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
        return Drink::query()
            ->with('category')
            ->orderBy('name')
            ->limit($args['limit'])
            ->get()
            ->all();
    }
}
