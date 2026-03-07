'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import axiosInstance, { endpoints } from '@/lib/axios';

const JWT_STORAGE_KEY = 'jwt_access_token';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'parent';
  studentCode?: string;
  accessToken?: string;
  [key: string]: any;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  registerStudent: (email: string, password: string, name: string, orgCode: string) => Promise<{ studentCode: string }>;
  registerParent: (email: string, password: string, name: string) => Promise<void>;
  register: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationCode: string;
    role: 'student' | 'parent';
    studentCode?: string;
  }) => Promise<void>;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { checkUserSession(); }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axiosInstance.post(endpoints.auth.signIn, { email, password });
    const { accessToken, user } = res.data;
    setSession(accessToken);
    const fullUser = { ...user, accessToken };
    setState({ user: fullUser, loading: false });
    return fullUser;
  }, [setState]);

  const registerStudent = useCallback(async (email: string, password: string, name: string, orgCode: string) => {
    const res = await axiosInstance.post(endpoints.auth.studentSignup, {
      email,
      password,
      name,
      orgCode,
    });
    const { accessToken, user, student } = res.data;
    setSession(accessToken);
    setState({
      user: { ...user, role: 'student', studentCode: student?.studentCode, accessToken },
      loading: false,
    });
    return { studentCode: student?.studentCode || '' };
  }, [setState]);

  const registerParent = useCallback(async (email: string, password: string, name: string) => {
    const res = await axiosInstance.post(endpoints.auth.parentSignup, {
      email,
      password,
      name,
    });
    const { accessToken, user } = res.data;
    setSession(accessToken);
    setState({ user: { ...user, role: 'parent', accessToken }, loading: false });
  }, [setState]);

  // Legacy register function for backward compat
  const register = useCallback(async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationCode: string;
    role: 'student' | 'parent';
    studentCode?: string;
  }) => {
    const res = await axiosInstance.post(endpoints.auth.signUp, payload);
    const { accessToken, user } = res.data;
    if (accessToken) {
      setSession(accessToken);
      setState({ user: { ...user, accessToken }, loading: false });
    }
  }, [setState]);

  const logout = useCallback(() => {
    setSession(null);
    setState({ user: null, loading: false });
  }, [setState]);

  const status = state.loading ? 'loading' : state.user ? 'authenticated' : 'unauthenticated';

  const value = useMemo<AuthState>(() => ({
    user: state.user,
    loading: status === 'loading',
    authenticated: status === 'authenticated',
    unauthenticated: status === 'unauthenticated',
    checkUserSession,
    login,
    registerStudent,
    registerParent,
    register,
    logout,
  }), [state.user, status, checkUserSession, login, registerStudent, registerParent, register, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
