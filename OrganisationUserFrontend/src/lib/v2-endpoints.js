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
  paperTemplates: {
    list: (companyId) => `/api/v2/companies/${companyId}/paper-templates`,
    create: (companyId) => `/api/v2/companies/${companyId}/paper-templates`,
    detail: (companyId, id) => `/api/v2/companies/${companyId}/paper-templates/${id}`,
    update: (companyId, id) => `/api/v2/companies/${companyId}/paper-templates/${id}`,
    delete: (companyId, id) => `/api/v2/companies/${companyId}/paper-templates/${id}`,
    clone: (companyId, id) => `/api/v2/companies/${companyId}/paper-templates/${id}/clone`,
  },
  paperBlueprints: {
    list: (companyId) => `/api/v2/companies/${companyId}/paper-blueprints`,
    create: (companyId) => `/api/v2/companies/${companyId}/paper-blueprints`,
    detail: (companyId, id) => `/api/v2/companies/${companyId}/paper-blueprints/${id}`,
    update: (companyId, id) => `/api/v2/companies/${companyId}/paper-blueprints/${id}`,
    delete: (companyId, id) => `/api/v2/companies/${companyId}/paper-blueprints/${id}`,
    clone: (companyId, id) => `/api/v2/companies/${companyId}/paper-blueprints/${id}/clone`,
    validate: (companyId, id) => `/api/v2/companies/${companyId}/paper-blueprints/${id}/validate`,
  },
  papers: {
    list: (companyId) => `/api/v2/companies/${companyId}/papers`,
    create: (companyId) => `/api/v2/companies/${companyId}/papers`,
    autoGenerate: (companyId) => `/api/v2/companies/${companyId}/papers/auto-generate`,
    stats: (companyId) => `/api/v2/companies/${companyId}/papers/stats`,
    detail: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}`,
    update: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}`,
    delete: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}`,
    addQuestions: (companyId, id, idx) => `/api/v2/companies/${companyId}/papers/${id}/sections/${idx}/questions`,
    removeQuestion: (companyId, id, idx) => `/api/v2/companies/${companyId}/papers/${id}/sections/${idx}/questions`,
    reorderQuestions: (companyId, id, idx) => `/api/v2/companies/${companyId}/papers/${id}/sections/${idx}/reorder`,
    suggestedSwaps: (companyId, id, idx, qNum) => `/api/v2/companies/${companyId}/papers/${id}/sections/${idx}/questions/${qNum}/swaps`,
    swapQuestion: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}/swap-question`,
    finalize: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}/finalize`,
    publish: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}/publish`,
    unfinalize: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}/unfinalize`,
    generatePdf: (companyId, id) => `/api/v2/companies/${companyId}/papers/${id}/generate-pdf`,
    download: (companyId, id, pdfType) => `/api/v2/companies/${companyId}/papers/${id}/download/${pdfType}`,
  },
  paperSets: {
    list: (companyId) => `/api/v2/companies/${companyId}/paper-sets`,
    create: (companyId) => `/api/v2/companies/${companyId}/paper-sets`,
    detail: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}`,
    update: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}`,
    delete: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}`,
    addPaper: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}/papers`,
    removePaper: (companyId, id, paperId) => `/api/v2/companies/${companyId}/paper-sets/${id}/papers/${paperId}`,
    uploadPdf: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}/upload-pdf`,
    deletePdf: (companyId, id, pdfIndex) => `/api/v2/companies/${companyId}/paper-sets/${id}/pdfs/${pdfIndex}`,
    publish: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}/publish`,
    archive: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}/archive`,
    downloadZip: (companyId, id) => `/api/v2/companies/${companyId}/paper-sets/${id}/download-zip`,
  },
};
