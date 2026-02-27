import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PenTool, Zap, Download, RefreshCw, FileText, Sparkles, Layers, BookOpen, Target, CheckCircle2, Database, X, Loader2, ClipboardList, GraduationCap, Brain, Lightbulb, Wrench, BarChart3, HeartHandshake, StickyNote } from 'lucide-react';
import { TeacherProfile, Resource } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { TamkeenLogo } from '../../legacy_components/TamkeenLogo';
import { addResource, listResources } from '../../services/resourceBankService';

interface MemoData {
  memoNumber: string;
  duration: string;
  unit: string;
  activity: string;
  topic: string;
  support: string;
  grade: string;
  subject: string;
  date: string;
}

interface MemoContent {
  competencyFinal: string;
  competencyTarget: string;
  indicators: string[];
  prerequisites: string;
  problemSituation: string;
  steps: {
    stage: string;
    teacherActivity: string;
    studentActivity: string;
    method: string;
  }[];
  tools: string;
  evaluationDiag: string;
  evaluationFormative: string;
  evaluationFinal: string;
  remediation: string;
  enrichment: string;
  notes: string;
  values: string;
}

const SmartMemoView: React.FC<{ profile: TeacherProfile }> = ({ profile }) => {
  const levelLabel = profile.level === 'PRIMARY' ? 'ابتدائي' : profile.level === 'MIDDLE' ? 'متوسط' : 'ثانوي';

  const [formData, setFormData] = useState<MemoData>({
    memoNumber: '01',
    duration: '60 دقيقة',
    unit: '',
    activity: '',
    topic: '',
    support: 'الكتاب المدرسي، السبورة',
    grade: profile.grades?.[0] || '',
    subject: profile.teachingSubject,
    date: new Date().toISOString().split('T')[0],
  });

  const [generatedMemo, setGeneratedMemo] = useState<MemoContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationSource, setGenerationSource] = useState<'db' | 'ai' | null>(null);
  const [resourceSuggestions, setResourceSuggestions] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const printTemplateRef = useRef<HTMLDivElement>(null);

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

  const generateMemo = async () => {
    if (!formData.topic || !formData.activity) {
      alert("يرجى إدخال النشاط والموضوع أولاً.");
      return;
    }
    setIsLoading(true);

    // === Step 1: Try resource bank first ===
    try {
      const dbResults = await listResources({
        subject: formData.subject || undefined,
        activity: formData.activity || undefined,
        search: formData.topic || undefined,
      });
      const match = dbResults.find(r => r.content && r.content.length > 50);
      if (match) {
        const contentParts = (match.content || '').split('\n').filter(Boolean);
        setGeneratedMemo({
          competencyFinal: match.objective || '',
          competencyTarget: match.objective || '',
          indicators: match.objective ? match.objective.split('،').map(s => s.trim()) : [],
          prerequisites: '',
          problemSituation: '',
          steps: [{
            stage: 'وضعية الانطلاق',
            teacherActivity: 'يطرح أسئلة استكشافية لتشخيص المكتسبات القبلية',
            studentActivity: 'يجيب ويشارك في النقاش',
            method: 'حوار'
          }, {
            stage: 'بناء التعلمات',
            teacherActivity: contentParts.slice(0, 3).join('\n') || match.content || '',
            studentActivity: 'يلاحظ، يحلل، ينجز النشاطات المطلوبة',
            method: 'عمل فردي / ثنائي'
          }, {
            stage: 'استثمار المكتسبات',
            teacherActivity: 'يطرح وضعية إدماجية تطبيقية',
            studentActivity: 'يوظف التعلمات الجديدة في حل الوضعية',
            method: 'عمل فردي'
          }],
          tools: match.tools || formData.support,
          evaluationDiag: 'أسئلة استكشافية لتحديد المكتسبات القبلية',
          evaluationFormative: 'ملاحظة أداء المتعلمين أثناء الإنجاز',
          evaluationFinal: 'وضعية إدماجية / تمرين تطبيقي',
          remediation: 'دعم فردي للمتعثرين مع تمارين إضافية مبسطة',
          enrichment: 'أنشطة إثرائية للمتفوقين',
          notes: `مصدر المذكرة: بنك الموارد (${match.source === 'admin' ? 'مصدر رسمي' : match.source === 'ai' ? 'توليد آلي سابق' : 'مساهمة مستخدم'})`,
          values: 'التعاون – المسؤولية – حب المعرفة'
        });
        setGenerationSource('db');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[SmartMemo] DB search failed, falling back to AI:', err);
    }

    // === Step 2: Fallback to AI ===
    const apiKey = localStorage.getItem('tamkeen_gemini_key') || '';
    if (!apiKey) {
      alert("المستودع فارغ ولم يتم العثور على مورد مطابق.\nللتوليد الآلي، يرجى إضافة مفتاح Gemini API في الإعدادات.\n(احصل عليه مجاناً من aistudio.google.com)");
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `أنت خبير بيداغوجي ومفتش تربوي بوزارة التربية الوطنية الجزائرية.
      قم بتوليد "مذكرة بيداغوجية" رسمية كاملة لدرس بـ ${levelLabel}.

      المادة: ${formData.subject}
      المستوى: ${formData.grade}
      المقطع/الوحدة: ${formData.unit}
      النشاط: ${formData.activity}
      الموضوع: ${formData.topic}

      يجب أن تحترم المذكرة هيكلة الجيل الثاني بكل الأقسام التسعة:
      أجب بتنسيق JSON حصراً:
      {
        "competencyFinal": "الكفاءة الختامية وفق المنهاج",
        "competencyTarget": "الكفاءات المرحلية / المستهدفة",
        "indicators": ["أن يعرّف المتعلم...", "أن ينجز...", "أن يوظف..."],
        "prerequisites": "المكتسبات القبلية",
        "problemSituation": "الوضعية المشكلة (الانطلاق) - وضعية سياقية مرتبطة بواقع المتعلم",
        "steps": [
          { "stage": "وضعية الانطلاق", "teacherActivity": "ما يفعله الأستاذ بالتفصيل", "studentActivity": "ما يفعله المتعلم", "method": "حوار" },
          { "stage": "بناء التعلمات - نشاط 1", "teacherActivity": "شرح مفصل", "studentActivity": "عمل المتعلم", "method": "عمل فردي" },
          { "stage": "بناء التعلمات - نشاط 2", "teacherActivity": "شرح مفصل", "studentActivity": "عمل المتعلم", "method": "عمل ثنائي" },
          { "stage": "استثمار المكتسبات", "teacherActivity": "وضعية تطبيقية", "studentActivity": "يوظف التعلمات", "method": "عمل فردي" }
        ],
        "tools": "الوسائل التعليمية المستخدمة",
        "evaluationDiag": "تقويم تشخيصي",
        "evaluationFormative": "تقويم تكويني أثناء الحصة",
        "evaluationFinal": "تقويم ختامي (وضعية إدماجية)",
        "remediation": "دعم للمتعثرين",
        "enrichment": "إثراء للمتفوقين",
        "notes": "ملاحظات عامة",
        "values": "القيم التربوية والوطنية"
      }
      اجعل المحتوى غنياً بيداغوجياً ومطابقاً للمناهج الجزائرية. أجب بـ JSON فقط.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      let text = response.text || "{}";
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(text);
      setGeneratedMemo(result);
      setGenerationSource('ai');

      // Auto-save to resource bank
      const contentStr = `الكفاءة الختامية: ${result.competencyFinal || ''}\nالمؤشرات: ${(result.indicators || []).join('، ')}\nالمكتسبات القبلية: ${result.prerequisites || ''}\n\nسير الحصة:\n${(result.steps || []).map((s: any) => `- ${s.stage}: ${s.teacherActivity} / ${s.studentActivity}`).join('\n')}`;

      addResource({
        subject: formData.subject || profile.teachingSubject || 'مادة عامة',
        level: profile.level,
        grade: formData.grade || profile.grades?.[0] || '',
        unit: formData.unit || '',
        activity: formData.activity || 'مذكرة بيداغوجية',
        title: formData.topic || 'مذكرة بدون عنوان',
        objective: (result.indicators || []).join('، '),
        content: contentStr,
        tools: result.tools || formData.support || '',
        source: 'ai'
      }).catch(err => console.error('Failed to auto-save to resource bank:', err));

    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes('API_KEY')) {
        alert("مفتاح API غير صالح. يرجى التحقق من المفتاح في الإعدادات.");
      } else {
        alert("حدث خطأ أثناء التوليد.\n" + error?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!printTemplateRef.current) return;
    setIsExporting(true);
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      const element = printTemplateRef.current;
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, allowTaint: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`مذكرة_${formData.topic}_${formData.date}.pdf`);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التصدير.");
    } finally {
      setIsExporting(false);
    }
  };

  const inputCls = "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white";
  const labelCls = "text-[10px] font-black text-slate-400 uppercase pr-2";

  return (
    <div className="space-y-6 font-['Cairo'] pb-32 animate-in" dir="rtl">
      {/* Header */}
      <div className="bg-[#1b4332] text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-b-8 border-emerald-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="p-4 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
            <PenTool size={36} className="text-emerald-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter">مذكرة تمكين الذكية</h2>
            <p className="text-emerald-200/70 font-bold text-xs mt-1">المساعد البيداغوجي الآلي — المستودع أولاً ثم الذكاء الاصطناعي</p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-emerald-950/50 px-5 py-2 rounded-2xl border border-emerald-800/50">
          <Database size={16} className="text-emerald-400" />
          <span className="text-[10px] font-black text-emerald-100 uppercase">أولوية المستودع</span>
          <span className="mx-1 text-emerald-600">|</span>
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-[10px] font-black text-emerald-100 uppercase">AI احتياطي</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-3 mb-2">
            <Layers className="text-indigo-600" size={18} />
            <h3 className="font-black text-slate-800 dark:text-white text-sm">معطيات المذكرة البيداغوجية</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>رقم المذكرة</label>
              <input type="text" value={formData.memoNumber} onChange={e => setFormData({ ...formData, memoNumber: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>المدة الزمنية</label>
              <input type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>تاريخ الإنجاز</label>
              <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>المادة</label>
              <input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>المستوى / القسم</label>
              <input type="text" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>المقطع / الميدان</label>
            <input type="text" placeholder="مثال: المقطع الأول: القيم الإنسانية" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className={inputCls} />
          </div>
          <div className="space-y-1">
            <label className={labelCls}>النشاط</label>
            <input type="text" placeholder="فهم المنطوق، قراءة، حساب..." value={formData.activity} onChange={e => setFormData({ ...formData, activity: e.target.value })} className={inputCls} />
          </div>
          <div className="space-y-1 relative">
            <label className={labelCls}>عنوان الدرس</label>
            <input type="text" placeholder="عنوان الدرس بدقة..." value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} className={inputCls} />
            {isSearching && <Loader2 size={14} className="absolute left-4 top-8 animate-spin text-emerald-500" />}
          </div>

          {/* Resource suggestions */}
          {resourceSuggestions.length > 0 && showSuggestions && (
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Database size={12} />
                  <span className="text-[9px] font-black uppercase">اقتراحات من المستودع</span>
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
            <label className={labelCls}>الوسائل التعليمية</label>
            <input type="text" value={formData.support} onChange={e => setFormData({ ...formData, support: e.target.value })} className={inputCls} />
          </div>

          <button onClick={generateMemo} disabled={isLoading} className="w-full bg-[#1b4332] text-white py-5 rounded-[2rem] font-black text-sm shadow-xl hover:bg-emerald-900 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-b-6 border-emerald-950">
            {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} className="fill-white" />} توليد المذكرة
          </button>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-4">
          {!generatedMemo && !isLoading ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-4 border-dashed border-slate-200 dark:border-slate-800 p-16 rounded-[3rem] text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner text-slate-200 dark:text-slate-700">
                <BookOpen size={40} />
              </div>
              <p className="text-slate-400 font-black italic text-sm">أدخل(ي) معطيات الدرس ثم اضغط «توليد المذكرة» — سيتم البحث في المستودع أولاً</p>
            </div>
          ) : isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] shadow-xl text-center space-y-6">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 border-8 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                <Database className="absolute inset-0 m-auto text-emerald-600 animate-pulse" size={32} />
              </div>
              <h3 className="text-xl font-black dark:text-white">جاري البحث في المستودع أولاً...</h3>
              <p className="text-slate-400 font-bold text-xs italic">إن لم يتوفر مورد مناسب، سيتم التوليد بالذكاء الاصطناعي تلقائياً</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Source indicator */}
              <div className={`p-3 rounded-2xl flex items-center gap-3 text-xs font-black ${generationSource === 'db' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200'}`}>
                {generationSource === 'db' ? <><Database size={16} /> تم بناء المذكرة من بنك الموارد (المستودع)</> : <><Sparkles size={16} /> تم التوليد بالذكاء الاصطناعي وحُفظ في المستودع</>}
              </div>

              <div className="flex justify-end gap-3 no-print">
                <button onClick={handleExportPDF} disabled={isExporting} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50 border-b-4 border-emerald-800">
                  {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />} تصدير PDF للطباعة
                </button>
              </div>

              {/* On-screen preview */}
              <div className="bg-white p-8 shadow-2xl border-2 border-slate-200 rounded-3xl text-slate-900 overflow-x-auto text-sm space-y-4" style={{ fontFamily: 'Cairo' }}>
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div className="text-[9px] font-bold leading-loose">
                    <p className="font-black">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                    <p>وزارة التربية الوطنية</p>
                    <p>المؤسسة: {profile.institution}</p>
                  </div>
                  <div className="text-center">
                    <TamkeenLogo size={40} className="mb-1 mx-auto" />
                    <p className="text-[9px] font-black">مذكرة بيداغوجية رقم: {formData.memoNumber}</p>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="border border-slate-300 p-3 rounded-xl bg-slate-50 space-y-1">
                    <p><strong>الطور:</strong> {levelLabel}</p>
                    <p><strong>المادة:</strong> {formData.subject}</p>
                    <p><strong>المستوى:</strong> {formData.grade}</p>
                    <p><strong>المقطع/الميدان:</strong> {formData.unit}</p>
                  </div>
                  <div className="border border-slate-300 p-3 rounded-xl bg-slate-50 space-y-1">
                    <p><strong>الأستاذ(ة):</strong> {profile.name}</p>
                    <p><strong>النشاط:</strong> {formData.activity}</p>
                    <p><strong>عنوان الدرس:</strong> <span className="text-indigo-700 font-black">{formData.topic}</span></p>
                    <p><strong>الحصة / المدة:</strong> {formData.memoNumber} / {formData.duration}</p>
                    <p><strong>التاريخ:</strong> {formData.date}</p>
                  </div>
                </div>

                {/* Sections */}
                {generatedMemo && (
                  <div className="space-y-3">
                    <SectionBox icon={<GraduationCap size={14} />} title="1) الكفاءة الختامية" color="indigo">{generatedMemo.competencyFinal}</SectionBox>
                    <SectionBox icon={<Target size={14} />} title="2) الكفاءات المرحلية / المستهدفة" color="violet">{generatedMemo.competencyTarget}</SectionBox>
                    <SectionBox icon={<CheckCircle2 size={14} />} title="3) مؤشرات الأداء" color="blue">
                      <ul className="list-disc list-inside space-y-1">{generatedMemo.indicators?.map((ind, i) => <li key={i}>{ind}</li>)}</ul>
                    </SectionBox>
                    <SectionBox icon={<Brain size={14} />} title="4) المكتسبات القبلية" color="purple">{generatedMemo.prerequisites}</SectionBox>
                    <SectionBox icon={<Lightbulb size={14} />} title="5) الوضعية المشكلة (الانطلاق)" color="amber">{generatedMemo.problemSituation}</SectionBox>

                    {/* Steps table */}
                    <div className="border border-slate-300 rounded-xl overflow-hidden">
                      <div className="bg-[#1b4332] text-white px-4 py-2 text-[11px] font-black flex items-center gap-2">
                        <ClipboardList size={14} /> سير الحصة
                      </div>
                      <table className="w-full border-collapse text-[9px]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-300 p-2 w-[14%]">المرحلة</th>
                            <th className="border border-slate-300 p-2">أداء الأستاذ</th>
                            <th className="border border-slate-300 p-2">أداء المتعلم</th>
                            <th className="border border-slate-300 p-2 w-[12%]">الطريقة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedMemo.steps?.map((step, idx) => (
                            <tr key={idx}>
                              <td className="border border-slate-300 p-2 font-black text-center bg-slate-50">{step.stage}</td>
                              <td className="border border-slate-300 p-2 whitespace-pre-line">{step.teacherActivity}</td>
                              <td className="border border-slate-300 p-2 whitespace-pre-line">{step.studentActivity}</td>
                              <td className="border border-slate-300 p-2 text-center italic">{step.method}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <SectionBox icon={<Wrench size={14} />} title="6) الوسائل التعليمية" color="teal">{generatedMemo.tools}</SectionBox>

                    <div className="border border-slate-300 rounded-xl overflow-hidden">
                      <div className="bg-orange-600 text-white px-4 py-2 text-[11px] font-black flex items-center gap-2">
                        <BarChart3 size={14} /> 7) التقويم
                      </div>
                      <div className="p-3 space-y-2 text-[10px]">
                        <p><strong>تشخيصي:</strong> {generatedMemo.evaluationDiag}</p>
                        <p><strong>تكويني:</strong> {generatedMemo.evaluationFormative}</p>
                        <p><strong>ختامي:</strong> {generatedMemo.evaluationFinal}</p>
                      </div>
                    </div>

                    <div className="border border-slate-300 rounded-xl overflow-hidden">
                      <div className="bg-rose-600 text-white px-4 py-2 text-[11px] font-black flex items-center gap-2">
                        <HeartHandshake size={14} /> 8) المعالجة البيداغوجية
                      </div>
                      <div className="p-3 space-y-2 text-[10px]">
                        <p><strong>دعم المتعثرين:</strong> {generatedMemo.remediation}</p>
                        <p><strong>إثراء المتفوقين:</strong> {generatedMemo.enrichment}</p>
                      </div>
                    </div>

                    <SectionBox icon={<StickyNote size={14} />} title="9) الملاحظات" color="slate">{generatedMemo.notes}</SectionBox>
                  </div>
                )}

                {/* Signatures */}
                <div className="mt-8 flex justify-between px-8 pt-6 border-t-2 border-dashed border-slate-300">
                  <div className="text-center text-[10px] font-black">إمضاء الأستاذ(ة)</div>
                  <div className="text-center text-[10px] font-black">ختم السيد المدير</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden PDF Print Template */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {generatedMemo && (
          <div ref={printTemplateRef} style={{ width: '210mm', padding: '12mm 15mm', background: 'white', color: 'black', fontFamily: 'Cairo', direction: 'rtl', fontSize: '10pt' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '2px solid black', paddingBottom: '8px' }}>
              <div style={{ fontSize: '9pt', fontWeight: 'bold', lineHeight: '1.8' }}>
                الجمهورية الجزائرية الديمقراطية الشعبية<br />
                وزارة التربية الوطنية<br />
                مديرية التربية لولاية {profile.province?.split('-')[1] || profile.province}<br />
                المؤسسة: {profile.institution}
              </div>
              <div style={{ textAlign: 'center' }}>
                <TamkeenLogo size={50} />
                <div style={{ marginTop: '4px', fontWeight: 900 }}>مذكرة بيداغوجية رقم: {formData.memoNumber}</div>
              </div>
            </div>

            {/* Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ border: '1px solid black', padding: '8px', fontSize: '9pt', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                الطور: {levelLabel}<br />المادة: {formData.subject}<br />المستوى/القسم: {formData.grade}<br />المقطع/الميدان: {formData.unit}<br />الوحدة: {formData.unit}
              </div>
              <div style={{ border: '1px solid black', padding: '8px', fontSize: '9pt', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                الأستاذ(ة): {profile.name}<br />النشاط: {formData.activity}<br />عنوان الدرس: {formData.topic}<br />الحصة / المدة: {formData.memoNumber} / {formData.duration}<br />التاريخ: {formData.date}
              </div>
            </div>

            {/* Sections */}
            <PrintSection num="1" title="الكفاءة الختامية">{generatedMemo.competencyFinal}</PrintSection>
            <PrintSection num="2" title="الكفاءات المرحلية / المستهدفة">{generatedMemo.competencyTarget}</PrintSection>
            <PrintSection num="3" title="مؤشرات الأداء">
              <ul style={{ paddingRight: '20px' }}>{generatedMemo.indicators?.map((ind, i) => <li key={i}>{ind}</li>)}</ul>
            </PrintSection>
            <PrintSection num="4" title="المكتسبات القبلية">{generatedMemo.prerequisites}</PrintSection>
            <PrintSection num="5" title="الوضعية المشكلة">{generatedMemo.problemSituation}</PrintSection>

            {/* Steps Table */}
            <div style={{ fontWeight: 900, marginBottom: '4px', marginTop: '10px', fontSize: '10pt' }}>سير الحصة:</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid black', fontSize: '8pt', marginBottom: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e5e7eb' }}>
                  <th style={{ border: '1px solid black', padding: '6px', width: '14%' }}>المرحلة</th>
                  <th style={{ border: '1px solid black', padding: '6px' }}>أداء الأستاذ</th>
                  <th style={{ border: '1px solid black', padding: '6px' }}>أداء المتعلم</th>
                  <th style={{ border: '1px solid black', padding: '6px', width: '12%' }}>الطريقة</th>
                </tr>
              </thead>
              <tbody>
                {generatedMemo.steps?.map((step, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid black', padding: '6px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9fafb' }}>{step.stage}</td>
                    <td style={{ border: '1px solid black', padding: '6px', whiteSpace: 'pre-line' }}>{step.teacherActivity}</td>
                    <td style={{ border: '1px solid black', padding: '6px', whiteSpace: 'pre-line' }}>{step.studentActivity}</td>
                    <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center', fontStyle: 'italic' }}>{step.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <PrintSection num="6" title="الوسائل التعليمية">{generatedMemo.tools}</PrintSection>
            <PrintSection num="7" title="التقويم">
              تشخيصي: {generatedMemo.evaluationDiag}<br />
              تكويني: {generatedMemo.evaluationFormative}<br />
              ختامي: {generatedMemo.evaluationFinal}
            </PrintSection>
            <PrintSection num="8" title="المعالجة البيداغوجية">
              دعم المتعثرين: {generatedMemo.remediation}<br />
              إثراء المتفوقين: {generatedMemo.enrichment}
            </PrintSection>
            <PrintSection num="9" title="الملاحظات">{generatedMemo.notes}</PrintSection>

            {/* Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '15px', borderTop: '1px dashed black' }}>
              <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '9pt' }}>إمضاء الأستاذ(ة)</div>
              <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '9pt' }}>ختم السيد المدير</div>
            </div>
          </div>
        )}
      </div>
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

// Helper: Print section for PDF
const PrintSection: React.FC<{ num: string; title: string; children: React.ReactNode }> = ({ num, title, children }) => (
  <div style={{ border: '1px solid black', padding: '8px', marginBottom: '6px', fontSize: '9pt' }}>
    <div style={{ fontWeight: 900, textDecoration: 'underline', marginBottom: '4px' }}>{num}) {title}:</div>
    <div style={{ fontWeight: 'bold' }}>{children}</div>
  </div>
);

export default SmartMemoView;