import React, { useState } from 'react';
import {
  Briefcase, FileText, Wrench, Lightbulb, CreditCard, Send,
  ChevronDown, ChevronUp, CheckCircle2, Download, ExternalLink,
  ShieldCheck, BookOpen, Award, Layers, Sparkles
} from 'lucide-react';

const TIPS = [
  { q: 'كيف أتعامل مع تلميذ مشاغب؟', a: 'تجنّب المواجهة العلنية. تحدّث معه بهدوء على انفراد. ابحث عن سبب السلوك وليس السلوك فقط. الاهتمام الإيجابي أقوى من العقوبة.' },
  { q: 'كيف أُعدّ مذكرة الدرس بسرعة وفق المعايير الرسمية؟', a: 'استخدم مولد المذكرة الذكية في تمكين — يعتمد الجدول التفتيشي ذو الأعمدة الستة المعتمد من المفتشية العامة للبيداغوجيا مع استراتيجيات التعلم النشط وشبكة تقويم الوضعية الإدماجية.' },
  { q: 'ما الوثائق الإلزامية التي يطلبها المفتش يوم التثبيت؟', a: 'المذكرة البيداغوجية للحصة، الكراس اليومي، دفتر النصوص، التوزيع السنوي والشهري، كشف متابعة التقويم المستمر، والمنهاج والوثيقة المرافقة.' },
  { q: 'ما العلاقة المثلى مع الإدارة؟', a: 'كن منضبطاً في أوقات الحضور، قدّم تقاريرك في وقتها، ولا تتردد في طلب المشورة. الاحترام المتبادل أساس العمل الميداني الناجح.' },
  { q: 'كيف أتعامل مع ولي أمر غاضب؟', a: 'استمع دون مقاطعة، تجنّب الدفاعية، اقترح اجتماعاً رسمياً مع المدير إن لزم. الهدوء هو أقوى سلاحك.' },
  { q: 'ما أهمية التوزيع السنوي والشهري؟', a: 'يُعطيك خريطة واضحة للسنة الدراسية، يساعدك على التوزيع العادل للمحتوى، ويُظهر لك أماكن التأخر مبكراً حتى تعوّضها عبر حصص المعالجة.' },
];

