-- ============================================================================
-- DENTORA-OS - COMPLETE DATABASE SCHEMA (CONSOLIDATED)
-- ============================================================================
-- This single file replaces the previous 001-007 migration chain, which had
-- accumulated real structural problems:
--   - Non-idempotent statements (bare RENAME COLUMN, bare ADD CONSTRAINT)
--     that fail if run twice or on a partially-migrated database.
--   - Missing explicit GRANTs - RLS policies existed, but the underlying
--     table-level SQL privilege was never granted to anon/authenticated,
--     which silently blocks access even when a policy would otherwise allow
--     it. (This is why granting SELECT/INSERT/UPDATE/DELETE on `profiles`
--     fixed the admin login issue - the same class of gap existed, to
--     varying degrees, across other tables too, and is fixed here for all
--     of them explicitly rather than relying on Supabase's default
--     privilege behavior.)
--   - Migrations that assumed earlier ones had already run successfully.
--   - Two unused tables (blog_categories, blog_post_categories) and several
--     unused columns left over from earlier iterations of the app that no
--     longer read/write them.
--
-- SAFE TO RUN ON: an empty database, a database that already ran some/all
-- of the old 001-007 migrations, or a database that already ran this exact
-- file before. Every statement below is written to be idempotent - safe to
-- execute any number of times, in any of those starting states, without
-- error and without changing behavior on repeat runs.
--
-- After running this in the Supabase SQL editor, also run (once, from the
-- Dashboard): Settings > API > "Reload schema cache" (or simply wait ~60s -
-- PostgREST auto-detects schema changes) so the app immediately sees any
-- new tables/columns instead of a stale cached schema.
-- ============================================================================


-- ============================================================================
-- SECTION 0: EXTENSIONS & SCHEMA-LEVEL GRANTS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- provides gen_random_uuid()

-- Baseline schema access. Without this nothing below matters - included as a
-- defensive safety net even though Supabase normally sets this up already.
GRANT USAGE ON SCHEMA public TO anon, authenticated;


-- ============================================================================
-- SECTION 1: TABLES (final shape - fresh databases get exactly this)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES (user roles - drives all admin-access checks)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- CLINIC SETTINGS (generic key/value store: contact info, hours, integrations)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- ---------------------------------------------------------------------------
-- APPOINTMENTS (public booking form submissions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  preferred_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- CONTENT SECTIONS (admin-editable homepage text overrides, e.g. Hero)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title_fr TEXT,
  title_ar TEXT,
  description_fr TEXT,
  description_ar TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- SERVICES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  image_url TEXT,
  icon_name TEXT,
  slug TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- DOCTORS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  specialty_fr TEXT,
  specialty_ar TEXT,
  bio_fr TEXT,
  bio_ar TEXT,
  image_url TEXT,
  experience_years INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- TESTIMONIALS (manual entries + synced Google Maps reviews)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  review_fr TEXT NOT NULL,
  review_ar TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  is_published BOOLEAN DEFAULT false,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'google')),
  google_review_id TEXT,
  relative_time_description TEXT,
  author_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- FAQS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_fr TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  answer_fr TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- BLOG POSTS
-- (blog_categories / blog_post_categories from earlier iterations are
-- intentionally NOT recreated here - the app has no category feature and
-- never queries them; see the cleanup section further down which drops them
-- if they exist from an older migration run.)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  content_fr TEXT,
  content_ar TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'Dentora',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- PRICING PLANS (الباقات)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'MAD',
  image_url TEXT,
  features_fr JSONB DEFAULT '[]'::jsonb,
  features_ar JSONB DEFAULT '[]'::jsonb,
  button_text_fr TEXT,
  button_text_ar TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- OFFERS (العروض)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- SOCIAL MEDIA LINKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- NEWSLETTER SUBSCRIBERS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- GALLERY IMAGES (Instagram-synced or manually added photos)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  instagram_media_id TEXT,
  media_url TEXT NOT NULL,
  permalink TEXT,
  caption TEXT,
  media_type TEXT,
  source TEXT NOT NULL DEFAULT 'instagram' CHECK (source IN ('instagram', 'manual')),
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================================
-- SECTION 2: BACKFILL COLUMNS FOR DATABASES PARTIALLY MIGRATED FROM THE OLD
-- 001-007 CHAIN (harmless no-ops on a database created fresh from Section 1)
-- ============================================================================
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS google_review_id TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS relative_time_description TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS author_url TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Legacy column renames - only fire when the OLD name exists and the NEW
-- name does not, so this is a no-op both on a fresh database (created with
-- the final names already) and on a database where the rename already
-- happened (previously via migration 003, or by a prior run of this file).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'doctors' AND column_name = 'photo_url')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'doctors' AND column_name = 'image_url') THEN
    ALTER TABLE public.doctors RENAME COLUMN photo_url TO image_url;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'featured_image_url')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'image_url') THEN
    ALTER TABLE public.blog_posts RENAME COLUMN featured_image_url TO image_url;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'featured_image_url') THEN
    -- Both old and new somehow exist (odd partial state) - merge and drop the old one.
    UPDATE public.blog_posts SET image_url = COALESCE(image_url, featured_image_url);
    ALTER TABLE public.blog_posts DROP COLUMN featured_image_url;
  END IF;
