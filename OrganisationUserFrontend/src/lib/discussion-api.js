import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// --- Threads ---

export async function listThreads(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.discussions.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function createThread(companyId, data) {
  const url = backendUrl(v2Endpoints.discussions.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function getThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.detail(companyId, threadId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function updateThread(companyId, threadId, data) {
  const url = backendUrl(v2Endpoints.discussions.update(companyId, threadId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.delete(companyId, threadId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function upvoteThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.upvote(companyId, threadId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function flagThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.flag(companyId, threadId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function lockThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.lock(companyId, threadId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function unlockThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.unlock(companyId, threadId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function pinThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.pin(companyId, threadId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function unpinThread(companyId, threadId) {
  const url = backendUrl(v2Endpoints.discussions.unpin(companyId, threadId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

// --- Replies ---

export async function getReplies(companyId, threadId, params = {}) {
  const url = backendUrl(v2Endpoints.discussions.replies(companyId, threadId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function createReply(companyId, threadId, data) {
  const url = backendUrl(v2Endpoints.discussions.replies(companyId, threadId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function editReply(companyId, replyId, data) {
  const url = backendUrl(v2Endpoints.discussions.editReply(companyId, replyId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteReply(companyId, replyId) {
  const url = backendUrl(v2Endpoints.discussions.deleteReply(companyId, replyId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function upvoteReply(companyId, replyId) {
  const url = backendUrl(v2Endpoints.discussions.upvoteReply(companyId, replyId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function flagReply(companyId, replyId) {
  const url = backendUrl(v2Endpoints.discussions.flagReply(companyId, replyId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function acceptAnswer(companyId, threadId, replyId) {
  const url = backendUrl(v2Endpoints.discussions.acceptAnswer(companyId, threadId, replyId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

// --- Moderation ---

export async function getFlaggedContent(companyId) {
  const url = backendUrl(v2Endpoints.discussions.flagged(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}
