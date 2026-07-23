import { MetadataRoute } from 'next';

// NOTE: this intentionally does NOT list the hidden admin path (see
// src/config/admin-path.ts) or the real /admin, /login segment names.
// Listing a "secret" path in robots.txt would defeat the purpose of hiding
// it - search engines and bots read robots.txt too. The middleware already
// sends an X-Robots-Tag: noindex, nofollow header on every request to those
// paths, which is the correct way to keep something out of search results
// without announcing where it is.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://dentora.ma/sitemap.xml',
  };
}
