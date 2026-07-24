'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import dictionary from '../lib/i18n/dictionary';

import type { ContactInfo } from '../lib/supabase/public-settings';
import { X, PhoneCall } from 'lucide-react';

export interface BookingModalRef {
  openModal: () => void;
}

const BookingModal = forwardRef<BookingModalRef, { contact?: ContactInfo }>(({ contact }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const [formData, setFormData] = useState({ firstName: '', lastName: '', time: '' });

  useImperativeHandle(ref, () => ({
    openModal: () => setIsOpen(true),
  }));

  const closeModal = () => setIsOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppBooking = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const message = `Bonjour, je voudrais prendre un rendez-vous.\nNom: ${formData.firstName} ${formData.lastName}\nHeure souhaitée: ${formData.time}`;
    const whatsappNumber = (contact?.whatsapp || t.common.phone_number).replace(/\D/g, '');
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    closeModal(); // Close modal after booking
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="bg-surface p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
          >
            <button onClick={closeModal} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors">
              <X size={22} />
            </button>
            
            <h3 className="font-headline text-3xl font-extrabold mb-8 text-center">{t.booking.title}</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-white border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary w-full"
                  placeholder={t.booking.first_name}
                  type="text"
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-white border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary w-full"
                  placeholder={t.booking.last_name}
                  type="text"
                />
              </div>
              <input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full bg-white border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary"
                placeholder={t.booking.time}
                type="time"
              />
              <button
                onClick={handleWhatsAppBooking}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold btn-hover flex items-center justify-center gap-2"
                type="submit"
              >
                <PhoneCall size={18} />
                {t.booking.cta}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

BookingModal.displayName = 'BookingModal';

export default BookingModal;
