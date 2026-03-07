import axiosInstance from './axios';

const BASE = '/api/v2/tests';

export async function startTest(testId: string) {
  const res = await axiosInstance.post(`${BASE}/${testId}/start`);
  return res.data;
}

export async function getAttemptState(testId: string) {
  const res = await axiosInstance.get(`${BASE}/${testId}/attempt`);
  return res.data;
}

export async function submitAnswer(testId: string, questionId: string, answer: any) {
  const res = await axiosInstance.post(`${BASE}/${testId}/answer`, {
    questionId,
    answer,
  });
  return res.data;
}

export async function flagQuestion(testId: string, questionId: string, flagged: boolean = true) {
  const res = await axiosInstance.post(`${BASE}/${testId}/flag`, { questionId, flagged });
  return res.data;
}

export async function submitTest(testId: string) {
  const res = await axiosInstance.post(`${BASE}/${testId}/submit`);
  return res.data;
}

export async function getResult(testId: string) {
  const res = await axiosInstance.get(`${BASE}/${testId}/result`);
  return res.data;
}

export async function startSection(testId: string, sectionIndex: number) {
  const res = await axiosInstance.post(`${BASE}/${testId}/section/${sectionIndex}/start`);
  return res.data;
}

export async function getSectionStatus(testId: string, sectionIndex: number) {
  const res = await axiosInstance.get(`${BASE}/${testId}/section/${sectionIndex}/status`);
  return res.data;
}
