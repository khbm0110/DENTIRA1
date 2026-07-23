// DENTORA-OS - HIDDEN ADMIN PATH CONFIGURATION
//
// The real dashboard lives in src/app/[lang]/admin, but that literal "/admin"
// URL is blocked by the middleware (see src/middleware.ts) - anyone hitting it
// directly is bounced to the homepage. The dashboard is only reachable through
// the secret path segment below, e.g. https://yourdomain.com/fr/staff-portal-x9k2.
//
// CHANGE THIS before going live (set NEXT_PUBLIC_ADMIN_PATH in your .env.local
// / hosting provider), and rotate it again any time you suspect it has leaked.
//
// NOTE: this only hides the dashboard from casual browsing, search engines and
// link-guessing. It is NOT a substitute for real authentication - every
// request to this path is also verified server-side against
// "profiles.role = admin" in the middleware, so even someone who discovers
// the secret path still can't get in without a real admin login.
export const ADMIN_SECRET_PATH =
  process.env.NEXT_PUBLIC_ADMIN_PATH || 'staff-portal-x9k2';
