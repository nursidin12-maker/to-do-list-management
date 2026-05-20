import React from 'react';
import type { Task, FilterType } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * TaskList
 *
 * Renders the task list with:
 * - Search input
 * - Filter tabs (Semua / Aktif / Selesai)
 * - The list of TaskItem components
 * - Empty state message
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onFilterChange,
  onToggleComplete,
  onEdit,
  onDelete,
  isLoading,
  searchQuery,
  onSearchChange,
}) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Selesai', value: 'completed' },
  ];

  // Apply client-side filter on top of server results
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.is_completed;
    if (filter === 'completed') return task.is_completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.is_completed).length;
  const activeCount = tasks.filter(t => !t.is_completed).length;

  return (
    <div className="task-list-section">
      {/* Search bar */}
      <div className="search-bar">
        <span className="search-bar__icon">🔍</span>
        <input
          type="search"
          className="search-bar__input"
          placeholder="Cari tugas berdasarkan judul..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          aria-label="Cari tugas"
        />
        {searchQuery && (
          <button
            className="search-bar__clear"
            onClick={() => onSearchChange('')}
            aria-label="Hapus pencarian"
          >
            ×
          </button>
        )}
      </div>

      {/* Stats and filter tabs */}
      <div className="task-list-header">
        <div className="task-stats">
          <span className="stat">{activeCount} aktif</span>
          <span className="stat-divider">·</span>
          <span className="stat">{completedCount} selesai</span>
        </div>

        <div className="filter-tabs" role="tablist">
          {filters.map(f => (
            <button
              key={f.value}
              className={`filter-tab ${filter === f.value ? 'filter-tab--active' : ''}`}
              onClick={() => onFilterChange(f.value)}
              role="tab"
              aria-selected={filter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="state-message">
          <div className="spinner" aria-label="Memuat..." />
          <p>Memuat tugas...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="state-message state-message--empty">
          <span className="state-message__icon">
            {searchQuery ? '🔍' : filter === 'completed' ? '🎉' : '📋'}
          </span>
          <p>
            {searchQuery
              ? `Tidak ada tugas yang cocok dengan "${searchQuery}"`
              : filter === 'completed'
              ? 'Belum ada tugas yang selesai.'
              : filter === 'active'
              ? 'Tidak ada tugas aktif. Kerja bagus!'
              : 'Belum ada tugas. Tambahkan tugas pertama Anda!'}
          </p>
        </div>
      ) : (
        <ul className="task-list" role="list">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
