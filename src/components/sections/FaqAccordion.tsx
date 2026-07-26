'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-bold text-on-surface text-sm lg:text-base">{item.question}</span>
              <ChevronDown size={20} className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm text-on-surface-variant leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
