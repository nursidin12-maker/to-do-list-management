import React, { useState } from 'react';
import type { CreateTaskPayload } from '../types';

interface AddTaskFormProps {
  onAdd: (payload: CreateTaskPayload) => Promise<void>;
  isLoading: boolean;
}

/**
 * AddTaskForm
 *
 * A simple form to add a new task with title and optional description.
 */
export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!title.trim()) {
      setError('Title wajib diisi.');
      return;
    }

    setError('');
    await onAdd({ title: title.trim(), description: description.trim() || undefined });

    // Reset form on success
    setTitle('');
    setDescription('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">Tambah Tugas Baru</h2>

      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Judul <span className="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`form-input ${error ? 'form-input--error' : ''}`}
          placeholder="Masukkan judul tugas..."
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          disabled={isLoading}
          maxLength={255}
        />
        {error && <p className="form-error">{error}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Deskripsi <span className="optional">(opsional)</span>
        </label>
        <textarea
          id="task-description"
          className="form-textarea"
          placeholder="Tambahkan deskripsi..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={isLoading}
          rows={3}
          maxLength={2000}
        />
      </div>

      <button type="submit" className="btn btn--primary" disabled={isLoading}>
        {isLoading ? (
          <span className="btn__loading">Menyimpan...</span>
        ) : (
          '+ Tambah Tugas'
        )}
      </button>
    </form>
  );
};
