'use client';

import { useParams } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';
import { Users, Star, Award, ShieldPlus } from 'lucide-react';

export default function StatisticsSection() {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const stats = [
    {
      icon: <Users className="text-white w-8 h-8" />,
      number: "5000+",
      label: "Patients Satisfaits"
    },
    {
      icon: <ShieldPlus className="text-white w-8 h-8" />,
      number: "15+",
      label: "Années d'Expérience"
    },
    {
      icon: <Award className="text-white w-8 h-8" />,
      number: "12",
      label: "Spécialistes"
    },
    {
      icon: <Star className="text-white w-8 h-8" />,
      number: "4.9",
      label: "Note Google"
    }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light rounded-[3rem] p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgb(0,105,113,0.3)]">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
                  {stat.icon}
                </div>
                <div className="font-headline font-extrabold text-5xl text-white mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-white/80 font-semibold text-lg uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
