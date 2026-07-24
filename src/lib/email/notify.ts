import { Resend } from 'resend';

/**
 * Sends a notification email to the clinic. Requires RESEND_API_KEY and
 * RESEND_FROM_EMAIL to be set (see .env.example). If they're not set, this
 * silently no-ops (with a console warning) instead of throwing - a missing
 * email API key should never break an appointment booking or newsletter
 * signup for the visitor.
 */
export async function sendNotificationEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn('[email] RESEND_API_KEY or RESEND_FROM_EMAIL not set - skipping notification email.');
    return { skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from: fromEmail, to, subject, html });
    return { skipped: false, sent: true };
  } catch (err) {
    // Never let an email failure break the actual form submission.
    console.error('[email] Failed to send notification email:', err);
    return { skipped: false, sent: false };
  }
}
