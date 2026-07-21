import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, HeartPulse, MessageSquareQuote, 
  HelpCircle, FileText, CalendarCheck, CreditCard, Image as ImageIcon, Settings, LogOut, PanelLeftClose, PanelRightClose
} from 'lucide-react';
import dictionary from '@/lib/i18n/dictionary';

export default function AdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const lang = params.lang || 'fr';
  const isRtl = lang === 'ar';
  
  const navItems = [
    { name: 'Dashboard', href: `/admin`, icon: LayoutDashboard },
    { name: 'Website Content', href: `/admin/content`, icon: FileText },
    { name: 'Appointments', href: `/admin/appointments`, icon: CalendarCheck },
    { name: 'Services', href: `/admin/services`, icon: HeartPulse },
    { name: 'Doctors', href: `/admin/doctors`, icon: Users },
    { name: 'Testimonials', href: `/admin/testimonials`, icon: MessageSquareQuote },
    { name: 'FAQ', href: `/admin/faqs`, icon: HelpCircle },
    { name: 'Blog', href: `/admin/blog`, icon: FileText },
    { name: 'Pricing Plans', href: `/admin/pricing`, icon: CreditCard },
    { name: 'Media Library', href: `/admin/media`, icon: ImageIcon },
    { name: 'Settings', href: `/admin/settings`, icon: Settings },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href={`/${lang}/admin`} className="font-bold text-xl text-primary tracking-tight">
            Dentora<span className="text-slate-400 font-medium">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={`/${lang}${item.href}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Icon size={18} className="shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <Link href={`/${lang}`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
            <LogOut size={18} className={isRtl ? 'rotate-180' : ''} />
            Back to Website
          </Link>
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
                <span className="px-2 py-1 bg-primary text-white">FR</span>
                <span className="px-2 py-1 text-slate-500 hover:bg-slate-50 cursor-pointer">AR</span>
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
