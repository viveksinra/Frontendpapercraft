import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function sendMessage(companyId, data) {
  const url = backendUrl(v2Endpoints.messages.send(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function getConversations(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.messages.conversations(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getConversationMessages(companyId, otherUserId, params = {}) {
  const url = backendUrl(v2Endpoints.messages.conversation(companyId, otherUserId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function markConversationRead(companyId, otherUserId) {
  const url = backendUrl(v2Endpoints.messages.conversationRead(companyId, otherUserId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function markMessageRead(companyId, messageId) {
  const url = backendUrl(v2Endpoints.messages.read(companyId, messageId));
  const res = await axios.patch(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function deleteMessage(companyId, messageId) {
  const url = backendUrl(v2Endpoints.messages.delete(companyId, messageId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function getUnreadCount(companyId) {
  const url = backendUrl(v2Endpoints.messages.unreadCount(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function searchMessages(companyId, params) {
  const url = backendUrl(v2Endpoints.messages.search(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getSentMessages(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.messages.sent(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}
