'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { setTestimonialPublished, deleteTestimonial } from '@/app/actions/admin';

export default function TestimonialRowControls({ id, isPublished }: { id: string; isPublished: boolean }) {
  const router = useRouter();
  const [published, setPublished] = useState(isPublished);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      await setTestimonialPublished(id, !published);
      setPublished(!published);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this review permanently?')) return;
    setBusy(true);
    try {
      await deleteTestimonial(id);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={toggle}
        disabled={busy}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
          published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {published ? 'Published' : 'Draft'}
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
        title="Delete"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
