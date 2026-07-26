import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { Tag } from 'lucide-react';
import AnimateIn from '../shared/AnimateIn';

export default async function OffersSection({ lang }: { lang?: string }) {
  const currentLang = lang || 'fr';
  const isAr = currentLang === 'ar';

  const supabase = createClient();
  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
    .order('display_order', { ascending: true });

  if (!offers || offers.length === 0) return null;

  return (
    <section id="offers" className="py-16 md:py-24 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimateIn className="text-center mb-10 md:mb-16">
          <span className="bg-slate-50 text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            <Tag size={14} />
            {isAr ? 'عروض حصرية' : 'Offres Exclusives'}
          </span>
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
            {isAr ? 'العروض الحالية' : 'Nos Offres du Moment'}
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer: any) => {
            const title = isAr ? offer.title_ar : offer.title_fr;
            const description = isAr ? offer.description_ar : offer.description_fr;

            return (
              <div key={offer.id} className="bg-slate-50 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col">
                {offer.image_url && (
                  <div className="aspect-[1.6] relative">
                    <Image src={offer.image_url} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" referrerPolicy="no-referrer" />
                    {offer.discount_percentage && (
                      <span className="absolute top-4 right-4 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full">
                        -{offer.discount_percentage}%
                      </span>
                    )}
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{title}</h3>
                  {description && <p className="text-sm text-on-surface-variant mb-6 flex-1">{description}</p>}
                  {(offer.original_price || offer.discounted_price) && (
                    <div className="flex items-baseline gap-2 mb-6">
                      {offer.original_price && (
                        <span className="text-sm text-on-surface-variant line-through">{offer.original_price} MAD</span>
                      )}
                      {offer.discounted_price && (
                        <span className="text-2xl font-extrabold text-primary">{offer.discounted_price} MAD</span>
                      )}
                    </div>
                  )}
                  <a
                    href={`/${currentLang}#contact`}
                    className="text-center bg-primary text-white py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
                  >
                    {isAr ? 'استفد من العرض' : "Profiter de l'offre"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
