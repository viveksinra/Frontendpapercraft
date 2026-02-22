import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function getNotifications(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.notifications.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getUnreadCount(companyId) {
  const url = backendUrl(v2Endpoints.notifications.unreadCount(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function markAsRead(companyId, notificationId) {
  const url = backendUrl(v2Endpoints.notifications.read(companyId, notificationId));
  const res = await axios.patch(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function markAllAsRead(companyId, category) {
  const url = backendUrl(v2Endpoints.notifications.readAll(companyId));
  const res = await axios.post(url, { category }, { headers: headers(companyId) });
  return res.data;
}

export async function archiveNotification(companyId, notificationId) {
  const url = backendUrl(v2Endpoints.notifications.archive(companyId, notificationId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function getPreferences(companyId) {
  const url = backendUrl(v2Endpoints.notificationPreferences.get(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function updatePreferences(companyId, data) {
  const url = backendUrl(v2Endpoints.notificationPreferences.update(companyId));
  const res = await axios.put(url, data, { headers: headers(companyId) });
  return res.data;
}
