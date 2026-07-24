import { Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import { deleteDoctor } from '@/app/actions/admin';
import RowActions from '@/components/admin/RowActions';
import AdminSearchBox from '@/components/admin/AdminSearchBox';

export default async function DoctorsAdminPage({ params, searchParams }: { params: { lang: string }; searchParams: { q?: string } }) {
  const { lang } = params;
  const supabase = createClient();
  const query = searchParams.q?.trim() || '';
  const basePath = `/${lang}/${ADMIN_SECRET_PATH}/doctors`;

  let request = supabase.from('doctors').select('*').order('created_at', { ascending: false });
  if (query) request = request.or(`name_fr.ilike.%${query}%,name_ar.ilike.%${query}%,specialty_fr.ilike.%${query}%`);

  const { data: doctors = [], error } = await request;

  if (error) {
    console.error('Error fetching doctors:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Doctors Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your clinic's doctors and specialists.</p>
        </div>
        <Link
          href={`/${lang}/${ADMIN_SECRET_PATH}/doctors/new`}
          className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add Doctor
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <AdminSearchBox basePath={basePath} defaultValue={query} placeholder="Search doctors or specialty..." />
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Doctor</th>
              <th className="px-6 py-4">Specialty (FR)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctors && doctors.length > 0 ? doctors.map((doctor: any) => (
              <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {doctor.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={doctor.image_url} alt={doctor.name_fr} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                        {doctor.name_fr?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <span className="font-bold text-slate-800">{doctor.name_fr}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{doctor.specialty_fr}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    doctor.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doctor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <RowActions
                    editHref={`/${lang}/${ADMIN_SECRET_PATH}/doctors/${doctor.id}/edit`}
                    onDelete={deleteDoctor.bind(null, doctor.id)}
                    confirmMessage={`Delete "${doctor.name_fr}"?`}
                  />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                {query ? `No doctors match "${query}".` : 'No doctors yet. Click "Add Doctor" to create one.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
