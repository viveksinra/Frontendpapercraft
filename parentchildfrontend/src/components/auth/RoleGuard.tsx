'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: 'student' | 'parent';
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated && user) {
      if (user.role !== allowedRole) {
        // Redirect to the correct dashboard
        const target = user.role === 'student' ? '/student/dashboard' : '/parent/dashboard';
        router.replace(target);
      }
    }
  }, [loading, authenticated, user, allowedRole, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authenticated || !user) return null;

  if (user.role !== allowedRole) return null;

  return <>{children}</>;
}
