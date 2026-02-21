/**
 * SupabaseDatabaseService
 * Implements DatabaseService using the Supabase client.
 * Respects Row Level Security — all operations are scoped by the authenticated user.
 */

import { DatabaseService } from './DatabaseService';
import { getSupabaseClient } from '../../config/supabaseClient';

export class SupabaseDatabaseService implements DatabaseService {
    async create(table: string, data: Record<string, any>): Promise<any> {
        const client = getSupabaseClient();
        if (!client) {
            console.error('[SupabaseDB] Client not available.');
            return null;
        }

        try {
            const { data: result, error } = await client
                .from(table)
                .insert(data)
                .select()
                .single();

            if (error) {
                console.error(`[SupabaseDB] Create error (${table}):`, error.message);
                return null;
            }

            return result;
        } catch (error) {
            console.error(`[SupabaseDB] Create exception (${table}):`, error);
            return null;
        }
    }

    async read(table: string, filters?: Record<string, any>): Promise<any[]> {
        const client = getSupabaseClient();
        if (!client) return [];

        try {
            let query = client.from(table).select('*');

            if (filters) {
                for (const [key, value] of Object.entries(filters)) {
                    query = query.eq(key, value);
                }
            }

            const { data, error } = await query;

            if (error) {
                console.error(`[SupabaseDB] Read error (${table}):`, error.message);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error(`[SupabaseDB] Read exception (${table}):`, error);
            return [];
        }
    }

    async readOne(table: string, id: string): Promise<any | null> {
        const client = getSupabaseClient();
        if (!client) return null;

        try {
            const { data, error } = await client
                .from(table)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // No rows found
                console.error(`[SupabaseDB] ReadOne error (${table}):`, error.message);
                return null;
            }

            return data;
        } catch (error) {
            console.error(`[SupabaseDB] ReadOne exception (${table}):`, error);
            return null;
        }
    }

    async update(table: string, id: string, data: Record<string, any>): Promise<boolean> {
        const client = getSupabaseClient();
        if (!client) return false;

        try {
            const { error } = await client
                .from(table)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.error(`[SupabaseDB] Update error (${table}):`, error.message);
                return false;
            }

            return true;
        } catch (error) {
            console.error(`[SupabaseDB] Update exception (${table}):`, error);
            return false;
        }
    }

    async delete(table: string, id: string): Promise<boolean> {
        const client = getSupabaseClient();
        if (!client) return false;

        try {
            const { error } = await client
                .from(table)
                .delete()
                .eq('id', id);

            if (error) {
                console.error(`[SupabaseDB] Delete error (${table}):`, error.message);
                return false;
            }

            return true;
        } catch (error) {
            console.error(`[SupabaseDB] Delete exception (${table}):`, error);
            return false;
        }
    }
}
