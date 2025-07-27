
// This route is no longer used in the simplified repository scanning flow.
// Keeping the file to prevent breaking any potential existing client-side code that
// might still reference it, but it will no longer perform any operations.
// A safe redirect is returned to prevent crashes.

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Redirect to the demo page to prevent any errors.
  const redirectUrl = new URL('/demo', req.nextUrl.origin);
  redirectUrl.searchParams.set('github_auth_notice', 'connection_flow_changed');
  return NextResponse.redirect(redirectUrl);
}
