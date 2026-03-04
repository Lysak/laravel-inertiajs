<?php

namespace App\Support;

use App\Models\User;

class CustomerUsers
{
    public const ANONYMOUS_EMAIL = 'anonymous@coffee-shop.local';

    public const ANONYMOUS_NAME = 'Anonymous Guest';

    public static function anonymousCustomer(): User
    {
        /** @var User $user */
        $user = User::query()->firstOrCreate(
            ['email' => self::ANONYMOUS_EMAIL],
            [
                'name' => self::ANONYMOUS_NAME,
                'role' => 'customer',
                'password' => 'password',
            ],
        );

        return $user;
    }
}
