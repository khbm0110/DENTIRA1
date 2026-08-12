'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dictionary from '@/lib/i18n/dictionary';
import { Users, Star, Award, ShieldPlus } from 'lucide-react';

export default function StatisticsSection({ lang }: { lang?: string }) {
  const params = useParams();
  const currentLang = lang || (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  const stats = [
    {
      icon: <Users className="text-white w-6 h-6" />,
      number: '5000+',
      label: t.stats.patients
    },
    {
      icon: <ShieldPlus className="text-white w-6 h-6" />,
      number: '15+',
      label: t.stats.experience
    },
    {
      icon: <Award className="text-white w-6 h-6" />,
      number: '12',
      label: t.stats.specialists
    },
    {
      icon: <Star className="text-white w-6 h-6" />,
      number: '4.9',
      label: t.stats.rating
    }
  ];

  return (
    <section className="section-padding bg-surface px-5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-[#0C4A6E] rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-soft-xl"
        >
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative z-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                  {stat.icon}
                </div>
                <div className="font-headline font-extrabold text-2xl sm:text-4xl text-white mb-1 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-white/50 font-medium text-xs sm:text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}