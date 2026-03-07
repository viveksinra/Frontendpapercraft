'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { getCompanies } from 'src/lib/company-api';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
};

const ORG_ALLOWED_ROLES = ['owner', 'admin', 'senior_teacher', 'teacher', 'content_reviewer'];

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const createRedirectPath = (currentPath) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const { method } = CONFIG.auth;
      const signInPath = signInPaths[method];
      const redirectPath = createRedirectPath(signInPath);
      router.replace(redirectPath);
      return;
    }

    // Check if user has an org-level role in at least one company
    try {
      const { companies = [] } = await getCompanies();
      const hasOrgRole = companies.some((c) => ORG_ALLOWED_ROLES.includes(c.role));

      if (!hasOrgRole) {
        setAccessDenied(true);
        setIsChecking(false);
        return;
      }
    } catch (err) {
      console.error('[AuthGuard] failed to verify role', err);
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="max-w-md text-muted-foreground">
          This portal is for organisation staff only. Students and parents should use the student/parent portal instead.
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.clear();
            router.replace(paths.auth.jwt.signIn);
          }}
          className="mt-4 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign out
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
