
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, LogOut, Menu, X, BarChart3, UserCheck, BookOpenCheck,
  FileStack, Settings as SettingsIcon, Sun, Moon, Copy, Check, BookOpen,
  Calculator, FileEdit, Sparkles, QrCode, ShieldCheck, Wifi, Fingerprint, Database,
  CloudCheck, Shield, MessageSquare, Bell, Users, UserCog, HeartHandshake, HelpCircle, Heart, Calendar,
  ChevronDown, ChevronUp, Layers, PenLine, Monitor, Library, Zap, Compass, Home, CreditCard
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
import { useVisitorCount } from './services/visitorService';
import ResourceBankView from './lib/views/ResourceBankView';
import AdminResourceManager from './features/admin/AdminResourceManager';
import DashboardView from './lib/views/Dashboard';
import GradingView from './lib/views/Grading';
import SmartMemoView from './lib/views/SmartMemo';
import IntroHub from './lib/views/IntroHub';
import LandingPage from './lib/views/LandingPage';
import { DonationBanner } from './components/DonationBanner';
import { DonationModal } from './components/DonationModal';
import { ExportDonationToast } from './components/ExportDonationToast';
import RepositoryConfig from './lib/views/RepositoryConfig'; // New Repository View
import AboutPage from './lib/views/AboutPage';
import BlogPage from './lib/views/BlogPage';
import FAQPage from './lib/views/FAQPage';
import TimetableDashboard from './lib/views/TimetableDashboard';
import Copilot from './lib/views/Copilot';
import ExamGenerator from './lib/views/generators/ExamGenerator';
import WorksheetGenerator from './lib/views/generators/WorksheetGenerator';
import PresentationStepper from './lib/views/generators/PresentationStepper';
import WhiteboardView from './lib/views/WhiteboardView';
import NewTeacherKit from './lib/views/NewTeacherKit';
import { QRCodeCanvas } from 'qrcode.react';
import InspirationBanner from './legacy_components/InspirationBanner';
import LoadingScreen from './legacy_components/LoadingScreen';
import { AdminPanel } from './features/admin/AdminPanel';
import { MessagesPanel } from './features/messages/MessagesPanel';
import { TeacherProfile, AppLanguage, TabType } from './types';
// import AdminRoute from './legacy_components/admin_route'; // TODO: Fix AdminRoute later
import { TamkeenLogo } from './legacy_components/TamkeenLogo';
import { cn } from './lib/utils';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

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
    timetable: "جداول التوقيت",
    journal: "الكراس اليومي",
    grading: "كراس التنقيط",
    memo: "المذكرة الذكية",
    absence: "رصد الغياب",
    resources: "بنك الموارد الشامل",
    annual: "المخططات السنوية",
    settings: "إعدادات المنصة",
    database: "قاعدة البيانات",
    admin: "لوحة تحكم المسؤول",
    'exam-generator': "مولد الاختبارات والتقويمات",
    'worksheet-generator': "مولد أوراق العمل (الوضعيات)",
    'presentation-stepper': "صانع العروض التقديمية",
    copilot: "المساعد الذكي (Copilot)",
    messages: "الرسائل",
    logout: "تسجيل الخروج",
    refreshKey: "تحديث مفتاح API",
    confirmLogout: "تأكيد الخروج",
    safeLogoutMsg: "أستاذي/أستاذتي، تم حفظ عملك(ِ) بأمان في قاعدة بيانات تمكين المحلية.",
    export: "تصدير المستندات",
    exportCover: "الغلاف الرسمي",
    exportJournal: "الكراس اليومي",
    exportEnd: "خاتمة الكراس",
    exportCard: "بطاقة المعلومات",
    blog: "المدونة التربوية",
    faq: "الأسئلة الشائعة",
    about: "من نحن"
  },
  en: {
    title: "Tamkeen Digital Journal",
    dashboard: "Dashboard",
    timetable: "Timetables",
    journal: "Daily Journal",
    grading: "Grading Book",
    memo: "Smart Memo",
    absence: "Attendance",
    resources: "Comprehensive Resources",
    annual: "Annual Plans",
    settings: "Settings",
    database: "Database",
    admin: "Admin Panel",
    'exam-generator': "Exam Generator",
    'worksheet-generator': "Worksheet Generator",
    'presentation-stepper': "Presentation Maker",
    copilot: "Smart Copilot",
    messages: "Messages",
    logout: "Logout",
    refreshKey: "Refresh API Key",
    confirmLogout: "Confirm Logout",
    safeLogoutMsg: "Teacher, your work has been safely saved in the local database.",
    export: "Export Documents",
    exportCover: "Official Cover",
    exportJournal: "Daily Journal",
    exportEnd: "Journal Conclusion",
    exportCard: "Info Card",
    talamidh: "Students Management",
    asatida: "Teachers",
    wali: "Parents",
    blog: "Educational Blog",
    faq: "FAQ",
    about: "About Us"
  }
};

