'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dictionary from '@/lib/i18n/dictionary';
import { CheckCircle } from 'lucide-react';

export default function WhyChooseUsSection({ lang }: { lang?: string }) {
  const params = useParams();
  const currentLang = lang || (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  return (
    <section id="why-choose" className="py-16 md:py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Doctor Card (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-white rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center shadow-[0_10px_40px_rgb(0,0,0,0.04)]"
          >
            <div className="w-full md:w-64 aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 shrink-0 relative">
              <Image
                alt={t.doctorProfile.name}
                className="object-cover"
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80"
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider uppercase mb-2">
                {t.doctorProfile.role_label}
              </div>
              <h3 className="font-headline font-bold text-3xl text-on-surface">{t.doctorProfile.name}</h3>
              <p className="text-sm font-bold text-on-surface-variant">{t.doctorProfile.title}</p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-yellow-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <span className="text-on-surface-variant">4.9 {t.doctorProfile.reviews}</span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mt-4">
                {t.doctorProfile.bio}
              </p>
            </div>
          </motion.div>

          {/* Why Choose Us Card (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-primary text-white rounded-[2.5rem] p-10 lg:p-12 shadow-[0_15px_40px_rgb(0,105,113,0.2)] flex flex-col justify-center relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                {t.whyChooseUs.title}
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md">
                {t.whyChooseUs.subtitle}
              </p>
              
              <ul className="space-y-4">
                {[
                  t.whyChooseUs.list1,
                  t.whyChooseUs.list2,
                  t.whyChooseUs.list3,
                  t.whyChooseUs.list4
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="text-white w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
