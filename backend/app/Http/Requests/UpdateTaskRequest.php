<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * UpdateTaskRequest
 *
 * Validates incoming data when updating an existing Task.
 * All fields are optional (PATCH semantics).
 */
class UpdateTaskRequest extends FormRequest
{
    /**
     * Authorize all users to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for updating a task.
     * Uses 'sometimes' so only provided fields are validated.
     */
    public function rules(): array
    {
        return [
            'title'        => 'sometimes|required|string|max:255',
            'description'  => 'sometimes|nullable|string|max:2000',
            'is_completed' => 'sometimes|boolean',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Title wajib diisi.',
            'title.max'      => 'Title tidak boleh lebih dari 255 karakter.',
            'is_completed.boolean' => 'Status harus berupa boolean.',
        ];
    }

    /**
     * Return JSON response on validation failure.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }
}
