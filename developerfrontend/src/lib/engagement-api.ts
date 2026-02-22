import axiosInstance from './axios';

export interface EngagementOverview {
  totalMessages: number;
  totalNotifications: number;
  totalDiscussionThreads: number;
  totalDiscussionReplies: number;
  totalGamifiedStudents: number;
  totalPointsAwarded: number;
  totalBadgesEarned: number;
  averageStreak: number;
}

export interface OrgEngagementMetrics {
  orgId: string;
  orgName: string;
  messages: number;
  discussions: number;
  gamifiedStudents: number;
  pointsAwarded: number;
  badgesEarned: number;
  averageLevel: number;
}

export interface EngagementTimeSeries {
  date: string;
  messages: number;
  discussions: number;
  gamificationEvents: number;
}

export async function getEngagementOverview(): Promise<EngagementOverview> {
  const res = await axiosInstance.get('/api/v2/admin/engagement-overview');
  return res.data;
}

export async function getOrgEngagementMetrics(params?: { page?: number; limit?: number }): Promise<{ orgs: OrgEngagementMetrics[]; total: number }> {
  const res = await axiosInstance.get('/api/v2/admin/engagement-metrics', { params });
  return res.data;
}

export async function getEngagementTimeSeries(params?: { startDate?: string; endDate?: string; period?: string }): Promise<EngagementTimeSeries[]> {
  const res = await axiosInstance.get('/api/v2/admin/engagement-timeseries', { params });
  return res.data;
}
