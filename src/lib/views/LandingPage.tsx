
import React, { useState, useEffect } from 'react';
import {
  LogIn, UserPlus, BookOpen, Calculator,
  UserCheck, Sparkles, BookOpenCheck, Zap,
  LayoutDashboard, Fingerprint, ArrowRight, BrainCircuit,
  Sun, Moon, Phone, Globe, ExternalLink,
  Facebook, Landmark, Award, MessageCircle
} from 'lucide-react';
import { TamkeenLogo } from '../../components/ui/TamkeenLogo';

interface Props {
  onEnter: () => void;
  darkMode: boolean;
  toggleDarkMode?: () => void;
}

const QUOTES = [
  "المعلم ناسك انقطع لخدمة العلم كما انقطع الناسك لخدمة الدين. — أحمد أمين",
  "إنما بُعثت لأتمم مكارم الأخلاق. — حديث شريف",
  "قم للمعلم وفّه التبجيلا.. كاد المعلم أن يكون رسولا. — أحمد شوقي",
  "أفضل المعلمين هم الذين يدرسونك من القلب وليس من الكتب.",
  "التكنولوجيا مجرد أداة، أما تحفيز الأطفال وجعلهم يعملون معاً، فالمعلم هو الأهم. — بيل غيتس"
];

const FEATURES = [
  {
    title: "المذكرة الذكية",
    desc: "تحضير الدروس بالذكاء الاصطناعي",
    icon: BrainCircuit,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "bg-indigo-500"
  },
  {
    title: "المساعد البيداغوجي",
    desc: "دعم فوري وموارد متجددة",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "bg-amber-500"
  },
  {
    title: "دفتر التنقيط الآلي",
    desc: "حساب المعدلات بدقة متناهية",
    icon: Calculator,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "bg-emerald-500"
  },
  {
    title: "إدارة الغياب والحضور",
    desc: "متابعة فورية وانضباط",
    icon: UserCheck,
    image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "bg-rose-500"
  }
];

