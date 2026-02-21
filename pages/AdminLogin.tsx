
import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isElectron) {
      setError("التطبيق يعمل فقط كبرنامج سطح المكتب");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.auth.login(email, password);

      if (!result.success) {
        throw new Error(result.error || 'فشل تسجيل الدخول');
      }

      // Refresh to trigger auth state check
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. تحقق من المعلومات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden" dir="ltr">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-8 left-8 z-10">
        <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700">
          <ArrowLeft size={16} /> Back to App
        </a>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/30 shadow-lg shadow-emerald-900/20">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Secure Local Access</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="email"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium"
                placeholder="admin@tamkeen.local"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="password"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-slate-700/30 rounded-2xl border border-slate-600 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Default admin: <span className="text-emerald-400">admin@tamkeen.local</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
