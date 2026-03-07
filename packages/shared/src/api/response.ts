/**
 * Shared response handling utilities for the PaperCraft backend envelope format.
 *
 * The backend wraps responses in an envelope:
 *   { variant: "success", message: "...", myData: { ...actualPayload } }
 *
 * The response interceptor unwraps this so consumers get the payload directly.
 */

import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Backend envelope format.
 */
export interface BackendEnvelope<T = Record<string, unknown>> {
  variant: 'success' | 'error';
  message?: string;
  myData?: T;
}

/**
 * Axios response interceptor that unwraps the backend envelope.
 * Merges `myData` into `response.data` so consumers can access fields directly.
 *
 * Usage:
 *   axiosInstance.interceptors.response.use(unwrapEnvelope, enhanceError);
 */
export function unwrapEnvelope(response: AxiosResponse): AxiosResponse {
  const data = response.data;
  if (data?.variant && data?.myData && typeof data.myData === 'object') {
    response.data = { ...data, ...data.myData };
  }
  return response;
}

/**
 * Enhanced error object with status code and cleaned message.
 */
export interface EnhancedAxiosError extends AxiosError {
  statusCode?: number;
}

/**
 * Axios error interceptor that extracts a clean message and status code.
 *
 * Usage:
 *   axiosInstance.interceptors.response.use(unwrapEnvelope, enhanceError);
 */
export function enhanceError(error: AxiosError): Promise<never> {
  const enhanced = error as EnhancedAxiosError;
  enhanced.statusCode = error.response?.status;
  enhanced.message =
    (error.response?.data as Record<string, string>)?.message ||
    error.message ||
    'Network error';
  return Promise.reject(enhanced);
}

/**
 * Sets a JWT Bearer token on an axios instance's default headers.
 * Pass null to clear the token.
 */
export function setAuthHeader(
  headers: InternalAxiosRequestConfig['headers'],
  token: string | null
): void {
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    delete headers.Authorization;
  }
}
