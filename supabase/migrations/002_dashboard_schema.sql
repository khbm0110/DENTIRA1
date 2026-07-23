-- ============================================
-- DASHBOARD ARCHITECTURE SCHEMA
-- ============================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CONTENT SECTIONS (Hero, About, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL, -- e.g. 'hero', 'about', 'contact'
  title_fr TEXT,
  title_ar TEXT,
  description_fr TEXT,
  description_ar TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs or paths
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional data like buttons, working_hours, etc.
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  image_url TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DOCTORS
-- ============================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  specialty_fr TEXT,
  specialty_ar TEXT,
  bio_fr TEXT,
  bio_ar TEXT,
  photo_url TEXT,
  experience_years INTEGER,
  languages JSONB DEFAULT '[]'::jsonb, -- e.g. ["fr", "ar", "en"]
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS
-- ============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  review_fr TEXT NOT NULL,
  review_ar TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FAQS
-- ============================================
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

-- ============================================
-- BLOG SYSTEM
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  content_fr TEXT,
  content_ar TEXT,
  featured_image_url TEXT,
  seo_title_fr TEXT,
  seo_title_ar TEXT,
  seo_description_fr TEXT,
  seo_description_ar TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.blog_post_categories (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- ============================================
-- PRICING PLANS
-- ============================================
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'MAD',
  features_fr JSONB DEFAULT '[]'::jsonb, -- Array of features
  features_ar JSONB DEFAULT '[]'::jsonb,
  button_text_fr TEXT,
  button_text_ar TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SOCIAL MEDIA
-- ============================================
CREATE TABLE IF NOT EXISTS public.social_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT UNIQUE NOT NULL, -- e.g. 'facebook', 'instagram'
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_content_sections_key ON public.content_sections(section_key);
CREATE INDEX idx_services_active_order ON public.services(is_active, display_order);
CREATE INDEX idx_doctors_active_order ON public.doctors(is_active, display_order);
CREATE INDEX idx_testimonials_published ON public.testimonials(is_published);
CREATE INDEX idx_faqs_active_order ON public.faqs(is_active, display_order);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status, published_at);
CREATE INDEX idx_pricing_active_order ON public.pricing_plans(is_active, display_order);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;

-- Read policies for public access (Select)
CREATE POLICY "Public read content_sections" ON public.content_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read doctors" ON public.doctors FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read blog_categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read blog_post_categories" ON public.blog_post_categories FOR SELECT USING (true);
CREATE POLICY "Public read pricing_plans" ON public.pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public read social_media" ON public.social_media FOR SELECT USING (is_active = true);

-- Admin policies (All access)
-- Note: Assuming auth.users who log in are admins. In a real app, you'd check a role or permissions table.
CREATE POLICY "Admin full access content_sections" ON public.content_sections TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access services" ON public.services TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access doctors" ON public.doctors TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access testimonials" ON public.testimonials TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access faqs" ON public.faqs TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access blog_categories" ON public.blog_categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access blog_posts" ON public.blog_posts TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access blog_post_categories" ON public.blog_post_categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access pricing_plans" ON public.pricing_plans TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access social_media" ON public.social_media TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- SUPABASE STORAGE FOR MEDIA LIBRARY
-- ============================================
-- Insert storage bucket for media library
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Public can read media
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Authenticated (Admins) can insert, update, delete
CREATE POLICY "Admin insert media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');

