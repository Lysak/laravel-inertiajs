<?php

declare(strict_types=1);

namespace App\GraphQL\Inputs;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\InputType;

class CreateOrderItemInput extends InputType
{
    protected $attributes = [
        'name' => 'CreateOrderItemInput',
        'description' => 'Single item for creating order',
    ];

    public function fields(): array
    {
        return [
            'drink_id' => [
                'type' => Type::nonNull(Type::id()),
                'rules' => ['required', 'exists:drinks,id'],
            ],
            'quantity' => [
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required', 'integer', 'min:1'],
            ],
        ];
    }
}
