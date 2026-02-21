/**
 * Local Authentication Service
 * Handles user registration, login, and session management using sql.js + bcrypt
 */

import bcrypt from 'bcryptjs';
import { getDatabase, generateId, queryOne, queryAll, runStatement, saveDatabase } from '../database/db';
import Store from 'electron-store';

// Session store
const store = new Store<{ session: SessionData | null }>({
    name: 'tamkeen-session',
    defaults: { session: null }
});

export interface SessionData {
    userId: string;
    email: string;
    role: string;
    profile: any;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    metadata: any;
}

export interface LoginResult {
    success: boolean;
    error?: string;
    session?: SessionData;
}

export interface RegisterResult {
    success: boolean;
    error?: string;
    userId?: string;
    session?: SessionData;
}

/**
 * Register a new user
 */
export function register(data: RegisterData): RegisterResult {
    try {
        // 1. Validation (Strict)
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            return { success: false, error: 'البريد الإلكتروني غير صالح' };
        }

        const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
        if (data.metadata?.phone && !phoneRegex.test(data.metadata.phone)) {
            return { success: false, error: 'رقم الهاتف غير صالح (يجب أن يبدأ بـ 05, 06, أو 07)' };
        }

        // Check availability
        const existing = queryOne('SELECT id FROM profiles WHERE email = ?', [data.email]);
        if (existing) {
            return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
        }

        // 2. Security & ID Generation
        const passwordHash = bcrypt.hashSync(data.password, 10);
        const id = generateId(); // UUID
        const tamkeenId = data.metadata?.tamkeenId || id.substring(0, 8).toUpperCase();

        // Prepare metadata
        const metadata = {
            ...data.metadata,
            tamkeenId,
            email: data.email,
            role: 'teacher' // Default role
        };

        // 3. Atomic Local Save
        try {
            runStatement(`
                INSERT INTO profiles (id, email, password_hash, full_name, role, metadata)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [id, data.email, passwordHash, data.fullName, 'teacher', JSON.stringify(metadata)]);
        } catch (e: any) {
            console.error('[Auth] Profile INSERT error:', e);
            throw new Error(`فشل حفظ الملف الشخصي: ${e.message}`);
        }

        // 4. Hybrid Mode: Queue Cloud Sync
        try {
            runStatement(`
                INSERT INTO sync_queue (table_name, record_id, operation, payload, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, ['profiles', id, 'INSERT', JSON.stringify({
                id,
                email: data.email,
                full_name: data.fullName,
                role: 'teacher',
                metadata
            })]);
        } catch (e: any) {
            console.warn('[Auth] Sync queue error, attempting to fix table:', e);
            if (e.message && e.message.includes('no such table')) {
                runStatement(`
                    CREATE TABLE IF NOT EXISTS sync_queue (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      table_name TEXT NOT NULL,
                      record_id TEXT NOT NULL,
                      operation TEXT NOT NULL, 
                      payload TEXT, 
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                 `);
                // Retry
                runStatement(`
                    INSERT INTO sync_queue (table_name, record_id, operation, payload, created_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                `, ['profiles', id, 'INSERT', JSON.stringify({
                    id,
                    email: data.email,
                    full_name: data.fullName,
                    role: 'teacher',
                    metadata
                })]);
            }
        }

        // Create session
        const session: SessionData = {
            userId: id,
            email: data.email,
            role: 'teacher',
            profile: metadata
        };

        store.set('session', session);

        return {
            success: true,
            userId: id,
            session
        };
    } catch (error: any) {
        console.error('[Auth] Registration error:', error);
        return { success: false, error: error.message || 'فشل التسجيل' };
    }
}

/**
 * Handle Google Login (Hybrid Mode)
 * Persists Supabase user to local DB
 */
