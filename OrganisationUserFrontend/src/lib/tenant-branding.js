/**
 * Tenant branding utilities (client-safe)
 * Shared branding helpers that can run in both browser and server environments.
 *
 * NOTE:
 * - Server-only logic that relies on `next/headers` lives in `tenant-branding-server.js`.
 * - This file must stay free of `next/headers` so it can be imported by Client Components.
 */

export const DEFAULT_TOKENS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  logo: null,
  fontFamily: 'inherit',
};

let clientSideCache = null;

/**
 * Get brand tokens for tenant
 * Fetches from company brand settings if active company is available
 */
export async function getTenantBrandTokens(tenantId) {
  if (clientSideCache) {
    return clientSideCache;
  }
  // Check for active company in cookies (client-side)
  if (typeof document !== 'undefined') {
    try {
      const cookies = document.cookie ? document.cookie.split(';').map((c) => c.trim()) : [];
      const activeCookie = cookies.find((c) => c.startsWith('active_company='));
      if (activeCookie) {
        const companyId = decodeURIComponent(activeCookie.split('=').slice(1).join('='));
        if (companyId) {
          // Fetch brand settings from backend
          const { getBrandSettings } = await import('./brand-api');
          try {
            const settings = await getBrandSettings(companyId);
            if (settings) {
              clientSideCache = {
                primary: settings.primaryColor || DEFAULT_TOKENS.primary,
                secondary: settings.secondaryColor || DEFAULT_TOKENS.secondary,
                logo: settings.logo || DEFAULT_TOKENS.logo,
                fontFamily: settings.fontFamily || DEFAULT_TOKENS.fontFamily,
                customCss: settings.customCss || null,
                tenantId,
              };
              return clientSideCache;
            }
          } catch (err) {
            console.warn('Failed to fetch brand settings:', err);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to get active company from cookies:', err);
    }
  }
  
  // Fallback to defaults
  clientSideCache = {
    ...DEFAULT_TOKENS,
    tenantId,
  };
  return clientSideCache;
}

/**
 * Convert brand tokens to MUI theme overrides
 */
export function tokensToThemeOverrides(tokens) {
  const overrides = {
    palette: {
      primary: {
        main: tokens.primary || DEFAULT_TOKENS.primary,
      },
      secondary: {
        main: tokens.secondary || DEFAULT_TOKENS.secondary,
      },
    },
    typography: {
      fontFamily: tokens.fontFamily || 'inherit',
    },
    // Add custom CSS variables for logo, etc.
    cssVariables: {
      '--tenant-logo': tokens.logo ? `url(${tokens.logo})` : 'none',
    },
  };
  
  // Inject custom CSS if provided
  if (tokens.customCss && typeof document !== 'undefined') {
    const existingStyle = document.getElementById('tenant-custom-css');
    if (existingStyle) {
      existingStyle.textContent = tokens.customCss;
    } else {
      const style = document.createElement('style');
      style.id = 'tenant-custom-css';
      style.textContent = tokens.customCss;
      document.head.appendChild(style);
    }
  }
  
  return overrides;
}

export function primeTenantBrandTokens(settings) {
  if (!settings) return;
  clientSideCache = {
    primary: settings.primaryColor || DEFAULT_TOKENS.primary,
    secondary: settings.secondaryColor || DEFAULT_TOKENS.secondary,
    logo: settings.logo || DEFAULT_TOKENS.logo,
    fontFamily: settings.fontFamily || DEFAULT_TOKENS.fontFamily,
    customCss: settings.customCss || null,
    tenantId: settings.tenantId || 'devTenant',
  };
  tokensToThemeOverrides(clientSideCache);
}
