'use client';

import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function getTenantId() {
  if (typeof window === 'undefined') return 'devTenant';
  const host = window.location?.host || '';
  return host.includes('localhost') ? 'devTenant' : host.split(':')[0];
}

export async function getBootstrapStatus(companyId) {
  if (!companyId) throw new Error('companyId is required');
  const url = backendUrl(v2Endpoints.companies.bootstrapStatus(companyId));
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  return res.data?.status || null;
}

// v2 currently exposes bootstrap status; if we later add an explicit
// events endpoint under /companies/:companyId/bootstrap-events, we can
// wire it here. For now we keep this as a no-op to avoid breaking callers.
export async function recordBootstrapEvent(companyId, payload = {}) {
  if (!companyId) throw new Error('companyId is required');
  const url = backendUrl(v2Endpoints.companies.bootstrapStatus(companyId));
  await axios.post(
    url,
    { ...payload },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
    }
  );
}

