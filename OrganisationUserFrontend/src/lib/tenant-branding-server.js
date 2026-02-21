/**
 * Tenant branding utilities (server-only)
 * Uses `next/headers` to infer tenant from the incoming request.
 *
 * IMPORTANT: This file must only be imported from Server Components / route handlers.
 */

import { headers } from 'next/headers';

import { getTenantBrandTokens, tokensToThemeOverrides } from './tenant-branding';

/**
 * Get tenant ID from request (server-side)
 * Strategies:
 * 1. X-Tenant-ID header (preferred - set by proxy/middleware)
 * 2. Path-based extraction (/tenant1/blog) via `x-pathname` header (set by middleware)
 * 3. Host-based mapping (custom domains, localhost fallback)
 */
export async function getTenantFromRequest() {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host') || requestHeaders.get('x-forwarded-host') || '';
  const tenantHeader = requestHeaders.get('x-tenant-id');

  // Strategy 1: Header (preferred - set by proxy/middleware)
  if (tenantHeader) {
    return tenantHeader;
  }

  // Strategy 2: Path-based (middleware should still rewrite /tenant1/blog → /blog with header)
  const pathname = requestHeaders.get('x-pathname') || '';
  const pathMatch = pathname.match(/^\/([^/]+)\/blog/);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Strategy 3: Host-based (for custom domains)
  // In Phase 2, this should look up from backend DomainConfig
  if (host.includes('localhost')) {
    return 'devTenant';
  }

  // Fallback: use hostname (will need domain mapping in Phase 2)
  return host.split(':')[0] || 'devTenant';
}

/**
 * Get tenant theme overrides (SSR)
 * Combines server-side tenant detection with brand tokens.
 */
export async function getTenantThemeOverrides() {
  try {
    const tenantId = await getTenantFromRequest();
    const tokens = await getTenantBrandTokens(tenantId);
    return tokensToThemeOverrides(tokens);
  } catch (error) {
    console.error('getTenantThemeOverrides error:', error);
    // Fall back to default tokens on any failure
    const { DEFAULT_TOKENS } = await import('./tenant-branding');
    return tokensToThemeOverrides(DEFAULT_TOKENS);
  }
}





