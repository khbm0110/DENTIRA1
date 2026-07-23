import Image from 'next/image';
import dictionary from '@/lib/i18n/dictionary';
import { createClient } from '@/lib/supabase/server';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center text-yellow-500 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
};

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
    <section id="testimonials" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
              <StarRating rating={review.rating} />
              <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                &quot;{review.text}&quot;
              </p>
              <div className="flex items-center gap-4">
                <Image src={review.photo} alt={review.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-bold text-on-surface text-sm">{review.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
