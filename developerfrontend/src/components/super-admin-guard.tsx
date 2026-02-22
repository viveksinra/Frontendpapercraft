'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ShieldX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          <Sparkles className="h-7 w-7 text-white animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <div className="flex items-center gap-2 justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-medium text-muted-foreground">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="max-w-sm text-muted-foreground">
            This dashboard is restricted to super administrators only.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => { logout(); router.replace('/auth/sign-in'); }}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
