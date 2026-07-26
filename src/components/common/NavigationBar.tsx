'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, usePathname } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import BookingModal, { BookingModalRef } from '../BookingModal';
import { Menu, X, Phone, MessageCircle, Smile } from 'lucide-react';
import Link from 'next/link';

import type { ContactInfo } from '@/lib/supabase/public-settings';

export default function NavigationBar({ contact }: { contact?: ContactInfo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const bookingModalRef = useRef<BookingModalRef>(null);

  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleBookingClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    bookingModalRef.current?.openModal();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.split('#')[1];
    const targetPath = `/${lang}`;

    if (pathname === targetPath && hash) {
      e.preventDefault();
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (pathname === targetPath && !hash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const whatsappNumber = (contact?.whatsapp || t.common.phone_number).replace(/\D/g, '');
  const phoneNumber = (contact?.phone || t.common.phone_number).replace(/\D/g, '');
  const displayPhoneNumber = contact?.phone || t.common.phone_number;

  const navLinks = [
    { label: t.nav.home, href: `/${lang}` },
    { label: t.nav.services, href: `/${lang}/#services` },
    { label: t.nav.about, href: `/${lang}/#why-choose` },
    { label: t.nav.blog, href: `/${lang}/blog`},
    { label: t.nav.contact, href: `/${lang}/#contact` },
  ];

  return (
    <>
      <nav
        id="main-nav"
        className={`fixed left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 backdrop-blur-2xl rounded-full px-4 md:px-6 flex justify-between items-center border border-white/60 transition-all duration-500 ease-[0.25,1,0.5,1] ${
          isScrolled ? 'top-4 bg-white/80 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'top-6 bg-white/50 py-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)]'
        }`}>
        <Link href={`/${lang}`} className="flex items-center gap-2 group cursor-pointer">
          <Smile className="text-primary transition-transform group-hover:rotate-12" size={26} strokeWidth={2.2} />
          <div className="text-xl font-bold tracking-tight">{t.common.brand_name}</div>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/40 p-1 rounded-full border border-white/50">
          {navLinks.map((link, index) => (
            <Link key={link.href} href={link.href} passHref legacyBehavior>
                 <a
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out cursor-pointer ${
                      pathname === link.href 
                        ? 'text-primary bg-white shadow-sm' 
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                    }`}
                >
                    {link.label}
                </a>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-on-surface hover:text-primary transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone size={16} className="text-primary" />
            </div>
            <span dir="ltr" className="hidden lg:inline">{displayPhoneNumber}</span>
          </a>
          
          <div className="mx-1">
            <LanguageSwitcher />
          </div>

          <button 
            onClick={handleBookingClick}
            className="bg-primary text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_14px_0_rgb(0,105,113,0.39)] hover:shadow-[0_6px_20px_rgba(0,105,113,0.23)] hover:-translate-y-0.5 transition-all duration-300">
            {t.nav.booking}
          </button>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-surface rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <Link href={`/${lang}`} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Smile className="text-primary" size={26} strokeWidth={2.2} />
                    <span className="text-xl font-bold">{t.common.brand_name}</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-surface rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-2 mb-8">
                  {navLinks.map((link) => (
                     <Link key={link.href} href={link.href} passHref legacyBehavior>
                        <a
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="block py-3 px-4 rounded-xl hover:bg-surface transition-colors text-lg font-medium"
                        >
                            {link.label}
                        </a>
                    </Link>
                  ))}
                </nav>

                <div className="mb-6 flex justify-center">
                  <LanguageSwitcher />
                </div>

                <button 
                  onClick={handleBookingClick}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all clinical-shadow btn-hover mb-6">
                  {t.nav.booking}
                </button>

                <div className="space-y-3">
                  <a
                    href={`tel:+${phoneNumber}`}
                    className="flex items-center gap-3 p-4 bg-surface rounded-2xl hover:bg-primary/10 transition-colors"
                  >
                    <Phone className="text-primary" size={20} />
                    <span dir="ltr" className="font-medium">{displayPhoneNumber}</span>
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-[#25D366]/10 rounded-2xl hover:bg-[#25D366]/20 transition-colors"
                  >
                    <MessageCircle className="text-[#25D366]" size={20} />
                    <span className="font-medium">{t.common.whatsapp}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <BookingModal ref={bookingModalRef} contact={contact} />
    </>
  );
}
