
import React, { useState, useEffect } from 'react';
import {
  LogIn, UserPlus, BookOpen, Calculator,
  UserCheck, Sparkles, BookOpenCheck, Zap,
  LayoutDashboard, Fingerprint, ArrowRight, BrainCircuit,
  Sun, Moon, Phone, Globe, ExternalLink,
  Facebook, Landmark, Award, MessageCircle,
  FileText, Users, CheckCircle2, Calendar, Star, ShieldCheck, Heart
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

      {/* ===== 1. شريط علوي ذهبي فاخر متوهج (نفس ذهبي اللوغو الشخصي) ===== */}
      <div className="absolute top-0 left-0 w-full h-1.5 z-[100] bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 shadow-md shadow-yellow-500/30"></div>

      {/* ===== خلفيات ضبابية جمالية ===== */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* ===== شريط التنقل الرئيسي ===== */}
      <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <TamkeenLogo size={44} />
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-slate-600 dark:text-slate-300 font-black text-sm tracking-wide flex items-center gap-2">
              المنصة الرقمية للأستاذ الجزائري
              <img src="https://flagcdn.com/w40/dz.png" alt="الجزائر" className="w-5 h-auto rounded-sm shadow-sm" />
            </span>
          </div>

          <a
            href="https://wa.me/213697506846"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 mr-4 bg-emerald-50 dark:bg-emerald-900/20 px-3.5 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
          >
            <Phone size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">اتصل بالإدارة: +213697506846</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {toggleDarkMode && (
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400 hover:scale-105 transition-all shadow-sm"
              title="تبديل الوضع"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            onClick={onEnter}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <LogIn size={16} />
            <span>دخول الأستاذ</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-16 flex flex-col items-center relative z-10">

        {/* ========== 1. HERO SECTION (صورة المعلم ذو اللحية في الأعلى) ========== */}
        {/* الصورة الأولى بالصفحة: radjol_tamkeen.jpg */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mt-6 lg:mt-12 mb-20 md:mb-28">

          {/* نص الترحيب وأزرار الـ CTA */}
          <div className="lg:col-span-6 space-y-7 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs shadow-sm">
              <Sparkles size={15} className="animate-pulse text-amber-500" />
              <span>🇩🇿 منصة رقمية جزائرية 100% — الإصدار الاحترافي 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.3] tracking-tight">
              <span className="block text-slate-800 dark:text-slate-100">نحن نبني الأدوات،</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 font-black drop-shadow-sm mt-1">
                وأنت تبني الأجيال.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-xl">
              منصة <strong className="text-emerald-700 dark:text-emerald-400 font-bold">تمكين</strong> تمنح الأستاذ الجزائري القوة الرقمية المتكاملة لإدارة الكراس اليومي، رصد الغياب، التنقيط الآلي وتوليد المذكرات البيداغوجية بالذكاء الاصطناعي في بيئة واحدة متطورة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onEnter}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden flex items-center justify-center gap-3"
              >
                <UserPlus size={20} />
                <span>ابدأ الآن مجاناً — دخول المنصة</span>
              </button>

              <button
                onClick={onEnter}
                className="px-7 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2.5 shadow-sm"
              >
                <BookOpen size={19} className="text-emerald-600" />
                <span>استعراض الميزات</span>
              </button>
            </div>

            {/* اقتباس تحفيزي متجدد للأستاذ */}
            <div className="pt-4 flex items-start gap-4 bg-emerald-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-emerald-100/70 dark:border-slate-700">
              <div className="w-1.5 h-12 bg-emerald-500 rounded-full shrink-0"></div>
              <p className={`text-slate-600 dark:text-slate-300 italic font-semibold transition-opacity duration-500 text-sm leading-relaxed ${fadeQuote ? 'opacity-100' : 'opacity-0'}`}>
                "{QUOTES[quoteIndex]}"
              </p>
            </div>
          </div>

          {/* الصورة الأولى بالأعلى: radjol_tamkeen.jpg (صورة المعلم ذو اللحية) */}
          <div className="lg:col-span-6 flex justify-center animate-in zoom-in-95 duration-1000 delay-150 fade-in">
            <div className="relative w-full max-w-xl group">
              {/* وسام شارة المنصة */}
              <div className="absolute -top-4 right-4 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-emerald-100 dark:border-slate-700 flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-white">الرفيق الرقمي للأستاذ الجزائري 2026</span>
              </div>

              {/* إطار الصورة الفخم */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800">
                <img
                  src="/images/radjol_tamkeen.jpg"
                  alt="الأستاذ الجزائري يعمل على منصة تمكين الرقمية للكراس اليومي والمذكرات الذكية"
                  className="w-full h-auto object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  loading="eager"
                />
              </div>

              {/* وسام ترحيبي سفلي */}
              <div className="absolute -bottom-5 left-4 z-20 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center gap-2 border border-emerald-400/40">
                <ShieldCheck size={18} className="text-yellow-300" />
                <span className="text-xs font-black">أكثر من 15 أداة بيداغوجية موحدة</span>
              </div>
            </div>
          </div>
        </section>


        {/* ========== 2. قسم: كل ما تحتاجه في مكان واحد (مع tamkeen_wasat_wadjiha.jpg فقط دون تكرار) ========== */}
        <section className="w-full mb-20 md:mb-28">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-black mb-3">
              منظومة بيداغوجية متكاملة
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3">
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg max-w-2xl mx-auto">
              تخلّص من الأعباء الورقية والروتين اليدوي. تمكين يجمع كل ما يحتاجه الأستاذ بنقرة زر.
            </p>
          </div>

          {/* تصميم عبقري منسق: صورة الكراس اليومي الرقمي بالأستاذ الشاب بجانب قائمة الميزات الذكية */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 dark:border-slate-700/80 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* جانب الصورة: tamkeen_wasat_wadjiha.jpg (الأستاذ مع الكراس الرقمي) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-100 dark:border-slate-700">
                <img
                  src="/images/tamkeen_wasat_wadjiha.jpg"
                  alt="الكراس اليومي الرقمي — انضباط ودقة في تدوين الحصص ومتابعة الأنشطة التربوية"
                  className="w-full h-auto object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* جانب الميزات البيداغوجية المتكاملة */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-2xl">
                  <LayoutDashboard size={26} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                    الكراس اليومي وبنك الأدوات الرقمي
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    أداء أرقى .. تنظيم أفضل .. ونتائج أدق
                  </p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm md:text-base">
                تم تصميم الكراس اليومي الرقمي في تمكين ليكون مطابقاً تماماً للمعايير البيداغوجية المعتمدة في قطاع التربية الوطنية، مع إضافة الأتمتة الذكية:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-slate-800 dark:text-white">تدوين الحصص بكل سهولة</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تسجيل منظم للحصص اليومية والأفواج</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-slate-800 dark:text-white">متابعة الأنشطة التربوية</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">سجل فوري لمجريات الدروس والتقويم</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-slate-800 dark:text-white">مطابقة المعايير الرسمية</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">جاهز للتفتيش والتصدير بصيغة PDF</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-slate-800 dark:text-white">المذكرة الذكية بالـ AI</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">توليد وصياغة تحضير الدروس فورياً</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onEnter}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <span>استكشف الكراس الرقمي الآن</span>
                  <ArrowRight size={16} className="rotate-180" />
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* ========== 3. قسم: الكراس اليومي الرقمي: انضباط ودقة (صورة اللابتوب kol_ma_tahehtadj.jpg كبيرة ومنسقة) ========== */}
        <section className="w-full max-w-6xl mb-20 md:mb-28">
          <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-[2.5rem] p-6 sm:p-10 md:p-14 text-white shadow-2xl relative overflow-hidden border border-emerald-700/40">
            {/* لمعات خلفية */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-teal-400/10 rounded-full blur-[90px] pointer-events-none"></div>

            {/* العنوان ومقدمة القسم */}
            <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 text-yellow-300 text-xs font-black">
                <BookOpenCheck size={16} />
                <span>الركيزة الأساسية للأستاذ — اجتماع كل الخدمات</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                الكراس اليومي الرقمي:<br />
                انضباط <span className="text-yellow-300">ودقة واحترافية</span>
              </h2>

              <p className="text-emerald-100 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                واجهة رقمية عصرية تغنيك كلياً عن السجلات الورقية التقليدية، تجمع بين إدارة الغياب، دفتر التنقيط الآلي، المذكرة الذكية، والمساعد البيداغوجي المتكامل في شاشة واحدة منظمة.
              </p>
            </div>

            {/* صورة kol_ma_tahehtadj.jpg كبيرة وفخمة ومنسقة مركزياً */}
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 md:border-8 border-white/15 bg-slate-900/50 backdrop-blur-sm group">
                <img
                  src="/images/kol_ma_tahehtadj.jpg"
                  alt="منصة الأستاذ تمكين — اجتماع كل خدمات الأستاذ في منصة واحدة (إدارة الغياب والحضور، دفتر التنقيط الآلي، المذكرة الذكية، المساعد البيداغوجي)"
                  className="w-full h-auto object-cover rounded-xl md:rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* شريط الإجراءات أسفل الصورة الكبيرة */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-sm font-bold text-emerald-100">
                    جاهز للاستخدام الفوري لجميع أطوار التعليم الابتدائي، المتوسط، والثانوي
                  </span>
                </div>

                <button
                  onClick={onEnter}
                  className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 rounded-xl font-black text-sm transition-all shadow-lg hover:scale-105 shrink-0"
                >
                  فتح لوحة التحكم الرقمية
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* ========== 4. قسم: تقدير المعلمات ودورهن التربوي (ontha_tamkin.jpg) ========== */}
        <section className="w-full max-w-6xl mb-20 md:mb-28">
          <div className="bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-purple-50/60 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 shadow-lg border border-pink-100 dark:border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* النصوص الموجهة للمعلمات */}
              <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 rounded-full text-xs font-black">
                  <Heart size={14} className="fill-pink-500 text-pink-500" />
                  <span>التعليم رسالة وأمل — تكريم خاص للمعلمات</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight">
                  للمعلمات اللاتي يقدن التغيير التربوي
                </h3>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-medium">
                  منصة تمكين صُممت بحب لكل أستاذ وأستاذة في ربوع وطننا الحبيب. ندرك حجم التفاني والمسؤولية في تربية النشء، لذلك وضعنا بين يديكِ حلولاً ميسّرة توفر ساعات التحضير لتتفرغي لروح التعليم والإبداع.
                </p>

                <ul className="space-y-2.5 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-pink-600 dark:text-pink-400" />
                    <span>توفير ساعات طويلة من الكتابة اليدوية اليومية</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-pink-600 dark:text-pink-400" />
                    <span>مذكرات جاهزة ومنسجمة مع المناهج التربوية الرسمية</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-pink-600 dark:text-pink-400" />
                    <span>بيئة عمل مرنة تعمل على الهاتف والكمبيوتر بنفس الكفاءة</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={onEnter}
                    className="px-7 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-2xl font-black text-sm transition-all shadow-md shadow-pink-600/20"
                  >
                    انضمي إلى أسرة تمكين
                  </button>
                </div>
              </div>

              {/* صورة المعلمة: ontha_tamkin.jpg */}
              <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-700">
                  <img
                    src="/images/ontha_tamkin.jpg"
                    alt="أستاذة جزائرية تستخدم منصة تمكين الرقمية في التحضير التربوي"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ========== 5. قسم التواصل والروابط الرسمية ========== */}
        <section className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-14 shadow-xl border border-white/50 dark:border-slate-700/50 relative overflow-hidden mb-10">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/50">
                  <MessageCircle size={26} />
                </div>
                الدعم الفني والإدارة
              </h3>
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300 font-bold text-base leading-relaxed">
                  لأي استفسارات تقنية أو بيداغوجية، الإدارة في خدمتكم طوال أيام الأسبوع:
                </p>
                <a
                  href="https://wa.me/213697506846"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 justify-center"
                >
                  <Phone size={24} className="animate-pulse" />
                  <span dir="ltr">+213 697 50 68 46</span>
                </a>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-r border-slate-200/50 dark:border-slate-700/50 pt-8 md:pt-0 md:pr-12">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-600 border border-indigo-200/50 dark:border-indigo-800/50">
                  <Globe size={26} />
                </div>
                روابط رسمية هامة
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.education.gov.dz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-emerald-200 transition-all shadow-sm">
                    <Landmark size={18} className="text-emerald-600" />
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm">الموقع الرسمي لوزارة التربية الوطنية الجزائرية</span>
                  </a>
                </li>
                <li>
                  <a href="https://bem.onec.dz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-emerald-200 transition-all shadow-sm">
                    <Award size={18} className="text-emerald-600" />
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm">الديوان الوطني للامتحانات والمسابقات (ONEC)</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/Abdennoursaci118" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-indigo-200 transition-all shadow-sm">
                    <Facebook size={18} className="text-indigo-600" />
                    <span className="text-indigo-900 dark:text-indigo-300 font-bold text-xs md:text-sm">الصفحة الرسمية للأستاذ عبدالنور ساسي</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* ========== 6. الفوتر المنسق مع الشعار الدائري الواضح للأستاذ عبدالنور ساسي ========== */}
      <footer className="w-full bg-slate-900 dark:bg-black text-white py-14 px-4 md:px-8 mt-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          {/* بطاقة الشعار المنسقة الواضحة جداً */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto mb-10">
            {/* اللوغو الدائري مع إطار متوهج وواضح */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <img
                src="/images/logo_abdo.jpg"
                alt="الأستاذ عبدالنور ساسي — مطور ومؤسس منصة تمكين"
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-2xl border-4 border-yellow-400 bg-white"
                loading="lazy"
              />
            </div>

            {/* تنسيق النصوص بدقة وفخامة */}
            <div className="space-y-1 pt-2">
              <div className="inline-block px-4 py-1 bg-yellow-400/15 border border-yellow-400/30 rounded-full text-yellow-300 font-black text-base md:text-lg">
                الأستاذ عبدالنور ساسي
              </div>
              <p className="text-slate-300 font-bold text-sm">
                مطور ومصمم منصة تمكين الرقمية 🇩🇿
              </p>
              <p className="text-emerald-400 text-xs font-semibold">
                شريكك الرقمي في مسيرتك المهنية
              </p>
            </div>
          </div>

          {/* روابط سريعة ومعلومات التواصل */}
          <div className="w-full max-w-2xl py-6 border-y border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-slate-400 font-medium">
            <button onClick={onEnter} className="hover:text-yellow-300 transition-colors">الرئيسية</button>
            <span>•</span>
            <button onClick={onEnter} className="hover:text-yellow-300 transition-colors">الكراس اليومي</button>
            <span>•</span>
            <button onClick={onEnter} className="hover:text-yellow-300 transition-colors">المذكرة الذكية</button>
            <span>•</span>
            <button onClick={onEnter} className="hover:text-yellow-300 transition-colors">دفتر التنقيط</button>
            <span>•</span>
            <a href="https://tamkeen88.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">tamkeen88.vercel.app</a>
          </div>

          {/* حقوق النشر لعام 2026 */}
          <div className="pt-6 text-center space-y-1">
            <p className="text-xs text-slate-400 font-semibold">
              © 2026 منصة تمكين — نحن نبني الأدوات، وأنت تبني الأجيال 🎓
            </p>
            <p className="text-[11px] text-slate-500">
              صُنعت بكل فخر وإتقان لخدمة قطاع التعليم في الجزائر 🇩🇿
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
