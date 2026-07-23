import { Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import { deleteFaq } from '@/app/actions/admin';
import RowActions from '@/components/admin/RowActions';
import FaqActiveToggle from '@/components/admin/FaqActiveToggle';

export default async function FaqsAdminPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = createClient();

  const { data: faqs = [] } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">FAQ</h2>
          <p className="text-slate-500 text-sm mt-1">Manage the frequently asked questions shown on the website.</p>
        </div>
        <Link
          href={`/${lang}/${ADMIN_SECRET_PATH}/faqs/new`}
          className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add Question
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Question (FR)</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {faqs && faqs.length > 0 ? faqs.map((faq: any) => (
              <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 max-w-md truncate">{faq.question_fr}</td>
                <td className="px-6 py-4">{faq.display_order}</td>
                <td className="px-6 py-4">
                  <FaqActiveToggle id={faq.id} isActive={faq.is_active} />
                </td>
                <td className="px-6 py-4 text-right">
                  <RowActions
                    editHref={`/${lang}/${ADMIN_SECRET_PATH}/faqs/${faq.id}/edit`}
                    onDelete={deleteFaq.bind(null, faq.id)}
                    confirmMessage={`Delete this question?`}
                  />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No questions yet. Click "Add Question" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
