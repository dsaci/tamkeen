
import React, { useState, useEffect } from 'react';
import {
  BookOpen, Calculator, UserCheck, BookOpenCheck, FileEdit,
  LayoutDashboard, Sparkles, ArrowRight, Quote, Sun, Moon, LogOut, Zap, Database,
  ShieldCheck
} from 'lucide-react';
import { TeacherProfile, TabType } from '../../types';
import { TamkeenLogoBrand as TamkeenLogo } from '../../components/ui/TamkeenLogo';

interface Props {
  profile: TeacherProfile;
  onNavigate: (tab: TabType) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

const QUOTES = [
  "المعلم هو الشمعة التي تحترق لتنير دروب الآخرين، فدمت نبراساً للعلم.",
  "بكم تُبنى الأجيال وتسمو الأمم، أنتم ورثة الأنبياء وصناع المستقبل.",
  "التعليم ليس مجرد مهنة، بل رسالة سامية تغرس القيم وتبني العقول.",
  "أثر المعلم لا يتوقف أبداً، فهو يمتد في نفوس طلابه إلى الأبد.",
  "صناعة العقول هي أعظم الصناعات، وأنتم روادها وقادتها.",
  "يا شمعةً في زوايا 'الصف' تأتلق.. تنير درب المعالي وهي تحترق."
];

const CARDS = [
  {
    id: 'journal',
    title: 'الكراس اليومي',
    desc: 'تدوين ومتابعة الحصص البيداغوجية',
    icon: LayoutDashboard,
    color: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-200 dark:shadow-emerald-900/20'
  },
  {
    id: 'memo',
    title: 'المذكرة الذكية',
    desc: 'تحضير الدروس بالذكاء الاصطناعي',
    icon: Zap,
    color: 'from-indigo-500 to-blue-600',
    shadow: 'shadow-indigo-200 dark:shadow-indigo-900/20'
  },
  {
    id: 'grading',
    title: 'دفتر التنقيط',
    desc: 'رصد العلامات والتقييمات الفصلية',
    icon: Calculator,
    color: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-200 dark:shadow-violet-900/20'
  },
  {
    id: 'absence',
    title: 'متابعة الغياب',
    desc: 'تسجيل الحضور والغياب اليومي',
    icon: UserCheck,
    color: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-200 dark:shadow-rose-900/20'
  },
  {
    id: 'database',
    title: 'السحابة الرقمية',
    desc: 'مزامنة وإدارة البيانات السحابية',
    icon: Database,
    color: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-200 dark:shadow-amber-900/20'
  },
];

export default function IntroHub({ profile, onNavigate, darkMode, toggleDarkMode, onLogout, isAdmin = false }: Props) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeQuote, setFadeQuote] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeQuote(false);
      setTimeout(() => {
        setQuoteIndex(prev => (prev + 1) % QUOTES.length);
        setFadeQuote(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-['Cairo'] flex flex-col transition-colors duration-500 overflow-x-hidden relative">

      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-slate-900/50 dark:to-transparent -z-10 transition-colors duration-500"></div>

      <nav className="flex items-center justify-between px-8 py-6 md:px-12 md:py-8 z-20">
        <div className="flex items-center gap-4">
          <TamkeenLogo size={40} />
          <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
          <p className="hidden md:block text-sm font-black text-emerald-600 uppercase tracking-tighter">بوابة الأستاذ الذكية</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mr-4 animate-in slide-in-from-top-4">
              <ShieldCheck className="text-emerald-500" size={16} />
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">الخادم السحابي نشط</span>
            </div>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400 hover:scale-110 transition-all shadow-sm"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onLogout}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:scale-110 transition-all shadow-sm"
            title="خروج"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center max-w-7xl mx-auto w-full px-6 md:px-12 pb-20 z-10">

        <div className="text-center mt-8 mb-16 max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-700 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black border border-emerald-200 dark:border-emerald-800 shadow-sm mb-2">
            <Sparkles size={14} className="animate-pulse" />
            <span>أهلاً بك في فضاء التميز الرقمي</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
            طاب يومك، أستاذ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{profile.name}</span>
          </h1>

          <div className="mt-8 relative max-w-xl mx-auto h-20 flex items-center justify-center">
            <div className={`transition-all duration-500 absolute w-full flex flex-col items-center gap-3 ${fadeQuote ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Quote className="text-indigo-300 dark:text-indigo-700/50 rotate-180 absolute -top-4 -right-4" size={24} />
              <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 italic text-center leading-relaxed px-8">
                "{QUOTES[quoteIndex]}"
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full animate-in slide-in-from-bottom-20 duration-1000 delay-150 fade-in fill-mode-backwards">
          {CARDS.filter(card => card.id !== 'database' || isAdmin).map((card, idx) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id as TabType)}
              className={`relative group flex flex-col items-start p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl hover:shadow-2xl ${card.shadow} transition-all duration-300 hover:-translate-y-3 text-right overflow-hidden`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${card.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <card.icon size={32} />
              </div>

              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                {card.title}
              </h3>

              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 leading-relaxed mb-8">
                {card.desc}
              </p>

              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <span>فتح الوحدة</span>
                <ArrowRight size={14} className="rotate-180" />
              </div>
            </button>
          ))}
        </div>

      </main>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-30"></div>
    </div>
  );
}
