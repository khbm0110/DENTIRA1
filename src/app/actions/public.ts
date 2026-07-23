'use server';

import { createClient } from '@/lib/supabase/server';

export interface AppointmentSubmission {
  name: string;
  phone: string;
  email?: string;
  service: string;
  preferredDate?: string; // ISO datetime string
  notes?: string;
}

export async function submitAppointment(data: AppointmentSubmission) {
  if (!data.name?.trim() || !data.phone?.trim() || !data.service?.trim()) {
    throw new Error('Name, phone, and service are required.');
  }

  const supabase = createClient();
  const { error } = await supabase.from('appointments').insert({
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || null,
    service: data.service,
    preferred_date: data.preferredDate || null,
    notes: data.notes?.trim() || null,
    status: 'pending',
  });

  if (error) throw new Error(error.message);
  return { success: true };
}
export async function subscribeToNewsletter(email: string) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
    throw new Error('Please enter a valid email address.');
  }

  const supabase = createClient();
  const { error } = await supabase.from('newsletter_subscribers').insert({ email: trimmed });

  if (error) {
    // Unique constraint violation just means they're already subscribed -
    // treat that as a success from the visitor's point of view.
    if (error.code === '23505') {
      return { success: true, alreadySubscribed: true };
    }
    throw new Error(error.message);
  }

  return { success: true, alreadySubscribed: false };
}
