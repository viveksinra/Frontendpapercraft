'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import axiosInstance, { endpoints } from '@/lib/axios';

const JWT_STORAGE_KEY = 'jwt_access_token';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isSuperAdmin?: boolean;
  accessToken?: string;
  [key: string]: any;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  isSuperAdmin: boolean;
  checkUserSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

function isValidToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return false;
    const decoded = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

function setSession(token: string | null) {
  if (token) {
    sessionStorage.setItem(JWT_STORAGE_KEY, token);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    sessionStorage.removeItem(JWT_STORAGE_KEY);
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, _setState] = useState<{ user: User | null; loading: boolean }>({ user: null, loading: true });
  const setState = useCallback((patch: Partial<typeof state>) => _setState((prev) => ({ ...prev, ...patch })), []);

  const checkUserSession = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(JWT_STORAGE_KEY);
      if (token && isValidToken(token)) {
        setSession(token);
        const res = await axiosInstance.get(endpoints.auth.me);
        const { user } = res.data;
        setState({ user: { ...user, accessToken: token }, loading: false });
      } else {
        setSession(null);
        setState({ user: null, loading: false });
      }
    } catch {
      setSession(null);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initialization on mount
  useEffect(() => { checkUserSession(); }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axiosInstance.post(endpoints.auth.signIn, { email, password });
    const { accessToken, user } = res.data;
    setSession(accessToken);
    setState({ user: { ...user, accessToken }, loading: false });
  }, [setState]);

  const logout = useCallback(() => {
    setSession(null);
    setState({ user: null, loading: false });
  }, [setState]);

  const status = state.loading ? 'loading' : state.user ? 'authenticated' : 'unauthenticated';
  const isSuperAdmin = Boolean(state.user?.isSuperAdmin || state.user?.role === 'super_admin');

  const value = useMemo<AuthState>(() => ({
    user: state.user,
    loading: status === 'loading',
    authenticated: status === 'authenticated',
    unauthenticated: status === 'unauthenticated',
    isSuperAdmin,
    checkUserSession,
    login,
    logout,
  }), [state.user, status, isSuperAdmin, checkUserSession, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
