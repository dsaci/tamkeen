/**
 * DatabaseServiceFactory
 * Returns the appropriate DatabaseService implementation based on the current MODE.
 * 
 * offline → LocalDatabaseService
 * hybrid  → LocalDatabaseService (primary) + SyncManager active
 * cloud   → SupabaseDatabaseService (primary), local as fallback
 */

import { DatabaseService } from './DatabaseService';
import { LocalDatabaseService } from './LocalDatabaseService';
import { SupabaseDatabaseService } from './SupabaseDatabaseService';
import { syncManager } from './SyncManager';
import { getMode } from '../../config/envValidation';

let localInstance: LocalDatabaseService | null = null;
let supabaseInstance: SupabaseDatabaseService | null = null;

function getLocalService(): LocalDatabaseService {
    if (!localInstance) {
        localInstance = new LocalDatabaseService();
    }
    return localInstance;
}

function getSupabaseService(): SupabaseDatabaseService {
    if (!supabaseInstance) {
        supabaseInstance = new SupabaseDatabaseService();
    }
    return supabaseInstance;
}

/**
 * Get the primary database service based on the current MODE.
 */
export function getDatabaseService(): DatabaseService {
    const mode = getMode();

    switch (mode) {
        case 'cloud':
            return getSupabaseService();
        case 'hybrid':
        case 'offline':
        default:
            return getLocalService();
    }
}

/**
 * Get the local database service (always available as fallback).
 */
export function getLocalDatabaseService(): LocalDatabaseService {
    return getLocalService();
}

/**
 * Initialize sync if MODE is hybrid.
 * Should be called once at app startup after auth is established.
 */
export function initializeSync(intervalMs: number = 60000): void {
    const mode = getMode();

    if (mode === 'hybrid') {
        console.log('[DBFactory] Starting SyncManager for hybrid mode...');
        syncManager.startAutoSync(intervalMs);
    } else if (mode === 'cloud') {
        console.log('[DBFactory] Cloud mode — no local sync needed.');
    } else {
        console.log('[DBFactory] Offline mode — sync disabled.');
    }
}

/**
 * Stop sync (call on app shutdown or logout).
 */
export function stopSync(): void {
    syncManager.stopAutoSync();
}

/**
 * Get the current sync status.
 */
export function getSyncStatus() {
    return syncManager.getStatus();
}
