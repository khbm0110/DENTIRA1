'use client';

import { useState } from 'react';
import { Save, Loader2, RotateCcw } from 'lucide-react';
import { saveHeroContent } from '@/app/actions/admin';
import dictionary from '@/lib/i18n/dictionary';

export default function HeroContentForm({
  initial,
}: {
  initial: { title_fr: string | null; title_ar: string | null; subtitle_fr: string | null; subtitle_ar: string | null };
}) {
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');
  const [titleFr, setTitleFr] = useState(initial.title_fr || dictionary.fr.hero.title);
  const [titleAr, setTitleAr] = useState(initial.title_ar || dictionary.ar.hero.title);
  const [subtitleFr, setSubtitleFr] = useState(initial.subtitle_fr || dictionary.fr.hero.subtitle);
  const [subtitleAr, setSubtitleAr] = useState(initial.subtitle_ar || dictionary.ar.hero.subtitle);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await saveHeroContent({ title_fr: titleFr, title_ar: titleAr, subtitle_fr: subtitleFr, subtitle_ar: subtitleAr });
      setMessage('Saved. Changes are now live on the homepage.');
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Reset to the default homepage text? This will overwrite your customizations.')) return;
    setTitleFr(dictionary.fr.hero.title);
    setTitleAr(dictionary.ar.hero.title);
    setSubtitleFr(dictionary.fr.hero.subtitle);
    setSubtitleAr(dictionary.ar.hero.subtitle);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button type="button" onClick={() => setActiveTab('fr')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'fr' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>🇫🇷 French</button>
        <button type="button" onClick={() => setActiveTab('ar')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ar' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>🇲🇦 Arabic</button>
      </div>

      <div className="p-6 space-y-4">
        {message && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-100">{message}</div>}

        {activeTab === 'fr' ? (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Titre principal (FR)</label>
              <input
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">Le premier mot s'affiche en noir, le reste en couleur primaire.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sous-titre (FR)</label>
              <textarea
                value={subtitleFr}
                onChange={(e) => setSubtitleFr(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </>
        ) : (
          <div dir="rtl">
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">العنوان الرئيسي (AR)</label>
              <input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">العنوان الفرعي (AR)</label>
              <textarea
                value={subtitleAr}
                onChange={(e) => setSubtitleAr(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button
          onClick={handleReset}
          className="px-6 py-2.5 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
