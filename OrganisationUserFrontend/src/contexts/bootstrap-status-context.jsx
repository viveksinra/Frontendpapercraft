'use client';

import { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { getBootstrapStatus, recordBootstrapEvent } from 'src/lib/bootstrap-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

const BootstrapStatusContext = createContext({
  status: null,
  loading: true,
  error: null,
  activeCompanyId: null,
  refresh: () => {},
  logEvent: () => Promise.resolve(),
});

function computeProgress(status) {
  if (!status) return 0;
  const steps = [status.brandingReady, status.datasetReady, status.sampleProjectReady, status.pairingReady];
  const complete = steps.filter(Boolean).length;
  return Math.round((complete / steps.length) * 100);
}

export function BootstrapStatusProvider({ children }) {
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hydrateCompany = useCallback(() => {
    try {
      const id = getActiveCompanyIdFromCookie();
      setActiveCompanyId(id);
      return id;
    } catch {
      setActiveCompanyId(null);
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    const companyId = hydrateCompany();
    if (!companyId) {
      setStatus(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getBootstrapStatus(companyId);
      if (response) {
        const extended = {
          ...response,
          allReady: Boolean(
            response.brandingReady && response.datasetReady && response.sampleProjectReady
          ),
          progress: computeProgress(response),
        };
        setStatus(extended);
      } else {
        setStatus(null);
      }
    } catch (err) {
      console.error('[BootstrapStatusProvider] failed to load status', err);
      setError(err?.message || 'Failed to load onboarding status');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [hydrateCompany]);

  const logEvent = useCallback(
    async (event) => {
      const companyId = activeCompanyId || hydrateCompany();
      if (!companyId) return;
      try {
        await recordBootstrapEvent(companyId, event);
      } catch (err) {
        console.warn('[BootstrapStatusProvider] failed to record onboarding event', err);
      }
    },
    [activeCompanyId, hydrateCompany]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!status?.latestGenerationRun) return undefined;
    const activeStatuses = ['queued', 'running'];
    if (!activeStatuses.includes(status.latestGenerationRun.status)) {
      return undefined;
    }
    const interval = setInterval(() => {
      refresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [status?.latestGenerationRun?.status, refresh]);

  const value = useMemo(
    () => ({
      status,
      loading,
      error,
      activeCompanyId,
      refresh,
      logEvent,
    }),
    [status, loading, error, activeCompanyId, refresh, logEvent]
  );

  return (
    <BootstrapStatusContext.Provider value={value}>{children}</BootstrapStatusContext.Provider>
  );
}

BootstrapStatusProvider.propTypes = {
  children: PropTypes.node,
};

export function useBootstrapStatus() {
  return useContext(BootstrapStatusContext);
}


