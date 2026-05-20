<?php

use Illuminate\Support\Facades\Route;

/**
 * Web Routes
 *
 * This application is a pure API backend — no web routes are needed.
 * This file is kept for Laravel scaffold completeness.
 * Compatible with Laravel 13 / PHP 8.3+.
 */

Route::get('/', fn () => response()->json([
    'name'    => config('app.name'),
    'version' => '1.0.0',
    'api'     => url('/api'),
]));
