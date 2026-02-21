/**
 * LocalAuthService
 * Wraps existing Electron IPC auth calls to conform to the AuthService interface.
 * Zero behavior change from current code — pure adapter.
 */

import { AuthService, AuthResult, SessionInfo } from './AuthService';
import { TeacherProfile } from '../../types';

const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

export class LocalAuthService implements AuthService {
    async login(email: string, password: string): Promise<AuthResult> {
        if (!isElectron) {
            return { success: false, error: 'التطبيق يعمل فقط كبرنامج سطح المكتب' };
        }

        try {
            const result = await window.electronAPI.auth.login(email, password);

            if (!result.success) {
                return { success: false, error: result.error || 'فشل تسجيل الدخول' };
            }

            return {
                success: true,
                session: {
                    userId: result.session.userId,
                    email: result.session.email,
                    role: result.session.role || 'teacher',
                    profile: result.session.profile as TeacherProfile,
                },
            };
        } catch (error: any) {
            return { success: false, error: error.message || 'فشل تسجيل الدخول' };
        }
    }

    async signInWithGoogle(): Promise<AuthResult> {
        // 1. Check if Supabase client is available (Hybrid/Cloud mode)
        const { getSupabaseClient } = await import('../../config/supabaseClient');
        const client = getSupabaseClient();

        if (!client) {
            return { success: false, error: 'خدمة Google غير متوفرة في الوضع غير المتصل (Offline Mode)' };
        }

        try {
            // Safe redirect URL: fallback to localhost for Electron (file:// origins)
            const redirectUrl = window.location.origin.startsWith('http')
                ? window.location.origin
                : 'http://localhost:5173'; // Vite dev server fallback for Electron

            const { error } = await client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) return { success: false, error: error.message };

            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || 'Google Sign-In Failed' };
        }
    }

    async register(email: string, password: string, profile: TeacherProfile): Promise<AuthResult> {
        if (!isElectron) {
            return { success: false, error: 'التطبيق يعمل فقط كبرنامج سطح المكتب' };
        }

        try {
            const result = await window.electronAPI.auth.register({
                email,
                password,
                fullName: profile.name,
                metadata: profile,
            });

            if (!result.success) {
                return { success: false, error: result.error || 'فشل التسجيل' };
            }

            return {
                success: true,
                session: {
                    userId: result.session.userId,
                    email: result.session.email,
                    role: result.session.role || 'teacher',
                    profile: result.session.profile as TeacherProfile,
                },
            };
        } catch (error: any) {
            return { success: false, error: error.message || 'فشل التسجيل' };
        }
    }

    async logout(): Promise<void> {
        if (isElectron) {
            await window.electronAPI.auth.logout();
        }
    }

    async getSession(): Promise<SessionInfo | null> {
        if (!isElectron) return null;

        try {
            // 1. Try Local Session
            let sessionData = await window.electronAPI.auth.getSession();

            // 2. Hybrid Mode: If no local session, check Supabase (e.g. post-OAuth redirect)
            if (!sessionData) {
                const { getSupabaseClient } = await import('../../config/supabaseClient');
                const client = getSupabaseClient();
                if (client) {
                    const { data: { session } } = await client.auth.getSession();
                    if (session?.user) {
                        // Sync Supabase session to Local DB
                        const result = await window.electronAPI.auth.googleLogin(session.user);
                        if (result.success) {
                            sessionData = result.session;
                        }
                    }
                }
            }

            if (!sessionData) return null;

            return {
                userId: sessionData.userId,
                email: sessionData.email,
                role: sessionData.role || 'teacher',
                profile: sessionData.profile as TeacherProfile,
            };
        } catch {
            return null;
        }
    }

    async updateProfile(userId: string, profile: TeacherProfile): Promise<boolean> {
        if (!isElectron) return false;

        try {
            return await window.electronAPI.auth.updateProfile(userId, profile);
        } catch {
            return false;
        }
    }

    onAuthStateChange(_callback: (session: SessionInfo | null) => void): () => void {
        // Local auth has no real-time state changes (no tokens to refresh)
        // Return a no-op unsubscribe
        return () => { };
    }
}
