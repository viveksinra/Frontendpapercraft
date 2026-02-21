'use client';

// ----------------------------------------------------------------------

export function RoleBasedGuard({ children, hasContent, currentRole, allowedRoles }) {
  if (currentRole && allowedRoles && !allowedRoles.includes(currentRole)) {
    return hasContent ? (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <h3 className="mb-2 text-2xl font-bold">Permission denied</h3>
        <p className="text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
    ) : null;
  }

  return <>{children}</>;
}
