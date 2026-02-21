import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── CRUD ─────────────────────────────────────────────────────────────────

export async function listTests(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.onlineTests.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.detail(companyId, testId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createTest(companyId, data) {
  const url = backendUrl(v2Endpoints.onlineTests.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateTest(companyId, testId, data) {
  const url = backendUrl(v2Endpoints.onlineTests.update(companyId, testId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.delete(companyId, testId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function duplicateTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.duplicate(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

// ─── Lifecycle ────────────────────────────────────────────────────────────

export async function scheduleTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.schedule(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function goLive(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.goLive(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function completeTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.complete(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function archiveTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.archive(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function publishResults(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.publishResults(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function extendTime(companyId, testId, additionalMinutes) {
  const url = backendUrl(v2Endpoints.onlineTests.extendTime(companyId, testId));
  const res = await axios.post(url, { additionalMinutes }, { headers: headers(companyId) });
  return res.data;
}

export async function pauseTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.pause(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function resumeTest(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.resume(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

// ─── Monitoring & Results ─────────────────────────────────────────────────

export async function getTestStats(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.stats(companyId, testId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getLiveStatus(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.liveStatus(companyId, testId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function listAttempts(companyId, testId, params = {}) {
  const url = backendUrl(v2Endpoints.onlineTests.attempts(companyId, testId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function exportResults(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.exportResults(companyId, testId));
  const res = await axios.get(url, { headers: headers(companyId), responseType: 'blob' });
  return res.data;
}

// ─── Grading ──────────────────────────────────────────────────────────────

export async function getUngradedAnswers(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.grading(companyId, testId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function gradeAnswer(companyId, testId, payload) {
  const url = backendUrl(v2Endpoints.onlineTests.grade(companyId, testId));
  const res = await axios.post(url, payload, { headers: headers(companyId) });
  return res.data;
}

export async function finalizeGrading(companyId, testId) {
  const url = backendUrl(v2Endpoints.onlineTests.finalizeGrading(companyId, testId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}
