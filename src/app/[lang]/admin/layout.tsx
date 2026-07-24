'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, HeartPulse, MessageSquareQuote,
  HelpCircle, FileText, CalendarCheck, CreditCard, Image as ImageIcon, Settings, LogOut, Tag, Menu, X
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
  const pathname = usePathname();
  const base = `/${lang}/${ADMIN_SECRET_PATH}`;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: ``, icon: LayoutDashboard },
    { name: 'Website Content', href: `/content`, icon: FileText },
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

  const isActive = (href: string) => {
    const full = `${base}${href}`;
    return href === '' ? pathname === base : pathname.startsWith(full);
  };

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <Link href={base} className="font-bold text-xl text-primary tracking-tight" onClick={() => setMobileNavOpen(false)}>
          Dentora<span className="text-slate-400 font-medium">Admin</span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-700"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={`${base}${item.href}`}
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'text-primary bg-primary/10' : 'text-slate-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1 shrink-0">
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
    </>
  );

  return (
    <div className={`min-h-screen bg-slate-50 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Desktop sidebar - fixed, always visible md and up */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 fixed h-full flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar - slide-in drawer + backdrop, only rendered when open */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <aside className={`relative w-72 max-w-[85%] bg-white h-full flex flex-col shadow-xl ${isRtl ? 'mr-0 ml-auto' : ''}`}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-w-0 ${isRtl ? 'md:pr-64' : 'md:pl-64'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-base md:text-lg font-bold text-slate-800 truncate">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <span className="text-xs font-semibold px-2 py-1 text-slate-500">Editing as:</span>
              <div className="flex bg-white rounded-md shadow-sm overflow-hidden text-xs font-bold border border-slate-200">
                <Link href={`/fr/${ADMIN_SECRET_PATH}`} className={`px-2 py-1 ${lang === 'fr' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}>FR</Link>
                <Link href={`/ar/${ADMIN_SECRET_PATH}`} className={`px-2 py-1 ${lang === 'ar' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}>AR</Link>
              </div>
            </div>

            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
