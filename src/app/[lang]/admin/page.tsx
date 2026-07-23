import Link from 'next/link';
import { CalendarCheck, Users, FileText, HeartPulse, CreditCard, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';

const SERVICE_LABELS: Record<string, string> = {
  implantology: 'Implantologie',
  orthodontics: 'Orthodontie',
  whitening: 'Blanchiment',
  pedodontics: 'Pédodontie',
};

export default async function AdminDashboardPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = createClient();

  const [
    { count: appointmentsCount },
    { count: pendingCount },
    { count: doctorsCount },
    { count: blogCount },
    { count: servicesCount },
    { data: recentAppointments = [] },
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    { name: 'Total Appointments', value: appointmentsCount ?? 0, sub: `${pendingCount ?? 0} pending`, icon: CalendarCheck },
    { name: 'Active Doctors', value: doctorsCount ?? 0, sub: 'Team members', icon: Users },
    { name: 'Published Posts', value: blogCount ?? 0, sub: 'On the blog', icon: FileText },
    { name: 'Active Services', value: servicesCount ?? 0, sub: 'Offered to patients', icon: HeartPulse },
  ];

  const quickActions = [
    { name: 'Add New Doctor', href: `/${lang}/${ADMIN_SECRET_PATH}/doctors/new`, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { name: 'Write Blog Post', href: `/${lang}/${ADMIN_SECRET_PATH}/blog/new`, icon: FileText, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: 'Add Package', href: `/${lang}/${ADMIN_SECRET_PATH}/pricing/new`, icon: CreditCard, color: 'bg-green-50 text-green-600 border-green-100' },
    { name: 'Add Offer', href: `/${lang}/${ADMIN_SECRET_PATH}/offers/new`, icon: Tag, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {stat.sub}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Appointments</h3>
            <Link href={`/${lang}/${ADMIN_SECRET_PATH}/appointments`} className="text-sm font-semibold text-primary hover:text-primary/80">View All</Link>
          </div>
          <div className="space-y-4">
            {recentAppointments && recentAppointments.length > 0 ? recentAppointments.map((appt: any) => (
              <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    {appt.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{appt.name}</h4>
                    <p className="text-xs text-slate-500">{SERVICE_LABELS[appt.service] || appt.service} • {new Date(appt.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                  appt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {appt.status}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-6">No appointment requests yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.name} href={action.href} className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all hover:shadow-md ${action.color}`}>
                  <Icon size={24} className="mb-3" />
                  <span className="text-sm font-bold">{action.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
