import axiosInstance, { endpoints } from './axios';

export async function listThreads(
  companyId: string,
  params?: { category?: string; search?: string; sortBy?: string; page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(endpoints.discussions.list(companyId), { params });
  return res.data;
}

export async function createThread(companyId: string, data: {
  title: string;
  body: string;
  category?: string;
  tags?: string[];
  classId?: string;
  courseId?: string;
}) {
  const res = await axiosInstance.post(endpoints.discussions.create(companyId), data);
  return res.data;
}

export async function getThread(companyId: string, threadId: string) {
  const res = await axiosInstance.get(endpoints.discussions.detail(companyId, threadId));
  return res.data;
}

export async function getReplies(
  companyId: string,
  threadId: string,
  params?: { page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(endpoints.discussions.replies(companyId, threadId), { params });
  return res.data;
}

export async function createReply(companyId: string, threadId: string, data: {
  body: string;
  parentReplyId?: string;
}) {
  const res = await axiosInstance.post(endpoints.discussions.replies(companyId, threadId), data);
  return res.data;
}

export async function upvoteThread(companyId: string, threadId: string) {
  const res = await axiosInstance.post(endpoints.discussions.upvote(companyId, threadId));
  return res.data;
}

export async function flagThread(companyId: string, threadId: string) {
  const res = await axiosInstance.post(endpoints.discussions.flag(companyId, threadId));
  return res.data;
}

export async function upvoteReply(companyId: string, replyId: string) {
  const res = await axiosInstance.post(endpoints.discussions.upvoteReply(companyId, replyId));
  return res.data;
}
