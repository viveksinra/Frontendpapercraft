'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ShieldX } from 'lucide-react';
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <LayoutDashboard className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="max-w-md text-muted-foreground">
          This dashboard is restricted to super administrators only.
        </p>
        <button
          onClick={() => { logout(); router.replace('/auth/sign-in'); }}
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
