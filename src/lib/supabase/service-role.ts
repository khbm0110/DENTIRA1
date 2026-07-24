import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client - bypasses Row Level Security entirely. Only use this
 * from trusted, server-only code paths that are themselves protected by a
 * secret (e.g. the cron route, guarded by CRON_SECRET). NEVER import this
 * from anything that runs in the browser, and never forward
 * SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set to use the service-role client.');
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
