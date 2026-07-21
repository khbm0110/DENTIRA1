import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function AppointmentsAdminPage() {
  const appointments = [
    { id: 1, patient: 'Ayoub El Fassi', service: 'Consultation', date: 'Oct 15, 2026', time: '10:00 AM', status: 'Pending' },
    { id: 2, patient: 'Mouna Cherkaoui', service: 'Blanchiment', date: 'Oct 15, 2026', time: '11:30 AM', status: 'Confirmed' },
    { id: 3, patient: 'Youssef Bennis', service: 'Urgence', date: 'Oct 16, 2026', time: '09:00 AM', status: 'Completed' },
    { id: 4, patient: 'Kenza Tazi', service: 'Consultation', date: 'Oct 16, 2026', time: '14:00 PM', status: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-500 text-sm mt-1">Manage patient appointment requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
            <Filter size={16} /> Filter
          </button>
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{apt.patient}</td>
                <td className="px-6 py-4">{apt.service}</td>
                <td className="px-6 py-4">{apt.date} at {apt.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50" title="Confirm">
                      <CheckCircle size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" title="Cancel">
                      <XCircle size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10" title="View Details">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
