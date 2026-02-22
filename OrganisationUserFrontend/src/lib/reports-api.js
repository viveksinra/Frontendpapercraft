import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Report Management ──────────────────────────────────────────────────────

export async function listReports(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.reports.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function generateReport(companyId, data) {
  const url = backendUrl(v2Endpoints.reports.generate(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function getReport(companyId, reportId) {
  const url = backendUrl(v2Endpoints.reports.detail(companyId, reportId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function deleteReport(companyId, reportId) {
  const url = backendUrl(v2Endpoints.reports.delete(companyId, reportId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function downloadReport(companyId, reportId) {
  const url = backendUrl(v2Endpoints.reports.download(companyId, reportId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function bulkGenerateReports(companyId, data) {
  const url = backendUrl(v2Endpoints.reports.bulk(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}
