import axiosInstance from './axios';

// --- Organizations ---

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  memberCount: number;
  createdAt: string;
  status: string;
}

export interface OrganizationDetail extends Organization {
  settings: Record<string, any>;
  branding: Record<string, any>;
  members: Array<{
    id: string;
    userId: string;
    email: string;
    name: string;
    role: string;
    joinedAt: string;
  }>;
}

export async function listOrganizations(params?: { search?: string; page?: number; limit?: number }) {
  const res = await axiosInstance.get('/api/v2/admin/organizations', { params });
  return res.data;
}

export async function getOrganization(orgId: string) {
  const res = await axiosInstance.get(`/api/v2/admin/organizations/${orgId}`);
  return res.data;
}

// --- Users ---

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLogin: string;
  memberships: Array<{
    organizationId: string;
    organizationName: string;
    role: string;
    joinedAt: string;
  }>;
}

export async function lookupUser(email: string) {
  const res = await axiosInstance.get('/api/v2/admin/users', { params: { email } });
  return res.data;
}

export async function createOrganization(payload: {
  name: string;
  ownerEmail: string;
  primaryColor?: string;
  plan?: string;
}) {
  const res = await axiosInstance.post('/api/v2/admin/organizations', payload);
  return res.data;
}