const DOCUMENTS = [
  { 
    name: 'الدليل التربوي لأستاذ التعليم الثانوي', 
    desc: 'المرجع البيداغوجي الشامل للمفتشية العامة في التخطيط والتقويم والمقاربة بالكفاءات', 
    type: 'PDF',
    badge: 'دليل تفتيشي رسمي',
    viewUrl: 'https://drive.google.com/file/d/1GIN6HnPmWfl0J5E63fV4Kw3SWQ9MTv_c/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1GIN6HnPmWfl0J5E63fV4Kw3SWQ9MTv_c'
  },
  { 
    name: 'دليل زيارة التثبيت والترسيم والتفتيش', 
    desc: 'إجراءات وشبكة تقويم الأستاذ المتربص والملاحظات التفتيشية المعتمدة', 
    type: 'PDF',
    badge: 'ترسيم وتثبيت',
    viewUrl: 'https://drive.google.com/file/d/1CTbXsbmMmfvpp49XlCrqOfElHoTFtmmZ/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1CTbXsbmMmfvpp49XlCrqOfElHoTFtmmZ'
  },
  { 
    name: 'التنظيم التربوي والتوقيت الأسبوعي', 
    desc: 'النصاب الساعي الرسمي (18 ساعة)، توزيع الأفواج ونظام الاستراحة المعتمد', 
    type: 'PDF',
    badge: 'تنظيم تربوي',
    viewUrl: 'https://drive.google.com/file/d/15AplSePMY7FdMUny9idrZaw9xtjmKJXB/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=15AplSePMY7FdMUny9idrZaw9xtjmKJXB'
  },
  { 
    name: 'القانون التوجيهي للتربية الوطنية (08-04)', 
    desc: 'الدستور التربوي المنظم للحقوق والواجبات والجماعة التربوية في الجزائر', 
    type: 'PDF',
    badge: 'تشريع مدرسي',
    viewUrl: 'https://drive.google.com/file/d/1T_y1vWx_RuyvpF1bkgLpB28b1Y38-wR2/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1T_y1vWx_RuyvpF1bkgLpB28b1Y38-wR2'
  },
  { 
    name: 'القانون الأساسي العام للوظيفة العمومية (06-03)', 
    desc: 'حقوق وواجبات الموظف العام، نظام الترقية، والعطل والغيابات القانونية', 
    type: 'PDF',
    badge: 'وظيفة عمومية',
    viewUrl: 'https://drive.google.com/file/d/1jOyMFwje_eVOnsACSyM9fWPbze0eB92N/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1jOyMFwje_eVOnsACSyM9fWPbze0eB92N'
  },
  { 
    name: 'دليل استراتيجيات التدريس والتعلم النشط', 
    desc: 'فكر-زاوج-شارك، الكرسي الساخن، ولعب الأدوار الموصى بها في التفتيش', 
    type: 'PDF',
    badge: 'استراتيجيات التدريس',
    viewUrl: 'https://drive.google.com/file/d/19LY5Q8AncsJ9QfCO-Bj52SC25yObL4SH/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=19LY5Q8AncsJ9QfCO-Bj52SC25yObL4SH'
  },
  { 
    name: 'المقاربة بالكفايات وبيداغوجيا الإدماج', 
    desc: 'الأسس النظرية والتطبيقية، هندسة الوضعية المشكلة، وشبكة المعايير الأربعة', 
    type: 'PDF',
    badge: 'تعليمية وديداكتيك',
    viewUrl: 'https://drive.google.com/file/d/1C80QbqKCJRyDRQr4kNuPnNJSgYkN_NgM/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1C80QbqKCJRyDRQr4kNuPnNJSgYkN_NgM'
  },
  { 
    name: 'مواقيت ومعاملات التعليم الثانوي لجميع الشعب', 
    desc: 'القرار الوزاري المعتمد لحساب المعدلات وتوزيع الحصص الأسبوعية للطور الثانوي', 
    type: 'PDF',
    badge: 'مواقيت ومعاملات',
    viewUrl: 'https://drive.google.com/file/d/1Qbk8lbxt9sl61i9fMdSNE5ERQ6CW6Wm_/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1Qbk8lbxt9sl61i9fMdSNE5ERQ6CW6Wm_'
  },
  { 
    name: 'بطاقة بيداغوجية تفتيشية نموذجية (الوحدة 06 - 3عت)', 
    desc: 'نموذج المذكرة المعتمد بمدرسة أشبال الأمة وثانوية وعواع المدني (Word)', 
    type: 'Word',
    badge: 'نموذج رسمي',
    viewUrl: 'https://drive.google.com/file/d/1fhDmYELgeUkV6T-j3mnwDJOLUfIyZFq4/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1fhDmYELgeUkV6T-j3mnwDJOLUfIyZFq4'
  },
  { 
    name: 'تدرجات اللغة العربية السنوية المعتمدة (الحزمة الشاملة)', 
    desc: 'التدرجات السنوية الرسمية لجميع سنوات وشعب الطور الثانوي من وزارة التربية', 
    type: 'ZIP',
    badge: 'تدرجات سنوية',
    viewUrl: 'https://drive.google.com/file/d/11__eLs-D9hNVSGIyXV2m0Vo280Mzhu9D/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=11__eLs-D9hNVSGIyXV2m0Vo280Mzhu9D'
  }
];

