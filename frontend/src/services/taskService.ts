import axios from 'axios';
import type { Task, CreateTaskPayload, UpdateTaskPayload, ApiResponse } from '../types';

/**
 * Axios instance configured to talk to the Laravel API.
 * During development, Vite proxies /api/* to http://localhost:8000
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Fetch all tasks, with optional search by title.
 */
export async function fetchTasks(search?: string): Promise<Task[]> {
  const params = search ? { search } : {};
  const { data } = await api.get<ApiResponse<Task[]>>('/tasks', { params });
  return data.data ?? [];
}

/**
 * Create a new task.
 */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<ApiResponse<Task>>('/tasks', payload);
  if (!data.data) throw new Error('No data returned from server.');
  return data.data;
}

/**
 * Update an existing task (title, description, or is_completed).
 */
export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
  const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, payload);
  if (!data.data) throw new Error('No data returned from server.');
  return data.data;
}

/**
 * Delete a task by ID.
 */
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
