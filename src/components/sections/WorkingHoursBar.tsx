'use client';

import { useParams } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';

export default function WorkingHoursBar() {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const workingHours = [
    { day: t.contact.monday, time: '09:00 - 18:00' },
    { day: t.contact.tuesday, time: '09:00 - 18:00' },
    { day: t.contact.wednesday, time: '09:00 - 18:00' },
    { day: t.contact.thursday, time: '09:00 - 18:00' },
    { day: t.contact.friday, time: '09:00 - 18:00' },
    { day: t.contact.saturday, time: '10:00 - 14:00' },
    { day: t.contact.sunday, time: t.contact.closed },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full bg-white border-t border-gray-100 z-20">
      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-0 lg:divide-x lg:divide-gray-100">
          {workingHours.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center lg:py-8">
              <span className="text-sm font-medium text-[#222222] mb-1.5">{item.day}</span>
              <span className={`text-xs ${item.time === t.contact.closed ? 'text-red-500/90' : 'text-gray-400'}`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
