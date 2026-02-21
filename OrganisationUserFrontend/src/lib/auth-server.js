/**
 * SSR auth utilities
 * Server-side session management using cookies
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAME = 'seo_auth';

/**
 * Decode JWT token payload (without verification for MVP)
 * Backend uses custom JWT with base64url encoding
 */
function decodeTokenPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Decode base64url
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Get session from auth cookie (SSR)
 * Returns user data if authenticated, null otherwise
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    
    if (!authCookie?.value) {
      return null;
    }

    // Decode token payload to get user info
    const payload = decodeTokenPayload(authCookie.value);
    if (!payload) {
      return null;
    }

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return {
      authenticated: true,
      user: {
        email: payload.sub,
        tenantId: payload.tenantId,
        roles: payload.roles || [],
      },
    };
  } catch (error) {
    console.error('getSession error:', error);
    return null;
  }
}

/**
 * Require authentication (SSR)
 * Redirects to JWT sign-in page if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/jwt/sign-in');
  }
  
  return session;
}

/**
 * Clear auth cookie (logout)
 */
export async function clearSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  } catch (error) {
    console.error('clearSession error:', error);
  }
}

