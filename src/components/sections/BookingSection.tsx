'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Check, MessageCircle, CalendarDays } from 'lucide-react';
import dictionary from '@/lib/i18n/dictionary';
import { submitAppointment } from '@/app/actions/public';
import type { ContactInfo } from '@/lib/supabase/public-settings';

const SERVICE_OPTIONS = ['implantology', 'orthodontics', 'whitening', 'pedodontics'] as const;

export default function BookingSection({ lang, contact }: { lang?: string; contact?: ContactInfo }) {
  const params = useParams();
  const currentLang = lang || (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;
  const isAr = currentLang === 'ar';

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '', service: '', date: '', time: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const formRenderedAt = useRef(Date.now());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    if (!formData.firstName.trim() || !formData.phone.trim() || !formData.service) {
      setError(isAr ? 'الرجاء ملء الاسم والهاتف والخدمة على الأقل.' : 'Merci de renseigner au moins le nom, le téléphone et le service.');
      setStatus('error');
      return;
    }

    try {
      const preferredDate = formData.date && formData.time ? `${formData.date}T${formData.time}:00` : undefined;
      await submitAppointment({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        email: formData.email || undefined,
        service: formData.service,
        preferredDate,
        honeypot,
        formRenderedAt: formRenderedAt.current,
      });
      setStatus('success');
    } catch (err: any) {
      setError(err?.message || (isAr ? 'حدث خطأ، حاول مرة أخرى.' : 'Une erreur est survenue, veuillez réessayer.'));
      setStatus('error');
    }
  };

  const handleWhatsApp = () => {
    const message = isAr
      ? `مرحبا، أريد أخذ موعد.\nالاسم: ${formData.firstName} ${formData.lastName}`
      : `Bonjour, je voudrais prendre un rendez-vous.\nNom: ${formData.firstName} ${formData.lastName}`;
    const whatsappNumber = (contact?.whatsapp || t.common.phone_number).replace(/\D/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const address = isAr ? contact?.address_ar : contact?.address_fr;
  const mapQuery = encodeURIComponent(address || 'Casablanca, Maroc');

  return (
    <section id="booking" className="py-24 bg-surface relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[2.5rem] overflow-hidden aspect-square shadow-[0_20px_50px_rgb(0,0,0,0.05)] border-4 border-white"
        >
          <iframe
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Clinic location"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-10 sm:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)]"
        >
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                <Check size={32} />
              </div>
              <h3 className="font-headline text-2xl font-extrabold mb-2 text-on-surface">
                {isAr ? 'تم استلام طلبك!' : 'Votre demande a bien été reçue !'}
              </h3>
              <p className="text-on-surface-variant text-sm">
                {isAr ? 'سنتصل بك قريباً لتأكيد موعدك.' : 'Notre équipe vous contactera très bientôt pour confirmer votre rendez-vous.'}
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-headline text-3xl font-extrabold mb-2 text-on-surface">
                {t.booking.title}
              </h3>
              <p className="text-on-surface-variant text-sm mb-8">
                {isAr ? 'احجز استشارتك في خطوات بسيطة.' : 'Réservez votre consultation en quelques clics.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot - real visitors never see this field (off-screen + tabIndex -1 + autoComplete off) */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">{t.booking.first_name}</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} required
                      className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder={t.booking.first_name} type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">{t.booking.last_name}</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder={t.booking.last_name} type="text" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">{isAr ? 'الهاتف' : 'Téléphone'}</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} required
                      className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="+212 6XX XXX XXX" type="tel" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="email@exemple.com" type="email" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">{isAr ? 'الخدمة' : 'Service souhaité'}</label>
                  <select name="service" value={formData.service} onChange={handleInputChange} required
                    className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    <option value="">{isAr ? 'اختر خدمة' : 'Choisir un service'}</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{t.services[s]}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">{isAr ? 'التاريخ' : 'Date souhaitée'}</label>
                    <input name="date" value={formData.date} onChange={handleInputChange}
                      className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      type="date" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">{t.booking.time}</label>
                    <input name="time" value={formData.time} onChange={handleInputChange}
                      className="w-full bg-surface border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      type="time" />
                  </div>
                </div>

                {status === 'error' && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                >
                  {status === 'loading' ? <Loader2 size={20} className="animate-spin" /> : (
                    <CalendarDays size={20} />
                  )}
                  {status === 'loading' ? (isAr ? 'جارٍ الإرسال...' : 'Envoi en cours...') : t.booking.cta}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366]/10 text-[#128C7E] py-3.5 rounded-2xl font-bold hover:bg-[#25D366]/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <MessageCircle size={18} />
                  {isAr ? 'أو راسلنا عبر واتساب' : 'Ou contactez-nous sur WhatsApp'}
                </button>
              </form>
            </>
          )}
        </motion.div>

      </div>
    </section>
  );
}
