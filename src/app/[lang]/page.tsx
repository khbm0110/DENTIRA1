import HeroSection from '../../components/sections/HeroSection';
import FeatureBar from '../../components/sections/FeatureBar';
import WhyChooseUsSection from '../../components/sections/WhyChooseUsSection';
import ServicesSection from '../../components/sections/ServicesSection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import DoctorsTeamSection from '../../components/sections/DoctorsTeamSection';
import StatisticsSection from '../../components/sections/StatisticsSection';
import BlogSection from '../../components/sections/BlogSection';
import BookingSection from '../../components/sections/BookingSection';

export default function Home({ params }: { params: { lang: string } }) {
  return (
    <>
      <HeroSection lang={params.lang} />
      <FeatureBar lang={params.lang} />
      <WhyChooseUsSection lang={params.lang} />
      <ServicesSection lang={params.lang} />
      <TestimonialsSection lang={params.lang} />
      <DoctorsTeamSection lang={params.lang} />
      <StatisticsSection lang={params.lang} />
      <BlogSection lang={params.lang} />
      <BookingSection lang={params.lang} />
    </>
  );
}
