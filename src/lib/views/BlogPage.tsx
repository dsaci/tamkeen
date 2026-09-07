import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowLeft, Search, Tag, X } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: 'التدريس المتمايز: خطة عملية لإدارة فصل متعدد المستويات',
    excerpt: 'كيف تتعامل مع الفروق الفردية داخل القسم وتصمم أنشطة تناسب جميع مستويات التلاميذ.',
    date: '10 سبتمبر 2026', category: 'بيداغوجيا',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    content: `# التدريس المتمايز: كيف تدير فصلاً متعدد المستويات؟

## ما هو التدريس المتمايز؟
التدريس المتمايز هو نهج بيداغوجي يقوم على مبدأ أن التلاميذ مختلفون في قدراتهم واهتماماتهم وأساليب تعلّمهم. بدلاً من تعليم الجميع بنفس الطريقة، يُكيّف الأستاذ أساليبه وأنشطته بما يناسب كل مجموعة.

## الخطوات العملية الثلاث

### 1. التشخيص المبكر
- في أول أسبوع من الدراسة، أجرِ تقويماً تشخيصياً بسيطاً.
- صنّف تلاميذك إلى 3 مجموعات: المتقدمون / المتوسطون / الذين يحتاجون دعماً إضافياً.

### 2. تصميم الأنشطة بالتمايز
- **مجموعة الدعم**: تمارين تطبيقية مباشرة وبسيطة مع مساندة الأستاذ.
- **المجموعة المتوسطة**: تمارين تقيسيّة تتوافق مع مستوى الكتاب المدرسي.
- **مجموعة الإثراء**: تحديات ووضعيات مركبة ومشاريع إضافية.

### 3. إدارة الوقت داخل الحصة
- اعمل مع مجموعة واحدة مباشرة بينما تعمل المجموعتان الأخريان باستقلالية.
- استخدم بطاقات العمل الذاتي لتوفير وقتك.

## أدوات مفيدة
- تطبيق تمكين: يساعدك على بناء أوراق عمل متمايزة في دقائق.
- الجداول التعاونية: تجمّع التلاميذ المتقاربين في المستوى.

## خلاصة
التمايز ليس ترفاً بيداغوجياً، بل ضرورة ديموقراطية تضمن حق كل تلميذ في التعلم وفق إيقاعه الخاص.`
  },
  {
    id: 2,
    title: '30 برومبت للتقويم التكويني: أسئلة سريعة وبطاقات خروج',
    excerpt: 'استخدم هذه الأوامر مع المساعد الذكي لتوليد أسئلة تقويم تكويني سريعة وفعالة.',
    date: '5 سبتمبر 2026', category: 'ذكاء اصطناعي',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    content: `# 30 برومبت ذكي للتقويم التكويني

## ما هو التقويم التكويني؟
هو التقويم المستمر الذي يجري خلال عملية التعلم لا في نهايتها. هدفه مساعدة التلميذ على تصحيح مساره، وليس منحه علامة.

## كيف تستخدم هذه البرومبتات؟
انسخ أي برومبت وضعه في المساعد الذكي مع تحديد المادة والمستوى.

## البرومبتات الـ 30

### أسئلة الفهم السريع (5 أسئلة)
1. "أنشئ 5 أسئلة فهم سريعة لمادة [المادة] مستوى [المستوى] حول [الموضوع]"
2. "اكتب 3 أسئلة إجابتها صح/خطأ لتقويم فهم [الموضوع]"
3. "صغ سؤالاً واحداً عميقاً يكشف سوء فهم شائع في [الموضوع]"
4. "أنشئ تمريناً تصحيحياً لتلميذ يخطئ في [النقطة المحددة]"
5. "اكتب سؤالاً مفتوحاً يتيح للتلميذ التعبير عن تعلّمه"

### بطاقات الخروج (5 أنواع)
6. "اكتب بطاقة خروج: شيء تعلمته / شيء أريد فهمه / سؤال عندي"
7. "أنشئ بطاقة خروج بنظام 3-2-1: 3 معلومات / 2 أشياء مثيرة / 1 سؤال"
8. "صمّم بطاقة خروج بالرسم: ارسم ما تعلمته اليوم"
...

## خلاصة
التقويم التكويني الجيد يجعل التلميذ شريكاً في تقييم تعلّمه، ويمنح الأستاذ مرآة فورية لفعالية تدريسه.`
  },
  {
    id: 3,
    title: 'بناء الوضعية الإدماجية: من النظرية إلى التطبيق',
    excerpt: 'خطوات عملية وتطبيقية لبناء وضعية إدماجية مركبة تتوافق مع المعايير الرسمية.',
    date: '28 أوت 2026', category: 'ديداكتيك',
    image: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=800',
    content: `# الوضعية الإدماجية: الدليل العملي الشامل

## تعريف الوضعية الإدماجية
هي وضعية تعليمية معقدة تضع التلميذ أمام مشكلة حقيقية أو محاكاة للحياة الواقعية، وتستدعي منه توظيف مجموعة من المعارف والمهارات المكتسبة في وحدات تعلمية مختلفة.

## المكونات الثلاثة الأساسية

### 1. السياق (Context)
- يجب أن يكون السياق **واقعياً وذا معنى** للتلميذ.
- مثال: "يريد فريق القسم تنظيم رحلة إلى المتحف الوطني..."

### 2. السند (Support)
- وثيقة / صورة / جدول / نص / خريطة تمدّ التلميذ بالمعلومات.
- يجب أن يكون السند **كافياً لكن غير مكتمل** (يترك مجالاً للتفكير).

### 3. المهام (Tasks)
- مهمة 1: فهم وتحليل السند.
- مهمة 2: توظيف الموارد المكتسبة.
- مهمة 3: إنتاج كتابي أو حل نهائي.

## أخطاء شائعة يجب تجنبها
- ❌ وضعية تستدعي موارد غير مدروسة.
- ❌ مهام متوالية لا تقيس الإدماج الحقيقي.
- ❌ غياب السياق الواقعي (سؤال مباشر بدل وضعية).

## أمثلة تطبيقية

### للطور الابتدائي — رياضيات
"تريد والدة ياسمين شراء لوازم للعودة المدرسية بميزانية 2000 دج. اعتمادًا على قائمة الأسعار، ساعدها في اختيار أفضل ما يمكن شراؤه."

### للطور المتوسط — اللغة العربية
"تلقّت جمعية المدرسة دعوة لتنظيم مسرحية تربوية. كلّف القسم بكتابة النص المسرحي وتوزيع الأدوار."`
  },
  {
    id: 4,
    title: 'أول أسبوع في التعليم: 10 نصائح للأستاذ الجديد',
    excerpt: 'دليل عملي لتجاوز التحديات الأولى وبناء علاقة إيجابية مع التلاميذ والإدارة.',
    date: '1 سبتمبر 2026', category: 'إدارة صف',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    content: `# أول أسبوع في التعليم: دليلك العملي

## اليوم الأول: الانطباع الأول لا يُمحى

### قبل الدخول للقسم
- احضر مبكراً 20 دقيقة على الأقل.
- اكتب اسمك على السبورة بخط واضح.
- رتّب المقاعد بشكل يسهّل التواصل.

### داخل القسم
1. **قدّم نفسك** بإيجاز: اسمك، تخصصك، توقعاتك من التلاميذ.
2. **اطلب التعريف**: اجعل كل تلميذ يقول اسمه وشيئاً يحبه.
3. **وضّح القواعد** بإيجاز: الانضباط، الاحترام، المشاركة.

## الأسبوع الأول: بناء الثقة

### مع التلاميذ
- احفظ أسماء التلاميذ في أسرع وقت ممكن — هذا يبني الثقة.
- لا تُعاقب الجماعة على خطأ فرد.
- كن صارماً في القواعد ودوداً في التعامل.

### مع الإدارة
- قدّم خطتك السنوية للمدير في أول أسبوع.
- اطلع على لائحة المدرسة الداخلية.
- اطلب مرافقة أستاذ متمرس كموجّه.

### مع الأولياء
- الوضوح من البداية يمنع الغموض لاحقاً.
- حدّد أوقات الاستقبال وطريقة التواصل.

## 5 أخطاء يقع فيها كل أستاذ جديد
1. ❌ محاولة أن يكون صديقاً لا أستاذاً.
2. ❌ إهمال التخطيط للحصة.
3. ❌ الانشغال بالتقييم من اليوم الأول.
4. ❌ عدم الاستعانة بالزملاء.
5. ❌ الاستسلام بسرعة للصعوبات.

## خلاصة
الأستاذ الناجح لا يُولد، بل يُبنى بالصبر والتأمل والتطوير المستمر.`
  },
  {
    id: 5,
    title: 'كيف تصمم مذكرة درس احترافية في 20 دقيقة',
    excerpt: 'نموذج مبسّط لمذكرة تحضير الدرس يوفر وقتك دون الإخلال بالجودة.',
    date: '20 أوت 2026', category: 'بيداغوجيا',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800',
    content: `# مذكرة الدرس في 20 دقيقة: النموذج المختصر الفعّال

## لماذا تحضير الدرس ضروري؟
المذكرة ليست إجراءً بيروقراطياً، بل هي خريطة الطريق التي تضمن حصة منظمة ومؤثرة. الأستاذ الذي يحضّر يُدرّس بثقة، والذي لا يحضّر يرتجل.

## النموذج المختصر (8 عناصر أساسية)

| العنصر | مثال |
|--------|------|
| المادة + المستوى | رياضيات — السنة 3 متوسط |
| الميدان/المقطع | الأعداد والعمليات |
| الكفاءة المستهدفة | يحل مسائل التناسبية |
| الموارد المعرفية | خاصية التناسب، الجدول |
| الوضعية التعلمية | وضعية الانطلاق (5 د) + البناء (25 د) + التقويم (10 د) |
| أدوات التقييم | تمرين ختامي / بطاقة خروج |
| التمييز | نشاط إثراء للمتقدمين / دعم للمتعثرين |
| الوسائل | السبورة / بطاقات عمل / تطبيق تمكين |

## الخطوات الـ 20 دقيقة
- **5 دقائق**: حدّد الكفاءة والموارد.
- **10 دقائق**: صمّم التسلسل البيداغوجي (انطلاق ← بناء ← تقويم).
- **5 دقائق**: جهّز بطاقة عمل أو سؤال تقويمي.

## أداة تمكين توفّر عليك الوقت
بدلاً من كتابة المذكرة يدوياً، استخدم "المذكرة الذكية" في تمكين — تملأ البيانات وتولّد هيكل المذكرة في أقل من دقيقتين.`
  },
  {
    id: 6,
    title: 'الذكاء الاصطناعي في خدمة الأستاذ الجزائري',
    excerpt: 'كيف تستخدم أدوات الذكاء الاصطناعي بذكاء دون الإخلال بقيم المهنة التعليمية.',
    date: '15 أوت 2026', category: 'ذكاء اصطناعي',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800',
    content: `# الذكاء الاصطناعي: صديق الأستاذ لا بديله

## الخوف الشائع
كثير من الأساتذة يخشون أن يحلّ الذكاء الاصطناعي محلّهم. هذا الخوف مفهوم لكنه غير مبرر. الذكاء الاصطناعي يُلغي المهام الروتينية، لا العلاقة الإنسانية التعليمية.

## ما يُحسنه الذكاء الاصطناعي
✅ صياغة أسئلة وتمارين في ثوانٍ
✅ تلخيص نصوص طويلة
✅ توليد أفكار لأنشطة جديدة
✅ كتابة رسائل الأولياء
✅ إعداد خطط فصلية وسنوية

## ما لا يستطيع فعله أبداً
❌ بناء علاقة ثقة مع التلميذ
❌ قراءة الحالة النفسية للمتعلم
❌ التكيّف الفوري مع ردود الفعل داخل الحصة
❌ تقديم القدوة والنموذج الأخلاقي

## 5 استخدامات فورية في تمكين
1. **المذكرة الذكية**: جهّز درسك في دقيقتين.
2. **مولد الاختبارات**: أسئلة وفق الكفاءة مباشرةً.
3. **أوراق العمل**: وضعيات إدماجية جاهزة.
4. **المساعد الذكي**: أجب عن أسئلة بيداغوجية معقدة.
5. **صانع العروض**: عروض بيداغوجية بمراحل الدرس الثلاث.`
  },
];

