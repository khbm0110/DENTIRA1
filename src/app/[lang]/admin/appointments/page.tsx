import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import AppointmentStatusControl from '@/components/admin/AppointmentStatusControl';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import Pagination from '@/components/admin/Pagination';

const SERVICE_LABELS: Record<string, string> = {
  implantology: 'Implantologie',
  orthodontics: 'Orthodontie',
  whitening: 'Blanchiment',
  pedodontics: 'Pédodontie',
};

const PAGE_SIZE = 20;

export default async function AppointmentsAdminPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { page?: string; q?: string };
}) {
  const { lang } = params;
  const supabase = createClient();
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const query = searchParams.q?.trim() || '';
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const basePath = `/${lang}/${ADMIN_SECRET_PATH}/appointments`;

  let request = supabase
    .from('appointments')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (query) {
    request = request.or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data: appointments = [], count, error } = await request;

  if (error) console.error('Error fetching appointments:', error);

  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-500 text-sm mt-1">Manage patient appointment requests booked from the website.</p>
        </div>
        <AdminSearchBox basePath={basePath} defaultValue={query} placeholder="Search name, phone, email..." />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  {query ? `No appointments match "${query}".` : 'No appointment requests yet.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination basePath={basePath} currentPage={page} totalPages={totalPages} searchQuery={query} />
      </div>
    </div>
  );
}
