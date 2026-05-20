<?php

use Illuminate\Http\Request;

/**
 * Laravel 13 — Application Entry Point
 *
 * All HTTP requests enter the application through this file.
 * It bootstraps the framework and handles the incoming request.
 */

define('LARAVEL_START', microtime(true));

// Maintenance mode check.
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Composer autoloader.
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap the application and handle the request.
/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Request::capture());
