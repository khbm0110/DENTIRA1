// DENTORA-OS - CLINIC SETTINGS LIBRARY
// Fetch dynamic clinic configuration from Supabase

import { supabase } from './client';

export interface WorkingHours {
  [key: string]: {
    open: string;
    close: string;
    enabled: boolean;
  };
}

export interface ServicePrice {
  min: number;
  max: number;
  currency: string;
  description: string;
}

export interface ServicePrices {
  [key: string]: ServicePrice;
}

export interface ClinicCoordinates {
  lat: number;
  lng: number;
}

export interface ClinicInfo {
  name: string;
  slogan: string;
  address: string;
  coordinates: ClinicCoordinates;
  google_place_id: string;
}

export interface EmergencyContact {
  enabled: boolean;
  phone: string;
  whatsapp: string;
  message: string;
}

export interface ClinicSettings {
  working_hours: WorkingHours;
  emergency_contact: EmergencyContact;
  service_prices: ServicePrices;
  clinic_info: ClinicInfo;
}

// Fetch all clinic settings (cached for performance)
let cachedSettings: ClinicSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getClinicSettings(): Promise<ClinicSettings | null> {
  // Check cache first
  if (cachedSettings && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('key, value')
      .in('key', ['working_hours', 'emergency_contact', 'service_prices', 'clinic_info']);

    if (error) {
      console.error('Error fetching clinic settings:', error);
      return null;
    }

    // Transform data into settings object
    const settings: ClinicSettings = {
      working_hours: {},
      emergency_contact: { enabled: false, phone: '', whatsapp: '', message: '' },
      service_prices: {},
      clinic_info: {
        name: 'Dentora',
        slogan: 'Excellence en Medecine Dentaire',
        address: 'Casablanca, Morocco',
        coordinates: { lat: 33.5731, lng: -7.5898 },
        google_place_id: '',
      },
    };

    if (data) {
      data.forEach((item) => {
        if (item.key === 'working_hours') {
          settings.working_hours = item.value as WorkingHours;
        } else if (item.key === 'emergency_contact') {
          settings.emergency_contact = item.value as EmergencyContact;
        } else if (item.key === 'service_prices') {
          settings.service_prices = item.value as ServicePrices;
        } else if (item.key === 'clinic_info') {
          settings.clinic_info = item.value as ClinicInfo;
        }
      });
    }

    // Update cache
    cachedSettings = settings;
    cacheTimestamp = Date.now();

    return settings;
  } catch (err) {
    console.error('Error fetching clinic settings:', err);
    return null;
  }
}

// Fetch single setting by key
export async function getSetting(key: string): Promise<unknown | null> {
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return null;
    }

    return data?.value || null;
  } catch (err) {
    console.error(`Error fetching setting ${key}:`, err);
    return null;
  }
}

// Update setting (Admin only)
export async function updateSetting(
  key: string, 
  value: unknown, 
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clinic_settings')
      .update({ 
        value, 
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq('key', key);

    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      return false;
    }

    // Invalidate cache
    cachedSettings = null;
    cacheTimestamp = 0;

    return true;
  } catch (err) {
    console.error(`Error updating setting ${key}:`, err);
    return false;
  }
}

// Check if clinic is currently open
export async function isClinicOpen(): Promise<boolean> {
  const settings = await getClinicSettings();
  
  if (!settings) return false;
  
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const dayHours = settings.working_hours[currentDay];
  
  if (!dayHours?.enabled) return false;
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = dayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = dayHours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;
  
  return currentTime >= openTime && currentTime < closeTime;
}

// Get next available appointment slot
export async function getNextAvailableSlot(): Promise<{ date: Date; time: string } | null> {
  const settings = await getClinicSettings();
  
  if (!settings) return null;
  
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + i);
    const dayName = dayNames[checkDate.getDay()];
    const dayHours = settings.working_hours[dayName];
    
    if (dayHours?.enabled) {
      return {
        date: checkDate,
        time: dayHours.open,
      };
    }
  }
  
  return null;
}
