'use client';

// DENTORA-OS - FLOATING ACTIONS COMPONENT
// Mobile-only floating buttons with hardware-accelerated framer-motion animations

import { motion, Variants } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { DENTORA_CORE } from '../../config/dentora-system';

export default function FloatingActions() {
  const whatsappNumber = DENTORA_CORE.connectivity.whatsapp.replace(/\D/g, '');
  const phoneNumber = DENTORA_CORE.connectivity.phone.replace(/\D/g, '');

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const phoneUrl = `tel:+${phoneNumber}`;

  // Spring animation variants for hardware acceleration
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0, 
      x: 20 
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 25,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  // Pulse animation for WhatsApp button
  const pulseVariants: Variants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 md:hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Phone Call Button */}
      <motion.a
        href={phoneUrl}
        className="p-4 bg-white text-primary rounded-full shadow-xl border border-outline-variant"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Call the clinic"
      >
        <Phone size={24} strokeWidth={2.5} />
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-4 bg-[#25D366] text-white rounded-full shadow-xl"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Contact on WhatsApp"
      >
        <motion.div variants={pulseVariants} animate="animate">
          <MessageCircle size={24} strokeWidth={2.5} />
        </motion.div>
      </motion.a>
    </motion.div>
  );
}
