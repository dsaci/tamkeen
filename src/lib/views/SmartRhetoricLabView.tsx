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
  SendHorizontal,
  Key,
  ExternalLink,
  ShieldCheck,
  Lightbulb,
  Wand2,
  Check
} from 'lucide-react';
import {
  RhetoricScope,
  RhetoricLevel,
  RhetoricDetail,
  RhetoricAnalysisResult,
  RhetoricFinding,
  RhetoricCategory,
  RHETORIC_CONCEPTS_MAP,
  BENCHMARK_EXAMPLES
} from '../../data/rhetoricRulesDB';
import { RhetoricAIService } from '../../services/rhetoricAIService';
import { synthesizeDiagnosticFinding, DiagnosticWizardInput } from '../../lib/utils/rhetoricEngine';

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
  const [activeTab, setActiveTab] = useState<'analyzer' | 'guided_wizard' | 'dictionary' | 'benchmarks'>('analyzer');
  const [copied, setCopied] = useState<boolean>(false);

  // سياق النص الموجه
  const [userContext, setUserContext] = useState<string>('');
  const [showContextField, setShowContextField] = useState<boolean>(false);

  // حالة مزود الذكاء الاصطناعي (خادم Render، محلي، Ollama مفتوح المصدر، Gemini)
  const [aiProvider, setAiProvider] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tamkeen_ai_provider') || 'render_ai';
    }
    return 'render_ai';
  });
  const [renderAiUrl, setRenderAiUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tamkeen_render_ai_url') || (import.meta as any).env?.VITE_RENDER_AI_URL || 'https://tamkeen-ai.onrender.com';
    }
    return 'https://tamkeen-ai.onrender.com';
  });
  const [renderServerStatus, setRenderServerStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tamkeen_gemini_key') || '';
    }
    return '';
  });
  const [ollamaUrl, setOllamaUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tamkeen_ollama_url') || 'http://localhost:11434';
    }
    return 'http://localhost:11434';
  });
  const [ollamaModel, setOllamaModel] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tamkeen_ollama_model') || 'qwen2.5';
    }
    return 'qwen2.5';
  });
  const [showKeyDrawer, setShowKeyDrawer] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>('');

  // ─── حالات المحقق البلاغي التوجيهي (شجرة القرار بدون أي ذكاء اصطناعي خارجي) ───
  const [wizardPhrase, setWizardPhrase] = useState<string>('');
  const [wizardTopic, setWizardTopic] = useState<string>('عام');
  const [wizardNature, setWizardNature] = useState<'figurative' | 'literal'>('figurative');
  const [wizardCategory, setWizardCategory] = useState<RhetoricCategory>('bayaan');
  const [wizardFamily, setWizardFamily] = useState<string>('istiara');
  const [wizardSubType, setWizardSubType] = useState<string>('makniya_tashkhees');
  const [wizardMushabbah, setWizardMushabbah] = useState<string>('');
  const [wizardMushabbahBih, setWizardMushabbahBih] = useState<string>('');
  const [wizardQareena, setWizardQareena] = useState<string>('');
  const [wizardRelation, setWizardRelation] = useState<string>('المشابهة');
  const [wizardAdat, setWizardAdat] = useState<string>('');
  const [wizardWajhShabah, setWizardWajhShabah] = useState<string>('');
  const [wizardNotes, setWizardNotes] = useState<string>('');
  const [wizardGeneratedFinding, setWizardGeneratedFinding] = useState<RhetoricFinding | null>(null);
  const [wizardCopied, setWizardCopied] = useState<boolean>(false);

  const handleCheckRenderHealth = async () => {
    setRenderServerStatus('checking');
    try {
      const res = await fetch(`${renderAiUrl.trim()}/health`);
      if (res.ok) {
        setRenderServerStatus('online');
      } else {
        setRenderServerStatus('offline');
      }
    } catch {
      setRenderServerStatus('offline');
    }
  };

  const handleSaveAIConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tamkeen_ai_provider', aiProvider);
      localStorage.setItem('tamkeen_render_ai_url', renderAiUrl.trim());
      localStorage.setItem('tamkeen_ollama_url', ollamaUrl.trim());
      localStorage.setItem('tamkeen_ollama_model', ollamaModel.trim());
      const trimmed = keyInput.trim();
      if (trimmed) {
        localStorage.setItem('tamkeen_gemini_key', trimmed);
        setApiKey(trimmed);
      }
    }
    setShowKeyDrawer(false);
  };

  // توليد الإجابة النموذجية عبر المحقق التوجيهي
  const handleRunWizard = () => {
    if (!wizardPhrase.trim()) return;
    const inputData: DiagnosticWizardInput = {
      quote: wizardPhrase.trim(),
      contextTopic: wizardTopic,
      expressionNature: wizardNature,
      category: wizardCategory,
      family: wizardFamily,
      subType: wizardSubType,
      elements: {
        mushabbah: wizardMushabbah.trim(),
        mushabbahBih: wizardMushabbahBih.trim(),
        qareena: wizardQareena.trim(),
        relation: wizardRelation.trim(),
        adat: wizardAdat.trim(),
        wajhShabah: wizardWajhShabah.trim(),
        userIntentNotes: wizardNotes.trim()
      }
    };

    const finding = synthesizeDiagnosticFinding(inputText || wizardPhrase, inputData, level);
    setWizardGeneratedFinding(finding);
  };

  // إدراج نتيجة المحقق في لوحة النتائج الرئيسية
  const handleApplyWizardToResults = () => {
    if (!wizardGeneratedFinding) return;
    if (!result) {
      setResult({
        analysisId: 'guided-analysis-' + Date.now(),
        timestamp: new Date().toISOString(),
        originalText: inputText || wizardPhrase,
        scope,
        level,
        detail,
        summary: {
          textTypeEstimate: 'تحليل موجه عبر المحقق البلاغي',
          totalFindings: 1,
          bayaanCount: wizardGeneratedFinding.category === 'bayaan' ? 1 : 0,
          badiCount: wizardGeneratedFinding.category === 'badi' ? 1 : 0,
          maaniCount: wizardGeneratedFinding.category === 'maani' ? 1 : 0,
          usloobiCount: 0,
          ambiguousCount: 0
        },
        findings: [wizardGeneratedFinding],
        warnings: [],
        pedagogicalAdvice: [
          'تم استخراج هذه الإجابة النموذجية عبر «المحقق البلاغي التوجيهي» المطابق لسلم تنقيط البكالوريا الرسمي.'
        ],
        engineUsed: 'deterministic_guided_wizard'
      });
    } else {
      setResult({
        ...result,
        findings: [wizardGeneratedFinding, ...result.findings],
        summary: {
          ...result.summary,
          totalFindings: result.summary.totalFindings + 1,
          bayaanCount: result.summary.bayaanCount + (wizardGeneratedFinding.category === 'bayaan' ? 1 : 0),
          badiCount: result.summary.badiCount + (wizardGeneratedFinding.category === 'badi' ? 1 : 0),
          maaniCount: result.summary.maaniCount + (wizardGeneratedFinding.category === 'maani' ? 1 : 0)
        }
      });
    }
    setSelectedFindingId(wizardGeneratedFinding.id);
    setActiveTab('analyzer');
  };

  // نسخ إجابة المحقق التوجيهي
  const handleCopyWizardAnswer = () => {
    if (!wizardGeneratedFinding) return;
    let txt = `【الصورة / الظاهرة البلاغية】: ${wizardGeneratedFinding.label}\n`;
    txt += `• الشاهد: "${wizardGeneratedFinding.span.quote}"\n`;
    txt += `• الشرح والتفكيك: ${wizardGeneratedFinding.explanation}\n`;
    if (wizardGeneratedFinding.elements) {
      txt += `• الأركان:\n`;
      Object.entries(wizardGeneratedFinding.elements).forEach(([k, v]) => {
        txt += `  - ${k}: ${v}\n`;
      });
    }
    txt += `• الأثر البلاغي وسر الجمال: ${wizardGeneratedFinding.effect}\n`;
    if (wizardGeneratedFinding.educationalNote) {
      txt += `• إرشاد وزاري: ${wizardGeneratedFinding.educationalNote}\n`;
    }
    navigator.clipboard.writeText(txt);
    setWizardCopied(true);
    setTimeout(() => setWizardCopied(false), 2500);
  };

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
      const res = await RhetoricAIService.analyze(inputText, scope, level, detail, userContext);
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
              <span>مختبر التحليل الآلي</span>
            </button>

            <button
              onClick={() => setActiveTab('guided_wizard')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'guided_wizard'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <HelpCircle size={16} />
              <span>المحقق التوجيهي (شجرة القرار)</span>
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

                {/* سياق النص الموجه وزر الانتقال للمحقق التفاعلي */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowContextField(!showContextField)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1.5 cursor-pointer py-1"
                  >
                    <Lightbulb size={13} className="text-amber-500" />
                    <span>{showContextField ? 'إغلاق حقل السياق' : '+ تحديد سياق النص أو الفكرة المقصودة (اختياري لتوجيه دقة المحرك)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWizardPhrase(inputText);
                      setActiveTab('guided_wizard');
                    }}
                    className="text-xs font-black text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:underline flex items-center gap-1.5 cursor-pointer py-1"
                    title="تفكيك هذه العبارة يدوياً عبر شجرة الأسئلة البلاغية دون إنترنت"
                  >
                    <Wand2 size={13} />
                    <span>هل النص غامض؟ استعن بـ «المحقق التوجيهي»</span>
                  </button>
                </div>

                {showContextField && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1.5 animate-in fade-in duration-200">
                    <label className="text-[11px] font-black text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                      <span>سياق النص أو الفكرة التي يتناولها الكاتب:</span>
                      <span className="text-slate-500 font-normal">(مثلاً: رثاء الموت والقدر، الثورة والاستعمار، حب الوطن، العلم والجهل، الغزل العفيف)</span>
                    </label>
                    <input
                      type="text"
                      value={userContext}
                      onChange={e => setUserContext(e.target.value)}
                      placeholder="اكتب هنا موضوع النص أو فكرته لتوجيه دلالة الاستعارة والكناية..."
                      className="w-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* أمثلة سريعة للتجربة */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-400">شواهد سريعة:</span>
                  {[
                    { label: 'استعارة القرآن (واشتعل الرأس)', text: 'وَاشْتَعَلَ الرَّأْسُ شَيْبًا' },
                    { label: 'شاهد الهذلي (المنية أنشبت)', text: 'وَإِذَا المَنِيَّةُ أَنْشَبَتْ أَظْفَارَهَا أَلْفَيْتَ كُلَّ تَمِيمَةٍ لَا تَنْفَعُ' },
                    { label: 'قصر إنما (العلماء)', text: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ' },
                    { label: 'تصريع المتنبي (العزائم)', text: 'عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ ... وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ' },
                    { label: 'كناية الخنساء (كثير الرماد)', text: 'طويل النجاد رفيع العماد كثير الرماد إذا ما شتا' },
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

                {/* شريط حالة المحرك ومفتاح الذكاء الاصطناعي */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {aiProvider === 'render_ai' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        <Cpu size={14} className="text-teal-600" />
                        <span>خادم Render السحابي الذكي (مفتوح المصدر)</span>
                        <button
                          onClick={() => setShowKeyDrawer(true)}
                          className="mr-2 text-[11px] underline text-teal-700 hover:text-teal-900 font-black cursor-pointer"
                        >
                          تخصيص
                        </button>
                      </div>
                    ) : aiProvider === 'gemini' && apiKey ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>الذكاء الاصطناعي السحابي (Gemini) نشط</span>
                        <button
                          onClick={() => {
                            setKeyInput(apiKey);
                            setShowKeyDrawer(!showKeyDrawer);
                          }}
                          className="mr-2 text-[11px] underline text-emerald-700 hover:text-emerald-900 font-black cursor-pointer"
                        >
                          تعديل
                        </button>
                      </div>
                    ) : aiProvider === 'local_ollama' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        <Cpu size={14} className="text-purple-600" />
                        <span>نموذج مفتوح المصدر محلي ({ollamaModel})</span>
                        <button
                          onClick={() => setShowKeyDrawer(!showKeyDrawer)}
                          className="mr-2 text-[11px] underline text-purple-700 hover:text-purple-900 font-black cursor-pointer"
                        >
                          تعديل
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                        <Cpu size={14} className="text-amber-600" />
                        <span>المحرك المحلي الصارم (أوفلاين 100%)</span>
                        <button
                          onClick={() => setShowKeyDrawer(true)}
                          className="mr-2 px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black hover:bg-amber-600 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Key size={11} />
                          <span>تخصيص نمط المحرك</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWizardPhrase(inputText);
                        setActiveTab('guided_wizard');
                      }}
                      className="px-4 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-black text-xs transition-all flex items-center gap-2 cursor-pointer border border-purple-300 dark:border-purple-800"
                    >
                      <HelpCircle size={15} />
                      <span>المحقق التوجيهي</span>
                    </button>

                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading || !inputText.trim()}
                      className={`px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer ${
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
                          <span>بدء التحليل البلاغي الآلي</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* درج خيارات المحرك والذكاء الاصطناعي */}
                {showKeyDrawer && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900 animate-in slide-in-from-top-2 duration-200 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
                        <Key size={15} className="text-indigo-500" />
                        <span>اختيار محرك المعالجة البلاغية المعتمد في المنصة</span>
                      </div>
                      <button
                        onClick={() => setShowKeyDrawer(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-black cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* خيارات المزود */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div
                        onClick={() => setAiProvider('render_ai')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          aiProvider === 'render_ai'
                            ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-black text-xs flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1.5">
                            <span>🚀 1. خادم Render السحابي</span>
                          </span>
                          {aiProvider === 'render_ai' && <Check size={14} className="text-teal-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                          خادم ذكاء اصطناعي مفتوح المصدر مستقل على Render؛ لا يتطلب أي مفتاح API من الأستاذ.
                        </p>
                      </div>

                      <div
                        onClick={() => setAiProvider('local')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          aiProvider === 'local'
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-black text-xs flex items-center justify-between mb-1">
                          <span>⚡ 2. المحرك المحلي الصارم</span>
                          {aiProvider === 'local' && <Check size={14} className="text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                          يعمل محلياً 100% بدون إنترنت ولا مفاتيح، مدعوماً بـ «المحقق التوجيهي» وقواعد الاستدلال الجزائري.
                        </p>
                      </div>

                      <div
                        onClick={() => setAiProvider('local_ollama')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          aiProvider === 'local_ollama'
                            ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-black text-xs flex items-center justify-between mb-1">
                          <span>💻 3. نموذج محلي (Ollama)</span>
                          {aiProvider === 'local_ollama' && <Check size={14} className="text-purple-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                          اتصال بخادم محلي (Ollama / Lumen / LM Studio) يعمل بالكامل على حاسوبك دون نقل بياناتك.
                        </p>
                      </div>

                      <div
                        onClick={() => setAiProvider('gemini')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          aiProvider === 'gemini'
                            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-black text-xs flex items-center justify-between mb-1">
                          <span>🔑 4. Google Gemini</span>
                          {aiProvider === 'gemini' && <Check size={14} className="text-indigo-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                          تحليل سحابي متقدم عبر واجهة برمجية شخصية مجانية من Google AI Studio بمفتاحك الخاص.
                        </p>
                      </div>
                    </div>

                    {/* تفاصيل خادم Render الذكي */}
                    {aiProvider === 'render_ai' && (
                      <div className="p-3.5 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-[11px] font-black text-teal-900 dark:text-teal-300">
                            رابط خادم الذكاء الاصطناعي على Render (Render API URL):
                          </label>
                          <div className="flex items-center gap-2">
                            {renderServerStatus === 'online' && (
                              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                متصل وجاهز للتحليل
                              </span>
                            )}
                            {renderServerStatus === 'offline' && (
                              <span className="text-[10px] font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                غير متاح (سيعمل المحرك المحلي تلقائياً)
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={handleCheckRenderHealth}
                              disabled={renderServerStatus === 'checking'}
                              className="text-[10px] font-black text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/50 hover:bg-teal-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                            >
                              {renderServerStatus === 'checking' ? 'جاري الفحص...' : 'فحص الاتصال 📡'}
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={renderAiUrl}
                          onChange={e => setRenderAiUrl(e.target.value)}
                          placeholder="https://tamkeen-ai.onrender.com"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                        />
                        <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                          💡 يعتمد هذا الخيار على خادم بايثون (FastAPI) المرفوع على Render؛ يقوم بالتحليل الدقيق تلقائياً، وإذا كان الخادم في وضع السبات ينوب عنه المحرك المحلي الصارم فوراً دون تعطيل عملك.
                        </p>
                      </div>
                    )}

                    {/* تفاصيل النموذج المفتوح المصدر */}
                    {aiProvider === 'local_ollama' && (
                      <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-black text-purple-900 dark:text-purple-300 block mb-1">
                              عنوان الخادم المحلي (Ollama URL):
                            </label>
                            <input
                              type="text"
                              value={ollamaUrl}
                              onChange={e => setOllamaUrl(e.target.value)}
                              placeholder="http://localhost:11434"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-black text-purple-900 dark:text-purple-300 block mb-1">
                              اسم النموذج (Model Name):
                            </label>
                            <input
                              type="text"
                              value={ollamaModel}
                              onChange={e => setOllamaModel(e.target.value)}
                              placeholder="qwen2.5 أو llama3 أو lumen"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* تفاصيل مفتاح Gemini */}
                    {aiProvider === 'gemini' && (
                      <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-indigo-900 dark:text-indigo-300">
                            مفتاح Google Gemini API:
                          </label>
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            احصل على مفتاح مجاني
                            <ExternalLink size={10} />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={keyInput}
                          onChange={e => setKeyInput(e.target.value)}
                          placeholder="الصق مفتاح API هنا (يبدأ بـ AIzaSy...)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={handleSaveAIConfig}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all cursor-pointer"
                      >
                        حفظ الإعدادات وتطبيقها
                      </button>
                      <button
                        onClick={() => setShowKeyDrawer(false)}
                        className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-all cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
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

      {/* ─── التبويب الثاني: المحقق البلاغي التوجيهي (شجرة القرار التعليمية) ─── */}
      {activeTab === 'guided_wizard' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* بطاقة المقدمة التوجيهية */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black">
                <Wand2 size={14} className="text-amber-400" />
                <span>حل استقصائي منهجي 100% بدون أي ذكاء اصطناعي خارجي أو مفاتيح API</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                المحقق البلاغي التوجيهي (شجرة القرار البلاغية)
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                إذا كان لديك أي بيت شعري أو عبارة أدبية من خارج المقرر وتريد صياغة إجابة نموذجية دقيقة وفق سلم تنقيط البكالوريا الرسمي، أجب عن 3 أسئلة توجيهية فقط وسيتولى المحرك تركيب الإجابة وتفكيك الأركان والقرائن والأثر البلاغي فوراً.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* شجرة الأسئلة والمدخلات (العمود الأيمن/الأوسع) */}
            <div className="lg:col-span-7 space-y-6">
              {/* الخطوة 1: تحديد العبارة والسياق */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">1</span>
                    تحديد العبارة والسياق الدلالي
                  </h3>
                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setWizardPhrase(inputText)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      استيراد النص من لوحة التحليل
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    العبارة أو الشاهد المراد تفكيكه (شطر، بيت، جملة):
                  </label>
                  <textarea
                    rows={2}
                    value={wizardPhrase}
                    onChange={(e) => setWizardPhrase(e.target.value)}
                    placeholder="مثال: وإذا المنية أنشبت أظفارها ألفيت كل تميمة لا تنفع..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    السياق الموضوعي للنص (يساعد في تحديد الغرض والأثر البلاغي بدقة):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'عام', label: 'عام ومفتوح' },
                      { id: 'الحزن والرثاء والموت', label: 'رثاء وموت وألم' },
                      { id: 'الفخر والحماسة والشجاعة', label: 'فخر وحماسة' },
                      { id: 'الثورة والتحرر والوطن', label: 'ثورة ووطنية' },
                      { id: 'التأمل في الطبيعة والحياة', label: 'طبيعة وتأمل' },
                      { id: 'المدح والثناء والسيادة', label: 'مدح وثناء' },
                      { id: 'الزهد والحكمة والموعظة', label: 'زهد وحكمة' },
                      { id: 'الغزل والوجد والشوق', label: 'غزل ووجد' }
                    ].map(top => (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => setWizardTopic(top.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                          wizardTopic === top.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {top.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* الخطوة 2: شجرة القرار المنهاجية (3 أسئلة حاكمة) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">2</span>
                  شجرة القرار البيداغوجية (3 أسئلة حاكمة)
                </h3>

                {/* السؤال الأول: طبيعة الاستعمال اللغوي */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    السؤال (1): هل قصد الكاتب المعنى الحقيقي المباشر أم معنى خيالياً مجازياً؟
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setWizardNature('figurative');
                        if (wizardFamily === 'kinayah') setWizardFamily('istiara');
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                        wizardNature === 'figurative'
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-black text-xs sm:text-sm mb-1 flex items-center justify-between">
                        <span>معنى مجازي / خيالي</span>
                        {wizardNature === 'figurative' && <Check size={16} className="text-purple-600" />}
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed opacity-80">
                        يمتنع إرادة المعنى الحقيقي بوجود قرينة مانعة (مثل: أظفار للموت، ابتسامة للصبح، أو يد للبحر).
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setWizardNature('literal');
                        setWizardCategory('bayaan');
                        setWizardFamily('kinayah');
                        setWizardSubType('sifah');
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                        wizardNature === 'literal'
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-black text-xs sm:text-sm mb-1 flex items-center justify-between">
                        <span>معنى حقيقي ممكن (كناية)</span>
                        {wizardNature === 'literal' && <Check size={16} className="text-amber-600" />}
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed opacity-80">
                        يجوز إرادة المعنى الأصلي مع قصد معنى ملازم (مثل: كثير الرماد دلالة على الجود، طويل النجاد دلالة على الشجاعة).
                      </p>
                    </button>
                  </div>
                </div>

                {/* السؤال الثاني: الباب البلاغي */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    السؤال (2): ما هو الباب البلاغي المستهدف؟
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'bayaan', label: 'علم البيان', desc: 'صور وأخيلة (تشبيه، استعارة، كناية)' },
                      { id: 'badi', label: 'علم البديع', desc: 'محسنات (طباق، مقابلة، جناس)' },
                      { id: 'maani', label: 'علم المعاني', desc: 'أساليب (إنشائي، خبري، قصر)' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          const c = cat.id as RhetoricCategory;
                          setWizardCategory(c);
                          if (c === 'bayaan') {
                            setWizardFamily(wizardNature === 'literal' ? 'kinayah' : 'istiara');
                            setWizardSubType(wizardNature === 'literal' ? 'sifah' : 'makniya_tajseem');
                          } else if (c === 'badi') {
                            setWizardFamily('tibaaq');
                            setWizardSubType('eejab');
                          } else {
                            setWizardFamily('insha_talabi');
                            setWizardSubType('istifham');
                          }
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          wizardCategory === cat.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="font-black text-xs sm:text-sm">{cat.label}</div>
                        <div className="text-[10px] mt-1 opacity-80">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* السؤال الثالث: الفن والنوع الدقيق */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    السؤال (3): تحديد الصورة أو الفن البلاغي بدقة:
                  </label>

                  {/* إذا كان بياناً */}
                  {wizardCategory === 'bayaan' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => { setWizardFamily('istiara'); setWizardSubType('makniya_tajseem'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'istiara' && wizardSubType === 'makniya_tajseem'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>استعارة مكنية (تجسيم)</div>
                        <span className="text-[10px] font-normal text-slate-500">حُذف المشبه به ورُمز له بشيء من لوازمه</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('istiara'); setWizardSubType('makniya_tashkhees'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'istiara' && wizardSubType === 'makniya_tashkhees'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>استعارة مكنية (تشخيص)</div>
                        <span className="text-[10px] font-normal text-slate-500">منح الجماد أو المعنى صفة إنسانية حية</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('istiara'); setWizardSubType('tasrihiyya'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'istiara' && wizardSubType === 'tasrihiyya'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>استعارة تصريحية</div>
                        <span className="text-[10px] font-normal text-slate-500">حُذف المشبه وصُرّح بلفظ المشبه به</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('kinayah'); setWizardSubType('sifah'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'kinayah' && wizardSubType === 'sifah'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>كناية عن صفة</div>
                        <span className="text-[10px] font-normal text-slate-500">دلالة على معنى كالكرم أو الشجاعة أو الموت</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('kinayah'); setWizardSubType('mawsoof'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'kinayah' && wizardSubType === 'mawsoof'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>كناية عن موصوف</div>
                        <span className="text-[10px] font-normal text-slate-500">دلالة على ذات كالوطن أو اللغة أو السفينة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('tashbeeh'); setWizardSubType('baleegh'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'tashbeeh'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>تشبيه بليغ أو تام</div>
                        <span className="text-[10px] font-normal text-slate-500">عقد مماثلة بين طرفين (مشبه ومشبه به)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('majaz_mursal'); setWizardSubType('standard'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'majaz_mursal'
                            ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-900 dark:text-teal-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>مجاز مرسل</div>
                        <span className="text-[10px] font-normal text-slate-500">علاقة غير المشابهة (جزئية، محلية، سببية...)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('majaz_aqli'); setWizardSubType('standard'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-right transition-all cursor-pointer ${
                          wizardFamily === 'majaz_aqli'
                            ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-900 dark:text-teal-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>مجاز عقلي</div>
                        <span className="text-[10px] font-normal text-slate-500">إسناد الفعل لغير فاعله الحقيقي (زماني، مكاني)</span>
                      </button>
                    </div>
                  )}

                  {/* إذا كان بديعاً */}
                  {wizardCategory === 'badi' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => { setWizardFamily('tibaaq'); setWizardSubType('eejab'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                          wizardFamily === 'tibaaq' && wizardSubType === 'eejab'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        طباق إيجاب
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('tibaaq'); setWizardSubType('salb'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                          wizardFamily === 'tibaaq' && wizardSubType === 'salb'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        طباق سلب
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('muqabala'); setWizardSubType('standard'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                          wizardFamily === 'muqabala'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        مقابلة
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('jinas'); setWizardSubType('naqis'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                          wizardFamily === 'jinas'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        جناس (تام / ناقص)
                      </button>
                    </div>
                  )}

                  {/* إذا كان معاني */}
                  {wizardCategory === 'maani' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => { setWizardFamily('insha_talabi'); setWizardSubType('amr'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                          wizardFamily === 'insha_talabi'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        إنشائي طلبي (أمر/نهي/استفهام/نداء)
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('qasr'); setWizardSubType('standard'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                          wizardFamily === 'qasr'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        أسلوب قصر وتوكيد
                      </button>

                      <button
                        type="button"
                        onClick={() => { setWizardFamily('shart'); setWizardSubType('standard'); }}
                        className={`p-2.5 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                          wizardFamily === 'shart'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        أسلوب شرط بلاغي
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* الخطوة 3: تعيين أركان الصورة والقرائن */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">3</span>
                  تعيين الأركان والقرينة المانعة
                </h3>

                {/* حقول الاستعارة */}
                {wizardFamily === 'istiara' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                          المشبه (المستعار له):
                        </label>
                        <input
                          type="text"
                          value={wizardMushabbah}
                          onChange={(e) => setWizardMushabbah(e.target.value)}
                          placeholder="مثال: المنية (الموت) أو الدهر أو الوطن"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                          المشبه به (المستعار منه المحذوف أو المصرح به):
                        </label>
                        <input
                          type="text"
                          value={wizardMushabbahBih}
                          onChange={(e) => setWizardMushabbahBih(e.target.value)}
                          placeholder="مثال: سبع مفترس كاسر / إنسان / طائر"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                        القرينة المانعة واللازمة الدالة عليه في العبارة:
                      </label>
                      <input
                        type="text"
                        value={wizardQareena}
                        onChange={(e) => setWizardQareena(e.target.value)}
                        placeholder="مثال: أنشبت أظفارها (إثبات الأظفار والنشوب للموت، والموت لا أظفار له)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* حقول الكناية */}
                {wizardFamily === 'kinayah' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                        المكنى عنه (المعنى المراد الملازم للعبارة):
                      </label>
                      <input
                        type="text"
                        value={wizardMushabbahBih}
                        onChange={(e) => setWizardMushabbahBih(e.target.value)}
                        placeholder="مثال: حتمية الموت واستحالة رده / الكرم العظيم / الشجاعة / الندم"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* حقول التشبيه */}
                {wizardFamily === 'tashbeeh' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">المشبه:</label>
                        <input
                          type="text"
                          value={wizardMushabbah}
                          onChange={(e) => setWizardMushabbah(e.target.value)}
                          placeholder="مثال: العلم / المعلم / الجندي"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">المشبه به:</label>
                        <input
                          type="text"
                          value={wizardMushabbahBih}
                          onChange={(e) => setWizardMushabbahBih(e.target.value)}
                          placeholder="مثال: النور / الرسول / الأسد"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">أداة التشبيه (إن وجدت):</label>
                        <input
                          type="text"
                          value={wizardAdat}
                          onChange={(e) => setWizardAdat(e.target.value)}
                          placeholder="مثال: الكاف، كأن، مثل (أو محذوفة)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">وجه الشبه (إن وجد):</label>
                        <input
                          type="text"
                          value={wizardWajhShabah}
                          onChange={(e) => setWizardWajhShabah(e.target.value)}
                          placeholder="مثال: في الهداية والإنارة / في الشجاعة والجسارة"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* حقول المجاز المرسل والعقلي */}
                {(wizardFamily === 'majaz_mursal' || wizardFamily === 'majaz_aqli') && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">المعنى المراد حقيقة:</label>
                        <input
                          type="text"
                          value={wizardMushabbahBih}
                          onChange={(e) => setWizardMushabbahBih(e.target.value)}
                          placeholder="مثال: المطر (أطلق الغيث)، العيون (أطلق الجواسيس)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">علاقة المجاز:</label>
                        <select
                          value={wizardRelation}
                          onChange={(e) => setWizardRelation(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option value="الجزئية">الجزئية (ذكر الجزء وأراد الكل)</option>
                          <option value="الكلية">الكلية (ذكر الكل وأراد الجزء)</option>
                          <option value="السببية">السببية (ذكر السبب وأراد المسبب)</option>
                          <option value="المسببية">المسببية (ذكر المسبب وأراد السبب)</option>
                          <option value="المحلية">المحلية (ذكر المحل وأراد الحال فيه)</option>
                          <option value="الحالية">الحالية (ذكر الحال وأراد المحل)</option>
                          <option value="اعتبار ما كان">اعتبار ما كان</option>
                          <option value="اعتبار ما سيكون">اعتبار ما سيكون</option>
                          <option value="الزمانية">الزمانية (إسناد عقلي للزمان)</option>
                          <option value="المكانية">المكانية (إسناد عقلي للمكان)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* حقول الطباق والمقابلة */}
                {(wizardFamily === 'tibaaq' || wizardFamily === 'muqabala') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">الطرف الأول:</label>
                      <input
                        type="text"
                        value={wizardMushabbah}
                        onChange={(e) => setWizardMushabbah(e.target.value)}
                        placeholder="مثال: يضحك / الليل / يعلمون"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">الطرف المضاد المقابل:</label>
                      <input
                        type="text"
                        value={wizardMushabbahBih}
                        onChange={(e) => setWizardMushabbahBih(e.target.value)}
                        placeholder="مثال: يبكي / النهار / لا يعلمون"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* حقول الأساليب والإنشاء والقصر */}
                {wizardCategory === 'maani' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">الأداة أو الصيغة:</label>
                      <input
                        type="text"
                        value={wizardAdat}
                        onChange={(e) => setWizardAdat(e.target.value)}
                        placeholder="مثال: صيغة الأمر / هل / يا / إنما"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">الغرض البلاغي المقصود:</label>
                      <input
                        type="text"
                        value={wizardWajhShabah}
                        onChange={(e) => setWizardWajhShabah(e.target.value)}
                        placeholder="مثال: التعجب والاستنكار / النصح والإرشاد / التحسر"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* زر التوليد */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRunWizard}
                    disabled={!wizardPhrase.trim()}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wand2 size={18} />
                    <span>توليد الإجابة النموذجية وصياغة البكالوريا المعتمدة فوراً</span>
                  </button>
                </div>
              </div>
            </div>

            {/* عمود المعاينة النموذجية وتفاصيل الإجابة (العمود الأيسر) */}
            <div className="lg:col-span-5 space-y-6">
              {wizardGeneratedFinding ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border-2 border-indigo-500/30 dark:border-indigo-500/30 space-y-5 animate-in fade-in duration-300">
                  {/* رأس بطاقة الإجابة */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300">
                        إجابة وزارية نموذجية معتمدة
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white pt-1">
                        {wizardGeneratedFinding.label}
                      </h4>
                    </div>
                    <div className="text-center px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
                      <div className="text-[10px] font-bold">العلامة الكاملة</div>
                      <div className="text-sm font-black">2.0 / 2.0</div>
                    </div>
                  </div>

                  {/* الشاهد وموضعه */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60">
                    <div className="text-[11px] font-black text-indigo-800 dark:text-indigo-300 mb-1">الشاهد البلاغي:</div>
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-relaxed">
                      "{wizardGeneratedFinding.span.quote}"
                    </p>
                  </div>

                  {/* الشرح والتفكيك وفق صياغة الوزارة */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      الشرح والتعليل الرسمي (سلم التصحيح: 1.0 ن):
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-bold bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      {wizardGeneratedFinding.explanation}
                    </p>
                  </div>

                  {/* جدول تفكيك الأركان */}
                  {wizardGeneratedFinding.elements && Object.keys(wizardGeneratedFinding.elements).length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-black text-slate-700 dark:text-slate-300">
                        تفكيك أركان الصورة والقرينة المانعة:
                      </h5>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
                        {Object.entries(wizardGeneratedFinding.elements).map(([k, v]) => (
                          <div key={k} className="p-2.5 text-xs flex items-center justify-between gap-2">
                            <span className="font-black text-slate-600 dark:text-slate-400">{k}:</span>
                            <span className="font-bold text-slate-900 dark:text-white text-left">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الأثر البلاغي وسر الجمال */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                    <div className="text-[11px] font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      الأثر البلاغي وسر الجمال (سلم التصحيح: 0.5 ن):
                    </div>
                    <p className="text-xs font-bold text-amber-950 dark:text-amber-200 leading-relaxed">
                      {wizardGeneratedFinding.effect}
                    </p>
                  </div>

                  {/* توجيهات الأستاذ */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                    <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                    <span>
                      {wizardGeneratedFinding.educationalNote}
                    </span>
                  </div>

                  {/* أزرار الإجراءات السريعة */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyWizardAnswer}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {wizardCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{wizardCopied ? 'تم نسخ الإجابة بنجاح!' : 'نسخ الإجابة النموذجية'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyWizardToResults}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-600/20"
                    >
                      <BookmarkCheck size={14} />
                      <span>إدراج في بطاقات التحليل والتصدير</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
                    <Lightbulb size={32} />
                  </div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white">
                    في انتظار توجيهاتك
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                    حدد العبارة، واختر طبيعة التعبير ونوع الصورة من شجرة القرار على اليمين، ثم اضغط على زر التوليد لتظهر لك هنا الإجابة الوزارية المفصلة جاهزة للنسخ أو الطباعة.
                  </p>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                    💡 يعمل محلياً 100% بدون حاجة إلى إنترنت أو مفتاح خارجي
                  </div>
                </div>
              )}
            </div>
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
