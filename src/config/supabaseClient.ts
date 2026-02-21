/**
 * Supabase Client Singleton
 * Lazily initializes the Supabase client only when MODE requires it.
 * Never exposes credentials. Returns null in offline mode.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseEnabled } from './envValidation';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get the Supabase client instance.
 * Returns null if running in offline mode.
 * Lazily creates the client on first call.
 */
export function getSupabaseClient(): SupabaseClient | null {
    if (!isSupabaseEnabled()) {
        return null;
    }

    if (supabaseInstance) {
        return supabaseInstance;
    }

    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error('[Supabase] Cannot initialize: missing URL or ANON_KEY.');
        return null;
    }

    supabaseInstance = createClient(url, key, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true, // REQUIRED for OAuth callback (reads #access_token from URL)
        },
    });

    console.log('[Supabase] Client initialized.');
    return supabaseInstance;
}

/**
 * Reset the client instance (useful for testing or mode switching).
 */
export function resetSupabaseClient(): void {
    supabaseInstance = null;
}
