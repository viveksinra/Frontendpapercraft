import axiosInstance, { endpoints } from './axios';

export async function getNotifications(
  companyId: string,
  params?: { category?: string; isRead?: string; page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(endpoints.notifications.list(companyId), { params });
  return res.data;
}

export async function getUnreadNotificationCount(companyId: string) {
  const res = await axiosInstance.get(endpoints.notifications.unreadCount(companyId));
  return res.data;
}

export async function markNotificationAsRead(companyId: string, notificationId: string) {
  const res = await axiosInstance.patch(endpoints.notifications.read(companyId, notificationId));
  return res.data;
}

export async function markAllNotificationsAsRead(companyId: string, category?: string) {
  const res = await axiosInstance.post(endpoints.notifications.readAll(companyId), { category });
  return res.data;
}

export async function archiveNotification(companyId: string, notificationId: string) {
  const res = await axiosInstance.delete(endpoints.notifications.archive(companyId, notificationId));
  return res.data;
}

export async function getNotificationPreferences(companyId: string) {
  const res = await axiosInstance.get(endpoints.notificationPreferences.get(companyId));
  return res.data;
}

export async function updateNotificationPreferences(companyId: string, data: Record<string, unknown>) {
  const res = await axiosInstance.put(endpoints.notificationPreferences.update(companyId), data);
  return res.data;
}
