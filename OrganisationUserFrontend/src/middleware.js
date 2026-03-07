import { NextResponse } from 'next/server';

/**
 * Next.js Middleware for tenant resolution
 * Supports:
 * 1. X-Tenant-ID header (set by reverse proxy)
 * 2. Host-based mapping (custom domains)
 */
export async function middleware(request) {
  const host = request.headers.get('host') || '';

  // Non-localhost: check for tenant header from reverse proxy
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    const tenantHeader = request.headers.get('x-tenant-id');

    if (tenantHeader) {
      // Tenant ID already set by reverse proxy
      return NextResponse.next();
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
