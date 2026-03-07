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

function getInitialState(referenceType: string, referenceId: string): AccessResult {
  if (!referenceType || !referenceId) {
    return { hasAccess: false, isLoading: false };
  }
  const cached = accessCache.get(`${referenceType}:${referenceId}`);
  if (cached) {
    return { ...cached, isLoading: false };
  }
  return { hasAccess: false, isLoading: true };
}

export function useAccess(referenceType: string, referenceId: string): AccessResult {
  const [result, setResult] = useState<AccessResult>(
    () => getInitialState(referenceType, referenceId)
  );
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const skip = !referenceType || !referenceId;
  const cacheKey = `${referenceType}:${referenceId}`;
  const hasCached = !skip && accessCache.has(cacheKey);

  useEffect(() => {
    if (skip || hasCached) {
      return undefined;
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
  }, [referenceType, referenceId, skip, hasCached, cacheKey]);

  return result;
}
