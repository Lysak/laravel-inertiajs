<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class OrderCreateDataType extends GraphQLType
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'OrderCreateData',
        'description' => 'Create order screen data',
    ];

    public function fields(): array
    {
        return [
            'anonymous_customer' => [
                'type' => Type::nonNull($this->nullableType('OrderCreateCustomer')),
            ],
            'categories' => [
                'type' => Type::nonNull(Type::listOf(Type::nonNull($this->nullableType('Category')))),
            ],
        ];
    }
}
