import { Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import { deleteService } from '@/app/actions/admin';
import RowActions from '@/components/admin/RowActions';
import AdminSearchBox from '@/components/admin/AdminSearchBox';

export default async function ServicesAdminPage({ params, searchParams }: { params: { lang: string }; searchParams: { q?: string } }) {
  const { lang } = params;
  const supabase = createClient();
  const query = searchParams.q?.trim() || '';
  const basePath = `/${lang}/${ADMIN_SECRET_PATH}/services`;

  let request = supabase.from('services').select('*').order('created_at', { ascending: false });
  if (query) request = request.or(`name_fr.ilike.%${query}%,name_ar.ilike.%${query}%`);

  const { data: services = [], error } = await request;

  if (error) {
    console.error('Error fetching services:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Services Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage the services offered by the clinic.</p>
        </div>
        <Link 
          href={`/${lang}/${ADMIN_SECRET_PATH}/services/new`}
          className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add Service
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <AdminSearchBox basePath={basePath} defaultValue={query} placeholder="Search services..." />
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Service Name (FR)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services && services.length > 0 ? services.map((service: any) => (
              <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{service.name_fr}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    service.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <RowActions
                    editHref={`/${lang}/${ADMIN_SECRET_PATH}/services/${service.id}/edit`}
                    onDelete={deleteService.bind(null, service.id)}
                    confirmMessage={`Delete "${service.name_fr}"?`}
                  />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-400">
                {query ? `No services match "${query}".` : 'No services yet. Click "Add Service" to create one.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
