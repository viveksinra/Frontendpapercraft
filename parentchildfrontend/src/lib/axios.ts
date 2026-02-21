import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:2040';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.variant && response.data?.myData) {
      if (response.data.myData.accessToken) {
        response.data.accessToken = response.data.myData.accessToken;
      }
      response.data = { ...response.data, ...response.data.myData };
    }
    return response;
  },
  (error) => {
    const errorData = error?.response?.data;
    let message = 'Something went wrong!';
    if (errorData?.message) message = errorData.message;
    else if (error?.message) message = error.message;
    const enhancedError = new Error(message);
    (enhancedError as any).status = error?.response?.status;
    (enhancedError as any).response = error?.response;
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;

export const endpoints = {
  auth: {
    me: '/api/v2/auth/me',
    signIn: '/api/v2/auth/login',
    signUp: '/api/v2/auth/signup',
  },
};
