'use client';

import { useParams } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const services = [
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

  return (
    <section id="services" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Nos Services
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Des soins dentaires complets pour répondre à tous vos besoins, de la prévention à la restauration esthétique.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-surface rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <h3 className="font-headline font-bold text-xl mb-3 text-on-surface">{service.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>
                <button className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
