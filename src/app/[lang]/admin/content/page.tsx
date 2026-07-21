import { LayoutTemplate, Edit2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ContentAdminPage({ params }: { params: { lang: string } }) {
  const { lang } = params;

  const sections = [
    { id: 'hero', name: 'Hero Section', description: 'Main banner, background image, CTA buttons', status: 'Published' },
    { id: 'about', name: 'About Clinic', description: 'Clinic introduction, mission, vision', status: 'Published' },
    { id: 'services', name: 'Services Preview', description: 'Homepage services highlight section', status: 'Published' },
    { id: 'why-choose-us', name: 'Why Choose Us', description: 'Key benefits, statistics, features', status: 'Draft' },
    { id: 'contact', name: 'Contact & Location', description: 'Address, map, quick contact info', status: 'Published' },
    { id: 'footer', name: 'Footer', description: 'Bottom navigation, social links, legal', status: 'Published' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Website Content</h2>
          <p className="text-slate-500 text-sm mt-1">Manage the content and layout of your homepage sections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <LayoutTemplate size={24} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                section.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {section.status === 'Published' && <CheckCircle2 size={12} />}
                {section.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{section.name}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">{section.description}</p>
            
            <Link 
              href={`/${lang}/admin/content/${section.id}`}
              className="w-full py-2.5 rounded-lg border border-slate-200 font-bold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Edit2 size={16} />
              Edit Content
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
