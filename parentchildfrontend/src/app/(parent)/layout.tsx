'use client';

import { AuthGuard } from '@/components/auth-guard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ParentLayout } from '@/components/layouts/ParentLayout';

export default function ParentRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRole="parent">
        <ParentLayout>{children}</ParentLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
