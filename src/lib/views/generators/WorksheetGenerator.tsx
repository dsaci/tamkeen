import React, { useState } from 'react';
import { FileEdit, Sparkles, Wand2, Star, X, Clock, Printer, Download, FileText } from 'lucide-react';
import { TeacherProfile } from '../../../types';

interface Props {
  profile?: TeacherProfile;
}

const WORKSHEET_TEMPLATES = [
  // Primary
  {
    stage: 'primary',
    label: 'ابتدائي',
    subject: 'اللغة العربية',
    level: 'السنة الثالثة ابتدائي',
    title: 'وضعية إدماجية: صديقي البيئة',
    content: `السياق:
تلميذك سمير يرى الفضلات والأكياس البلاستيكية ملقاة في حديقة الحي، فيقرر مع أصدقائه إطلاق مبادرة لغرس الأشجار وتنظيف المحيط ليكون حياً نموذجياً نظيفاً.

السند:
صورة تعبر عن أطفال يتعاونون في غرس شجيرات صغيرة وسقيها وتزيين الحديقة.

المهام والتعليمات:
المهمة 1 (الفهم والاستيعاب):
- أجب عن الأسئلة التالية اعتماداً على السند:
  1) ما هو التصرف الإيجابي الذي قام به سمير ورفاقه؟
  2) ما هي أهمية الأشجار لبيئتنا وصحتنا؟

المهمة 2 (الظواهر اللغوية):
- استخرج من السياق فعلاً ماضياً وحوّله إلى صيغة المضارع.
- وظّف كلمة "البيئة" في جملة اسمية مفيدة تضبطها بالشكل التام.

المهمة 3 (الإنتاج الكتابي):
- اكتب فقرة من أربعة إلى خمسة أسطر تصف فيها كيف يمكنك المحافظة على نظافة مدرستك وحيّك، مستعملاً أسلوب الأمر وجملاً قصيرة واضحة.`
  },
  {
    stage: 'primary',
    label: 'ابتدائي',
    subject: 'الرياضيات',
    level: 'السنة الخامسة ابتدائي',
    title: 'وضعية مشكلة مركبة: مشروع المعرض المدرسي',
    content: `السياق:
بمناسبة نهاية الفصل الدراسي، قرّر قسم السنة الخامسة تنظيم معرض للرسومات والمشاريع العلمية. خصّصت إدارة المدرسة ميزانية قدرها 5000 دج لاقتناء اللوازم.

السند:
جدول أسعار الأدوات بمكتبة الحي:
- ورقة رسم مقوى: 25 دج للورقة
- علبة ألوان مائية: 180 دج للعلبة
- شريط لاصق مزخرف: 60 دج للشريط
- إطار خشبي للعرض: 250 دج للإطار

المهام الحسابية:
المهمة 1:
احسب ثمن اقتناء 30 ورقة رسم مقوى، و 8 علب ألوان مائية.

المهمة 2:
إذا تم شراء 4 أشرطة لاصقة مزخرفة، احسب المبلغ الإجمالي المدفوع حتى الآن، وكم ديناراً بقي من الميزانية المخصصة؟

المهمة 3:
هل يكفي المبلغ المتبقي لاقتناء 8 إطارات خشبية لعرض اللوحات الفائزة؟ علّل إجابتك بحساب رياضي دقيق.`
  },
  {
    stage: 'primary',
    label: 'ابتدائي',
    subject: 'التربية العلمية والتكنولوجية',
    level: 'السنة الرابعة ابتدائي',
    title: 'وضعية تقويمية: التغذية والصحة',
    content: `السياق:
يعاني صديقك كريم من كثرة الإرهاق وضعف التركيز في المدرسة، وعند استفسار الطبيب تبيّن أنه يكثر من تناول الوجبات السريعة والحلويات المصنعة ويهمل شرب الماء وتناول الخضروات والفواكه.

السند:
الهرم الغذائي المتوازن والمجموعات الغذائية الأساسية (البناء، الطاقة، والوقاية).

التعليمات والمهام:
المهمة 1:
صنّف الأغذية التالية في الجدول أدناه (أغذية الطاقة - أغذية البناء - أغذية الوقاية):
[ زيت الزيتون / البيض / البرتقال / الخبز / السمك / الجزر ]

المهمة 2:
فسّر علمياً سبب شعور كريم بالتعب المستمر بالرغم من تناوله كميات كبيرة من الحلويات.

المهمة 3:
قدّم لزميلك كريم ثلاث نصائح ذهبية مبنية على ما تعلمته لتناول وجبة غذائية متوازنة تحافظ على صحة جسمه ونشاطه المدرسي.`
  },
  // Middle
  {
    stage: 'middle',
    label: 'متوسط',
    subject: 'اللغة العربية',
    level: 'السنة الثانية متوسط',
    title: 'وضعية إدماجية: المواطنة والانتماء الوطني',
    content: `السند:
"الوطن ليس مجرد بقعة جغرافية نعيش فوق ثراها، بل هو هوية تسري في عروقنا وقيم نحيا بها وندافع عنها. إنّ حب الوطن لا يتجلى بالشعارات الزائفة بل بالعمل الدؤوب وخدمة الصالح العام والمحافظة على مكتسباته."

معايير ومؤشرات الكفاءة:
- الملاءمة مع الوضعية (السياق والتعليمة): 02 نقاط
- الانسجام والترتيب المنطقي للأفكار: 02 نقاط
- سلامة اللغة وتوظيف القواعد المدروسة (أسلوب التوجيه وأحرف العطف): 02 نقاط
- الإبداع وحسن العرض وعلامات الوقف: 02 نقاط

المهمة التواصلية المركبة:
حرّر نصاً مترابطاً من 10 إلى 12 سطراً تدعو فيه زملاءك إلى التحلي بروح المواطنة الحقة داخل المدرسة وخارجها، مبيناً واجبات التلميذ تجاه وطنه ومؤسسته، موظفاً أسلوب شرط وأفعالاً معتلة مناسبة، ومحترماً علامات الترقيم.`
  },
  {
    stage: 'middle',
    label: 'متوسط',
    subject: 'الرياضيات',
    level: 'السنة الثالثة متوسط',
    title: 'وضعية انطلاقية مركبة: هندسة وقياس',
    content: `السياق:
يريد مجلس بلدية تهيئة مساحة خضراء مثلثة الشكل ABC حيث: AB = 40m و AC = 30m و BC = 50m.
يراد إنشاء ممر للمشاة من النقطة A عمودياً على الضلع [BC] يقطعها في النقطة H.

المهام:
المهمة 1:
بيّن بالبرهان الهندسي مستعملاً الخاصية العكسية لفيثاغورس أنّ المثلث ABC قائم في A.

المهمة 2:
احسب مساحة هذه الحديقة بالمتر المربع (m²).

المهمة 3:
احسب طول ممر المشاة AH بطريقتين مختلفتين، ثم احسب تكلفة تبليط هذا الممر إذا كان سعر المتر الطولي 1200 دج.`
  },
  {
    stage: 'middle',
    label: 'متوسط',
    subject: 'علوم الطبيعة والحياة',
    level: 'السنة الأولى متوسط',
    title: 'وضعية تقويم كفاءة: التوازن البيئي في الجزائر',
    content: `السياق:
تزخر الجزائر بأنظمة بيئية غابية وصحراوية متنوعة. في إطار رحلة استكشافية إلى الحظيرة الوطنية بجرجرة، لاحظ التلاميذ العلاقات الغذائية المتشابكة بين الكائنات الحية.

السندات:
- سند 1: مخطط لسلسلة غذائية: بلوط أخضر ← يرقات حشرات ← طائر القرقف ← صقر الجبال.
- سند 2: إحصائيات حول أثر الحرائق على الغطاء النباتي والكائنات المستهلكة.

المهام والتعليمات:
المهمة 1:
حدّد المستويات الغذائية لكل كائن حي في السلسلة الواردة في السند 1 (منتج، مستهلك 1، مستهلك 2، مستهلك 3).

المهمة 2:
احسب الكتلة الحية المنتقلة إلى المستهلك الأخير إذا علمت أنّ كتلة المنتج الأولي هي 1000kg (مع اعتبار ضياع 90% من الكتلة في كل مستوى).

المهمة 3:
اقترح خطة عمل بيئية من 3 إجراءات استعجالية لإعادة تأهيل النظام البيئي الغابي بعد تعرضه للحرائق الصيفية.`
  },
  // Secondary
  {
    stage: 'secondary',
    label: 'ثانوي',
    subject: 'اللغة العربية وآدابها',
    level: 'السنة الثانية ثانوي - آداب وفلسفة',
    title: 'وضعية تقويمية نقدية: شعر الطبيعة الأندلسي',
    content: `السند:
مقطع من بائية ابن خفاجة الأندلسي في وصف الجبل والطبيعة.

الكفاءة المستهدفة:
تحليل نص أدبي من العصر الأندلسي واستجلاء البعد الفني والموقف النفسي للشاعر.

التعليمات:
المهمة 1 (البناء الفكري):
1. ما القضية الإنسانية والكونية التي يعالجها الشاعر عبر مخاطبته للجبل؟
2. تتبع الألفاظ الدالة على الحزن والرهبة، واستخرج حقلين دلاليين متقابلين.

المهمة 2 (البناء اللغوي والبلاغي):
1. استخرج صورتين بيانيتين مختلفتين (استعارة وتشبيه) واشرح أثرهما في خدمة المعنى النفسي.
2. حدد النمط النصي مع ذكر ثلاثة من مؤشراته الدقيقة من الأبيات.

المهمة 3 (التقويم النقدي):
هل ترى أنّ وصف الطبيعة عند شعراء الأندلس كان مجرد تقليد لشعراء المشرق أم كان تعبيراً أصيلاً عن بيئتهم الأندلسية الفردوسية؟ علل رأيك مستشهداً بشواهد مناسبة.`
  },
  {
    stage: 'secondary',
    label: 'ثانوي',
    subject: 'الرياضيات',
    level: 'السنة الأولى ثانوي - جذع مشترك علوم',
    title: 'وضعية إدماجية: الدوال ودراسة الظواهر الاقتصادية',
    content: `السياق:
تنتج إحدى المؤسسات الصناعية الجزائرية مواد تنظيف. التكلفة الإجمالية لإنتاج x وحدة (بالمئات) مقدرة بآلاف الدنانير تعطى بالدالة:
C(x) = x² + 2x + 16   حيث x ينتمي إلى المجال [1 ; 10]
تباع كل وحدة بمبلغ 12 ألف دينار، فتكون دالة المداخيل: R(x) = 12x

المهام:
المهمة 1:
احسب التكلفة الثابتة للمؤسسة (تكلفة إنتاج 0 وحدة عند الانطلاق).
احسب تكلفة إنتاج 400 وحدة و 800 وحدة.

المهمة 2:
عرّف دالة الربح الصافي B(x) = R(x) - C(x) وبيّن أنّها تكتب على الشكل:
B(x) = -(x - 5)² + 9

المهمة 3:
1. ادرس اتجاه تغير الدالة B على المجال [1 ; 10] وشكّل جدول تغيراتها.
2. استنتج عدد الوحدات الواجب إنتاجها وبيعها لتحقيق أكبر ربح ممكن، وما هي قيمة هذا الربح الأقصى بالدينار الجزائري؟`
  },
];

