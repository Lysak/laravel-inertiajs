<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class CategoryType extends GraphQLType
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'Category',
        'description' => 'Drink category',
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
            'drinks' => [
                'type' => Type::nonNull(Type::listOf(Type::nonNull($this->nullableType('Drink')))),
            ],
        ];
    }
}
