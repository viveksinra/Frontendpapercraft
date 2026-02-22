import axiosInstance, { endpoints } from './axios';

export async function getStudentHomework(params?: { companyId?: string; status?: string }) {
  const res = await axiosInstance.get(endpoints.studentHomework.list, { params });
  return res.data;
}

export async function getStudentHomeworkDetail(homeworkId: string) {
  const res = await axiosInstance.get(endpoints.studentHomework.detail(homeworkId));
  return res.data;
}

export async function submitHomework(homeworkId: string, answers: Array<{ questionId: string; answer: unknown }>) {
  const res = await axiosInstance.post(endpoints.studentHomework.submit(homeworkId), { answers });
  return res.data;
}

export async function getStudentAnnouncements(params?: { companyId?: string }) {
  const res = await axiosInstance.get(endpoints.studentAnnouncements.list, { params });
  return res.data;
}
