'use client';

import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function getTenantId() {
  if (typeof window === 'undefined') return 'devTenant';
  const host = window.location?.host || '';
  return host.includes('localhost') ? 'devTenant' : host.split(':')[0];
}

function buildHeaders(companyId) {
  const headers = {
    'X-Tenant-ID': getTenantId(),
  };
  if (companyId) {
    headers['X-Company-ID'] = companyId;
  }
  return headers;
}

export async function fetchCompanyHealth(companyId) {
  if (!companyId) throw new Error('companyId is required');
  const url = backendUrl(v2Endpoints.companies.settings(companyId));
  try {
    const res = await axios.get(url, {
      headers: buildHeaders(companyId),
      withCredentials: true,
    });
    // Company settings already comes in myData via axios interceptor
    return res.data;
  } catch (err) {
    // Return null for 404 - route may not be available yet
    if (err.status === 404 || err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}

