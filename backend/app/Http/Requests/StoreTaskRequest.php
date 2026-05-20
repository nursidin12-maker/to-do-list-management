<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * StoreTaskRequest
 *
 * Validates incoming data when creating a new Task.
 */
class StoreTaskRequest extends FormRequest
{
    /**
     * Authorize all users to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for creating a task.
     */
    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
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
            'description.max' => 'Description tidak boleh lebih dari 2000 karakter.',
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
