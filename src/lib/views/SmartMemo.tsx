import React, { useState, useRef } from 'react';
import { PenTool, Zap, Download, RefreshCw, FileText, Sparkles, Layers, BookOpen, Target, CheckCircle2, ChevronLeft, Layout } from 'lucide-react';
import { TeacherProfile } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { TamkeenLogo } from '../../legacy_components/TamkeenLogo';

interface MemoData {
  memoNumber: string;
  duration: string;
  unit: string;
  activity: string;
  topic: string;
  support: string;
  grade: string;
  subject: string;
}

interface MemoContent {
  competencies: string;
  objectives: string[];
  values: string;
  steps: {
    stage: string;
    teacherActivity: string;
    studentActivity: string;
    competency: string;
    method: string;
  }[];
}

const SmartMemoView: React.FC<{ profile: TeacherProfile }> = ({ profile }) => {
  const [formData, setFormData] = useState<MemoData>({
    memoNumber: '01',
    duration: '60 دقيقة',
    unit: '',
    activity: '',
    topic: '',
    support: 'الكتاب المدرسي، السبورة',
    grade: profile.grades[0] || '',
    subject: profile.teachingSubject
  });

  const [generatedMemo, setGeneratedMemo] = useState<MemoContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const memoRef = useRef<HTMLDivElement>(null);
  const printTemplateRef = useRef<HTMLDivElement>(null);

  const generateMemo = async () => {
    if (!formData.topic || !formData.activity) {
      alert("يرجى إدخال النشاط والموضوع أولاً.");
      return;
    }

    const apiKey = localStorage.getItem('tamkeen_gemini_key') || '';
    if (!apiKey) {
      alert("يرجى إضافة مفتاح Gemini API في صفحة الإعدادات أولاً.\n(احصل عليه مجاناً من aistudio.google.com)");
      return;
    }

    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `أنت خبير بيداغوجي ومفتش تربوي بوزارة التربية الوطنية الجزائرية.
      قم بتوليد "مذكرة بيداغوجية" رسمية كاملة لدرس بـ ${profile.level === 'PRIMARY' ? 'التعليم الابتدائي' : profile.level === 'MIDDLE' ? 'التعليم المتوسط' : 'التعليم الثانوي'}.

      المادة: ${formData.subject}
      المستوى: ${formData.grade}
      المقطع/الوحدة: ${formData.unit}
      النشاط: ${formData.activity}
      الموضوع: ${formData.topic}

      يجب أن تحترم المذكرة هيكلة الجيل الثاني:
      1. الكفاءة الختامية والمستهدفة.
      2. مؤشرات الكفاءة / الأهداف التعلمية.
      3. القيم التربوية.
      4. جدول المراحل (وضعية الانطلاق، بناء التعلمات، استثمار المكتسبات).

      أجب بتنسيق JSON حصراً كالتالي:
      {
        "competencies": "نص الكفاءة الختامية",
        "objectives": ["هدف 1", "هدف 2"],
        "values": "القيم الوطنية والتربوية المستخلصة",
        "steps": [
          {
            "stage": "اسم المرحلة (مثلاً: وضعية الانطلاق)",
            "teacherActivity": "ما يفعله الأستاذ",
            "studentActivity": "ما يفعله المتعلم",
            "competency": "الكفاءة الجزئية للمرحلة",
            "method": "طريقة العمل (مثلاً: حوار، عمل فردي)"
          }
        ]
      }
      
      اجعل المحتوى غنياً بيداغوجياً ومطابقاً للمناهج الجزائرية.`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      let text = response.text || "{}";
      text = text.replace(/```json/g, '').replace(/```/g, '').replace(/[\n\r]/g, '').trim();
      const result = JSON.parse(text);
      setGeneratedMemo(result);

    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes('API_KEY')) {
        alert("مفتاح API غير صالح. يرجى التحقق من المفتاح في صفحة الإعدادات.");
      } else {
        alert("حدث خطأ أثناء التوليد البيداغوجي. يرجى المحاولة لاحقاً.\n" + error?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!printTemplateRef.current) return;
    setIsExporting(true);

    try {
      // Dynamic import to avoid SSR issues if any (though this is SPA)
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      const element = printTemplateRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // الصفحة الأولى
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // إضافة صفحات إضافية إذا لزم الأمر لتجنب نقص المحتوى
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`مذكرة_${formData.topic}_تمكين_احترافي.pdf`);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التصدير.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 font-['Cairo'] pb-32 animate-in" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-[#1b4332] text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-emerald-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-5 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
            <PenTool size={40} className="text-emerald-300" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter">مذكرة تمكين الذكية</h2>
            <p className="text-emerald-200/70 font-bold text-sm mt-1">المساعد البيداغوجي الآلي وفق معايير الجيل الثاني</p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-emerald-950/50 px-6 py-3 rounded-2xl border border-emerald-800/50">
          <Sparkles size={18} className="text-amber-400" />
          <span className="text-xs font-black text-emerald-100 uppercase italic">الذكاء الاصطناعي التربوي</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* استمارة الإدخال */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-4">
            <Layers className="text-indigo-600" size={20} />
            <h3 className="font-black text-slate-800 dark:text-white">معطيات الدرس</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase pr-2">رقم المذكرة:</label>
              <input type="text" value={formData.memoNumber} onChange={e => setFormData({ ...formData, memoNumber: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase pr-2">المدة:</label>
              <input type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase pr-2">المادة:</label>
            <input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase pr-2">المقطع / الوحدة:</label>
            <input type="text" placeholder="مثال: المقطع الأول: القيم الإنسانية" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase pr-2">النشاط:</label>
            <input type="text" placeholder="مثال: فهم المنطوق، قراءة معبرة، حساب..." value={formData.activity} onChange={e => setFormData({ ...formData, activity: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase pr-2">الموضوع / عنوان الدرس:</label>
            <input type="text" placeholder="عنوان الدرس بدقة..." value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase pr-2">السندات والوسائل:</label>
            <input type="text" value={formData.support} onChange={e => setFormData({ ...formData, support: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
          </div>

          <button onClick={generateMemo} disabled={isLoading} className="w-full bg-[#1b4332] text-white py-6 rounded-[2rem] font-black text-lg shadow-xl hover:bg-emerald-900 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 border-b-8 border-emerald-950" >
            {isLoading ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} className="fill-white" />} توليد المذكرة الذكية
          </button>
        </div>

        {/* عرض المذكرة المعاينة */}
        <div className="lg:col-span-2 space-y-6">
          {!generatedMemo && !isLoading ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-4 border-dashed border-slate-200 dark:border-slate-800 p-20 rounded-[4rem] text-center flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner text-slate-200 dark:text-slate-700">
                <BookOpen size={48} />
              </div>
              <p className="text-slate-400 font-black italic">أستاذي/أستاذتي، أدخل(ي) تفاصيل الدرس لنقوم بتوليد المذكرة البيداغوجية الاحترافية آلياً...</p>
            </div>
          ) : isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-20 rounded-[4rem] shadow-xl text-center space-y-8">
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 border-8 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-emerald-600 animate-pulse" size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black dark:text-white tracking-tighter">جاري التحليل البيداغوجي...</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">نظام تمكين يطبق معايير الجيل الثاني الآن</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end gap-3 no-print">
                <button onClick={handleExportPDF} disabled={isExporting} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50">
                  {isExporting ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />} تصدير PDF للطباعة
                </button>
              </div>

              {/* المذكرة الرسمية للمعاينة */}
              <div ref={memoRef} className="bg-white p-12 shadow-2xl border-[1.5mm] border-double border-slate-900 min-h-[297mm] text-slate-900 overflow-x-auto" style={{ fontFamily: 'Cairo' }}>
                <div className="min-w-[700px]">
                  {/* الترويسة */}
                  <div className="flex justify-between items-start mb-10 border-b-2 border-slate-900 pb-8">
                    <div className="text-[9px] font-black leading-relaxed">
                      <p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
                      <p>وزارة التربية الوطنية</p>
                      <p>مديرية التربية لولاية {profile.province.split('-')[1] || profile.province}</p>
                      <p>المقاطعة: {profile.pedagogicalDistrict}</p>
                      <p>المؤسسة: {profile.institution}</p>
                    </div>
                    <div className="text-center">
                      <TamkeenLogo size={50} className="mb-2" />
                      <p className="text-[10px] font-black">مذكرة بيداغوجية رقم: {formData.memoNumber}</p>
                    </div>
                  </div>

                  {/* بيانات المذكرة */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="border border-slate-900 p-3 space-y-2 text-[10px] font-black bg-slate-50">
                      <p>المادة: <span className="font-bold">{formData.subject}</span></p>
                      <p>المستوى: <span className="font-bold">{formData.grade}</span></p>
                      <p>المقطع: <span className="font-bold">{formData.unit}</span></p>
                    </div>
                    <div className="border border-slate-900 p-3 space-y-2 text-[10px] font-black bg-slate-50">
                      <p>الأستاذ: <span className="font-bold">{profile.name}</span></p>
                      <p>النشاط: <span className="font-bold">{formData.activity}</span></p>
                      <p>الموضوع: <span className="font-bold underline text-indigo-900">{formData.topic}</span></p>
                    </div>
                  </div>

                  {/* الكفاءات والقيم */}
                  <div className="space-y-4 mb-8">
                    <div className="border border-slate-900 p-4">
                      <h4 className="text-[11px] font-black mb-2 bg-slate-900 text-white w-fit px-3 py-1">الكفاءة المستهدفة:</h4>
                      <p className="text-[10px] font-bold leading-relaxed">{generatedMemo && generatedMemo.competencies}</p>
                    </div>
                    <div className="border border-slate-900 p-4">
                      <h4 className="text-[11px] font-black mb-2 bg-slate-900 text-white w-fit px-3 py-1">مؤشرات الكفاءة / الأهداف:</h4>
                      <ul className="list-disc list-inside text-[10px] font-bold space-y-1 pr-4">
                        {generatedMemo && generatedMemo.objectives && generatedMemo.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                      </ul>
                    </div>
                    <div className="border border-slate-900 p-4">
                      <h4 className="text-[11px] font-black mb-2 bg-slate-900 text-white w-fit px-3 py-1">القيم والوسائل:</h4>
                      <p className="text-[10px] font-bold leading-relaxed">السندات: {formData.support} | القيم: {generatedMemo && generatedMemo.values}</p>
                    </div>
                  </div>

                  {/* جدول المراحل */}
                  <table className="w-full border-collapse border border-slate-900 text-[9px]">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-900 p-3 w-[12%]">المراحل</th>
                        <th className="border border-slate-900 p-3 w-[15%]">الكفاءة الجزئية</th>
                        <th className="border border-slate-900 p-3">أنشطة التعليم والتعلم</th>
                        <th className="border border-slate-900 p-3 w-[12%]">طريقة العمل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedMemo && generatedMemo.steps && generatedMemo.steps.map((step, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-900 p-3 font-black text-center bg-slate-50">{step.stage}</td>
                          <td className="border border-slate-900 p-3 font-bold">{step.competency}</td>
                          <td className="border border-slate-900 p-3">
                            <p className="font-black text-indigo-900 mb-2">أداء الأستاذ:</p>
                            <p className="mb-4 font-bold">{step.teacherActivity}</p>
                            <div className="border-t border-slate-100 my-3"></div>
                            <p className="font-black text-emerald-900 mb-2">أداء المتعلم:</p>
                            <p className="font-bold italic">{step.studentActivity}</p>
                          </td>
                          <td className="border border-slate-900 p-3 font-bold text-center italic">{step.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-12 flex justify-between px-10">
                    <div className="text-center">
                      <p className="font-black text-[10px] underline">إمضاء الأستاذ</p>
                    </div>
                    <div className="text-center">
                      <p className="font-black text-[10px] underline">ختم السيد المدير</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* قالب الطباعة النهائي المخفي - مخصص للتصدير فقط بقطر A4 كامل */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {generatedMemo && (
          <div ref={printTemplateRef} style={{ width: '210mm', padding: '15mm', background: 'white', color: 'black', fontFamily: 'Cairo', direction: 'rtl' }}>
            {/* الترويسة الرسمية */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '10pt', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                الجمهورية الجزائرية الديمقراطية الشعبية<br />
                وزارة التربية الوطنية<br />
                مديرية التربية لولاية {profile.province.split('-')[1] || profile.province}<br />
                المؤسسة: {profile.institution}
              </div>
              <div style={{ textAlign: 'center' }}>
                <TamkeenLogo size={60} />
                <div style={{ marginTop: '5px' }}>مذكرة بيداغوجية رقم: {formData.memoNumber}</div>
              </div>
            </div>

            {/* بيانات المذكرة */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div style={{ border: '1px solid black', padding: '10px', fontSize: '10pt', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                المادة: {formData.subject}<br />
                المستوى: {formData.grade}<br />
                المقطع: {formData.unit}
              </div>
              <div style={{ border: '1px solid black', padding: '10px', fontSize: '10pt', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                الأستاذ: {profile.name}<br />
                النشاط: {formData.activity}<br />
                الموضوع: {formData.topic}
              </div>
            </div>

            {/* الكفاءات والقيم */}
            <div style={{ border: '1px solid black', padding: '15px', marginBottom: '15px', fontSize: '10pt' }}>
              <div style={{ fontWeight: '900', textDecoration: 'underline', marginBottom: '5px' }}>الكفاءة المستهدفة:</div>
              <div style={{ marginBottom: '15px' }}>{generatedMemo.competencies}</div>

              <div style={{ fontWeight: '900', textDecoration: 'underline', marginBottom: '5px' }}>مؤشرات الكفاءة / الأهداف التعلمية:</div>
              <ul style={{ paddingRight: '20px', marginBottom: '15px' }}>
                {generatedMemo.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>

              <div style={{ fontWeight: '900', textDecoration: 'underline', marginBottom: '5px' }}>القيم والوسائل:</div>
              <div>السندات: {formData.support} | القيم: {generatedMemo.values}</div>
            </div>

            {/* جدول المراحل */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid black', fontSize: '9pt' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ border: '1px solid black', padding: '10px', width: '15%' }}>المراحل</th>
                  <th style={{ border: '1px solid black', padding: '10px', width: '20%' }}>الكفاءة الجزئية</th>
                  <th style={{ border: '1px solid black', padding: '10px' }}>أنشطة التعليم والتعلم (أداء الأستاذ والمتعلم)</th>
                  <th style={{ border: '1px solid black', padding: '10px', width: '15%' }}>الطريقة</th>
                </tr>
              </thead>
              <tbody>
                {generatedMemo.steps.map((step, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid black', padding: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9fafb' }}>{step.stage}</td>
                    <td style={{ border: '1px solid black', padding: '10px' }}>{step.competency}</td>
                    <td style={{ border: '1px solid black', padding: '15px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1e1b4b', marginBottom: '5px' }}>أداء الأستاذ:</div>
                      <div style={{ marginBottom: '10px' }}>{step.teacherActivity}</div>
                      <div style={{ borderTop: '1px solid #e5e7eb', margin: '10px 0' }}></div>
                      <div style={{ fontWeight: 'bold', color: '#064e3b', marginBottom: '5px' }}>أداء المتعلم:</div>
                      <div style={{ fontStyle: 'italic' }}>{step.studentActivity}</div>
                    </td>
                    <td style={{ border: '1px solid black', padding: '10px', textAlign: 'center' }}>{step.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', fontSize: '11pt', textDecoration: 'underline' }}>إمضاء الأستاذ</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', fontSize: '11pt', textDecoration: 'underline' }}>ختم السيد المدير</p>
              </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '8pt', fontWeight: 'bold', borderTop: '0.5px solid #e5e7eb', paddingTop: '10px' }}>
              تم توليد هذه المذكرة آلياً بواسطة منصة تمكين الرقمية - الأستاذ ساسي عبد النور © 2025
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartMemoView;