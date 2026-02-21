-- ============================================================
-- Migration 002: Cleanup old auth triggers
-- Removes legacy trigger that referenced non-existent 'teachers' table
-- Profile creation is now handled by app code (SupabaseAuthService)
-- ============================================================

-- Remove the legacy trigger from a previous schema version
DROP TRIGGER IF EXISTS on_auth_user_created_teacher ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_teacher();

-- Remove any other stale triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure authenticated users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
