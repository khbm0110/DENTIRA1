import HeroSection from '../../components/sections/HeroSection';
import FeatureBar from '../../components/sections/FeatureBar';
import WhyChooseUsSection from '../../components/sections/WhyChooseUsSection';
import ServicesSection from '../../components/sections/ServicesSection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import DoctorsTeamSection from '../../components/sections/DoctorsTeamSection';
import StatisticsSection from '../../components/sections/StatisticsSection';
import BlogSection from '../../components/sections/BlogSection';
import BookingSection from '../../components/sections/BookingSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureBar />
      <WhyChooseUsSection />
      <ServicesSection />
      <TestimonialsSection />
      <DoctorsTeamSection />
      <StatisticsSection />
      <BlogSection />
      <BookingSection />
    </>
  );
}
