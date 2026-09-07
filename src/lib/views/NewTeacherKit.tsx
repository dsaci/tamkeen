import React, { useState } from 'react';
import { Briefcase, FileText, Wrench, Lightbulb, CreditCard, Send, ChevronDown, ChevronUp, CheckCircle2, Download, ExternalLink } from 'lucide-react';

const TIPS = [
  { q: 'كيف أتعامل مع تلميذ مشاغب؟', a: 'تجنّب المواجهة العلنية. تحدّث معه بهدوء على انفراد. ابحث عن سبب السلوك وليس السلوك فقط. الاهتمام الإيجابي أقوى من العقوبة.' },
  { q: 'كيف أُعدّ مذكرة الدرس بسرعة؟', a: 'استخدم نموذج تمكين للمذكرة الذكية — في 3 دقائق تحصل على هيكل درس كامل. ركّز على: الكفاءة + التسلسل + التقويم.' },
  { q: 'ما العلاقة المثلى مع الإدارة؟', a: 'كن منضبطاً في أوقات الحضور، قدّم تقاريرك في وقتها، ولا تتردد في طلب المشورة. الاحترام المتبادل أساس العمل الميداني الناجح.' },
  { q: 'كيف أتعامل مع ولي أمر غاضب؟', a: 'استمع دون مقاطعة، تجنّب الدفاعية، اقترح اجتماعاً رسمياً مع المدير إن لزم. الهدوء هو أقوى سلاحك.' },
  { q: 'ما أهمية المخطط السنوي؟', a: 'يُعطيك خريطة واضحة للسنة الدراسية، يساعدك على التوزيع العادل للمحتوى، ويُظهر لك أماكن التأخر مبكراً حتى تعوّضها.' },
];

const DOCUMENTS = [
  { name: 'نموذج مذكرة الدرس', desc: 'النموذج الرسمي المعتمد وزارياً', type: 'PDF' },
  { name: 'كشف الحضور والغياب', desc: 'جدول رصد الحضور اليومي', type: 'Excel' },
  { name: 'بطاقة التلميذ الشخصية', desc: 'نموذج جمع بيانات التلاميذ', type: 'Word' },
  { name: 'نموذج طلب عطلة استثنائية', desc: 'الاستمارة الرسمية لطلب العطلة', type: 'PDF' },
  { name: 'المخطط السنوي الفارغ', desc: 'جدول توزيع المقاطع التعلمية', type: 'Excel' },
  { name: 'بطاقة المراقبة المستمرة', desc: 'رصد نتائج التقويم التكويني', type: 'Excel' },
];

