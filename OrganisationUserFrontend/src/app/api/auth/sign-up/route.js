import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.FE_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:2040';

/**
 * POST /api/v2/auth/signup
 * Proxy to backend sign-up endpoint
 * Handles envelope responses and cookie forwarding
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required', variant: 'error' },
        { status: 400 }
      );
    }

    // Get tenant ID from headers (dev mode)
    const headers = await request.headers;
    const tenantId = headers.get('x-tenant-id') || 'devTenant';
    
    // Call backend directly
    const backendResponse = await fetch(`${BACKEND_URL}/api/v2/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId,
        'X-Request-ID': `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    const data = await backendResponse.json();

    // Check envelope response
    if (data.variant === 'error') {
      return NextResponse.json(data, { status: backendResponse.status >= 400 ? backendResponse.status : 400 });
    }

    // Forward Set-Cookie header from backend to client
    const setCookieHeader = backendResponse.headers.get('Set-Cookie');
    const response = NextResponse.json(data, { status: 200 });
    console.log('[FE API][sign-up] status=200 variant=', data.variant, 'setCookieHeader=', Boolean(setCookieHeader), 'keys=', Object.keys(data || {}));
    
    if (setCookieHeader) {
      response.headers.set('Set-Cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      {
        message: error.message || 'Sign-up failed',
        variant: 'error',
        myData: { error: error.toString() },
      },
      { status: 500 }
    );
  }
}

