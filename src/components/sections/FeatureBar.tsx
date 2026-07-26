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
      icon: <Calendar className="text-primary" size={28} />,
      title: t.featureBar.item1_title,
      desc: t.featureBar.item1_desc
    },
    {
      icon: <ShieldCheck className="text-primary" size={28} />,
      title: t.featureBar.item2_title,
      desc: t.featureBar.item2_desc
    },
    {
      icon: <Clock className="text-primary" size={28} />,
      title: t.featureBar.item3_title,
      desc: t.featureBar.item3_desc
    },
    {
      icon: <CheckCircle className="text-primary" size={28} />,
      title: t.featureBar.item4_title,
      desc: t.featureBar.item4_desc
    }
  ];

  return (
    <section className="bg-surface relative z-20 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-7 sm:[&_svg]:h-7">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-xs sm:text-base">{feature.title}</h3>
                <p className="text-[11px] sm:text-sm text-on-surface-variant mt-0.5 sm:mt-1">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
