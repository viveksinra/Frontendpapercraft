import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Product CRUD ──────────────────────────────────────────────────────────

export async function listProducts(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.products.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getProduct(companyId, productId) {
  const url = backendUrl(v2Endpoints.products.detail(companyId, productId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createProduct(companyId, data) {
  const url = backendUrl(v2Endpoints.products.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateProduct(companyId, productId, data) {
  const url = backendUrl(v2Endpoints.products.update(companyId, productId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteProduct(companyId, productId) {
  const url = backendUrl(v2Endpoints.products.delete(companyId, productId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

// ─── Publish / Unpublish ───────────────────────────────────────────────────

export async function publishProduct(companyId, productId) {
  const url = backendUrl(v2Endpoints.products.publish(companyId, productId));
  const res = await axios.patch(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function unpublishProduct(companyId, productId) {
  const url = backendUrl(v2Endpoints.products.unpublish(companyId, productId));
  const res = await axios.patch(url, {}, { headers: headers(companyId) });
  return res.data;
}

// ─── Quick Create ──────────────────────────────────────────────────────────

export async function createFromPaperSet(companyId, paperSetId) {
  const url = backendUrl(v2Endpoints.products.fromPaperSet(companyId, paperSetId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}
