// DENTORA-OS - MIDDLEWARE
// Handles i18n routing, language detection, and REAL admin route protection.
//
// Security model:
//  1. The real dashboard lives at /[lang]/admin, but that literal URL is
//     never served - direct requests to it are bounced to the homepage.
//  2. The dashboard is only reachable through a secret path segment
//     (see src/config/admin-path.ts). Requests to it are internally
//     rewritten to the real /admin route.
//  3. Every request under the secret path (other than the login page) is
//     verified SERVER-SIDE: valid Supabase session + role = 'admin' in
//     public.profiles. This cannot be bypassed by disabling client JS,
//     unlike the previous version which had NO server-side check at all
//     and left the whole dashboard publicly accessible to anyone who
//     guessed or was linked to /fr/admin.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from './lib/supabase/server';
import { ADMIN_SECRET_PATH } from './config/admin-path';

const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

const REAL_ADMIN_SEGMENT = 'admin';
const REAL_LOGIN_SEGMENT = 'login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // Normalize to a locale-prefixed URL FIRST. Doing the admin/security checks
  // only applies below this point fixes a bug where the old middleware's
  // "protectedRoutes" check never matched real, locale-prefixed paths like
  // "/fr/admin" (it only ever matched a literal "/admin" prefix), which meant
  // the dashboard was never actually protected by the middleware at all.
  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    const target = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target);
  }

  const segments = pathname.split('/').filter(Boolean); // e.g. ['fr','admin','services']
  const locale = segments[0];
  const secondSegment = segments[1] || '';
  const restPath = segments.slice(2).join('/');

  // 1) Block direct access to the real, non-secret admin/login segment names.
  if (secondSegment === REAL_ADMIN_SEGMENT || secondSegment === REAL_LOGIN_SEGMENT) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // 2) Requests to the secret admin path.
  if (secondSegment === ADMIN_SECRET_PATH) {
    const isLoginRequest = restPath === REAL_LOGIN_SEGMENT;

    if (isLoginRequest) {
      const rewritten = request.nextUrl.clone();
      rewritten.pathname = `/${locale}/${REAL_LOGIN_SEGMENT}`;
      const loginResponse = NextResponse.rewrite(rewritten);
      applySecurityHeaders(loginResponse);
      loginResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return loginResponse;
    }

    const response = NextResponse.next();
    const admin = await isAdminRequest(request, response);

    if (!admin) {
      const loginUrl = new URL(`/${locale}/${ADMIN_SECRET_PATH}/${REAL_LOGIN_SEGMENT}`, request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      applySecurityHeaders(redirectResponse);
      return redirectResponse;
    }

    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/${locale}/${REAL_ADMIN_SEGMENT}${restPath ? `/${restPath}` : ''}`;
    const rewriteResponse = NextResponse.rewrite(rewritten, { headers: response.headers });
    applySecurityHeaders(rewriteResponse);
    rewriteResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return rewriteResponse;
  }

  // Normal public page.
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

function detectLocale(request: NextRequest): string {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2))
      .find((lang) => locales.includes(lang));

    if (preferredLocale) {
      return preferredLocale;
    }
  }

  const systemLocale = request.headers.get('x-vercel-ip-country') || '';
  if (systemLocale === 'MA') {
    return 'ar';
  }

  return defaultLocale;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
