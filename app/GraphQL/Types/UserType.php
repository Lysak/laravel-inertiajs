<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class UserType extends GraphQLType
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'User',
        'description' => 'Application user',
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
            'email' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'role' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'orders' => [
                'type' => Type::listOf($this->nullableType('Order')),
            ],
        ];
    }
}
