/**
 * Environment Validation Module
 * Validates required environment variables based on application mode.
 * NEVER prints or logs actual secret values.
 */

export type AppMode = 'offline' | 'hybrid' | 'cloud';

/**
 * Get the current application mode from environment variables.
 * Defaults to 'offline' if not set.
 */
export function getMode(): AppMode {
    const mode = (import.meta.env.VITE_MODE || 'offline').toLowerCase().trim();
    if (mode === 'hybrid' || mode === 'cloud') return mode;
    return 'offline';
}

/**
 * Validates that all required environment variables are present
 * for the current mode. Throws descriptive errors if missing.
 * 
 * Call this at application startup before initializing services.
 */
export function validateEnvironment(): void {
    const mode = getMode();

    if (mode === 'offline') {
        console.log('[Env] Running in offline mode — no cloud credentials required.');
        return;
    }

    const errors: string[] = [];

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl.trim() === '') {
        errors.push('VITE_SUPABASE_URL is missing or empty.');
    }

    if (!supabaseKey || supabaseKey.trim() === '') {
        errors.push('VITE_SUPABASE_ANON_KEY is missing or empty.');
    }

    if (errors.length > 0) {
        const message = [
            `[Env] ❌ Environment validation failed for MODE="${mode}":`,
            ...errors.map((e, i) => `  ${i + 1}. ${e}`),
            '',
            'Please set the missing variables in your .env file.',
            'See .env.example for reference.',
        ].join('\n');

        throw new Error(message);
    }

    console.log(`[Env] ✅ Environment validated for MODE="${mode}".`);
}

/**
 * Returns true if the app is running in a mode that uses Supabase.
 */
export function isSupabaseEnabled(): boolean {
    return getMode() !== 'offline';
}
