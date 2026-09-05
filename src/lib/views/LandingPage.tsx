
import React, { useState, useEffect } from 'react';
import {
  LogIn, UserPlus, BookOpen, Calculator,
  UserCheck, Sparkles, BookOpenCheck, Zap,
  LayoutDashboard, Fingerprint, ArrowRight, BrainCircuit,
  Sun, Moon, Phone, Globe, ExternalLink,
  Facebook, Landmark, Award, MessageCircle,
  FileText, Users, CheckCircle2, Calendar
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

export default function LandingPage({ onEnter, darkMode, toggleDarkMode }: Props) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeQuote, setFadeQuote] = useState(true);

  // ======= Toggle معلم / معلمة =======
  const [teacherVariant, setTeacherVariant] = useState<'male' | 'female'>('male');

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

      {/* ===== شريط أعلى بألوان العلم الجزائري ===== */}
      <div className="absolute top-0 left-0 w-full h-1.5 z-[100] flex shadow-sm opacity-90">
        <div className="flex-1 bg-emerald-600/90 backdrop-blur-sm"></div>
        <div className="flex-1 bg-white/80 backdrop-blur-sm"></div>
        <div className="flex-1 bg-rose-600/90 backdrop-blur-sm"></div>
      </div>

      {/* ===== خلفية ضبابية ===== */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* ===== شريط التنقل ===== */}
      <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <TamkeenLogo size={42} />
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide flex items-center gap-2">
              المنصة الرقمية للأستاذ الجزائري
              <img src="https://flagcdn.com/w40/dz.png" alt="الجزائر" className="w-5 h-auto rounded-sm shadow-sm" />
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-16 flex flex-col items-center relative z-10">

        {/* ========== HERO SECTION ========== */}
        {/* الصورة: kol_ma_tahehtadj.jpg — لوحة التحكم الرئيسية */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-8 lg:mt-16 mb-20 md:mb-28">

          {/* النص + الأزرار */}
          <div className="order-2 lg:order-1 space-y-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs shadow-sm">
              <Sparkles size={14} className="animate-pulse" />
              <span>🇩🇿 منصة رقمية جزائرية 100% — الإصدار الاحترافي 2025</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.4] tracking-tight">
              <span className="block mb-3">نحن نبني الأدوات،</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-extrabold drop-shadow-sm tracking-wide">
                وأنت تبني الأجيال.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-loose font-medium max-w-xl">
              منصة <strong className="text-emerald-700 dark:text-emerald-400">تمكين</strong> تمنحك القوة الرقمية لإدارة مهامك البيداغوجية والإدارية في مكان واحد، لتتفرغ لمهمتك الأسمى: التعليم.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
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

            {/* اقتباس متحرك */}
            <div className="pt-6 flex items-start gap-5">
              <div className="w-1.5 h-14 bg-emerald-500 rounded-full opacity-40 shrink-0 mt-1"></div>
              <p className={`text-slate-500 dark:text-slate-400 italic font-medium transition-opacity duration-500 text-base leading-relaxed ${fadeQuote ? 'opacity-100' : 'opacity-0'}`}>
                "{QUOTES[quoteIndex]}"
              </p>
            </div>
          </div>

          {/* صورة Hero: لوحة التحكم kol_ma_tahehtadj.jpg */}
          <div className="order-1 lg:order-2 flex justify-center animate-in zoom-in-95 duration-1000 delay-150 fade-in">
            <div className="relative w-full max-w-2xl">
              {/* Badge حي */}
              <div className="absolute -top-4 -right-4 z-20 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">مساحة عمل متكاملة</span>
              </div>
              {/* الصورة الرئيسية — eager للـ LCP */}
              <img
                src="/images/kol_ma_tahehtadj.jpg"
                alt="لوحة تحكم منصة تمكين تعرض جميع الميزات: إدارة الغياب، دفتر التنقيط، المذكرة الذكية، المساعد البيداغوجي"
                className="w-full rounded-2xl drop-shadow-2xl object-cover"
                loading="eager"
              />
              {/* Badge أيقونة */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce">
                <LayoutDashboard className="text-emerald-600" size={30} />
              </div>
            </div>
          </div>
        </section>

        {/* ========== قسم: كل ما تحتاجه (بطاقتان) ========== */}
        {/* البطاقة 1: radjol_tamkeen.jpg — البطاقة 2: tamkeen_wasat_wadjiha.jpg */}
        <section className="w-full mb-20 md:mb-28">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold mb-4">
              الميزات الأساسية
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3">
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
              من التحضير اليومي إلى المتابعة الإدارية، تمكين يرافقك خطوة بخطوة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* ── بطاقة المعلم: radjol_tamkeen.jpg ── */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
              <div className="h-64 overflow-hidden">
                <img
                  src="/images/radjol_tamkeen.jpg"
                  alt="معلم جزائري يستخدم منصة تمكين على الحاسوب المحمول لإعداد دروسه"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">👨🏫</span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">
                    للمعلمين الطموحين
                  </h3>
                </div>
                <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <BrainCircuit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-medium">مذكرات ذكية معتمدة على الذكاء الاصطناعي</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-medium">جدولة ذكية للحصص والتوزيعات السنوية</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-medium">توليد فوري وسريع للمحتوى البيداغوجي</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-medium">إدارة الغياب والحضور فورياً وبانضباط</span>
                  </li>
                </ul>
                <button
                  onClick={onEnter}
                  className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span>ابدأ رحلتك</span>
                  <ArrowRight size={18} className="rotate-180" />
                </button>
              </div>
            </div>

            {/* ── بطاقة الكراس اليومي: tamkeen_wasat_wadjiha.jpg ── */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
              <div className="h-64 overflow-hidden">
                <img
                  src="/images/tamkeen_wasat_wadjiha.jpg"
                  alt="واجهة الكراس اليومي الرقمي على شاشة الحاسوب — منصة تمكين"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">📔</span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">
                    الكراس اليومي الرقمي
                  </h3>
                </div>
                <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-medium">تسجيل دقيق ومنظم للحصص اليومية</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-medium">متابعة النشاطات البيداغوجية أولاً بأول</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-medium">واجهة متوافقة مع المعايير الرسمية</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/40 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-medium">يغنيك كلياً عن السجلات الورقية</span>
                  </li>
                </ul>
                <button
                  onClick={onEnter}
                  className="mt-6 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span>اكتشف الكراس اليومي</span>
                  <ArrowRight size={18} className="rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========== قسم التبديل التفاعلي: معلم / معلمة ========== */}
        {/* معلم: radjol_tamkeen.jpg — معلمة: ontha_tamkin.jpg */}
        <section className="w-full mb-20 md:mb-28">
          {/* أزرار Toggle */}
          <div className="flex justify-center gap-3 mb-10">
            <button
              onClick={() => setTeacherVariant('male')}
              className={`px-6 py-3 rounded-2xl font-bold text-base transition-all shadow-sm ${
                teacherVariant === 'male'
                  ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              👨🏫 للمعلمين
            </button>
            <button
              onClick={() => setTeacherVariant('female')}
              className={`px-6 py-3 rounded-2xl font-bold text-base transition-all shadow-sm ${
                teacherVariant === 'female'
                  ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              👩🏫 للمعلمات
            </button>
          </div>

          {/* محتوى التبديل */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 md:p-12 shadow-xl border border-emerald-100 dark:border-slate-700">
            {teacherVariant === 'female' ? (
              /* ── نسخة المعلمة: ontha_tamkin.jpg ── */
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 order-2 lg:order-1 space-y-5">
                  <span className="inline-block px-4 py-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-bold">
                    التعليم رسالة وأمل 💕
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                    للمعلمات اللاتي يقدن التغيير
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">
                    منصة تمكين تدعم كل المعلمات بنفس القوة والكفاءة. أدوات مصممة لتسهيل التحضير اليومي ورفع الإنتاجية البيداغوجية.
                  </p>
                  <button
                    onClick={onEnter}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  >
                    <span>اكتشفي المزيد</span>
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                </div>
                <div className="flex-1 order-1 lg:order-2">
                  <img
                    src="/images/ontha_tamkin.jpg"
                    alt="معلمة جزائرية بحجاب وردي تستخدم منصة تمكين الرقمية على الحاسوب المحمول"
                    className="w-full max-w-md mx-auto rounded-2xl drop-shadow-xl object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              /* ── نسخة المعلم: radjol_tamkeen.jpg ── */
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 order-2 lg:order-1 space-y-5">
                  <span className="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold">
                    🇩🇿 معاً نحو تعليم رقمي أكثر فعالية
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                    للمعلمين الذين يطمحون للتميز
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">
                    من التحضير إلى المتابعة، منصة تمكين تمنحك أدوات ذكية توفر وقتك وتضاعف من دقة عملك اليومي.
                  </p>
                  <button
                    onClick={onEnter}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  >
                    <span>ابدأ رحلتك</span>
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                </div>
                <div className="flex-1 order-1 lg:order-2">
                  <img
                    src="/images/radjol_tamkeen.jpg"
                    alt="معلم جزائري يستخدم منصة تمكين الرقمية بكل احترافية"
                    className="w-full max-w-md mx-auto rounded-2xl drop-shadow-xl object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== Banner الكراس اليومي (كبير) ========== */}
        {/* صورة: tamkeen_wasat_wadjiha.jpg */}
        <section className="w-full max-w-6xl mb-20 md:mb-28">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* النص */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-emerald-50 text-xs font-bold mb-6">
                  <BookOpen size={16} />
                  <span>الركيزة الأساسية للأستاذ</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                  الكراس اليومي الرقمي:<br />
                  انضباط <span className="text-yellow-300">ودقة</span>
                </h2>
                <p className="text-emerald-50 text-lg leading-relaxed font-medium mb-8 max-w-xl">
                  العمود الفقري للعملية التربوية. قم بتدوين الحصص، الأنشطة، والملاحظات البيداغوجية بكل سهولة. واجهة مصممة خصيصاً لتوافق المعايير الرسمية وتغنيك عن السجلات الورقية.
                </p>
                <button
                  onClick={onEnter}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-emerald-900 rounded-2xl font-black text-lg transition-all shadow-lg hover:-translate-y-0.5"
                >
                  <BookOpenCheck size={22} />
                  <span>افتح الكراس اليومي</span>
                </button>
              </div>

              {/* صورة اللابتوب فقط */}
              <div className="shrink-0 w-full lg:w-auto max-w-sm">
                <img
                  src="/images/tamkeen_wasat_wadjiha.jpg"
                  alt="واجهة الكراس اليومي الرقمي على شاشة اللابتوب — أداء أرقى وتنظيم أفضل"
                  className="w-full lg:w-80 rounded-2xl drop-shadow-2xl object-cover border-4 border-white/20"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========== قسم التواصل والروابط ========== */}
        <section className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-white/50 dark:border-slate-700/50 relative overflow-hidden mb-10">
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
                <p className="text-slate-600 dark:text-slate-300 font-bold text-lg leading-relaxed">
                  لأي استفسارات تقنية أو بيداغوجية، الإدارة في خدمتكم:
                </p>
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
        </section>

      </main>

      {/* ========== FOOTER مع شعار المطور ========== */}
      {/* شعار: logo_abdo.jpg — دائري مع اسم المطور */}
      <footer className="w-full bg-emerald-900 dark:bg-slate-950 text-white py-14 px-4 md:px-8 mt-8">
        <div className="max-w-7xl mx-auto">

          {/* شبكة الفوتر العلوية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 pb-12 border-b border-emerald-700/50 dark:border-slate-700/50">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TamkeenLogo size={36} />
                <h3 className="text-xl font-black">منصة تمكين</h3>
              </div>
              <p className="text-emerald-200 dark:text-slate-400 leading-relaxed">
                الرفيق الرقمي الذكي للمعلم الجزائري — نحن نبني الأدوات وأنت تبني الأجيال.
              </p>
            </div>
            <div>
              <h4 className="font-black text-lg mb-5 text-emerald-100">روابط سريعة</h4>
              <ul className="space-y-3 text-emerald-200 dark:text-slate-400">
                <li>
                  <button onClick={onEnter} className="hover:text-yellow-300 transition-colors font-medium text-right w-full">
                    🏠 الرئيسية
                  </button>
                </li>
                <li>
                  <button onClick={onEnter} className="hover:text-yellow-300 transition-colors font-medium text-right w-full">
                    📔 الكراس اليومي
                  </button>
                </li>
                <li>
                  <button onClick={onEnter} className="hover:text-yellow-300 transition-colors font-medium text-right w-full">
                    🧠 المذكرة الذكية
                  </button>
                </li>
                <li>
                  <button onClick={onEnter} className="hover:text-yellow-300 transition-colors font-medium text-right w-full">
                    📊 دفتر التنقيط
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-lg mb-5 text-emerald-100">التواصل</h4>
              <ul className="space-y-3 text-emerald-200 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-yellow-400 shrink-0" />
                  <span dir="ltr" className="font-medium">+213 697 50 68 46</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe size={16} className="text-yellow-400 shrink-0" />
                  <a href="https://tamkeen88.vercel.app" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-yellow-300 transition-colors">
                    tamkeen88.vercel.app
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ── شعار المطور الدائري + الاسم ── */}
          <div className="flex flex-col items-center gap-4">
            <img
              src="/images/logo_abdo.jpg"
              alt="الأستاذ عبدالنور ساسي — مطور ومصمم منصة تمكين الرقمية"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-2xl object-cover border-4 border-yellow-400/60 hover:border-yellow-400 transition-all hover:scale-105 cursor-pointer"
              loading="lazy"
            />
            <div className="text-center">
              <p className="font-black text-lg text-yellow-300 tracking-wide">
                الأستاذ عبدالنور ساسي
              </p>
              <p className="text-sm text-emerald-300 dark:text-slate-400 mt-1">
                مطور ومصمم المنصة
              </p>
            </div>
            <p className="text-center text-sm text-emerald-400 dark:text-slate-500 mt-2">
              © 2025 منصة تمكين — نحن نبني الأدوات، وأنت تبني الأجيال 🎓
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
