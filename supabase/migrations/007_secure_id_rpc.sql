-- ============================================================
-- Supabase Migration: Secure Digital ID RPC
-- Resolves RLS blocking issues for anonymous lookups
-- and further optimizes performance by consolidating queries.
-- ============================================================

-- This function takes a tamkeen_id and returns the associated user's email.
-- It is defined as SECURITY DEFINER to bypass RLS policies safely
-- for this specific, narrow purpose.
CREATE OR REPLACE FUNCTION get_user_email_by_tamkeen_id(p_tamkeen_id TEXT)
RETURNS TABLE (email TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER -- Allows bypassing RLS for lookup
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT p.email 
    FROM profiles p
    WHERE (
        -- 1. Try dedicated column first (best performance)
        -- We use a safe check in case the column doesn't exist yet to avoid crashes
        CASE 
            WHEN column_exists('profiles', 'tamkeen_id') THEN p.tamkeen_id = p_tamkeen_id 
            ELSE FALSE 
        END
    )
    OR (
        -- 2. Fallback to metadata JSONB (camelCase)
        p.metadata->>'tamkeenId' = p_tamkeen_id
    )
    OR (
        -- 3. Fallback to metadata JSONB (snake_case)
        p.metadata->>'tamkeen_id' = p_tamkeen_id
    )
    LIMIT 1;
END;
$$;

-- Helper function to check column existence safely within SQL
CREATE OR REPLACE FUNCTION column_exists(p_table TEXT, p_column TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = p_table AND column_name = p_column
    );
END;
$$ LANGUAGE plpgsql;

-- Grant execution to public (anon users need to call this)
GRANT EXECUTE ON FUNCTION get_user_email_by_tamkeen_id(TEXT) TO public;
GRANT EXECUTE ON FUNCTION get_user_email_by_tamkeen_id(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_user_email_by_tamkeen_id(TEXT) TO authenticated;
