import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dictionary from '@/lib/i18n/dictionary';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!post) return { title: 'Article introuvable' };

  const lang = params.lang;
  const title = lang === 'ar' ? post.title_ar : post.title_fr;
  const description = ((lang === 'ar' ? post.content_ar : post.content_fr) || '').slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `/${lang}/blog/${params.slug}` },
    openGraph: {
      title,
      description,
      images: post.image_url ? [post.image_url] : undefined,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: { lang: string; slug: string } }) {
  const lang = params.lang || 'fr';
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;
  const supabase = createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!post) notFound();

  const title = lang === 'ar' ? post.title_ar : post.title_fr;
  const content = (lang === 'ar' ? post.content_ar : post.content_fr) || '';
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);

  return (
    <main className="pt-32 pb-24 bg-surface min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <article className="max-w-3xl mx-auto px-6">
        <Link href={`/${lang}/blog`} className="text-xs font-bold text-primary mb-6 inline-flex items-center gap-1">
          {lang === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          {t.blog.tag}
        </Link>

        <h1 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-6">
          {title}
        </h1>

        <p className="text-sm text-on-surface-variant mb-8">
          {new Date(post.created_at).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          {post.author ? ` • ${post.author}` : ''}
        </p>

        {post.image_url && (
          <div className="aspect-[1.8] rounded-3xl overflow-hidden mb-10 relative">
            <Image alt={title} src={post.image_url} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => (
            <p key={i} className="mb-5 leading-relaxed text-on-surface-variant">{p}</p>
          )) : (
            <p className="text-on-surface-variant">{content}</p>
          )}
        </div>
      </article>
    </main>
  );
}
