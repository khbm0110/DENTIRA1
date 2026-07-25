import { createClient } from '@/lib/supabase/server';
import dictionary from '@/lib/i18n/dictionary';
import { Check } from 'lucide-react';

export default async function PricingSection({ lang }: { lang?: string }) {
  const currentLang = lang || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  const supabase = createClient();
  const { data: plans } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (!plans || plans.length === 0) return null; // nothing to show yet, don't render an empty section

  return (
    <section id="pricing" className="py-16 md:py-24 bg-slate-50" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <span className="bg-white text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            {t.annualSubscription.tag}
          </span>
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
            {t.annualSubscription.title}
          </h2>
          <p className="text-on-surface-variant mt-4 max-w-xl mx-auto">{t.annualSubscription.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan: any) => {
            const name = currentLang === 'ar' ? plan.name_ar : plan.name_fr;
            const features: string[] = currentLang === 'ar' ? plan.features_ar : plan.features_fr;
            const buttonText = (currentLang === 'ar' ? plan.button_text_ar : plan.button_text_fr) || t.annualSubscription.cta;

            return (
              <div key={plan.id} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col">
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">{name}</h3>
                <p className="text-3xl font-extrabold text-primary mb-6">
                  {plan.price} <span className="text-base font-medium text-on-surface-variant">{plan.currency}</span>
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {(features || []).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <Check size={18} className="text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={`/${currentLang}#contact`}
                  className="text-center bg-primary text-white py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
                >
                  {buttonText}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
