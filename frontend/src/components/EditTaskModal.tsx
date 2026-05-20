import React, { useState, useEffect } from 'react';
import type { Task, UpdateTaskPayload } from '../types';

interface EditTaskModalProps {
  task: Task | null;
  onSave: (id: number, payload: UpdateTaskPayload) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

/**
 * EditTaskModal
 *
 * A modal dialog to edit an existing task's title and description.
 */
export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  onSave,
  onClose,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setError('');
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title wajib diisi.');
      return;
    }

    setError('');
    await onSave(task.id, {
      title: title.trim(),
      description: description.trim() || null,
    });
  };

  // Close modal when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">Edit Tugas</h2>
          <button className="modal__close" onClick={onClose} aria-label="Tutup modal">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Judul <span className="required">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              className={`form-input ${error ? 'form-input--error' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              disabled={isLoading}
              maxLength={255}
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-description" className="form-label">
              Deskripsi <span className="optional">(opsional)</span>
            </label>
            <textarea
              id="edit-description"
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              maxLength={2000}
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={isLoading}>
              Batal
            </button>
            <button type="submit" className="btn btn--primary" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
