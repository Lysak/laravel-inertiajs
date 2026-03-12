<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class OrderCreateCustomerType extends GraphQLType
{
    protected $attributes = [
        'name' => 'OrderCreateCustomer',
        'description' => 'Anonymous customer fallback used by create order flow',
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
        ];
    }
}
