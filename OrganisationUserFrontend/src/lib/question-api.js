import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function listQuestions(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.questions.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getQuestion(companyId, questionId) {
  const url = backendUrl(v2Endpoints.questions.detail(companyId, questionId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createQuestion(companyId, data) {
  const url = backendUrl(v2Endpoints.questions.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateQuestion(companyId, questionId, data) {
  const url = backendUrl(v2Endpoints.questions.update(companyId, questionId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function archiveQuestion(companyId, questionId) {
  const url = backendUrl(v2Endpoints.questions.archive(companyId, questionId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function restoreQuestion(companyId, questionId) {
  const url = backendUrl(v2Endpoints.questions.restore(companyId, questionId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function duplicateQuestion(companyId, questionId) {
  const url = backendUrl(v2Endpoints.questions.duplicate(companyId, questionId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function submitForReview(companyId, questionId) {
  const url = backendUrl(v2Endpoints.questions.review(companyId, questionId));
  const res = await axios.patch(url, { action: 'submit' }, { headers: headers(companyId) });
  return res.data;
}

export async function approveQuestion(companyId, questionId, notes) {
  const url = backendUrl(v2Endpoints.questions.review(companyId, questionId));
  const res = await axios.patch(url, { action: 'approve', notes }, { headers: headers(companyId) });
  return res.data;
}

export async function rejectQuestion(companyId, questionId, notes) {
  const url = backendUrl(v2Endpoints.questions.review(companyId, questionId));
  const res = await axios.patch(url, { action: 'reject', notes }, { headers: headers(companyId) });
  return res.data;
}

export async function getQuestionStats(companyId) {
  const url = backendUrl(v2Endpoints.questions.stats(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function startBulkImport(companyId, data) {
  const url = backendUrl(v2Endpoints.questions.bulkImport(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function getImportJobStatus(companyId, jobId) {
  const url = backendUrl(v2Endpoints.questions.bulkImportStatus(companyId, jobId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function confirmImport(companyId, jobId, data) {
  const url = backendUrl(v2Endpoints.questions.bulkImportConfirm(companyId, jobId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}
