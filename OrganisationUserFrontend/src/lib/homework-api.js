import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Homework CRUD ─────────────────────────────────────────────────────────

export async function listHomework(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.homework.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getHomework(companyId, homeworkId) {
  const url = backendUrl(v2Endpoints.homework.detail(companyId, homeworkId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createHomework(companyId, data) {
  const url = backendUrl(v2Endpoints.homework.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateHomework(companyId, homeworkId, data) {
  const url = backendUrl(v2Endpoints.homework.update(companyId, homeworkId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteHomework(companyId, homeworkId) {
  const url = backendUrl(v2Endpoints.homework.delete(companyId, homeworkId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

// ─── Submissions ───────────────────────────────────────────────────────────

export async function getHomeworkSubmissions(companyId, homeworkId) {
  const url = backendUrl(v2Endpoints.homework.submissions(companyId, homeworkId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function gradeSubmission(companyId, homeworkId, submissionId, data) {
  const url = backendUrl(v2Endpoints.homework.grade(companyId, homeworkId, submissionId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}
