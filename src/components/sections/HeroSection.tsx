'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import dictionary from '@/lib/i18n/dictionary';
import BookingModal, { BookingModalRef } from '../BookingModal';
import { Star, ShieldCheck, Users, ArrowRight, Calendar } from 'lucide-react';

import WorkingHoursBar from './WorkingHoursBar';

export default function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const bookingModalRef = useRef<BookingModalRef>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const handleBookingClick = () => {
    bookingModalRef.current?.openModal();
  }

  return (
    <>
      <section
        ref={targetRef}
        className="relative min-h-[100svh] flex flex-col justify-center pt-32 pb-40 px-6 overflow-hidden bg-white"
      >
        {/* Background Image with Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80"
            alt="Clinic"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full flex items-center z-10 relative">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-start max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nouveaux patients acceptés
            </div>
            
            <h1 className="font-headline text-5xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.1] mb-6 text-on-surface">
              <span className="block">{t.hero.title.split(' ')[0]}</span>
              <span className="text-primary">{t.hero.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            
            <p className="text-on-surface-variant text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
              <button 
                onClick={handleBookingClick}
                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_25px_-5px_rgb(0,105,113,0.5)] hover:shadow-[0_12px_35px_-5px_rgb(0,105,113,0.6)] hover:-translate-y-1 transition-all duration-300"
              >
                <Calendar size={20} />
                {t.hero.cta1}
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-on-surface border-2 border-outline-variant px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all duration-300"
              >
                Découvrir nos soins
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-outline-variant/60 w-full">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" width={40} height={40} sizes="40px" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" referrerPolicy="no-referrer" />
                  <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" width={40} height={40} sizes="40px" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" referrerPolicy="no-referrer" />
                  <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" width={40} height={40} sizes="40px" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" referrerPolicy="no-referrer" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-surface flex items-center justify-center text-xs font-bold text-primary shadow-sm">+</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-0.5">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <p className="text-xs font-semibold text-on-surface">4.9/5 <span className="text-on-surface-variant font-normal">(500+ avis)</span></p>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/60 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                <ShieldCheck className="text-primary" size={20} />
                <span>15+ Ans d'Expérience</span>
              </div>
            </div>
          </motion.div>
        </div>

        <WorkingHoursBar />

      </section>
      <BookingModal ref={bookingModalRef} />
    </>
  );
}
