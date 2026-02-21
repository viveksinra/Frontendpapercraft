import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function getTenantId() {
  if (typeof window === 'undefined') return 'devTenant';
  const host = window.location?.host || '';
  return host.includes('localhost') ? 'devTenant' : host.split(':')[0];
}

// Default brand settings structure
export const DEFAULT_BRAND_SETTINGS = {
  logo: '',
  favicon: '',
  displayName: '',
  tagline: '',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  accentColor: '#ff9800',
  backgroundColor: '#ffffff',
  surfaceColor: '#f5f5f5',
  textColor: '#212121',
  fontFamily: 'Inter, sans-serif',
  headingFont: 'Inter, sans-serif',
  customCss: '',
};

export function normalizeBrandSettings(settings) {
  if (!settings) return { ...DEFAULT_BRAND_SETTINGS };
  return {
    ...DEFAULT_BRAND_SETTINGS,
    ...settings,
  };
}

export async function getBrandSettings(companyId) {
  const url = backendUrl(v2Endpoints.companies.settings(companyId));
  const res = await axios.get(url, {
    headers: {
      'X-Tenant-ID': getTenantId(),
      'X-Company-ID': companyId,
    },
  });
  return normalizeBrandSettings(res.data?.branding);
}

export async function updateBrandSettings(companyId, settings) {
  const url = backendUrl(v2Endpoints.companies.branding(companyId));
  const res = await axios.patch(
    url,
    settings,
    {
      headers: {
        'X-Tenant-ID': getTenantId(),
        'X-Company-ID': companyId,
      },
      withCredentials: true,
    }
  );
  return normalizeBrandSettings(res.data?.branding);
}

