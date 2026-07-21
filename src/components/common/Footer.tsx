'use client';

import { useParams } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';

export default function Footer() {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  return (
    <footer id="contact" className="bg-gradient-to-br from-surface to-teal-50 pt-32 pb-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Newsletter Card */}
        <div className="bg-primary text-white rounded-[2.5rem] p-10 lg:p-14 mb-20 shadow-[0_20px_50px_rgb(0,105,113,0.3)] relative overflow-hidden">
          {/* Card Decorations */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                {t.footer.title}
              </h2>
              <p className="text-white/80 text-lg">
                Restez informé de nos dernières actualités et conseils dentaires.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-full py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
                placeholder={t.footer.email_placeholder}
                type="email"
              />
              <button className="bg-white text-primary px-8 py-4 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shrink-0">
                {t.footer.subscribe}
              </button>
            </div>
          </div>
        </div>

        {/* Links & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-outline-variant/60 pb-16 mb-8">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                dentistry
              </span>
              <div className="text-xl font-bold text-on-surface">{t.common.brand_name}</div>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6 pr-4">
              Votre clinique de confiance pour des soins dentaires d'excellence à Casablanca.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface hover:text-primary hover:shadow-md transition-all shadow-sm">
                <span className="sr-only">Facebook</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface hover:text-primary hover:shadow-md transition-all shadow-sm">
                <span className="sr-only">Instagram</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h6 className="text-sm font-bold text-on-surface mb-6">{t.footer.company}</h6>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">{t.nav.home}</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">{t.nav.about}</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">{t.nav.services}</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="text-sm font-bold text-on-surface mb-6">{t.footer.resources}</h6>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">{t.footer.blog}</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">{t.footer.faq}</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="text-sm font-bold text-on-surface mb-6">Contact</h6>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors block" href={`mailto:${t.footer.contact_email}`}>{t.footer.contact_email}</a></li>
              <li><a className="hover:text-primary transition-colors block" href={`tel:${t.common.phone_number}`}>{t.common.phone_number}</a></li>
              <li className="leading-relaxed">
                123 Boulevard Anfa,<br/>
                Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm font-medium text-on-surface-variant gap-4">
          <p>© 2026 {t.common.brand_name}. {t.footer.rights}</p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">{t.footer.terms}</a>
            <a className="hover:text-primary transition-colors" href="#">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
