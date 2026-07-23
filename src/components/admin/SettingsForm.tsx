'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { saveContactInfo, saveWorkingHours, saveSocialLink, deleteSocialLink } from '@/app/actions/admin';
import type { ContactInfo, WorkingHours, SocialLink } from '@/lib/supabase/public-settings';

const DAYS: (keyof WorkingHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
  friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

export default function SettingsForm({
  initialContact,
  initialHours,
  initialSocial,
}: {
  initialContact: ContactInfo;
  initialHours: WorkingHours;
  initialSocial: SocialLink[];
}) {
  const router = useRouter();
  const [contact, setContact] = useState(initialContact);
  const [hours, setHours] = useState(initialHours);
  const [social, setSocial] = useState(initialSocial);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
  const [savingContact, setSavingContact] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveContact = async () => {
    setSavingContact(true);
    try {
      await saveContactInfo(contact);
      flash('Contact info saved.');
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to save');
    } finally {
      setSavingContact(false);
    }
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      await saveWorkingHours(hours);
      flash('Working hours saved.');
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to save');
    } finally {
      setSavingHours(false);
    }
  };

  const handleAddSocial = async () => {
    if (!newSocial.platform.trim() || !newSocial.url.trim()) return;
    try {
      await saveSocialLink(newSocial.platform.trim().toLowerCase(), newSocial.url.trim(), true);
      setSocial((prev) => [...prev, { platform: newSocial.platform.trim().toLowerCase(), url: newSocial.url.trim() }]);
      setNewSocial({ platform: '', url: '' });
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to add link');
    }
  };

  const handleDeleteSocial = async (platform: string) => {
    if (!confirm(`Remove ${platform} link?`)) return;
    try {
      await deleteSocialLink(platform);
      setSocial((prev) => prev.filter((s) => s.platform !== platform));
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to remove link');
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl border border-green-100">{message}</div>
      )}

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="+212612345678"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp Number</label>
            <input
              value={contact.whatsapp}
              onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
              placeholder="+212612345678"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div />
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Address (French)</label>
            <input
              value={contact.address_fr}
              onChange={(e) => setContact({ ...contact, address_fr: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div dir="rtl">
            <label className="block text-sm font-bold text-slate-700 mb-1">العنوان (بالعربية)</label>
            <input
              value={contact.address_ar}
              onChange={(e) => setContact({ ...contact, address_ar: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleSaveContact}
          disabled={savingContact}
          className="mt-4 px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {savingContact ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {savingContact ? 'Saving...' : 'Save Contact Info'}
        </button>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Working Hours</h3>
        <div className="space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-28 text-sm font-semibold text-slate-600">{DAY_LABELS[day]}</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hours[day].enabled}
                  onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], enabled: e.target.checked } })}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-xs text-slate-500">Open</span>
              </label>
              <input
                type="time"
                value={hours[day].open}
                disabled={!hours[day].enabled}
                onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], open: e.target.value } })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40"
              />
              <span className="text-slate-400">-</span>
              <input
                type="time"
                value={hours[day].close}
                disabled={!hours[day].enabled}
                onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], close: e.target.value } })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveHours}
          disabled={savingHours}
          className="mt-4 px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {savingHours ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {savingHours ? 'Saving...' : 'Save Working Hours'}
        </button>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Social Media Links</h3>
        <div className="space-y-2 mb-4">
          {social.map((s) => (
            <div key={s.platform} className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2.5">
              <span className="text-xs font-bold uppercase text-slate-500 w-20">{s.platform}</span>
              <span className="flex-1 text-sm text-slate-700 truncate">{s.url}</span>
              <button onClick={() => handleDeleteSocial(s.platform)} className="text-slate-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            placeholder="platform (e.g. facebook)"
            value={newSocial.platform}
            onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
            className="w-40 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
          <input
            placeholder="https://..."
            value={newSocial.url}
            onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
          <button
            onClick={handleAddSocial}
            className="px-4 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
