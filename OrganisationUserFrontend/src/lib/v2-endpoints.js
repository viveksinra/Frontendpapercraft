// Central definition of v2 backend endpoints for the PaperCraft platform.
// All company-scoped APIs must use these helpers so we always respect
// `/api/v2/companies/:companyId/...` and send the right headers.

import { CONFIG } from 'src/global-config';

// Base URL for direct backend calls (no Next.js API proxy)
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || CONFIG.serverUrl || 'http://localhost:2040';

// Convenience to build absolute URLs to the backend
export function backendUrl(path) {
  const base = BACKEND_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export const v2Endpoints = {
  auth: {
    me: '/api/v2/auth/me',
    login: '/api/v2/auth/login',
    signup: '/api/v2/auth/signup',
  },
  companies: {
    list: '/api/v2/companies',
    create: '/api/v2/companies',
    settings: (companyId) => `/api/v2/companies/${companyId}/settings`,
    bootstrapStatus: (companyId) => `/api/v2/companies/${companyId}/bootstrap-status`,
    select: (companyId) => `/api/v2/companies/${companyId}/select`,
    branding: (companyId) => `/api/v2/companies/${companyId}/branding`,
    seo: (companyId) => `/api/v2/companies/${companyId}/seo`,
    info: (companyId) => `/api/v2/companies/${companyId}/info`,
  },
  memberships: {
    list: (companyId) => `/api/v2/companies/${companyId}/memberships`,
    invite: (companyId) => `/api/v2/companies/${companyId}/memberships/invite`,
    update: (companyId, membershipId) => `/api/v2/companies/${companyId}/memberships/${membershipId}`,
    remove: (companyId, membershipId) => `/api/v2/companies/${companyId}/memberships/${membershipId}`,
  },
};
