import React, { useState } from 'react';
import { FileText, Sparkles, X, Clock, Star, Download, Printer, Wand2 } from 'lucide-react';
import { TeacherProfile } from '../../../types';

interface Props {
  profile?: TeacherProfile;
}

// Standard Algerian examination templates with complete structured content
const STANDARD_TEMPLATES = [
  // Primary
  {
    stage: 'primary',
    label: 'ابتدائي',
    subject: 'اللغة العربية',
    level: 'السنة الثالثة ابتدائي',
    type: 'اختبار الفصل الثاني',
    desc: 'وضعية إدماجية: قراءة نص حول الطبيعة والمحافظة على البيئة + أسئلة فهم + إنتاج كتابي',
    content: `النّص:
فِي صَبَاحِ يَوْمِ الرَّبِيعِ البَدِيعِ، خَرَجَ سَمِيرٌ مَعَ أَبِيهِ إِلَى الحَدِيقَةِ العَامَّةِ. كَانَتِ الأَشْجَارُ مُورِقَةً وَالأَزْهَارُ مُتَفَتِّحَةً تَفُوحُ مِنْهَا رَوَائِحُ زَكِيَّةٌ. لَفَتَ انْتِبَاهَ سَمِيرٍ وُجُودُ أَكْيَاسٍ بِلَاسْتِيكِيَّةٍ مُلْقَاةٍ عَلَى العُشْبِ الأَخْضَرِ، فَقَالَ لأَبِيهِ: "انْظُرْ يَا أَبِي، كَيْفَ يُلَوِّثُ النَّاسُ هَذَا الجَمَالَ!" ابْتَسَمَ الأَبُ وَقَالَ: "حِمَايَةُ البِيئَةِ وَاجِبُ كُلِّ فَرْدٍ مِنَّا، فَلْنَبْدَأْ بِأَنْفُسِنَا يَا بُنَيَّ". فَشَمَّرَ سَمِيرٌ عَنْ سَاعِدَيْهِ وَشَرَعَا فِي تَنْظِيفِ المَكَانِ.

الأسئلة:
أولاً: البناء الفكري (03 نقاط)
1. هَاتِ عُنْوَانًا مُنَاسِبًا لِلنَّصِّ. (1 ن)
2. مَاذَا لَفَتَ انْتِبَاهَ سَمِيرٍ فِي الحَدِيقَةِ؟ (1 ن)
3. اسْتَخْرِجْ مِنَ النَّصِّ مُرَادِفَ: "طَيِّبَةٌ" = .......... ، وَضِدَّ: "مَسَاءٌ" ≠ .......... (1 ن)

ثانياً: البناء اللغوي (03 نقاط)
1. اسْتَخْرِجْ مِنَ النَّصِّ:
- فِعْلاً مَاضِيًا: .................... | اسْمًا مَجْرُورًا: ....................
- جَمْعَ مُؤَنَّثٍ سَالِمٍ: .................... | كَلِمَةً بِهَا شَمْسِيَّةٌ: .................... (1.5 ن)
2. حَوِّلِ الجُمْلَةَ التَّالِيَةَ إِلَى المُثَنَّى: "خَرَجَ التِّلْمِيذُ إِلَى الحَدِيقَةِ". (1 ن)
3. عَلِّلْ كِتَابَةَ التَّاءِ مَفْتُوحَةً فِي كَلِمَةِ: "الأَكْيَاسِ البِلَاسْتِيكِيَّةِ" أو "مُتَفَتِّحَةٌ". (0.5 ن)

ثالثاً: الوضعية الإدماجية (04 نقاط)
بِمُنَاسَبَةِ اليَوْمِ العَالَمِيِّ لِلشَّجَرَةِ، شَارَكْتَ مَعَ زُمَلَائِكَ فِي حَمْلَةِ تَشْجِيرٍ بِمَدْرَسَتِكُمْ.
اكْتُبْ فِقْرَةً لَا تَقِلُّ عَنْ سِتَّةِ أَعْيُنٍ (6 أسطر) تَصِفُ فِيهَا مَا قُمْتُمْ بِهِ، مَذْكُورًا فَوَائِدَ الشَّجَرَةِ، مُوَظِّفًا فِعْلًا مَاضِيًا وَمُحْتَرِمًا عَلَامَاتِ الوَقْفِ.`
  },
  {
    stage: 'primary',
    label: 'ابتدائي',
    subject: 'الرياضيات',
    level: 'السنة الخامسة ابتدائي',
    type: 'اختبار الفصل الثاني',
    desc: 'الكسور العشرية، الهندسة وحساب المساحات، المسألة الإدماجية المركبة بمرحلتين',
    content: `الجزء الأول: (06 نقاط)
التمرين الأول: (1.5 نقطة)
أنجز العمليات التالية عمودياً بدقة:
1) 854.25 + 63.8 = ..............
2) 1245.6 - 789.75 = ..............
3) 34.6 × 4.8 = ..............

التمرين الثاني: (1.5 نقطة)
1. رتّب الأعداد العشرية التالية ترتيباً تصاعدياً باستعمال الرمز المناسب:
5.48  -  5.84  -  5.08  -  5.804  -  5.8
2. احصر العدد 7.36 بين عددين طبيعيين متتاليين.

التمرين الثالث: (1.5 نقطة)
حقل مستطيل الشكل طوله 120 متراً وعرضه 3/4 طوله.
- احسب عرض هذا الحقل بالمتر.
- احسب مساحته بالمتر المربع (m²).

التمرين الرابع: (1.5 نقطة)
ارسم قطعة مستقيمة [AB] طولها 6cm.
- عيّن النقطة O منتصف [AB].
- ارسم المستقيم (D) العمودي على [AB] في النقطة O.
- ما نوع المثلث المكوّن من النقط A و B ونقطة C تنتمي إلى (D)؟

الجزء الثاني: الوضعية الإدماجية (04 نقاط)
اشترى فلاح قطعة أرض بـ 450,000 دج، وبنى عليها مسكناً ومستودعاً لتربية الدواجن.
خصّص لمواد البناء مبلغ 180,000 دج، ولأجرة العمال 65,000 دج.
1. احسب الكلفة الإجمالية لبناء المسكن والمستودع.
2. اشترى الفلاح 250 كتكوتاً بسعر 120 دج للكتكوت الواحد، وعلَفاً بـ 15,000 دج.
- كم دفع الفلاح ثمناً للكتاكيت؟
- ما هي المصاريف الكلية لتربية الدواجن؟`
  },
  {
    stage: 'middle',
    label: 'متوسط',
    subject: 'اللغة العربية',
    level: 'السنة الرابعة متوسط',
    type: 'فرض محروس للفصل الثاني',
    desc: 'نص حجاجي توجيهي + أسئلة التحليل البلاغي والإعراب + وضعية إدماجية معيارية',
    content: `السّند:
"إنّ التّقدّم التّكنولوجي الهائل الّذي يشهده عالمنا المعاصر سلاح ذو حدّين؛ فبقدر ما وفّر للإنسان من وسائل الرّفاهية وتيسير سبل التّواصل والمعرفة، بقدر ما أفرز تحدّيات أخلاقية واجتماعية جسيمة كادت تعصف بالرّوابط الأسرية والقيم المجتمعية الأصيلة.
فيا شباب اليوم، اعلموا أنّ شبكات التّواصل الاجتماعي ليست مجرّد نوافذ للتّسلية وقضاء الأوقات، بل هي فضاءات مفتوحة تتطلّب وعياً رشيداً وحسّاً نقدياً عالياً. لا تجعلوا من شاشاتكم عازلاً يفصلكم عن محيطكم الحقيقي، واستثمروا هذا الفيض المعرفي في صقل مهاراتكم وخدمة وطنكم، فالأمم لا تنهض إلا بسواعد شبابها المتعلّم والمتمسّك بقيمه."

الأسئلة:
الجزء الأول: (12 نقطة)
أولاً: الوضعية الأولى (04 نقاط)
1. صُغ فكرة عامة مناسبة للسند. (1 ن)
2. عدّد فائدتين وخطرين من أخطار التكنولوجيا المذكورة في النص. (1.5 ن)
3. اشرح بالمرادف: "تعصف" ، وبالضد: "الرّشيد". (1 ن)
4. اقترح نصيحة لزملائك للاستخدام الآمن لشبكات التواصل. (0.5 ن)

ثانياً: الوضعية الثانية (08 نقاط)
1. أعرب ما تحته خط في السند إعراباً تاماً:
- "سلاحُ" : ............................................................
- "عازلاً" : ............................................................ (2 ن)
2. حدّد محل الجمل الآتية الواقعة بين قوسين من الإعراب: (2 ن)
- "يشهده عالمنا" : ....................................................
- "تتطلّب وعياً" : ......................................................
3. استخرج من الفقرة الأولى محسناً بديعياً وبيّن نوعه وأثره في المعنى. (1.5 ن)
4. سمّ الصورة البيانية التالية واشرحها: "التكنولوجيا سلاح ذو حدّين". (1.5 ن)
5. ما النمط الغالب على النص؟ مثّل له بمؤشرين من السند. (1 ن)

الجزء الثاني: الوضعية الإدماجية (08 نقاط)
السياق: لاحظت أنّ أخاك الأصغر يمضي ساعات طوالاً أمام الألعاب الإلكترونية مهملاً واجباته المدرسية وتواصله مع أسرته.
السند: قال الحكيم: "الوقت كالسيف إن لم تقطعه قطعك".
التعليمة: اكتب نصاً حجاجياً توجيهياً لا يتعدى 16 سطراً، تقنع فيه أخاك بمخاطر الإدمان الرقمي، وتوجهه إلى كيفية تنظيم وقته وتحقيق التوازن بين دراسته وهواياته، موظفاً جملة نعتية ومجازاً لغوياً ومراعياً سلامة اللغة.`
  },
  {
    stage: 'middle',
    label: 'متوسط',
    subject: 'العلوم الفيزيائية',
    level: 'السنة الثالثة متوسط',
    type: 'اختبار الفصل الأول',
    desc: 'المادة وتحولاتها، التفاعل الكيميائي كنموذج للتحول، انحفاظ الكتلة وموازنة المعادلات',
    content: `الجزء الأول: (12 نقطة)
التمرين الأول: (06 نقاط)
نقوم بحرق غاز البوتان (C₄H₁₀) في وجود وفرة من غاز ثنائي الأكسجين (O₂).
1. ما نوع هذا الاحتراق؟ برّر إجابتك علمياً.
2. اذكر أسماء وصيغ المواد الابتدائية والمواد النهائية لهذا التفاعل.
3. اكتب معادلة التفاعل الكيميائي الحادث وقم بموازنتها مبيناً الحالة الفيزيائية لكل فرد كيميائي.
4. ما هو العامل المؤثر في هذا التفاعل؟

التمرين الثاني: (06 نقاط)
نضع في دورق كتلة m₁ = 10g من كربونات الكالسيوم (طبشور)، ونضيف إليها حجماً من حمض كلور الماء.
نسد الدورق بإحكام ونضعه فوق ميزان إلكتروني فيشير إلى الكتلة M₁ = 245.5g.
بعد حدوث الفوران وتشكل غاز يعكّر ماء الجير، يشير الميزان إلى الكتلة M₂ = 245.5g.
1. سمّ الغاز المنطلق واكتب صيغته الكيميائية.
2. فسّر عدم تغير قراءة الميزان بعد حدوث التفاعل الكيميائي.
3. ما هو المبدأ الفيزيائي المستنتج هنا؟ وما نصه العلمي؟

الجزء الثاني: الوضعية الإدماجية (08 نقاط)
أثناء فصل الشتاء، شعرت عائلة أحمد بدوار وصداع شديدين أثناء تشغيل مدفأة تشتغل بغاز الميثان داخل غرفة مغلقة النوافذ.
عند تفحص المدفأة لاحظ أحمد أنّ لهبها أصفر برتقالي، مع تشكل طبقة سوداء على الأواني القريبة.
1. حدّد سبب الأعراض التي أصابت العائلة، وسمّ الغاز الخانق المتسبب في ذلك واذكر خطورته.
2. فسّر سبب ظهور اللون الأصفر البرتقالي للهب وتشكل الطبقة السوداء.
3. اكتب معادلة التفاعل الكيميائي الحاصل في هذه الحالة ووازنها.
4. قدّم ثلاثة حلول وقائية بيداغوجية لتفادي هذه الحوادث الخطيرة مستقبلاً.`
  },
  {
    stage: 'secondary',
    label: 'ثانوي',
    subject: 'الرياضيات',
    level: 'السنة الثانية ثانوي - شعبة علوم تجريبية',
    type: 'فرض محروس للفصل الثاني',
    desc: 'دراسة الدوال العددية، النهايات، الاشتقاقية، وتطبيقات المماس ونقاط الانعطاف',
    content: `التمرين الأول: (08 نقاط)
لتكن f الدالة المعرفة على R بـ: f(x) = x³ - 3x + 2
وليكن (Cf) تمثيلها البياني في معلم متعامد ومتجانس (O; i, j).
1. احسب نهايات الدالة f عند -∞ وعند +∞.
2. احسب المشتقة f'(x) وادرس إشارتها على R.
3. شكّل جدول تغيرات الدالة f بالتفصيل.
4. بيّن أنّ النقطة A(0; 2) هي نقطة انعطاف للمنحنى (Cf).
5. اكتب معادلة المماس (T) للمنحنى (Cf) عند النقطة A.
6. ادرس الوضع النسبي للمنحنى (Cf) بالنسبة إلى المماس (T).

التمرين الثاني: (12 نقطة)
لتكن g الدالة المعرفة على Dg = R - {1} كما يلي:
g(x) = (2x + 1) / (x - 1)
1. عيّن نهايات الدالة g عند حدود مجالات تعريفها، وفسّر النتائج بيانياً (المستقيمات المقاربة).
2. احسب g'(x) واستنتج اتجاه تغير الدالة g على كل مجال من مجالي تعريفها.
3. عيّن إحداثيات نقط تقاطع المنحنى (Cg) مع حاملي محوري الإحداثيات.
4. بيّن أنّ النقطة Ω(1; 2) هي مركز تناظر للمنحنى (Cg).
5. ارسم بدقة المستقيمات المقاربة والمنحنى (Cg) في المعلم السابق.`
  }
];