const App: React.FC = () => {
  const auth = useAuth();
  const { count: visitorCount } = useVisitorCount(true);
  const { unreadCount, lastError } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const profile = auth.profile;

  const getActiveTabKey = () => {
    const path = location.pathname;
    if (path === '/') return 'hub';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/korras-yawmi') return 'journal';
    if (path === '/grading') return 'grading';
    if (path === '/absence') return 'absence';
    if (path === '/timetable') return 'timetable';
    if (path === '/copilot') return 'copilot';
    if (path === '/exam-generator') return 'exam-generator';
    if (path === '/worksheet-generator') return 'worksheet-generator';
    if (path === '/presentation-stepper') return 'presentation-stepper';
    if (path === '/whiteboard') return 'whiteboard';
    if (path === '/new-teacher') return 'new-teacher';
    if (path === '/resources') return 'resources';
    if (path === '/annual') return 'annual';
    if (path === '/settings') return 'settings';
    if (path === '/mothakira-thakiya') return 'memo';
    if (path === '/database') return 'database';
    if (path === '/admin') return 'admin';
    if (path === '/messages') return 'messages';
    if (path === '/blog') return 'blog';
    if (path === '/faq') return 'faq';
    if (path === '/about') return 'about';
    return 'hub'; // fallback
  };
  const activeTab = getActiveTabKey();

  const setTab = (path: string) => {
    navigate(path);
  };

  const handleNavigation = (path: string) => {
    setTab(path);
    if (window.innerWidth < 1024) setSidebarOpen(false);
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

  // Handle Magic Link Callback (Implicit Flow)
  useEffect(() => {
    // If we land on the dedicated auth callback route, Supabase's AuthContext 
    // will auto-parse the #access_token hash. We just need to redirect to root
    // after a short delay to ensure the session is saved.
    const path = window.location.pathname;
    const errorStr = new URLSearchParams(window.location.search).get('error_description');

    if (errorStr) {
      console.error('[Auth] Supabase returned an error in URL:', errorStr);
    }

    if (path.includes('/auth/callback')) {
      // Just clean the URL visually so the user doesn't see the long token.
      // Do NOT use window.location.href = '/' as it will force a page reload
      // and abort the Supabase session save process.
      setTimeout(() => {
        window.history.replaceState(null, '', '/');
      }, 500);
    }
  }, []);

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

  if (showLanding) {
    return (
      <LandingPage
        onEnter={() => setShowLanding(false)}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        isLoggedIn={!!profile}
        teacherName={profile?.name}
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
        onNavigate={handleNavigation}
        onGoToLanding={() => setShowLanding(true)}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onLogout={handleLogout}
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
        <aside className={`bg-[#ffffff] dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 w-72 fixed inset-y-0 ${lang === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} z-50 transition-transform lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')} shadow-2xl lg:shadow-none no-print flex flex-col`}>
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shrink-0"></div>
          <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800 flex flex-col items-center gap-2">
            <div onClick={() => setTab('hub')} className="cursor-pointer hover:scale-105 transition-transform" title="العودة للرئيسية">
              <TamkeenLogo size={36} className="mb-1" />
            </div>
            {/* Dynamic greeting — changes by time of day */}
            {(() => {
              const h = new Date().getHours();
              const { label, emoji, from, to } =
                h >= 5 && h < 12  ? { label: 'صباح الإلهام',   emoji: '🌅', from: 'from-amber-500',   to: 'to-orange-500'  } :
                h >= 12 && h < 17 ? { label: 'نهار العطاء',    emoji: '☀️', from: 'from-yellow-500',  to: 'to-amber-500'   } :
                h >= 17 && h < 21 ? { label: 'مساء التميز',    emoji: '🌆', from: 'from-indigo-500',  to: 'to-purple-500'  } :
                                    { label: 'ليلة الإبداع',   emoji: '🌙', from: 'from-slate-600',   to: 'to-indigo-700'  };
              return (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${from} ${to} shadow-sm`}>
                  <span className="text-[11px]">{emoji}</span>
                  <span className="text-[11px] font-black text-white tracking-wide">{label}</span>
                </div>
              );
            })()}

            <div
              className="w-full bg-emerald-50/50 dark:bg-slate-800/40 rounded-2xl p-2.5 border border-emerald-100 dark:border-slate-700 flex flex-col items-center group relative cursor-pointer transition-all duration-500 shadow-sm hover:shadow-md hover:border-emerald-300"
              onClick={() => setShowIdCard(true)}
            >
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <p className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.15em] mb-1">المعرف الرقمي الموحد</p>

              {/* QR Code */}
              <div className="bg-white p-1 rounded-lg shadow-inner mb-1 group-hover:p-1.5 transition-all duration-300">
                <QRCodeCanvas
                  value={`tamkeen://${profile?.tamkeenId || 'tamkeen'}`}
                  size={44}
                  level="M"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#1b4332"
                />
              </div>

              <div className="flex items-center gap-1.5 transition-all duration-300">
                <span className="text-[8px] font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                  {profile.tamkeenId}
                </span>
                <button onClick={copyId} className="p-1 bg-emerald-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-700">
                  {copied ? <Check size={8} /> : <Copy size={8} />}
                </button>
              </div>

              {/* Hidden by default, shown on hover */}
              <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 w-full">
                <div className="space-y-1 mt-2 border-t border-emerald-100 dark:border-slate-700 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Wifi size={8} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-[7px] font-bold text-slate-500 dark:text-slate-400">متصل بجديد وزارة التربية الوطنية</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={8} className="text-indigo-500 flex-shrink-0" />
                    <span className="text-[7px] font-bold text-slate-500 dark:text-slate-400">التوثيق الرسمي للمستندات</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fingerprint size={8} className="text-amber-500 flex-shrink-0" />
                    <span className="text-[7px] font-bold text-slate-500 dark:text-slate-400">البصمة الرقمية لحماية حقوقك</span>
                  </div>
                </div>
                <p className="text-[7px] text-slate-400 mt-1.5 font-bold text-center">امسح QR للدخول الفوري</p>
              </div>
            </div>
          </div>

          <nav className="px-3 py-2.5 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {/* Smart Non-Crowded Portals Bar */}
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <button
                onClick={() => {
                  setTab('/');
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all duration-200 border text-right group ${
                  location.pathname === '/'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black shadow-sm shadow-amber-500/25 border-transparent'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200/60 dark:border-slate-700/60'
                }`}
                title="بوابة تمكين PRO (الواجهة بعد التسجيل)"
              >
                <Compass size={13} className={location.pathname === '/' ? 'text-white' : 'text-amber-500 group-hover:rotate-45 transition-transform'} />
                <span className="text-[11px] font-black truncate">تمكين PRO</span>
              </button>

              <button
                onClick={() => {
                  setShowLanding(true);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all duration-200 border bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white border-emerald-200/60 dark:border-emerald-800/40 text-right group/land hover:shadow-sm"
                title="العودة إلى الواجهة الرئيسية الأولى (صفحة الاستقبال والتعريف بالمنصة)"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover/land:bg-white animate-pulse"></div>
                <Home size={13} className="text-emerald-600 dark:text-emerald-400 group-hover/land:text-white transition-colors" />
                <span className="text-[11px] font-black truncate">الواجهة الأولى</span>
              </button>
            </div>
            {[
              {
                id: 'classroom',
                title: 'الإدارة الصفية والوثائق',
                icon: LayoutDashboard,
                color: 'text-emerald-500 bg-emerald-500/10',
                badge: '5 وحدات',
                items: [
                  { id: '/dashboard', label: t.dashboard, icon: BarChart3 },
                  { id: '/korras-yawmi', label: t.journal, icon: LayoutDashboard },
                  { id: '/grading', label: t.grading, icon: Calculator },
                  { id: '/absence', label: t.absence, icon: UserCheck },
                  { id: '/timetable', label: 'جداول التوقيت', icon: Calendar },
                ]
              },
              {
                id: 'ai_tools',
                title: 'الذكاء الاصطناعي والمحتوى',
                icon: Sparkles,
                color: 'text-indigo-500 bg-indigo-500/10',
                badge: '6 أدوات',
                items: [
                  { id: '/copilot', label: 'المساعد الذكي', icon: Sparkles },
                  { id: '/mothakira-thakiya', label: t.memo, icon: Zap },
                  { id: '/whiteboard', label: 'السبورة التفاعلية', icon: Sparkles },
                  { id: '/exam-generator', label: 'مولد الاختبارات', icon: PenLine },
                  { id: '/worksheet-generator', label: 'أوراق العمل', icon: Layers },
                  { id: '/presentation-stepper', label: 'صانع العروض', icon: Monitor },
                ]
              },
              {
                id: 'resources',
                title: 'الموارد والتطوير المهني',
                icon: BookOpenCheck,
                color: 'text-sky-500 bg-sky-500/10',
                badge: '3 أقسام',
                items: [
                  { id: '/resources', label: t.resources, icon: Library },
                  { id: '/new-teacher', label: 'حقيبة الأستاذ', icon: FileStack },
                  { id: '/blog', label: 'المدونة التربوية', icon: BookOpen },
                ]
              },
              {
                id: 'communication',
                title: 'التواصل والدعم',
                icon: MessageSquare,
                color: 'text-amber-500 bg-amber-500/10',
                badge: '3 خدمات',
                items: [
                  { id: '/messages', label: t.messages, icon: MessageSquare },
                  { id: '/faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
                  { id: '/about', label: 'من نحن', icon: UserCheck },
                ]
              },
              {
                id: 'system',
                title: 'السحابة الرقمية والنظام',
                icon: Shield,
                color: 'text-rose-500 bg-rose-500/10',
                badge: auth.isAdmin ? 'مشرف' : 'سحابي',
                items: [
                  { id: '/database', label: t.database, icon: Database },
                  ...(auth.isAdmin ? [{ id: '/admin', label: t.admin, icon: Shield }] : []),
                ]
              }
            ].map((group) => {
              const isGroupActive = group.items.some(item => location.pathname === item.id);
              // Active group defaults to open, inactive group defaults to collapsed
              const isCollapsed = collapsedGroups[group.id] !== undefined 
                ? collapsedGroups[group.id] 
                : !isGroupActive;

              return (
                <div key={group.id} className="rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 overflow-hidden transition-all duration-300">
                  {/* Collapsible Accordion Header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-right transition-colors ${
                      isGroupActive
                        ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-sm ${
                        isGroupActive
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : `${group.color}`
                      }`}>
                        <group.icon size={12} />
                      </div>
                      <span className="text-xs font-black tracking-tight">{group.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/60 text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                        {group.badge}
                      </span>
                      {isCollapsed ? (
                        <ChevronDown size={13} className="text-slate-400 transition-transform duration-200" />
                      ) : (
                        <ChevronUp size={13} className="text-slate-400 transition-transform duration-200" />
                      )}
                    </div>
                  </button>

                  {/* Group Items Sub-list */}
                  {!isCollapsed && (
                    <div className="p-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                      {group.items.map((item) => {
                        const isItemActive = location.pathname === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setTab(item.id);
                              if (window.innerWidth < 1024) setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-150 group relative text-right ${
                              isItemActive
                                ? 'bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent text-amber-800 dark:text-amber-400 font-black shadow-sm'
                                : 'hover:bg-white dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {isItemActive && (
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-amber-400 to-yellow-400 rounded-l-full shadow-sm shadow-amber-300/50"></div>
                            )}
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                              isItemActive
                                ? 'bg-amber-500 text-white shadow-sm shadow-amber-400/40'
                                : 'bg-white dark:bg-slate-700/70 text-slate-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 group-hover:text-amber-600'
                            }`}>
                              <item.icon size={12} />
                            </div>
                            <span className={`text-[11px] leading-snug font-bold ${
                              isItemActive ? 'text-amber-900 dark:text-amber-300 font-black' : ''
                            }`}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Support & Quick Actions - directly following the 5 icon groups without unjustified gap */}
            <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1.5">
              <button
                onClick={() => setShowDonationModal(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/50 dark:hover:to-pink-900/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 transition-all font-black text-xs shadow-sm hover:shadow hover:scale-[1.01] group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Heart size={12} className="fill-white animate-pulse" />
                  </div>
                  <span className="text-xs font-black tracking-tight">ادعم المنصة</span>
                </div>
                <span className="text-[9px] bg-rose-500/15 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">مساهمة</span>
              </button>

              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  onClick={() => handleNavigation('/settings')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs transition-all border ${
                    location.pathname === '/settings'
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-black'
                      : 'bg-white/70 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <SettingsIcon size={12} />
                  <span className="font-bold text-[11px]">{t.settings}</span>
                </button>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs transition-all border bg-white/70 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200"
                >
                  <LogOut size={12} />
                  <span className="font-bold text-[11px]">{t.logout}</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className="relative h-20 flex items-center justify-between px-6 md:px-8 no-print z-30">
            {/* Glass background — separate layer so tooltips aren't clipped */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/30 dark:border-slate-700/50 shadow-sm shadow-slate-200/50 dark:shadow-slate-900/50"></div>
              {/* Subtle amber shimmer line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
              {/* Subtle top glow blob */}
              <div className="absolute -top-6 right-1/3 w-64 h-12 bg-gradient-to-r from-amber-400/10 via-emerald-400/10 to-indigo-400/10 blur-2xl rounded-full"></div>
            </div>

            {/* LEFT — Page title */}
            <div className="relative z-10 flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl text-slate-600 dark:text-slate-400 border border-white/40 dark:border-slate-700/40 hover:scale-105 transition-all shadow-sm">
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{t[activeTab]}</h2>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mt-0.5">المنصة التربوية الشاملة للأستاذ الجزائري</p>
              </div>
            </div>

            {/* RIGHT — Controls */}
            <div className="relative z-10 flex items-center gap-2">

              {/* Smart Return to Initial Landing Page */}
              <div className="relative group" style={{ zIndex: 50 }}>
                <button
                  onClick={() => setShowLanding(true)}
                  className="relative flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 hover:from-emerald-600 hover:to-teal-600 text-emerald-800 dark:text-emerald-300 hover:text-white rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-emerald-600/20 hover:scale-105 group/firstbtn overflow-hidden"
                  title="العودة إلى الواجهة الرئيسية الأولى (صفحة الاستقبال والتعريف بالمنصة)"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/firstbtn:bg-white animate-pulse"></div>
                  <Home size={15} className="text-emerald-600 dark:text-emerald-400 group-hover/firstbtn:text-white transition-colors" />
                  <span className="text-xs font-black hidden sm:inline tracking-tight">الواجهة الأولى</span>
                </button>
                {/* Tooltip */}
                <div className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[999]">
                  <div className="relative px-3 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-xl font-bold whitespace-nowrap shadow-2xl border border-slate-700/60 ring-1 ring-white/5">
                    🏛️ الواجهة الرئيسية الأولى (صفحة الاستقبال)
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-r border-slate-700/60 rotate-[-45deg]"></span>
                  </div>
                </div>
              </div>

              {/* Live Visitor Counter Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm select-none" title="عدد الزوار بعد كل تحديث وزيارة منذ الآن">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Users size={14} className="text-emerald-500" />
                <span className="text-[11px] text-slate-400 font-bold">الزوار:</span>
                <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                  {visitorCount.toLocaleString()}
                </span>
              </div>

              {/* Quick Support Platform Button */}
              <div className="relative group" style={{ zIndex: 50 }}>
                <button
                  onClick={() => setShowDonationModal(true)}
                  className="relative flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 hover:from-rose-500 hover:to-pink-500 text-rose-700 dark:text-rose-300 hover:text-white rounded-2xl border border-rose-200/80 dark:border-rose-800/80 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 group/supportbtn overflow-hidden"
                  title="ادعم المنصة"
                >
                  <Heart size={14} className="fill-rose-500 text-rose-500 group-hover/supportbtn:fill-white group-hover/supportbtn:text-white animate-pulse transition-colors" />
                  <span className="text-xs font-black hidden lg:inline tracking-tight">ادعم المنصة</span>
                </button>
                <div className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[999]">
                  <div className="relative px-3 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-xl font-bold whitespace-nowrap shadow-2xl border border-slate-700/60 ring-1 ring-white/5">
                    💖 المساهمة في دعم وتطوير المنصة
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-r border-slate-700/60 rotate-[-45deg]"></span>
                  </div>
                </div>
              </div>

              {/* Bell — fixed tooltip with overflow-visible */}
              <div className="relative group" style={{ zIndex: 50 }}>
                <button
                  onClick={() => setTab('/messages')}
                  className={cn(
                    "relative p-2.5 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:scale-105 hover:-translate-y-0.5",
                    unreadCount > 0
                      ? "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20 border-rose-200/60 dark:border-rose-700/40 text-rose-600 shadow-rose-200/50 dark:shadow-rose-900/30 shadow-md"
                      : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 dark:border-slate-700/40 text-slate-500 dark:text-slate-400"
                  )}
                >
                  {unreadCount > 0 && <span className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-pink-400/10 animate-pulse rounded-2xl"></span>}
                  <Bell size={18} className={cn("relative z-10 transition-transform duration-300 group-hover:scale-110", unreadCount > 0 ? "animate-bounce" : "")} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md z-20 px-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {/* Tooltip — rendered outside overflow:hidden */}
                <div className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[999]">
                  <div className="relative px-3 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-xl font-bold whitespace-nowrap shadow-2xl border border-slate-700/60 ring-1 ring-white/5">
                    {unreadCount > 0 ? `🔔 لديك ${unreadCount} رسائل جديدة` : '🔕 لا توجد تنبيهات'}
                    {/* Arrow */}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-r border-slate-700/60 rotate-[-45deg]"></span>
                  </div>
                </div>
              </div>

              {/* Language switcher */}
              <div className="relative group" style={{ zIndex: 50 }}>
                <button
                  onClick={toggleLanguage}
                  className="relative p-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-slate-700/40 text-slate-600 dark:text-slate-300 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 shadow-sm font-black text-xs overflow-hidden"
                >
                  <span className="relative z-10">{lang === 'ar' ? 'EN' : 'ع'}</span>
                </button>
                <div className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[999]">
                  <div className="relative px-3 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-xl font-bold whitespace-nowrap shadow-2xl border border-slate-700/60">
                    {lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-r border-slate-700/60 rotate-[-45deg]"></span>
                  </div>
                </div>
              </div>

              {/* Dark mode toggle */}
              <div className="relative group" style={{ zIndex: 50 }}>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={cn(
                    "relative p-2.5 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:scale-105 hover:-translate-y-0.5",
                    darkMode
                      ? "bg-gradient-to-br from-amber-400/20 to-orange-400/10 border-amber-300/40 dark:border-amber-700/40 text-amber-500"
                      : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 dark:border-slate-700/40 text-indigo-500 dark:text-slate-300"
                  )}
                >
                  {darkMode ? <Sun size={18} className="relative z-10" /> : <Moon size={18} className="relative z-10" />}
                </button>
                <div className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[999]">
                  <div className="relative px-3 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-xl font-bold whitespace-nowrap shadow-2xl border border-slate-700/60">
                    {darkMode ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن'}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-r border-slate-700/60 rotate-[-45deg]"></span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent mx-1"></div>

              {/* ✨ Teacher Identity Card — Creative hover expanding pill */}
              <div
                className="hidden md:flex items-center relative group cursor-pointer select-none"
                onClick={() => setShowIdCard(true)}
                style={{ zIndex: 50 }}
              >
                {/* Rainbow glow ring that expands on hover */}
                <div className="absolute -inset-1.5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{ background: 'conic-gradient(from 0deg, #10b981, #06b6d4, #6366f1, #f59e0b, #10b981)', filter: 'blur(8px)' }}></div>

                {/* Main pill container */}
                <div className="relative flex items-center gap-2.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[1.5rem] px-2 py-1.5 border border-white/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-200/30 dark:group-hover:shadow-emerald-900/20 group-hover:border-emerald-200/60 dark:group-hover:border-emerald-700/40 group-hover:bg-white/90 dark:group-hover:bg-slate-800/90">

                  {/* Avatar with animated gradient border */}
                  <div className="relative shrink-0">
                    {/* Spinning gradient border */}
                    <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg, #10b981, #f59e0b, #6366f1)', borderRadius: '14px' }}></div>
                    {/* Avatar */}
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-white/80 dark:border-slate-600/60 shadow-inner">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600"></div>
                      {/* Shimmer sweep on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-black text-base drop-shadow-md">{profile.name?.charAt(0) || 'أ'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Name + role — always visible in both modes */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-black leading-tight whitespace-nowrap text-slate-800 dark:text-slate-100 tracking-tight">
                      {profile.name}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-sm shadow-emerald-400/50"></span>
                      <span className="text-[10px] font-bold whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                        {profile.institution?.length > 22 ? profile.institution.slice(0, 22) + '…' : profile.institution}
                      </span>
                    </div>
                  </div>

                  {/* Mini badge — sparkle icon */}
                  <div className="shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-300/20 dark:from-amber-500/20 dark:to-yellow-400/10 flex items-center justify-center border border-amber-200/40 dark:border-amber-700/30 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-[10px]">✨</span>
                  </div>
                </div>

                {/* Floating hover card — full info & actions */}
                <div className="pointer-events-none group-hover:pointer-events-auto absolute top-full pt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-0 translate-y-1 z-[999]">
                  <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-100 dark:border-slate-700/60 min-w-[230px]"
                    style={{ boxShadow: '0 25px 50px -12px rgba(16,185,129,0.15), 0 10px 20px -5px rgba(0,0,0,0.1)' }}>
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 rounded-t-2xl"></div>
                    {/* Arrow */}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-t border-r border-slate-100 dark:border-slate-700/60 rotate-[-45deg] mt-px"></span>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <span className="text-white font-black text-xl">{profile.name?.charAt(0) || 'أ'}</span>
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm leading-tight">{profile.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">أستاذ تمكين PRO</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-50 dark:border-slate-800 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[10px] flex items-center justify-center">🏫</span>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{profile.institution}</span>
                      </div>
                      {profile.wilaya && (
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] flex items-center justify-center">📍</span>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{profile.wilaya}</span>
                        </div>
                      )}
                      {profile.level && (
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 text-[10px] flex items-center justify-center">🎓</span>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{profile.level}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick action buttons: Digital ID & Logout */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowIdCard(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer active:scale-98"
                      >
                        <CreditCard size={13} className="text-emerald-500" />
                        <span>عرض البطاقة الرقمية</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLogoutModal(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-black transition-all border border-rose-200/80 dark:border-rose-900/60 shadow-sm cursor-pointer active:scale-98"
                      >
                        <LogOut size={13} />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <InspirationBanner />

          <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f8fafc] dark:bg-slate-950 transition-colors custom-scrollbar relative">
            <div className="max-w-7xl mx-auto space-y-8 pb-32">
              <Routes>
                <Route path="/" element={<DashboardView profile={profile} />} />
                <Route path="/dashboard" element={<DashboardView profile={profile} />} />
                <Route path="/korras-yawmi" element={<JournalPage />} />
                <Route path="/mothakira-thakiya" element={profile && <SmartMemoView profile={profile} />} />
                <Route path="/grading" element={<GradingView profile={profile} />} />
                <Route path="/absence" element={<AbsenceView profile={profile} lang={lang} />} />
                <Route path="/timetable" element={<TimetableDashboard profile={profile} />} />
                <Route path="/copilot" element={<Copilot />} />
                <Route path="/exam-generator" element={<ExamGenerator profile={profile} />} />
                <Route path="/worksheet-generator" element={<WorksheetGenerator profile={profile} />} />
                <Route path="/presentation-stepper" element={<PresentationStepper />} />
                <Route path="/whiteboard" element={<WhiteboardView />} />
                <Route path="/new-teacher" element={<NewTeacherKit />} />
                <Route path="/resources" element={<ResourceBankView profile={profile} />} />
                <Route path="/annual" element={<PlansView profile={profile} lang={lang} type="annual" />} />
                <Route path="/settings" element={<SettingsView profile={profile} onUpdate={(p) => auth.updateProfile(p)} darkMode={darkMode} setDarkMode={setDarkMode} />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/messages" element={<MessagesPanel />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/database" element={
                  <div className="space-y-8 animate-in fade-in">
                    <AdminResourceManager profile={profile} />
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                          <Database size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-900 dark:text-white">قاعدة البيانات المحلية</h2>
                          <p className="text-xs text-slate-500">عرض مباشر للبيانات المحلية (SQLite)</p>
                        </div>
                      </div>
                      <RepositoryConfig />
                    </div>
                  </div>
                } />
              </Routes>
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
      <DonationBanner />
      <ExportDonationToast />
      <DonationModal isOpen={showDonationModal} onClose={() => setShowDonationModal(false)} />
      {auth.isAdmin && <SystemStatusMonitor auth={auth} unreadCount={unreadCount} lastError={lastError} />}
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
