import { createClient } from '@/lib/supabase/server';
import AppointmentStatusControl from '@/components/admin/AppointmentStatusControl';

const SERVICE_LABELS: Record<string, string> = {
  implantology: 'Implantologie',
  orthodontics: 'Orthodontie',
  whitening: 'Blanchiment',
  pedodontics: 'Pédodontie',
};

export default async function AppointmentsAdminPage() {
  const supabase = createClient();

  const { data: appointments = [], error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching appointments:', error);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-500 text-sm mt-1">Manage patient appointment requests booked from the website.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Preferred Date</th>
              <th className="px-6 py-4">Requested</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments && appointments.length > 0 ? appointments.map((appt: any) => (
              <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{appt.name}</td>
                <td className="px-6 py-4">
                  <div>{appt.phone}</div>
                  {appt.email && <div className="text-xs text-slate-400">{appt.email}</div>}
                </td>
                <td className="px-6 py-4">{SERVICE_LABELS[appt.service] || appt.service}</td>
                <td className="px-6 py-4">{appt.preferred_date ? new Date(appt.preferred_date).toLocaleString() : '—'}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{new Date(appt.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <AppointmentStatusControl id={appt.id} status={appt.status} />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">No appointment requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
