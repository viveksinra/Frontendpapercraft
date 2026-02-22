import { useState, useEffect, useRef } from 'react';
import { checkAccess } from '@/lib/store-api';

interface AccessResult {
  hasAccess: boolean;
  isLoading: boolean;
  product?: any;
  purchase?: any;
}

// Simple in-memory cache for access results
const accessCache = new Map<string, { hasAccess: boolean; product?: any; purchase?: any }>();

export function useAccess(referenceType: string, referenceId: string): AccessResult {
  const [result, setResult] = useState<AccessResult>({
    hasAccess: false,
    isLoading: true,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!referenceType || !referenceId) {
      setResult({ hasAccess: false, isLoading: false });
      return;
    }

    const cacheKey = `${referenceType}:${referenceId}`;
    const cached = accessCache.get(cacheKey);

    if (cached) {
      setResult({ ...cached, isLoading: false });
      return;
    }

    let cancelled = false;

    async function check() {
      try {
        const data = await checkAccess(referenceType, referenceId);
        const accessResult = {
          hasAccess: data?.hasAccess ?? false,
          product: data?.product,
          purchase: data?.purchase,
        };

        accessCache.set(cacheKey, accessResult);

        if (!cancelled && mounted.current) {
          setResult({ ...accessResult, isLoading: false });
        }
      } catch (err) {
        console.error('Access check failed:', err);
        if (!cancelled && mounted.current) {
          setResult({ hasAccess: false, isLoading: false });
        }
      }
    }

    check();
    return () => { cancelled = true; };
  }, [referenceType, referenceId]);

  return result;
}
