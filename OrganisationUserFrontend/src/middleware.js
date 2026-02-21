import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:2040';

async function resolveCompany(slug) {
  try {
    const res = await fetch(`${BACKEND_URL.replace(/\/+$/, '')}/api/v1/routing/resolve?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.myData || data;
  } catch {
    return null;
  }
}

/**
 * Next.js Middleware for tenant resolution
 * Supports:
 * 1. Path-based: /tenant1/blog → extracts tenant1, rewrites to /blog
 * 2. Custom domain: blog.tenantcompany.com → extracts tenant from domain
 * 3. Tenant's subdomain: blog.tenant1.com (their domain) → extracts tenant
 */
export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';
  
  // Strategy 1: Path-based routing (/tenant1/blog)
  const pathMatch = pathname.match(/^\/([^/]+)\/blog(\/.*)?$/);
  
  if (pathMatch) {
    const username = pathMatch[1];
    const blogPath = pathMatch[2] || '/';
    
    // Rewrite to /blog path for Next.js
    const url = request.nextUrl.clone();
    url.pathname = `/blog${blogPath}`;
    
    // Resolve company by username
    const routing = await resolveCompany(username);
    if (!routing?.company?.id) {
      // If no company found with this username, return 404-like response
      // The routing resolve will fail if username is not set
      return NextResponse.rewrite(new URL('/blog/not-found', request.url), {
        request: {
          headers: request.headers,
        },
      });
    }
    
    // Add headers for blog pages
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-Tenant-ID', username);
    requestHeaders.set('X-Company-ID', routing.company.id);
    requestHeaders.set('X-Company-Username', routing.company.username || username);
    
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // Strategy 2 & 3: Custom domain or tenant's subdomain
  // Domain-to-tenant mapping (can be moved to env or database in Phase 2)
  // For now, check if it's not localhost and extract from domain
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    // In production, this should lookup from database or env
    // For Phase 1, we'll use X-Tenant-ID header if present (set by proxy)
    const tenantHeader = request.headers.get('x-tenant-id');
    
    if (tenantHeader) {
      // Tenant ID already set by reverse proxy
      return NextResponse.next();
    }
    
    // Fallback: try to extract from hostname pattern
    // This is a simple fallback - in production, use domain mapping
    const hostParts = host.split('.');
    if (hostParts.length > 2) {
      // Could be subdomain.tenant.com - extract subdomain
      // But we need domain-to-tenant mapping for accuracy
      // For now, just pass through and let backend handle it
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

