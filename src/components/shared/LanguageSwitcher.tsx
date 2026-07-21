'use client';

// DENTORA-OS - LANGUAGE SWITCHER COMPONENT
// Uses Zustand store for persistent language preference

import { usePathname, useRouter, useParams } from 'next/navigation';
import { useAppStore } from '../../lib/stores/app-store';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { setLanguage } = useAppStore();
  
  const currentLocale = (params.lang as string) || 'fr';

  const handleSwitch = (newLocale: 'fr' | 'ar') => {
    if (currentLocale === newLocale) return;
    
    setLanguage(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    const newPath = pathname.startsWith(`/${currentLocale}`)
      ? `/${newLocale}${pathname.substring(1 + currentLocale.length)}`
      : `/${newLocale}${pathname}`;

    router.push(newPath);
  };

  return (
    <div className="flex items-center bg-surface/50 backdrop-blur-sm border border-outline-variant/30 rounded-full p-1 shadow-sm">
      <button
        onClick={() => handleSwitch('fr')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
          currentLocale === 'fr' 
            ? 'bg-white text-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
        aria-label="Switch to French"
      >
        <span className="text-base leading-none">🇫🇷</span> FR
      </button>
      <button
        onClick={() => handleSwitch('ar')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
          currentLocale === 'ar' 
            ? 'bg-white text-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
        aria-label="Switch to Arabic"
      >
        <span className="text-base leading-none">🇲🇦</span> AR
      </button>
    </div>
  );
}