export default function ExamGenerator({ profile }: Props) {
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(STANDARD_TEMPLATES[0]);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mode, setMode] = useState<'templates' | 'custom'>('templates');

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
      teachingSubject: 'التعليم الثانوي والأساسي'
    } as TeacherProfile;
  })();

  const stages = [
    { id: 'primary', label: 'ابتدائي', color: 'from-emerald-400 to-teal-500' },
    { id: 'middle', label: 'متوسط', color: 'from-blue-400 to-indigo-500' },
    { id: 'secondary', label: 'ثانوي', color: 'from-purple-400 to-pink-500' },
  ];

  const filteredTemplates = STANDARD_TEMPLATES.filter(t => !selectedStage || t.stage === selectedStage);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsGenerated(true);
    }, 800);
  };

  const handleExportPDF = async () => {
    if (!selectedTemplate) return;
    setIsExporting(true);
    try {
      const { exportExamToPDF } = await import('../../utils/pdfGenerator');
      await exportExamToPDF(userProfile, {
        subject: selectedTemplate.subject,
        level: selectedTemplate.level,
        examType: selectedTemplate.type,
        duration: selectedTemplate.stage === 'secondary' ? 'ساعتان' : 'ساعة ونصف',
        coefficient: selectedTemplate.stage === 'secondary' ? '3' : '2',
        content: selectedTemplate.content
      });
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير موضوع الاختبار.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm relative animate-in zoom-in-95 duration-300">
            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-[3rem] blur opacity-50 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 text-center overflow-hidden shadow-2xl">
              <button onClick={() => setShowComingSoon(false)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={16} />
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">قيد التطوير 🔧</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed mb-4">
                هذه الميزة متاحة للنماذج المعيارية الرسمية حالياً. نرحب باستعمالك لنماذج المنهاج الجزائري الكاملة.
              </p>
              <button onClick={() => setShowComingSoon(false)} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-xl font-black hover:shadow-lg transition-all">
                استخدام النماذج الوزارية الجاهزة
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto space-y-8 pb-20 font-['Cairo']">
        <div className="text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            مولد الاختبارات والفروض المنهجية <Sparkles size={24} className="text-amber-500" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">نماذج امتحانات وفروض مطابقة للمنهاج الجزائري مع تصدير رسمي موحد</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 max-w-xs mx-auto">
          <button onClick={() => setMode('templates')} className={`flex-1 py-2 px-4 rounded-xl font-black text-sm transition-all ${mode === 'templates' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-md' : 'text-slate-500'}`}>
            <Star size={14} className="inline mr-1" /> نماذج رسمية
          </button>
          <button onClick={() => { setMode('custom'); setShowComingSoon(true); }} className={`flex-1 py-2 px-4 rounded-xl font-black text-sm transition-all ${mode === 'custom' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-md' : 'text-slate-500'}`}>
            <Sparkles size={14} className="inline mr-1" /> مخصص
          </button>
        </div>

        {/* Stage Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => setSelectedStage('')} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${!selectedStage ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}>الكل</button>
          {stages.map(s => (
            <button key={s.id} onClick={() => setSelectedStage(s.id)} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${selectedStage === s.id ? `bg-gradient-to-r ${s.color} text-white shadow-md` : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}>{s.label}</button>
          ))}
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl, idx) => {
            const stage = stages.find(s => s.id === tpl.stage) || stages[0];
            const isSel = selectedTemplate === tpl;
            return (
              <button
                key={idx}
                onClick={() => { setSelectedTemplate(tpl); setIsGenerated(false); }}
                className={`text-right p-5 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${isSel ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-gradient-to-r ${stage.color} text-white`}>{tpl.label}</span>
                  <div className="text-right">
                    <div className="font-black text-slate-800 dark:text-white text-sm">{tpl.subject}</div>
                    <div className="text-xs text-slate-500 font-bold">{tpl.level}</div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mb-1">{tpl.type}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{tpl.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedTemplate && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-emerald-200 dark:border-emerald-900/50 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white text-lg">{selectedTemplate.subject} — {selectedTemplate.type}</h3>
                  <p className="text-xs text-slate-500 font-bold">{selectedTemplate.level}</p>
                </div>
              </div>

              {isGenerated && (
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
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Download size={16} />
                    <span>{isExporting ? 'جاري التصدير...' : 'تصدير موضوع رسمي (PDF)'}</span>
                  </button>
                </div>
              )}
            </div>

            {!isGenerated ? (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl py-4 font-black shadow-lg flex items-center justify-center gap-2 transition-all hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-70"
              >
                {loading ? <span className="animate-pulse">جاري إعداد الاختبار...</span> : <><Wand2 size={20} /> توليد ومعاينة الاختبار</>}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="border-b border-dashed border-slate-300 dark:border-slate-600 pb-3 mb-4 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية</span>
                    <span>{selectedTemplate.type}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-['Cairo'] text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {selectedTemplate.content}
                  </pre>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl active:scale-95 transition-all"
                  >
                    <Download size={18} />
                    <span>{isExporting ? 'جاري تجهيز المستند...' : 'تحميل الموضوع الرسمي بتنسيق الكراس اليومي (PDF)'}</span>
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
