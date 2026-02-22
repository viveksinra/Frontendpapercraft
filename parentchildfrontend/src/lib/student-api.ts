import axiosInstance, { endpoints } from './axios';

export async function getProfile() {
  const res = await axiosInstance.get(endpoints.student.profile);
  return res.data;
}

export async function updateProfile(payload: {
  dateOfBirth?: string;
  yearGroup?: string;
  school?: string;
  name?: string;
  preferences?: {
    showTimerWarning?: boolean;
    questionFontSize?: 'small' | 'medium' | 'large';
    highContrastMode?: boolean;
  };
}) {
  const res = await axiosInstance.patch(endpoints.student.profile, payload);
  return res.data;
}

export async function getDashboard() {
  const res = await axiosInstance.get(endpoints.student.dashboard);
  return res.data;
}

export async function getTests(params?: {
  status?: 'upcoming' | 'available' | 'completed';
  mode?: string;
  orgId?: string;
  page?: number;
  pageSize?: number;
}) {
  const res = await axiosInstance.get(endpoints.student.tests, { params });
  return res.data;
}

export async function getResults(params?: {
  orgId?: string;
  from?: string;
  to?: string;
  subject?: string;
  page?: number;
  pageSize?: number;
}) {
  const res = await axiosInstance.get(endpoints.student.results, { params });
  return res.data;
}

export async function getResultDetail(testId: string, attemptNumber?: number) {
  const url = attemptNumber
    ? `${endpoints.student.results}/${testId}/${attemptNumber}`
    : `${endpoints.student.results}/${testId}`;
  const res = await axiosInstance.get(url);
  return res.data;
}

export async function getPerformance(orgId?: string) {
  const url = orgId
    ? `${endpoints.student.performance}/${orgId}`
    : endpoints.student.performance;
  const res = await axiosInstance.get(url);
  return res.data;
}

export async function joinOrg(orgCode: string) {
  const res = await axiosInstance.post(endpoints.auth.studentJoinOrg, { orgCode });
  return res.data;
}

// Phase 7: Analytics & Reporting

export async function getAnalytics(params?: { period?: string; forceRefresh?: string }) {
  const res = await axiosInstance.get(endpoints.studentAnalytics.analytics, { params });
  return res.data;
}

export async function getScoreTrend(limit?: number) {
  const res = await axiosInstance.get(endpoints.studentAnalytics.scoreTrend, {
    params: limit ? { limit } : undefined,
  });
  return res.data;
}

export async function getSubjectRadar() {
  const res = await axiosInstance.get(endpoints.studentAnalytics.subjectRadar);
  return res.data;
}

export async function getTopicDrilldown(subjectId: string) {
  const res = await axiosInstance.get(endpoints.studentAnalytics.topicDrilldown(subjectId));
  return res.data;
}

export async function getElevenPlusAnalytics() {
  const res = await axiosInstance.get(endpoints.studentAnalytics.elevenPlus);
  return res.data;
}

export async function getMyReports() {
  const res = await axiosInstance.get(endpoints.studentAnalytics.reports);
  return res.data;
}

export async function downloadReport(reportId: string) {
  const res = await axiosInstance.get(endpoints.studentAnalytics.downloadReport(reportId));
  return res.data;
}
