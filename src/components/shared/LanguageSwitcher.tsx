'use client';

// DENTORA-OS - LANGUAGE SWITCHER COMPONENT
// Uses Zustand store for persistent language preference

import { useTransition } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useAppStore } from '../../lib/stores/app-store';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { setLanguage } = useAppStore();
  const [isPending, startTransition] = useTransition();

  const currentLocale = (params.lang as string) || 'fr';

  const handleSwitch = (newLocale: 'fr' | 'ar') => {
    if (currentLocale === newLocale) return;

    // Update <html lang/dir> immediately so the text direction and fonts
    // flip right away instead of waiting for the new page to finish
    // rendering on the server - this is what made the switch feel
    // sluggish/jumpy before.
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';

    setLanguage(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    const newPath = pathname.startsWith(`/${currentLocale}`)
      ? `/${newLocale}${pathname.substring(1 + currentLocale.length)}`
      : `/${newLocale}${pathname}`;

    // useTransition keeps the current (old-language) page visible and
    // interactive while the new one streams in, instead of the UI
    // appearing to freeze for a moment and then snapping to the new page.
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div
      className={`flex items-center bg-surface/50 backdrop-blur-sm border border-outline-variant/30 rounded-full p-1 shadow-sm transition-opacity duration-200 ${
        isPending ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <button
        onClick={() => handleSwitch('fr')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 disabled:cursor-wait ${
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
        disabled={isPending}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 disabled:cursor-wait ${
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
