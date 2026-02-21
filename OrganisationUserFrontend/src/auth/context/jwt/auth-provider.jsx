'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, _setState] = useState({ user: null, loading: true });
  const setState = useCallback((patch) => _setState((prev) => ({ ...prev, ...patch })), []);

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        console.log('[AuthProvider] token present and valid; len=', String(accessToken).length);
        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me);

        const { user } = res.data;
        console.log('[AuthProvider] /api/auth/me result keys=', Object.keys(res.data || {}), 'hasUser=', Boolean(user));

        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        console.log('[AuthProvider] no valid token; setting unauthenticated');
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
