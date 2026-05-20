<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api automatically by Laravel.
|
*/

// Task CRUD endpoints
Route::apiResource('tasks', TaskController::class);

// Health check endpoint
Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()]));
