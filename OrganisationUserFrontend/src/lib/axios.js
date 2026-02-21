import axios from 'axios';

import { CONFIG } from 'src/global-config';
import { BACKEND_URL } from './v2-endpoints';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Always send/receive cookies when talking to backend directly
  withCredentials: true,
});

// IMPORTANT: Keep auth requests on Next.js API to properly set HttpOnly cookies
// We no longer remap /api/auth/* to the backend here. The Next.js API routes
// proxy to the backend and forward Set-Cookie, ensuring SSR can read cookies.
axiosInstance.interceptors.request.use((config) => {
  // Optionally attach tenant headers for observability/debug
  const maybeAuthEndpoint = [
    '/api/v2/auth/signup',
    '/api/v2/auth/login',
    '/api/v2/auth/me',
    '/api/v2/auth/logout',
    '/api/auth/sign-up',
    '/api/auth/sign-in',
    '/api/auth/me',
  ]
    .some((endpoint) => config.url?.includes(endpoint));
  if (maybeAuthEndpoint) {
    config.headers['X-Tenant-ID'] = config.headers['X-Tenant-ID'] || 'devTenant';
    config.headers['X-Request-ID'] = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return config;
});

// Add Authorization header from sessionStorage for authenticated requests
axiosInstance.interceptors.request.use((config) => {
  const explicitCompany =
    config.headers['X-Company-ID'] ||
    config.params?.companyId ||
    (config.method !== 'get' &&
      config.data &&
      typeof config.data === 'object' &&
      config.data.companyId);

  if (explicitCompany && !config.headers['X-Company-ID']) {
    config.headers['X-Company-ID'] = explicitCompany;
  }

  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers['X-Company-ID']) {
      try {
        const cookies = document.cookie ? document.cookie.split(';').map((c) => c.trim()) : [];
        const activeCookie = cookies.find((c) => c.startsWith('active_company='));
        if (activeCookie) {
          const value = decodeURIComponent(activeCookie.split('=').slice(1).join('='));
          if (value) {
            config.headers['X-Company-ID'] = value;
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle backend envelope format: { message, variant, myData }
    // Transform to match frontend expectations
    if (response.data && response.data.variant && response.data.myData) {
      // For auth endpoints, extract accessToken from myData
      if (response.data.myData.accessToken) {
        response.data.accessToken = response.data.myData.accessToken;
      }
      // Merge myData into response.data for easier access
      response.data = { ...response.data, ...response.data.myData };
    }
    return response;
  },
  (error) => {
    // Handle backend error envelope format
    const errorData = error?.response?.data;
    let message = 'Something went wrong!';
    
    if (errorData) {
      if (errorData.variant === 'error' && errorData.message) {
        message = errorData.message;
      } else if (errorData.message) {
        message = errorData.message;
      }
    } else {
      message = error?.message || message;
    }
    
    // Preserve status code and response for error handling in callers
    const enhancedError = new Error(message);
    enhancedError.status = error?.response?.status;
    enhancedError.response = error?.response;
    
    // Only log non-404 errors (404s are often expected)
    if (error?.response?.status !== 404) {
      console.error('Axios error:', message);
    }
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    // Call backend directly (no Next API proxy)
    me: `${BACKEND_URL.replace(/\/+$/, '')}/api/v2/auth/me`,
    signIn: `${BACKEND_URL.replace(/\/+$/, '')}/api/v2/auth/login`,
    signUp: `${BACKEND_URL.replace(/\/+$/, '')}/api/v2/auth/signup`,
  },

  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },

  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },

  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
