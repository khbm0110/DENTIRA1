import { createClient } from '@/lib/supabase/server';
import FaqAccordion from './FaqAccordion';

export default async function FaqSection({ lang }: { lang?: string }) {
  const currentLang = lang || 'fr';
  const isAr = currentLang === 'ar';

  const supabase = createClient();
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (!faqs || faqs.length === 0) return null;

  const items = faqs.map((faq: any) => ({
    question: isAr ? faq.question_ar : faq.question_fr,
    answer: isAr ? faq.answer_ar : faq.answer_fr,
  }));

  return (
    <section id="faq" className="py-24 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
            {isAr ? 'الأسئلة الشائعة' : 'Questions Fréquentes'}
          </h2>
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
