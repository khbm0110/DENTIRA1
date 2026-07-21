'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dictionary from '@/lib/i18n/dictionary';

export default function BookingSection({ lang }: { lang?: string }) {
  const params = useParams();
  const currentLang = lang || (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  const [formData, setFormData] = useState({ firstName: '', lastName: '', time: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppBooking = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const message = `Bonjour, je voudrais prendre un rendez-vous.\nNom: ${formData.firstName} ${formData.lastName}\nHeure souhaitée: ${formData.time}`;
    const whatsappURL = `https://wa.me/${t.common.phone_number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <section id="booking" className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[2.5rem] overflow-hidden aspect-square shadow-[0_20px_50px_rgb(0,0,0,0.05)] border-4 border-white"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212727.1973347936!2d-7.754734341997284!3d33.57242345501372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0x139f0159b84334d!2sCasablanca!5e0!3m2!1sfr!2sma!4v1690153272995!5m2!1sfr!2sma"
            width="100%"
            height="100%"
            style={{ border:0 }}
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-10 sm:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)]"
        >
          <h3 className="font-headline text-3xl font-extrabold mb-2 text-on-surface">
            {t.booking.title}
          </h3>
          <p className="text-on-surface-variant text-sm mb-8">
            Réservez votre consultation en quelques clics.
          </p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Prénom</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder={t.booking.first_name}
                  type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Nom</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder={t.booking.last_name}
                  type="text"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Heure souhaitée</label>
              <input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder={t.booking.time}
                type="time"
              />
            </div>
            <button
              onClick={handleWhatsAppBooking}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
              type="submit"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
              {t.booking.cta}
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
