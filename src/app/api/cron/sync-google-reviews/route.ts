import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { runGoogleReviewsSync } from '@/lib/google-reviews-sync';

// GET /api/cron/sync-google-reviews?secret=YOUR_CRON_SECRET
// Also accepts the secret via an "Authorization: Bearer YOUR_CRON_SECRET" header,
// which is how Vercel Cron sends it automatically for protected routes.
//
// Set up automatic syncing (pick one):
//   1. Vercel Cron - see vercel.json in the project root (already configured
//      to call this route daily). Just set the CRON_SECRET env var and
//      deploy - Vercel handles the scheduling for you.
//   2. Any external cron service (cron-job.org, EasyCron, etc.) - point it at:
//      https://yourdomain.com/api/cron/sync-google-reviews?secret=YOUR_CRON_SECRET
//      on whatever schedule you like (once a day is plenty).
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured on the server.' },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  const headerSecret = authHeader?.replace('Bearer ', '');
  const querySecret = request.nextUrl.searchParams.get('secret');

  if (headerSecret !== cronSecret && querySecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();
    const result = await runGoogleReviewsSync(supabase);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[cron/sync-google-reviews] failed:', err);
    return NextResponse.json({ error: err?.message || 'Sync failed' }, { status: 500 });
  }
}