const CATEGORIES = ['الكل', 'بيداغوجيا', 'ذكاء اصطناعي', 'ديداكتيك', 'إدارة صف'];

export default function BlogPage() {
  const [selected, setSelected] = useState<any>(null);
  const [cat, setCat] = useState('الكل');
  const [search, setSearch] = useState('');

  const filtered = ARTICLES.filter(a =>
    (cat === 'الكل' || a.category === cat) &&
    (a.title.includes(search) || a.excerpt.includes(search))
  );

  if (selected) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pb-20">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-emerald-600 font-black mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} className="rotate-180"/> العودة للمدونة
        </button>
        <div className="h-64 rounded-3xl overflow-hidden mb-8">
          <img src={selected.image} alt={selected.title} className="w-full h-full object-cover"/>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-black px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">{selected.category}</span>
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1"><Calendar size={12}/>{selected.date}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{selected.title}</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-['Cairo'] text-slate-700 dark:text-slate-300 leading-relaxed text-base">{selected.content}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <BookOpen className="text-emerald-500" size={36}/> المدونة التربوية
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">مقالات، استراتيجيات، وتوجيهات للمعلم الجزائري.</p>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث في المدونة..."
            className="pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-emerald-500 w-64"/>
          {search && <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={14}/></button>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full font-black text-sm transition-all ${
              cat === c ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
            }`}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(article => (
          <article key={article.id} onClick={() => setSelected(article)}
            className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col hover:-translate-y-2">
            <div className="h-48 overflow-hidden relative">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                  <Tag size={10}/>{article.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mb-3"><Calendar size={10}/>{article.date}</p>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-emerald-600 transition-colors">{article.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">{article.excerpt}</p>
              <div className="mt-4 flex items-center gap-1 text-emerald-600 font-black text-sm opacity-0 group-hover:opacity-100 transition-all">
                <span>اقرأ المقال</span><ArrowLeft size={14} className="rotate-180"/>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
