-- DENTORA-OS - MIGRATION 005
-- Adds a real newsletter subscription table (the footer form was previously
-- decorative - it didn't save anything anywhere), and seeds the clinic
-- settings the public site now reads for its previously-hardcoded phone
-- number, address, and working hours.

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (that's the point of a public newsletter form), but
-- nobody except an admin can read/list/export the collected emails.
CREATE POLICY "public_subscribe_newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_read_newsletter" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "admin_delete_newsletter" ON public.newsletter_subscribers
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- SEED clinic_settings WITH REAL, EDITABLE VALUES
-- (Replace the placeholder values below with your real clinic details in
-- the Settings admin page - these are just starting defaults so the
-- website doesn't crash if the row is missing.)
-- ============================================================
INSERT INTO public.clinic_settings (key, value)
VALUES (
  'contact_info',
  '{
    "phone": "+212612345678",
    "whatsapp": "+212612345678",
    "email": "contact@dentora.ma",
    "address_fr": "Casablanca, Maroc",
    "address_ar": "الدار البيضاء، المغرب"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.clinic_settings (key, value)
VALUES (
  'working_hours',
  '{
    "monday": {"open": "09:00", "close": "18:00", "enabled": true},
    "tuesday": {"open": "09:00", "close": "18:00", "enabled": true},
    "wednesday": {"open": "09:00", "close": "18:00", "enabled": true},
    "thursday": {"open": "09:00", "close": "18:00", "enabled": true},
    "friday": {"open": "09:00", "close": "14:00", "enabled": true},
    "saturday": {"open": "10:00", "close": "14:00", "enabled": true},
    "sunday": {"open": "00:00", "close": "00:00", "enabled": false}
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Seed a couple of social placeholders so the admin has rows to edit
-- instead of an empty table (URLs are placeholders - update them in Settings).
INSERT INTO public.social_media (platform, url, is_active, display_order) VALUES
  ('facebook', 'https://facebook.com/dentora', true, 1),
  ('instagram', 'https://instagram.com/dentora', true, 2)
ON CONFLICT (platform) DO NOTHING;
