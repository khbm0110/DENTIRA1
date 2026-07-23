// DENTORA-OS - SUPABASE CLIENT (BROWSER)
// Uses @supabase/ssr so the auth session lives in cookies, not just localStorage.
// This is required so that Server Actions (src/app/actions/admin.ts) and the
// middleware can see the logged-in session - previously this used plain
// @supabase/supabase-js (localStorage-only session), which meant every
// Server Action ran as an anonymous user and silently failed RLS checks,
// which is why nothing in the admin dashboard could ever be saved.

import { createBrowserClient } from '@supabase/ssr';

// Environment variables for Supabase connection
// These should be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

// Create Supabase client with anonymous key for client-side operations
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript support
export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at?: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at?: string;
}

// Function to fetch appointments
export async function getAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching appointments:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

// Function to create a new appointment
export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

// Function to update appointment status
export async function updateAppointmentStatus(
  id: string,
  status: Appointment['status']
) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating appointment:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

// Function to get appointment statistics
export async function getAppointmentStats() {
  const { data, error } = await supabase
    .from('appointments')
    .select('status');

  if (error) {
    console.error('Error fetching appointment stats:', error);
    return { data: null, error };
  }

  const total = data?.length || 0;
  const pending = data?.filter((a) => a.status === 'pending').length || 0;
  const completed = data?.filter((a) => a.status === 'completed').length || 0;
  const confirmed = data?.filter((a) => a.status === 'confirmed').length || 0;

  return {
    data: { total, pending, completed, confirmed },
    error: null,
  };
}