END $$;

-- Backfill is_published from the old `status` column if it still exists,
-- then drop `status` - safe to run whether or not it's already gone.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'status') THEN
    UPDATE public.blog_posts SET is_published = (status = 'published') WHERE status IS NOT NULL;
    ALTER TABLE public.blog_posts DROP COLUMN status;
  END IF;
END $$;

-- Backfill missing service slugs (new rows always get one via the app's
-- server action, but rows inserted before that existed might not have one).
UPDATE public.services
SET slug = lower(regexp_replace(regexp_replace(name_fr, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL;


-- ============================================================================
-- SECTION 3: REMOVE OBSOLETE SCHEMA OBJECTS
-- (no longer referenced anywhere in the application code)
-- ============================================================================
DROP TABLE IF EXISTS public.blog_post_categories CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;

ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS seo_title_fr;
ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS seo_title_ar;
ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS seo_description_fr;
ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS seo_description_ar;
ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS author_id;

ALTER TABLE public.doctors DROP COLUMN IF EXISTS languages;

ALTER TABLE public.content_sections DROP COLUMN IF EXISTS images;
ALTER TABLE public.content_sections DROP COLUMN IF EXISTS metadata;
ALTER TABLE public.content_sections DROP COLUMN IF EXISTS is_visible;
ALTER TABLE public.content_sections DROP COLUMN IF EXISTS display_order;

-- Old appointments.service CHECK constraint hard-coded 4 service values,
-- which no longer matches reality now that services are admin-editable.
-- Loosen it to a plain NOT NULL text field (already the column type).
DO $$
DECLARE
  c_name TEXT;
BEGIN
  SELECT con.conname INTO c_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'appointments' AND con.contype = 'c' AND pg_get_constraintdef(con.oid) LIKE '%service = ANY%';
  IF c_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.appointments DROP CONSTRAINT %I', c_name);
  END IF;
END $$;

-- Obsolete clinic_settings seed keys from an early iteration, superseded by
-- 'contact_info' / 'working_hours' (src/lib/supabase/public-settings.ts is
-- the only settings reader the app uses now).
DELETE FROM public.clinic_settings WHERE key IN ('emergency_contact', 'service_prices', 'clinic_info');


-- ============================================================================
-- SECTION 4: UNIQUE CONSTRAINTS / INDEXES (idempotent forms)
-- ============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS services_slug_unique_idx ON public.services(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_testimonials_google_review_id
  ON public.testimonials (google_review_id)
  WHERE google_review_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_instagram_media_id
  ON public.gallery_images (instagram_media_id)
  WHERE instagram_media_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON public.appointments(service);
CREATE INDEX IF NOT EXISTS idx_clinic_settings_key ON public.clinic_settings(key);
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON public.content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_services_active_order ON public.services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_doctors_active_order ON public.doctors(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_faqs_active_order ON public.faqs(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_pricing_active_order ON public.pricing_plans(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_offers_active_order ON public.offers(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_published_order ON public.gallery_images(is_published, display_order);


-- ============================================================================
-- SECTION 5: FUNCTIONS
-- ============================================================================

-- Creates a profile row for every new auth user. The FIRST person ever to
-- sign up becomes admin automatically; everyone after that starts as a
-- plain user and must be promoted manually:
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INT;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE role = 'admin';

  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN admin_count = 0 THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Used inside RLS policies to check "is the current request an admin?".
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Safe, minimal-information public check: "does an admin account exist
-- yet?". Returns only a boolean, never any profile data, so it's safe to
-- call from the public login page even though `profiles` itself is RLS
-- protected. Drives the one-time "create the first admin account" form.
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-creates a profiles row on signup; first-ever signup becomes admin.';
COMMENT ON FUNCTION public.is_admin() IS 'True if the current authenticated user has role=admin in profiles.';
COMMENT ON FUNCTION public.admin_exists() IS 'True if any admin account exists yet - used to drive the first-run setup form.';


-- ============================================================================
-- SECTION 6: TRIGGERS
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for any auth users that existed before this trigger did
-- (e.g. someone signed up while the profiles table/trigger didn't exist yet
-- due to the old broken migration chain). Applies the SAME "first user
-- becomes admin" bootstrap rule as the trigger above, so someone who
-- already has an auth account isn't left permanently unable to reach admin
-- without a manual SQL promotion.
DO $$
DECLARE
  first_user_id UUID;
  existing_admin_count INT;
BEGIN
  SELECT COUNT(*) INTO existing_admin_count FROM public.profiles WHERE role = 'admin';

  IF existing_admin_count = 0 THEN
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, email, role)
  SELECT u.id, u.email, CASE WHEN u.id = first_user_id THEN 'admin' ELSE 'user' END
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE p.id IS NULL
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Generic "keep updated_at current" trigger, applied to every table that has
-- an updated_at column.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'clinic_settings', 'appointments', 'content_sections', 'services', 'doctors',
      'testimonials', 'faqs', 'blog_posts', 'pricing_plans', 'offers', 'social_media'
    ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      t
    );
  END LOOP;
END $$;


-- ============================================================================
-- SECTION 7: ROW LEVEL SECURITY - ENABLE ON EVERY TABLE
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- SECTION 8: RLS POLICIES
-- Every policy is dropped first (IF EXISTS, covering every historical name
-- used across the old 001-007 chain) and recreated, so this section is
-- fully idempotent and leaves exactly ONE policy per operation per table -
-- no duplicates left over from earlier migration attempts.
-- ============================================================================

-- --- profiles ---
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- --- appointments ---
DROP POLICY IF EXISTS "Allow_public_insert_appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow_authenticated_select_appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow_authenticated_update_appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow_authenticated_delete_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin_select_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin_update_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin_delete_appointments" ON public.appointments;

DROP POLICY IF EXISTS "public_insert_appointments" ON public.appointments;
CREATE POLICY "public_insert_appointments" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND name != '' AND
    phone IS NOT NULL AND phone != '' AND
    service IS NOT NULL AND
    name !~* '(<|>|script|javascript|onerror|onload)' AND
    phone ~* '^\+?[0-9\s\-]{8,20}$'
  );
CREATE POLICY "admin_select_appointments" ON public.appointments
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_update_appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (public.is_admin())
  WITH CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));
CREATE POLICY "admin_delete_appointments" ON public.appointments
  FOR DELETE TO authenticated USING (public.is_admin());

-- --- clinic_settings ---
DROP POLICY IF EXISTS "Allow_authenticated_read_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "Allow_authenticated_update_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "Allow_authenticated_insert_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "admin_read_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "admin_write_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "admin_insert_settings" ON public.clinic_settings;

DROP POLICY IF EXISTS "admin_select_settings" ON public.clinic_settings;
CREATE POLICY "admin_select_settings" ON public.clinic_settings
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_insert_settings" ON public.clinic_settings
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_settings" ON public.clinic_settings;
CREATE POLICY "admin_update_settings" ON public.clinic_settings
  FOR UPDATE TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_settings" ON public.clinic_settings;
CREATE POLICY "admin_delete_settings" ON public.clinic_settings
  FOR DELETE TO authenticated USING (public.is_admin());

-- --- content_sections ---
DROP POLICY IF EXISTS "Public read content_sections" ON public.content_sections;
DROP POLICY IF EXISTS "Admin full access content_sections" ON public.content_sections;
DROP POLICY IF EXISTS "admin_full_access_content_sections" ON public.content_sections;

DROP POLICY IF EXISTS "public_read_content_sections" ON public.content_sections;
CREATE POLICY "public_read_content_sections" ON public.content_sections
  FOR SELECT USING (true);
CREATE POLICY "admin_full_access_content_sections" ON public.content_sections
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- services ---
DROP POLICY IF EXISTS "Public read services" ON public.services;
DROP POLICY IF EXISTS "Admin full access services" ON public.services;
DROP POLICY IF EXISTS "admin_full_access_services" ON public.services;

DROP POLICY IF EXISTS "public_read_services" ON public.services;
CREATE POLICY "public_read_services" ON public.services
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_full_access_services" ON public.services
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- doctors ---
DROP POLICY IF EXISTS "Public read doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admin full access doctors" ON public.doctors;
DROP POLICY IF EXISTS "admin_full_access_doctors" ON public.doctors;

DROP POLICY IF EXISTS "public_read_doctors" ON public.doctors;
CREATE POLICY "public_read_doctors" ON public.doctors
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_full_access_doctors" ON public.doctors
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- testimonials ---
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin full access testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "admin_full_access_testimonials" ON public.testimonials;

DROP POLICY IF EXISTS "public_read_testimonials" ON public.testimonials;
CREATE POLICY "public_read_testimonials" ON public.testimonials
  FOR SELECT USING (is_published = true);
CREATE POLICY "admin_full_access_testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- faqs ---
DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin full access faqs" ON public.faqs;
DROP POLICY IF EXISTS "admin_full_access_faqs" ON public.faqs;

DROP POLICY IF EXISTS "public_read_faqs" ON public.faqs;
CREATE POLICY "public_read_faqs" ON public.faqs
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_full_access_faqs" ON public.faqs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- blog_posts ---
DROP POLICY IF EXISTS "Public read blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin full access blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "admin_full_access_blog_posts" ON public.blog_posts;

DROP POLICY IF EXISTS "public_read_blog_posts" ON public.blog_posts;
CREATE POLICY "public_read_blog_posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);
CREATE POLICY "admin_full_access_blog_posts" ON public.blog_posts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- pricing_plans ---
DROP POLICY IF EXISTS "Public read pricing_plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admin full access pricing_plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "admin_full_access_pricing_plans" ON public.pricing_plans;

DROP POLICY IF EXISTS "public_read_pricing_plans" ON public.pricing_plans;
CREATE POLICY "public_read_pricing_plans" ON public.pricing_plans
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_full_access_pricing_plans" ON public.pricing_plans
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- offers ---
DROP POLICY IF EXISTS "public_read_offers" ON public.offers;
DROP POLICY IF EXISTS "admin_full_access_offers" ON public.offers;

CREATE POLICY "public_read_offers" ON public.offers
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));
CREATE POLICY "admin_full_access_offers" ON public.offers
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- social_media ---
DROP POLICY IF EXISTS "Public read social_media" ON public.social_media;
DROP POLICY IF EXISTS "Admin full access social_media" ON public.social_media;
DROP POLICY IF EXISTS "admin_full_access_social_media" ON public.social_media;

DROP POLICY IF EXISTS "public_read_social_media" ON public.social_media;
CREATE POLICY "public_read_social_media" ON public.social_media
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_full_access_social_media" ON public.social_media
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- newsletter_subscribers ---
DROP POLICY IF EXISTS "public_subscribe_newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_read_newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_delete_newsletter" ON public.newsletter_subscribers;

CREATE POLICY "public_subscribe_newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_read_newsletter" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete_newsletter" ON public.newsletter_subscribers
  FOR DELETE TO authenticated USING (public.is_admin());

-- --- gallery_images ---
DROP POLICY IF EXISTS "public_read_gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "admin_full_access_gallery" ON public.gallery_images;

CREATE POLICY "public_read_gallery" ON public.gallery_images
  FOR SELECT USING (is_published = true);
CREATE POLICY "admin_full_access_gallery" ON public.gallery_images
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ============================================================================
-- SECTION 9: TABLE-LEVEL GRANTS
-- This is the piece that was missing for `profiles` (and, latently, every
-- other table) - RLS policies restrict WHICH ROWS a role can touch, but the
-- role still needs the underlying SQL privilege on the table at all. GRANT
-- is idempotent: re-granting a privilege a role already has is a no-op.
-- ============================================================================

-- profiles: exactly the grants confirmed to fix the admin-login issue.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Public read-only tables (RLS further restricts to is_active/is_published
-- rows only) + full admin access for authenticated (RLS restricts to
-- is_admin() rows only).
GRANT SELECT ON public.content_sections, public.services, public.doctors,
  public.testimonials, public.faqs, public.blog_posts, public.pricing_plans,
  public.offers, public.social_media, public.gallery_images
  TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.content_sections, public.services,
  public.doctors, public.testimonials, public.faqs, public.blog_posts,
  public.pricing_plans, public.offers, public.social_media, public.gallery_images
  TO authenticated;

-- clinic_settings: admin-only in both directions (no public read needed -
-- the app reads it exclusively from server-side code with an admin/service
-- session, never directly from the browser).
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clinic_settings TO authenticated;

-- appointments: public can create (booking form), admin can manage.
GRANT INSERT ON public.appointments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.appointments TO authenticated;

-- newsletter_subscribers: public can subscribe, admin can read/manage.
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;

-- Function execution (defensive - PostgreSQL grants EXECUTE to PUBLIC by
-- default on function creation, but this makes it explicit and immune to
-- any earlier REVOKE).
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;


-- ============================================================================
-- SECTION 10: STORAGE (bucket + policies)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read media" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;
DROP POLICY IF EXISTS "admin_insert_media" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_media" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_media" ON storage.objects;

DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "public_read_media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "admin_insert_media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin_update_media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin_delete_media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

-- Defensive table-level grants for storage, same rationale as Section 9.
GRANT SELECT ON storage.objects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON storage.objects TO authenticated;


-- ============================================================================
-- SECTION 11: SEED DATA (safe to re-run - ON CONFLICT DO NOTHING everywhere)
-- ============================================================================
INSERT INTO public.clinic_settings (key, value) VALUES (
  'contact_info',
  '{
    "phone": "+212612345678",
    "whatsapp": "+212612345678",
    "email": "contact@dentora.ma",
    "address_fr": "Casablanca, Maroc",
    "address_ar": "الدار البيضاء، المغرب"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

INSERT INTO public.clinic_settings (key, value) VALUES (
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
) ON CONFLICT (key) DO NOTHING;

INSERT INTO public.social_media (platform, url, is_active, display_order) VALUES
  ('facebook', 'https://facebook.com/dentora', true, 1),
  ('instagram', 'https://instagram.com/dentora', true, 2)
ON CONFLICT (platform) DO NOTHING;


-- ============================================================================
-- SECTION 12: COMMENTS (documentation, always safe to re-apply)
-- ============================================================================
COMMENT ON TABLE public.profiles IS 'User roles - only role=admin gets dashboard access. First-ever signup becomes admin automatically.';
COMMENT ON TABLE public.appointments IS 'Patient appointment requests submitted from the public booking form.';
COMMENT ON TABLE public.clinic_settings IS 'Generic key/value store for admin-editable site settings (contact info, hours, third-party integration tokens).';
COMMENT ON TABLE public.content_sections IS 'Admin-editable overrides for homepage text sections (currently: hero).';
COMMENT ON TABLE public.services IS 'Dental services shown on the homepage and their individual /services/[slug] pages.';
COMMENT ON TABLE public.doctors IS 'Clinic doctors/specialists shown on the homepage team section.';
COMMENT ON TABLE public.testimonials IS 'Patient reviews - manually entered or synced from Google Maps.';
COMMENT ON TABLE public.faqs IS 'Frequently asked questions shown on the homepage.';
COMMENT ON TABLE public.blog_posts IS 'Blog articles with bilingual content and optional cover image.';
COMMENT ON TABLE public.pricing_plans IS 'الباقات - dental care packages, managed from the admin dashboard.';
COMMENT ON TABLE public.offers IS 'العروض - time-limited promotions, managed from the admin dashboard.';
COMMENT ON TABLE public.social_media IS 'Social media links shown in the site footer.';
COMMENT ON TABLE public.newsletter_subscribers IS 'Emails collected from the footer newsletter signup form.';
COMMENT ON TABLE public.gallery_images IS 'Instagram-synced (or manually added) photos shown in the website gallery section.';

-- ============================================================================
-- END OF CONSOLIDATED SCHEMA
-- ============================================================================
