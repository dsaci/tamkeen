
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.client';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import { Loader2, AlertTriangle, LogOut, Database, XCircle } from 'lucide-react';

export default function AdminRoute() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Use state to track config error safely without early returns breaking hook order
  const [configError, setConfigError] = useState(!supabase);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkRole(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkRole(uid: string) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Role check error:', error);
      }

      // Check if role is admin
      if (data?.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      console.error('Role check exception:', e);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  // --- RENDER LOGIC ---
  
  // 1. Configuration Error View
  if (configError) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center font-['Cairo']">
         <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 animate-pulse">
            <Database size={40} className="text-rose-500" />
         </div>
         <h1 className="text-3xl font-black text-white mb-4">Configuration Error</h1>
         <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-lg">
            <div className="flex items-center gap-3 text-rose-400 font-bold mb-2 justify-center">
               <XCircle size={20} />
               <span>Supabase Not Initialized</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
               The application cannot connect to the database. Please verify that your 
               <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> environment variables are correctly set.
            </p>
         </div>
         <button 
           onClick={() => window.location.href = '/'}
           className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
         >
           Return to App
         </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  // If no session, show Login
  if (!session) {
    return <AdminLogin />;
  }

  // If session exists but NOT admin, show Access Denied
  if (!isAdmin) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center text-center p-6 font-['Cairo']">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
           <AlertTriangle size={40} className="text-rose-500" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 max-w-md mb-8">
          Your account ({session.user.email}) does not have administrator privileges.
        </p>
        <button 
          onClick={() => supabase?.auth.signOut()} 
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-slate-700"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    );
  }

  // Authorized
  return <AdminDashboard session={session} />;
}
