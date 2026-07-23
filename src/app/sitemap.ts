import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = 'https://dentora.ma';
const locales = ['fr', 'ar'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const entries: MetadataRoute.Sitemap = [];

  // Home + blog list, both languages
  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      changeFrequency: 'weekly',
      priority: 1.0,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Real, active services only (fixes the previous sitemap linking to
  // /services/implantology etc. when no such page existed at all)
  try {
    const { data: services } = await supabase
      .from('services')
      .select('slug, updated_at')
      .eq('is_active', true);

    for (const service of services || []) {
      if (!service.slug) continue;
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/services/${service.slug}`,
          lastModified: service.updated_at ? new Date(service.updated_at) : undefined,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // If Supabase isn't configured yet, still return the static entries above.
  }

  // Real, published blog posts only
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true);

    for (const post of posts || []) {
      if (!post.slug) continue;
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : undefined,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // Same fallback as above.
  }

  return entries;
}
