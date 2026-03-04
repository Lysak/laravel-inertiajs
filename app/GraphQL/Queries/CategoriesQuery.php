<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Category;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class CategoriesQuery extends Query
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'categories',
        'description' => 'Catalog categories ordered by name',
    ];

    public function type(): Type
    {
        return Type::nonNull(Type::listOf(Type::nonNull($this->nullableType('Category'))));
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): array
    {
        return Category::query()
            ->orderBy('name')
            ->get()
            ->all();
    }
}
