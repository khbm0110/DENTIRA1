'use client';
import { useParams } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';
import NavigationBar from '@/components/common/NavigationBar';

// Mock data for all articles
const allArticles = [
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
  },
  // Add more mock articles as needed
  {
    id: 4,
    key: 'card1_title',
    image: 'https://images.unsplash.com/photo-1629904853716-f0bc64eea169?auto=format&fit=crop&q=80',
    category: 'Esthétique'
  },
  {
    id: 5,
    key: 'card2_title',
    image: 'https://images.unsplash.com/photo-1599493356233-034455829a28?auto=format&fit=crop&q=80',
    category: 'Soins'
  },
  {
    id: 6,
    key: 'card3_title',
    image: 'https://images.unsplash.com/photo-1616464916566-f23b75382029?auto=format&fit=crop&q=80',
    category: 'Conseils'
  }
];

export default function BlogPage() {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  return (
    <>
      <NavigationBar />
      <main className="pt-32 pb-24 bg-surface">
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
            {allArticles.map((article) => (
              <article key={article.id} className="bg-white p-4 rounded-4xl clinical-shadow group">
                <div className="aspect-[1.1] rounded-3xl overflow-hidden mb-6 relative">
                  <img
                    alt={t.blog[article.key as keyof typeof t.blog]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={article.image}
                  />
                </div>
                <div className="px-2">
                  <p className="text-xs font-bold text-primary mb-2">{article.category}</p>
                  <h4 className="font-bold text-lg mb-4 group-hover:text-primary transition-colors">
                    {t.blog[article.key as keyof typeof t.blog]}
                  </h4>
                  <a href="#" className="text-xs font-bold flex items-center gap-1 text-on-surface group-hover:gap-2 transition-all">
                    <span className="material-symbols-outlined text-sm">subdirectory_arrow_right</span>
                    {t.blog.read_more}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
