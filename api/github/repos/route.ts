
// This route is no longer used in the simplified repository scanning flow.
// Keeping the file to prevent breaking any potential existing client-side code that
// might still reference it, but it will no longer perform any operations.
// A safe response is returned.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ repositories: [] });
}
