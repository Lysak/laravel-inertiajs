<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Concerns\ResolvesGraphQLTypes;
use App\Queries\Orders\GetOrderCreatePageData;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class OrderCreateDataQuery extends Query
{
    use ResolvesGraphQLTypes;

    public function __construct(private readonly GetOrderCreatePageData $getOrderCreatePageData)
    {
    }

    protected $attributes = [
        'name' => 'orderCreateData',
        'description' => 'Data needed to build the create order screen',
    ];

    public function type(): Type
    {
        return Type::nonNull($this->nullableType('OrderCreateData'));
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): array
    {
        return $this->getOrderCreatePageData->handle();
    }
}
