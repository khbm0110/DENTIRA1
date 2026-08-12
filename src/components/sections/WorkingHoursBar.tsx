'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import dictionary from '@/lib/i18n/dictionary';
import type { WorkingHours } from '@/lib/supabase/public-settings';

const DAY_KEYS: (keyof WorkingHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
// JS Date.getDay(): 0=Sunday...6=Saturday. Map to our DAY_KEYS index (monday-first).
const JS_DAY_TO_INDEX = [6, 0, 1, 2, 3, 4, 5];

export default function WorkingHoursBar({ hours }: { hours?: WorkingHours }) {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;
  const scrollerRef = useRef<HTMLDivElement>(null);

  const dayLabels: Record<string, string> = {
    monday: t.contact.monday,
    tuesday: t.contact.tuesday,
    wednesday: t.contact.wednesday,
    thursday: t.contact.thursday,
    friday: t.contact.friday,
    saturday: t.contact.saturday,
    sunday: t.contact.sunday,
  };

  const todayIndex = JS_DAY_TO_INDEX[new Date().getDay()];

  const workingHours = DAY_KEYS.map((day, index) => {
    const dayHours = hours?.[day];
    return {
      day: dayLabels[day],
      time: dayHours && !dayHours.enabled ? t.contact.closed : dayHours ? `${dayHours.open} - ${dayHours.close}` : '09:00 - 18:00',
      isToday: index === todayIndex,
    };
  });

  // On mobile, gently scroll so today's card is visible without the visitor
  // needing to swipe first.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const todayEl = scroller.children[todayIndex] as HTMLElement | undefined;
    if (todayEl) {
      const offset = todayEl.offsetLeft - scroller.clientWidth / 2 + todayEl.clientWidth / 2;
      scroller.scrollTo({ left: Math.max(0, offset), behavior: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-xl border-t border-outline-variant/30 z-20">
      <div className="max-w-7xl mx-auto lg:px-6">
        {/* Mobile / tablet: horizontal swipeable slider */}
        <div
          ref={scrollerRef}
          className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 px-6 py-4 no-scrollbar"
        >
          {workingHours.map((item, index) => (
            <div
              key={index}
              className={`snap-center shrink-0 w-24 flex flex-col items-center justify-center text-center py-2.5 rounded-xl transition-colors ${
                item.isToday ? 'bg-primary/10' : 'hover:bg-surface'
              }`}
            >
              <span className={`text-xs font-bold mb-1 ${item.isToday ? 'text-primary' : 'text-foreground'}`}>{item.day}</span>
              <span className={`text-[11px] ${item.time === t.contact.closed ? 'text-destructive' : 'text-on-surface-variant'}`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop: full row, no scrolling needed */}
        <div className="hidden lg:grid grid-cols-7 divide-x divide-outline-variant/30">
          {workingHours.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center py-8">
              <span className={`text-sm font-medium mb-1.5 ${item.isToday ? 'text-primary font-bold' : 'text-foreground'}`}>{item.day}</span>
              <span className={`text-xs ${item.time === t.contact.closed ? 'text-destructive' : 'text-on-surface-variant'}`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
