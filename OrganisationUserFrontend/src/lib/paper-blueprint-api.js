import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function listBlueprints(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.paperBlueprints.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getBlueprint(companyId, blueprintId) {
  const url = backendUrl(v2Endpoints.paperBlueprints.detail(companyId, blueprintId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createBlueprint(companyId, data) {
  const url = backendUrl(v2Endpoints.paperBlueprints.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateBlueprint(companyId, blueprintId, data) {
  const url = backendUrl(v2Endpoints.paperBlueprints.update(companyId, blueprintId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteBlueprint(companyId, blueprintId) {
  const url = backendUrl(v2Endpoints.paperBlueprints.delete(companyId, blueprintId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function cloneBlueprint(companyId, blueprintId) {
  const url = backendUrl(v2Endpoints.paperBlueprints.clone(companyId, blueprintId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function validateBlueprint(companyId, blueprintId) {
  const url = backendUrl(v2Endpoints.paperBlueprints.validate(companyId, blueprintId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}
