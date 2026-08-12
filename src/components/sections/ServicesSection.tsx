import Image from 'next/image';
import dictionary from '@/lib/i18n/dictionary';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import AnimateIn from '../shared/AnimateIn';

export default async function ServicesSection({ lang }: { lang?: string }) {
  const currentLang = lang || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;
  const supabase = createClient();
  
  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  const defaultServices = [
    {
      title: 'Implantologie',
      desc: 'Remplacement de dents manquantes par des implants en titane de haute qualité.',
      img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80'
    },
    {
      title: 'Orthodontie',
      desc: 'Alignement des dents avec des gouttières invisibles et confortables.',
      img: 'https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?auto=format&fit=crop&q=80'
    },
    {
      title: 'Esthétique',
      desc: 'Blanchiment dentaire et facettes pour un sourire éclatant et naturel.',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'
    },
    {
      title: 'Soins Généraux',
      desc: 'Examens de routine, détartrage professionnel et soins conservateurs.',
      img: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80'
    }
  ];

  const displayServices = servicesData && servicesData.length > 0 
    ? servicesData.map(s => ({
        title: currentLang === 'ar' ? s.name_ar : s.name_fr,
        desc: currentLang === 'ar' ? s.description_ar : s.description_fr,
        img: s.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80'
      }))
    : defaultServices;

  return (
    <section id="services" className="section-padding bg-white overflow-hidden">
      <div className="section-container">
        <AnimateIn className="text-center mb-14 md:mb-20">
          <div className="badge-primary mb-5 mx-auto w-fit">
            {currentLang === 'ar' ? 'خدماتنا' : t.services.tag || 'Nos Services'}
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 text-foreground">
            {t.services.title}
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
            {t.services.subtitle}
          </p>
        </AnimateIn>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {displayServices.map((service, index) => (
            <AnimateIn key={index} delay={index * 0.08} className="group">
              <div className="soft-card-hover overflow-hidden h-full flex flex-col">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="font-headline font-bold text-lg mb-2 text-foreground">{service.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
                    {service.desc}
                  </p>
                  <button className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all duration-200 cursor-pointer">
                    {currentLang === 'ar' ? 'اعرف أكثر' : 'En savoir plus'}
                    <ArrowRight size={15} className={currentLang === 'ar' ? 'rotate-180' : ''} />
                  </button>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}