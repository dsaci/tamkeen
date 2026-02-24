/**
 * SupabaseAuthService
 * Implements AuthService using Supabase Auth.
 * - Registration: creates Auth user + profiles row with role
 * - Login: maps Supabase session to internal SessionInfo with role
 * - Logout: signs out + clears state
 * - Auto token refresh via onAuthStateChange
 */

import { AuthService, AuthResult, SessionInfo } from './AuthService';
import { TeacherProfile } from '../../types';
import { getSupabaseClient } from '../../config/supabaseClient';

export class SupabaseAuthService implements AuthService {
    async login(email: string, password: string): Promise<AuthResult> {
        const client = getSupabaseClient();
        if (!client) return { success: false, error: 'Supabase client not available.' };

        try {
            const { data, error } = await client.auth.signInWithPassword({ email, password });
            if (error) return { success: false, error: error.message };
            if (!data.user || !data.session) return { success: false, error: 'فشل تسجيل الدخول — لم يتم إرجاع جلسة.' };

            const profile = await this.fetchProfile(data.user.id);
            const role = profile?.role || data.user.user_metadata?.role || 'teacher';

            return {
                success: true,
                session: {
                    userId: data.user.id,
                    email: data.user.email || email,
                    role,
                    profile: profile?.teacherProfile || null,
                },
            };
        } catch (error: any) {
            return { success: false, error: error.message || 'فشل تسجيل الدخول' };
        }
    }

