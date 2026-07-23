import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

// Server Components / Server Actions client.
// Uses the modern getAll/setAll cookie API (not the deprecated get/set/remove
// shape) - Supabase's own docs warn that the deprecated shape "can lead to
// issues such as random logouts, early session termination or increased
// token refresh requests", which is exactly what caused admin logins to not
// stick after being redirected to the dashboard.
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from a Server Component that can't set cookies - fine,
            // as long as the middleware below refreshes the session on every
            // request.
          }
        },
      },
    }
  )
}

/**
 * Cookie-aware client + response pair for use inside middleware.
 * Returns the (possibly updated) response alongside the client, because
 * refreshing/writing auth cookies in middleware requires rebuilding the
 * NextResponse with those cookies attached - this is the pattern Supabase's
 * own Next.js docs use.
 */
export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  return { supabase, response }
}

/**
 * Verifies whether the current request belongs to a logged-in user with
 * role = 'admin' in public.profiles. Fails closed (returns isAdmin: false)
 * on any error, so access is DENIED by default rather than silently allowed.
 *
 * Returns the response object produced while checking the session - the
 * caller (middleware) MUST continue building on top of this response (not a
 * fresh NextResponse.next()) so any refreshed auth cookies actually reach
 * the browser.
 */
export async function checkAdminRequest(request: NextRequest): Promise<{ isAdmin: boolean; response: NextResponse }> {
  const { supabase, response } = createMiddlewareClient(request)

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { isAdmin: false, response }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !profile) return { isAdmin: false, response }
    return { isAdmin: profile.role === 'admin', response }
  } catch {
    return { isAdmin: false, response }
  }
}
