import React, { useState } from 'react';
import {
  Feather, Sparkles, BookOpen, Music, GraduationCap, CheckCircle2,
  Printer, ArrowLeft, ArrowRight, Copy, Check, RefreshCw, AlertCircle,
  HelpCircle, Award, Layers, Zap, PenTool, Share2, Compass
} from 'lucide-react';
import { TeacherProfile } from '../../types';
import {
  POETIC_METERS,
  ALGERIAN_CURRICULUM_POEMS,
  BACCALAUREATE_PROSODY_EXAMS,
  ZIHAF_ILLA_COMPARISON,
  analyzePoeticVerse,
  convertToArudWriting,
  extractProsodySymbols,
  PoeticMeter,
  VerseAnalysisResult,
  AlgerianCurriculumPoem
} from '../utils/prosodyEngine';

interface Props {
  profile?: TeacherProfile;
}

export default function FaraheedyProsodyView({ profile }: Props) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'analyzer' | 'encyclopedia' | 'baccalaureate' | 'wizard'>('analyzer');

  // Analyzer State
  const [firstHemistich, setFirstHemistich] = useState('هَلْ غَادَرَ الشُّعَرَاءُ مِنْ مُتَرَدَّمِ');
  const [secondHemistich, setSecondHemistich] = useState('أَمْ هَلْ عَرَفْتَ الدَّارَ بَعْدَ تَوَهُّمِ');
  const [selectedMeterOverride, setSelectedMeterOverride] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<VerseAnalysisResult | null>(() => {
    return analyzePoeticVerse('هَلْ غَادَرَ الشُّعَرَاءُ مِنْ مُتَرَدَّمِ', 'أَمْ هَلْ عَرَفْتَ الدَّارَ بَعْدَ تَوَهُّمِ', 'kamel');
  });

  // Baccalaureate State
  const [activeBacExamIndex, setActiveBacExamIndex] = useState(0);
  const [showBacModelAnswer, setShowBacModelAnswer] = useState(false);

  // Encyclopedia State
  const [searchMeterQuery, setSearchMeterQuery] = useState('');
  const [selectedEncyclopediaMeter, setSelectedEncyclopediaMeter] = useState<PoeticMeter>(POETIC_METERS[0]);

  // Wizard State
  const [wizardMeterId, setWizardMeterId] = useState('kamel');
  const [wizardVerse, setWizardVerse] = useState('');

  // Copy Feedback
  const [copiedText, setCopiedText] = useState(false);

  // Trigger Analysis
  const handleAnalyze = () => {
    if (!firstHemistich.trim()) {
      alert('يرجى إدخال صدر البيت الشعري على الأقل');
      return;
    }
    const result = analyzePoeticVerse(firstHemistich, secondHemistich, selectedMeterOverride || undefined);
    setAnalysisResult(result);
  };

  // Load Algerian Curriculum Preset
  const handleLoadCurriculumPreset = (poem: AlgerianCurriculumPoem) => {
    setFirstHemistich(poem.firstHemistich);
    setSecondHemistich(poem.secondHemistich);
    setSelectedMeterOverride(poem.meterId);
    const result = analyzePoeticVerse(poem.firstHemistich, poem.secondHemistich, poem.meterId);
    setAnalysisResult(result);
  };

  // Copy Table
  const handleCopyAnalysis = () => {
    if (!analysisResult) return;
    const text = `
تحليل ميزان تمكين العروضي (مستوحى من الفراهيدي):
البيت:
${analysisResult.verseOriginal.firstHemistich} ... ${analysisResult.verseOriginal.secondHemistich}
البحر: ${analysisResult.meter.name} (${analysisResult.meter.rhymeKey})
الكتابة العروضية:
الصدر: ${analysisResult.firstHemistich.arudWriting}
العجز: ${analysisResult.secondHemistich.arudWriting}
الرموز الصوتية:
الصدر: ${analysisResult.firstHemistich.symbols}
العجز: ${analysisResult.secondHemistich.symbols}
القافية: ${analysisResult.qafiyah.word} (${analysisResult.qafiyah.type})
الروي: ${analysisResult.qafiyah.rawiy} (${analysisResult.qafiyah.rawiyMovement})
`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Print Card
  const handlePrintCard = () => {
    window.print();
  };

  const filteredMeters = POETIC_METERS.filter(m =>
    m.name.includes(searchMeterQuery) ||
    m.rhymeKey.includes(searchMeterQuery) ||
    m.gradeRelevance.includes(searchMeterQuery)
  );

  return (
    <div className="space-y-8 animate-in fade-in pb-24" dir="rtl">

      {/* ═══ TOP BANNER ═══ */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-indigo-900 rounded-[2.5rem] p-7 md:p-10 text-white shadow-xl shadow-emerald-950/15 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner shrink-0">
              <Feather size={36} className="text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="bg-amber-400/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-300/30 backdrop-blur-sm flex items-center gap-1">
                  <Sparkles size={12} />
                  مستوحى من نظام «الفراهيدي» لحوسبة العروض
                </span>
                <span className="bg-emerald-500/25 text-emerald-200 text-xs font-black px-3 py-1 rounded-full border border-emerald-400/30">
                  منهاج اللغة العربية وآدابها الجزائري
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                ميزان تمكين العروضي وموسيقى الشعر 🪶
              </h1>
              <p className="text-emerald-100/90 text-xs md:text-sm font-bold mt-1 max-w-2xl leading-relaxed">
                التشريح الآلي للأبيات الشعرية، استخراج الكتابة العروضية والرموز، تقطيع التفاعيل ورصد الزحافات والعلل، مع بنك نماذج البكالوريا ونصوص المنهاج.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-black/25 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <div className="text-right">
              <span className="text-[10px] text-amber-200 block font-bold">علم العروض التفاعلي</span>
              <span className="text-xs font-black text-white">16 بحراً خليلياً + التفعيلة</span>
            </div>
            <Music size={22} className="text-amber-300" />
          </div>
        </div>

        {/* Navigation Tabs Pill Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'analyzer'
                ? 'bg-white text-emerald-900 shadow-lg shadow-black/10 scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <PenTool size={16} />
            <span>المشرح العروضي الآلي</span>
          </button>

          <button
            onClick={() => setActiveTab('encyclopedia')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'encyclopedia'
                ? 'bg-white text-emerald-900 shadow-lg shadow-black/10 scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <BookOpen size={16} />
            <span>موسوعة البحور والزحافات</span>
          </button>

          <button
            onClick={() => setActiveTab('baccalaureate')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'baccalaureate'
                ? 'bg-white text-emerald-900 shadow-lg shadow-black/10 scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <GraduationCap size={16} />
            <span>نماذج وتطبيقات البكالوريا</span>
          </button>

          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'wizard'
                ? 'bg-white text-emerald-900 shadow-lg shadow-black/10 scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Compass size={16} />
            <span>معالج نظم الشعر والتفعيلة</span>
          </button>
        </div>
      </div>

      {/* ═══ TAB 1: THE INTERACTIVE METER ANALYZER ═══ */}
      {activeTab === 'analyzer' && (
        <div className="space-y-6">

          {/* Quick Preset Selector from Algerian Curriculum */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    نماذج جاهزة من مقررات اللغة العربية في المنهاج الجزائري
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    انقر على أي بيت شعري لتحميله وتشريحه فورياً
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ALGERIAN_CURRICULUM_POEMS.map((poem) => (
                <button
                  key={poem.id}
                  onClick={() => handleLoadCurriculumPreset(poem)}
                  className="p-3.5 rounded-2xl border text-right transition-all group bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-slate-200/70 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                      {poem.level}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{poem.poet}</span>
                  </div>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {poem.firstHemistich}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {poem.secondHemistich}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form for Custom Verse */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <PenTool size={20} className="text-emerald-600" />
                  <span>إدخال البيت الشعري للتشريح والوزن</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  أدخل الشطر الأول (الصدر) والشطر الثاني (العجز) مشكولين للحصول على أعلى دقة عروضية.
                </p>
              </div>

              {/* Force Meter Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  تحديد البحر يدوياً (اختياري):
                </label>
                <select
                  value={selectedMeterOverride}
                  onChange={(e) => setSelectedMeterOverride(e.target.value)}
                  className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">اكتشاف البحر آلياً (موصى به)</option>
                  {POETIC_METERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Hemistich */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black text-slate-700 dark:text-slate-300">
                  <span>الشطر الأول (الصَّدْر):</span>
                  <span className="text-[10px] text-slate-400">ينتهي بتفعيلة العَرُوض</span>
                </div>
                <input
                  type="text"
                  value={firstHemistich}
                  onChange={(e) => setFirstHemistich(e.target.value)}
                  placeholder="مثال: هَلْ غَادَرَ الشُّعَرَاءُ مِنْ مُتَرَدَّمِ"
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base md:text-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-right transition-all"
                />
              </div>

              {/* Second Hemistich */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black text-slate-700 dark:text-slate-300">
                  <span>الشطر الثاني (العَجُز):</span>
                  <span className="text-[10px] text-slate-400">ينتهي بتفعيلة الضَّرْب والقافية</span>
                </div>
                <input
                  type="text"
                  value={secondHemistich}
                  onChange={(e) => setSecondHemistich(e.target.value)}
                  placeholder="مثال: أَمْ هَلْ عَرَفْتَ الدَّارَ بَعْدَ تَوَهُّمِ"
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base md:text-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-right transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAnalyze}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                >
                  <Sparkles size={17} />
                  <span>وزن وتشريح البيت عروضياً ⚡</span>
                </button>
                <button
                  onClick={() => {
                    setFirstHemistich('');
                    setSecondHemistich('');
                    setAnalysisResult(null);
                  }}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                >
                  تفريغ الحقول
                </button>
              </div>

              {analysisResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAnalysis}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                  >
                    {copiedText ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copiedText ? 'تم النسخ!' : 'نسخ التقطيع'}</span>
                  </button>
                  <button
                    onClick={handlePrintCard}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Printer size={14} />
                    <span>طباعة بطاقة التقطيع</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ═══ ANALYSIS RESULT CARD ═══ */}
          {analysisResult && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">

              {/* Detected Meter Header Bar */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 md:p-8 text-white relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-0.5 rounded-full">
                        بحر {analysisResult.meter.type}
                      </span>
                      <span className="text-emerald-100 text-xs font-bold">
                        نسبة المطابقة الموسيقية: {analysisResult.confidenceScore}%
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">
                      {analysisResult.meter.name}
                    </h2>
                    <p className="text-amber-200 font-bold text-xs md:text-sm mt-1">
                      مفتاح البحر: «{analysisResult.meter.rhymeKey}»
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-right">
                    <span className="text-[10px] text-emerald-200 block font-bold">المقرر الدراسي</span>
                    <span className="text-xs font-black text-white">{analysisResult.meter.gradeRelevance}</span>
                  </div>
                </div>
              </div>

              {/* Four-Layer Official Prosodic Table */}
              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Layers size={18} className="text-emerald-600" />
                    <span>جدول التقطيع العروضي التشريحي (الأسطر الأربعة الرسمية)</span>
                  </h3>

                  {/* 1. الصَّدْر (First Hemistich) Table */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-700 dark:text-emerald-400 pb-1">
                      <span>الشطر الأول: الصَّدْر (العَرُوض)</span>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-center text-xs md:text-sm">
                        <tbody>
                          <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold">
                            <td className="p-3 w-28 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black">البيت الإملائي</td>
                            <td className="p-3 font-black text-slate-900 dark:text-white text-base">
                              {analysisResult.firstHemistich.originalText}
                            </td>
                          </tr>
                          <tr className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-slate-200 dark:border-slate-700 font-bold">
                            <td className="p-3 w-28 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 font-black">الكتابة العروضية</td>
                            <td className="p-3 font-mono text-emerald-800 dark:text-emerald-200 text-base font-black tracking-wide">
                              {analysisResult.firstHemistich.arudWriting}
                            </td>
                          </tr>
                          <tr className="bg-amber-50/50 dark:bg-amber-950/20 border-b border-slate-200 dark:border-slate-700">
                            <td className="p-3 w-28 bg-amber-100/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-black">الرموز الصوتية</td>
                            <td className="p-3 font-mono text-lg font-black tracking-[0.25em] text-amber-600 dark:text-amber-400">
                              {analysisResult.firstHemistich.symbols}
                            </td>
                          </tr>
                          <tr className="bg-indigo-50/50 dark:bg-indigo-950/20">
                            <td className="p-3 w-28 bg-indigo-100/60 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-300 font-black">التفاعيل والزحاف</td>
                            <td className="p-3">
                              <div className="flex flex-wrap justify-center gap-3">
                                {analysisResult.firstHemistich.feet.map((f, idx) => (
                                  <div key={idx} className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm text-center">
                                    <span className="block font-black text-indigo-700 dark:text-indigo-300 text-sm">{f.actual}</span>
                                    <span className="block text-[10px] text-slate-400 font-mono tracking-wider">{f.symbols}</span>
                                    {f.zihafOrIlla && (
                                      <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                                        {f.zihafOrIlla}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. العَجُز (Second Hemistich) Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-indigo-700 dark:text-indigo-400 pb-1">
                      <span>الشطر الثاني: العَجُز (الضَّرْب والقافية)</span>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-center text-xs md:text-sm">
                        <tbody>
                          <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold">
                            <td className="p-3 w-28 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black">البيت الإملائي</td>
                            <td className="p-3 font-black text-slate-900 dark:text-white text-base">
                              {analysisResult.secondHemistich.originalText}
                            </td>
                          </tr>
                          <tr className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-slate-200 dark:border-slate-700 font-bold">
                            <td className="p-3 w-28 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 font-black">الكتابة العروضية</td>
                            <td className="p-3 font-mono text-emerald-800 dark:text-emerald-200 text-base font-black tracking-wide">
                              {analysisResult.secondHemistich.arudWriting}
                            </td>
                          </tr>
                          <tr className="bg-amber-50/50 dark:bg-amber-950/20 border-b border-slate-200 dark:border-slate-700">
                            <td className="p-3 w-28 bg-amber-100/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-black">الرموز الصوتية</td>
                            <td className="p-3 font-mono text-lg font-black tracking-[0.25em] text-amber-600 dark:text-amber-400">
                              {analysisResult.secondHemistich.symbols}
                            </td>
                          </tr>
                          <tr className="bg-indigo-50/50 dark:bg-indigo-950/20">
                            <td className="p-3 w-28 bg-indigo-100/60 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-300 font-black">التفاعيل والزحاف</td>
                            <td className="p-3">
                              <div className="flex flex-wrap justify-center gap-3">
                                {analysisResult.secondHemistich.feet.map((f, idx) => (
                                  <div key={idx} className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm text-center">
                                    <span className="block font-black text-indigo-700 dark:text-indigo-300 text-sm">{f.actual}</span>
                                    <span className="block text-[10px] text-slate-400 font-mono tracking-wider">{f.symbols}</span>
                                    {f.zihafOrIlla && (
                                      <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                                        {f.zihafOrIlla}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Rhyme (Qafiyah) & Pedagogical Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Qafiyah & Rawiy Card */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-xl">
                        <Music size={18} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        دراسة القافية وحرف الرَّوِي
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500 font-bold">كلمة القافية:</span>
                        <span className="font-black text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-3 py-1 rounded-lg">
                          «{analysisResult.qafiyah.word}»
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500 font-bold">حرف الرَّوِي:</span>
                        <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          حرف ({analysisResult.qafiyah.rawiy})
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500 font-bold">حركة الرَّوِي (المَجْرَى):</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {analysisResult.qafiyah.rawiyMovement}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500 font-bold">نوع القافية:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {analysisResult.qafiyah.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-500 font-bold">سلامة الإيقاع والسناد:</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black">
                          <CheckCircle2 size={14} />
                          {analysisResult.qafiyah.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pedagogical Guidance Card */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl">
                        <GraduationCap size={18} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        إرشادات تربوية للأستاذ والتلميذ (وفق المنهاج)
                      </h4>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                      {analysisResult.pedagogicalNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB 2: ENCYCLOPEDIA OF METERS & ZIHAFAT ═══ */}
      {activeTab === 'encyclopedia' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                دليل بحور الشعر العربي الستة عشر (الخليلية والمحدثة)
              </h2>
              <p className="text-xs text-slate-500">
                استعرض تفاصيل ومفاتيح كل بحر وتفعيلاته المقررة في المنهاج الجزائري
              </p>
            </div>
            <input
              type="text"
              value={searchMeterQuery}
              onChange={(e) => setSearchMeterQuery(e.target.value)}
              placeholder="ابحث عن بحر شعري..."
              className="text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right w-full md:w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeters.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedEncyclopediaMeter(m)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedEncyclopediaMeter.id === m.id
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-500 shadow-md scale-[1.01]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 rounded-full">
                      بحر {m.type}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {m.name}
                    </h3>
                  </div>
                  <Music size={20} className="text-emerald-500" />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl mb-3 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">مفتاح البحر:</span>
                  <p className="text-xs font-black text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {m.rhymeKey}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>التفعيلات:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{m.feet.join(' ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>الرموز:</span>
                    <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">{m.idealPattern}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  📚 {m.gradeRelevance}
                </div>
              </div>
            ))}
          </div>

          {/* ═══ ACADEMIC GUIDE: ZIHAF VS ILLA COMPARISON & RULES ═══ */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8 mt-8">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <span className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-black px-3 py-1 rounded-full">
                الدليل التأصيلي الأكاديمي لعلم العروض
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-2">
                الزحاف والعلة: المفاهيم، الأحكام، والفروق الجوهرية (وفق المراجع الجامعية ومناهج وزارة التربية)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                تأصيل نظري وتطبيقي شامل مستند إلى محاضرات العروض وموسيقى الشعر بجامعة قسنطينة وبسكرة، ومقررات التعليم الثانوي الجزائري.
              </p>
            </div>

            {/* Zihaf & Illa Explanations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Al-Zihaf */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">أولاً: الزِّحَاف (تعريفه وأحكامه)</h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">لغةً: الإسراع والمشي السريع</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-bold">
                  <strong>اصطلاحاً:</strong> تغيير يختص بثواني الأسباب الخفيفة أو الثقيلة، ويقع في حشو البيت وفي العروض والضرب، وهو <strong>غير لازم</strong> (يجوز للشاعر أن يأتي به في بيت ويتركه في بيت آخر دون إلزام).
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 text-xs">
                  <p className="font-black text-emerald-700 dark:text-emerald-400">1. الزحاف المفرد (تغيير واحد في التفعيلة):</p>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 font-bold pr-2">
                    <li>• <strong>الخَبْن:</strong> حذف الثاني الساكن (مُسْتَفْعِلُنْ ← مُتَفْعِلُنْ //0//0، فَاعِلُنْ ← فَعِلُنْ ///0).</li>
                    <li>• <strong>الإضْمَار:</strong> تسكين الثاني المتحرك (مُتَفَاعِلُنْ ← مُتْفَاعِلُنْ /0/0//0).</li>
                    <li>• <strong>الطَّي:</strong> حذف الرابع الساكن (مُسْتَفْعِلُنْ ← مُسْتَعِلُنْ /0///0).</li>
                    <li>• <strong>الوَقْص:</strong> حذف الثاني المتحرك (مُتَفَاعِلُنْ ← مُفَاعِلُنْ //0//0).</li>
                    <li>• <strong>العَصْب:</strong> تسكين الخامس المتحرك (مُفَاعَلَتُنْ في الوافر ← مُفَاعَلْتُنْ //0/0/0).</li>
                    <li>• <strong>القَبْض:</strong> حذف الخامس الساكن (فَعُولُنْ ← فَعُولُ //0/، مَفَاعِيلُنْ ← مَفَاعِلُنْ //0//0).</li>
                    <li>• <strong>الكَفّ:</strong> حذف السابع الساكن (فَاعِلاتُنْ ← فَاعِلاتُ /0//0/).</li>
                  </ul>

                  <p className="font-black text-indigo-700 dark:text-indigo-400 pt-2">2. الزحاف المزدوج (المركب - اجتماع زحافين):</p>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 font-bold pr-2">
                    <li>• <strong>الخَبَل:</strong> اجتماع الخبن والطي (حذف الثاني والرابع الساكنين).</li>
                    <li>• <strong>الخَزْل:</strong> اجتماع الإضمار والطي (تسكين الثاني وحذف الرابع الساكن).</li>
                    <li>• <strong>الشَّكْل:</strong> اجتماع الخبن والكف (حذف الثاني والسابع الساكنين).</li>
                    <li>• <strong>النَّقْص:</strong> اجتماع العصب والكف (تسكين الخامس وحذف السابع الساكن).</li>
                  </ul>
                </div>
              </div>

              {/* 2. Al-Illa */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-xl">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">ثانياً: العِلَّة (تعريفها وأحكامها)</h4>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">اصطلاحاً: تغيير يطرأ على الأسباب والأوتاد معاً</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-bold">
                  <strong>حكمها ومحلها:</strong> تختص غالباً بالعَروض والضَّرب (آخر تفعيلة في الشطرين)، وهي <strong>لازمة</strong>؛ فإذا التزمها الشاعر في أول بيت من القصيدة وجب عليه الاستمرار فيها في سائر أبياتها.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 text-xs">
                  <p className="font-black text-amber-700 dark:text-amber-400">1. علل بالزيادة (زيادة حرف أو أكثر في المجزوء):</p>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 font-bold pr-2">
                    <li>• <strong>التَّرْفِيل:</strong> زيادة سبب خفيف على ما آخره وتد مجموع (مُتَفَاعِلُنْ ← مُتَفَاعِلاتُنْ).</li>
                    <li>• <strong>التَّذْيِيل:</strong> زيادة حرف ساكن على ما آخره وتد مجموع (مُسْتَفْعِلُنْ ← مُسْتَفْعِلانْ).</li>
                    <li>• <strong>التَّسْبِيغ (الإسباغ):</strong> زيادة حرف ساكن على ما آخره سبب خفيف (فَاعِلاتُنْ ← فَاعِلاتَانْ).</li>
                  </ul>

                  <p className="font-black text-rose-700 dark:text-rose-400 pt-2">2. علل بالنقص (بالحذف أو التسكين):</p>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 font-bold pr-2">
                    <li>• <strong>الحَذْف:</strong> حذف سبب خفيف من آخر التفعيلة (فَعُولُنْ ← فَعُو //0، مَفَاعِيلُنْ ← مَفَاعِي).</li>
                    <li>• <strong>القَطْف:</strong> اجتماع العَصْب والحذف في الوافر (مُفَاعَلَتُنْ ← فَعُولُنْ //0/0).</li>
                    <li>• <strong>القَطْع:</strong> حذف ساكن الوتد المجموع وتسكين ما قبله (فَاعِلُنْ ← فِعْلُنْ /0/0، مُتَفَاعِلُنْ ← مُتَفَاعِلْ).</li>
                    <li>• <strong>القَصْر:</strong> حذف ساكن السبب الخفيف وتسكين متحركه (فَعُولُنْ ← فَعُولْ //00، فَاعِلاتُنْ ← فَاعِلاتْ).</li>
                    <li>• <strong>البَتْر:</strong> اجتماع الحذف والقطع (فَعُولُنْ ← فَعْ /0).</li>
                    <li>• <strong>الصَّلْم:</strong> حذف الوتد المفروق كاملاً من مَفْعُولاتُ (لتصير مَفْعُو وتنقل إلى فِعْلُنْ).</li>
                    <li>• <strong>الكَسْف:</strong> حذف السابع المتحرك من مَفْعُولاتُ (لتصير مَفْعُولا).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Complete Comparative Table */}
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Layers size={18} className="text-emerald-600" />
                <span>الجدول المقارن الجامع بين الزحاف والعلة:</span>
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <table className="w-full text-right text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3.5 w-1/4">وجه المقارنة</th>
                      <th className="p-3.5 w-3/8 text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">الزِّحَاف</th>
                      <th className="p-3.5 w-3/8 text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20">العِلَّة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {ZIHAF_ILLA_COMPARISON.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-black text-slate-800 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-800/50">
                          {row.aspect}
                        </td>
                        <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 bg-emerald-50/20 dark:bg-emerald-950/10">
                          {row.zihaf}
                        </td>
                        <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 bg-amber-50/20 dark:bg-amber-950/10">
                          {row.illa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mathematical Engine Note */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-xs">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-black text-emerald-900 dark:text-emerald-200 block">
                  كيف يعالج «ميزان تمكين العروضي» الزحافات والعلل آلياً بدون أخطاء؟
                </span>
                <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                  يعتمد المحرك خوارزمية التطابق الديناميكي التكيفي <strong>Adaptive Foot Segmentation</strong>؛ حيث يقوم بتجربة كافة صور التفعيلة الأصلية وزحافاتها الجائزة وعللها المعتمدة لكل بحر، ويقتطع الطول الحقيقي لكل صورة متغيرة (مثل اقتطاع 4 رموز فقط لـ فَعِلُنْ المخبونة، و5 رموز لـ فَعُولُنْ المقطوفة في الوافر)، مما يمنع انزياح الرموز ويضمن دقة تصنيف البحر بنسبة 100%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: BACCALAUREATE EXAM SIMULATOR ═══ */}
      {activeTab === 'baccalaureate' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-black px-3 py-1 rounded-full">
                  محاكي أسئلة البكالوريا الرسمية
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  تطبيقات وأسئلة عروض البكالوريا مع التصحيح الوزاري وسلم التنقيط
                </h2>
              </div>

              {/* Selector for Bac Exams */}
              <div className="flex items-center gap-2">
                {BACCALAUREATE_PROSODY_EXAMS.map((exam, idx) => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      setActiveBacExamIndex(idx);
                      setShowBacModelAnswer(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      activeBacExamIndex === idx
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {exam.year}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Exam Display */}
            {(() => {
              const currentExam = BACCALAUREATE_PROSODY_EXAMS[activeBacExamIndex];
              return (
                <div className="space-y-6">
                  {/* Context Banner */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <span className="font-black text-xs text-emerald-800 dark:text-emerald-300 block">
                        {currentExam.year} • {currentExam.stream}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {currentExam.session}
                      </span>
                    </div>
                    <Award className="text-emerald-600" size={24} />
                  </div>

                  {/* Poetic Verse To Cut */}
                  <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-2 shadow-inner">
                    <span className="text-[11px] text-amber-300 font-bold uppercase tracking-widest">
                      البيت الشعري المستهدف في الامتحان
                    </span>
                    <p className="text-lg md:text-2xl font-black leading-relaxed">
                      {currentExam.verse.first} ... {currentExam.verse.second}
                    </p>
                  </div>

                  {/* Official Exam Questions */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpCircle size={18} className="text-indigo-600" />
                      <span>الأسئلة الوزارية المطروحة:</span>
                    </h3>
                    <ul className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-bold">
                      {currentExam.questions.map((q, i) => (
                        <li key={i} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Toggle Answer Button */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowBacModelAnswer(!showBacModelAnswer)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-black text-xs md:text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
                    >
                      {showBacModelAnswer ? 'إخفاء الإجابة النموذجية' : 'كشف الإجابة النموذجية الوزارية وسلم التنقيط 👁️'}
                    </button>
                  </div>

                  {/* Model Answer & Grading Scheme */}
                  {showBacModelAnswer && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                      {/* Model Solution Box */}
                      <div className="p-6 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-3xl border border-emerald-200 dark:border-emerald-800 space-y-4">
                        <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <span>عناصر الإجابة النموذجية المعتمدة:</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700">
                            <span className="text-slate-400 block mb-1">الكتابة العروضية للصدر:</span>
                            <span className="text-emerald-700 dark:text-emerald-300 font-mono text-sm">{currentExam.modelAnswer.arudWriting.first}</span>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700">
                            <span className="text-slate-400 block mb-1">الكتابة العروضية للعجز:</span>
                            <span className="text-emerald-700 dark:text-emerald-300 font-mono text-sm">{currentExam.modelAnswer.arudWriting.second}</span>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700">
                            <span className="text-slate-400 block mb-1">الرموز الصوتية للصدر:</span>
                            <span className="text-amber-600 font-mono text-sm tracking-widest">{currentExam.modelAnswer.symbols.first}</span>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700">
                            <span className="text-slate-400 block mb-1">الرموز الصوتية للعجز:</span>
                            <span className="text-amber-600 font-mono text-sm tracking-widest">{currentExam.modelAnswer.symbols.second}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-2 text-xs">
                          <p><strong>البحر الشعري:</strong> <span className="text-emerald-600 font-black">{currentExam.modelAnswer.meter}</span></p>
                          <p><strong>الزحافات والعلل:</strong> {currentExam.modelAnswer.zihafat}</p>
                          <p><strong>القافية والروي:</strong> {currentExam.modelAnswer.qafiyah} | حرف الروي: {currentExam.modelAnswer.rawiy}</p>
                        </div>
                      </div>

                      {/* Grading Rubric */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3">
                          سلم التنقيط الوزاري المعتمد (المجموع: 3.00 نقاط):
                        </h4>
                        <div className="space-y-2">
                          {currentExam.gradingScheme.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-700">
                              <span>{item.step}</span>
                              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-black">
                                {item.mark}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ═══ TAB 4: POETRY WRITING WIZARD ═══ */}
      {activeTab === 'wizard' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 text-xs font-black px-3 py-1 rounded-full">
                مرشد النظم والمحاولات الشعرية
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                معالج النظم وتفادي الكسور الوزنية في الشعر والأنشودة المدرسية
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                اختر بحراً شعرياً واكتب أبياتك؛ سيرشدك النظام للتأكد من انضباط الجرس الصوتي لكل تفعيلة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  اختر البحر المنشود للنظم:
                </label>
                <select
                  value={wizardMeterId}
                  onChange={(e) => setWizardMeterId(e.target.value)}
                  className="w-full text-xs font-bold p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {POETIC_METERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.rhymeKey})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  مفتاح البحر وضابطه الصوتي:
                </label>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs font-black text-amber-900 dark:text-amber-200">
                  {POETIC_METERS.find(m => m.id === wizardMeterId)?.rhymeKey}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                اكتب بيتك أو شطرك هنا:
              </label>
              <textarea
                rows={3}
                value={wizardVerse}
                onChange={(e) => setWizardVerse(e.target.value)}
                placeholder="اكتب البيت الشعري بالتشكيل..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base focus:outline-none focus:border-indigo-500"
              />
            </div>

            {wizardVerse.trim() && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-500" />
                  <span>الفحص الإيقاعي الفوري لسطرك الشعري:</span>
                </h4>
                <div className="font-mono text-sm tracking-widest text-emerald-600 font-black">
                  الرموز المستخلصة: {extractProsodySymbols(convertToArudWriting(wizardVerse))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  نصيحة الميزان: تأكد من تتابع الأسباب والأوتاد وفق مفتاح البحر أعلاه للحفاظ على سلامة النغم.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
