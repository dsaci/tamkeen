import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PenTool, Zap, Download, RefreshCw, FileText, Sparkles, Layers, BookOpen, Target, CheckCircle2, Database, X, Loader2, ClipboardList, GraduationCap, Brain, Lightbulb, Wrench, BarChart3, HeartHandshake, StickyNote, Award, BookCheck, Cpu } from 'lucide-react';
import { TeacherProfile, Resource } from '../../types';
import { TamkeenLogo } from '../../legacy_components/TamkeenLogo';
import { addResource, listResources } from '../../services/resourceBankService';
import { generateLocalMemo, generateLocalExam, GeneratedExamResult } from '../ai/localCurriculumEngine';
import { SECONDARY_ARABIC_CURRICULUM, CurriculumLessonItem } from '../ai/secondaryArabicCurriculumData';

interface MemoData {
  memoNumber: string;
  duration: string;
  unit: string;
  activity: string;
  topic: string;
  support: string;
  grade: string;
  stream: string;
  subject: string;
  date: string;
}

interface MemoContent {
  institution?: string;
  targetGroup?: string;
  unitNumberAndTitle?: string;
  unitDuration?: string;
  activity?: string;
  topic?: string;
  support?: string;
  competencyFinal: string;
  competencyTarget?: string;
  objectivesList?: string[];
  indicators: string[];
  prerequisites: string;
  problemSituation: string;
  toolsNote?: string;
  steps: {
    stage: string;
    objectiveDomain?: string;
    teacherActivity: string;
    strategy?: string;
    studentActivity: string;
    evaluationType?: string;
    indicatorsAndTiming?: string;
    method?: string;
  }[];
  tools: string;
  evaluationDiag: string;
  evaluationFormative: string;
  evaluationFinal: string;
  remediation: string;
  enrichment: string;
  notes: string;
  values: string;
  isIntegration?: boolean;
  writingTechniques?: string;
  rhetoricResources?: string;
  linguisticResources?: string;
  intellectualResources?: string;
  integrationTasks?: { section: string; resources: string; pattern: string; indicators: string }[];
  rubricCriteria?: { criterion: string; checkMethod: string; remediation?: string }[];
}

const LEVEL_MAP: any = { PRIMARY: 'primary', 'ابتدائي': 'primary', MIDDLE: 'middle', 'متوسط': 'middle', SECONDARY: 'secondary', 'ثانوي': 'secondary' };
const GRADES_MAP: any = { 
  primary: ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'السنة الخامسة'], 
  middle: ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة'], 
  secondary: ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'] 
};

const SECONDARY_STREAMS = [
  'شعب علمية مشتركة (علوم/رياضيات/تقني/تسيير)',
  'شعبة آداب وفلسفة',
  'شعبة لغات أجنبية',
  'جذع مشترك آداب',
  'جذع مشترك علوم وتكنولوجيا'
];

const SECONDARY_ACTIVITIES = [
  'أدب ونصوص',
  'قواعد اللغة',
  'بلاغة',
  'عروض',
  'مطالعة موجهة',
  'تعبير كتابي',
  'وضعية إدماجية',
  'فهم المنطوق',
  'فهم المكتوب'
];

const PRIMARY_ACTIVITIES = [
  'فهم المنطوق والتعبير الشفوي',
  'فهم المكتوب (قراءة)',
  'تعبير كتابي / إنتاج كتابي',
  'قواعد نحوية وصرفية',
  'إملاء ورسم إملائي',
  'محفوظات وأناشيد',
  'مشروع بيداغوجي / إدماج'
];

const MIDDLE_ACTIVITIES = [
  'فهم المنطوق وإنتاجه',
  'فهم المكتوب (قراءة ودراسة نص)',
  'ظاهرة لغوية (قواعد/صرف)',
  'إنتاج كتابي / تعبير',
  'وضعية إدماجية'
];

