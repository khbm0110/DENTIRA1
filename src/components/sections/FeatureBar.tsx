'use client';

import { useParams } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';
import { Calendar, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function FeatureBar({ lang }: { lang?: string }) {
  const params = useParams();
  const currentLang = lang || (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  const features = [
    {
      icon: <Calendar className="text-primary" size={28} />,
      title: "Rendez-vous rapide",
      desc: "Prise en charge sans attente"
    },
    {
      icon: <ShieldCheck className="text-primary" size={28} />,
      title: "Expertise médicale",
      desc: "Équipe hautement qualifiée"
    },
    {
      icon: <Clock className="text-primary" size={28} />,
      title: "Urgences 24/7",
      desc: "Toujours à votre écoute"
    },
    {
      icon: <CheckCircle className="text-primary" size={28} />,
      title: "Haute technologie",
      desc: "Équipements de pointe"
    }
  ];

  return (
    <section className="bg-surface relative z-20 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-base">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
