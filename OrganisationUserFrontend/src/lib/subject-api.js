import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function getSubjectTree(companyId) {
  const url = backendUrl(v2Endpoints.subjects.tree(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createSubject(companyId, data) {
  const url = backendUrl(v2Endpoints.subjects.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function getSubject(companyId, subjectId) {
  const url = backendUrl(v2Endpoints.subjects.detail(companyId, subjectId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function updateSubject(companyId, subjectId, data) {
  const url = backendUrl(v2Endpoints.subjects.update(companyId, subjectId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteSubject(companyId, subjectId) {
  const url = backendUrl(v2Endpoints.subjects.delete(companyId, subjectId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function moveSubject(companyId, subjectId, data) {
  const url = backendUrl(v2Endpoints.subjects.move(companyId, subjectId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function reorderSubjects(companyId, data) {
  const url = backendUrl(v2Endpoints.subjects.reorder(companyId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}
