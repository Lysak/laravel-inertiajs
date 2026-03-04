<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use App\Models\Drink;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class DrinkType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Drink',
        'description' => 'Drink item from catalog',
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
            'name' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'price' => [
                'type' => Type::nonNull(Type::float()),
            ],
            'is_available' => [
                'type' => Type::nonNull(Type::boolean()),
            ],
            'category' => [
                'type' => GraphQL::type('Category'),
            ],
            'stats' => [
                'type' => GraphQL::type('DrinkStats'),
                'resolve' => static fn ($root): ?array => $root['stats'] ?? null,
            ],
            'total_sold' => [
                'type' => Type::nonNull(Type::int()),
                'resolve' => static function ($root): int {
                    if (isset($root['stats']['total_sold'])) {
                        return (int) $root['stats']['total_sold'];
                    }

                    /** @var Drink $root */
                    // Fallback query. Can introduce N+1 for drink lists when stats are not preloaded by the resolver.
                    // Prefer batched preloaded stats (stats.total_sold) or a query with withSum aggregation.
                    return (int) $root->orderItems()->sum('quantity');
                },
            ],
        ];
    }
}
