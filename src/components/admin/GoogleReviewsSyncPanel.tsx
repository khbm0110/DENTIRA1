'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ExternalLink, Loader2, Save } from 'lucide-react';
import { saveGooglePlaceId, syncGoogleReviews } from '@/app/actions/admin';

export default function GoogleReviewsSyncPanel({ initialPlaceId }: { initialPlaceId: string | null }) {
  const router = useRouter();
  const [placeId, setPlaceId] = useState(initialPlaceId || '');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    if (!placeId.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await saveGooglePlaceId(placeId.trim());
      setMessage({ type: 'success', text: 'Place ID saved.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save Place ID' });
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const result = await syncGoogleReviews();
      setMessage({
        type: 'success',
        text: `Synced ${result.imported}/${result.total} reviews from Google` +
          (result.placeName ? ` for "${result.placeName}"` : '') +
          '. New reviews are saved as drafts - publish the ones you want to show.',
      });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Google Reviews</h3>
          <p className="text-slate-500 text-sm mt-1">
            Pull real reviews from your Google Business Profile. Google only returns up to 5 reviews per sync
            (a Google API limit, not something we can change) - each sync fetches the latest 5 and skips ones
            already imported.
          </p>
        </div>
        <a
          href="https://developers.google.com/maps/documentation/places/web-service/place-id"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-primary flex items-center gap-1 shrink-0 hover:underline"
        >
          Find your Place ID <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={placeId}
          onChange={(e) => setPlaceId(e.target.value)}
          placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm"
        />
        <button
          onClick={handleSave}
          disabled={saving || !placeId.trim()}
          className="px-4 py-2 rounded-lg font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Place ID'}
        </button>
        <button
          onClick={handleSync}
          disabled={syncing || !placeId.trim()}
          className="px-4 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {syncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {message && (
        <p className={`text-sm mt-3 ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
