'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dictionary from '@/lib/i18n/dictionary';
import { Calendar, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function FeatureBar({ lang }: { lang?: string }) {
  const params = useParams();
  const currentLang = lang || (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  const features = [
    {
      icon: <Calendar className="text-primary" size={24} />,
      title: t.featureBar.item1_title,
      desc: t.featureBar.item1_desc
    },
    {
      icon: <ShieldCheck className="text-primary" size={24} />,
      title: t.featureBar.item2_title,
      desc: t.featureBar.item2_desc
    },
    {
      icon: <Clock className="text-primary" size={24} />,
      title: t.featureBar.item3_title,
      desc: t.featureBar.item3_desc
    },
    {
      icon: <CheckCircle className="text-primary" size={24} />,
      title: t.featureBar.item4_title,
      desc: t.featureBar.item4_desc
    }
  ];

  return (
    <section className="bg-surface relative z-20 px-5 sm:px-6 lg:px-8 py-14 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
              className="soft-card p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3 sm:gap-4 group hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/15">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-xs sm:text-sm">{feature.title}</h3>
                <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}