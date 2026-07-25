import { createClient } from '@/lib/supabase/server';
import InstagramSyncPanel from '@/components/admin/InstagramSyncPanel';
import GalleryImageCard from '@/components/admin/GalleryImageCard';

export default async function GalleryAdminPage() {
  const supabase = createClient();

  const [{ data: images = [] }, { data: settingRow }] = await Promise.all([
    supabase.from('gallery_images').select('*').order('synced_at', { ascending: false }),
    supabase.from('clinic_settings').select('value').eq('key', 'instagram').single(),
  ]);

  const hasToken = Boolean((settingRow?.value as any)?.access_token);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Gallery</h2>
        <p className="text-slate-500 text-sm mt-1">Manage the photo gallery shown on the website, synced from Instagram.</p>
      </div>

      <InstagramSyncPanel hasToken={hasToken} />

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((img: any) => (
            <GalleryImageCard key={img.id} id={img.id} mediaUrl={img.media_url} caption={img.caption} isPublished={img.is_published} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-400">
          No photos yet. Connect Instagram above and click "Sync Now".
        </div>
      )}
    </div>
  );
}
