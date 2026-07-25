'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ExternalLink, Loader2, Save } from 'lucide-react';
import { saveInstagramToken, syncInstagramGallery } from '@/app/actions/admin';

export default function InstagramSyncPanel({ hasToken }: { hasToken: boolean }) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(!hasToken);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    if (!token.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await saveInstagramToken(token.trim());
      setMessage({ type: 'success', text: 'Instagram token saved.' });
      setToken('');
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save token' });
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const result = await syncInstagramGallery();
      setMessage({
        type: 'success',
        text: `Synced ${result.imported}/${result.total} photos from Instagram. New photos are saved as drafts - publish the ones you want to show.`,
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
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Instagram Gallery</h3>
          <p className="text-slate-500 text-sm mt-1">
            Pull real photos from your clinic's Instagram account into the website gallery.
          </p>
        </div>
        <button
          onClick={() => setShowInstructions((v) => !v)}
          className="text-xs font-semibold text-primary shrink-0 hover:underline"
        >
          {showInstructions ? 'Hide setup steps' : 'Show setup steps'}
        </button>
      </div>

      {showInstructions && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm text-slate-600 space-y-2">
          <p className="font-bold text-slate-700">One-time setup (~15 min, only needs to be done once):</p>
          <ol className="list-decimal list-inside space-y-1.5">
            <li>Make sure your Instagram account is a <strong>Professional account</strong> (Business or Creator) - free to switch in the Instagram app under Settings → Account type.</li>
            <li>
              Go to{' '}
              <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-1">
                Meta for Developers <ExternalLink size={12} />
              </a>{' '}
              and create a free app (choose type &quot;Consumer&quot; or &quot;Other&quot;).
            </li>
            <li>In the app, add the <strong>&quot;Instagram&quot;</strong> product and follow Meta&apos;s prompts to connect your own Instagram account to it.</li>
            <li>
              Use the{' '}
              <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-1">
                Graph API Explorer <ExternalLink size={12} />
              </a>{' '}
              to generate a <strong>long-lived access token</strong> for your Instagram account (Meta&apos;s explorer has a button for this - tokens last ~60 days and can be refreshed the same way).
            </li>
            <li>Paste that token below and click &quot;Save Token&quot;, then &quot;Sync Now&quot;.</li>
          </ol>
          <p className="text-xs text-slate-400 pt-1">
            Note: Instagram doesn&apos;t offer a one-click "Connect" button for apps like this one without Meta's
            business app-review process - this manual token setup is the standard, fully legitimate way for a
            business to pull its own photos, and only takes a few minutes.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={hasToken ? 'Token saved ✓ - paste a new one to replace it' : 'Paste your long-lived Instagram access token'}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm"
        />
        <button
          onClick={handleSave}
          disabled={saving || !token.trim()}
          className="px-4 py-2 rounded-lg font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Token'}
        </button>
        <button
          onClick={handleSync}
          disabled={syncing || !hasToken}
          className="px-4 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          title={!hasToken ? 'Save a token first' : ''}
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
