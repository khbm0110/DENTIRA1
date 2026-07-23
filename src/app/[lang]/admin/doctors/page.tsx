import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import { deleteDoctor } from '@/app/actions/admin';
import RowActions from '@/components/admin/RowActions';

export default async function DoctorsAdminPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = createClient();
  
  const { data: doctors = [], error } = await supabase
    .from('doctors')
    .select('*')
    .order('created_at', { ascending: false });

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
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search doctors..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">Filter</button>
          </div>
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
            {doctors && doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
