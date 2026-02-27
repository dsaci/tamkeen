import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TeacherProfile } from '../types';
import { getAuthService } from '../services/auth/AuthServiceFactory';
import { SessionInfo } from '../services/auth/AuthService';
import { getMode, isSupabaseEnabled } from '../config/envValidation';
import { initializeSync, stopSync } from '../services/database/DatabaseServiceFactory';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  profile: TeacherProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, profile: TeacherProfile) => Promise<void>;
  updateProfile: (profile: TeacherProfile) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  syncData: () => Promise<void>;
  isConnected: boolean;
  mode: string;
  role: string;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, profile: null, loading: true,
  login: async () => { }, logout: async () => { }, register: async () => { },
  updateProfile: async () => { }, signInWithGoogle: async () => ({ success: false }), syncData: async () => { }, isConnected: false,
  mode: 'offline', role: 'teacher', isAdmin: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState(false);
  const [role, setRole] = useState('teacher');
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const loggingOutRef = useRef(false); // Prevents re-auth during logout

  const mode = getMode();
  const authService = getAuthService();

  // Apply session info to state
  const applySession = useCallback((sessionInfo: SessionInfo | null) => {
    if (sessionInfo) {
      setUser({ id: sessionInfo.userId, email: sessionInfo.email });
      setSession(sessionInfo);
      setProfile(sessionInfo.profile);
      setRole(sessionInfo.role || 'teacher');
      setIsConnected(isSupabaseEnabled());
    } else {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole('teacher');
      setIsConnected(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionInfo = await authService.getSession();
        applySession(sessionInfo);

        // Subscribe to auth state changes (for token refresh in cloud mode)
        unsubscribeRef.current = authService.onAuthStateChange((newSession) => {
          // Skip if we're in the middle of logging out
          if (loggingOutRef.current) {
            console.log('[Auth] Ignoring auth state change during logout');
            return;
          }
          applySession(newSession);
        });
      } catch (e) {
        console.error("[Auth] Init error:", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Initialize sync when user is authenticated in hybrid mode
  useEffect(() => {
    if (user && mode === 'hybrid') {
      initializeSync();
    }

    return () => {
      stopSync();
    };
  }, [user, mode]);

  const login = async (email: string, pass: string) => {
    loggingOutRef.current = false; // Reset the flag on login
    const result = await authService.login(email, pass);

    if (!result.success) {
      throw new Error(result.error || "فشل تسجيل الدخول");
    }

    applySession(result.session || null);
  };

  const logout = async () => {
    console.log('[Auth] Logout started');
    loggingOutRef.current = true; // Block onAuthStateChange from re-authenticating

    // Unsubscribe from auth state changes first
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    stopSync();

    // Clear state immediately
    applySession(null);

    // Sign out from Supabase
    try {
      await authService.logout();
    } catch (e) {
      console.error('[Auth] Logout error:', e);
    }

    // Force clear any Supabase session from localStorage
    const projectRef = (import.meta.env.VITE_SUPABASE_URL || '').split('//')[1]?.split('.')[0];
    if (projectRef) {
      localStorage.removeItem(`sb-${projectRef}-auth-token`);
    }

    console.log('[Auth] Logout complete');
  };

  const register = async (email: string, pass: string, teacherProfile: TeacherProfile) => {
    loggingOutRef.current = false;
    const result = await authService.register(email, pass, teacherProfile);

    if (!result.success) {
      throw new Error(result.error || "فشل التسجيل");
    }

    applySession(result.session || null);
  };

  const updateProfile = async (up: TeacherProfile) => {
    if (!user) throw new Error("لا يوجد مستخدم مسجل");

    const success = await authService.updateProfile(user.id, up);
    if (!success) {
      throw new Error("فشل تحديث الملف الشخصي");
    }

    setProfile(up);
  };

  const signInWithGoogle = async () => {
    loggingOutRef.current = false;
    const result = await authService.signInWithGoogle();
    if (!result.success) {
      throw new Error(result.error || "فشل تسجيل الدخول عبر Google");
    }
    return result; // Return the result so forms can check result.success
  };

  const syncData = async () => {
    if (mode === 'offline') {
      console.log("[Sync] Offline mode — no sync needed.");
      return;
    }
    // Sync is handled by SyncManager automatically in hybrid mode
    console.log("[Sync] Manual sync trigger — SyncManager handles this.");
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading, login, logout, register, updateProfile, signInWithGoogle, syncData,
      isConnected, mode, role, isAdmin: role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

