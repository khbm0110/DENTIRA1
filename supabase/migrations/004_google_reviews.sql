-- DENTORA-OS - MIGRATION 004
-- Adds support for syncing real Google Maps reviews into the testimonials
-- table, so the "Testimonials" section can show genuine patient reviews
-- pulled from Google instead of manually-typed text.

ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'google'));
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS google_review_id TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS relative_time_description TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS author_url TEXT;

-- Prevent the same Google review from being inserted twice on repeated syncs.
-- Partial unique index: only enforced when google_review_id is present
-- (manual reviews have no google_review_id and shouldn't be affected).
CREATE UNIQUE INDEX IF NOT EXISTS idx_testimonials_google_review_id
  ON public.testimonials (google_review_id)
  WHERE google_review_id IS NOT NULL;

COMMENT ON COLUMN public.testimonials.source IS 'manual = typed by admin, google = synced automatically from Google Maps reviews';
