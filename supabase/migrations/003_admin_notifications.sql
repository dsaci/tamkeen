-- ============================================================
-- Supabase Migration: Admin Notifications
-- Allows admin to send broadcast notifications to all users
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  sent_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Everyone can read active notifications
DROP POLICY IF EXISTS "Anyone can read notifications" ON admin_notifications;
CREATE POLICY "Anyone can read notifications"
  ON admin_notifications FOR SELECT
  USING (true);

-- Only admins can insert notifications
DROP POLICY IF EXISTS "Admins can insert notifications" ON admin_notifications;
CREATE POLICY "Admins can insert notifications"
  ON admin_notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can update (deactivate) notifications
DROP POLICY IF EXISTS "Admins can update notifications" ON admin_notifications;
CREATE POLICY "Admins can update notifications"
  ON admin_notifications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Track which users have dismissed which notifications
CREATE TABLE IF NOT EXISTS notification_dismissals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL REFERENCES admin_notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  dismissed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notification_id, user_id)
);

ALTER TABLE notification_dismissals ENABLE ROW LEVEL SECURITY;

-- Users can read their own dismissals
DROP POLICY IF EXISTS "Users can read own dismissals" ON notification_dismissals;
CREATE POLICY "Users can read own dismissals"
  ON notification_dismissals FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own dismissals
DROP POLICY IF EXISTS "Users can insert own dismissals" ON notification_dismissals;
CREATE POLICY "Users can insert own dismissals"
  ON notification_dismissals FOR INSERT
  WITH CHECK (auth.uid() = user_id);
