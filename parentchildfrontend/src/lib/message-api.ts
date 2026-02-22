import axiosInstance, { endpoints } from './axios';

export async function sendMessage(companyId: string, data: {
  recipientId: string;
  recipientRole: string;
  subject?: string;
  body: string;
}) {
  const res = await axiosInstance.post(endpoints.messages.send(companyId), data);
  return res.data;
}

export async function getConversations(companyId: string, params?: { page?: number; pageSize?: number }) {
  const res = await axiosInstance.get(endpoints.messages.conversations(companyId), { params });
  return res.data;
}

export async function getConversationMessages(
  companyId: string,
  otherUserId: string,
  params?: { page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(endpoints.messages.conversation(companyId, otherUserId), { params });
  return res.data;
}

export async function markConversationRead(companyId: string, otherUserId: string) {
  const res = await axiosInstance.post(endpoints.messages.conversationRead(companyId, otherUserId));
  return res.data;
}

export async function markMessageRead(companyId: string, messageId: string) {
  const res = await axiosInstance.patch(endpoints.messages.read(companyId, messageId));
  return res.data;
}

export async function deleteMessage(companyId: string, messageId: string) {
  const res = await axiosInstance.delete(endpoints.messages.delete(companyId, messageId));
  return res.data;
}

export async function getUnreadMessageCount(companyId: string) {
  const res = await axiosInstance.get(endpoints.messages.unreadCount(companyId));
  return res.data;
}

export async function searchMessages(companyId: string, params: { query: string; page?: number; pageSize?: number }) {
  const res = await axiosInstance.get(endpoints.messages.search(companyId), { params });
  return res.data;
}

export async function getSentMessages(companyId: string, params?: { page?: number; pageSize?: number }) {
  const res = await axiosInstance.get(endpoints.messages.sent(companyId), { params });
  return res.data;
}
