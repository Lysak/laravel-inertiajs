<?php

declare(strict_types=1);

namespace App\GraphQL\Concerns;

use GraphQL\Type\Definition\NullableType;
use GraphQL\Type\Definition\Type;
use LogicException;
use Rebing\GraphQL\Support\Facades\GraphQL;

trait ResolvesGraphQLTypes
{
    /**
     * Narrow facade return type for wrappers like Type::nonNull().
     *
     * @return Type&NullableType
     */
    protected function nullableType(string $name): Type
    {
        $type = GraphQL::type($name);

        if (! $type instanceof NullableType) {
            throw new LogicException("GraphQL type [{$name}] must be nullable.");
        }

        return $type;
    }
}
