import axiosInstance, { endpoints } from './axios';

// ─── Catalog ───────────────────────────────────────────────────────────────

export async function getCatalog(
  companyId: string,
  params?: {
    type?: string;
    category?: string;
    yearGroup?: string;
    subject?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }
) {
  const res = await axiosInstance.get(endpoints.catalog.list(companyId), { params });
  return res.data;
}

export async function getProductDetail(companyId: string, productId: string) {
  const res = await axiosInstance.get(endpoints.catalog.detail(companyId, productId));
  return res.data;
}

// ─── Checkout ──────────────────────────────────────────────────────────────

export async function createCheckoutSession(payload: {
  productId: string;
  studentUserId?: string;
  selectedAddOns?: string[];
}) {
  const res = await axiosInstance.post(endpoints.checkout.createSession, payload);
  return res.data;
}

export async function verifyCheckout(sessionId: string) {
  const res = await axiosInstance.get(endpoints.checkout.verify(sessionId));
  return res.data;
}

export async function claimFreeAccess(payload: {
  productId: string;
  studentUserId?: string;
}) {
  const res = await axiosInstance.post(endpoints.checkout.freeAccess, payload);
  return res.data;
}

// ─── Purchases ─────────────────────────────────────────────────────────────

export async function getStudentPurchases(params?: { page?: number; limit?: number }) {
  const res = await axiosInstance.get(endpoints.studentPurchases.list, { params });
  return res.data;
}

export async function getParentPurchases(params?: { page?: number; limit?: number }) {
  const res = await axiosInstance.get(endpoints.parentPurchases.list, { params });
  return res.data;
}

export async function getPurchases(
  role: 'student' | 'parent',
  params?: { page?: number; limit?: number }
) {
  return role === 'parent' ? getParentPurchases(params) : getStudentPurchases(params);
}

// ─── Access Check ──────────────────────────────────────────────────────────

export async function checkAccess(referenceType: string, referenceId: string) {
  const res = await axiosInstance.get(
    endpoints.studentPurchases.access(referenceType, referenceId)
  );
  return res.data;
}