export default function WorksheetGenerator({ profile }: Props) {
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(WORKSHEET_TEMPLATES[0]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mode, setMode] = useState<'templates' | 'custom'>('templates');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const userProfile: TeacherProfile = profile || (() => {
    try {
      const saved = localStorage.getItem('tamkeen_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'الأستاذ(ة)',
      institution: 'المؤسسة التربوية',
      province: 'الجزائر',
      academicYear: '2025/2026',
      teachingSubject: 'التعليم العام'
    } as TeacherProfile;
  })();

  const stages = [
    { id: 'primary', label: 'ابتدائي', color: 'from-emerald-400 to-teal-500' },
    { id: 'middle', label: 'متوسط', color: 'from-blue-400 to-indigo-500' },
    { id: 'secondary', label: 'ثانوي', color: 'from-purple-400 to-pink-500' },
  ];

  const filtered = WORKSHEET_TEMPLATES.filter(t => !selectedStage || t.stage === selectedStage);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 800);
  };

  const handleExportPDF = async () => {
    if (!selectedTemplate) return;
    setIsExporting(true);
    try {
      const { exportWorksheetToPDF } = await import('../../utils/pdfGenerator');
      await exportWorksheetToPDF(userProfile, {
        title: selectedTemplate.title,
        subject: selectedTemplate.subject,
        level: selectedTemplate.level,
        content: selectedTemplate.content
      });
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير ورقة العمل.');
    } finally {
      setIsExporting(false);
    }
  };

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
              <p className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-4">المولد الحر قيد التحيين — استخدم النماذج المعيارية الجاهزة.</p>
              <button onClick={() => setShowComingSoon(false)} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-xl font-black">استخدام النماذج الجاهزة</button>
            </div>
          </div>
        </div>
      )}

      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto space-y-8 pb-20 font-['Cairo']">
        <div className="text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <FileEdit size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            مولد أوراق العمل والوضعيات الإدماجية <Wand2 size={24} className="text-indigo-500" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">وضعيات إدماجية جاهزة ومطابقة للمناهج الجزائرية مع تصدير بيداغوجي رسمي</p>
        </div>

        <div className="flex items-center justify-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 max-w-xs mx-auto">
          <button onClick={() => setMode('templates')} className={`flex-1 py-2 px-4 rounded-xl font-black text-sm transition-all ${mode === 'templates' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-slate-500'}`}><Star size={14} className="inline mr-1" />نماذج رسمية</button>
          <button onClick={() => { setMode('custom'); setShowComingSoon(true); }} className={`flex-1 py-2 px-4 rounded-xl font-black text-sm transition-all ${mode === 'custom' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-md' : 'text-slate-500'}`}><Sparkles size={14} className="inline mr-1" />مخصص</button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => setSelectedStage('')} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${!selectedStage ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>الكل</button>
          {stages.map(s => (
            <button key={s.id} onClick={() => setSelectedStage(s.id)} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${selectedStage === s.id ? `bg-gradient-to-r ${s.color} text-white shadow-md` : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tpl, idx) => {
            const stage = stages.find(s => s.id === tpl.stage) || stages[0];
            const isSel = selectedTemplate === tpl;
            return (
              <button key={idx} onClick={() => { setSelectedTemplate(tpl); setGenerated(false); }}
                className={`text-right p-5 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${isSel ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-gradient-to-r ${stage.color} text-white`}>{tpl.label}</span>
                  <div className="text-right">
                    <div className="font-black text-slate-800 dark:text-white text-sm">{tpl.subject}</div>
                    <div className="text-xs text-slate-500 font-bold">{tpl.level}</div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <div className="font-black text-indigo-600 dark:text-indigo-400 text-xs mb-1">{tpl.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedTemplate && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-indigo-200 dark:border-indigo-900/50 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-gradient-to-b from-indigo-400 to-purple-600 rounded-full"></div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white text-lg">{selectedTemplate.title}</h3>
                  <p className="text-xs text-slate-500 font-bold">{selectedTemplate.level} — {selectedTemplate.subject}</p>
                </div>
              </div>

              {generated && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-slate-200"
                  >
                    <Printer size={16} /> طباعة
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Download size={16} />
                    <span>{isExporting ? 'جاري التصدير...' : 'تصدير ورقة عمل رسمية (PDF)'}</span>
                  </button>
                </div>
              )}
            </div>

            {!generated ? (
              <button onClick={handleGenerate} disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl py-4 font-black shadow-lg flex items-center justify-center gap-2 hover:shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-70">
                {loading ? <span className="animate-pulse">جاري بناء الوضعية الإدماجية...</span> : <><Wand2 size={20} />توليد ومعاينة ورقة العمل</>}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="border-b border-dashed border-slate-300 dark:border-slate-600 pb-3 mb-4 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>ورقة عمل بيداغوجية — الجمهورية الجزائرية الديمقراطية الشعبية</span>
                    <span>{selectedTemplate.level}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-['Cairo'] text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{selectedTemplate.content}</pre>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl active:scale-95 transition-all"
                  >
                    <FileText size={18} />
                    <span>{isExporting ? 'جاري تجهيز المستند...' : 'تحميل ورقة العمل الرسمية بتنسيق الكراس اليومي (PDF)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
