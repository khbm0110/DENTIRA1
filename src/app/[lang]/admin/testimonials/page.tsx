import { createClient } from '@/lib/supabase/server';
import GoogleReviewsSyncPanel from '@/components/admin/GoogleReviewsSyncPanel';
import TestimonialRowControls from '@/components/admin/TestimonialRowControls';

export default async function TestimonialsAdminPage() {
  const supabase = createClient();

  const [{ data: testimonials = [] }, { data: settingRow }] = await Promise.all([
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
    supabase.from('clinic_settings').select('value').eq('key', 'google_reviews').single(),
  ]);

  const placeId = (settingRow?.value as any)?.place_id || null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Testimonials</h2>
        <p className="text-slate-500 text-sm mt-1">Manage patient reviews shown on the website.</p>
      </div>

      <GoogleReviewsSyncPanel initialPlaceId={placeId} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Review</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {testimonials && testimonials.length > 0 ? testimonials.map((rev: any) => (
              <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{rev.name_fr}</td>
                <td className="px-6 py-4 max-w-md">
                  <p className="truncate text-slate-500">{rev.review_fr}</p>
                </td>
                <td className="px-6 py-4">{rev.rating} / 5</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    rev.source === 'google' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {rev.source === 'google' ? 'Google Maps' : 'Manual'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <TestimonialRowControls id={rev.id} isPublished={rev.is_published} />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No reviews yet. Sync from Google above, or add one manually in Supabase.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
