import Image from 'next/image';
import dictionary from '@/lib/i18n/dictionary';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

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
      title: "Implantologie",
      desc: "Remplacement de dents manquantes par des implants en titane.",
      img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80"
    },
    {
      title: "Orthodontie",
      desc: "Alignement des dents avec des gouttières invisibles.",
      img: "https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?auto=format&fit=crop&q=80"
    },
    {
      title: "Esthétique",
      desc: "Blanchiment dentaire et facettes pour un sourire parfait.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"
    },
    {
      title: "Soins Généraux",
      desc: "Examens de routine, détartrage et soins conservateurs.",
      img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80"
    }
  ];

  const displayServices = servicesData && servicesData.length > 0 
    ? servicesData.map(s => ({
        title: currentLang === 'ar' ? s.name_ar : s.name_fr,
        desc: currentLang === 'ar' ? s.description_ar : s.description_fr,
        img: s.image_url || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80"
      }))
    : defaultServices;

  return (
    <section id="services" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Nos Services
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Des soins dentaires complets pour répondre à tous vos besoins, de la prévention à la restauration esthétique.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {displayServices.map((service, index) => (
            <div key={index} className="bg-surface rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 sm:p-8">
                <h3 className="font-headline font-bold text-base sm:text-xl mb-1.5 sm:mb-3 text-on-surface">{service.title}</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-3 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                  {service.desc}
                </p>
                <button className="flex items-center gap-1.5 sm:gap-2 text-primary font-bold text-xs sm:text-sm group-hover:gap-3 transition-all">
                  {currentLang === 'ar' ? 'اعرف أكثر' : 'En savoir plus'}
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
