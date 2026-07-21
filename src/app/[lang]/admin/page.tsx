import { CalendarCheck, Users, FileText, HeartPulse, CreditCard, Image } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { name: 'Total Appointments', value: '1,248', change: '+12%', icon: CalendarCheck },
    { name: 'Active Doctors', value: '8', change: '0%', icon: Users },
    { name: 'Blog Posts', value: '24', change: '+3', icon: FileText },
    { name: 'Services Offered', value: '12', change: '+1', icon: HeartPulse },
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
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                  {stat.change}
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
            <button className="text-sm font-semibold text-primary hover:text-primary/80">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Patient Name {i}</h4>
                    <p className="text-xs text-slate-500">Dental Checkup • Today, 10:00 AM</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Pending</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Add New Doctor', icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100' },
              { name: 'Write Blog Post', icon: FileText, color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { name: 'Update Pricing', icon: CreditCard, color: 'bg-green-50 text-green-600 border-green-100' },
              { name: 'Edit Hero Section', icon: Image, color: 'bg-orange-50 text-orange-600 border-orange-100' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.name} className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all hover:shadow-md ${action.color}`}>
                  <Icon size={24} className="mb-3" />
                  <span className="text-sm font-bold">{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
