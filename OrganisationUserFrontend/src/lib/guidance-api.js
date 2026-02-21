'use client';

import axios from 'src/lib/axios';
import { backendUrl } from 'src/lib/v2-endpoints';

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

function unwrapPayload(response) {
  if (!response) return null;
  if (response.data?.myData) return response.data.myData;
  return response.data;
}

export async function fetchGuidanceRibbon(companyId) {
  if (!companyId) throw new Error('companyId is required');
  const url = backendUrl(`/api/v2/companies/${companyId}/guidance`);
  try {
    const res = await axios.get(url, {
      headers: buildHeaders(companyId),
      withCredentials: true,
    });
    return unwrapPayload(res);
  } catch (err) {
    // Return null for 404 - route may not be available yet
    if (err.status === 404 || err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function dismissGuidanceRibbon(companyId) {
  if (!companyId) throw new Error('companyId is required');
  const url = backendUrl(`/api/v2/companies/${companyId}/guidance/dismiss`);
  const res = await axios.post(
    url,
    {},
    {
      headers: buildHeaders(companyId),
      withCredentials: true,
    }
  );
  return unwrapPayload(res);
}

export async function restoreGuidanceRibbon(companyId) {
  if (!companyId) throw new Error('companyId is required');
  const url = backendUrl(`/api/v2/companies/${companyId}/guidance/dismiss`);
  const res = await axios.delete(url, {
    headers: buildHeaders(companyId),
    withCredentials: true,
  });
  return unwrapPayload(res);
}


