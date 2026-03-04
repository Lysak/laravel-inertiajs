<?php

declare(strict_types=1);

namespace App\GraphQL\Inputs;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\InputType;

class CreateDrinkInput extends InputType
{
    protected $attributes = [
        'name' => 'CreateDrinkInput',
        'description' => 'Input payload for creating drink',
    ];

    public function fields(): array
    {
        return [
            'category_id' => [
                'type' => Type::nonNull(Type::id()),
                'rules' => ['required', 'exists:categories,id'],
            ],
            'name' => [
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required', 'string', 'max:255'],
            ],
            'price' => [
                'type' => Type::nonNull(Type::float()),
                'rules' => ['required', 'numeric', 'min:0.01'],
            ],
            'is_available' => [
                'type' => Type::nonNull(Type::boolean()),
                'rules' => ['required', 'boolean'],
            ],
        ];
    }
}
