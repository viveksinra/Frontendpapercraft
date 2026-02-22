'use client';

import { useCallback, useRef, useState } from 'react';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  /** Debounce delay in milliseconds. Default 1500. */
  delay?: number;
  /** The save function to call. Must return a promise. */
  onSave: (data: unknown) => Promise<void>;
}

export function useAutoSave({ delay = 1500, onSave }: UseAutoSaveOptions) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const trigger = useCallback(
    (data: unknown) => {
      const serialized = JSON.stringify(data);

      // Skip if data has not changed
      if (serialized === lastSavedRef.current) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        setStatus('saving');
        try {
          await onSave(data);
          lastSavedRef.current = serialized;
          setStatus('saved');
        } catch {
          setStatus('error');
        }
      }, delay);
    },
    [delay, onSave]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { status, trigger, cancel };
}
