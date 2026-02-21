/**
 * DatabaseService Interface
 * Abstraction layer for database operations.
 * Implemented by LocalDatabaseService and SupabaseDatabaseService.
 */

export interface DatabaseService {
    /**
     * Create a new record in the specified table.
     * Returns the created record or null on failure.
     */
    create(table: string, data: Record<string, any>): Promise<any>;

    /**
     * Read records from a table, optionally filtered.
     */
    read(table: string, filters?: Record<string, any>): Promise<any[]>;

    /**
     * Read a single record by its ID.
     */
    readOne(table: string, id: string): Promise<any | null>;

    /**
     * Update a record by ID.
     * Returns true on success.
     */
    update(table: string, id: string, data: Record<string, any>): Promise<boolean>;

    /**
     * Delete a record by ID.
     * Returns true on success.
     */
    delete(table: string, id: string): Promise<boolean>;

    /**
     * Trigger a sync cycle (relevant for hybrid mode).
     * No-op for pure local or pure cloud implementations.
     */
    sync?(): Promise<void>;
}
