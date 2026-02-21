/**
 * AuthService Interface
 * Abstraction for authentication operations.
 * Implemented by LocalAuthService and SupabaseAuthService.
 */

import { TeacherProfile } from '../../types';

export interface AuthResult {
    success: boolean;
    error?: string;
    session?: SessionInfo;
}

export interface SessionInfo {
    userId: string;
    email: string;
    role: string;
    profile: TeacherProfile | null;
}

export interface AuthService {
    /**
     * Login with email and password.
     */
    login(email: string, password: string): Promise<AuthResult>;

    /**
     * Sign in with Google (OAuth).
     */
    signInWithGoogle(): Promise<AuthResult>;

    /**
     * Register a new user with profile data.
     */
    register(email: string, password: string, profile: TeacherProfile): Promise<AuthResult>;

    /**
     * Logout the current user.
     */
    logout(): Promise<void>;

    /**
     * Get the current session (if logged in).
     */
    getSession(): Promise<SessionInfo | null>;

    /**
     * Update the user's profile.
     */
    updateProfile(userId: string, profile: TeacherProfile): Promise<boolean>;

    /**
     * Subscribe to auth state changes (e.g., token refresh, session expiry).
     * Returns an unsubscribe function.
     */
    onAuthStateChange(callback: (session: SessionInfo | null) => void): () => void;
}