export default function LandingPage({ onEnter, darkMode, toggleDarkMode }: Props) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeQuote, setFadeQuote] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeQuote(false);
      setTimeout(() => {
        setQuoteIndex(prev => (prev + 1) % QUOTES.length);
        setFadeQuote(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-['Cairo'] flex flex-col relative overflow-x-hidden transition-colors duration-500" dir="rtl">

      {/* 1. Glassy Algerian Flag Bar (Top Only) */}
      <div className="absolute top-0 left-0 w-full h-1.5 z-[100] flex shadow-sm opacity-90">
        <div className="flex-1 bg-emerald-600/90 backdrop-blur-sm"></div>
        <div className="flex-1 bg-white/80 backdrop-blur-sm"></div>
        <div className="flex-1 bg-rose-600/90 backdrop-blur-sm"></div>
      </div>

      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* Header / Nav - Improved Spacing */}
      <nav className="relative z-20 px-10 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <TamkeenLogo size={42} />
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide flex items-center gap-2">
              المنصة الرقمية للأستاذ الجزائري
              <img src="https://flagcdn.com/w40/dz.png" alt="Algeria" className="w-5 h-auto rounded-sm shadow-sm" />
            </span>
          </div>

          <a
            href="https://wa.me/213697506846"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 mr-4 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
          >
            <Phone size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">اتصل بالإدارة: +213697506846</span>
          </a>
        </div>

        {toggleDarkMode && (
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400 hover:scale-105 transition-all shadow-sm"
            title="تبديل الوضع"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 pb-16 flex flex-col items-center relative z-10">

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-8 lg:mt-16 mb-28">

          <div className="order-2 lg:order-1 space-y-10 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs shadow-sm">
              <Sparkles size={14} className="animate-pulse" />
              <span>الإصدار الاحترافي الجديد 2025</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.4] tracking-tight">
              <span className="block mb-3">نحن نبني الأدوات،</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-extrabold drop-shadow-sm tracking-wide scale-[1.01] origin-right">
                وأنت تبني الأجيال.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-loose font-medium max-w-xl">
              منصة "تمكين" تمنحك القوة الرقمية لإدارة مهامك البيداغوجية والإدارية في مكان واحد، لتتفرغ لمهمتك الأسمى: التعليم.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-6 relative">
              <button
                onClick={onEnter}
                className="group relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <UserPlus size={22} />
                  <span>إنشاء حساب أستاذ</span>
                </div>
              </button>

              <button
                onClick={onEnter}
                className="group px-10 py-5 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-3xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
              >
                <LogIn size={22} className="group-hover:text-emerald-600 transition-colors" />
                <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">تسجيل الدخول</span>
              </button>
            </div>

            <div className="pt-10 flex items-start gap-5">
              <div className="w-1.5 h-14 bg-emerald-500 rounded-full opacity-40"></div>
              <p className={`text-slate-500 dark:text-slate-400 italic font-medium transition-opacity duration-500 text-base leading-relaxed ${fadeQuote ? 'opacity-100' : 'opacity-0'}`}>
                "{QUOTES[quoteIndex]}"
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative animate-in zoom-in-95 duration-1000 delay-150 fade-in">
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-slate-800 rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Professional Teacher"
                className="w-full h-[550px] object-cover hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute bottom-10 right-10 z-20 text-white">
                <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/30 inline-flex items-center gap-4">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="font-bold text-sm tracking-wide">مساحة عمل رقمية متكاملة</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce delay-700">
              <LayoutDashboard className="text-emerald-600" size={36} />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce delay-300">
              <Fingerprint className="text-indigo-600" size={36} />
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mb-32 animate-in slide-in-from-bottom-20 duration-1000 delay-300">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[3.5rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-emerald-50 text-xs font-bold mb-6">
                <BookOpen size={16} />
                <span>الركيزة الأساسية للأستاذ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">الكراس اليومي الرقمي: <br />انضباط <span className="text-emerald-200">ودقة</span></h2>
              <p className="text-emerald-50 text-xl leading-relaxed font-medium">
                العمود الفقري للعملية التربوية. قم بتدوين الحصص، الأنشطة، والملاحظات البيداغوجية بكل سهولة. واجهة مصممة خصيصاً لتوافق المعايير الرسمية وتغنيك عن السجلات الورقية.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <div className="w-28 h-28 md:w-40 md:h-40 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border-2 border-white/30 shadow-inner">
                <LayoutDashboard className="text-emerald-100 w-14 h-14 md:w-20 md:h-20" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">أدوات ذكية تكمل بعضها البعض</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 w-full relative overflow-hidden">
                  <div className={`absolute inset-0 ${feature.color} opacity-90 mix-blend-multiply z-10 transition-opacity group-hover:opacity-80`}></div>
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-5 right-5 z-20 bg-white/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 text-white shadow-lg">
                    <feature.icon size={26} />
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-black text-xl text-slate-800 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-white/50 dark:border-slate-700/50 relative overflow-hidden group mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/50">
                  <MessageCircle size={28} />
                </div>
                التواصل والإدارة
              </h3>
              <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-300 font-bold text-lg leading-relaxed">لأي استفسارات تقنية أو بيداغوجية، الإدارة في خدمتكم:</p>
                <a
                  href="https://wa.me/213697506846"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-emerald-600 text-white px-8 py-5 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 w-full md:w-auto justify-center group/btn"
                >
                  <Phone size={28} className="group-hover/btn:animate-pulse" />
                  <span dir="ltr">+213 697 50 68 46</span>
                </a>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-r border-slate-200/50 dark:border-slate-700/50 pt-10 md:pt-0 md:pr-12">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-600 border border-indigo-200/50 dark:border-indigo-800/50">
                  <Globe size={28} />
                </div>
                روابط رسمية وهامة
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.education.gov.dz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group/link shadow-sm hover:shadow-md">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-400 group-hover/link:text-emerald-600 transition-colors">
                      <Landmark size={20} />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-sm group-hover/link:text-emerald-700 dark:group-hover/link:text-emerald-400">الموقع الرسمي لوزارة التربية الوطنية الجزائرية</span>
                  </a>
                </li>
                <li>
                  <a href="https://bem.onec.dz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group/link shadow-sm hover:shadow-md">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-400 group-hover/link:text-emerald-600 transition-colors">
                      <Award size={20} />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-sm group-hover/link:text-emerald-700 dark:group-hover/link:text-emerald-400">الديوان الوطني للامتحانات والمسابقات</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/Abdennoursaci118" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group/link shadow-sm hover:shadow-md">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-indigo-500 group-hover/link:text-indigo-600 transition-colors">
                      <Facebook size={20} />
                    </div>
                    <span className="text-indigo-800 dark:text-indigo-300 font-bold text-sm">الصفحة الرسمية للأستاذ ساسي عبد النور</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      <footer className="w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-8 text-center mt-10">
        <p className="text-xs font-bold text-slate-400">
          © 2026 منصة تمكين. صنعت بحب للمعلم الجزائري.
        </p>
      </footer>
    </div>
  );
}
