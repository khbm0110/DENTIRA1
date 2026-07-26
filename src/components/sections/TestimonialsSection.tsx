import dictionary from '@/lib/i18n/dictionary';
import { createClient } from '@/lib/supabase/server';
import TestimonialsCarousel from './TestimonialsCarousel';

// Shown only if there are no published testimonials yet, so the section
// never looks empty on a brand new site.
const fallbackReviews = [
  {
    name: "Amina El Fassi",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    rating: 5,
    text: "Service exceptionnel et personnel très attentionné. Je recommande vivement !",
  },
  {
    name: "Youssef Benjelloun",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
    rating: 5,
    text: "Très satisfait de mon traitement. L'équipe est formidable et les résultats sont au-delà de mes attentes.",
  },
  {
    name: "Fatima Zahra",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80",
    rating: 5,
    text: "Bonne expérience globale. Le cabinet est très moderne et propre. L'équipe est à l'écoute.",
  },
];

export default async function TestimonialsSection({ lang }: { lang?: string }) {
  const currentLang = lang || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;

  const supabase = createClient();
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  const reviews = testimonials && testimonials.length > 0
    ? testimonials.map((rev: any) => ({
        name: currentLang === 'ar' ? rev.name_ar : rev.name_fr,
        photo: rev.photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
        rating: rev.rating || 5,
        text: currentLang === 'ar' ? rev.review_ar : rev.review_fr,
      }))
    : fallbackReviews;

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
            {t.testimonials.title}
          </h2>
        </div>

        <TestimonialsCarousel reviews={reviews} isRtl={currentLang === 'ar'} />
      </div>
    </section>
  );
}
