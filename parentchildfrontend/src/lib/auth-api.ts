import axiosInstance, { endpoints } from './axios';

export async function signIn(email: string, password: string) {
  const res = await axiosInstance.post(endpoints.auth.signIn, { email, password });
  return res.data;
}

export async function signUp(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationCode: string;
  role: 'student' | 'parent';
  studentCode?: string;
}) {
  const res = await axiosInstance.post(endpoints.auth.signUp, payload);
  return res.data;
}

export async function getMe() {
  const res = await axiosInstance.get(endpoints.auth.me);
  return res.data;
}
