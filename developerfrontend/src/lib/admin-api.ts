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

// --- Enhanced User Lookup ---

export interface StudentProfile {
  studentCode: string;
  organizations: Array<{
    organizationId: string;
    organizationName: string;
  }>;
  linkedParents: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }>;
}

export interface ParentProfile {
  linkedChildren: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentCode: string;
  }>;
}

export interface EnhancedUserInfo extends UserInfo {
  role: string;
  studentProfile?: StudentProfile;
  parentProfile?: ParentProfile;
}

export async function lookupUserEnhanced(email: string): Promise<EnhancedUserInfo> {
  const res = await axiosInstance.get('/api/v2/admin/users/enhanced', { params: { email } });
  return res.data;
}

// --- Student Debug ---

export interface StudentTestAttempt {
  id: string;
  testId: string;
  testName: string;
  organizationName: string;
  attemptNumber: number;
  status: string;
  score: number | null;
  totalMarks: number | null;
  startedAt: string;
  submittedAt: string | null;
}

export interface StudentDebugInfo {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  attempts: StudentTestAttempt[];
}

export async function lookupStudentDebug(params: { email?: string; studentCode?: string }): Promise<StudentDebugInfo> {
  const res = await axiosInstance.get('/api/v2/admin/students/debug', { params });
  return res.data;
}

// --- Registration Stats ---

export interface RegistrationStats {
  totalStudents: number;
  totalParents: number;
  registrationsLast30Days: Array<{
    date: string;
    students: number;
    parents: number;
  }>;
}

export async function getRegistrationStats(): Promise<RegistrationStats> {
  const res = await axiosInstance.get('/api/v2/admin/registration-stats');
  return res.data;
}

// --- Platform Revenue ---

export interface PlatformRevenueOverview {
  totalRevenue: number;
  totalTransactions: number;
  platformFeeRevenue: number;
  currency: string;
  revenueByOrg: Array<{
    orgId: string;
    orgName: string;
    revenue: number;
    transactions: number;
    stripeAccountId: string;
    platformFee: number;
  }>;
  revenueTimeSeries: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
}

export interface FailedPayment {
  id: string;
  orgId: string;
  orgName: string;
  amount: number;
  currency: string;
  errorMessage: string;
  customerEmail: string;
  createdAt: string;
  stripePaymentIntentId?: string;
}

export async function getPlatformRevenue(params?: { startDate?: string; endDate?: string }): Promise<PlatformRevenueOverview> {
  const res = await axiosInstance.get('/api/v2/admin/platform-revenue', { params });
  return res.data;
}

export async function getFailedPayments(params?: { page?: number; limit?: number }): Promise<{ payments: FailedPayment[]; total: number }> {
  const res = await axiosInstance.get('/api/v2/admin/failed-payments', { params });
  return res.data;
}

// --- Stripe Connected Accounts ---

export interface ConnectedAccount {
  orgId: string;
  orgName: string;
  stripeAccountId: string;
  stripeOnboardingComplete: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  status: 'active' | 'pending' | 'restricted' | 'disabled';
  createdAt: string;
  totalRevenue: number;
  totalPayouts: number;
}

export async function getConnectedAccounts(params?: { status?: string; search?: string }): Promise<{ accounts: ConnectedAccount[]; total: number }> {
  const res = await axiosInstance.get('/api/v2/admin/stripe-accounts', { params });
  return res.data;
}
