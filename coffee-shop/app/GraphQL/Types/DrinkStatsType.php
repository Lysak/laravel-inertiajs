<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class DrinkStatsType extends GraphQLType
{
    protected $attributes = [
        'name' => 'DrinkStats',
        'description' => 'Aggregated sales stats for drink',
    ];

    public function fields(): array
    {
        return [
            'total_sold' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'revenue' => [
                'type' => Type::nonNull(Type::float()),
            ],
        ];
    }
}
