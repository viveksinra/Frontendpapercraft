import NProgress from 'nprogress';
import { useMemo, useCallback } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';

function isEqualPath(a, b) {
  try {
    const urlA = new URL(a, 'http://localhost');
    const urlB = new URL(b, 'http://localhost');
    return urlA.pathname === urlB.pathname;
  } catch {
    return a === b;
  }
}

// ----------------------------------------------------------------------

/**
 * Customized useRouter hook with NProgress integration.
 */

export function useRouter() {
  const nextRouter = useNextRouter();

  const push = useCallback(
    (href, options) => {
      if (
        typeof window !== 'undefined' &&
        !isEqualPath(href, window.location.href, { deep: false })
      ) {
        NProgress.start();
      }
      nextRouter.push(href, options);
    },
    [nextRouter]
  );

  const replace = useCallback(
    (href, options) => {
      if (
        typeof window !== 'undefined' &&
        !isEqualPath(href, window.location.href, { deep: false })
      ) {
        NProgress.start();
      }
      nextRouter.replace(href, options);
    },
    [nextRouter]
  );

  const router = useMemo(
    () => ({
      ...nextRouter,
      push,
      replace,
    }),
    [nextRouter, push, replace]
  );

  return router;
}
