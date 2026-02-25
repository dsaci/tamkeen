
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, LogOut, Menu, X, BarChart3, UserCheck, BookOpenCheck,
  FileStack, Settings as SettingsIcon, Sun, Moon, Copy, Check, BookOpen,
  Calculator, FileEdit, Sparkles, QrCode, ShieldCheck, Wifi, Fingerprint, Database,
  CloudCheck, Shield, MessageSquare, Bell
} from 'lucide-react';
import { AdminNotificationBanner } from './components/AdminNotificationBanner';
import { useAuth } from './contexts/AuthContext';
import { useNotifications } from './contexts/NotificationContext';
import { AuthPage } from './features/auth/pages/AuthPage';
import { ProfileCompletionForm } from './features/auth/components/ProfileCompletionForm';
import { JournalPage } from './features/journal/pages/JournalPage';
import PlansView from './lib/views/Plans';
import SettingsView from './lib/views/Settings';
import AbsenceView from './lib/views/Absence';
import { syncService } from './services/SyncService';
import ResourcesView from './lib/views/Resources';
import DashboardView from './lib/views/Dashboard';
import GradingView from './lib/views/Grading';
import SmartMemoView from './lib/views/SmartMemo';
import IntroHub from './lib/views/IntroHub';
import LandingPage from './lib/views/LandingPage';
import RepositoryConfig from './lib/views/RepositoryConfig'; // New Repository View
import InspirationBanner from './legacy_components/InspirationBanner';
import LoadingScreen from './legacy_components/LoadingScreen';
import { AdminPanel } from './features/admin/AdminPanel';
import { MessagesPanel } from './features/messages/MessagesPanel';
import { TeacherProfile, AppLanguage, TabType } from './types';
// import AdminRoute from './legacy_components/admin_route'; // TODO: Fix AdminRoute later
import { TamkeenLogo } from './legacy_components/TamkeenLogo';
import { cn } from './lib/utils';

const preloadFonts = () => import('./lib/utils/fontLoader').then(m => m.initFont()).catch(e => console.log('Font preload:', e));

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

export const translations: Record<string, any> = {
  ar: {
    title: "الكراس اليومي الرقمي الموحد",
    dashboard: "الإحصائيات والنتائج",
    journal: "الكراس اليومي",
    grading: "كراس التنقيط",
    memo: "المذكرة الذكية",
    absence: "رصد الغياب",
    resources: "بنك الموارد الشامل",
    annual: "المخططات السنوية",
    settings: "إعدادات المنصة",
    database: "قاعدة البيانات",
    admin: "لوحة الإدارة",
    messages: "الرسائل",
    logout: "تسجيل الخروج",
    refreshKey: "تحديث مفتاح API",
    confirmLogout: "تأكيد الخروج",
    safeLogoutMsg: "أستاذي/أستاذتي، تم حفظ عملك(ِ) بأمان في قاعدة بيانات تمكين المحلية.",
    export: "تصدير المستندات",
    exportCover: "الغلاف الرسمي",
    exportJournal: "الكراس اليومي",
    exportEnd: "خاتمة الكراس",
    exportCard: "بطاقة المعلومات"
  },
  en: {
    title: "Tamkeen Digital Journal",
    dashboard: "Dashboard",
    journal: "Daily Journal",
    grading: "Grading Book",
    memo: "Smart Memo",
    absence: "Attendance",
    resources: "Comprehensive Resources",
    annual: "Annual Plans",
    settings: "Settings",
    database: "Database",
    admin: "Admin Panel",
    messages: "Messages",
    logout: "Logout",
    refreshKey: "Refresh API Key",
    confirmLogout: "Confirm Logout",
    safeLogoutMsg: "Teacher, your work has been safely saved in the local database.",
    export: "Export Documents",
    exportCover: "Official Cover",
    exportJournal: "Daily Journal",
    exportEnd: "Journal Conclusion",
    exportCard: "Info Card"
  }
};

