import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Announcement CRUD ─────────────────────────────────────────────────────

export async function listAnnouncements(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.announcements.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function createAnnouncement(companyId, data) {
  const url = backendUrl(v2Endpoints.announcements.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteAnnouncement(companyId, announcementId) {
  const url = backendUrl(v2Endpoints.announcements.delete(companyId, announcementId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function pinAnnouncement(companyId, announcementId) {
  const url = backendUrl(v2Endpoints.announcements.pin(companyId, announcementId));
  const res = await axios.patch(url, {}, { headers: headers(companyId) });
  return res.data;
}
