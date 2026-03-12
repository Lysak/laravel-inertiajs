<?php

use Illuminate\Support\Facades\Route;
use Rebing\GraphQL\GraphQLController;

Route::match(['GET', 'POST'], '/graphql', [GraphQLController::class, 'query'])
    ->middleware(['web', 'auth'])
    ->name('graphql.query');
