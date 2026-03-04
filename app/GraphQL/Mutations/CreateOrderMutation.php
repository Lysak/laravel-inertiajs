<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;

class CreateOrderMutation extends Mutation
{
    use ResolvesGraphQLTypes;

    public function __construct(
        private readonly OrderService $orderService,
    ) {}

    protected $attributes = [
        'name' => 'createOrder',
        'description' => 'Create a customer order',
    ];

    public function type(): Type
    {
        return GraphQL::type('Order');
    }

    public function args(): array
    {
        return [
            'input' => [
                'name' => 'input',
                'type' => Type::nonNull($this->nullableType('CreateOrderInput')),
            ],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): Order
    {
        $input = $args['input'];
        $user = null;

        if (isset($input['user_id'])) {
            $user = User::query()->find($input['user_id']);
        } elseif (Auth::check()) {
            $user = Auth::user();
        }

        if (!$user instanceof User) {
            throw ValidationException::withMessages([
                'user_id' => 'A valid user is required to create an order.',
            ]);
        }

        return $this->orderService->createOrder($user, $input['items'], $input['customer_name'] ?? null);
    }
}
