import type { Metadata } from 'next';
import ToastContainer from '../../components/shared/Toast';
import { createClient } from '../../lib/supabase/server';
import { getPublicClinicSettings } from '../../lib/supabase/public-settings';
import './globals.css';

// Self-hosted fonts (no external network fetch at build or run time, unlike
// next/font/google which needs to reach fonts.googleapis.com during every
// build - this also avoids the GDPR exposure that comes with loading Google
// Fonts directly, since no visitor data is ever sent to Google's servers).
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const SITE_URL = 'https://dentora.ma';

const META_BY_LANG: Record<string, { title: string; description: string }> = {
  fr: {
    title: 'Dentora | Clinique Dentaire à Casablanca',
    description: "Soins dentaires experts pour toute la famille à Casablanca : implantologie, orthodontie, blanchiment et pédodontie. Prenez rendez-vous en ligne.",
  },
  ar: {
    title: 'دنتورا | عيادة أسنان بالدار البيضاء',
    description: 'رعاية أسنان احترافية لكل العائلة بالدار البيضاء: زراعة الأسنان، تقويم الأسنان، تبييض الأسنان وطب أسنان الأطفال. احجز موعدك أونلاين.',
  },
};

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang === 'ar' ? 'ar' : 'fr';
  const meta = META_BY_LANG[lang];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.title, template: `%s | Dentora` },
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: '/fr', ar: '/ar', 'x-default': '/fr' },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${lang}`,
      siteName: 'Dentora',
      locale: lang === 'ar' ? 'ar_MA' : 'fr_MA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    icons: {
      icon: '/icons/icon-192x192.png',
      apple: '/icons/icon-192x192.png',
    },
    robots: { index: true, follow: true },
  };
}

// JSON-LD Schema for SEO (Dentist / LocalBusiness) - built with real data,
// see buildJsonLd() below.
function buildJsonLd({
  phone,
  email,
  address,
  rating,
  reviewCount,
}: {
  phone: string;
  email: string;
  address: string;
  rating: number | null;
  reviewCount: number;
}) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': 'https://dentora.ma/#dentist',
    name: 'Dentora - Clinical Dental Excellence',
    alternateName: 'Dentora Clinique Dentaire',
    description: 'Advanced dental solutions and personalized care for optimal oral health in Casablanca, Morocco',
    image: 'https://dentora.ma/images/clinic.jpg',
    logo: 'https://dentora.ma/logo.svg',
    url: 'https://dentora.ma',
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      '@id': 'https://dentora.ma/#address',
      streetAddress: address,
      addressLocality: 'Casablanca',
      addressRegion: 'Grand Casablanca',
      postalCode: '20000',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.5731,
      longitude: -7.5898,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '14:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' },
    ],
    medicalSpecialty: [
      { '@type': 'MedicalSpecialty', name: 'Dentistry' },
      { '@type': 'MedicalSpecialty', name: 'Implantology' },
      { '@type': 'MedicalSpecialty', name: 'Orthodontics' },
    ],
    priceRange: '$$',
  };

  // Only include aggregateRating when there are real published reviews to
  // back it up - Google's structured data guidelines treat a fabricated
  // rating as spam and it can trigger a manual action against the site.
  if (rating && reviewCount > 0) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      bestRating: '5',
      reviewCount: String(reviewCount),
    };
  }

  return base;
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  const isRTL = params.lang === 'ar';

  const supabase = createClient();
  const [{ contact }, { data: testimonials }] = await Promise.all([
    getPublicClinicSettings(),
    supabase.from('testimonials').select('rating').eq('is_published', true),
  ]);

  const reviewCount = testimonials?.length || 0;
  const rating = reviewCount > 0
    ? testimonials!.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviewCount
    : null;

  const jsonLd = buildJsonLd({
    phone: contact.phone,
    email: contact.email,
    address: isRTL ? contact.address_ar : contact.address_fr,
    rating,
    reviewCount,
  });

  return (
    <html
      lang={params.lang}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ '--font-headline': "'Manrope', sans-serif", '--font-body': "'Inter', sans-serif" } as React.CSSProperties}
    >
      <head>
        <meta name="theme-color" content="#0EA5E9" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body suppressHydrationWarning className="bg-background text-foreground font-body overflow-x-hidden">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
