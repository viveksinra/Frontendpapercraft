'use client';

import { AuthGuard } from '@/components/auth-guard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { StudentLayout } from '@/components/layouts/StudentLayout';

export default function StudentRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRole="student">
        <StudentLayout>{children}</StudentLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
