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
  const isAr = currentLang === 'ar';

  return (
    <section id="why-choose" className="section-padding bg-white overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Doctor Card (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="soft-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-center"
          >
            <div className="w-full md:w-60 aspect-[4/5] rounded-2xl overflow-hidden shrink-0 relative">
              <Image
                alt={t.doctorProfile.name}
                className="object-cover"
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80"
                fill
                sizes="(max-width: 768px) 100vw, 240px"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            <div className="space-y-3">
              <div className="badge-primary w-fit">
                {t.doctorProfile.role_label}
              </div>
              <h3 className="font-headline font-bold text-2xl lg:text-3xl text-foreground">{t.doctorProfile.name}</h3>
              <p className="text-sm font-semibold text-on-surface-variant">{t.doctorProfile.title}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <span className="text-sm text-on-surface-variant">4.9 {t.doctorProfile.reviews}</span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mt-2">
                {t.doctorProfile.bio}
              </p>
            </div>
          </motion.div>

          {/* Why Choose Us Card (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-[#0C4A6E] text-white rounded-3xl p-8 lg:p-10 shadow-soft-xl flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <h2 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight mb-3">
                {t.whyChooseUs.title}
              </h2>
              <p className="text-white/60 text-base mb-8 max-w-md leading-relaxed">
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
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.08, ease: 'easeOut' }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="text-primary w-4 h-4" />
                    </div>
                    <span className="font-medium text-base text-white/90">{item}</span>
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
