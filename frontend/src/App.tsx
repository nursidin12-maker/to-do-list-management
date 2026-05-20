import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Task, FilterType, CreateTaskPayload, UpdateTaskPayload } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/taskService';
import { useToast } from './hooks/useToast';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskList } from './components/TaskList';
import { EditTaskModal } from './components/EditTaskModal';
import { ToastContainer } from './components/ToastContainer';

/**
 * App
 *
 * Root component for the Todo List Management application.
 * Manages global state and coordinates between all child components.
 */
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toasts, addToast, removeToast } = useToast();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Load tasks from API with optional search query. */
  const loadTasks = useCallback(async (query: string = '') => {
    setIsLoadingList(true);
    try {
      const data = await fetchTasks(query || undefined);
      setTasks(data);
    } catch {
      addToast('error', 'Gagal memuat daftar tugas.');
    } finally {
      setIsLoadingList(false);
    }
  }, [addToast]);

  // Initial load on mount.
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Cancel any pending debounce timer on unmount.
  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  /**
   * Debounced search handler — waits 400 ms after the last keystroke
   * before hitting the API, to avoid excessive requests.
   */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => loadTasks(query), 400);
  }, [loadTasks]);

  /** Create a new task. */
  const handleAddTask = async (payload: CreateTaskPayload) => {
    setIsSubmitting(true);
    try {
      const newTask = await createTask(payload);
      setTasks(prev => [newTask, ...prev]);
      addToast('success', `Tugas "${newTask.title}" berhasil ditambahkan!`);
    } catch {
      addToast('error', 'Gagal menambahkan tugas. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Toggle is_completed with optimistic update. */
  const handleToggleComplete = async (task: Task) => {
    // Apply optimistic update immediately for snappy UX.
    setTasks(prev =>
      prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t)
    );

    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed });
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      addToast('success', task.is_completed ? 'Tugas ditandai aktif.' : 'Tugas ditandai selesai!');
    } catch {
      // Revert optimistic update on failure.
      setTasks(prev =>
        prev.map(t => t.id === task.id ? { ...t, is_completed: task.is_completed } : t)
      );
      addToast('error', 'Gagal memperbarui status tugas.');
    }
  };

  /** Save edits to an existing task. */
  const handleSaveEdit = async (id: number, payload: UpdateTaskPayload) => {
    setIsSubmitting(true);
    try {
      const updated = await updateTask(id, payload);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      setEditingTask(null);
      addToast('success', 'Tugas berhasil diperbarui!');
    } catch {
      addToast('error', 'Gagal memperbarui tugas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Delete a task after confirmation. */
  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`Hapus tugas "${task.title}"?`)) return;

    try {
      await deleteTask(task.id);
      setTasks(prev => prev.filter(t => t.id !== task.id));
      addToast('success', `Tugas "${task.title}" berhasil dihapus.`);
    } catch {
      addToast('error', 'Gagal menghapus tugas.');
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__content">
          <h1 className="app-title">
            <span className="app-title__icon">✓</span>
            Todo<span className="app-title__accent">List</span>
          </h1>
          <p className="app-subtitle">Kelola tugas Anda dengan mudah</p>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <div className="container">
          <AddTaskForm onAdd={handleAddTask} isLoading={isSubmitting} />

          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggleComplete={handleToggleComplete}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            isLoading={isLoadingList}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
      </main>

      {/* Edit modal */}
      <EditTaskModal
        task={editingTask}
        onSave={handleSaveEdit}
        onClose={() => setEditingTask(null)}
        isLoading={isSubmitting}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
