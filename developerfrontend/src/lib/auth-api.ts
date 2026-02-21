import axiosInstance, { endpoints } from './axios';

export async function signIn(email: string, password: string) {
  const res = await axiosInstance.post(endpoints.auth.signIn, { email, password });
  return res.data;
}

export async function getMe() {
  const res = await axiosInstance.get(endpoints.auth.me);
  return res.data;
}
