'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Check } from 'lucide-react';
import { setGalleryImagePublished, deleteGalleryImage } from '@/app/actions/admin';

export default function GalleryImageCard({ id, mediaUrl, caption, isPublished }: { id: string; mediaUrl: string; caption: string | null; isPublished: boolean }) {
  const router = useRouter();
  const [published, setPublished] = useState(isPublished);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      await setGalleryImagePublished(id, !published);
      setPublished(!published);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('Remove this photo from the gallery?')) return;
    setBusy(true);
    try {
      await deleteGalleryImage(id);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mediaUrl} alt={caption || ''} className="w-full h-40 object-cover" />
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${published ? 'bg-green-500 text-white' : 'bg-slate-500/80 text-white'}`}>
          {published ? 'Published' : 'Draft'}
        </span>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={toggle}
          disabled={busy}
          className="p-2 bg-white rounded-full text-slate-700 hover:text-primary disabled:opacity-50"
          title={published ? 'Unpublish' : 'Publish'}
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        </button>
        <button
          onClick={remove}
          disabled={busy}
          className="p-2 bg-white rounded-full text-slate-700 hover:text-red-600 disabled:opacity-50"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
