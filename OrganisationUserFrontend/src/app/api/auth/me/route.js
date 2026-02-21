import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.FE_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:2040';

/**
 * GET /api/v2/auth/me
 * Get current authenticated user
 * Requires Authorization header with Bearer token
 */
export async function GET(request) {
  try {
    // Get Authorization header from request
    const headers = await request.headers;
    const authHeader = headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized', variant: 'error' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Get tenant ID from headers (dev mode)
    const tenantId = headers.get('x-tenant-id') || 'devTenant';
    
    // Call backend to get user profile
    const backendResponse = await fetch(`${BACKEND_URL}/api/v2/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': tenantId,
        'X-Request-ID': `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      },
    });

    const data = await backendResponse.json();
    console.log('[FE API][me] backendStatus=', backendResponse.status, 'variant=', data?.variant, 'keys=', Object.keys(data || {}), 'token.len=', String(token).length);

    // Check envelope response
    if (data.variant === 'error' || backendResponse.status >= 400) {
      return NextResponse.json(
        data.variant === 'error' ? data : { message: 'Failed to get user profile', variant: 'error' },
        { status: backendResponse.status >= 400 ? backendResponse.status : 401 }
      );
    }

    console.log('[FE API][me] responding 200; keys=', Object.keys(data || {}), 'hasUser=', Boolean(data?.user));
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to get user profile',
        variant: 'error',
        myData: { error: error.toString() },
      },
      { status: 500 }
    );
  }
}

