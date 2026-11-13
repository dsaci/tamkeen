/**
 * ============================================================================
 * 🏛️ واجهة «المختبر البلاغي الذكي» (Smart Rhetoric Lab View)
 * منصة تمكين - التعليم الثانوي والمتوسط
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  Layers,
  Copy,
  Printer,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Feather,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookmarkCheck,
  SendHorizontal
} from 'lucide-react';
import {
  RhetoricScope,
  RhetoricLevel,
  RhetoricDetail,
  RhetoricAnalysisResult,
  RhetoricFinding,
  RHETORIC_CONCEPTS_MAP,
  BENCHMARK_EXAMPLES
} from '../../data/rhetoricRulesDB';
import { RhetoricAIService } from '../../services/rhetoricAIService';

interface Props {
  profile?: any;
}

export const SmartRhetoricLabView: React.FC<Props> = () => {
  const [inputText, setInputText] = useState<string>('');
  const [scope, setScope] = useState<RhetoricScope>('all');
  const [level, setLevel] = useState<RhetoricLevel>('secondary');
  const [detail, setDetail] = useState<RhetoricDetail>('detailed');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RhetoricAnalysisResult | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [showHighlight, setShowHighlight] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'dictionary' | 'benchmarks'>('analyzer');
  const [copied, setCopied] = useState<boolean>(false);

  // إدخال شواهد تجريبية سريعة
  const handleLoadSample = (sampleText: string) => {
    setInputText(sampleText);
    setResult(null);
    setSelectedFindingId(null);
  };

  // بدء دورة التحليل
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResult(null);
    setSelectedFindingId(null);

    try {
      const res = await RhetoricAIService.analyze(inputText, scope, level, detail);
      setResult(res);
      if (res.findings.length > 0) {
        setSelectedFindingId(res.findings[0].id);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // نسخ التقرير المنسق
  const handleCopyReport = () => {
    if (!result) return;
    let textReport = `📑 تقرير المختبر البلاغي الذكي - منصة تمكين\n`;
    textReport += `═══════════════════════════════════════════════\n`;
    textReport += `النص المحلل:\n"${result.originalText}"\n\n`;
    textReport += `ملخص النتائج: [${result.summary.totalFindings}] ظواهر بلاغية (${result.summary.bayaanCount} بيان، ${result.summary.badiCount} بديع، ${result.summary.maaniCount} معانٍ).\n\n`;

    result.findings.forEach((f, idx) => {
      textReport += `[${idx + 1}] ${f.label} (${f.categoryLabel})\n`;
      textReport += `• الموضع: "${f.span.quote}"\n`;
      textReport += `• التعليل: ${f.explanation}\n`;
      if (f.evidence.length > 0) textReport += `• القرينة: ${f.evidence.join('، ')}\n`;
      if (f.elements && Object.keys(f.elements).length > 0) {
        textReport += `• الأركان: ${Object.entries(f.elements).map(([k, v]) => `${k}: ${v}`).join(' | ')}\n`;
      }
      textReport += `• الأثر البلاغي: ${f.effect}\n`;
      if (f.educationalNote) textReport += `• توجيه بيداغوجي: ${f.educationalNote}\n`;
      textReport += `───────────────────────────────────────────────\n`;
    });

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // طباعة ورقة العمل
  const handlePrint = () => {
    window.print();
  };

  // ألوان فئات البلاغة
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'bayaan':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'badi':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      case 'maani':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  const getHighlightSpanClass = (category: string, isSelected: boolean) => {
    const base = 'px-1.5 py-0.5 rounded cursor-pointer transition-all border font-bold ';
    if (isSelected) {
      return base + 'ring-2 ring-offset-2 ring-indigo-500 bg-yellow-200 dark:bg-yellow-900/50 text-slate-900 dark:text-white border-yellow-400';
    }
    switch (category) {
      case 'bayaan':
        return base + 'bg-emerald-100/90 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300/80';
      case 'badi':
        return base + 'bg-indigo-100/90 hover:bg-indigo-200 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200 border-indigo-300/80';
      case 'maani':
        return base + 'bg-amber-100/90 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border-amber-300/80';
      default:
        return base + 'bg-slate-200 text-slate-900 border-slate-300';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      {/* ─── الرأس وشريط العنوان ─── */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 rounded-[2.5rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Compass className="text-emerald-400" size={26} />
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 tracking-wider">
                منظومة المعالجة البلاغية 1.0
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                علم البيان • علم البديع • علم المعاني
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              المختبر البلاغي الذكي
              <Sparkles className="text-amber-400" size={24} />
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-normal max-w-2xl leading-relaxed">
              تحليل سياقي عميق للنصوص الأدبية، رصد دقيق للصور البيانية والمحسنات البديعية والأساليب، مع تفكيك الأركان وتوضيح القرائن وصياغة إجابات بيداغوجية نموذجية للبكالوريا.
            </p>
          </div>

          {/* التبويبات العلوية */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/60 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Feather size={16} />
              <span>مختبر التحليل</span>
            </button>

            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dictionary'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen size={16} />
              <span>دليل البلاغة</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'benchmarks'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers size={16} />
              <span>بنك الشواهد المعتمدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── التبويب الأول: مختبر التحليل ─── */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* الجانب الأيمن / الأوسط: منطقة الإدخال والتحكم */}
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              {/* خيارات الضبط السريع */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                {/* 1. نطاق التحليل */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    نطاق التحليل البلاغي
                  </label>
                  <select
                    value={scope}
                    onChange={e => setScope(e.target.value as RhetoricScope)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="all">تحليل بلاغي شامل (بيان + بديع + معانٍ)</option>
                    <option value="bayaan">الصور البيانية فقط (تشبيه، استعارة، كناية، مجاز)</option>
                    <option value="badi">المحسنات البديعية فقط (طباق، مقابلة، جناس، تصريع)</option>
                    <option value="maani">علم المعاني (القصر، الإنشاء الطلبي، التوكيد)</option>
                  </select>
                </div>

                {/* 2. المستوى التعليمي */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    المستوى التعليمي المستهدف
                  </label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as RhetoricLevel)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="secondary">الثانوي والبكالوريا (إجابة نموذجية رسمية)</option>
                    <option value="middle">التعليم المتوسط (شرح مدرسي مبسط)</option>
                    <option value="academic">أكاديمي موسع للأستاذ (وجوه الخلاف والتفريع)</option>
                    <option value="elementary">مبسط جداً للمبتدئ</option>
                  </select>
                </div>

                {/* 3. نمط التفصيل */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    نمط الصياغة والتقرير
                  </label>
                  <select
                    value={detail}
                    onChange={e => setDetail(e.target.value as RhetoricDetail)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="detailed">مفصل بالقرائن والأركان وتوجيهات التصحيح</option>
                    <option value="concise">موجز ومركز (نوع الظاهرة والأثر فقط)</option>
                  </select>
                </div>
              </div>

              {/* مربع كتابة النص */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Feather size={14} className="text-indigo-500" />
                    أدخل النص الأدبي، الآية الكريمة، أو البيت الشعري:
                  </span>
                  <div className="flex items-center gap-2">
                    {inputText && (
                      <button
                        onClick={() => {
                          setInputText('');
                          setResult(null);
                        }}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        مسح
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="مثال: عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ ... وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ&#10;أو: إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ&#10;أو أي فقرة نثرية تريد تحليل صورها ومحسناتها..."
                    className="w-full bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-base font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all leading-relaxed custom-scrollbar"
                  />
                </div>

                {/* أمثلة سريعة للتجربة */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-400">شواهد سريعة:</span>
                  {[
                    { label: 'استعارة القرآن (واشتعل الرأس)', text: 'وَاشْتَعَلَ الرَّأْسُ شَيْبًا' },
                    { label: 'قصر إنما (العلماء)', text: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ' },
                    { label: 'تصريع المتنبي (العزائم)', text: 'عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ ... وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ' },
                    { label: 'مقابلة تامة (سورة الليل)', text: 'فَأَمَّا مَنْ أَعْطَى وَاتَّقَى * وَصَدَّقَ بِالْحُسْنَى * فَسَنُيَسِّرُهُ لِلْيُسْرَى * وَأَمَّا مَنْ بَخِلَ وَاسْتَغْنَى * وَكَذَّبَ بِالْحُسْنَى * فَسَنُيَسِّرُهُ لِلْعُسْرَى' },
                    { label: 'نص إخباري مباشر (اختبار الخلو)', text: 'قَرَأْتُ الْكِتَابَ أَمْسِ كَامِلاً وَكَتَبْتُ مُلَخَّصَهُ عَلَى الدَّفْتَرِ.' }
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLoadSample(s.text)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition-colors font-bold cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* زر التنفيذ */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !inputText.trim()}
                    className={`px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-lg flex items-center gap-3 transition-all cursor-pointer ${
                      isLoading || !inputText.trim()
                        ? 'bg-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600 hover:shadow-indigo-500/25 active:scale-95'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>جاري فحص التراكيب والقرائن البلاغية...</span>
                      </>
                    ) : (
                      <>
                        <SendHorizontal size={18} />
                        <span>بدء التحليل البلاغي الذكي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── منطقة عرض النتائج ─── */}
            {result && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* 1. ملخص الإحصائيات البلاغية */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center gap-1.5">
                      <Cpu size={14} className="text-emerald-500" />
                      <span>نمط التحليل: {result.engineUsed === 'ai_deep_context' ? 'الذكاء الاصطناعي السياقي المتقدم' : 'المحرك المحلي الدقيق المنضبط'}</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black">
                      تقدير النص: <span className="text-indigo-600 dark:text-indigo-400">{result.summary.textTypeEstimate}</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-black border border-indigo-200 dark:border-indigo-800">
                      إجمالي الظواهر: {result.summary.totalFindings}
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-800">
                      علم البيان: {result.summary.bayaanCount}
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-black border border-amber-200 dark:border-amber-800">
                      علم المعاني: {result.summary.maaniCount}
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-black border border-purple-200 dark:border-purple-800">
                      علم البديع: {result.summary.badiCount}
                    </div>
                  </div>

                  {/* أزرار التصدير والنسخ */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={handleCopyReport}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="نسخ التقرير كاملاً"
                    >
                      {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{copied ? 'تم النسخ!' : 'نسخ التقرير'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="طباعة ورقة عمل"
                    >
                      <Printer size={14} />
                      <span>طباعة</span>
                    </button>
                  </div>
                </div>

                {/* 2. النص التفاعلي المظلل */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">النص التفاعلي وخريطة الظواهر:</span>
                      <span className="text-xs text-slate-400 font-medium">(انقر على أي عبارة ملونة لعرض بطاقتها المباشرة)</span>
                    </div>

                    <button
                      onClick={() => setShowHighlight(!showHighlight)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {showHighlight ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{showHighlight ? 'إخفاء التظليل' : 'إظهار التظليل'}</span>
                    </button>
                  </div>

                  {/* محتوى النص مع التظليل */}
                  <div className="p-6 bg-slate-50/70 dark:bg-slate-950/70 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 text-lg font-bold leading-loose text-slate-800 dark:text-slate-200">
                    {!showHighlight || result.findings.length === 0 ? (
                      <p className="whitespace-pre-wrap">{result.originalText}</p>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {result.findings.map(finding => (
                          <span
                            key={finding.id}
                            onClick={() => setSelectedFindingId(finding.id)}
                            className={getHighlightSpanClass(finding.category, selectedFindingId === finding.id)}
                            title={`${finding.label} (${finding.categoryLabel})`}
                          >
                            {finding.span.quote}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* مفتاح الألوان (Color Legend) */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-slate-500">
                    <span className="text-slate-400">دلالات الألوان:</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span>علم البيان (أخضر زمردي)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                      <span>علم البديع (نيلي)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span>علم المعاني (كهرماني)</span>
                    </span>
                  </div>
                </div>

                {/* 3. بطاقات الظواهر البلاغية */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <BookmarkCheck className="text-emerald-500" size={20} />
                    <span>البطاقات التحليلية المفككة ({result.findings.length} مواضع)</span>
                  </h3>

                  {result.findings.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                      <Info size={36} className="text-slate-400 mx-auto" />
                      <h4 className="font-black text-slate-700 dark:text-slate-300">لم تُكتشف ظاهرة بلاغية واضحة في النص</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        النص المدخل يغلب عليه الأسلوب التقريري المباشر، أو تخلو تراكيبه من الصور البيانية والمحسنات المتكلفة، وهذا يعكس سلامة المحرك في الامتناع عن اختلاق صور غير موجودة.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5">
                      {result.findings.map(finding => {
                        const isSelected = selectedFindingId === finding.id;
                        return (
                          <div
                            key={finding.id}
                            id={finding.id}
                            onClick={() => setSelectedFindingId(finding.id)}
                            className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg'
                                : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                            }`}
                          >
                            {/* الرأس: اسم الظاهرة والتصنيف والشارة */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-black border ${getCategoryBadgeClass(finding.category)}`}>
                                  {finding.categoryLabel}
                                </span>
                                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                                  {finding.label}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  درجة الثقة: {finding.confidence.level === 'high' ? 'عالية ومؤكدة' : 'احتمالية سياقية'}
                                </span>
                              </div>
                            </div>

                            {/* العبارة المقتبسة */}
                            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 mb-4">
                              <span className="text-xs font-black text-slate-400 block mb-1">العبارة موضع الشاهد:</span>
                              <p className="text-base font-black text-indigo-700 dark:text-indigo-400">
                                "{finding.span.quote}"
                              </p>
                            </div>

                            {/* تفاصيل التحليل والأركان */}
                            <div className="space-y-3.5 text-sm">
                              <div>
                                <span className="font-black text-slate-700 dark:text-slate-300">التعليل البلاغي: </span>
                                <span className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                  {finding.explanation}
                                </span>
                              </div>

                              {/* تفكيك الأركان إن وجدت */}
                              {finding.elements && Object.keys(finding.elements).length > 0 && (
                                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                                  <span className="text-xs font-black text-indigo-900 dark:text-indigo-300 block">
                                    تفكيك الأركان والعناصر:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {Object.entries(finding.elements).map(([k, v]) => (
                                      <div key={k} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
                                        <span className="font-black text-slate-600 dark:text-slate-400 shrink-0">{k}:</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{v}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* القرينة */}
                              {finding.evidence.length > 0 && (
                                <div>
                                  <span className="font-black text-slate-700 dark:text-slate-300">القرينة المانعة / اللفظية: </span>
                                  <span className="text-slate-600 dark:text-slate-400 font-bold">
                                    {finding.evidence.join('، ')}
                                  </span>
                                </div>
                              )}

                              {/* الأثر البلاغي */}
                              <div>
                                <span className="font-black text-slate-700 dark:text-slate-300">الأثر البلاغي والجمالي: </span>
                                <span className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                  {finding.effect}
                                </span>
                              </div>

                              {/* الملاحظة البيداغوجية إن وجدت */}
                              {finding.educationalNote && (
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs">
                                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-black text-amber-900 dark:text-amber-300">توجيه بيداغوجي للامتحان: </span>
                                    <span className="text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                                      {finding.educationalNote}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* نصائح عامة للمنهج والامتحان */}
                {result.pedagogicalAdvice && result.pedagogicalAdvice.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-4">
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-black text-emerald-900 dark:text-emerald-300 text-sm mb-1">
                        إرشادات منهجية للأستاذ والتلميذ في البكالوريا:
                      </h4>
                      <ul className="text-xs text-emerald-800 dark:text-emerald-400 space-y-1 font-bold leading-relaxed list-disc list-inside">
                        {result.pedagogicalAdvice.map((adv, idx) => (
                          <li key={idx}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── التبويب الثاني: دليل البلاغة المدرسية ─── */}
      {activeTab === 'dictionary' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              قاموس المصطلحات البلاغية والمنهاج الوزاري
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mb-6">
              مرجع بيداغوجي شامل يوضح لكل مصطلح: تعريفه الدقيق، أركانه الأساسية، الأخطاء الشائعة في الامتحانات، والأثر البلاغي المعتمد.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.values(RHETORIC_CONCEPTS_MAP).map(concept => (
                <div
                  key={concept.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {concept.name}
                    </h3>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(concept.category)}`}>
                      {concept.category === 'bayaan' ? 'علم البيان' : concept.category === 'badi' ? 'علم البديع' : 'علم المعاني'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {concept.definition}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div>
                      <span className="font-black text-slate-500">الأركان الأساسية: </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{concept.keyElements.join(' • ')}</span>
                    </div>
                    <div>
                      <span className="font-black text-rose-500">الخطأ الشائع: </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{concept.commonMistakes}</span>
                    </div>
                    <div>
                      <span className="font-black text-emerald-600">الأثر البلاغي المعتمد: </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{concept.typicalEffect}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── التبويب الثالث: بنك الشواهد المعتمدة ─── */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              بنك الشواهد البلاغية ونصوص المعايرة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mb-6">
              مجموعة منتقاة من الآيات والأبيات الشعرية الكلاسيكية والنصوص النثرية لتدريب التلاميذ وتجربة دقة المحرك البلاغي.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BENCHMARK_EXAMPLES.map(ex => (
                <div
                  key={ex.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {ex.source}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {ex.expectedFindings.length > 0 ? `${ex.expectedFindings.length} ظواهر متوقعة` : 'نص تقريري خالٍ'}
                      </span>
                    </div>

                    <p className="text-base font-black text-slate-900 dark:text-white leading-relaxed">
                      "{ex.text}"
                    </p>

                    {ex.expectedFindings.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {ex.expectedFindings.map((ef, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                          >
                            {ef.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-slate-400">نص إخباري مباشر خالٍ من البلاغة لضبط المعايرة.</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      handleLoadSample(ex.text);
                      setActiveTab('analyzer');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60"
                  >
                    <SendHorizontal size={14} />
                    <span>تحليل هذا الشاهد في المختبر</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
