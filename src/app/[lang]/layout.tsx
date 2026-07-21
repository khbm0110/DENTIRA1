'use client';

import { usePathname } from 'next/navigation';
import NavigationBar from '../../components/common/NavigationBar';
import Footer from '../../components/common/Footer';
import FloatingActions from '../../components/shared/FloatingActions';
import ToastContainer from '../../components/shared/Toast';
import './globals.css';
import { Manrope, Inter } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// JSON-LD Schema for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': 'https://dentora.ma/#dentist',
  name: 'Dentora - Clinical Dental Excellence',
  alternateName: 'Dentora Clinique Dentaire',
  description: 'Advanced dental solutions and personalized care for optimal oral health in Casablanca, Morocco',
  image: 'https://dentora.ma/public/images/clinic.jpg',
  logo: 'https://dentora.ma/public/logo.svg',
  url: 'https://dentora.ma',
  telephone: '+2126XXXXXXXX',
  email: 'contact@dentora.ma',
  address: {
    '@type': 'PostalAddress',
    '@id': 'https://dentora.ma/#address',
    streetAddress: 'Casablanca',
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
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' },
  ],
  medicalSpecialty: [
    { '@type': 'MedicalSpecialty', name: 'Dentistry' },
    { '@type': 'MedicalSpecialty', name: 'Implantology' },
    { '@type': 'MedicalSpecialty', name: 'Orthodontics' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    reviewCount: '450',
  },
  priceRange: '$$',
};

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  const isRTL = params.lang === 'ar';
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes('/admin');
  
  return (
    <html lang={params.lang} dir={isRTL ? 'rtl' : 'ltr'} className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <meta name="theme-color" content="#36C2CF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body suppressHydrationWarning className="bg-surface text-on-surface font-body selection:bg-primary/20 overflow-x-hidden scroll-smooth">
        {!isAdminRoute && <NavigationBar />}
        <main>{children}</main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <FloatingActions />}
        <ToastContainer />
      </body>
    </html>
  );
}
