<?php

use GraphQL\Utils\SchemaPrinter;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Rebing\GraphQL\Support\Facades\GraphQL;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('graphql:schema-dump {path=resources/graphql/schema.graphql}', function (
    string $path,
): void {
    $absolutePath = base_path($path);

    File::ensureDirectoryExists(dirname($absolutePath));
    File::put($absolutePath, SchemaPrinter::doPrint(GraphQL::schema()) . PHP_EOL);

    $this->info("GraphQL schema written to [{$path}].");
})->purpose('Dump the GraphQL schema for frontend code generation');
