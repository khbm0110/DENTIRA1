import { Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import { deleteOffer } from '@/app/actions/admin';
import RowActions from '@/components/admin/RowActions';

export default async function OffersAdminPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = createClient();

  const { data: offers = [], error } = await supabase
    .from('offers')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) console.error('Error fetching offers:', error);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">العروض - Offers</h2>
          <p className="text-slate-500 text-sm mt-1">Manage time-limited promotions shown on the website.</p>
        </div>
        <Link
          href={`/${lang}/${ADMIN_SECRET_PATH}/offers/new`}
          className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add Offer
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Title (FR)</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Valid Until</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {offers && offers.length > 0 ? offers.map((offer: any) => (
              <tr key={offer.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{offer.title_fr}</td>
                <td className="px-6 py-4">{offer.discount_percentage ? `${offer.discount_percentage}%` : '—'}</td>
                <td className="px-6 py-4">{offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'No expiry'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <RowActions
                    editHref={`/${lang}/${ADMIN_SECRET_PATH}/offers/${offer.id}/edit`}
                    onDelete={deleteOffer.bind(null, offer.id)}
                    confirmMessage={`Delete offer "${offer.title_fr}"?`}
                  />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No offers yet. Click "Add Offer" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
