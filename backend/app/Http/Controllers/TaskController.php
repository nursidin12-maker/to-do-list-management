<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * TaskController
 *
 * Handles all CRUD operations for Tasks via RESTful API.
 * Compatible with Laravel 13 / PHP 8.3+.
 *
 * Note: The 'api' middleware group is applied automatically
 * to all routes registered in routes/api.php by Laravel's
 * bootstrap — no need to declare it on the controller.
 */
class TaskController extends Controller
{
    /**
     * GET /api/tasks
     *
     * Retrieve all tasks, with optional search by title.
     * Query param: ?search=keyword
     */
    public function index(Request $request): JsonResponse
    {
        $query = Task::query();

        // Filter by title if search param is provided
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $query->where('title', 'like', $searchTerm);
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $tasks,
        ]);
    }

    /**
     * POST /api/tasks
     *
     * Create a new Task.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = Task::create([
            'title'        => $request->input('title'),
            'description'  => $request->input('description'),
            'is_completed' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil dibuat.',
            'data'    => $task,
        ], 201);
    }

    /**
     * GET /api/tasks/{id}
     *
     * Retrieve a single Task by ID.
     */
    public function show(int $id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return $this->notFoundResponse();
        }

        return response()->json([
            'success' => true,
            'data'    => $task,
        ]);
    }

    /**
     * PUT/PATCH /api/tasks/{id}
     *
     * Update an existing Task.
     * Supports partial updates (title, description, is_completed).
     */
    public function update(UpdateTaskRequest $request, int $id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return $this->notFoundResponse();
        }

        // Only update fields that were actually sent in the request
        $task->fill($request->only(['title', 'description', 'is_completed']));
        $task->save();

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil diperbarui.',
            'data'    => $task,
        ]);
    }

    /**
     * DELETE /api/tasks/{id}
     *
     * Delete a Task by ID.
     */
    public function destroy(int $id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return $this->notFoundResponse();
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil dihapus.',
        ]);
    }

    /**
     * Return a standardized 404 Not Found response.
     */
    private function notFoundResponse(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Task tidak ditemukan.',
        ], 404);
    }
}
