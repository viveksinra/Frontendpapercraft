import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function getTenantId() {
  if (typeof window === 'undefined') return 'devTenant';
  const host = window.location?.host || '';
  return host.includes('localhost') ? 'devTenant' : host.split(':')[0];
}

function buildCompanyHeaders(companyId) {
  if (!companyId) {
    throw new Error('Active company is required');
  }
  return {
    'X-Tenant-ID': getTenantId(),
    'X-Company-ID': companyId,
  };
}

function rememberCompanyId(value) {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined' || !value) return;
  try {
    sessionStorage.setItem('active_company_id', value);
  } catch {
    // ignore
  }
}

export async function getCompanies() {
  const url = backendUrl(v2Endpoints.companies.list);
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
    },
    withCredentials: true,
  });
  const response = res.data || {};
  return {
    companies: response.companies || [],
    activeCompanyId: response.activeCompanyId || null,
    lastActiveCompanyId: response.lastActiveCompanyId || null,
  };
}

export async function createCompany(name, username) {
  const url = backendUrl(v2Endpoints.companies.create);
  const res = await axios.post(
    url,
    { name, username },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
      },
      withCredentials: true,
    }
  );
  const company = res.data?.company;
  rememberCompanyId(company?.id || company?._id);
  return company;
}

export async function selectActiveCompany(companyId) {
  const url = backendUrl(v2Endpoints.companies.select(companyId));
  const res = await axios.post(
    url,
    {},
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
      withCredentials: true,
    }
  );
  rememberCompanyId(companyId);
  return res.data?.companyId || companyId;
}

export function getActiveCompanyIdFromCookie() {
  if (typeof document === 'undefined') return null;
  try {
    const cookies = document.cookie ? document.cookie.split(';').map((c) => c.trim()) : [];
    const activeCookie = cookies.find((c) => c.startsWith('active_company='));
    if (activeCookie) {
      const value = decodeURIComponent(activeCookie.split('=').slice(1).join('='));
      if (value) {
        return value;
      }
    }
    if (typeof sessionStorage !== 'undefined') {
      const sessionValue = sessionStorage.getItem('active_company_id');
      if (sessionValue) return sessionValue;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchPublishCoachSnapshot(companyId) {
  const url = backendUrl(`/api/v2/companies/${companyId}/publish/coach`);
  const res = await axios.get(url, {
    headers: buildCompanyHeaders(companyId),
    withCredentials: true,
  });
  return res.data?.snapshot || null;
}

export async function enqueuePublishCoach(companyId, payload = {}) {
  const url = backendUrl(`/api/v2/companies/${companyId}/publish/coach`);
  const res = await axios.post(
    url,
    { destination: payload.destination, limit: payload.limit },
    {
      headers: buildCompanyHeaders(companyId),
      withCredentials: true,
    }
  );
  return {
    result: res.data?.result || null,
    snapshot: res.data?.snapshot || null,
  };
}

export async function getCompanyInfo(companyId) {
  const url = backendUrl(v2Endpoints.companies.info(companyId));
  const res = await axios.get(url, {
    headers: buildCompanyHeaders(companyId),
    withCredentials: true,
  });
  return res.data?.company || null;
}

export async function updateCompanyInfo(companyId, data) {
  const url = backendUrl(v2Endpoints.companies.info(companyId));
  const res = await axios.patch(url, data, {
    headers: buildCompanyHeaders(companyId),
    withCredentials: true,
  });
  return res.data?.company || null;
}


