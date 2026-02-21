/**
 * AuthServiceFactory
 * Returns the appropriate AuthService implementation based on the current MODE.
 * 
 * offline / hybrid → LocalAuthService (Electron IPC)
 * cloud            → SupabaseAuthService
 */

import { AuthService } from './AuthService';
import { LocalAuthService } from './LocalAuthService';
import { SupabaseAuthService } from './SupabaseAuthService';
import { getMode } from '../../config/envValidation';

let localInstance: LocalAuthService | null = null;
let supabaseInstance: SupabaseAuthService | null = null;

function getLocalAuth(): LocalAuthService {
    if (!localInstance) {
        localInstance = new LocalAuthService();
    }
    return localInstance;
}

function getSupabaseAuth(): SupabaseAuthService {
    if (!supabaseInstance) {
        supabaseInstance = new SupabaseAuthService();
    }
    return supabaseInstance;
}

/**
 * Get the auth service based on the current MODE.
 * 
 * - offline: local auth (Electron IPC)
 * - hybrid: local auth (Electron IPC) — auth stays local, only data syncs
 * - cloud: Supabase auth
 */
export function getAuthService(): AuthService {
    const mode = getMode();

    switch (mode) {
        case 'cloud':
            return getSupabaseAuth();
        case 'hybrid':
        case 'offline':
        default:
            return getLocalAuth();
    }
}
