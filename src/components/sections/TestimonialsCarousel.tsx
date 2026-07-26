'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  name: string;
  photo: string;
  rating: number;
  text: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center justify-center text-yellow-500 mb-6">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function TestimonialsCarousel({ reviews, isRtl }: { reviews: Review[]; isRtl?: boolean }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((newIndex: number) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex((newIndex + reviews.length) % reviews.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reviews.length]);

  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, reviews.length]);

  if (reviews.length === 0) return null;

  const review = reviews[index];
  const dir = isRtl ? -1 : 1;

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -d * dir * 60 }),
  };

  return (
    <div
      className="relative max-w-2xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-[0_4px_30px_rgb(0,0,0,0.06)] text-center overflow-hidden min-h-[280px] flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full"
          >
            <StarRating rating={review.rating} />
            <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-8">
              &quot;{review.text}&quot;
            </p>
            <div className="flex items-center justify-center gap-4">
              <Image src={review.photo} alt={review.name} width={52} height={52} className="w-13 h-13 rounded-full object-cover" referrerPolicy="no-referrer" />
              <h3 className="font-bold text-on-surface text-base">{review.name}</h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous"
            className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-14 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next"
            className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-14 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex items-center justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-primary' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
