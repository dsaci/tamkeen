/**
 * SyncService
 * Top-level sync orchestrator for the renderer process.
 * Delegates to SyncManager (hybrid mode) or is a no-op (offline/cloud).
 */

import { getMode } from '../config/envValidation';
import { syncManager } from './database/SyncManager';

export class SyncService {
    private isSyncing = false;

    public async sync() {
        if (this.isSyncing) return;

        const mode = getMode();

        if (mode === 'offline') {
            console.log('[Sync] Offline mode active. Cloud sync disabled.');
            return;
        }

        if (mode === 'hybrid') {
            this.isSyncing = true;
            try {
                await syncManager.sync();
            } finally {
                this.isSyncing = false;
            }
            return;
        }

        // cloud mode — data is already in Supabase, no local sync needed
        console.log('[Sync] Cloud mode — direct Supabase access, no local sync.');
    }

    public startAutoSync(intervalMs: number = 60000) {
        const mode = getMode();

        if (mode === 'hybrid') {
            syncManager.startAutoSync(intervalMs);
        } else {
            console.log(`[Sync] Auto-sync disabled in ${mode} mode.`);
        }
    }

    public stopAutoSync() {
        syncManager.stopAutoSync();
    }

    public getStatus() {
        return syncManager.getStatus();
    }
}

export const syncService = new SyncService();
