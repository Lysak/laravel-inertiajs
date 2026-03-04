<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Actions\Drinks\CreateDrink;
use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Drink;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;

class CreateDrinkMutation extends Mutation
{
    use ResolvesGraphQLTypes;

    protected $attributes = [
        'name' => 'createDrink',
        'description' => 'Create a new catalog drink',
    ];

    public function __construct(
        private readonly CreateDrink $createDrink,
    ) {}

    public function type(): Type
    {
        return GraphQL::type('Drink');
    }

    public function args(): array
    {
        return [
            'input' => [
                'name' => 'input',
                'type' => Type::nonNull($this->nullableType('CreateDrinkInput')),
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): Drink
    {
        return $this->createDrink->handle($args['input']);
    }
}
