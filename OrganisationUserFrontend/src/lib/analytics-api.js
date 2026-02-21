import axios from 'src/lib/axios';
import { backendUrl } from 'src/lib/v2-endpoints';

function getTenantId() {
  if (typeof window === 'undefined') return 'devTenant';
  const host = window.location?.host || '';
  return host.includes('localhost') ? 'devTenant' : host.split(':')[0];
}

function analyticsBase(companyId) {
  return backendUrl(`/api/v2/companies/${companyId}/analytics`);
}

export async function saveConfig(companyId, config) {
  const url = `${analyticsBase(companyId)}/config`;
  const res = await axios.put(
    url,
    { ...config },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
      withCredentials: true,
    }
  );
  return res.data?.config;
}

export async function getConfig(companyId) {
  const url = `${analyticsBase(companyId)}/config`;
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  return res.data?.config || null;
}

// Overview/summary endpoints are not yet part of v2; keep client-side
// helpers returning mock structures for now while we wire analytics
// alerts and config through v2.
export async function getOverview(companyId, dateRange = 7) {
  void companyId;
  void dateRange;
  return { metrics: [], isMockData: true };
}

export async function getSummary(companyId) {
  void companyId;
  return { };
}

export async function listAlerts(companyId) {
  const url = `${analyticsBase(companyId)}/rules`;
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  const rules = res.data?.rules || [];
  // Events live under /events; fetch best-effort, but don't fail UI if missing
  let events = [];
  try {
    const eventsRes = await axios.get(`${analyticsBase(companyId)}/events`, {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
    });
    events = eventsRes.data?.events || [];
  } catch {
    events = [];
  }
  return { rules, events };
}

export async function createAlert(companyId, payload) {
  const url = `${analyticsBase(companyId)}/rules`;
  const res = await axios.post(
    url,
    { ...payload },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
    }
  );
  return res.data?.rule;
}

export async function updateAlert(companyId, alertId, payload) {
  const url = `${analyticsBase(companyId)}/rules/${alertId}`;
  const res = await axios.patch(
    url,
    { ...payload },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
    }
  );
  return res.data?.rule;
}

export async function deleteAlert(companyId, alertId) {
  const url = `${analyticsBase(companyId)}/rules/${alertId}`;
  const res = await axios.delete(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  return res.data;
}

export async function testAlert(companyId, payload) {
  // No direct v2 test endpoint; emulate by creating a one-off event client-side.
  void companyId;
  return { simulated: true, payload };
}

