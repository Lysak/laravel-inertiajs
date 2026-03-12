<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class DashboardStatsType extends GraphQLType
{
    protected $attributes = [
        'name' => 'DashboardStats',
        'description' => 'Dashboard counters and revenue totals',
    ];

    public function fields(): array
    {
        return [
            'orders' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'drinks' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'customers' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'revenue' => [
                'type' => Type::nonNull(Type::float()),
            ],
        ];
    }
}
