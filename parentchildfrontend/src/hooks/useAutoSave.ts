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
  const savingRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  const trigger = useCallback(
    (data: unknown) => {
      const serialized = JSON.stringify(data);

      // Skip if data has not changed
      if (serialized === lastSavedRef.current) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        // Prevent concurrent saves
        if (savingRef.current) return;
        savingRef.current = true;
        setStatus('saving');
        try {
          await onSave(data);
          lastSavedRef.current = serialized;
          retryCountRef.current = 0;
          setStatus('saved');
        } catch {
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            savingRef.current = false;
            // Retry after a short backoff
            timerRef.current = setTimeout(() => trigger(data), 1000 * retryCountRef.current);
            return;
          }
          setStatus('error');
          retryCountRef.current = 0;
        } finally {
          savingRef.current = false;
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
