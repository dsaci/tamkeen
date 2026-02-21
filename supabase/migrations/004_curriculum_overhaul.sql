-- ============================================================
-- Supabase Migration: Curriculum Overhaul
-- Adds missing columns for Algerian curriculum adherence
-- ============================================================

ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS section_number INTEGER,
ADD COLUMN IF NOT EXISTS unity_number INTEGER,
ADD COLUMN IF NOT EXISTS break_duration INTEGER,
ADD COLUMN IF NOT EXISTS exam_type TEXT,
ADD COLUMN IF NOT EXISTS support_type TEXT,
ADD COLUMN IF NOT EXISTS training_type TEXT,
ADD COLUMN IF NOT EXISTS integration_type TEXT;

-- Verify indexes for performance on new columns
CREATE INDEX IF NOT EXISTS idx_sessions_section_num ON sessions(section_number);
CREATE INDEX IF NOT EXISTS idx_sessions_unity_num ON sessions(unity_number);