const App: React.FC = () => {
  const auth = useAuth();
  const { unreadCount, lastError } = useNotifications();
  const [activeTab, setActiveTab] = useState<TabType>('hub');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState<AppLanguage>('ar');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('dark_mode') === 'true';
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const profile = auth.profile;

  const setTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    preloadFonts();
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    // Start Sync Service
    syncService.startAutoSync();

    if (profile && !sessionStorage.getItem('welcome_shown')) {
      setShowWelcomeModal(true);
      sessionStorage.setItem('welcome_shown', 'true');
    }
  }, [profile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark_mode', darkMode.toString());
  }, [darkMode]);

  // if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
  //   return <AdminRoute />;
  // }

  const copyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile?.tamkeenId) {
      navigator.clipboard.writeText(profile.tamkeenId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('tamkeen_registration_draft_v1');
    localStorage.removeItem('hasRegistered');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('registrationLocked');
    localStorage.removeItem('firstAccountCreated');

    await auth.logout();

    setTab('hub');
    setShowLogoutModal(false);
    sessionStorage.removeItem('welcome_shown');
    setShowLanding(false); // Go directly to auth page, not landing
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  if (auth.loading) {
    return <LoadingScreen />;
  }

  if (!profile && showLanding) {
    return (
      <LandingPage
        onEnter={() => setShowLanding(false)}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  if (!profile) {
    return (
      <AuthPage />
    );
  }

  // Check for incomplete profiles (e.g. Google OAuth users)
  // We check for mandatory fields like institution and level
  const isIncomplete = !profile.institution || !profile.level;

  if (isIncomplete && !auth.isAdmin) {
    return (
      <ProfileCompletionForm
        initialProfile={profile}
        onComplete={auth.updateProfile}
      />
    );
  }

  if (activeTab === 'hub') {
    return (
      <IntroHub
        profile={profile}
        onNavigate={setTab}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onLogout={() => setShowLogoutModal(true)}
        isAdmin={auth.isAdmin}
      />
    );
  }

  const t = translations[lang] || translations['ar'];

  return (
    <>
      <AdminNotificationBanner />
      <div className={cn(
        "min-h-screen transition-all duration-700 font-[Cairo] flex flex-row overflow-hidden",
        lang === 'ar' ? 'rtl' : 'ltr',
        darkMode ? "dark bg-slate-950" : "bg-slate-50"
      )}>
        <aside className={`bg-[#ffffff] dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 w-80 fixed inset-y-0 ${lang === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} z-50 transition-transform lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')} shadow-2xl lg:shadow-none no-print flex flex-col`}>
          <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col items-center">
            <div onClick={() => setTab('hub')} className="cursor-pointer hover:scale-105 transition-transform" title="العودة للرئيسية">
              <TamkeenLogo size={45} className="mb-6" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white mb-1">تمكين <span className="text-emerald-600 italic">PRO</span></h1>
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest mb-8 opacity-90 text-center">الكراس اليومي الرقمي الموحد</p>

            <div
              className="w-full bg-emerald-50/50 dark:bg-slate-800/40 rounded-[2.5rem] p-6 border border-emerald-100 dark:border-slate-700 flex flex-col items-center group relative cursor-pointer transition-all active:scale-95 shadow-sm hover:shadow-md hover:border-emerald-300"
              onClick={() => setShowIdCard(true)}
            >
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3">هوية العبور الرقمي</p>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black font-mono tracking-widest text-slate-900 dark:text-white truncate max-w-[120px]">
                  {profile.tamkeenId}
                </span>
                <button onClick={copyId} className="p-2 bg-emerald-600 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-700">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-bold group-hover:text-emerald-600 transition-colors">اضغط للعرض والتحقق</p>
            </div>
          </div>

          <nav className="p-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {[
              { id: 'journal', label: t.journal, icon: LayoutDashboard },
              { id: 'memo', label: t.memo, icon: FileEdit },
              { id: 'grading', label: t.grading, icon: Calculator },
              { id: 'absence', label: t.absence, icon: UserCheck },
              { id: 'resources', label: t.resources, icon: BookOpenCheck },
              ...(auth.isAdmin ? [
                { id: 'database', label: t.database, icon: Database },
                { id: 'admin', label: t.admin, icon: Shield },
              ] : []),
              { id: 'messages', label: t.messages, icon: MessageSquare },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id as TabType); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-[2rem] transition-all duration-300 group ${activeTab === item.id ? 'bg-emerald-800 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'}`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'} />
                <span className="font-black text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-8 border-t border-slate-50 dark:border-slate-800">
            <button onClick={() => setTab('settings')} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl mb-2 transition-all ${activeTab === 'settings' ? 'text-emerald-600 font-black' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
              <SettingsIcon size={18} />
              <span className="font-bold text-sm">{t.settings}</span>
            </button>
            <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
              <LogOut size={18} />
              <span className="font-bold text-sm">{t.logout}</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className="h-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-12 no-print transition-colors z-30 shadow-sm">
            <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t[activeTab]}</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 italic">نظام إدارة الكراس اليومي المتكامل</p>
                </div>
                {/* Offline mode - no cloud connection indicator */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group mr-2">
                <button
                  onClick={() => setTab('messages')}
                  className={cn(
                    "p-3 rounded-2xl border transition-all shadow-sm relative group/bell overflow-visible",
                    unreadCount > 0
                      ? "bg-rose-50 border-rose-300 text-rose-600 shadow-lg ring-2 ring-rose-500/20"
                      : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                  )}
                >
                  {/* Aggressive Ping Effect behind the bell */}
                  {unreadCount > 0 && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-40"></span>
                    </span>
                  )}

                  {/* Pulsing Background Glow */}
                  {unreadCount > 0 && (
                    <div className="absolute inset-0 bg-rose-500/10 animate-pulse rounded-2xl"></div>
                  )}

                  <Bell
                    size={22}
                    className={cn(
                      "relative z-10 transition-transform duration-300 group-hover/bell:scale-110",
                      unreadCount > 0 ? "animate-bounce" : ""
                    )}
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-red-600 text-white text-[12px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xl z-20 animate-pulse px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold whitespace-nowrap z-50">
                  {unreadCount > 0 ? `لديك ${unreadCount} رسائل جديدة` : 'لا توجد تنبيهات'}
                </div>
              </div>

              <button onClick={toggleLanguage} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all shadow-sm font-black text-xs">
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 rounded-2xl border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all shadow-sm">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className={`hidden md:flex flex-col items-end ${lang === 'ar' ? 'mr-6 border-r pr-6' : 'ml-6 border-l pl-6'} border-slate-100 dark:border-slate-800 ${lang === 'ar' ? 'pl-4' : 'pr-4'}`}>
                <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{profile.name}</p>
                <p className="text-[10px] font-black text-emerald-600 mt-2">{profile.institution}</p>
              </div>
            </div>
          </header>

          <InspirationBanner />

          <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f8fafc] dark:bg-slate-950 transition-colors custom-scrollbar relative">
            <div className="max-w-7xl mx-auto space-y-8 pb-32">
              {activeTab === 'dashboard' && <DashboardView profile={profile} />}
              {activeTab === 'journal' && <JournalPage />}
              {activeTab === 'memo' && <SmartMemoView profile={profile} />}
              {activeTab === 'grading' && <GradingView profile={profile} />}
              {activeTab === 'absence' && <AbsenceView profile={profile} lang={lang} />}
              {activeTab === 'resources' && <ResourcesView profile={profile} lang={lang} />}
              {activeTab === 'annual' && <PlansView profile={profile} lang={lang} type="annual" />}
              {activeTab === 'settings' && <SettingsView profile={profile} onUpdate={(p) => auth.updateProfile(p)} darkMode={darkMode} setDarkMode={setDarkMode} />}
              {activeTab === 'admin' && <AdminPanel />}
              {activeTab === 'messages' && <MessagesPanel />}
              {activeTab === 'database' && (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                      <Database size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">قاعدة البيانات</h2>
                      <p className="text-xs text-slate-500">عرض مباشر للبيانات المحلية (SQLite)</p>
                    </div>
                  </div>
                  <RepositoryConfig />
                </div>
              )}
            </div>
          </main>
        </div>

        {showWelcomeModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3.5rem] p-10 text-center shadow-2xl border-4 border-emerald-500/20 relative overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10 animate-bounce">
                <Sparkles size={40} className="fill-emerald-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                مرحباً بأستاذنا <span className="text-emerald-600">العبقري!</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-bold mb-8 leading-relaxed">
                نمكّن لك من التكنولوجيا والرقمنة الجبّارة لتصنع مستقبلاً مشرقاً لتلاميذك.
              </p>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all"
              >
                انطلق في رحلة الإبداع
              </button>
            </div>
          </div>
        )}

        {/* System Status Monitor usage extracted below */}

        {showIdCard && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
              <button
                onClick={() => setShowIdCard(false)}
                className="absolute top-4 left-4 p-2 bg-black/20 text-white hover:bg-black/40 rounded-full z-20 transition-all"
              >
                <X size={20} />
              </button>
              <div className="h-32 bg-gradient-to-br from-emerald-600 to-teal-800 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute -bottom-10 right-0 left-0 flex justify-center">
                  <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full p-2 shadow-lg">
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl font-black text-emerald-600 border border-emerald-100 dark:border-slate-700">
                      {profile.name.charAt(0)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-14 pb-8 px-8 text-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{profile.name}</h3>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">{profile.institution} • {profile.wilaya || profile.province}</p>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 mb-6 relative overflow-hidden group">
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-black">
                    <Wifi size={10} />
                    متصل بالوزارة
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <QrCode size={80} className="text-slate-800 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">المعرف الرقمي الموحد</p>
                      <p className="text-xl font-mono font-black text-emerald-600 tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1 rounded-lg select-all">
                        {profile.tamkeenId}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-right p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                    <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-sm">التوثيق الرسمي</h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">
                        تُستخدم هذه الهوية لتوثيق المستندات المطبوعة وربط حسابك آلياً مع منصات وزارة التربية دون الحاجة لإعادة التسجيل.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-right p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                    <Fingerprint className="text-indigo-600 shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-400 text-sm">البصمة الرقمية</h4>
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed">
                        حماية حقوقك الفكرية في التحضيرات والمذكرات التي تشاركها عبر بنك الموارد.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-rose-100 dark:border-rose-900/30">
                <LogOut size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">تأكيد الخروج</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-10 leading-relaxed px-4">
                أستاذي/أستاذتي، بياناتك محفوظة محلياً. يمكنك العودة باستخدام معرفك الرقمي <span className="text-emerald-600 font-black">({profile.tamkeenId})</span>.
              </p>
              <div className="flex flex-col gap-3 px-6">
                <button onClick={handleLogout} className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-rose-700 active:scale-95 transition-all">نعم، تسجيل الخروج</button>
                <button onClick={() => setShowLogoutModal(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SystemStatusMonitor auth={auth} unreadCount={unreadCount} lastError={lastError} />
    </>
  );
};

const SystemStatusMonitor: React.FC<{ auth: any, unreadCount: number, lastError: string | null }> = ({ auth, unreadCount, lastError }) => (
  <div className="fixed bottom-4 left-4 z-[9999] pointer-events-none overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 rounded-3xl no-print">
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 shadow-2xl flex flex-col gap-2 pointer-events-auto min-w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={14} className="text-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">مراقب نظام تمكين</span>
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-500">Connection:</span>
        <span className={cn(
          "px-2 py-0.5 rounded-full",
          auth.isConnected ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
        )}>
          {auth.isConnected ? 'Connected' : 'Offline'}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-500">Mode:</span>
        <span className="text-slate-800 dark:text-slate-200 uppercase">{auth.mode}</span>
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
        <span className="text-slate-500">Notifs Cache:</span>
        <span className={cn(
          "font-mono",
          unreadCount > 0 ? "text-rose-600 animate-bounce" : "text-slate-400"
        )}>
          {unreadCount}
        </span>
      </div>

      {lastError && (
        <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-lg">
          <p className="text-[9px] font-black text-rose-600 uppercase mb-1">🔍 خطأ في المزامنة</p>
          <p className="text-[10px] text-rose-700 dark:text-rose-400 font-bold leading-tight break-words">
            {lastError}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default App;
