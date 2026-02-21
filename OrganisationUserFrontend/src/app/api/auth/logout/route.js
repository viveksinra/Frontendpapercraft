import { NextResponse } from 'next/server';

import { clearSession } from 'src/lib/auth-server';

/**
 * POST /api/v2/auth/logout
 * Clear auth cookie
 */
export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ message: 'Logged out', variant: 'success' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed', variant: 'error' },
      { status: 500 }
    );
  }
}

