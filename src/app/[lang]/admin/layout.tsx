'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, HeartPulse, MessageSquareQuote, 
  HelpCircle, FileText, CalendarCheck, CreditCard, Image as ImageIcon, Settings, LogOut, Tag
} from 'lucide-react';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import { signOut } from '@/lib/supabase/auth';

export default function AdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const lang = params.lang || 'fr';
  const isRtl = lang === 'ar';
  const router = useRouter();
  const base = `/${lang}/${ADMIN_SECRET_PATH}`;
  
  const navItems = [
    { name: 'Dashboard', href: ``, icon: LayoutDashboard },
    { name: 'Appointments', href: `/appointments`, icon: CalendarCheck },
    { name: 'Services', href: `/services`, icon: HeartPulse },
    { name: 'Doctors', href: `/doctors`, icon: Users },
    { name: 'Packages (الباقات)', href: `/pricing`, icon: CreditCard },
    { name: 'Offers (العروض)', href: `/offers`, icon: Tag },
    { name: 'Testimonials', href: `/testimonials`, icon: MessageSquareQuote },
    { name: 'FAQ', href: `/faqs`, icon: HelpCircle },
    { name: 'Blog', href: `/blog`, icon: FileText },
    { name: 'Media Library', href: `/media`, icon: ImageIcon },
    { name: 'Settings', href: `/settings`, icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push(`/${lang}/${ADMIN_SECRET_PATH}/login`);
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href={base} className="font-bold text-xl text-primary tracking-tight">
            Dentora<span className="text-slate-400 font-medium">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={`${base}${item.href}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Icon size={18} className="shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link href={`/${lang}`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
            <LayoutDashboard size={18} className={isRtl ? 'rotate-180' : ''} />
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} className={isRtl ? 'rotate-180' : ''} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${isRtl ? 'pr-64' : 'pl-64'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <span className="text-xs font-semibold px-2 py-1 text-slate-500">Editing as:</span>
              <div className="flex bg-white rounded-md shadow-sm overflow-hidden text-xs font-bold border border-slate-200">
                <Link href={`/fr/${ADMIN_SECRET_PATH}`} className={`px-2 py-1 ${lang === 'fr' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}>FR</Link>
                <Link href={`/ar/${ADMIN_SECRET_PATH}`} className={`px-2 py-1 ${lang === 'ar' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}>AR</Link>
              </div>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
