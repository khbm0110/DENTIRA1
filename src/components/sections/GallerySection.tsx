import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { Camera, ExternalLink } from 'lucide-react';
import AnimateIn from '../shared/AnimateIn';

export default async function GallerySection({ lang }: { lang?: string }) {
  const isAr = (lang || 'fr') === 'ar';

  const supabase = createClient();
  const [{ data: images }, { data: instagramLink }] = await Promise.all([
    supabase
      .from('gallery_images')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .limit(8),
    supabase
      .from('social_media')
      .select('url')
      .eq('platform', 'instagram')
      .eq('is_active', true)
      .single(),
  ]);

  if (!images || images.length === 0) return null;

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimateIn className="text-center mb-10 md:mb-16">
          <span className="bg-slate-50 text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            <Camera size={14} />
            {isAr ? 'من إنستغرام' : 'Depuis Instagram'}
          </span>
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
            {isAr ? 'معرض الصور' : 'Notre Galerie'}
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-4">
          {images.map((img: any) => (
            <a
              key={img.id}
              href={img.permalink || '#'}
              target={img.permalink ? '_blank' : undefined}
              rel="noreferrer"
              className="group relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden block"
            >
              <Image
                src={img.media_url}
                alt={img.caption ? img.caption.slice(0, 100) : 'Dentora'}
                fill
                sizes="(max-width: 640px) 25vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
              </div>
            </a>
          ))}
        </div>

        {instagramLink?.url && (
          <div className="text-center mt-8 md:mt-10">
            <a
              href={instagramLink.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              <Camera size={16} />
              {isAr ? 'زيارة صفحتنا على إنستغرام' : 'Voir notre profil Instagram'}
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
