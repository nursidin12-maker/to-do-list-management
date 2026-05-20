import React from 'react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/**
 * TaskItem
 *
 * Renders a single task row with:
 * - Checkbox to toggle completion (with strikethrough visual)
 * - Task title and optional description
 * - Edit and Delete action buttons
 */
export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const checkboxId = `task-check-${task.id}`;

  return (
    <li className={`task-item ${task.is_completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__left">
        <input
          id={checkboxId}
          type="checkbox"
          className="task-checkbox"
          checked={task.is_completed}
          onChange={() => onToggleComplete(task)}
          aria-label={`Tandai "${task.title}" sebagai ${task.is_completed ? 'belum selesai' : 'selesai'}`}
        />
        <label htmlFor={checkboxId} className="task-item__content">
          <span className={`task-item__title ${task.is_completed ? 'task-item__title--done' : ''}`}>
            {task.title}
          </span>
          {task.description && (
            <span className="task-item__description">{task.description}</span>
          )}
        </label>
      </div>

      <div className="task-item__actions">
        <button
          className="btn-icon btn-icon--edit"
          onClick={() => onEdit(task)}
          aria-label={`Edit tugas "${task.title}"`}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-icon--delete"
          onClick={() => onDelete(task)}
          aria-label={`Hapus tugas "${task.title}"`}
          title="Hapus"
        >
          🗑️
        </button>
      </div>
    </li>
  );
};
