import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Fee Records ───────────────────────────────────────────────────────────

export async function listFees(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.fees.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function updateFee(companyId, studentId, data) {
  const url = backendUrl(v2Endpoints.fees.update(companyId, studentId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function bulkUpdateFees(companyId, data) {
  const url = backendUrl(v2Endpoints.fees.bulk(companyId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function sendFeeReminder(companyId, data) {
  const url = backendUrl(v2Endpoints.fees.sendReminder(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}
