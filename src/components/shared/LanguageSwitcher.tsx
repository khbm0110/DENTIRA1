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
  const targetLocale = currentLocale === 'fr' ? 'ar' : 'fr';

  const handleSwitch = () => {
    setLanguage(targetLocale);
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;

    const newPath = pathname.startsWith(`/${currentLocale}`)
      ? `/${targetLocale}${pathname.substring(1 + currentLocale.length)}`
      : `/${targetLocale}${pathname}`;

    router.push(newPath);
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium"
      aria-label={`Switch to ${targetLocale === 'fr' ? 'French' : 'Arabic'}`}
    >
      <span className="text-xs font-bold uppercase">{targetLocale}</span>
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </button>
  );
}
