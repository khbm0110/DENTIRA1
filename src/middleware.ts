// DENTORA-OS - MIDDLEWARE
// Handles i18n routing, language detection, and admin route protection

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Supported locales
const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

// Protected routes that require authentication
const protectedRoutes = ['/admin'];

// Public only routes (redirect if already logged in)
const publicOnlyRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if pathname starts with a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Redirect to default locale if no locale in path
  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    
    // Special handling for protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      // Redirect to login with locale
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
    }
    
    // Redirect to the same path with locale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // For admin routes, we need to check authentication
    // This is a basic check - in production, you would verify the session
    const authCookie = request.cookies.get('supabase-auth-token');
    
    if (!authCookie && !pathname.includes('/login')) {
      const currentLocale = pathname.split('/')[1];
      return NextResponse.redirect(
        new URL(`/${currentLocale}/login`, request.url)
      );
    }
  }

  // Set headers for i18n
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

// Detect user preferred locale
function detectLocale(request: NextRequest): string {
  // Check if locale is set in cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  // Check Accept-Language header
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

  // Default to system locale or default locale
  return defaultLocale;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|icons|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
