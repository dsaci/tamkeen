
import React, { useEffect, useState } from 'react';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import { Loader2, AlertTriangle, LogOut, ShieldAlert, ArrowLeft } from 'lucide-react';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

export default function AdminRoute() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!isElectron) {
        setLoading(false);
        return;
      }

      try {
        const sessionData = await window.electronAPI.auth.getSession();
        setSession(sessionData);

        if (sessionData?.userId) {
          const admin = await window.electronAPI.auth.isAdmin(sessionData.userId);
          setIsAdmin(admin);
        }
      } catch (e) {
        console.error("Admin auth init failed", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    if (isElectron) {
      await window.electronAPI.auth.logout();
      window.location.reload();
    }
  };

  // --- RENDER STATES ---

  // 1. Not running in Electron
  if (!isElectron) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white" dir="ltr">
        <ShieldAlert size={64} className="text-rose-500 mb-6" />
        <h1 className="text-3xl font-black mb-2">Desktop Required</h1>
        <p className="text-slate-400 mt-2 max-w-md text-lg">
          This application requires the Electron desktop environment.
        </p>
        <a href="/" className="mt-8 px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to App
        </a>
      </div>
    );
  }

  // 2. Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={50} />
        <p className="text-slate-400 font-bold animate-pulse">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // 3. Not Logged In
  if (!session) {
    return <AdminLogin />;
  }

  // 4. Logged In but Not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-6 font-sans">
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-8 border border-rose-500/20">
          <AlertTriangle size={48} className="text-rose-500" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">وصول مرفوض</h1>
        <p className="text-slate-400 max-w-lg mb-10 text-lg leading-relaxed">
          حسابك <strong>{session.email}</strong> لا يملك صلاحيات المدير.<br />
          يرجى التواصل مع الدعم التقني.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 px-8 py-4 rounded-2xl font-bold transition-all border border-slate-700"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    );
  }

  // 5. Success (Dashboard)
  return <AdminDashboard session={session} />;
}
