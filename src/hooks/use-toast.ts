// Simple toast hook for now - can be enhanced later
import { useState, useCallback } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    setToasts((prev) => [...prev, options]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  }, []);

  return { toast, toasts };
}
