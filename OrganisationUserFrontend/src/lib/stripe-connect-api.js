import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Stripe Connect ────────────────────────────────────────────────────────

export async function connectAccount(companyId) {
  const url = backendUrl(v2Endpoints.stripe.connect(companyId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function getOnboardingLink(companyId) {
  const url = backendUrl(v2Endpoints.stripe.onboardingLink(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getAccountStatus(companyId) {
  const url = backendUrl(v2Endpoints.stripe.status(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getDashboardLink(companyId) {
  const url = backendUrl(v2Endpoints.stripe.dashboardLink(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function getBalance(companyId) {
  const url = backendUrl(v2Endpoints.stripe.balance(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}
