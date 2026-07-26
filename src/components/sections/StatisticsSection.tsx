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
      icon: <Users className="text-white w-8 h-8" />,
      number: "5000+",
      label: t.stats.patients
    },
    {
      icon: <ShieldPlus className="text-white w-8 h-8" />,
      number: "15+",
      label: t.stats.experience
    },
    {
      icon: <Award className="text-white w-8 h-8" />,
      number: "12",
      label: t.stats.specialists
    },
    {
      icon: <Star className="text-white w-8 h-8" />,
      number: "4.9",
      label: t.stats.rating
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-gradient-to-r from-primary-dark via-primary to-primary-light rounded-3xl sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgb(0,105,113,0.3)]"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 relative z-10">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center mb-3 sm:mb-6 backdrop-blur-sm border border-white/30 [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-8 sm:[&_svg]:h-8">
                  {stat.icon}
                </div>
                <div className="font-headline font-extrabold text-2xl sm:text-5xl text-white mb-1 sm:mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-white/80 font-semibold text-xs sm:text-lg uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