export function googleLogin(supabaseUser: any): LoginResult {
    try {
        const email = supabaseUser.email;
        if (!email) return { success: false, error: 'No email provided from Google' };

        // Check if user exists
        let user = queryOne('SELECT id, email, role, metadata FROM profiles WHERE email = ?', [email]);

        if (!user) {
            // Create new local profile for Google user
            const id = supabaseUser.id; // Use Supabase ID as Local ID for consistency? 
            // Actually, Supabase ID is UUID. Local ID is UUID. Perfect.

            const metadata = {
                email,
                name: supabaseUser.user_metadata?.full_name || 'Google User',
                picture: supabaseUser.user_metadata?.avatar_url,
                tamkeenId: id.substring(0, 8).toUpperCase(),
                source: 'google'
            };

            try {
                runStatement(`
                    INSERT INTO profiles (id, email, password_hash, full_name, role, metadata)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [id, email, 'oauth_google', metadata.name, 'teacher', JSON.stringify(metadata)]);

                // Sync Queue for Google User
                try {
                    runStatement(`
                        INSERT INTO sync_queue (table_name, record_id, operation, payload, created_at)
                        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                    `, ['profiles', id, 'INSERT', JSON.stringify({
                        id,
                        email,
                        full_name: metadata.name,
                        role: 'teacher',
                        metadata
                    })]);
                } catch (e: any) {
                    if (e.message && e.message.includes('no such table')) {
                        runStatement(`
                            CREATE TABLE IF NOT EXISTS sync_queue (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              table_name TEXT NOT NULL,
                              record_id TEXT NOT NULL,
                              operation TEXT NOT NULL, 
                              payload TEXT, 
                              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )
                         `);
                        runStatement(`
                            INSERT INTO sync_queue (table_name, record_id, operation, payload, created_at)
                            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                        `, ['profiles', id, 'INSERT', JSON.stringify({
                            id,
                            email,
                            full_name: metadata.name,
                            role: 'teacher',
                            metadata
                        })]);
                    }
                }

            } catch (e: any) {
                console.error('[Auth] Google Profile Insert Error:', e);
                // If unique constraint, maybe we should just select again?
                // But we already selected above.
                throw new Error(`Local DB Error: ${e.message}`);
            }

            user = { id, email, role: 'teacher', metadata: JSON.stringify(metadata) };
        }

        // Create session
        let profile = {};
        try {
            profile = typeof user.metadata === 'string' ? JSON.parse(user.metadata) : user.metadata;
        } catch { profile = {}; }

        const session: SessionData = {
            userId: user.id,
            email: user.email,
            role: user.role,
            profile
        };

        store.set('session', session);
        return { success: true, session };

    } catch (error: any) {
        console.error('[Auth] Google Login error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Login a user
 */
export function login(email: string, password: string): LoginResult {
    try {
        // Find user by email
        const user = queryOne(
            'SELECT id, email, password_hash, role, metadata FROM profiles WHERE email = ?',
            [email]
        );

        if (!user) {
            return { success: false, error: 'البريد الإلكتروني غير مسجل' };
        }

        // Verify password
        // If user is OAuth only (password_hash='oauth_google'), password login fails
        if (user.password_hash === 'oauth_google') {
            return { success: false, error: 'تم التسجيل عبر Google. يرجى استخدام زر الدخول عبر Google.' };
        }

        const isValid = bcrypt.compareSync(password, user.password_hash);
        if (!isValid) {
            return { success: false, error: 'كلمة المرور غير صحيحة' };
        }

        // Parse metadata
        let profile = {};
        try {
            profile = JSON.parse(user.metadata || '{}');
        } catch {
            profile = {};
        }

        // Create session
        const session: SessionData = {
            userId: user.id,
            email: user.email,
            role: user.role,
            profile
        };

        store.set('session', session);

        return { success: true, session };
    } catch (error: any) {
        console.error('[Auth] Login error:', error);
        return { success: false, error: error.message || 'فشل تسجيل الدخول' };
    }
}

/**
 * Logout current user
 */
export function logout(): void {
    store.set('session', null);
}

/**
 * Get current session
 */
export function getCurrentSession(): SessionData | null {
    return store.get('session', null);
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
    return getCurrentSession() !== null;
}

/**
 * Update user profile
 */
export function updateProfile(userId: string, metadata: any): boolean {
    try {
        runStatement(`
      UPDATE profiles 
      SET metadata = ?, full_name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [JSON.stringify(metadata), metadata.name || '', userId]);

        // Update session
        const session = getCurrentSession();
        if (session && session.userId === userId) {
            session.profile = metadata;
            store.set('session', session);
        }

        return true;
    } catch (error) {
        console.error('[Auth] Update profile error:', error);
        return false;
    }
}

/**
 * Get all users (admin only)
 */
export function getAllUsers(): any[] {
    const users = queryAll(`
    SELECT id, email, full_name, role, metadata, created_at 
    FROM profiles 
    ORDER BY created_at DESC
  `);

    return users.map((u: any) => ({
        ...u,
        metadata: u.metadata ? JSON.parse(u.metadata) : {}
    }));
}

/**
 * Check if user is admin
 */
export function isAdmin(userId: string): boolean {
    const user = queryOne('SELECT role FROM profiles WHERE id = ?', [userId]);
    return user?.role === 'admin';
}