export default function NewTeacherKit() {
  const [activeTab, setActiveTab] = useState<'docs' | 'tools' | 'tips' | 'card'>('docs');
  const [openTip, setOpenTip] = useState<number | null>(null);
  const [cardData, setCardData] = useState({ name: '', subject: '', stage: '', school: '', phone: '', district: '' });
  const [cardGenerated, setCardGenerated] = useState(false);
  const [requestForm, setRequestForm] = useState({ docName: '', type: 'رقمي', note: '' });
  const [requestSent, setRequestSent] = useState(false);

  const tabs = [
    { id: 'docs', label: 'وثائق وأدلة رسمية', icon: FileText, color: 'emerald' },
    { id: 'tools', label: 'أدوات تمكين', icon: Wrench, color: 'blue' },
    { id: 'tips', label: 'نصائح التفتيش والميدان', icon: Lightbulb, color: 'amber' },
    { id: 'card', label: 'بطاقتي المهنية', icon: CreditCard, color: 'purple' },
  ] as const;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto space-y-8 pb-20 font-['Cairo']" dir="rtl">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden shadow-2xl border-b-4 border-emerald-600">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-4 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Briefcase size={28} className="text-white"/>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-0.5 rounded-full text-xs font-black">
                  مرافقة المفتشية العامة والمنظومة التربوية
                </span>
              </div>
              <h1 className="text-2xl font-black">حقيبة الأستاذ الجديد 🎒</h1>
              <p className="text-emerald-100/80 text-sm font-bold">كل ما تحتاجه لانطلاقة مهنية ناجحة واجتياز زيارة التثبيت باقتدار</p>
            </div>
          </div>
          <p className="text-emerald-100 text-sm font-bold leading-relaxed max-w-2xl">
            الأدلة البيداغوجية الرسمية، النصوص التشريعية والتنظيمية، التدرجات السنوية، واستراتيجيات التدريس المعتمدة وزارياً — مربوطة ومفهرسة مباشرة من المستودع التربوي الرسمي.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
              activeTab === t.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}>
            <t.icon size={16}/>{t.label}
          </button>
        ))}
      </div>

      {/* Docs Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOCUMENTS.map((doc, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-4 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    doc.type === 'PDF' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' :
                    doc.type === 'Word' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' :
                    'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                  }`}>
                    {doc.type}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                        {doc.badge}
                      </span>
                    </div>
                    <div className="font-black text-slate-800 dark:text-white text-sm leading-snug">{doc.name}</div>
                    <div className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">{doc.desc}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                  <a
                    href={doc.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 px-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink size={13}/> معاينة
                  </a>
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 px-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Download size={13}/> تحميل
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Request Form */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/10 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Send size={18} className="text-emerald-600"/> طلب وثيقة خاصة من الإدارة
            </h3>
            <p className="text-sm text-slate-500 font-bold mb-6">اطلب الوثائق الإدارية أو التربوية التي تحتاجها رقمياً أو ورقياً عبر هذه المساحة</p>
            {!requestSent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500">اسم الوثيقة المطلوبة</label>
                  <input value={requestForm.docName} onChange={e => setRequestForm({...requestForm, docName: e.target.value})}
                    placeholder="مثال: شهادة العمل أو مقرر التعيين" className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-emerald-500"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500">طريقة الاستلام</label>
                  <select value={requestForm.type} onChange={e => setRequestForm({...requestForm, type: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-emerald-500">
                    <option>رقمي (PDF)</option>
                    <option>ورقي (مختوم)</option>
                    <option>الاثنان معاً</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500">ملاحظة إضافية</label>
                  <input value={requestForm.note} onChange={e => setRequestForm({...requestForm, note: e.target.value})}
                    placeholder="أي تفاصيل إضافية للطلب" className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-emerald-500"/>
                </div>
                <div className="md:col-span-2">
                  <button onClick={() => {
                    const req = {
                      id: Date.now().toString(),
                      docName: requestForm.docName,
                      type: requestForm.type,
                      note: requestForm.note,
                      date: new Date().toISOString(),
                      status: 'pending'
                    };
                    const existing = JSON.parse(localStorage.getItem('doc_requests') || '[]');
                    localStorage.setItem('doc_requests', JSON.stringify([req, ...existing]));
                    setRequestSent(true);
                  }} disabled={!requestForm.docName}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all">
                    <Send size={16}/> إرسال الطلب للإدارة
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="text-emerald-600" size={32}/>
                <div>
                  <div className="font-black text-emerald-700 dark:text-emerald-400">تم إرسال طلبك بنجاح!</div>
                  <div className="text-sm text-emerald-600/70 font-bold">سيتم الرد عليك من قِبل الإدارة خلال 24-48 ساعة.</div>
                </div>
                <button onClick={() => { setRequestSent(false); setRequestForm({ docName: '', type: 'رقمي', note: '' }); }} className="mr-auto text-xs font-black text-emerald-600 hover:underline">طلب جديد</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: '📓', title: 'الكراس اليومي', desc: 'سجّل حصصك وأنشطتك اليومية بشكل منظم', link: '/korras-yawmi', color: 'from-emerald-400 to-teal-500' },
            { icon: '⚡', title: 'المذكرة الذكية', desc: 'حضّر دروسك بنموذج التفتيش الرسمي المعتمد (6 أعمدة)', link: '/mothakira-thakiya', color: 'from-indigo-400 to-blue-500' },
            { icon: '📅', title: 'التوزيع السنوي والشهري', desc: 'محاكاة تامة لمنصة باقون مع التوليد بنقرة واحدة', link: '/annual', color: 'from-teal-400 to-emerald-500' },
            { icon: '📊', title: 'دفتر التنقيط', desc: 'رصد علامات التلاميذ وإعداد التقارير', link: '/grading', color: 'from-violet-400 to-purple-500' },
            { icon: '✅', title: 'متابعة الغياب', desc: 'سجّل الحضور والغياب يومياً بسهولة', link: '/absence', color: 'from-rose-400 to-pink-500' },
            { icon: '🗓️', title: 'جداول التوقيت', desc: 'جداول الأساتذة والمؤسسة بدون استراحة مسائية في الثانوي', link: '/timetable', color: 'from-amber-400 to-orange-500' },
          ].map((tool, i) => (
            <a key={i} href={tool.link} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                {tool.icon}
              </div>
              <div className="flex-1">
                <div className="font-black text-slate-800 dark:text-white text-base group-hover:text-emerald-600 transition-colors">{tool.title}</div>
                <div className="text-xs text-slate-400 font-bold mt-1">{tool.desc}</div>
              </div>
              <ExternalLink size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors"/>
            </a>
          ))}
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
              <button onClick={() => setOpenTip(openTip === i ? null : i)}
                className="w-full p-5 text-right flex items-center justify-between font-black text-slate-800 dark:text-white hover:text-emerald-600 transition-colors">
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center text-xs font-black shrink-0">{i+1}</span>
                  {tip.q}
                </span>
                {openTip === i ? <ChevronUp size={18} className="text-emerald-600"/> : <ChevronDown size={18} className="text-slate-400"/>}
              </button>
              {openTip === i && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed border-t border-slate-50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20">
                  {tip.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card Tab */}
      {activeTab === 'card' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-black text-lg text-slate-800 dark:text-white">أنشئ بطاقتك التعريفية الرقمية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'الاسم واللقب', key: 'name', placeholder: 'الأستاذ...' },
                { label: 'المادة المدرّسة', key: 'subject', placeholder: 'اللغة العربية وآدابها' },
                { label: 'الطور التعليمي', key: 'stage', placeholder: 'التعليم الثانوي' },
                { label: 'المؤسسة التربوية', key: 'school', placeholder: 'ثانوية...' },
                { label: 'الولاية / المقاطعة', key: 'district', placeholder: 'الجزائر وسط' },
                { label: 'رقم الهاتف', key: 'phone', placeholder: '05xxxxxxxx' },
              ].map(f => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500">{f.label}</label>
                  <input value={(cardData as any)[f.key]}
                    onChange={e => setCardData({...cardData, [f.key]: e.target.value})}
                    placeholder={f.placeholder}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-emerald-500 dark:text-white"/>
                </div>
              ))}
            </div>
            <button onClick={() => setCardGenerated(true)}
              disabled={!cardData.name || !cardData.school}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-black shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              <Sparkles size={16}/> إنشاء البطاقة
            </button>
          </div>

          {cardGenerated && (
            <div className="relative bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl max-w-md mx-auto overflow-hidden border-2 border-emerald-500/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] font-black text-emerald-300 tracking-wider">الجمهورية الجزائرية الديمقراطية الشعبية</div>
                  <div className="text-[10px] font-bold text-white/60">وزارة التربية الوطنية</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">🎓</div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xl font-black text-white">{cardData.name || 'اسم الأستاذ'}</div>
                  <div className="text-emerald-300 text-xs font-bold">{cardData.subject} • {cardData.stage}</div>
                </div>
                <div className="pt-3 border-t border-white/10 space-y-1 text-xs text-white/80 font-bold">
                  <div>🏫 {cardData.school}</div>
                  {cardData.district && <div>📍 {cardData.district}</div>}
                  {cardData.phone && <div>📞 {cardData.phone}</div>}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-bold">
                <span>منصة تمكين التربوية</span>
                <span>بطاقة رقمية صالحة للعام الدراسي</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
