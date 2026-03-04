<?php

declare(strict_types=1);

namespace App\GraphQL\Inputs;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\InputType;

class CreateOrderInput extends InputType
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'CreateOrderInput',
        'description' => 'Input payload for creating order',
    ];

    public function fields(): array
    {
        return [
            'user_id' => [
                'type' => Type::id(),
                'rules' => ['nullable', 'exists:users,id'],
            ],
            'customer_name' => [
                'type' => Type::string(),
                'rules' => ['nullable', 'string', 'max:255'],
            ],
            'items' => [
                'type' => Type::nonNull(
                    Type::listOf(Type::nonNull($this->nullableType('CreateOrderItemInput'))),
                ),
                'rules' => ['required', 'array', 'min:1'],
            ],
        ];
    }
}
