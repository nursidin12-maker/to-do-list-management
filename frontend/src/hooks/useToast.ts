import { useState, useCallback, useRef } from 'react';
import type { Toast } from '../types';

/**
 * useToast
 *
 * Manages a queue of toast notifications.
 * Each toast auto-dismisses after 3 seconds.
 * Manually closing a toast also cancels its pending auto-dismiss timer.
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Map of toast id → auto-dismiss timer handle.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /** Add a toast notification. */
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, message };

    setToasts(prev => [...prev, toast]);

    // Schedule auto-removal and store the timer so it can be cancelled.
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timers.current.delete(id);
    }, 3000);

    timers.current.set(id, timer);
  }, []);

  /** Manually remove a toast by ID and cancel its auto-dismiss timer. */
  const removeToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
