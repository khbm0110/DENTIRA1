'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import dictionary from '@/lib/i18n/dictionary';
import BookingModal, { BookingModalRef } from '../BookingModal';
import { Star, ShieldCheck, Users, ArrowRight, Calendar } from 'lucide-react';

import WorkingHoursBar from './WorkingHoursBar';
import type { ContactInfo, WorkingHours, HeroContent } from '@/lib/supabase/public-settings';

export default function Hero({
  lang,
  contact,
  hours,
  heroContent,
}: {
  lang?: string;
  contact?: ContactInfo;
  hours?: WorkingHours;
  heroContent?: HeroContent;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const bookingModalRef = useRef<BookingModalRef>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const params = useParams();
  const currentLang = lang || (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  const isAr = currentLang === 'ar';
  const heroTitle = (isAr ? heroContent?.title_ar : heroContent?.title_fr) || t.hero.title;
  const heroSubtitle = (isAr ? heroContent?.subtitle_ar : heroContent?.subtitle_fr) || t.hero.subtitle;

  const handleBookingClick = () => {
    bookingModalRef.current?.openModal();
  }

  return (
    <React.Fragment>
      <section
        ref={targetRef}
        className="relative min-h-[100svh] flex flex-col justify-center pt-32 pb-40 px-6 overflow-hidden bg-surface"
      >
        {/* Soft Gradient Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-secondary/10 blur-[120px]" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-primary/5 blur-[90px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Text & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-start max-w-2xl"
            >
              <div className="badge-primary mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {isAr ? 'مقبول المرضى الجدد' : 'Nouveaux patients accept\u00e9s'}
              </div>
              
              <h1 className="font-headline text-5xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground">
                <span className="block">{heroTitle.split(' ')[0]}</span>
                <span className="text-primary">{heroTitle.split(' ').slice(1).join(' ')}</span>
              </h1>
              
              <p className="text-on-surface-variant text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
                <button 
                  onClick={handleBookingClick}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  {t.hero.cta1}
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  {isAr ? 'اكتشف خدماتنا' : 'D\u00e9couvrir nos soins'}
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-outline-variant/40 w-full">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" width={40} height={40} sizes="40px" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-soft" referrerPolicy="no-referrer" />
                    <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" width={40} height={40} sizes="40px" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-soft" referrerPolicy="no-referrer" />
                    <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" width={40} height={40} sizes="40px" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-soft" referrerPolicy="no-referrer" />
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-soft">+</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">4.9/5 <span className="text-on-surface-variant font-normal">(500+ avis)</span></p>
                  </div>
                </div>
                <div className="h-8 w-px bg-outline-variant/40 hidden sm:block"></div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldCheck className="text-primary" size={20} />
                  <span>{isAr ? 'أكثر من 15 سنة خبرة' : '15+ Ans d\'Exp\u00e9rience'}</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Image Card + Floating Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-xl">
                <Image
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80"
                  alt="Clinic"
                  fill
                  priority
                  sizes="50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />
              </div>

              {/* Floating Stat: Rating */}
              <div className="glass-card absolute -left-8 top-12 px-5 py-3.5 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="flex text-amber-400">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div>
                    <div className="font-headline font-extrabold text-lg text-foreground leading-none">4.9</div>
                    <div className="text-on-surface-variant text-xs mt-0.5">{isAr ? 'تقييم' : 'Note'}</div>
                  </div>
                </div>
              </div>

              {/* Floating Stat: Experience */}
              <div className="glass-card absolute -right-6 bottom-16 px-5 py-3.5 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="text-primary" size={18} />
                  </div>
                  <div>
                    <div className="font-headline font-extrabold text-lg text-foreground leading-none">15+</div>
                    <div className="text-on-surface-variant text-xs mt-0.5">{isAr ? 'سنة خبرة' : "Ans d'Exp\u00e9rience"}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <WorkingHoursBar hours={hours} />

      </section>
      <BookingModal ref={bookingModalRef} contact={contact} />
    </React.Fragment>
  );
}
