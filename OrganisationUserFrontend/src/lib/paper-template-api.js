import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function listTemplates(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.paperTemplates.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getTemplate(companyId, templateId) {
  const url = backendUrl(v2Endpoints.paperTemplates.detail(companyId, templateId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createTemplate(companyId, data) {
  const url = backendUrl(v2Endpoints.paperTemplates.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateTemplate(companyId, templateId, data) {
  const url = backendUrl(v2Endpoints.paperTemplates.update(companyId, templateId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteTemplate(companyId, templateId) {
  const url = backendUrl(v2Endpoints.paperTemplates.delete(companyId, templateId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function cloneTemplate(companyId, templateId) {
  const url = backendUrl(v2Endpoints.paperTemplates.clone(companyId, templateId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}
