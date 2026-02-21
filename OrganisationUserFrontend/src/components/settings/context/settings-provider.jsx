'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { SettingsContext } from './settings-context';
import { SETTINGS_STORAGE_KEY } from '../settings-config';

// ----------------------------------------------------------------------

function getCookieValue(key) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function setCookieValue(key, value, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
}

function getLocalStorageValue(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalStorageValue(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => deepEqual(a[key], b[key]));
}

function useStorageState(key, initialValue, { get, set }) {
  const [state, _setState] = useState(() => get(key) ?? initialValue);

  const setState = useCallback(
    (valueOrFn) => {
      _setState((prev) => {
        const next = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
        set(key, next);
        return next;
      });
    },
    [key, set]
  );

  const resetState = useCallback(
    (resetValue) => {
      set(key, resetValue);
      _setState(resetValue);
    },
    [key, set]
  );

  const setField = useCallback(
    (field, value) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    [setState]
  );

  return { state, setState, resetState, setField };
}

// ----------------------------------------------------------------------

export function SettingsProvider({
  children,
  cookieSettings,
  defaultSettings,
  storageKey = SETTINGS_STORAGE_KEY,
}) {
  const isCookieEnabled = !!cookieSettings;
  const initialSettings = isCookieEnabled ? cookieSettings : defaultSettings;

  const storageAdapter = useMemo(
    () =>
      isCookieEnabled
        ? { get: getCookieValue, set: setCookieValue }
        : { get: getLocalStorageValue, set: setLocalStorageValue },
    [isCookieEnabled]
  );

  const { state, setState, resetState, setField } = useStorageState(
    storageKey,
    initialSettings,
    storageAdapter
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !deepEqual(state, defaultSettings);

  const onReset = useCallback(() => {
    resetState(defaultSettings);
  }, [defaultSettings, resetState]);

  // Version check and reset handling
  useEffect(() => {
    const storedValue = storageAdapter.get(storageKey);

    if (storedValue) {
      try {
        if (!storedValue.version || storedValue.version !== defaultSettings.version) {
          onReset();
        }
      } catch {
        onReset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedValue = useMemo(
    () => ({
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      state,
      setState,
      setField,
    }),
    [canReset, onReset, openDrawer, onCloseDrawer, onToggleDrawer, state, setField, setState]
  );

  return <SettingsContext value={memoizedValue}>{children}</SettingsContext>;
}
