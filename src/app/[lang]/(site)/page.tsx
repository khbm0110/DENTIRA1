import { Suspense } from 'react';
import HeroSection from '../../../components/sections/HeroSection';
import FeatureBar from '../../../components/sections/FeatureBar';
import WhyChooseUsSection from '../../../components/sections/WhyChooseUsSection';
import ServicesSection from '../../../components/sections/ServicesSection';
import OffersSection from '../../../components/sections/OffersSection';
import GallerySection from '../../../components/sections/GallerySection';
import PricingSection from '../../../components/sections/PricingSection';
import TestimonialsSection from '../../../components/sections/TestimonialsSection';
import DoctorsTeamSection from '../../../components/sections/DoctorsTeamSection';
import StatisticsSection from '../../../components/sections/StatisticsSection';
import BlogSection from '../../../components/sections/BlogSection';
import FaqSection from '../../../components/sections/FaqSection';
import BookingSection from '../../../components/sections/BookingSection';
import SectionSkeleton from '../../../components/shared/SectionSkeleton';
import { getPublicClinicSettings, getHeroContent } from '../../../lib/supabase/public-settings';

// No page-level generateMetadata override needed here - the root [lang]/layout.tsx
// already provides the homepage title/description/OG defaults.

export default async function Home({ params }: { params: { lang: string } }) {
  const [settings, heroContent] = await Promise.all([
    getPublicClinicSettings(),
    getHeroContent(),
  ]);

  return (
    <>
      <HeroSection lang={params.lang} contact={settings.contact} hours={settings.hours} heroContent={heroContent} />
      <FeatureBar lang={params.lang} />
      <WhyChooseUsSection lang={params.lang} />

      {/* Each of the sections below fetches its own data from Supabase.
          Wrapping them in Suspense lets Next.js stream the page as each
          query finishes, instead of the whole page (and every language
          switch) waiting on all of them one after another. */}
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection lang={params.lang} />
      </Suspense>
      <Suspense fallback={null}>
        <OffersSection lang={params.lang} />
      </Suspense>
      <Suspense fallback={null}>
        <PricingSection lang={params.lang} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection lang={params.lang} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <DoctorsTeamSection lang={params.lang} />
      </Suspense>

      <Suspense fallback={null}>
        <GallerySection lang={params.lang} />
      </Suspense>

      <StatisticsSection lang={params.lang} />

      <Suspense fallback={<SectionSkeleton />}>
        <BlogSection lang={params.lang} />
      </Suspense>

      <Suspense fallback={null}>
        <FaqSection lang={params.lang} />
      </Suspense>

      <BookingSection lang={params.lang} contact={settings.contact} />
    </>
  );
}
