/**
 * LocalDatabaseService
 * Wraps existing Electron IPC database calls to conform to the DatabaseService interface.
 * Zero behavior change from existing code — this is a pure adapter.
 */

import { DatabaseService } from './DatabaseService';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

export class LocalDatabaseService implements DatabaseService {
    async create(table: string, data: Record<string, any>): Promise<any> {
        if (!isElectron) {
            console.warn('[LocalDB] Not running in Electron, cannot perform create.');
            return null;
        }

        try {
            const columns = Object.keys(data);
            const placeholders = columns.map(() => '?').join(', ');
            const values = Object.values(data);

            const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
            await window.electronAPI.db.query(sql, values);

            // Also queue for sync
            await this.queueSync(table, data.id || '', 'INSERT', data);

            return data;
        } catch (error) {
            console.error(`[LocalDB] Create error (${table}):`, error);
            return null;
        }
    }

    async read(table: string, filters?: Record<string, any>): Promise<any[]> {
        if (!isElectron) {
            console.warn('[LocalDB] Not running in Electron, cannot perform read.');
            return [];
        }

        try {
            let sql = `SELECT * FROM ${table}`;
            const params: any[] = [];

            if (filters && Object.keys(filters).length > 0) {
                const conditions = Object.entries(filters).map(([key, _]) => {
                    params.push(_);
                    return `${key} = ?`;
                });
                sql += ` WHERE ${conditions.join(' AND ')}`;
            }

            return await window.electronAPI.db.query(sql, params) || [];
        } catch (error) {
            console.error(`[LocalDB] Read error (${table}):`, error);
            return [];
        }
    }

    async readOne(table: string, id: string): Promise<any | null> {
        if (!isElectron) return null;

        try {
            const results = await window.electronAPI.db.query(
                `SELECT * FROM ${table} WHERE id = ? LIMIT 1`,
                [id]
            );
            return Array.isArray(results) && results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error(`[LocalDB] ReadOne error (${table}):`, error);
            return null;
        }
    }

    async update(table: string, id: string, data: Record<string, any>): Promise<boolean> {
        if (!isElectron) return false;

        try {
            const setClauses = Object.keys(data).map((key) => `${key} = ?`);
            const values = [...Object.values(data), id];

            const sql = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE id = ?`;
            await window.electronAPI.db.query(sql, values);

            // Queue for sync
            await this.queueSync(table, id, 'UPDATE', data);

            return true;
        } catch (error) {
            console.error(`[LocalDB] Update error (${table}):`, error);
            return false;
        }
    }

    async delete(table: string, id: string): Promise<boolean> {
        if (!isElectron) return false;

        try {
            await window.electronAPI.db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);

            // Queue for sync
            await this.queueSync(table, id, 'DELETE', { id });

            return true;
        } catch (error) {
            console.error(`[LocalDB] Delete error (${table}):`, error);
            return false;
        }
    }

    /**
     * Queue an operation for future sync.
     */
    private async queueSync(
        table: string,
        recordId: string,
        operation: 'INSERT' | 'UPDATE' | 'DELETE',
        payload: Record<string, any>
    ): Promise<void> {
        if (!isElectron) return;

        try {
            await window.electronAPI.db.query(
                `INSERT INTO sync_queue (table_name, record_id, operation, payload) VALUES (?, ?, ?, ?)`,
                [table, recordId, operation, JSON.stringify(payload)]
            );
        } catch (error) {
            // Non-critical — don't fail the main operation
            console.warn('[LocalDB] Failed to queue sync item:', error);
        }
    }
}
