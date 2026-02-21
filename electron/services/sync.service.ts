import { queryAll, runStatement } from '../database/db';

export interface SyncItem {
    id: number;
    table_name: string;
    record_id: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE';
    payload: string;
    created_at: string;
}

/**
 * Get pending sync items
 */
export function getPendingSyncItems(): SyncItem[] {
    try {
        return queryAll('SELECT * FROM sync_queue ORDER BY created_at ASC LIMIT 50');
    } catch (error) {
        console.error('[Sync] Get pending items error:', error);
        return [];
    }
}

/**
 * Clear synced items
 */
export function removeSyncItems(ids: number[]): boolean {
    try {
        if (ids.length === 0) return true;
        const placeholders = ids.map(() => '?').join(',');
        runStatement(`DELETE FROM sync_queue WHERE id IN (${placeholders})`, ids);
        return true;
    } catch (error) {
        console.error('[Sync] Remove sync items error:', error);
        return false;
    }
}
