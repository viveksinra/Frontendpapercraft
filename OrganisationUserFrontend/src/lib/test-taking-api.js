import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

// ─── Test-Taking API (student-facing) ─────────────────────────────────────

export async function startTest(testId) {
  const url = backendUrl(v2Endpoints.testTaking.start(testId));
  const res = await axios.post(url);
  return res.data;
}

export async function getAttemptState(testId) {
  const url = backendUrl(v2Endpoints.testTaking.attempt(testId));
  const res = await axios.get(url);
  return res.data;
}

export async function submitAnswer(testId, questionId, answer) {
  const url = backendUrl(v2Endpoints.testTaking.answer(testId));
  const res = await axios.post(url, { questionId, answer });
  return res.data;
}

export async function flagQuestion(testId, questionId, flagged) {
  const url = backendUrl(v2Endpoints.testTaking.flag(testId));
  const res = await axios.post(url, { questionId, flagged });
  return res.data;
}

export async function submitTest(testId) {
  const url = backendUrl(v2Endpoints.testTaking.submit(testId));
  const res = await axios.post(url);
  return res.data;
}

export async function getResult(testId, attemptNumber) {
  const url = attemptNumber
    ? backendUrl(v2Endpoints.testTaking.resultByAttempt(testId, attemptNumber))
    : backendUrl(v2Endpoints.testTaking.result(testId));
  const res = await axios.get(url);
  return res.data;
}

export async function startSection(testId, sectionIndex) {
  const url = backendUrl(v2Endpoints.testTaking.startSection(testId, sectionIndex));
  const res = await axios.post(url);
  return res.data;
}

export async function getSectionStatus(testId, sectionIndex) {
  const url = backendUrl(v2Endpoints.testTaking.sectionStatus(testId, sectionIndex));
  const res = await axios.get(url);
  return res.data;
}
