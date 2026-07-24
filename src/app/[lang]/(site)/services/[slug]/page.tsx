import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dictionary from '@/lib/i18n/dictionary';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!service) return { title: 'Service introuvable' };

  const lang = params.lang;
  const name = lang === 'ar' ? service.name_ar : service.name_fr;
  const description = ((lang === 'ar' ? service.description_ar : service.description_fr) || '').slice(0, 155);

  return {
    title: name,
    description,
    alternates: {
      canonical: `/${lang}/services/${params.slug}`,
      languages: { fr: `/fr/services/${params.slug}`, ar: `/ar/services/${params.slug}` },
    },
    openGraph: {
      title: name,
      description,
      images: service.image_url ? [service.image_url] : undefined,
    },
  };
}

export async function generateStaticParams() {
  // generateStaticParams runs at build time, outside any request scope, so
  // it cannot use the cookie-aware server client (createClient() calls
  // cookies() from next/headers, which throws here). A plain anon-key
  // client works fine since this only reads public, already-public data.
  const { createClient: createStaticClient } = await import('@supabase/supabase-js');
  const supabase = createStaticClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  const { data: services } = await supabase.from('services').select('slug').eq('is_active', true);
  return (services || []).map((s: any) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: { params: { lang: string; slug: string } }) {
  const lang = params.lang || 'fr';
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;
  const supabase = createClient();

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!service) notFound();

  const name = lang === 'ar' ? service.name_ar : service.name_fr;
  const description = (lang === 'ar' ? service.description_ar : service.description_fr) || '';

  return (
    <main className="pt-32 pb-24 bg-surface min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-6">
        <Link href={`/${lang}#services`} className="text-xs font-bold text-primary mb-6 inline-flex items-center gap-1">
          {lang === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          {t.nav.services}
        </Link>

        <h1 className="font-headline text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          {name}
        </h1>

        {service.image_url && (
          <div className="aspect-[2] rounded-3xl overflow-hidden mb-10 relative">
            <Image alt={name} src={service.image_url} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-10">
          <p className="leading-relaxed text-on-surface-variant text-lg">{description}</p>
        </div>

        <Link
          href={`/${lang}#contact`}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          {t.hero?.cta1 || (lang === 'ar' ? 'احجز موعدك' : 'Prendre rendez-vous')}
        </Link>
      </div>
    </main>
  );
}
