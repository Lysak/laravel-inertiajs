<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Drink;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class DrinksQuery extends Query
{
    protected $attributes = [
        'name' => 'drinks',
        'description' => 'Catalog drinks (can provoke N+1 when category is requested)',
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
            ->orderBy('name')
            ->limit($args['limit'])
            ->get()
            ->all();
    }
}
