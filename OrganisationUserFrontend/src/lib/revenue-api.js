import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Revenue Dashboard ────────────────────────────────────────────────────

export async function getOverview(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.revenue.overview(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getByProduct(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.revenue.byProduct(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getByCategory(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.revenue.byCategory(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getTimeSeries(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.revenue.timeSeries(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getTransactions(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.revenue.transactions(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getTopProducts(companyId, limit = 10) {
  const url = backendUrl(v2Endpoints.revenue.topProducts(companyId));
  const res = await axios.get(url, { params: { limit }, headers: headers(companyId) });
  return res.data;
}
