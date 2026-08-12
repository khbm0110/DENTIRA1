'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import dictionary from '@/lib/i18n/dictionary';
import NewsletterForm from '../shared/NewsletterForm';
import type { ContactInfo, SocialLink } from '@/lib/supabase/public-settings';

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  facebook: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
  ),
  instagram: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  ),
  tiktok: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  ),
};

export default function Footer({ contact, social }: { contact?: ContactInfo; social?: SocialLink[] }) {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const phone = contact?.phone || t.common.phone_number;
  const email = contact?.email || t.footer.contact_email;
  const address = lang === 'ar' ? (contact?.address_ar || 'الدار البيضاء، المغرب') : (contact?.address_fr || 'Casablanca, Maroc');

  const quickLinks = [
    { label: t.nav.home, href: `/${lang}` },
    { label: t.nav.about, href: `/${lang}#why-choose` },
    { label: t.nav.services, href: `/${lang}#services` },
  ];

  const resourceLinks = [
    { label: t.footer.blog, href: `/${lang}/blog` },
    { label: t.footer.faq, href: `/${lang}#faq` },
  ];

  return (
    <footer id="contact" className="bg-[#0C4A6E] pt-16 md:pt-32 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-2xl p-8 sm:p-10 lg:p-14 mb-12 md:mb-20 shadow-soft-xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
                {t.footer.title}
              </h2>
              <p className="text-on-surface-variant text-lg">
                {lang === 'ar' ? 'ابق على اطلاع بآخر أخبارنا ونصائحنا لطب الأسنان.' : "Restez inform\u00e9 de nos derni\u00e8res actualit\u00e9s et conseils dentaires."}
              </p>
            </div>
            <NewsletterForm placeholder={t.footer.email_placeholder} buttonText={t.footer.subscribe} lang={lang} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-8">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smile className="text-primary" size={20} strokeWidth={2.2} />
              </div>
              <div className="text-xl font-bold text-white">{t.common.brand_name}</div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 pr-4">
              {lang === 'ar' ? 'عيادتكم الموثوقة للحصول على رعاية أسنان متميزة بالدار البيضاء.' : "Votre clinique de confiance pour des soins dentaires d'excellence \u00e0 Casablanca."}
            </p>
            {social && social.length > 0 && (
              <div className="flex gap-3">
                {social.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary/20 hover:text-primary transition-all"
                  >
                    <span className="sr-only">{s.platform}</span>
                    {SOCIAL_ICONS[s.platform.toLowerCase()] || <span className="text-xs font-bold uppercase">{s.platform.slice(0, 2)}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h6 className="text-sm font-bold text-white mb-6">{t.footer.company}</h6>
            <ul className="space-y-4 text-sm font-medium text-white/50">
              {quickLinks.map((link) => (
                <li key={link.href}><a className="hover:text-white transition-colors" href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-sm font-bold text-white mb-6">{t.footer.resources}</h6>
            <ul className="space-y-4 text-sm font-medium text-white/50">
              {resourceLinks.map((link) => (
                <li key={link.href}><a className="hover:text-white transition-colors" href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-sm font-bold text-white mb-6">Contact</h6>
            <ul className="space-y-4 text-sm font-medium text-white/50">
              <li><a className="hover:text-white transition-colors block" href={`mailto:${email}`}>{email}</a></li>
              <li><a className="hover:text-white transition-colors block" href={`tel:${phone}`} dir="ltr" style={{ unicodeBidi: 'isolate' }}>{phone}</a></li>
              <li className="leading-relaxed">{address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm font-medium text-white/40 gap-4">
          <p>{`© ${new Date().getFullYear()} ${t.common.brand_name}. ${t.footer.rights}`}</p>
          <div className="flex gap-6">
            <a className="hover:text-white transition-colors" href="#">{t.footer.terms}</a>
            <a className="hover:text-white transition-colors" href="#">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
