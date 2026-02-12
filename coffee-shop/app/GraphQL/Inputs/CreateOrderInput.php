<?php

declare(strict_types=1);

namespace App\GraphQL\Inputs;

use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\InputType;

class CreateOrderInput extends InputType
{
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
            'items' => [
                'type' => Type::nonNull(Type::listOf(Type::nonNull(GraphQL::type('CreateOrderItemInput')))),
                'rules' => ['required', 'array', 'min:1'],
            ],
        ];
    }
}
