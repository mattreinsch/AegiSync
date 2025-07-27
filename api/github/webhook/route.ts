
// This webhook is no longer used in the simplified repository scanning flow.
// Keeping the file to prevent breaking any potential existing webhook configurations
// on GitHub, but it will no longer process events. A 200 response is returned
// to acknowledge receipt of any events without causing errors.

import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Acknowledge the webhook event but do nothing.
  return NextResponse.json({ message: 'Webhook received and acknowledged.' });
}
