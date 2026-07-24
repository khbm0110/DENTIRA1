-- DENTORA-OS - MIGRATION 006
-- Automates admin bootstrap: previously the clinic owner had to sign up,
-- then manually run an UPDATE query in the Supabase SQL editor to become
-- admin. Now: if NO admin account exists yet, the very next person to sign
-- up automatically becomes the admin. After that first admin exists, every
-- new signup goes back to being a plain 'user' as before (unchanged
-- behavior/security model for every signup after the first).

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger already exists from migration 003/002 and points at this same
-- function name, so no need to re-create it - CREATE OR REPLACE above is
-- enough to update its behavior.

-- Safe, minimal-information public check: "does an admin account exist yet?"
-- Returns only a boolean - never any actual profile data - so it's safe to
-- call from the public login page (anon key) even though the profiles table
-- itself is protected by RLS. Used to show a one-time "create the first
-- admin account" form only when the site has no admin yet.
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Creates a profile row for every new auth user. The FIRST person ever to sign up becomes admin automatically; everyone after that starts as a plain user and must be promoted manually (UPDATE public.profiles SET role = ''admin'' WHERE email = ''...'').';
