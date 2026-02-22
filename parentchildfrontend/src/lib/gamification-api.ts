import axiosInstance, { endpoints } from './axios';

export async function getGamificationProfile(companyId: string) {
  const res = await axiosInstance.get(endpoints.gamification.profile(companyId));
  return res.data;
}

export async function getStudentGamificationProfile(companyId: string, studentUserId: string) {
  const res = await axiosInstance.get(endpoints.gamification.studentProfile(companyId, studentUserId));
  return res.data;
}

export async function getPointsHistory(
  companyId: string,
  params?: { page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(endpoints.gamification.pointsHistory(companyId), { params });
  return res.data;
}

export async function getLeaderboard(
  companyId: string,
  params?: { period?: string; page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(endpoints.gamification.leaderboard(companyId), { params });
  return res.data;
}

export async function getBadges(companyId: string) {
  const res = await axiosInstance.get(endpoints.gamification.badges(companyId));
  return res.data;
}

export async function getStreak(companyId: string) {
  const res = await axiosInstance.get(endpoints.gamification.streak(companyId));
  return res.data;
}
