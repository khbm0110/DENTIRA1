'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams } from 'next/navigation';
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
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] mix-blend-multiply" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-teal-50/50 blur-[100px] mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-start"
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
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
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

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="relative lg:ml-auto w-full max-w-lg mx-auto lg:mx-0"
          >
            {/* Soft Glow Behind Media */}
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-90 translate-y-8" />
            
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-[0_20px_50px_rgb(0,0,0,0.08)]">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80"
                alt="Clinic"
                className="w-full h-full object-cover"
              />
              {/* White gradient overlay to match reference */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent pointer-events-none" />
              
              {/* Floating Badge on Image */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">5000+</p>
                  <p className="text-xs font-medium text-on-surface-variant">Patients Souriants</p>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative dot grid or organic shapes could go here */}
            <svg className="absolute -bottom-10 -left-10 w-32 h-32 text-primary/10 -z-10" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="10" cy="10" r="2" />
              <circle cx="30" cy="10" r="2" />
              <circle cx="50" cy="10" r="2" />
              <circle cx="70" cy="10" r="2" />
              <circle cx="90" cy="10" r="2" />
              <circle cx="10" cy="30" r="2" />
              <circle cx="30" cy="30" r="2" />
              <circle cx="50" cy="30" r="2" />
              <circle cx="70" cy="30" r="2" />
              <circle cx="90" cy="30" r="2" />
              <circle cx="10" cy="50" r="2" />
              <circle cx="30" cy="50" r="2" />
              <circle cx="50" cy="50" r="2" />
              <circle cx="70" cy="50" r="2" />
              <circle cx="90" cy="50" r="2" />
              <circle cx="10" cy="70" r="2" />
              <circle cx="30" cy="70" r="2" />
              <circle cx="50" cy="70" r="2" />
              <circle cx="70" cy="70" r="2" />
              <circle cx="90" cy="70" r="2" />
              <circle cx="10" cy="90" r="2" />
              <circle cx="30" cy="90" r="2" />
              <circle cx="50" cy="90" r="2" />
              <circle cx="70" cy="90" r="2" />
              <circle cx="90" cy="90" r="2" />
            </svg>
          </motion.div>
        </div>

        <WorkingHoursBar />

      </section>
      <BookingModal ref={bookingModalRef} />
    </>
  );
}
