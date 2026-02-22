import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// --- Student-facing ---

export async function getProfile(companyId) {
  const url = backendUrl(v2Endpoints.gamification.profile(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getStudentProfile(companyId, studentUserId) {
  const url = backendUrl(v2Endpoints.gamification.studentProfile(companyId, studentUserId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getPointsHistory(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.gamification.pointsHistory(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getLeaderboard(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.gamification.leaderboard(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getBadges(companyId) {
  const url = backendUrl(v2Endpoints.gamification.badges(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getStreak(companyId) {
  const url = backendUrl(v2Endpoints.gamification.streak(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

// --- Admin Config ---

export async function getConfig(companyId) {
  const url = backendUrl(v2Endpoints.gamificationConfig.get(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function updateConfig(companyId, data) {
  const url = backendUrl(v2Endpoints.gamificationConfig.update(companyId));
  const res = await axios.put(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function addBadge(companyId, data) {
  const url = backendUrl(v2Endpoints.gamificationConfig.addBadge(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateBadge(companyId, badgeId, data) {
  const url = backendUrl(v2Endpoints.gamificationConfig.updateBadge(companyId, badgeId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteBadge(companyId, badgeId) {
  const url = backendUrl(v2Endpoints.gamificationConfig.deleteBadge(companyId, badgeId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function awardPoints(companyId, data) {
  const url = backendUrl(v2Endpoints.gamificationConfig.awardPoints(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function resetWeeklyLeaderboard(companyId) {
  const url = backendUrl(v2Endpoints.gamificationConfig.resetWeekly(companyId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}
