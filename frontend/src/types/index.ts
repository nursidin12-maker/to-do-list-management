/**
 * Task entity type matching the Laravel backend model.
 */
export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating a new task.
 */
export interface CreateTaskPayload {
  title: string;
  description?: string;
}

/**
 * Payload for updating an existing task.
 * All fields are optional (PATCH semantics).
 */
export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
}

/**
 * Filter options for the task list view.
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Generic API response wrapper from Laravel.
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Toast notification type.
 */
export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}
