import Image from 'next/image';
import dictionary from '@/lib/i18n/dictionary';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'fr';
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;
  const title = lang === 'ar' ? 'مدونة دنتورا - نصائح طب الأسنان' : 'Blog Dentora - Conseils Dentaires';
  const description = lang === 'ar'
    ? 'مقالات ونصائح حول صحة الأسنان من فريق عيادة دنتورا بالدار البيضاء.'
    : "Articles et conseils sur la santé dentaire par l'équipe de la clinique Dentora à Casablanca.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { fr: '/fr/blog', ar: '/ar/blog' },
    },
    openGraph: { title, description, locale: lang === 'ar' ? 'ar_MA' : 'fr_MA' },
  };
}

export default async function BlogPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || 'fr';
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;
  const supabase = createClient();
  
  const { data: postsData } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const defaultArticles = [
    { 
      id: 1, 
      key: 'card1_title', 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-CTFHj6bwuFim8vTiLsb-aJr2_xUUAkEe54KHmnLjLBe6E2Q6dIMpPAkn8ESMxM8wmWGkxd7W20anQ-AplUml20eecdV3B8nlaumDm2w1k5C5wkc_vtglzqH1CxA4-nt9NAzFzOFtVwOizKk1-hPKfqLyHvf_O-fGS7xfYt0ok3Ex8aZlC4WjB1eXbfiqFEvSfNwWSYERiAZVIctyhL5DHGEavZbYL1y-fvcR7Q62n52nC4VPIV6ujl8ICraThkWsYjUfUGoITyc',
      category: 'Hygiène'
    },
    { 
      id: 2, 
      key: 'card2_title', 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAANVyYoYuAewy1bmkcI5fihKcM59PYn5BOCXKF5qiTbb_e9A69g2pFlmCjRMNlQJiEp4GIEYcjVXYWyAwdyWjGs-Jlr_5FsPYrdVrD0HvsTmQRj1Y9Mp2mP-amABg_dNOaa6xdR-NKZcgsxR1xK2kDcisImk6Hd0ts8yLieopjquzrlN6AYqVwf2HTlYVoGZRNRFGEREJHsPCVItKn9TKpUWIXw0EATQtbXSPf5kjdXtbHTAfFoCUYin4ZFo4vtYZA9ce8Edq3huw',
      category: 'Prévention'
    },
    { 
      id: 3, 
      key: 'card3_title', 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7uCb3k4XZe3Khrr5M6hyvfKR5R4ihLLuM6Zcv4gUM0p5NCbDPRjh9XajpftX1GDyqwgyHlYhubuchmRITjAN26cDFOG0BxcCSH-_ipwjO22M7k5BHL_nTYQGnNWg0JlG26UnnBdp8_TnVG9JdBAQ3N0gadxhxkOMGnFWkKvl5ASPOpIxaxi8zxxaZArs06bX4Vzi9vZQiFqghocVYJ3Mzi_nlc3DlD-7NK_LBLT45A2-vf8n71HLPU6ibsOXlmJupy26QnU58iz0',
      category: 'Technologie'
    }
  ];

  const displayArticles = postsData && postsData.length > 0 
    ? postsData.map(p => ({
        id: p.id,
        title: lang === 'ar' ? p.title_ar : p.title_fr,
        image: p.image_url || "https://images.unsplash.com/photo-1629904853716-f0bc64eea169?auto=format&fit=crop&q=80",
        category: 'Article',
        slug: p.slug
      }))
    : defaultArticles.map(a => ({
        id: a.id,
        title: t.blog[a.key as keyof typeof t.blog],
        image: a.image,
        category: a.category,
        slug: '#'
      }));

  return (
    <>
      <main className="pt-32 pb-24 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="bg-white text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
              {t.blog.tag}
            </span>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t.blog.title}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.map((article) => (
              <article key={article.id} className="bg-white p-4 rounded-4xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] group transition-all duration-300">
                <div className="aspect-[1.1] rounded-3xl overflow-hidden mb-6 relative">
                  <Image
                    alt={article.title}
                    src={article.image}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-2">
                  <p className="text-xs font-bold text-primary mb-2">{article.category}</p>
                  <h4 className="font-bold text-lg mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  {article.slug && article.slug !== '#' ? (
                    <Link href={`/${lang}/blog/${article.slug}`} className="text-xs font-bold flex items-center gap-1 text-on-surface group-hover:gap-2 transition-all">
                      <span className="material-symbols-outlined text-sm">subdirectory_arrow_right</span>
                      {t.blog.read_more}
                    </Link>
                  ) : (
                    <span className="text-xs font-bold text-slate-300">{lang === 'ar' ? 'قريباً' : 'Bientôt disponible'}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
