import Image from 'next/image';
import dictionary from '@/lib/i18n/dictionary';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function BlogSection({ lang }: { lang?: string }) {
  const currentLang = lang || 'fr';
  const t = currentLang === 'ar' ? dictionary.ar : dictionary.fr;
  const supabase = createClient();
  
  const { data: postsData } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const defaultPosts = [
    {
      title: t.blog.card1_title,
      img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80",
    },
    {
      title: t.blog.card2_title,
      img: "https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?auto=format&fit=crop&q=80",
    },
    {
      title: t.blog.card3_title,
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    }
  ];

  const displayPosts = postsData && postsData.length > 0 
    ? postsData.map(p => ({
        title: currentLang === 'ar' ? p.title_ar : p.title_fr,
        img: p.image_url || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80",
        slug: p.slug
      }))
    : defaultPosts;

  return (
    <section id="blog" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="bg-white text-on-surface-variant px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">
              {t.blog.tag}
            </span>
            <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t.blog.title}
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {displayPosts.map((blog, index) => (
            <article
              key={index}
              className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] group transition-all duration-300"
            >
              <div className="aspect-[4/3] rounded-[1.25rem] overflow-hidden mb-6 relative">
                <Image
                  alt={blog.title}
                  src={blog.img}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-2">
                <h4 className="font-bold text-lg mb-4 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h4>
                <Link href={`/${currentLang}/blog/${(blog as any).slug || '#'}`} className="text-xs font-bold flex items-center gap-1 text-on-surface group-hover:gap-2 transition-all">
                  <span className="material-symbols-outlined text-sm">arrow_forward</span> {t.blog.read_more}
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center">
          <Link href={`/${currentLang}/blog`}>
            <span className="bg-primary text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-[0_8px_25px_-5px_rgb(0,105,113,0.4)] hover:-translate-y-1 transition-all duration-300 inline-flex">
              {t.blog.view_all_articles}
              <span className="material-symbols-outlined text-lg">arrow_outward</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