const SmartMemoView: React.FC<{ profile: TeacherProfile }> = ({ profile }) => {
  const normalizedLevel = LEVEL_MAP[profile.level || ''] || 'secondary';
  const levelLabel = profile.level === 'PRIMARY' ? 'ابتدائي' : profile.level === 'MIDDLE' ? 'متوسط' : 'ثانوي';
  const isSecondary = normalizedLevel === 'secondary' || levelLabel === 'ثانوي';

  const [activeTab, setActiveTab] = useState<'memo' | 'exam'>('memo');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  const [formData, setFormData] = useState<MemoData>({
    memoNumber: '01',
    duration: '60 دقيقة',
    unit: '',
    activity: isSecondary ? 'أدب ونصوص' : 'فهم المكتوب',
    topic: '',
    support: 'الكتاب المدرسي، السبورة، وثيقة التدرجات السنوية',
    grade: (GRADES_MAP[normalizedLevel] || [])[2] || (GRADES_MAP[normalizedLevel] || [])[0] || 'السنة الثالثة',
    stream: SECONDARY_STREAMS[0],
    subject: profile.teachingSubject || 'اللغة العربية وآدابها',
    date: new Date().toISOString().split('T')[0],
  });

  const [generatedMemo, setGeneratedMemo] = useState<MemoContent | null>(null);
  const [generatedExam, setGeneratedExam] = useState<GeneratedExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationSource, setGenerationSource] = useState<'db' | 'ai' | 'local_engine' | null>(null);
  const [resourceSuggestions, setResourceSuggestions] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Read URL query params when arriving from Syllabus Distribution / Plans page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGrade = params.get('grade');
    const urlStream = params.get('stream');
    const urlUnit = params.get('unit');
    const urlTopic = params.get('topic');
    const urlActivity = params.get('activity');

    if (urlTopic || urlUnit || urlGrade) {
      setFormData(prev => ({
        ...prev,
        grade: urlGrade || prev.grade,
        stream: urlStream || prev.stream,
        unit: urlUnit || prev.unit,
        topic: urlTopic || prev.topic,
        activity: urlActivity || prev.activity
      }));
    }
  }, []);

  // Auto-search resource bank
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (formData.subject || formData.activity || formData.topic) {
        setIsSearching(true);
        try {
          const results = await listResources({
            subject: formData.subject || undefined,
            activity: formData.activity || undefined,
            search: formData.topic || undefined,
          });
          setResourceSuggestions(results.slice(0, 5));
          if (results.length > 0) setShowSuggestions(true);
        } catch (err) {
          console.warn('[SmartMemo] Resource search error:', err);
        }
        setIsSearching(false);
      } else {
        setResourceSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.subject, formData.activity, formData.topic]);

  const applyResourceSuggestion = useCallback((resource: Resource) => {
    setFormData(prev => ({
      ...prev,
      topic: resource.title || prev.topic,
      activity: resource.activity || prev.activity,
      subject: resource.subject || prev.subject,
      unit: resource.unit || prev.unit,
      support: resource.tools || prev.support,
    }));
    setShowSuggestions(false);
  }, []);

  const selectCurriculumItem = (item: CurriculumLessonItem) => {
    setFormData(prev => ({
      ...prev,
      grade: item.grade,
      unit: item.unitTitle,
      activity: item.activity,
      topic: item.topic,
      support: item.supportPage ? `${item.supportPage}، السبورة` : prev.support,
      duration: item.duration || prev.duration,
      stream: item.stream || prev.stream
    }));
    setShowCurriculumModal(false);
  };

  const generateMemo = async () => {
    if (!formData.topic || !formData.activity) {
      alert("يرجى إدخال النشاط والموضوع أو اختيار درس من المنهاج الرسمي.");
      return;
    }
    setIsLoading(true);

    // === الخطوة 1: البحث في بنك الموارد أولاً ===
    try {
      const dbResults = await listResources({
        subject: formData.subject || undefined,
        activity: formData.activity || undefined,
        search: formData.topic || undefined,
      });
      const match = dbResults.find(r => r.content && r.content.length > 50 && (r.title.toLowerCase().includes(formData.topic.toLowerCase()) || formData.topic.toLowerCase().includes(r.title.toLowerCase())));
      if (match) {
        const contentParts = (match.content || '').split('\n').filter(Boolean);
        setGeneratedMemo({
          competencyFinal: match.objective || '',
          competencyTarget: match.objective || '',
          indicators: match.objective ? match.objective.split('،').map(s => s.trim()) : [],
          prerequisites: 'مكتسبات مرحلية ذات صلة من المنهاج الرسمي',
          problemSituation: 'وضعية انطلاق مشكلة ترتبط بواقع التلميذ ومحيطه الثقافي والاجتماعي.',
          steps: [{
            stage: 'وضعية الانطلاق (05 د)',
            teacherActivity: 'يطرح أسئلة استكشافية لتشخيص المكتسبات القبلية وربطها بالظاهرة الجديدة.',
            studentActivity: 'يجيب ويشارك في النقاش وصياغة الفرضيات الأولية.',
            method: 'حوار استكشافي'
          }, {
            stage: 'بناء التعلمات (40 د)',
            teacherActivity: contentParts.slice(0, 3).join('\n') || match.content || '',
            studentActivity: 'يلاحظ، يحلل، يشارك في بناء المفاهيم واستنتاج القواعد.',
            method: match.method || 'عمل جماعي موجه'
          }, {
            stage: 'استثمار المكتسبات (15 د)',
            teacherActivity: 'يطرح وضعية إدماجية تطبيقية لترسيخ التعلمات وتقويم الأثر.',
            studentActivity: 'يوظف التعلمات الجديدة في حل الوضعية الفردية.',
            method: 'عمل فردي مستقل'
          }],
          tools: match.tools || formData.support,
          evaluationDiag: 'أسئلة استكشافية لتحديد المكتسبات القبلية',
          evaluationFormative: 'ملاحظة أداء المتعلمين أثناء الإنجاز والتحليل',
          evaluationFinal: 'وضعية إدماجية وتطبيق كتابي فوري',
          remediation: 'دعم فردي للمتعثرين مع تمارين إضافية مبسطة',
          enrichment: 'أنشطة إثرائية وبحثية للمتفوقين',
          notes: `مصدر المذكرة: بنك الموارد المنهجي الرسمي (تمكين)`,
          values: 'الاعتزاز باللغة العربية والهوية الوطنية والأخلاق الفاضلة'
        });
        setGenerationSource('db');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[SmartMemo] DB search failed:', err);
    }

    // === الخطوة 2: محاولة التوليد السحابي إن وُجد مفتاح Gemini ===
    const apiKey = localStorage.getItem('tamkeen_gemini_key') || '';
    if (apiKey) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `أنت خبير ومفتش تربوي للغة العربية بالتعليم الثانوي الجزائري.
        قم بتوليد مذكرة بيداغوجية رسمية بالجيل الثاني وفق المقاربة بالكفاءات (APC).
        المادة: ${formData.subject}
        المستوى: ${formData.grade} (${formData.stream})
        الوحدة/المحور: ${formData.unit}
        النشاط: ${formData.activity}
        الموضوع: ${formData.topic}

        أجب بـ JSON حصراً بنفس هيكلة المذكرات الجزائرية:
        {
          "competencyFinal": "الكفاءة الختامية",
          "competencyTarget": "الكفاءات المستهدفة",
          "indicators": ["مؤشر 1", "مؤشر 2"],
          "prerequisites": "المكتسبات القبلية",
          "problemSituation": "الوضعية المشكلة الانطلاقية",
          "steps": [
            { "stage": "وضعية الانطلاق (05 د)", "teacherActivity": "...", "studentActivity": "...", "method": "حوار" },
            { "stage": "بناء التعلمات - نشاط 1 (20 د)", "teacherActivity": "...", "studentActivity": "...", "method": "استقراء" },
            { "stage": "بناء التعلمات - نشاط 2 (20 د)", "teacherActivity": "...", "studentActivity": "...", "method": "عمل ثنائي" },
            { "stage": "استثمار المكتسبات (15 د)", "teacherActivity": "...", "studentActivity": "...", "method": "فردي" }
          ],
          "tools": "الوسائل التعليمية",
          "evaluationDiag": "تقويم تشخيصي",
          "evaluationFormative": "تقويم تكويني",
          "evaluationFinal": "تقويم ختامي",
          "remediation": "معالجة بيداغوجية",
          "enrichment": "أنشطة إثرائية",
          "notes": "ملاحظات",
          "values": "القيم التربوية"
        }`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-lite',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        let text = response.text || "{}";
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(text);
        setGeneratedMemo(result);
        setGenerationSource('ai');
        setIsLoading(false);
        return;
      } catch (geminiError) {
        console.warn('[SmartMemo] Cloud AI failed or quota exhausted, switching to Local Pedagogical AI Engine:', geminiError);
      }
    }

    // === الخطوة 3: التوليد بالذكاء الاصطناعي المحلي المنهجي المفتوح والمجاني (برصيد غير منتهي) ===
    try {
      const localResult = await generateLocalMemo({
        grade: formData.grade,
        subject: formData.subject,
        activity: formData.activity,
        topic: formData.topic,
        unit: formData.unit,
        stream: formData.stream,
        institution: profile.institution
      });

      setGeneratedMemo(localResult);
      setGenerationSource('local_engine');

      // حفظ تلقائي في بنك الموارد لتعزيز الاسترجاع السريع لاحقاً
      addResource({
        subject: formData.subject,
        level: profile.level || 'SECONDARY',
        grade: formData.grade,
        unit: formData.unit,
        activity: formData.activity,
        title: formData.topic,
        objective: localResult.competencyTarget,
        content: `الكفاءة: ${localResult.competencyFinal}\nالوضعية الانطلاقية: ${localResult.problemSituation}\nسير الحصة:\n${localResult.steps.map(s => `- ${s.stage}: ${s.teacherActivity}`).join('\n')}`,
        tools: localResult.tools,
        method: localResult.steps[1]?.method || 'استقرائي',
        source: 'ai'
      }).catch(err => console.warn('Auto-save error:', err));

    } catch (engineError: any) {
      console.error('[SmartMemo] Local engine error:', engineError);
      alert('حدث خطأ غير متوقع أثناء المعالجة: ' + engineError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateExam = () => {
    setIsLoading(true);
    setTimeout(() => {
      const exam = generateLocalExam({
        grade: formData.grade as any,
        stream: formData.stream,
        unitTheme: formData.unit
      });
      setGeneratedExam(exam);
      setIsLoading(false);
    }, 400);
  };

  const handleExportPDF = async () => {
    if (!generatedMemo) return;
    setIsExporting(true);
    try {
      const { exportSmartMemoToPDF } = await import('../utils/pdfGenerator');
      await exportSmartMemoToPDF(profile, generatedMemo, {
        subject: formData.subject || profile.teachingSubject || 'مادة عامة',
        grade: isSecondary && formData.stream ? `${formData.grade} (${formData.stream})` : formData.grade,
        unit: formData.unit || '',
        activity: formData.activity || '',
        topic: formData.topic || 'مذكرة بيداغوجية',
        memoNumber: formData.memoNumber || '01',
        duration: formData.duration || '60 دقيقة',
        date: formData.date || new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير المذكرة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  const inputCls = "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white";
  const labelCls = "text-[10px] font-black text-slate-400 uppercase pr-2";

  return (
    <div className="space-y-6 font-sans pb-32 animate-in" dir="rtl">
      {/* Header */}
      <div className="bg-[#1b4332] text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-b-8 border-emerald-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="p-4 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
            <Cpu size={36} className="text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black leading-normal">مساعد تمكين البيداغوجي الذكي</h2>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow">
                محلي • مفتوح المصدر • برصيد غير منتهي
              </span>
            </div>
            <p className="text-emerald-200/70 font-bold text-xs mt-1">
              مبني على تفكيك المنهاج الجزائري الرسمي، التدرجات السنوية، وبطاقات التفتيش للطور الثانوي
            </p>
          </div>
        </div>

        {/* Mode & Tab Switcher */}
        <div className="relative z-10 flex items-center gap-2 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-800/50">
          <button
            onClick={() => setActiveTab('memo')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'memo' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-emerald-200 hover:text-white'}`}
          >
            <PenTool size={14} /> المذكرة البيداغوجية
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'exam' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-emerald-200 hover:text-white'}`}
          >
            <Award size={14} /> الفروض والاختبارات الرسمية
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-3">
              <Layers className="text-indigo-600" size={18} />
              <h3 className="font-black text-slate-800 dark:text-white text-sm">بيانات المنهاج والتوليد</h3>
            </div>
            {/* Quick Picker from official curriculum */}
            <button
              onClick={() => setShowCurriculumModal(true)}
              className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-all"
            >
              <BookCheck size={14} /> دروس المنهاج المعتمد
            </button>
          </div>

          {/* Institution & Level Info */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 space-y-1">
            <p><strong className="text-emerald-700 dark:text-emerald-400">المؤسسة:</strong> {profile.institution || 'ثانوية / مؤسسة تربوية'}</p>
            <p><strong className="text-emerald-700 dark:text-emerald-400">الطور:</strong> {levelLabel} | <strong className="text-emerald-700 dark:text-emerald-400">المادة:</strong> {formData.subject}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>رقم المذكرة</label>
              <input type="text" value={formData.memoNumber} onChange={e => setFormData({ ...formData, memoNumber: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>المدة الزمنية</label>
              <select value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className={inputCls}>
                <option value="45 دقيقة">45 دقيقة</option>
                <option value="60 دقيقة">ساعة واحدة (60 د)</option>
                <option value="90 دقيقة">ساعة ونصف (90 د)</option>
                <option value="120 دقيقة">ساعتان (120 د)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>تاريخ الإنجاز</label>
              <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className={inputCls} />
            </div>
          </div>

          {isSecondary ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelCls}>المستوى الدراسي</label>
                <select value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className={inputCls}>
                  {(GRADES_MAP[normalizedLevel] || ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة']).map((g: string) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelCls}>الشعبة الدراسية</label>
                <select value={formData.stream} onChange={e => setFormData({ ...formData, stream: e.target.value })} className={inputCls}>
                  {SECONDARY_STREAMS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className={labelCls}>المستوى الدراسي</label>
              <select value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className={inputCls}>
                {(GRADES_MAP[normalizedLevel] || ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'السنة الخامسة']).map((g: string) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className={labelCls}>المقطع / المحور التعلمي</label>
            <input 
              type="text" 
              placeholder={isSecondary ? "مثال: الوحدة 06: فلسطين في الشعر العربي المعاصر" : "مثال: المقطع 03: الهوية الوطنية"} 
              value={formData.unit} 
              onChange={e => setFormData({ ...formData, unit: e.target.value })} 
              className={inputCls} 
            />
          </div>

          <div className="space-y-1">
            <label className={labelCls}>النشاط التربوي</label>
            <div className="relative">
              <input 
                list="activities-list" 
                value={formData.activity} 
                onChange={e => setFormData({ ...formData, activity: e.target.value })} 
                placeholder="اختر أو اكتب النشاط التربوي..."
                className={inputCls} 
              />
              <datalist id="activities-list">
                {(isSecondary ? SECONDARY_ACTIVITIES : normalizedLevel === 'middle' ? MIDDLE_ACTIVITIES : PRIMARY_ACTIVITIES).map(a => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className={labelCls}>عنوان الدرس / الموضوع</label>
            <input 
              type="text" 
              placeholder="مثال: حالة حصار لمحمود درويش / إعراب إذا وإذ..." 
              value={formData.topic} 
              onChange={e => setFormData({ ...formData, topic: e.target.value })} 
              className={inputCls} 
            />
            {isSearching && <Loader2 size={14} className="absolute left-4 top-8 animate-spin text-emerald-500" />}
          </div>

          {/* Resource Suggestions */}
          {resourceSuggestions.length > 0 && showSuggestions && (
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Database size={12} />
                  <span className="text-[9px] font-black uppercase">دروس مقترحة من المنهاج والمستودع</span>
                  <span className="text-[8px] bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded-full font-black">{resourceSuggestions.length}</span>
                </div>
                <button onClick={() => setShowSuggestions(false)} className="text-slate-400 hover:text-rose-500"><X size={12} /></button>
              </div>
              {resourceSuggestions.map(res => (
                <button key={res.id} onClick={() => applyResourceSuggestion(res)} className="w-full text-right p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-emerald-400 transition-all text-xs">
                  <span className="font-black text-slate-800 dark:text-white">{res.title}</span>
                  {res.objective && <p className="text-[9px] text-slate-500 mt-0.5 truncate">{res.objective}</p>}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <label className={labelCls}>السندات والوسائل</label>
            <input type="text" value={formData.support} onChange={e => setFormData({ ...formData, support: e.target.value })} className={inputCls} />
          </div>

          {/* AI Engine Status Banner (No Lockout!) */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 text-xs flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <p className="font-black text-emerald-900 dark:text-emerald-200 text-[11px]">محرك التوليد المنهجي الذاتي نشط 100%</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">يعمل محلياً بدون رصيد ينتهي وبدون انقطاع وفق منهاج الجيل الثاني</p>
            </div>
          </div>

          {/* Generate Button */}
          {activeTab === 'memo' ? (
            <button 
              onClick={generateMemo} 
              disabled={isLoading} 
              className="w-full bg-[#1b4332] text-white py-4 rounded-[2rem] font-black text-sm shadow-xl hover:bg-emerald-900 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-b-6 border-emerald-950"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} className="fill-white" />}
              توليد المذكرة البيداغوجية الرسمية
            </button>
          ) : (
            <button 
              onClick={generateExam} 
              disabled={isLoading} 
              className="w-full bg-amber-500 text-slate-950 py-4 rounded-[2rem] font-black text-sm shadow-xl hover:bg-amber-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-b-6 border-amber-700"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Award size={20} />}
              توليد فرض/اختبار نموذجي بسلم التنقيط
            </button>
          )}
        </div>

        {/* Preview / Results Area */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'memo' ? (
            /* Memo Preview */
            !generatedMemo && !isLoading ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 border-4 border-dashed border-slate-200 dark:border-slate-800 p-16 rounded-[3rem] text-center flex flex-col items-center gap-5">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner text-slate-200 dark:text-slate-700">
                  <BookOpen size={40} />
                </div>
                <p className="text-slate-500 font-black text-sm">
                  اختر درساً من «دروس المنهاج المعتمد» أو أدخل عنوان الدرس ثم اضغط «توليد المذكرة»
                </p>
                <button
                  onClick={() => setShowCurriculumModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <BookCheck size={16} /> تصفح وحدات ودروس المنهاج الثانوي
                </button>
              </div>
            ) : isLoading ? (
              <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] shadow-xl text-center space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 border-8 border-emerald-100 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                  <Cpu className="absolute inset-0 m-auto text-emerald-600 animate-pulse" size={32} />
                </div>
                <h3 className="text-xl font-black dark:text-white">جاري التوليد البيداغوجي وفق المقاربة بالكفاءات...</h3>
                <p className="text-slate-400 font-bold text-xs italic">استخراج المعايير، الأهداف السلوكية، ومراحل بناء التعلمات</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Source Badge */}
                <div className="p-3 rounded-2xl flex items-center justify-between text-xs font-black bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-600" />
                    <span>
                      {generationSource === 'local_engine' 
                        ? '⚡ تم التوليد بواسطة محرك الذكاء الاصطناعي المحلي المنهجي (مجاني غير منتهي 100%)' 
                        : generationSource === 'db' 
                        ? '🏛️ تم الاسترجاع من بنك الموارد والمنهاج الرسمي للتعليم الثانوي' 
                        : '✨ تم التوليد بنموذج الذكاء الاصطناعي'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 px-2 py-0.5 rounded-full">منهاج رسمي موثق</span>
                </div>

                <div className="flex justify-end gap-3 no-print">
                  <button onClick={handleExportPDF} disabled={isExporting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50 border-b-4 border-emerald-800">
                    {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />} تصدير PDF للطباعة
                  </button>
                </div>

                {/* Printable Formatted Card */}
                <div className="bg-white p-8 shadow-2xl border-2 border-slate-200 rounded-3xl text-slate-900 overflow-x-auto text-sm space-y-5" style={{ fontFamily: 'var(--font-platform)' }}>
                  {/* Official Inspection Header */}
                  <div className="space-y-3 border-b-2 border-slate-900 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="text-[10px] font-bold leading-relaxed space-y-0.5">
                        <p className="font-black text-xs">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                        <p>وزارة التربية الوطنية</p>
                        <p>المؤسسة: {profile.institution || generatedMemo.institution || 'مدرسة أشبال الأمّة وعواع المدني ن ع 1 –المسيلة-'}</p>
                      </div>
                      <div className="text-center">
                        <TamkeenLogo size={40} className="mb-1 mx-auto" />
                        <p className="text-[10px] font-black">مذكرة بيداغوجية رقم: {formData.memoNumber}</p>
                        <p className="text-[8px] text-slate-500 font-bold">الجيل الثاني — المقاربة بالكفاءات</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-3 rounded-2xl border border-slate-300">
                      <div className="space-y-1">
                        <p><strong>الثانوية / المؤسسة:</strong> {profile.institution || generatedMemo.institution || 'مدرسة أشبال الأمة'}</p>
                        <p><strong>الوحدة التعلمية:</strong> {generatedMemo.unitNumberAndTitle || formData.unit}</p>
                        <p><strong>النشاط:</strong> <span className="font-black text-emerald-800">{formData.activity}</span></p>
                        <p><strong>الموضوع:</strong> <span className="font-black text-indigo-700">{formData.topic}</span></p>
                      </div>
                      <div className="space-y-1">
                        <p><strong>الفئة المستهدفة:</strong> {generatedMemo.targetGroup || `${formData.grade} (${formData.stream})`}</p>
                        <p><strong>المدة الزمنية للوحدة:</strong> {generatedMemo.unitDuration || '06 ساعات'} • <strong>الحصة:</strong> {formData.duration}</p>
                        <p><strong>السندات التربوية:</strong> {formData.support}</p>
                        <p><strong>الأستاذ(ة):</strong> {profile.name || 'أستاذ(ة) التعليم الثانوي'}</p>
                      </div>
                    </div>

                    {/* Competency & Objectives */}
                    <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-[10px] space-y-2">
                      <div>
                        <strong className="text-emerald-900 font-black">الكفاءة: </strong>
                        <span className="text-slate-800 font-bold leading-relaxed">{generatedMemo.competencyFinal}</span>
                      </div>
                      {generatedMemo.objectivesList && generatedMemo.objectivesList.length > 0 && (
                        <div>
                          <strong className="text-emerald-900 font-black block mb-1">الأهداف التعلمية:</strong>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-bold pr-2">
                            {generatedMemo.objectivesList.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Tools Note */}
                    <div className="p-2 bg-slate-100 rounded-xl border border-slate-200 text-[9px] text-slate-600 font-bold">
                      💡 {generatedMemo.toolsNote || 'ملاحظة: تحدد الوسائل الكتاب المدرسي - الكتب: المصادر والمراجع – الأسناد المكتوبة (المطبوعات و الصور) والمرئية ( فيديو) والمسموعة (تسجيل صوتي).'}
                    </div>
                  </div>

                  {/* Core 6-Column Inspection Table */}
                  <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-[#1b4332] text-white px-4 py-2.5 text-xs font-black flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardList size={16} /> النُّص الأدبيّ وروافده (سير الحصة والأنشطة البانية للتعلمات)
                      </div>
                      <span className="text-[10px] bg-emerald-600/80 px-2 py-0.5 rounded-full">المقاربة بالكفاءات</span>
                    </div>
                    <table className="w-full border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-slate-100 font-black text-slate-800">
                          <th className="border border-slate-300 p-2 w-[14%] text-center">وضعيّات التَّعلُّم</th>
                          <th className="border border-slate-300 p-2 w-[10%] text-center">الهدف التعلُّمي</th>
                          <th className="border border-slate-300 p-2 w-[34%]">الأنشطة البانية للتّعلمات: نشاطُ الأُستاذ</th>
                          <th className="border border-slate-300 p-2 w-[22%]">نشاطُ المُتعلِّم</th>
                          <th className="border border-slate-300 p-2 w-[10%] text-center">التّقويم</th>
                          <th className="border border-slate-300 p-2 w-[10%] text-center">معايير ومؤشّرات الإنجاز</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedMemo.steps?.map((step, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-300 p-2 font-black text-center bg-slate-50 text-[10px]">{step.stage}</td>
                            <td className="border border-slate-300 p-2 font-bold text-center text-[10px] text-emerald-800">{step.objectiveDomain || 'معرفيّ'}</td>
                            <td className="border border-slate-300 p-2 whitespace-pre-line text-[10px] leading-relaxed">{step.teacherActivity}</td>
                            <td className="border border-slate-300 p-2 whitespace-pre-line text-[10px] leading-relaxed">{step.studentActivity}</td>
                            <td className="border border-slate-300 p-2 text-center font-bold text-[10px] italic">{step.evaluationType || step.method || 'تكوينيّ'}</td>
                            <td className="border border-slate-300 p-2 text-center font-black text-[10px] text-slate-700 bg-slate-50">{step.indicatorsAndTiming || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Integration Tasks Table (if available) */}
                  {generatedMemo.isIntegration && generatedMemo.integrationTasks && (
                    <div className="border border-slate-300 rounded-2xl overflow-hidden mt-4">
                      <div className="bg-amber-600 text-white px-4 py-2 text-xs font-black flex items-center gap-2">
                        <ClipboardList size={16} /> جدول المهام والمقاطع لإنتاج الوضعية الإدماجية
                      </div>
                      <table className="w-full border-collapse text-[10px]">
                        <thead className="bg-slate-100 font-black">
                          <tr>
                            <th className="border border-slate-300 p-2 w-[15%]">المقاطع</th>
                            <th className="border border-slate-300 p-2">الموارد المستهدفة</th>
                            <th className="border border-slate-300 p-2 w-[20%] text-center">النّمط</th>
                            <th className="border border-slate-300 p-2 w-[20%] text-center">المؤشّر</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedMemo.integrationTasks.map((t, idx) => (
                            <tr key={idx}>
                              <td className="border border-slate-300 p-2 font-black text-center bg-slate-50">{t.section}</td>
                              <td className="border border-slate-300 p-2">{t.resources}</td>
                              <td className="border border-slate-300 p-2 text-center font-bold">{t.pattern}</td>
                              <td className="border border-slate-300 p-2 text-center font-black text-emerald-700">{t.indicators}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Rubric Grid (if available) */}
                  {generatedMemo.isIntegration && generatedMemo.rubricCriteria && (
                    <div className="border border-slate-300 rounded-2xl overflow-hidden mt-4">
                      <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-black flex items-center gap-2">
                        <CheckCircle2 size={16} /> شبكة التّقييم الذاتي والجماعي للإنتاج البيداغوجي
                      </div>
                      <table className="w-full border-collapse text-[10px]">
                        <thead className="bg-slate-100 font-black">
                          <tr>
                            <th className="border border-slate-300 p-2 w-[22%]">المعيار</th>
                            <th className="border border-slate-300 p-2">طريقة التّحقّق ومؤشرات الأداء</th>
                            <th className="border border-slate-300 p-2 w-[8%] text-center">نعم</th>
                            <th className="border border-slate-300 p-2 w-[8%] text-center">لا</th>
                            <th className="border border-slate-300 p-2 w-[18%]">المعالجة البيداغوجية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedMemo.rubricCriteria.map((r, idx) => (
                            <tr key={idx}>
                              <td className="border border-slate-300 p-2 font-black bg-slate-50">{r.criterion}</td>
                              <td className="border border-slate-300 p-2">{r.checkMethod}</td>
                              <td className="border border-slate-300 p-2 text-center">⬜</td>
                              <td className="border border-slate-300 p-2 text-center">⬜</td>
                              <td className="border border-slate-300 p-2 text-slate-600 italic">{r.remediation || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Remediation and Values */}
                  <div className="grid grid-cols-2 gap-3 text-[10px] pt-2">
                    <div className="border border-slate-300 p-3 rounded-xl bg-slate-50 space-y-1">
                      <strong className="text-emerald-800">الدعم والمعالجة البيداغوجية:</strong>
                      <p>{generatedMemo.remediation || 'متابعة فردية للمتعثرين ورأب الصدع المعرفي'}</p>
                    </div>
                    <div className="border border-slate-300 p-3 rounded-xl bg-slate-50 space-y-1">
                      <strong className="text-emerald-800">القيم الوطنية والتربوية:</strong>
                      <p>{generatedMemo.values || 'الاعتزاز باللغة العربية والهوية الوطنية'}</p>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="mt-8 flex justify-between px-8 pt-6 border-t-2 border-dashed border-slate-300">
                    <div className="text-center text-[10px] font-black">إمضاء الأستاذ(ة)</div>
                    <div className="text-center text-[10px] font-black">تأشيرة السيد المفتش / المدير</div>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Exam Preview */
            !generatedExam && !isLoading ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 border-4 border-dashed border-slate-200 dark:border-slate-800 p-16 rounded-[3rem] text-center flex flex-col items-center gap-5">
                <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center text-amber-500">
                  <Award size={40} />
                </div>
                <h4 className="font-black text-slate-800 dark:text-white text-base">توليد الفروض والامتحانات الرسمية بسلم التنقيط</h4>
                <p className="text-slate-400 font-bold text-xs max-w-md">
                  يولد النظام امتحاناً شاملاً للطور الثانوي يضم: سند القراءة (أدبي أو نثري)، أسئلة البناء الفكري، البناء اللغوي، التقويم النقدي، الوضعية الإدماجية، وسلالم التنقيط النموذجية المعتمدة في البكالوريا.
                </p>
                <button onClick={generateExam} className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center gap-2">
                  <Zap size={16} /> توليد الامتحان النموذجي الآن
                </button>
              </div>
            ) : isLoading ? (
              <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] shadow-xl text-center space-y-6">
                <RefreshCw className="animate-spin mx-auto text-amber-500" size={36} />
                <h3 className="text-xl font-black dark:text-white">جاري إعداد موضوع الامتحان وسلم الإجابة...</h3>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-8 shadow-2xl border-2 border-slate-200 rounded-3xl text-slate-900 text-sm space-y-6" style={{ fontFamily: 'var(--font-platform)' }}>
                  <div className="text-center border-b-2 border-slate-900 pb-4">
                    <p className="font-black text-xs">الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية</p>
                    <h3 className="text-base font-black mt-2 text-indigo-900">{generatedExam?.title}</h3>
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      المستوى: {generatedExam?.level} | الشعبة: {generatedExam?.stream} | المدة: {generatedExam?.duration}
                    </p>
                  </div>

                  {/* Reading Text */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300">
                    <h4 className="font-black text-xs text-slate-700 mb-2">السند الشعري / النثري:</h4>
                    <p className="font-bold text-xs leading-loose whitespace-pre-line text-slate-800">{generatedExam?.readingText}</p>
                    <p className="text-left text-[11px] font-black text-indigo-700 mt-2">— {generatedExam?.author}</p>
                  </div>

                  {/* Section 1: Intellectual Comprehension */}
                  <div className="space-y-2">
                    <div className="bg-[#1b4332] text-white px-3 py-1.5 rounded-xl font-black text-xs flex justify-between">
                      <span>أولاً: البناء الفكري</span>
                      <span>(08 إلى 10 نقاط)</span>
                    </div>
                    <ul className="space-y-2 pr-3">
                      {generatedExam?.intellectualComprehension.map((q, idx) => (
                        <li key={idx} className="flex justify-between items-start text-xs font-bold border-b border-slate-100 pb-1">
                          <span>{idx + 1}. {q.question}</span>
                          <span className="text-emerald-700 font-black text-[10px]">({q.points} ن)</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Section 2: Linguistic Competence */}
                  <div className="space-y-2">
                    <div className="bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-black text-xs flex justify-between">
                      <span>ثانياً: البناء اللغوي</span>
                      <span>(06 إلى 08 نقاط)</span>
                    </div>
                    <ul className="space-y-2 pr-3">
                      {generatedExam?.linguisticCompetence.map((q, idx) => (
                        <li key={idx} className="flex justify-between items-start text-xs font-bold border-b border-slate-100 pb-1">
                          <span>{idx + 1}. {q.question}</span>
                          <span className="text-indigo-700 font-black text-[10px]">({q.points} ن)</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Section 3: Critical Evaluation (if available) */}
                  {generatedExam?.criticalEvaluation && (
                    <div className="space-y-2">
                      <div className="bg-violet-700 text-white px-3 py-1.5 rounded-xl font-black text-xs flex justify-between">
                        <span>ثالثاً: التقويم النقدي (خاص بالشعب الأدبية)</span>
                        <span>(04 نقاط)</span>
                      </div>
                      <ul className="space-y-2 pr-3">
                        {generatedExam?.criticalEvaluation.map((q, idx) => (
                          <li key={idx} className="flex justify-between items-start text-xs font-bold">
                            <span>{q.question}</span>
                            <span className="text-violet-700 font-black text-[10px]">({q.points} ن)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Section 4: Integration Situation */}
                  {generatedExam?.integrationSituation && (
                    <div className="space-y-2">
                      <div className="bg-amber-600 text-white px-3 py-1.5 rounded-xl font-black text-xs flex justify-between">
                        <span>الوضعية الإدماجية (التعبير الكتابي)</span>
                        <span>({generatedExam.integrationSituation.points} نقاط)</span>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-bold space-y-1">
                        <p><strong>السياق:</strong> {generatedExam.integrationSituation.context}</p>
                        <p><strong>السند والتعليمة:</strong> {generatedExam.integrationSituation.task}</p>
                      </div>
                    </div>
                  )}

                  {/* Rubric Accordion */}
                  <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-3">
                    <h4 className="font-black text-xs text-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" /> سلم التنقيط والإجابة النموذجية المعتمدة
                    </h4>
                    <div className="space-y-2">
                      {generatedExam?.rubric.map((r, i) => (
                        <div key={i} className="text-xs border-b border-slate-200 pb-2">
                          <p className="font-black text-slate-700">{r.question} ({r.points} ن):</p>
                          <p className="text-emerald-800 font-bold mt-0.5">{r.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Curriculum Lessons Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <BookCheck className="text-emerald-600" size={24} />
                <div>
                  <h3 className="font-black text-base text-slate-800 dark:text-white">قاعدة بيانات المنهاج الرسمي للغة العربية (الطور الثانوي)</h3>
                  <p className="text-xs text-slate-400 font-bold">انقر على أي درس لتعبئة المعطيات وتوليد المذكرة الرسمية فوراً</p>
                </div>
              </div>
              <button onClick={() => setShowCurriculumModal(false)} className="text-slate-400 hover:text-rose-500">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {SECONDARY_ARABIC_CURRICULUM.map(lesson => (
                <div 
                  key={lesson.id} 
                  onClick={() => selectCurriculumItem(lesson)}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {lesson.topic}
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-black px-2.5 py-0.5 rounded-full">
                      {lesson.grade} • {lesson.activity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <strong>المحور:</strong> {lesson.unitTitle} ({lesson.stream})
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                    {lesson.competencyTarget}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Section box for on-screen preview
const SectionBox: React.FC<{ icon: React.ReactNode; title: string; color: string; children: React.ReactNode }> = ({ icon, title, color, children }) => (
  <div className="border border-slate-300 rounded-xl overflow-hidden">
    <div className={`bg-${color}-600 text-white px-4 py-2 text-[11px] font-black flex items-center gap-2`} style={{ backgroundColor: color === 'indigo' ? '#4f46e5' : color === 'violet' ? '#7c3aed' : color === 'blue' ? '#2563eb' : color === 'purple' ? '#9333ea' : color === 'amber' ? '#d97706' : color === 'teal' ? '#0d9488' : color === 'slate' ? '#475569' : '#6b7280' }}>
      {icon} {title}
    </div>
    <div className="p-3 text-[10px] font-bold leading-relaxed whitespace-pre-line">{children}</div>
  </div>
);

export default SmartMemoView;
