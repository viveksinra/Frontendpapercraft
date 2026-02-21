'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, authenticated, isSuperAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace('/auth/sign-in');
    }
  }, [loading, authenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) return null;

  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">This dashboard is restricted to super administrators only.</p>
        <button
          onClick={() => { logout(); router.replace('/auth/sign-in'); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
