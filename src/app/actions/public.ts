'use server';

import { createClient } from '@/lib/supabase/server';
import { sendNotificationEmail } from '@/lib/email/notify';
import { looksLikeSpam } from '@/lib/utils/spam-detection';

// ---------------------------------------------------------------------------
// SPAM PROTECTION
// No external API/keys needed. Two lightweight, well-established checks:
//  1. Honeypot: a hidden form field real visitors never see or fill in.
//     If it has a value, the submitter is almost certainly a bot script
//     that fills every field it finds.
//  2. Minimum time-on-page: a bot that submits within ~1.5s of the page
//     loading almost certainly didn't "fill out" the form like a human.
// Both checks fail silently (pretend success) rather than showing the bot
// an error, which would just teach it to adjust and retry.
// See src/lib/utils/spam-detection.ts for the actual (unit-tested) logic.
// ---------------------------------------------------------------------------

export interface AppointmentSubmission {
  name: string;
  phone: string;
  email?: string;
  service: string;
  preferredDate?: string; // ISO datetime string
  notes?: string;
  honeypot?: string;
  formRenderedAt?: number;
}

export async function submitAppointment(data: AppointmentSubmission) {
  if (!data.name?.trim() || !data.phone?.trim() || !data.service?.trim()) {
    throw new Error('Name, phone, and service are required.');
  }

  if (looksLikeSpam(data.honeypot, data.formRenderedAt)) {
    // Pretend it worked - don't tip off the bot.
    return { success: true };
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

  // Notify the clinic by email - never lets a failure here break the booking.
  try {
    const { data: settingRow } = await supabase
      .from('clinic_settings')
      .select('value')
      .eq('key', 'contact_info')
      .single();
    const notifyEmail = (settingRow?.value as any)?.email;
    if (notifyEmail) {
      await sendNotificationEmail({
        to: notifyEmail,
        subject: `Nouvelle demande de rendez-vous - ${data.name}`,
        html: `
          <h2>Nouvelle demande de rendez-vous</h2>
          <p><strong>Nom:</strong> ${data.name}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>
          ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
          <p><strong>Service:</strong> ${data.service}</p>
          ${data.preferredDate ? `<p><strong>Date souhaitée:</strong> ${data.preferredDate}</p>` : ''}
          <p style="color:#888;font-size:12px;margin-top:24px;">Gérez cette demande depuis votre tableau de bord Dentora.</p>
        `,
      });
    }
  } catch (err) {
    console.error('[appointment] notification email failed:', err);
  }

  return { success: true };
}

export async function subscribeToNewsletter(email: string, honeypot?: string, formRenderedAt?: number) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
    throw new Error('Please enter a valid email address.');
  }

  if (looksLikeSpam(honeypot, formRenderedAt)) {
    return { success: true, alreadySubscribed: false };
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
