import React, { useState } from 'react';
import { Monitor, Sparkles, Check, Star, X, Clock, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';

const PRESENTATION_TEMPLATES = [
  {
    stage: 'primary', label: 'ابتدائي', subject: 'اللغة العربية', level: 'السنة الثالثة',
    title: 'درس: الجملة الفعلية',
    slides: [
      { title: 'وضعية الانطلاق', content: 'عرض صورة لطفل يلعب في الحديقة.\nالسؤال: ماذا يفعل الطفل؟\n→ يستدرج التلاميذ لقول: "يلعب الطفلُ في الحديقة."' },
      { title: 'بناء التعلمات', content: 'أكتب على السبورة: يلعب الطفلُ.\n• ما نوع هذه الجملة؟\n• ما الفعل؟ ما الفاعل؟\n• قاعدة: الجملة الفعلية = فعل + فاعل (+ مفعول به)' },
      { title: 'التطبيق والتقويم', content: 'تمرين 1: أعرب: ذهبَ التلميذُ إلى المدرسة.\nتمرين 2: حوّل للجملة الاسمية.\nبطاقة الخروج: اكتب جملة فعلية من إنشائك.' },
    ]
  },
  {
    stage: 'primary', label: 'ابتدائي', subject: 'الرياضيات', level: 'السنة الخامسة',
    title: 'درس: الكسور العشرية',
    slides: [
      { title: 'وضعية الانطلاق', content: 'سؤال: قسمنا شريط بيتزا على 10 أطفال. نصيب كل طفل = ؟\n→ 1/10 = 0.1\nالمشكلة: كيف نكتب الكسور بطريقة عشرية؟' },
      { title: 'بناء التعلمات', content: '0.1 = 1/10 (عُشر)\n0.01 = 1/100 (جزء من مئة)\nمنزلة الوحدات | منزلة الأعشار | منزلة المئات\nمثال: 3.25 = 3 + 2/10 + 5/100' },
      { title: 'التطبيق والتقويم', content: 'تمرين 1: اكتب بالأرقام: ثلاثة وستة وعشرون جزءاً من مئة.\nتمرين 2: رتّب تصاعدياً: 1.5 / 0.9 / 1.25 / 0.75\nمسألة: اشترى أحمد 2.5 كغ لحم بـ 1200 دج. ما ثمن الكيلوغرام؟' },
    ]
  },
  {
    stage: 'middle', label: 'متوسط', subject: 'اللغة العربية', level: '1 متوسط',
    title: 'درس: النص التواصلي — فن الوصف',
    slides: [
      { title: 'وضعية الانطلاق', content: 'أعرض صورة لمنظر طبيعي جزائري جميل (الغابة أو الجبال).\nالسؤال: كيف تصف هذا المنظر؟ ما الكلمات التي تستعملها؟' },
      { title: 'بناء التعلمات', content: 'النص الوصفي يجيب عن: كيف؟ ما شكله؟\nعناصره: الصفة + الحال + الظرف\nأدوات الوصف: كأن / مثل / يشبه\nبنية: مقدمة وصفية → تفاصيل → خاتمة انطباعية' },
      { title: 'التطبيق والتقويم', content: 'نشاط 1: صف غرفة صفّك في 5 جمل.\nنشاط 2: اقرأ الفقرة وحدد الصفات والأحوال.\nوضعية الإدماج: صف ساحة مدرستك لصديق لم يرها.' },
    ]
  },
  {
    stage: 'middle', label: 'متوسط', subject: 'الرياضيات', level: '2 متوسط',
    title: 'درس: الأعداد النسبية',
    slides: [
      { title: 'وضعية الانطلاق', content: 'درجة الحرارة في قسنطينة: صفر درجة.\nترتفع 3 درجات = +3\nتنخفض 5 درجات = -5\nالمشكلة: كيف نمثل الأعداد السالبة؟' },
      { title: 'بناء التعلمات', content: 'الأعداد النسبية = الموجبة + الصفر + السالبة\nعلى المحور: السالبة يسار الصفر / الموجبة يمين الصفر\nالترتيب: -5 < -3 < 0 < +2 < +7\nالقيمة المطلقة: |-5| = 5' },
      { title: 'التطبيق والتقويم', content: 'مرتّب تصاعدياً: -7 / +3 / 0 / -1 / +5\nمسألة: رصيد بنكي = 1500 دج. سحب 800 دج ثم أودع 600 دج. ما الرصيد النهائي؟\nتقويم: أين تقع -2.5 على المحور؟' },
    ]
  },
  {
    stage: 'secondary', label: 'ثانوي', subject: 'الفلسفة', level: '2 ثانوي آداب',
    title: 'درس: الإدراك والواقع',
    slides: [
      { title: 'وضعية الانطلاق', content: 'تجربة فكرية: هل ما تراه بعينيك هو الواقع الحقيقي؟\nمثال: العصا في الماء تبدو مكسورة — هل هي مكسورة فعلاً؟\nالإشكالية: ما علاقة الإدراك بالواقع؟' },
      { title: 'بناء التعلمات', content: 'الإدراك = تفسير للحواس وليس نقلاً للواقع.\nأنواع: إدراك حسي / إدراك عقلي / إدراك حدسي.\nالوهم الحسي: دليل على أن الإدراك ذاتي.\nديكارت: الشك منهج للوصول للحقيقة.' },
      { title: 'التطبيق والتقويم', content: 'مناقشة: هل يمكن الوثوق بالحواس كلياً؟\nنص فلسفي: مقطع من "تأملات" ديكارت.\nوضعية الإدماج: هل الواقع كما يبدو أم كما هو؟ حرر مقالاً فلسفياً (15 سطراً).' },
    ]
  },
  {
    stage: 'secondary', label: 'ثانوي', subject: 'الجغرافيا', level: '1 ثانوي',
    title: 'درس: الموارد الطبيعية في الجزائر',
    slides: [
      { title: 'وضعية الانطلاق', content: 'خريطة الجزائر: حدّد مناطق إنتاج البترول والغاز الطبيعي.\nالسؤال: لماذا تتركز الموارد في الجنوب؟' },
      { title: 'بناء التعلمات', content: 'الموارد الطاقوية: البترول (حاسي مسعود) / الغاز الطبيعي (حاسي الرمل)\nالموارد المعدنية: الحديد (تيندوف) / الفوسفات / الملح\nالموارد المائية: المياه الجوفية في الصحراء\nالتحدي: كيف نطور هذه الموارد بشكل مستدام؟' },
      { title: 'التطبيق والتقويم', content: 'أنجز خريطة تحديد للموارد الطبيعية.\nسؤال: ما تأثير إيرادات البترول على التنمية؟\nوضعية تقويمية: اقترح استراتيجية للاستغلال المستدام للموارد الجزائرية.' },
    ]
  },
];

export default function PresentationStepper() {
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'templates' | 'custom'>('templates');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [presentMode, setPresentMode] = useState(false);

  const stages = [
    { id: 'primary', label: 'ابتدائي', color: 'from-emerald-400 to-teal-500' },
    { id: 'middle', label: 'متوسط', color: 'from-blue-400 to-indigo-500' },
    { id: 'secondary', label: 'ثانوي', color: 'from-purple-400 to-pink-500' },
  ];

  const filtered = PRESENTATION_TEMPLATES.filter(t => !selectedStage || t.stage === selectedStage);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); setActiveSlide(0); }, 1400);
  };

  if (presentMode && selectedTemplate && generated) {
    const slide = selectedTemplate.slides[activeSlide];
    return (
      <div className="fixed inset-0 bg-slate-900 z-[300] flex flex-col" dir="rtl">
        <div className="flex items-center justify-between p-4 bg-slate-800">
          <button onClick={() => setPresentMode(false)} className="px-4 py-2 bg-slate-700 text-white rounded-xl font-black text-sm flex items-center gap-2"><X size={16}/> إنهاء العرض</button>
          <div className="text-white font-black">{selectedTemplate.title}</div>
          <div className="text-slate-400 text-sm font-bold">{activeSlide + 1} / {selectedTemplate.slides.length}</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-4xl">
            <h2 className="text-4xl font-black text-amber-400 mb-8 text-center">{slide.title}</h2>
            <pre className="whitespace-pre-wrap font-['Cairo'] text-2xl text-white leading-relaxed text-right">{slide.content}</pre>
          </div>
        </div>
        <div className="flex justify-between p-6">
          <button onClick={() => setActiveSlide(p => Math.max(0, p-1))} disabled={activeSlide === 0} className="px-8 py-3 bg-slate-700 text-white rounded-2xl font-black disabled:opacity-30">← السابق</button>
          <div className="flex gap-2">
            {selectedTemplate.slides.map((_:any, i:number) => (
              <button key={i} onClick={() => setActiveSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === activeSlide ? 'bg-amber-400 scale-125' : 'bg-slate-600'}`}/>
            ))}
          </div>
          <button onClick={() => setActiveSlide(p => Math.min(selectedTemplate.slides.length-1, p+1))} disabled={activeSlide === selectedTemplate.slides.length-1} className="px-8 py-3 bg-amber-500 text-white rounded-2xl font-black disabled:opacity-30">التالي →</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showComingSoon && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md">
          <div className="w-full max-w-sm relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-orange-400 rounded-[3rem] blur opacity-50 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 text-center shadow-2xl">
              <button onClick={() => setShowComingSoon(false)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={16} /></button>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Clock size={28} className="text-white" /></div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">قيد التطوير 🔧</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-4">المولد الحر قيد التحيين — استخدم القوالب الجاهزة.</p>
              <button onClick={() => setShowComingSoon(false)} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-xl font-black">استخدام القوالب الجاهزة</button>
            </div>
          </div>
        </div>
      )}

      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto space-y-8 pb-20">
        <div className="text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto"><Monitor size={32} /></div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            صانع العروض التقديمية البيداغوجية <Sparkles size={24} className="text-amber-500" />
          </h1>
          <p className="text-slate-500 font-bold">قوالب عروض جاهزة بمراحل الدرس الثلاث — ابتدائي / متوسط / ثانوي</p>
        </div>

        <div className="flex items-center justify-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 max-w-xs mx-auto">
          <button onClick={() => setMode('templates')} className={`flex-1 py-2 px-4 rounded-xl font-black text-sm transition-all ${mode === 'templates' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-md' : 'text-slate-500'}`}><Star size={14} className="inline mr-1"/>قوالب</button>
          <button onClick={() => { setMode('custom'); setShowComingSoon(true); }} className={`flex-1 py-2 px-4 rounded-xl font-black text-sm transition-all ${mode === 'custom' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-md' : 'text-slate-500'}`}><Sparkles size={14} className="inline mr-1"/>مخصص</button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => setSelectedStage('')} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${!selectedStage ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>الكل</button>
          {stages.map(s => (
            <button key={s.id} onClick={() => setSelectedStage(s.id)} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${selectedStage === s.id ? `bg-gradient-to-r ${s.color} text-white shadow-md` : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tpl, idx) => {
            const stage = stages.find(s => s.id === tpl.stage)!;
            return (
              <button key={idx} onClick={() => { setSelectedTemplate(tpl); setGenerated(false); setActiveSlide(0); }}
                className={`text-right p-5 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedTemplate === tpl ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-gradient-to-r ${stage.color} text-white`}>{tpl.label}</span>
                  <div className="text-right">
                    <div className="font-black text-slate-800 dark:text-white text-sm">{tpl.subject}</div>
                    <div className="text-xs text-slate-500 font-bold">{tpl.level}</div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <div className="font-black text-blue-600 text-xs mb-1">{tpl.title}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{tpl.slides.length} شرائح</div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedTemplate && (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-blue-200 dark:border-blue-900/50 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full"></div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white">{selectedTemplate.title}</h3>
                  <p className="text-xs text-slate-500 font-bold">{selectedTemplate.level} — {selectedTemplate.subject} — {selectedTemplate.slides.length} شرائح</p>
                </div>
              </div>
              {generated && <button onClick={() => setPresentMode(true)} className="px-5 py-2 bg-amber-500 text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-amber-600"><Monitor size={16}/>عرض تقديمي</button>}
            </div>

            {!generated ? (
              <button onClick={handleGenerate} disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-4 font-black shadow-lg flex items-center justify-center gap-2 hover:shadow-blue-500/30 transition-all">
                {loading ? <span className="animate-pulse">جاري بناء العرض البيداغوجي...</span> : <><Sparkles size={20}/>توليد العرض التقديمي</>}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedTemplate.slides.map((s:any, i:number) => (
                    <button key={i} onClick={() => setActiveSlide(i)}
                      className={`px-4 py-2 rounded-xl font-black text-sm whitespace-nowrap transition-all ${activeSlide === i ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      {i+1}. {s.title}
                    </button>
                  ))}
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 min-h-[200px]">
                  <h3 className="text-xl font-black text-amber-400 mb-4">{selectedTemplate.slides[activeSlide].title}</h3>
                  <pre className="whitespace-pre-wrap font-['Cairo'] text-base text-slate-200 leading-loose">{selectedTemplate.slides[activeSlide].content}</pre>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setActiveSlide(p => Math.max(0, p-1))} disabled={activeSlide === 0} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-sm disabled:opacity-30">← السابق</button>
                  <button onClick={() => setActiveSlide(p => Math.min(selectedTemplate.slides.length-1, p+1))} disabled={activeSlide === selectedTemplate.slides.length-1} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-black text-sm disabled:opacity-30">التالي →</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
