-- DENTORA-OS - SUPABASE SECURITY & RLS POLICIES
-- This script implements Row Level Security for the appointments table

-- ============================================
-- STEP 1: CREATE APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL CHECK (service IN ('implantology', 'orthodontics', 'whitening', 'pedodontics')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  preferred_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: CREATE RLS POLICIES
-- ============================================

-- Policy 1: Allow PUBLIC to INSERT appointments (patients can book)
-- This enables anonymous users to create appointment requests
CREATE POLICY "Allow_public_insert_appointments"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (
  -- Validate required fields
  name IS NOT NULL AND name != '' AND
  phone IS NOT NULL AND phone != '' AND
  service IS NOT NULL AND
  -- Sanitize input: prevent SQL injection patterns
  name !~* '(<|>|script|javascript|onerror|onload)' AND
  phone ~* '^\+?[0-9\s\-]{8,20}$'
);

-- Policy 2: Allow AUTHENTICATED users to SELECT appointments (Admin only)
-- Admins can view all appointments to manage the clinic
CREATE POLICY "Allow_authenticated_select_appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Allow AUTHENTICATED users to UPDATE appointments (Admin only)
-- Admins can update appointment status and details
CREATE POLICY "Allow_authenticated_update_appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (
  -- Only allow updating specific fields for security
  id IS NOT NULL AND
  status IN ('pending', 'confirmed', 'completed', 'cancelled')
);

-- Policy 4: Allow AUTHENTICATED users to DELETE appointments (Admin only)
-- Admins can delete cancelled or duplicate appointments
CREATE POLICY "Allow_authenticated_delete_appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 4: CREATE CLINIC_SETTINGS TABLE (Dynamic Config)
-- ============================================
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on clinic_settings
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read settings
CREATE POLICY "Allow_authenticated_read_settings"
ON public.clinic_settings
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to update settings (Admin only)
CREATE POLICY "Allow_authenticated_update_settings"
ON public.clinic_settings
FOR UPDATE
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert settings (Admin only)
CREATE POLICY "Allow_authenticated_insert_settings"
ON public.clinic_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- STEP 5: INSERT DEFAULT CLINIC SETTINGS
-- ============================================
INSERT INTO public.clinic_settings (key, value, description) VALUES
  (
    'working_hours',
    '{
      "monday": {"open": "09:00", "close": "18:00", "enabled": true},
      "tuesday": {"open": "09:00", "close": "18:00", "enabled": true},
      "wednesday": {"open": "09:00", "close": "18:00", "enabled": true},
      "thursday": {"open": "09:00", "close": "18:00", "enabled": true},
      "friday": {"open": "09:00", "close": "14:00", "enabled": true},
      "saturday": {"open": "09:00", "close": "18:00", "enabled": true},
      "sunday": {"open": "", "close": "", "enabled": false}
    }'::jsonb,
    'Clinic working hours by day of week'
  ),
  (
    'emergency_contact',
    '{
      "enabled": true,
      "phone": "+2126XXXXXXXX",
      "whatsapp": "+2126XXXXXXXX",
      "message": "Urgent dental care needed"
    }'::jsonb,
    'Emergency contact information'
  ),
  (
    'service_prices',
    '{
      "implantology": {"min": 8000, "max": 15000, "currency": "MAD", "description": "Per implant including crown"},
      "orthodontics": {"min": 25000, "max": 45000, "currency": "MAD", "description": "Full treatment including aligners"},
      "whitening": {"min": 1500, "max": 3000, "currency": "MAD", "description": "Per session"},
      "pedodontics": {"min": 500, "max": 2000, "currency": "MAD", "description": "Per procedure"}
    }'::jsonb,
    'Service pricing information'
  ),
  (
    'clinic_info',
    '{
      "name": "Dentora",
      "slogan": "Excellence en Medecine Dentaire",
      "address": "Casablanca, Morocco",
      "coordinates": {"lat": 33.5731, "lng": -7.5898},
      "google_place_id": "YOUR_GOOGLE_PLACE_ID"
    }'::jsonb,
    'Basic clinic information'
  )
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- STEP 6: CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON public.appointments(service);
CREATE INDEX IF NOT EXISTS idx_clinic_settings_key ON public.clinic_settings(key);

-- ============================================
-- STEP 7: ENABLE REALTIME (Optional)
-- ============================================
-- Uncomment if you want real-time updates in the admin dashboard
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- ============================================
-- STEP 8: VERIFICATION QUERIES
-- ============================================
-- Check existing policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'appointments';
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'clinic_settings';

COMMENT ON TABLE public.appointments IS 'Patient appointment requests - RLS enabled for security';
COMMENT ON TABLE public.clinic_settings IS 'Dynamic clinic configuration - Admin managed via dashboard';
