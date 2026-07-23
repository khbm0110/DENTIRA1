import { getPublicClinicSettings } from '@/lib/supabase/public-settings';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function SettingsAdminPage() {
  const settings = await getPublicClinicSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">
          This is the real contact info, working hours, and social links shown across the website.
        </p>
      </div>

      <SettingsForm
        initialContact={settings.contact}
        initialHours={settings.hours}
        initialSocial={settings.social}
      />
    </div>
  );
}