    async signInWithGoogle(): Promise<AuthResult> {
        const client = getSupabaseClient();
        if (!client) return { success: false, error: 'Supabase client not available.' };

        try {
            const origin = window.location.origin.startsWith('http')
                ? window.location.origin
                : 'http://localhost:5173';
            const redirectUrl = `${origin}/auth/callback`;

            const { data, error } = await client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                console.error('[SupabaseAuth] Google login error:', error.message);
                return { success: false, error: error.message };
            }

            console.log('[SupabaseAuth] Google OAuth initiated, redirecting...', data);
            // OAuth redirects away. Session is handled on callback via onAuthStateChange.
            return { success: true };
        } catch (error: any) {
            console.error('[SupabaseAuth] Google Sign-In Failed:', error);
            return { success: false, error: error.message || 'Google Sign-In Failed' };
        }
    }

    async register(email: string, password: string, profile: TeacherProfile): Promise<AuthResult> {
        const client = getSupabaseClient();
        if (!client) return { success: false, error: 'Supabase client not available.' };

        try {
            // 1. Generate tamkeenId if missing
            const tempId = crypto.randomUUID().substring(0, 8).toUpperCase();
            const finalTamkeenId = profile.tamkeenId || tempId;

            const fullProfile = {
                ...profile,
                tamkeenId: finalTamkeenId,
                email
            };

            // 2. SignUp (creates auth user only — NO trigger dependency)
            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: profile.name,
                        role: 'teacher',
                    },
                },
            });

            if (error) return { success: false, error: error.message };
            if (!data.user) return { success: false, error: 'فشل التسجيل — لم يتم إنشاء المستخدم.' };

            // 3. Explicitly create the profiles row (no trigger needed)
            try {
                const { error: profileError } = await client
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        email: email,
                        full_name: profile.name || '',
                        role: 'teacher',
                        metadata: fullProfile,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'id' });

                if (profileError) {
                    console.error('[SupabaseAuth] Profile creation error (non-fatal):', profileError.message);
                    // Don't fail the registration — profile can be created later via ensureProfileExists
                }
            } catch (profileErr) {
                console.error('[SupabaseAuth] Profile creation exception (non-fatal):', profileErr);
            }

            // 4. Return success
            return {
                success: true,
                session: {
                    userId: data.user.id,
                    email: data.user.email || email,
                    role: 'teacher',
                    profile: fullProfile,
                },
            };
        } catch (error: any) {
            return { success: false, error: error.message || 'فشل التسجيل' };
        }
    }

    async logout(): Promise<void> {
        const client = getSupabaseClient();
        if (!client) return;
        try {
            await client.auth.signOut();
        } catch (error) {
            console.error('[SupabaseAuth] Logout error:', error);
        }
    }

    async getSession(): Promise<SessionInfo | null> {
        const client = getSupabaseClient();
        if (!client) return null;

        try {
            const { data: { session } } = await client.auth.getSession();
            if (!session || !session.user) return null;

            // Ensure profile exists (handles Google OAuth users who have no profile yet)
            let profileData = await this.fetchProfile(session.user.id);
            if (!profileData) {
                await this.ensureProfileExists(session.user);
                profileData = await this.fetchProfile(session.user.id);
            }

            const role = profileData?.role || session.user.user_metadata?.role || 'teacher';

            return {
                userId: session.user.id,
                email: session.user.email || '',
                role,
                profile: profileData?.teacherProfile || null,
            };
        } catch {
            return null;
        }
    }

    async updateProfile(userId: string, profile: TeacherProfile): Promise<boolean> {
        const client = getSupabaseClient();
        if (!client) return false;

        try {
            const { error } = await client
                .from('profiles')
                .update({
                    metadata: profile,
                    full_name: profile.name || '',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) {
                console.error('[SupabaseAuth] Update profile error:', error.message);
                return false;
            }
            return true;
        } catch {
            return false;
        }
    }

    onAuthStateChange(callback: (session: SessionInfo | null) => void): () => void {
        const client = getSupabaseClient();
        if (!client) return () => { };

        const { data: { subscription } } = client.auth.onAuthStateChange(
            async (event, session) => {
                console.log(`[SupabaseAuth] Auth state changed: ${event}`, session?.user?.email);

                // Handle sign out
                if (event === 'SIGNED_OUT') {
                    console.log('[SupabaseAuth] User signed out');
                    callback(null);
                    return;
                }

                // Handle all session-bearing events uniformly:
                // INITIAL_SESSION — fires first on page load (including after OAuth redirect)
                // SIGNED_IN — fires when user signs in (OAuth callback, password login)
                // TOKEN_REFRESHED — fires when session token is refreshed
                if (session?.user) {
                    let profileData = await this.fetchProfile(session.user.id);

                    // If no profile exists, create one (Google OAuth users don't have a trigger)
                    if (!profileData) {
                        console.log(`[SupabaseAuth] No profile for ${session.user.email} on event=${event}, creating...`);
                        await this.ensureProfileExists(session.user);
                        profileData = await this.fetchProfile(session.user.id);
                    }

                    const role = profileData?.role || session.user.user_metadata?.role || 'teacher';
                    callback({
                        userId: session.user.id,
                        email: session.user.email || '',
                        role,
                        profile: profileData?.teacherProfile || null,
                    });
                } else {
                    callback(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }

    // ---- Private helpers ----

    /**
     * Upserts a profiles row in Supabase for users who don't have one.
     * Critical for Google OAuth users — the auth trigger only fires for email/password signups.
     */
    private async ensureProfileExists(user: any): Promise<void> {
        const client = getSupabaseClient();
        if (!client) return;

        try {
            const fullName = user.user_metadata?.full_name
                || user.user_metadata?.name
                || user.email?.split('@')[0]
                || 'Google User';

            const tamkeenId = user.id.substring(0, 8).toUpperCase();

            const metadata = {
                email: user.email,
                name: fullName,
                tamkeenId,
                picture: user.user_metadata?.avatar_url || null,
                source: user.app_metadata?.provider || 'google',
            };

            const { error } = await client
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    full_name: fullName,
                    role: 'teacher',
                    metadata,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' })
                .select()
                .single();

            if (error) {
                console.error('[SupabaseAuth] ensureProfileExists error:', error.message);
            } else {
                console.log('[SupabaseAuth] Profile ensured for:', user.email);
            }
        } catch (err) {
            console.error('[SupabaseAuth] ensureProfileExists exception:', err);
        }
    }

    private async fetchProfile(userId: string): Promise<{ role: string; teacherProfile: TeacherProfile | null } | null> {
        const client = getSupabaseClient();
        if (!client) return null;

        try {
            const { data, error } = await client
                .from('profiles')
                .select('role, metadata')
                .eq('id', userId)
                .single();

            console.log('[SupabaseAuth] fetchProfile result:', { userId, data, error });

            if (error || !data) return null;

            const teacherProfile = typeof data.metadata === 'string'
                ? JSON.parse(data.metadata)
                : data.metadata;

            return {
                role: data.role || 'teacher',
                teacherProfile: teacherProfile as TeacherProfile || null,
            };
        } catch {
            return null;
        }
    }
}
