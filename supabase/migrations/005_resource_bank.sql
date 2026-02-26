-- =============================================
-- TAMKEEN: Resource Bank + Files Tables
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. resource_bank: المستودع الأساسي للموارد البيداغوجية
CREATE TABLE IF NOT EXISTS resource_bank (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject text NOT NULL,
  level text NOT NULL,
  grade text NOT NULL,
  unit text,
  activity text NOT NULL,
  title text NOT NULL,
  normalized_title text NOT NULL,
  objective text,
  content text,
  tools text,
  method text,
  source text DEFAULT 'admin',
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. files: الملفات المرفقة بالموارد
CREATE TABLE IF NOT EXISTS files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id uuid REFERENCES resource_bank(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('document', 'video')),
  file_url text NOT NULL,
  file_size bigint,
  duration_seconds integer,
  uploaded_by uuid,
  uploaded_at timestamptz DEFAULT now()
);

-- 3. Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_resource_search
  ON resource_bank(subject, level, grade, activity, normalized_title);

CREATE INDEX IF NOT EXISTS idx_resource_grade
  ON resource_bank(level, grade);

CREATE INDEX IF NOT EXISTS idx_files_resource
  ON files(resource_id);

-- 4. RLS Policies
ALTER TABLE resource_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Everyone can read resources
CREATE POLICY "Anyone can read resources"
  ON resource_bank FOR SELECT USING (true);

-- Everyone can insert resources (for AI auto-save)
CREATE POLICY "Anyone can insert resources"
  ON resource_bank FOR INSERT WITH CHECK (true);

-- Everyone can update usage_count
CREATE POLICY "Anyone can update resources"
  ON resource_bank FOR UPDATE USING (true);

-- Admins can delete
CREATE POLICY "Admins can delete resources"
  ON resource_bank FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Files policies
CREATE POLICY "Anyone can read files"
  ON files FOR SELECT USING (true);

CREATE POLICY "Anyone can insert files"
  ON files FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can delete files"
  ON files FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. Storage bucket (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('pedagogical-files', 'pedagogical-files', false);
