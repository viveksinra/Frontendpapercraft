import axios from 'src/lib/axios';
import { backendUrl } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Student endpoints ────────────────────────────────────────────────────

const studentEndpoints = {
  list: (companyId) => `/api/v2/companies/${companyId}/students`,
  detail: (companyId, studentId) => `/api/v2/companies/${companyId}/students/${studentId}`,
  parents: (companyId, studentId) => `/api/v2/companies/${companyId}/students/${studentId}/parents`,
  testHistory: (companyId, studentId) => `/api/v2/companies/${companyId}/students/${studentId}/test-history`,
};

// ─── API functions ────────────────────────────────────────────────────────

export async function listStudents(companyId, params = {}) {
  const url = backendUrl(studentEndpoints.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getStudentProfile(companyId, studentId) {
  const url = backendUrl(studentEndpoints.detail(companyId, studentId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getStudentParents(companyId, studentId) {
  const url = backendUrl(studentEndpoints.parents(companyId, studentId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getStudentTestHistory(companyId, studentId) {
  const url = backendUrl(studentEndpoints.testHistory(companyId, studentId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}
