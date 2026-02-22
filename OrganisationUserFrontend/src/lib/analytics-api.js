import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function getTenantId() {
  if (typeof window === 'undefined') return 'devTenant';
  const host = window.location?.host || '';
  return host.includes('localhost') ? 'devTenant' : host.split(':')[0];
}

function analyticsBase(companyId) {
  return backendUrl(`/api/v2/companies/${companyId}/analytics`);
}

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function saveConfig(companyId, config) {
  const url = `${analyticsBase(companyId)}/config`;
  const res = await axios.put(
    url,
    { ...config },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
      withCredentials: true,
    }
  );
  return res.data?.config;
}

export async function getConfig(companyId) {
  const url = `${analyticsBase(companyId)}/config`;
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  return res.data?.config || null;
}

// Overview/summary endpoints are not yet part of v2; keep client-side
// helpers returning mock structures for now while we wire analytics
// alerts and config through v2.
export async function getOverview(companyId, dateRange = 7) {
  void companyId;
  void dateRange;
  return { metrics: [], isMockData: true };
}

export async function getSummary(companyId) {
  void companyId;
  return { };
}

export async function listAlerts(companyId) {
  const url = `${analyticsBase(companyId)}/rules`;
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  const rules = res.data?.rules || [];
  // Events live under /events; fetch best-effort, but don't fail UI if missing
  let events = [];
  try {
    const eventsRes = await axios.get(`${analyticsBase(companyId)}/events`, {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
    });
    events = eventsRes.data?.events || [];
  } catch {
    events = [];
  }
  return { rules, events };
}

export async function createAlert(companyId, payload) {
  const url = `${analyticsBase(companyId)}/rules`;
  const res = await axios.post(
    url,
    { ...payload },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
    }
  );
  return res.data?.rule;
}

export async function updateAlert(companyId, alertId, payload) {
  const url = `${analyticsBase(companyId)}/rules/${alertId}`;
  const res = await axios.patch(
    url,
    { ...payload },
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
    }
  );
  return res.data?.rule;
}

export async function deleteAlert(companyId, alertId) {
  const url = `${analyticsBase(companyId)}/rules/${alertId}`;
  const res = await axios.delete(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  return res.data;
}

export async function testAlert(companyId, payload) {
  // No direct v2 test endpoint; emulate by creating a one-off event client-side.
  void companyId;
  return { simulated: true, payload };
}

// ─── Phase 7: Student Analytics ─────────────────────────────────────────────

export async function getStudentAnalytics(companyId, studentId, params = {}) {
  const url = backendUrl(v2Endpoints.analytics.studentAnalytics(companyId, studentId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getStudentScoreTrend(companyId, studentId, params = {}) {
  const url = backendUrl(v2Endpoints.analytics.studentScoreTrend(companyId, studentId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getStudentSubjectRadar(companyId, studentId, params = {}) {
  const url = backendUrl(v2Endpoints.analytics.studentSubjectRadar(companyId, studentId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getStudentTopicDrilldown(companyId, studentId, subjectId, params = {}) {
  const url = backendUrl(v2Endpoints.analytics.studentTopicDrilldown(companyId, studentId, subjectId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getStudentTestComparison(companyId, studentId, testId, params = {}) {
  const url = backendUrl(v2Endpoints.analytics.studentTestComparison(companyId, studentId, testId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getStudentTimeTrend(companyId, studentId, params = {}) {
  const url = backendUrl(v2Endpoints.analytics.studentTimeTrend(companyId, studentId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

// ─── Phase 7: Class Analytics ───────────────────────────────────────────────

export async function getClassAnalytics(companyId, classId, params = {}) {
  const url = backendUrl(v2Endpoints.classAnalytics.overview(companyId, classId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getClassTestAnalytics(companyId, classId, testId, params = {}) {
  const url = backendUrl(v2Endpoints.classAnalytics.test(companyId, classId, testId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getClassTopicHeatmap(companyId, classId, subjectId, params = {}) {
  const url = backendUrl(v2Endpoints.classAnalytics.heatmap(companyId, classId, subjectId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getClassTrend(companyId, classId, params = {}) {
  const url = backendUrl(v2Endpoints.classAnalytics.trend(companyId, classId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getClassRankings(companyId, classId, testId, params = {}) {
  const url = backendUrl(v2Endpoints.classAnalytics.rankings(companyId, classId, testId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

// ─── Phase 7: Institute Analytics ───────────────────────────────────────────

export async function getInstituteOverview(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.instituteAnalytics.overview(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getEnrollmentTrends(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.instituteAnalytics.enrollmentTrends(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getTeacherActivity(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.instituteAnalytics.teacherActivity(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getContentUsage(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.instituteAnalytics.contentUsage(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getStudentRetention(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.instituteAnalytics.studentRetention(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getQuestionBankStats(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.instituteAnalytics.questionBankStats(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

// ─── Phase 7: Question Analytics ────────────────────────────────────────────

export async function listQuestionAnalytics(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.questionAnalytics.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getQuestionAnalytics(companyId, questionId) {
  const url = backendUrl(v2Endpoints.questionAnalytics.detail(companyId, questionId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getProblematicQuestions(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.questionAnalytics.problematic(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getDifficultyCalibration(companyId) {
  const url = backendUrl(v2Endpoints.questionAnalytics.calibration(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

// ─── Phase 7: 11+ Analytics ────────────────────────────────────────────────

export async function getElevenPlusBand(companyId, studentId) {
  const url = backendUrl(v2Endpoints.elevenPlusAnalytics.band(companyId, studentId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getElevenPlusComponents(companyId, studentId) {
  const url = backendUrl(v2Endpoints.elevenPlusAnalytics.components(companyId, studentId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getElevenPlusCohortPercentile(companyId, studentId) {
  const url = backendUrl(v2Endpoints.elevenPlusAnalytics.cohortPercentile(companyId, studentId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getElevenPlusConfig(companyId) {
  const url = backendUrl(v2Endpoints.elevenPlusAnalytics.config(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function updateElevenPlusConfig(companyId, data) {
  const url = backendUrl(v2Endpoints.elevenPlusAnalytics.config(companyId));
  const res = await axios.put(url, data, { headers: headers(companyId) });
  return res.data;
}
