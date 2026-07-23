import { createClient } from './server';

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address_fr: string;
  address_ar: string;
}

export interface DayHours {
  open: string;
  close: string;
  enabled: boolean;
}

export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PublicClinicSettings {
  contact: ContactInfo;
  hours: WorkingHours;
  social: SocialLink[];
}

const DEFAULT_HOURS: WorkingHours = {
  monday: { open: '09:00', close: '18:00', enabled: true },
  tuesday: { open: '09:00', close: '18:00', enabled: true },
  wednesday: { open: '09:00', close: '18:00', enabled: true },
  thursday: { open: '09:00', close: '18:00', enabled: true },
  friday: { open: '09:00', close: '14:00', enabled: true },
  saturday: { open: '10:00', close: '14:00', enabled: true },
  sunday: { open: '00:00', close: '00:00', enabled: false },
};

const DEFAULT_CONTACT: ContactInfo = {
  phone: '+212612345678',
  whatsapp: '+212612345678',
  email: 'contact@dentora.ma',
  address_fr: 'Casablanca, Maroc',
  address_ar: 'الدار البيضاء، المغرب',
};

/**
 * Single batched fetch for everything the public site's shared chrome
 * (navbar, footer, working-hours bar) needs, so switching pages/languages
 * doesn't trigger three more separate round-trips on top of the section
 * queries already on the homepage.
 */
export async function getPublicClinicSettings(): Promise<PublicClinicSettings> {
  const supabase = createClient();

  try {
    const [{ data: settingsRows }, { data: socialRows }] = await Promise.all([
      supabase.from('clinic_settings').select('key, value').in('key', ['contact_info', 'working_hours']),
      supabase.from('social_media').select('platform, url').eq('is_active', true).order('display_order'),
    ]);

    const contactRow = settingsRows?.find((r: any) => r.key === 'contact_info')?.value as Partial<ContactInfo> | undefined;
    const hoursRow = settingsRows?.find((r: any) => r.key === 'working_hours')?.value as Partial<WorkingHours> | undefined;

    return {
      contact: { ...DEFAULT_CONTACT, ...contactRow },
      hours: { ...DEFAULT_HOURS, ...hoursRow },
      social: socialRows || [],
    };
  } catch {
    // Supabase not configured yet, or table doesn't exist - fall back to
    // sane defaults so the site still renders correctly.
    return { contact: DEFAULT_CONTACT, hours: DEFAULT_HOURS, social: [] };
  }
}
