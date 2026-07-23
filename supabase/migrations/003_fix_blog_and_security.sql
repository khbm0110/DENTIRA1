-- DENTORA-OS - MIGRATION 003
-- Run this AFTER 001_security_rls.sql and 002_dashboard_schema.sql
--
-- Fixes two concrete, verified bugs plus one security gap:
--
-- BUG 1 (blog_posts schema mismatch - this is why blog posts could never be
-- saved or displayed): the table was created with columns `status` and
-- `featured_image_url`, but every piece of app code (the "New Post" admin
-- form, the addBlogPost server action, and the public /blog page) reads and
-- writes `is_published` and `image_url`. Every insert therefore failed with
-- "column does not exist", and the public blog page's query against
-- `is_published` silently errored and fell back to fake placeholder articles.
--
-- SECURITY GAP: migration 002 gave "any authenticated user" (i.e. anyone who
-- signs up through the public Supabase auth API) full read/write access to
-- every table, including patient appointments and site content. This
-- migration adds a profiles/role system so only accounts explicitly marked
-- role = 'admin' can access the dashboard data.
--
-- NEW: adds the "offers" (العروض) table - time-limited promotions - alongside
-- the existing pricing_plans table (الباقات).

-- ============================================================
-- STEP 1: FIX blog_posts SCHEMA
-- ============================================================
ALTER TABLE public.blog_posts RENAME COLUMN featured_image_url TO image_url;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false;
UPDATE public.blog_posts SET is_published = (status = 'published') WHERE status IS NOT NULL;
ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS status;

DROP POLICY IF EXISTS "Public read blog_posts" ON public.blog_posts;
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Same bug, same fix, for doctors: the admin "Add Doctor" form and the public
-- DoctorsTeamSection component both read/write `image_url`, but the table was
-- created with `photo_url`, so every doctor creation failed silently.
ALTER TABLE public.doctors RENAME COLUMN photo_url TO image_url;

-- ============================================================
-- STEP 2: PROFILES TABLE + ROLE SYSTEM
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for any users that already existed before this migration.
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'user' FROM auth.users
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- IMPORTANT - creating your first admin account:
--   1. Sign up once from the (hidden) admin login page with your real email.
--   2. In the Supabase SQL editor run:
--        UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
--   3. Log out and back in. You now have dashboard access.

-- ============================================================
-- STEP 3: REPLACE "any authenticated user" POLICIES WITH is_admin()
-- ============================================================
DROP POLICY IF EXISTS "Admin full access content_sections" ON public.content_sections;
DROP POLICY IF EXISTS "Admin full access services" ON public.services;
DROP POLICY IF EXISTS "Admin full access doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admin full access testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin full access faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin full access blog_categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admin full access blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin full access blog_post_categories" ON public.blog_post_categories;
DROP POLICY IF EXISTS "Admin full access pricing_plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admin full access social_media" ON public.social_media;

CREATE POLICY "admin_full_access_content_sections" ON public.content_sections TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_services" ON public.services TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_doctors" ON public.doctors TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_testimonials" ON public.testimonials TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_faqs" ON public.faqs TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_blog_categories" ON public.blog_categories TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_blog_posts" ON public.blog_posts TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_blog_post_categories" ON public.blog_post_categories TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_pricing_plans" ON public.pricing_plans TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_full_access_social_media" ON public.social_media TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Same tightening for the media storage bucket from migration 002.
DROP POLICY IF EXISTS "Admin insert media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;
CREATE POLICY "admin_insert_media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin_update_media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin_delete_media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

-- And the appointments / clinic_settings policies from migration 001, which
-- had the exact same "any authenticated user" problem.
DROP POLICY IF EXISTS "Allow_authenticated_select_appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow_authenticated_update_appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow_authenticated_delete_appointments" ON public.appointments;
CREATE POLICY "admin_select_appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_update_appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.is_admin())
  WITH CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));
CREATE POLICY "admin_delete_appointments" ON public.appointments FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Allow_authenticated_read_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "Allow_authenticated_update_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "Allow_authenticated_insert_settings" ON public.clinic_settings;
CREATE POLICY "admin_read_settings" ON public.clinic_settings FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_write_settings" ON public.clinic_settings FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_insert_settings" ON public.clinic_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- ============================================================
-- STEP 4: OFFERS TABLE (العروض - time-limited promotions)
-- Complements pricing_plans (الباقات) which already existed.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  discount_percentage INT CHECK (discount_percentage BETWEEN 0 AND 100),
  original_price NUMERIC(10,2),
  discounted_price NUMERIC(10,2),
  image_url TEXT,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_offers" ON public.offers
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));
CREATE POLICY "admin_full_access_offers" ON public.offers
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_offers_active_order ON public.offers(is_active, display_order);

-- ============================================================
-- STEP 5: SERVICE SLUGS (for dedicated /services/[slug] landing pages)
-- ============================================================
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE public.services SET slug = lower(regexp_replace(regexp_replace(name_fr, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL;

ALTER TABLE public.services ADD CONSTRAINT services_slug_unique UNIQUE (slug);

COMMENT ON TABLE public.offers IS 'العروض - time-limited promotions, managed from the admin dashboard';
COMMENT ON TABLE public.pricing_plans IS 'الباقات - dental care packages, managed from the admin dashboard';
COMMENT ON TABLE public.profiles IS 'User roles - only role=admin gets dashboard access, set manually in Supabase SQL editor';