export default function NewTeacherKit() {
  const [activeTab, setActiveTab] = useState<'docs' | 'tools' | 'tips' | 'card'>('docs');
  const [openTip, setOpenTip] = useState<number | null>(null);
  const [cardData, setCardData] = useState({ name: '', subject: '', stage: '', school: '', phone: '', district: '' });
  const [cardGenerated, setCardGenerated] = useState(false);
  const [requestForm, setRequestForm] = useState({ docName: '', type: 'رقمي', note: '' });
  const [requestSent, setRequestSent] = useState(false);

  const tabs = [
    { id: 'docs', label: 'وثائق رسمية', icon: FileText, color: 'emerald' },
    { id: 'tools', label: 'أدوات تمكين', icon: Wrench, color: 'blue' },
    { id: 'tips', label: 'نصائح ميدانية', icon: Lightbulb, color: 'amber' },
    { id: 'card', label: 'بطاقتي', icon: CreditCard, color: 'purple' },
  ] as const;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Briefcase size={28} className="text-white"/>
            </div>
            <div>
              <h1 className="text-2xl font-black">حقيبة الأستاذ الجديد 🎒</h1>
              <p className="text-emerald-100/80 text-sm font-bold">كل ما تحتاجه لانطلاقة مهنية ناجحة</p>
            </div>
          </div>
          <p className="text-emerald-100 text-sm font-bold leading-relaxed max-w-xl">
            وثائق رسمية، أدوات رقمية، نصائح ميدانية، وبطاقة تعريفية — في مكان واحد لمساعدتك على أداء مهمتك بثقة واحتراف.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
              activeTab === t.id
                ? `bg-${t.color}-600 text-white shadow-lg`
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
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-emerald-300 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">{doc.type}</div>
                  <div>
                    <div className="font-black text-slate-800 dark:text-white text-sm">{doc.name}</div>
                    <div className="text-xs text-slate-400 font-bold mt-0.5">{doc.desc}</div>
                  </div>
                </div>
                <button className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:bg-emerald-100 opacity-0 group-hover:opacity-100 transition-all">
                  <Download size={16}/>
                </button>
              </div>
            ))}
          </div>

          {/* Request Form */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/10 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Send size={18} className="text-emerald-600"/> طلب وثيقة من الإدارة
            </h3>
            <p className="text-sm text-slate-500 font-bold mb-6">اطلب الوثائق التي تحتاجها رقمياً أو ورقياً عبر هذه المساحة وتواصل مع الإدارة</p>
            {!requestSent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500">اسم الوثيقة المطلوبة</label>
                  <input value={requestForm.docName} onChange={e => setRequestForm({...requestForm, docName: e.target.value})}
                    placeholder="مثال: نسخة من عقد التوظيف" className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-emerald-500"/>
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
            { icon: '⚡', title: 'المذكرة الذكية', desc: 'حضّر دروسك بمساعدة الذكاء الاصطناعي', link: '/mothakira-thakiya', color: 'from-indigo-400 to-blue-500' },
            { icon: '📊', title: 'دفتر التنقيط', desc: 'رصد علامات التلاميذ وإعداد التقارير', link: '/grading', color: 'from-violet-400 to-purple-500' },
            { icon: '✅', title: 'متابعة الغياب', desc: 'سجّل الحضور والغياب يومياً بسهولة', link: '/absence', color: 'from-rose-400 to-pink-500' },
            { icon: '🗓️', title: 'جداول التوقيت', desc: 'أنشئ جداول الأساتذة والمؤسسة', link: '/timetable', color: 'from-amber-400 to-orange-500' },
            { icon: '🤖', title: 'المساعد الذكي', desc: 'أجب عن أسئلتك البيداغوجية فوراً', link: '/copilot', color: 'from-teal-400 to-cyan-500' },
          ].map((tool, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-transparent hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>{tool.icon}</div>
              <h3 className="font-black text-slate-800 dark:text-white mb-1">{tool.title}</h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">{tool.desc}</p>
              <div className="flex items-center gap-1 text-xs font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-all">
                <span>فتح الأداة</span><ExternalLink size={12}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="space-y-3">
          {TIPS.map((tip, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <button onClick={() => setOpenTip(openTip === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right font-black text-slate-800 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                <span className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 font-black text-sm flex items-center justify-center">{i+1}</span>{tip.q}</span>
                {openTip === i ? <ChevronUp size={18} className="text-amber-500"/> : <ChevronDown size={18} className="text-slate-400"/>}
              </button>
              {openTip === i && (
                <div className="px-5 pb-5 border-t border-slate-50 dark:border-slate-800 pt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{tip.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card Tab */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-black text-slate-800 dark:text-white">بياناتك المهنية</h3>
            {([
              { key: 'name', label: 'الاسم واللقب', placeholder: 'بن علي محمد الأمين' },
              { key: 'subject', label: 'المادة المدرّسة', placeholder: 'الرياضيات' },
              { key: 'stage', label: 'الطور التعليمي', placeholder: 'متوسط' },
              { key: 'school', label: 'اسم المؤسسة', placeholder: 'متوسطة الشهيد فلان' },
              { key: 'phone', label: 'رقم الهاتف', placeholder: '06XXXXXXXX' },
              { key: 'district', label: 'الولاية / الدائرة', placeholder: 'قسنطينة' },
            ] as const).map(f => (
              <div key={f.key} className="space-y-1">
                <label className="text-xs font-black text-slate-500">{f.label}</label>
                <input value={(cardData as any)[f.key]} onChange={e => setCardData({...cardData, [f.key]: e.target.value})}
                  placeholder={f.placeholder} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-purple-500 text-right"/>
              </div>
            ))}
            <button onClick={() => setCardGenerated(true)} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30">
              <CreditCard size={16}/> توليد البطاقة التعريفية
            </button>
          </div>

          {cardGenerated && cardData.name && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 dark:text-white">معاينة البطاقة</h3>
              <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-7 text-white shadow-2xl shadow-purple-500/30 overflow-hidden" style={{ minHeight: 200 }}>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 left-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-purple-200 mb-3">الجمهورية الجزائرية — وزارة التربية الوطنية</div>
                  <div className="text-2xl font-black mb-1">{cardData.name}</div>
                  <div className="text-purple-200 font-bold text-sm mb-4">{cardData.subject} — {cardData.stage}</div>
                  <div className="border-t border-white/20 pt-4 space-y-1 text-sm">
                    <div className="font-bold text-purple-100">🏫 {cardData.school}</div>
                    <div className="font-bold text-purple-100">📍 {cardData.district}</div>
                    <div className="font-bold text-purple-100">📞 {cardData.phone}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => window.print()} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2">
                <Download size={15}/> طباعة البطاقة
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
