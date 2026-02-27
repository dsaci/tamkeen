-- ============================================================
-- Supabase Migration: Add Dedicated Tamkeen ID Column
-- This optimizes QR login by allowing indexed B-tree lookups
-- instead of slower JSONB scans.
-- ============================================================

-- 1. Add the column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='tamkeen_id') THEN
        ALTER TABLE public.profiles ADD COLUMN tamkeen_id TEXT UNIQUE;
    END IF;
END $$;

-- 2. Backfill data from metadata if tamkeen_id is null
UPDATE public.profiles
SET tamkeen_id = metadata->>'tamkeenId'
WHERE tamkeen_id IS NULL AND metadata->>'tamkeenId' IS NOT NULL;

-- 3. Additional backfill for snake_case metadata (just in case)
UPDATE public.profiles
SET tamkeen_id = metadata->>'tamkeen_id'
WHERE tamkeen_id IS NULL AND metadata->>'tamkeen_id' IS NOT NULL;

-- 4. Create an index for O(1) lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_tamkeen_id ON public.profiles(tamkeen_id);

-- 5. Set comment for documentation
COMMENT ON COLUMN public.profiles.tamkeen_id IS 'Unique identifier for Tamkeen platform, used for QR and Digital ID login.';
