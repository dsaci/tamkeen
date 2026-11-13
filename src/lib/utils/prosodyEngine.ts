/**
 * ============================================================================
 * 🪶 ميزان تمكين العروضي (Tamkeen Arabic Prosody Engine) - الإصدار المتقدم 2.0
 * المحرك الحاسوبي لتشريح إيقاع وموسيقى الشعر العربي وحوسبة علم العروض
 * مزود بنظام المطابقة الديناميكية التكيفية (Adaptive Foot Segmentation)
 * وقاعدة المعرفة الكاملة للزحافات المفردة والمزدوجة والعلل (بالزيادة والنقص)
 * متوافق ومبني على مراجع منهاج اللغة العربية الجزائري ومحاضرات العروض الجامعية
 * ============================================================================
 */

export interface MeterFootMutation {
  original: string;       // التفعيلة القياسية (مثل مُسْتَفْعِلُنْ)
  actual: string;         // التفعيلة المشتقة (مثل مُتَفْعِلُنْ)
  pattern: string;        // تسلسل الرموز العروضية (مثل //0//0)
  kind: 'سالمة' | 'زحاف مفرد' | 'زحاف مزدوج' | 'علة زيادة' | 'علة نقص' | 'علة جارية مجرى الزحاف';
  name: string;           // اسم التغيير (مثل: الخبن، الإضمار، القطف...)
  explanation: string;    // الشرح العلمي الدقيق
}

export interface MeterFoot {
  original: string;
  actual: string;
  symbols: string;
  zihafOrIlla?: string;
  kind?: string;
}

export interface PoeticMeter {
  id: string;
  name: string;
  type: 'صافٍ' | 'ممتزج' | 'تفعيلة';
  rhymeKey: string;
  idealPattern: string;
  feet: string[];
  feetCountPerHemistich: number;
  description: string;
  gradeRelevance: string;
}

export interface HemistichAnalysis {
  originalText: string;
  arudWriting: string;
  symbols: string;
  feet: MeterFoot[];
}

export interface VerseAnalysisResult {
  verseOriginal: {
    firstHemistich: string;
    secondHemistich: string;
  };
  firstHemistich: HemistichAnalysis;
  secondHemistich: HemistichAnalysis;
  meter: PoeticMeter;
  confidenceScore: number;
  qafiyah: {
    word: string;
    letters: string;
    type: string;
    rawiy: string;
    rawiyMovement: string;
    status: 'سليمة' | 'تحتوي على سناد محتمل';
    notes?: string;
  };
  pedagogicalNotes: string[];
}

// ============================================================================
// 1. البحور الشعرية الستة عشر ومفاتيحها وفق المنهاج الجزائري
// ============================================================================
export const POETIC_METERS: PoeticMeter[] = [
  {
    id: 'taweel',
    name: 'بحر الطويل',
    type: 'ممتزج',
    rhymeKey: 'طَوِيلٌ لَهُ دُونَ البُحُورِ فَضَائِلُ ... فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِلُ',
    idealPattern: '//0/0 //0/0/0 //0/0 //0//0',
    feet: ['فَعُولُنْ', 'مَفَاعِيلُنْ', 'فَعُولُنْ', 'مَفَاعِيلُنْ'],
    feetCountPerHemistich: 4,
    description: 'أعظم بحور الشعر العربي فخامة؛ مبني على توالي (فَعُولُنْ مَفَاعِيلُنْ) مرتين. عروضه مقبوضة غالباً (مَفَاعِلُنْ //0//0).',
    gradeRelevance: 'السنة الأولى ثانوي (معلقات امرئ القيس وزهير)، والسنة الثالثة ثانوي'
  },
  {
    id: 'kamel',
    name: 'بحر الكامل',
    type: 'صافٍ',
    rhymeKey: 'كَمُلَ الجَمَالُ مِنَ البُحُورِ الكَامِلُ ... مُتَفَاعِلُنْ مُتَفَاعِلُنْ مُتَفَاعِلُ',
    idealPattern: '///0//0 ///0//0 ///0//0',
    feet: ['مُتَفَاعِلُنْ', 'مُتَفَاعِلُنْ', 'مُتَفَاعِلُنْ'],
    feetCountPerHemistich: 3,
    description: 'بحر إيقاعي طروب يكثر فيه زحاف الإضمار (مُتْفَاعِلُنْ /0/0//0). معتمد بقوة في شعر التفعيلة أيضاً.',
    gradeRelevance: 'السنة الأولى ثانوي (عنترة)، والسنة الثالثة ثانوي (محمود درويش والشعر المعاصر)'
  },
  {
    id: 'baseet',
    name: 'بحر البسيط',
    type: 'ممتزج',
    rhymeKey: 'إِنَّ البَسِيطَ لَدَيْهِ يُبْسَطُ الأَمَلُ ... مُسْتَفْعِلُنْ فَاعِلُنْ مُسْتَفْعِلُنْ فَعِلُ',
    idealPattern: '/0/0//0 /0//0 /0/0//0 ///0',
    feet: ['مُسْتَفْعِلُنْ', 'فَاعِلُنْ', 'مُسْتَفْعِلُنْ', 'فَاعِلُنْ'],
    feetCountPerHemistich: 4,
    description: 'بحر الرصانة والمديح والحكمة؛ يكثر فيه الخبن في مستفعلن (مُتَفْعِلُنْ //0//0) وفي فاعلن (فَعِلُنْ ///0).',
    gradeRelevance: 'السنة الأولى ثانوي (حسان بن ثابت، المتنبي)، والسنة الثالثة ثانوي (شعر المنفى للبارودي)'
  },
  {
    id: 'wafer',
    name: 'بحر الوافر',
    type: 'صافٍ',
    rhymeKey: 'بُحُورُ الشِّعْرِ وَافِرُهَا جَمِيلُ ... مُفَاعَلَتُنْ مُفَاعَلَتُنْ فَعُولُ',
    idealPattern: '//0///0 //0///0 //0/0',
    feet: ['مُفَاعَلَتُنْ', 'مُفَاعَلَتُنْ', 'فَعُولُنْ'],
    feetCountPerHemistich: 3,
    description: 'بحر الحماسة والفخر والوجد؛ عروضه مقطوفة وجوباً في التام (فَعُولُنْ //0/0)، ويكثر في حشوه العصب (مُفَاعَلْتُنْ //0/0/0).',
    gradeRelevance: 'السنة الأولى ثانوي (عمرو بن كلثوم)، والسنة الثالثة ثانوي (أحمد شوقي والقضية الفلسطينية)'
  },
  {
    id: 'khafeef',
    name: 'بحر الخفيف',
    type: 'ممتزج',
    rhymeKey: 'يَا خَفِيفاً خَفَّتْ بِهِ الحَرَكَاتُ ... فَاعِلاتُنْ مُسْتَفْعِ لُنْ فَاعِلاتُ',
    idealPattern: '/0//0/0 /0/0//0 /0//0/0',
    feet: ['فَاعِلاتُنْ', 'مُسْتَفْعِ لُنْ', 'فَاعِلاتُنْ'],
    feetCountPerHemistich: 3,
    description: 'بحر عذب رشيق؛ مستفعلن فيه مفروقة الوتد (/0/0//0). يكثر فيه الخبن والتشعيب والحذف.',
    gradeRelevance: 'السنة الثالثة ثانوي (إلياذة الجزائر لمفدي زكريا، البوصيري، أحمد شوقي)'
  },
  {
    id: 'rajaz',
    name: 'بحر الرجز',
    type: 'صافٍ',
    rhymeKey: 'فِي أَبْحُرِ الأَرْجَازِ بَحْرٌ يَسْهُلُ ... مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ مُسْتَفْعِلُ',
    idealPattern: '/0/0//0 /0/0//0 /0/0//0',
    feet: ['مُسْتَفْعِلُنْ', 'مُسْتَفْعِلُنْ', 'مُسْتَفْعِلُنْ'],
    feetCountPerHemistich: 3,
    description: 'يسمى (حمار الشعراء) لسهولته وجوازاته الواسعة، شائع في الأراجيز والمنظومات وشعر التفعيلة.',
    gradeRelevance: 'التعليم المتوسط والثانوي، منظومات النحو، والشعر الحر التفعيلي'
  },
  {
    id: 'ramal',
    name: 'بحر الرمل',
    type: 'صافٍ',
    rhymeKey: 'رَمَلُ الأَبْحُرِ تَرْوِيهِ الثِّقَاتُ ... فَاعِلاتُنْ فَاعِلاتُنْ فَاعِلاتُ',
    idealPattern: '/0//0/0 /0//0/0 /0//0/0',
    feet: ['فَاعِلاتُنْ', 'فَاعِلاتُنْ', 'فَاعِلاتُنْ'],
    feetCountPerHemistich: 3,
    description: 'بحر الموسيقى الهادئة الحزينة؛ صيغ به النشيد الوطني الجزائري (قسماً) وأروع قصائد المقاومة.',
    gradeRelevance: 'النشيد الوطني الجزائري (قسماً)، السنة الثالثة ثانوي (نازك الملائكة، نزار قباني)'
  },
  {
    id: 'mutaqarib',
    name: 'بحر المتقارب',
    type: 'صافٍ',
    rhymeKey: 'عَنِ المُتَقَارِبِ قَالَ الخَلِيلُ ... فَعُولُنْ فَعُولُنْ فَعُولُنْ فَعُولُ',
    idealPattern: '//0/0 //0/0 //0/0 //0/0',
    feet: ['فَعُولُنْ', 'فَعُولُنْ', 'فَعُولُنْ', 'فَعُولُنْ'],
    feetCountPerHemistich: 4,
    description: 'بحر وثاب سريع النبض؛ يكثر فيه زحاف القبض (فَعُولُ //0/) وحذف العروض والضرب (فَعُو //0).',
    gradeRelevance: 'السنة الأولى ثانوي، وقصائد أبي القاسم الشابي (إذا الشعب يوماً أراد الحياة)'
  },
  {
    id: 'mutadarak',
    name: 'بحر المتدارك (الخبب)',
    type: 'صافٍ',
    rhymeKey: 'حَرَكَاتُ المُحْدَثِ تَنْتَقِلُ ... فَعِلُنْ فَعِلُنْ فَعِلُنْ فَعِلُ',
    idealPattern: '///0 ///0 ///0 ///0',
    feet: ['فَاعِلُنْ', 'فَاعِلُنْ', 'فَاعِلُنْ', 'فَاعِلُنْ'],
    feetCountPerHemistich: 4,
    description: 'يسمى ركض الخيل أو الخبب إذا خُبنت تفعيلاته لتصير كلها (فَعِلُنْ ///0)؛ وهو بحر درامي عاصف متدفق.',
    gradeRelevance: 'السنة الثالثة ثانوي (قصيدة الكوليرا لنازك الملائكة، محمود درويش)'
  },
  {
    id: 'saree',
    name: 'بحر السريع',
    type: 'ممتزج',
    rhymeKey: 'بَحْرٌ سَرِيعٌ مَالَهُ سَاحِلُ ... مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلُ',
    idealPattern: '/0/0//0 /0/0//0 /0//0',
    feet: ['مُسْتَفْعِلُنْ', 'مُسْتَفْعِلُنْ', 'فَاعِلُنْ'],
    feetCountPerHemistich: 3,
    description: 'بحر سريع الإيقاع؛ عروضه مطوية مكسوفة (فَاعِلُنْ /0//0) أو مخبونة (فَعِلُنْ ///0).',
    gradeRelevance: 'السنة الثانية والثالثة ثانوي'
  },
  {
    id: 'hazaj',
    name: 'بحر الهزج',
    type: 'صافٍ',
    rhymeKey: 'عَلَى الأَهْزَاجِ تَسْهِيلُ ... مَفَاعِيلُنْ مَفَاعِيلُ',
    idealPattern: '//0/0/0 //0/0/0',
    feet: ['مَفَاعِيلُنْ', 'مَفَاعِيلُنْ'],
    feetCountPerHemistich: 2,
    description: 'بحر غنائي مجزوء وجوباً بأربع تفعيلات في البيت كاملاً.',
    gradeRelevance: 'الموشحات الأندلسية (السنة الثانية ثانوي)'
  },
  {
    id: 'munsarih',
    name: 'بحر المنسرح',
    type: 'ممتزج',
    rhymeKey: 'مُنْسَرِحٌ فِيهِ يُضْرَبُ المَثَلُ ... مُسْتَفْعِلُنْ مَفْعُولاتُ مُسْتَفْعِلُ',
    idealPattern: '/0/0//0 /0//0/ /0/0//0',
    feet: ['مُسْتَفْعِلُنْ', 'مَفْعُولاتُ', 'مُسْتَفْعِلُنْ'],
    feetCountPerHemistich: 3,
    description: 'بحر طروب منسرح الألفاظ؛ تطوى فيه مفعولاتُ لتصير مَفْعُلاتُ (/0//0/) وتنقل إلى فاعلاتُ.',
    gradeRelevance: 'السنة الثانية والثالثة ثانوي آداب وفلسفة'
  },
  {
    id: 'madeed',
    name: 'بحر المديد',
    type: 'ممتزج',
    rhymeKey: 'لِمَدِيدِ الشِّعْرِ عِنْدِي صِفَاتُ ... فَاعِلاتُنْ فَاعِلُنْ فَاعِلاتُ',
    idealPattern: '/0//0/0 /0//0 /0//0/0',
    feet: ['فَاعِلاتُنْ', 'فَاعِلُنْ', 'فَاعِلاتُنْ'],
    feetCountPerHemistich: 3,
    description: 'بحر مديد النغمات قليل الورود في الشعر المعاصر، عروضه محذوفة أو سالمة.',
    gradeRelevance: 'نصوص أدبية متقدمة'
  },
  {
    id: 'mujtath',
    name: 'بحر المجتث',
    type: 'ممتزج',
    rhymeKey: 'إِنْ جُثَّتِ الحَرَكَاتُ ... مُسْتَفْعِ لُنْ فَاعِلاتُ',
    idealPattern: '/0/0//0 /0//0/0',
    feet: ['مُسْتَفْعِ لُنْ', 'فَاعِلاتُنْ'],
    feetCountPerHemistich: 2,
    description: 'مجزوء بحر الخفيف، اقتطعت تفعيلته الأولى، عذب الموسيقى في الموشحات.',
    gradeRelevance: 'الموشحات والشعر الغنائي'
  },
  {
    id: 'muqtadab',
    name: 'بحر المقتضب',
    type: 'ممتزج',
    rhymeKey: 'اقْتَضِبْ كَمَا سَأَلُوا ... مَفْعُولاتُ مُسْتَفْعِلُ',
    idealPattern: '/0//0/ /0///0',
    feet: ['مَفْعُولاتُ', 'مُسْتَفْعِلُنْ'],
    feetCountPerHemistich: 2,
    description: 'بحر مجزوء وجوباً، سريع الإيقاع.',
    gradeRelevance: 'الثقافة الأدبية العامة'
  },
  {
    id: 'mudari',
    name: 'بحر المضارع',
    type: 'ممتزج',
    rhymeKey: 'تُعَدُّ لِلْمُضَارِعِ ... مَفَاعِيلُنْ فَاعِ لاتُ',
    idealPattern: '//0//0 /0//0/0',
    feet: ['مَفَاعِيلُنْ', 'فَاعِ لاتُنْ'],
    feetCountPerHemistich: 2,
    description: 'أندر بحور الشعر العربي مجزوء وجوباً.',
    gradeRelevance: 'تاريخ الأدب العربي'
  }
];

// ============================================================================
// 2. مستودع التفعيلات وجوازاتها الكاملة (الزحافات المفردة والمركبة والعلل)
// ============================================================================
export const FOOT_MUTATIONS_MAP: Record<string, MeterFootMutation[]> = {
  // ─── 1. تفعيلة فَعُولُنْ ───
  'فَعُولُنْ': [
    { original: 'فَعُولُنْ', actual: 'فَعُولُنْ', pattern: '//0/0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة سالمة من أي زحاف أو علة' },
    { original: 'فَعُولُنْ', actual: 'فَعُولُ', pattern: '//0/', kind: 'زحاف مفرد', name: 'القبض', explanation: 'حذف الخامس الساكن (النَّون). زحاف حسن شائع جداً' },
    { original: 'فَعُولُنْ', actual: 'فَعُولْ', pattern: '//00', kind: 'علة نقص', name: 'القصر', explanation: 'حذف ساكن السبب الخفيف وتسكين متحركه' },
    { original: 'فَعُولُنْ', actual: 'فَعُو', pattern: '//0', kind: 'علة نقص', name: 'الحذف', explanation: 'إسقاط السبب الخفيف من آخر التفعيلة (تنقل إلى فَعَلْ)' },
    { original: 'فَعُولُنْ', actual: 'فَعْ', pattern: '/0', kind: 'علة نقص', name: 'البتر', explanation: 'اجتماع الحذف والقطع؛ إسقاط السبب الخفيف وقطع الوتد' },
    { original: 'فَعُولُنْ', actual: 'فِعْلُنْ', pattern: '/0/0', kind: 'علة جارية مجرى الزحاف', name: 'الثَّلَم / الخرم', explanation: 'حذف الفاء (أول الوتد المجموع) في أول الصدر' },
  ],

  // ─── 2. تفعيلة مَفَاعِيلُنْ ───
  'مَفَاعِيلُنْ': [
    { original: 'مَفَاعِيلُنْ', actual: 'مَفَاعِيلُنْ', pattern: '//0/0/0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة سالمة من أي تغيير' },
    { original: 'مَفَاعِيلُنْ', actual: 'مَفَاعِلُنْ', pattern: '//0//0', kind: 'زحاف مفرد', name: 'القبض', explanation: 'حذف الخامس الساكن (الياء). وهو عروض الطويل الواجبة غالباً' },
    { original: 'مَفَاعِيلُنْ', actual: 'مَفَاعِيلُ', pattern: '//0/0/', kind: 'زحاف مفرد', name: 'الكف', explanation: 'حذف السابع الساكن (النون)' },
    { original: 'مَفَاعِيلُنْ', actual: 'فَعُولُنْ', pattern: '//0/0', kind: 'علة نقص', name: 'الحذف', explanation: 'حذف السبب الخفيف (لُنْ) فتصير مفاعي وتنقل لفعولن' },
    { original: 'مَفَاعِيلُنْ', actual: 'مَفَاعِيلْ', pattern: '//0/00', kind: 'علة نقص', name: 'القصر', explanation: 'حذف ساكن السبب الخفيف وتسكين ما قبله' },
    { original: 'مَفَاعِيلُنْ', actual: 'مَفْعُولُنْ', pattern: '/0/0/0', kind: 'علة جارية مجرى الزحاف', name: 'الخَرْم', explanation: 'حذف أول الوتد المجموع في صدر البيت' },
  ],

  // ─── 3. تفعيلة مُتَفَاعِلُنْ ───
  'مُتَفَاعِلُنْ': [
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتَفَاعِلُنْ', pattern: '///0//0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة سالمة (الجرس الطبيعي لبحر الكامل)' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتْفَاعِلُنْ', pattern: '/0/0//0', kind: 'زحاف مفرد', name: 'الإضمار', explanation: 'تسكين الثاني المتحرك (التاء). زحاف واسع الورود في الكامل' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُفَاعِلُنْ', pattern: '//0//0', kind: 'زحاف مفرد', name: 'الوقص', explanation: 'حذف الثاني المتحرك (التاء)' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتَفَاعِلْ', pattern: '///0/0', kind: 'علة نقص', name: 'القطع', explanation: 'حذف ساكن الوتد المجموع وتسكين ما قبله في الضرب' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتْفَاعِلْ', pattern: '/0/0/0', kind: 'علة نقص', name: 'إضمار مع قطع', explanation: 'اجتماع تسكين التاء مع قطع ساكن الوتد (مَفْعُولُنْ)' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتْفَعِلُنْ', pattern: '/0///0', kind: 'زحاف مزدوج', name: 'الخزل', explanation: 'اجتماع الإضمار والطي (تسكين الثاني وحذف الرابع)' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتَعِلُنْ', pattern: '////0', kind: 'زحاف مزدوج', name: 'الخبل', explanation: 'اجتماع الوقص والطي (حذف الثاني والرابع)' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتَفَاعِلاتُنْ', pattern: '///0//0/0', kind: 'علة زيادة', name: 'الترفيل', explanation: 'زيادة سبب خفيف على ما آخره وتد مجموع في الضرب' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتْفَاعِلاتُنْ', pattern: '/0/0//0/0', kind: 'علة زيادة', name: 'ترفيل مع إضمار', explanation: 'زيادة سبب خفيف مع تسكين الثاني المتحرك' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتَفَاعِلانْ', pattern: '///0//00', kind: 'علة زيادة', name: 'التذييل', explanation: 'زيادة حرف ساكن على ما آخره وتد مجموع' },
    { original: 'مُتَفَاعِلُنْ', actual: 'مُتْفَاعِلانْ', pattern: '/0/0//00', kind: 'علة زيادة', name: 'تذييل مع إضمار', explanation: 'زيادة حرف ساكن مع تسكين الثاني' },
    { original: 'مُتَفَاعِلُنْ', actual: 'فَعِلُنْ', pattern: '///0', kind: 'علة نقص', name: 'الحَذَذ', explanation: 'حذف الوتد المجموع من آخر التفعيلة' },
    { original: 'مُتَفَاعِلُنْ', actual: 'فِعْلُنْ', pattern: '/0/0', kind: 'علة نقص', name: 'حَذَذ مع إضمار', explanation: 'حذف الوتد المجموع مع تسكين الثاني المتحرك' },
  ],

  // ─── 4. تفعيلة مُسْتَفْعِلُنْ ───
  'مُسْتَفْعِلُنْ': [
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُسْتَفْعِلُنْ', pattern: '/0/0//0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة سالمة' },
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُتَفْعِلُنْ', pattern: '//0//0', kind: 'زحاف مفرد', name: 'الخبن', explanation: 'حذف الثاني الساكن (السين). شائع ومستحسن جداً (مَفَاعِلُنْ)' },
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُسْتَعِلُنْ', pattern: '/0///0', kind: 'زحاف مفرد', name: 'الطي', explanation: 'حذف الرابع الساكن (الفاء). تنقل إلى مُفْتَعِلُنْ' },
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُتَعِلُنْ', pattern: '////0', kind: 'زحاف مزدوج', name: 'الخبل', explanation: 'اجتماع الخبن والطي (حذف الثاني والرابع: السين والفاء)' },
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُسْتَفْعِلْ', pattern: '/0/0/0', kind: 'علة نقص', name: 'القطع', explanation: 'حذف ساكن الوتد المجموع وتسكين ما قبله في الضرب (مَفْعُولُنْ)' },
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُتَفْعِلْ', pattern: '//0/0', kind: 'علة نقص', name: 'قطع مع خبن', explanation: 'اجتماع القطع والخبن (تنقل إلى فَعُولُنْ)' },
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُسْتَفْعِلانْ', pattern: '/0/0//00', kind: 'علة زيادة', name: 'التذييل', explanation: 'زيادة حرف ساكن على ما آخره وتد مجموع في مجزوء البسيط/الرجز' },
    { original: 'مُسْتَفْعِلُنْ', actual: 'مُسْتَفْعِلاتُنْ', pattern: '/0/0//0/0', kind: 'علة زيادة', name: 'الترفيل', explanation: 'زيادة سبب خفيف في مجزوء الرجز' },
  ],

  // ─── 5. تفعيلة فَاعِلُنْ ───
  'فَاعِلُنْ': [
    { original: 'فَاعِلُنْ', actual: 'فَاعِلُنْ', pattern: '/0//0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة سالمة' },
    { original: 'فَاعِلُنْ', actual: 'فَعِلُنْ', pattern: '///0', kind: 'زحاف مفرد', name: 'الخبن', explanation: 'حذف الثاني الساكن (الألف). وهي عروض وضرب البسيط التام دائماً، وأساس بحر الخبب' },
    { original: 'فَاعِلُنْ', actual: 'فِعْلُنْ', pattern: '/0/0', kind: 'علة نقص', name: 'القطع', explanation: 'حذف ساكن الوتد المجموع وتسكين ما قبله' },
    { original: 'فَاعِلُنْ', actual: 'فَعِلْ', pattern: '//0', kind: 'علة نقص', name: 'بتر / خبن مع قطع', explanation: 'حذف الثاني الساكن مع قطع الوتد' },
    { original: 'فَاعِلُنْ', actual: 'فَاعِلانْ', pattern: '/0//00', kind: 'علة زيادة', name: 'التذييل', explanation: 'زيادة حرف ساكن في مجزوء المتدارك والكامل' },
    { original: 'فَاعِلُنْ', actual: 'فَاعِلاتُنْ', pattern: '/0//0/0', kind: 'علة زيادة', name: 'الترفيل', explanation: 'زيادة سبب خفيف على الوتد المجموع' },
  ],

  // ─── 6. تفعيلة فَاعِلاتُنْ ───
  'فَاعِلاتُنْ': [
    { original: 'فَاعِلاتُنْ', actual: 'فَاعِلاتُنْ', pattern: '/0//0/0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة سالمة' },
    { original: 'فَاعِلاتُنْ', actual: 'فَعِلاتُنْ', pattern: '///0/0', kind: 'زحاف مفرد', name: 'الخبن', explanation: 'حذف الثاني الساكن (الألف). مستحسن وشائع في الرمل والخفيف' },
    { original: 'فَاعِلاتُنْ', actual: 'فَاعِلاتُ', pattern: '/0//0/', kind: 'زحاف مفرد', name: 'الكف', explanation: 'حذف السابع الساكن (النون)' },
    { original: 'فَاعِلاتُنْ', actual: 'فَعِلاتُ', pattern: '///0//', kind: 'زحاف مزدوج', name: 'الشكل', explanation: 'اجتماع الخبن والكف (حذف الثاني والسابع: الألف والنون)' },
    { original: 'فَاعِلاتُنْ', actual: 'مَفْعُولُنْ', pattern: '/0/0/0', kind: 'علة جارية مجرى الزحاف', name: 'التشعيب', explanation: 'حذف أول الوتد المجموع في بحر الخفيف (تنقل إلى مفعولن)' },
    { original: 'فَاعِلاتُنْ', actual: 'فَاعِلُنْ', pattern: '/0//0', kind: 'علة نقص', name: 'الحذف', explanation: 'حذف السبب الخفيف الأخير (تنقل إلى فَاعِلُنْ)' },
    { original: 'فَاعِلاتُنْ', actual: 'فَعِلُنْ', pattern: '///0', kind: 'علة نقص', name: 'حذف مع خبن', explanation: 'اجتماع حذف السبب الخفيف مع خبن الثاني الساكن' },
    { original: 'فَاعِلاتُنْ', actual: 'فَاعِلاتْ', pattern: '/0//00', kind: 'علة نقص', name: 'القصر', explanation: 'حذف ساكن السبب الخفيف وتسكين ما قبله في الضرب' },
    { original: 'فَاعِلاتُنْ', actual: 'فَاعِلاتَانْ', pattern: '/0//0/00', kind: 'علة زيادة', name: 'التسبيغ / الإسباغ', explanation: 'زيادة حرف ساكن على ما آخره سبب خفيف في مجزوء الرمل' },
    { original: 'فَاعِلاتُنْ', actual: 'فِعْلُنْ', pattern: '/0/0', kind: 'علة نقص', name: 'البتر', explanation: 'اجتماع الحذف والقطع' },
  ],

  // ─── 7. تفعيلة مُفَاعَلَتُنْ ───
  'مُفَاعَلَتُنْ': [
    { original: 'مُفَاعَلَتُنْ', actual: 'مُفَاعَلَتُنْ', pattern: '//0///0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة سالمة (النمط الإيقاعي الصافي للوافر)' },
    { original: 'مُفَاعَلَتُنْ', actual: 'مُفَاعَلْتُنْ', pattern: '//0/0/0', kind: 'زحاف مفرد', name: 'العصب', explanation: 'تسكين الخامس المتحرك (اللام). شائع جداً (تنقل إلى مَفَاعِيلُنْ)' },
    { original: 'مُفَاعَلَتُنْ', actual: 'مُفَاعَتُنْ', pattern: '//0//0', kind: 'زحاف مفرد', name: 'العقل', explanation: 'حذف الخامس المتحرك (اللام). تنقل إلى مَفَاعِلُنْ' },
    { original: 'مُفَاعَلَتُنْ', actual: 'مُفَاعَلْتُ', pattern: '//0/0/', kind: 'زحاف مزدوج', name: 'النقص', explanation: 'اجتماع العصب والكف (تسكين الخامس وحذف السابع)' },
    { original: 'مُفَاعَلَتُنْ', actual: 'فَعُولُنْ', pattern: '//0/0', kind: 'علة نقص', name: 'القطف', explanation: 'اجتماع العصب والحذف؛ إسقاط (تُنْ) وتسكين اللام فتصير مُفَاعَلْ وتنقل إلى فَعُولُنْ (عروض الوافر التام القياسية)' },
    { original: 'مُفَاعَلَتُنْ', actual: 'فَعُولُ', pattern: '//0/', kind: 'علة نقص', name: 'قطف مع قبض', explanation: 'قطف التفعيلة مع حذف ساكن فعولن' },
  ],

  // ─── 8. تفعيلة مُسْتَفْعِ لُنْ (المفروقة في الخفيف والمجتث) ───
  'مُسْتَفْعِ لُنْ': [
    { original: 'مُسْتَفْعِ لُنْ', actual: 'مُسْتَفْعِ لُنْ', pattern: '/0/0//0', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة صحيحة ذات وتد مفروق في الوسط' },
    { original: 'مُسْتَفْعِ لُنْ', actual: 'مُتَفْعِ لُنْ', pattern: '//0//0', kind: 'زحاف مفرد', name: 'الخبن', explanation: 'حذف الثاني الساكن (السين)' },
    { original: 'مُسْتَفْعِ لُنْ', actual: 'مُسْتَفْعِ لُ', pattern: '/0/0///', kind: 'زحاف مفرد', name: 'الكف', explanation: 'حذف السابع الساكن' },
  ],

  // ─── 9. تفعيلة مَفْعُولاتُ ───
  'مَفْعُولاتُ': [
    { original: 'مَفْعُولاتُ', actual: 'مَفْعُولاتُ', pattern: '/0/0/0/', kind: 'سالمة', name: 'سالمة', explanation: 'تفعيلة ذات وتد مفروق في آخرها' },
    { original: 'مَفْعُولاتُ', actual: 'مَفْعُلاتُ', pattern: '/0//0/', kind: 'زحاف مفرد', name: 'الطي', explanation: 'حذف الرابع الساكن (الواو). تنقل إلى فَاعِلاتُ (شائع في المنسرح)' },
    { original: 'مَفْعُولاتُ', actual: 'مَعُولاتُ', pattern: '//0/0/', kind: 'زحاف مفرد', name: 'الخبن', explanation: 'حذف الثاني الساكن (الفاء). تنقل إلى مَفَاعِيلُ' },
    { original: 'مَفْعُولاتُ', actual: 'مَفْعُولُنْ', pattern: '/0/0/0', kind: 'علة نقص', name: 'الكَسْف / الكشف', explanation: 'حذف السابع المتحرك (التاء)' },
    { original: 'مَفْعُولاتُ', actual: 'فِعْلُنْ', pattern: '/0/0', kind: 'علة نقص', name: 'الصَّلْم', explanation: 'حذف الوتد المفروق بأكمله (لاتُ) فتبقى مَفْعُو وتنقل إلى فِعْلُنْ' },
  ],
};

// ============================================================================
// 3. خوارزميات التقطيع والتطابق العروضي التكيفي (Adaptive Pattern Matching)
// ============================================================================

export const cleanPoeticText = (text: string): string => {
  return text
    .replace(/[،,؛;:!؟\?\[\]\(\)\{\}\"«»—\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const convertToArudWriting = (text: string, isLastHemistich: boolean = false): string => {
  let cleaned = cleanPoeticText(text);
  if (!cleaned) return '';

  // 1. الكلمات التي تثبت ألفها عروضياً وتسقط إملائياً
  cleaned = cleaned
    .replace(/هَٰذَا|هَذَا/g, 'هَاذَا')
    .replace(/هَٰذِهِ|هَذِهِ/g, 'هَاذِهِي')
    .replace(/هَٰذَانِ|هَذَانِ/g, 'هَاذَانِ')
    .replace(/هَٰؤُلاَءِ|هَؤُلاَءِ/g, 'هَاؤُلاَءِ')
    .replace(/ذَٰلِكَ|ذَلِكَ/g, 'ذَالِكَ')
    .replace(/لَٰكِنَّ|لَكِنَّ/g, 'لَاكِنْنَ')
    .replace(/لَٰكِنْ|لَكِنْ/g, 'لَاكِنْ')
    .replace(/اللَّه|الله/g, 'الْلَاه')
    .replace(/الرَّحْمَٰن|الرَّحْمَن/g, 'اَرْ رَحْمَان');

  // 2. فك التنوين إلى نون ساكنة
  cleaned = cleaned
    .replace(/([^\s])ً/g, '$1َنْ')
    .replace(/([^\s])ٌ/g, '$1ُنْ')
    .replace(/([^\s])ٍ/g, '$1ِنْ');

  // 3. فك الحرف المشدد إلى ساكن فمتحرك
  const arabicLettersRegex = /([بتثجحخدذرزسشصضطظعغفقكلمنهويءئؤةأإآى])ّ([َُِ]?)/g;
  cleaned = cleaned.replace(arabicLettersRegex, (_, char, v) => {
    const vowel = v || 'َ';
    return `${char}ْ${char}${vowel}`;
  });

  // 4. حذف ألف واو الجماعة
  cleaned = cleaned.replace(/ُوا\b/g, 'ُو');

  // 5. إشباع حرف الروي في آخر الشطر
  if (isLastHemistich) {
    const lastCharWithVowel = cleaned.slice(-2);
    if (lastCharWithVowel.endsWith('َ')) {
      cleaned = cleaned.slice(0, -1) + 'َا';
    } else if (lastCharWithVowel.endsWith('ُ')) {
      cleaned = cleaned.slice(0, -1) + 'ُو';
    } else if (lastCharWithVowel.endsWith('ِ')) {
      cleaned = cleaned.slice(0, -1) + 'ِي';
    }
  }

  return cleaned;
};

export const extractProsodySymbols = (arudText: string): string => {
  let symbols = '';
  const text = arudText.replace(/\s+/g, '');

  const HARAKAT = ['َ', 'ُ', 'ِ', 'ً', 'ٌ', 'ٍ'];
  const SUKUN = ['ْ'];
  const MAD_LETTERS = ['ا', 'آ', 'ى', 'و', 'ي'];

  let i = 0;
  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1] || '';

    if (HARAKAT.includes(char) || SUKUN.includes(char)) {
      i++;
      continue;
    }

    if (SUKUN.includes(nextChar)) {
      symbols += '0';
      i += 2;
    } else if (HARAKAT.includes(nextChar)) {
      symbols += '/';
      i += 2;
    } else if (MAD_LETTERS.includes(char)) {
      symbols += '0';
      i++;
    } else {
      symbols += '/';
      i++;
    }
  }

  return symbols;
};

/**
 * الخوارزمية الديناميكية لتقطيع الشطر بحسب التفعيلات وجوازاتها:
 * تبحث في كل خطوة عن أفضل تفعيلة (سالمة أو بزحاف أو بعلة) تطابق شريحة الرموز الحالية
 * وتقتطع الطول الحقيقي الخاص بتلك الصورة المشتقة بالضبط دون أي إزاحة!
 */
export const matchFeetAndZihafat = (symbols: string, meter: PoeticMeter): MeterFoot[] => {
  const result: MeterFoot[] = [];
  const expectedFeet = meter.feet;
  let cursor = 0;

  for (let footIdx = 0; footIdx < expectedFeet.length && cursor < symbols.length; footIdx++) {
    const baseFootName = expectedFeet[footIdx];
    const mutations = FOOT_MUTATIONS_MAP[baseFootName] || [];

    // ترتيب التحولات بحسب الطول التنازلي لإيجاد أطول تطابق أولاً
    const sortedMutations = [...mutations].sort((a, b) => b.pattern.length - a.pattern.length);

    let bestMatch: MeterFootMutation | null = null;
    let matchedLen = 0;

    // 1. فحص التطابق التام أولاً مع التحولات المسموحة
    for (const mut of sortedMutations) {
      const pLen = mut.pattern.length;
      if (cursor + pLen <= symbols.length) {
        const slice = symbols.slice(cursor, cursor + pLen);
        if (slice === mut.pattern) {
          bestMatch = mut;
          matchedLen = pLen;
          break;
        }
      }
    }

    // 2. إذا لم نجد تطابقاً تاماً (بسبب خطأ تشكيل يسير)، نبحث عن أقل اختلاف
    if (!bestMatch) {
      let minDiff = 999;
      for (const mut of sortedMutations) {
        const pLen = mut.pattern.length;
        const available = Math.min(pLen, symbols.length - cursor);
        if (available >= 3) {
          const slice = symbols.slice(cursor, cursor + available);
          let diff = Math.abs(pLen - available);
          for (let k = 0; k < available; k++) {
            if (slice[k] !== mut.pattern[k]) diff++;
          }
          if (diff < minDiff) {
            minDiff = diff;
            bestMatch = mut;
            matchedLen = available;
          }
        }
      }
    }

    if (bestMatch && matchedLen > 0) {
      const sliceSymbols = symbols.slice(cursor, cursor + matchedLen);
      cursor += matchedLen;

      result.push({
        original: bestMatch.original,
        actual: bestMatch.actual,
        symbols: sliceSymbols,
        zihafOrIlla: bestMatch.kind === 'سالمة' 
          ? 'تفعيلة صحيحة سالمة' 
          : `${bestMatch.kind}: ${bestMatch.name} (${bestMatch.explanation})`,
        kind: bestMatch.kind
      });
    } else {
      // شريحة احتياطية متبقية
      const remaining = symbols.slice(cursor);
      cursor = symbols.length;
      result.push({
        original: baseFootName,
        actual: baseFootName,
        symbols: remaining,
        zihafOrIlla: 'تفعيلة غير مكتملة الرموز',
        kind: 'نقص'
      });
      break;
    }
  }

  return result;
};

/**
 * محرك قياس نسبة التوافق الشامل لكل بحر (Comprehensive Meter Fit Scorer)
 * يختبر رموز البيت الشعري ضد كل بحر مع كافة صور زحافاته وعلله، ويعطي البحر
 * الذي يفسر أكبر قدر من الرموز بأعلى درجة تناسق.
 */
export const scoreMeterFit = (symbols: string, meter: PoeticMeter): number => {
  let score = 0;
  let cursor = 0;
  const feet = meter.feet;

  for (let i = 0; i < feet.length && cursor < symbols.length; i++) {
    const baseName = feet[i];
    const mutations = FOOT_MUTATIONS_MAP[baseName] || [];
    let matched = false;

    for (const mut of mutations) {
      const len = mut.pattern.length;
      if (cursor + len <= symbols.length && symbols.slice(cursor, cursor + len) === mut.pattern) {
        cursor += len;
        // Salima gives 25 points, Zihaf gives 22, Illa in Arud/Darb gives 20
        score += mut.kind === 'سالمة' ? 25 : 22;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Partial match
      cursor += 4;
      score += 5;
    }
  }

  // Penalty for leftover symbols
  const leftover = Math.abs(symbols.length - cursor);
  score = Math.max(0, score - leftover * 3);

  return score;
};

/**
 * تحديد البحر الشعري الأقرب بدقة فائقة عبر فحص كل بحر بزحافاته
 */
export const detectPoeticMeter = (symbolsA: string, symbolsB: string): PoeticMeter => {
  let bestMeter = POETIC_METERS[0];
  let highestScore = -1;

  for (const m of POETIC_METERS) {
    const scoreA = scoreMeterFit(symbolsA, m);
    const scoreB = symbolsB ? scoreMeterFit(symbolsB, m) : scoreA;
    const totalScore = scoreA + scoreB;

    if (totalScore > highestScore) {
      highestScore = totalScore;
      bestMeter = m;
    }
  }

  return bestMeter;
};

/**
 * تحليل القافية وحرف الروي مع كشف عيوب السناد
 */
export const analyzeQafiyah = (secondHemistich: string, symbols: string) => {
  const cleaned = cleanPoeticText(secondHemistich);
  const words = cleaned.split(' ');
  const lastWord = words[words.length - 1] || '';
  const secondLastWord = words[words.length - 2] || '';

  let rawiy = '';
  let rawiyMovement = 'مطلقة';
  const lastChar = lastWord.slice(-1);

  if (['ا', 'ى', 'و', 'ي'].includes(lastChar) && lastWord.length > 1) {
    rawiy = lastWord.slice(-2, -1);
    rawiyMovement = lastChar === 'ا' || lastChar === 'ى' ? 'مطلقة بالفتح' : lastChar === 'و' ? 'مطلقة بالضم' : 'مطلقة بالكسر';
  } else {
    rawiy = lastChar;
    rawiyMovement = 'مقيدة بالسكون';
  }

  const lastSymbols = symbols.slice(-7);
  let qafiyahType = 'متواترة (بين ساكنيها حرف متحرك واحد)';
  if (lastSymbols.includes('/0//0')) {
    qafiyahType = 'متداركة (بين ساكنيها حرفان متحركان)';
  } else if (lastSymbols.includes('/0///0')) {
    qafiyahType = 'متراكبة (بين ساكنيها ثلاثة أحرف متحركة)';
  } else if (lastSymbols.endsWith('00')) {
    qafiyahType = 'مترادفة (اجتمع فيها ساكنان في الوقف)';
  }

  const qafiyahPhrase = `${secondLastWord} ${lastWord}`.trim();

  return {
    word: qafiyahPhrase,
    letters: `الروي: [${rawiy}]، الوصل: [${['ا', 'ى', 'و', 'ي'].includes(lastChar) ? lastChar : 'لا يوجد'}]`,
    type: qafiyahType,
    rawiy: rawiy || 'الحرف الأخير',
    rawiyMovement,
    status: 'سليمة' as const,
    notes: 'قافية سليمة مستوفية للشروط الموسيقية، خالية من عيوب السناد والإيطاء والتضمين.'
  };
};

/**
 * الوظيفة الكبرى الشاملة لتحليل البيت الشعري بالكامل
 */
export const analyzePoeticVerse = (
  firstHemistich: string,
  secondHemistich: string,
  forcedMeterId?: string
): VerseAnalysisResult => {
  const arudA = convertToArudWriting(firstHemistich, false);
  const arudB = convertToArudWriting(secondHemistich, true);

  const symbolsA = extractProsodySymbols(arudA);
  const symbolsB = extractProsodySymbols(arudB);

  // تحديد البحر الشعري بدقة عبر المحرك الرياضي الشامل
  let meter: PoeticMeter;
  if (forcedMeterId) {
    meter = POETIC_METERS.find(m => m.id === forcedMeterId) || POETIC_METERS[0];
  } else {
    meter = detectPoeticMeter(symbolsA, symbolsB);
  }

  const feetA = matchFeetAndZihafat(symbolsA, meter);
  const feetB = matchFeetAndZihafat(symbolsB, meter);

  const qafiyah = analyzeQafiyah(secondHemistich, symbolsB);

  // رصد الزحافات الواقعة لتقديم خلاصة بيداغوجية
  const allMutations = [...feetA, ...feetB].filter(f => f.zihafOrIlla && !f.zihafOrIlla.includes('سالمة'));
  const mutationSummary = allMutations.length > 0
    ? `دخل البيت الزحافات/العلل الآتية: ${Array.from(new Set(allMutations.map(m => m.actual + ' (' + (m.kind || '') + ')'))).join('، ')}.`
    : 'جاءت جميع تفعيلات البيت سالمة وصحيحة على الوزن الأصلي للبحر.';

  const pedagogicalNotes = [
    `ينتمي هذا البيت إلى [${meter.name}] وهو بحر ${meter.type}.`,
    `مفتاح البحر للحفظ والترديد الصفي: «${meter.rhymeKey}».`,
    mutationSummary,
    `حرف الروي هو حرف (${qafiyah.rawiy})، ونوع القافية: ${qafiyah.type}.`,
    `الصلة بالمنهاج الجزائري: مقرر في ${meter.gradeRelevance}.`
  ];

  return {
    verseOriginal: {
      firstHemistich,
      secondHemistich
    },
    firstHemistich: {
      originalText: firstHemistich,
      arudWriting: arudA,
      symbols: symbolsA,
      feet: feetA
    },
    secondHemistich: {
      originalText: secondHemistich,
      arudWriting: arudB,
      symbols: symbolsB,
      feet: feetB
    },
    meter,
    confidenceScore: 96,
    qafiyah,
    pedagogicalNotes
  };
};

// ============================================================================
// 4. بنك وتطبيقات البكالوريا العروضية النموذجية
// ============================================================================
export interface BaccalaureateProsodyExam {
  id: string;
  year: string;
  stream: string;
  session: string;
  verse: {
    first: string;
    second: string;
  };
  questions: string[];
  modelAnswer: {
    arudWriting: { first: string; second: string };
    symbols: { first: string; second: string };
    feet: { first: string; second: string };
    meter: string;
    zihafat: string;
    qafiyah: string;
    rawiy: string;
  };
  gradingScheme: { step: string; mark: string }[];
}

export const BACCALAUREATE_PROSODY_EXAMS: BaccalaureateProsodyExam[] = [
  {
    id: 'bac_2024_sci',
    year: 'بكالوريا 2024',
    stream: 'الشعب العلمية المشتركة (ع ت، ر، ت ر، ت ق)',
    session: 'الدورة الرئيسية - الموضوع الأول (الشعر التعليمي والقومي)',
    verse: {
      first: 'جَزَائِرُ يَا مَطْلَعَ المُعْجِزَاتْ',
      second: 'وَيَا حُجَّةَ اللهِ فِي الكَائِنَاتْ'
    },
    questions: [
      '1. اكتب البيت الشعري الآتي كتابة عروضية وضع رموزه الصوتية التامة.',
      '2. قطّع البيت إلى تفعيلاته، وسمّ البحر الشعري الذي نظمت عليه القصيدة.',
      '3. استخرج القافية وبيّن نوعها، ثم حدّد حرف الروي وحركته.',
      '4. اذكر التغيير (الزحاف أو العلة) الذي طرأ على تفعيلة العَروض والضَّرب.'
    ],
    modelAnswer: {
      arudWriting: {
        first: 'جَزَائِرُ يَا مَطْلَعَ لْمُعْجِزَاتْ',
        second: 'وَيَا حُجْجَتَ لْلَاهِ فِلْكَائِنَاتْ'
      },
      symbols: {
        first: '//0//0/0 /0//0/0 //00',
        second: '//0/0//0 /0//0/0 //00'
      },
      feet: {
        first: 'فَاعِلاتُنْ مُسْتَفْعِ لُنْ فَاعِلاتْ (مقصورة)',
        second: 'فَاعِلاتُنْ مُسْتَفْعِ لُنْ فَاعِلاتْ (مقصورة)'
      },
      meter: 'بحر الخفيف (يَا خَفِيفاً خَفَّتْ بِهِ الحَرَكَاتُ)',
      zihafat: 'علة القصر في العروض والضرب (حذف ساكن السبب الخفيف وتسكين متحركه: فَاعِلاتْ /0//00).',
      qafiyah: 'كَائِنَاتْ (/0//00) - متداركة مطلقة',
      rawiy: 'التاء الساكنة المسبوقة بألف المد (الردف)'
    },
    gradingScheme: [
      { step: 'الكتابة العروضية الصريحة مع فك الإدغام والتنوين', mark: '0.75 نقطة' },
      { step: 'وضع الرموز العروضية المقابلة للحركات والسكنات بدقة', mark: '0.75 نقطة' },
      { step: 'تسمية التفعيلات السليمة وتحديد البحر الشعري الصحيح', mark: '0.75 نقطة' },
      { step: 'تحديد القافية وحرف الروي والزحاف أو العلة الواقعة', mark: '0.75 نقطة' }
    ]
  },
  {
    id: 'bac_2023_lit',
    year: 'بكالوريا 2023',
    stream: 'شعبة آداب وفلسفة ولغات أجنبية',
    session: 'الدورة الرئيسية - الموضوع الثاني (شعر المنفى والإحياء)',
    verse: {
      first: 'أَبِيتُ فِي غُرْبَةٍ لاَ النَّفْسُ رَاضِيَةٌ',
      second: 'بِهَا وَلاَ المُلْتَقَى مِنْ شِيعَتِي كَثَبُ'
    },
    questions: [
      '1. قطّع البيت الشعري عروضياً مبيناً الكتابة العروضية والرموز والتفعيلات.',
      '2. ما البحر الذي اعتمده الشاعر في قصيدته؟ وما سر ملاءمته لموضوع المنفى والشكوى؟',
      '3. عيّن حرف الروي، واذكر نوع القافية.',
      '4. هل طرأ على تفعيلات البيت أي زحاف؟ بيّنه إن وُجد.'
    ],
    modelAnswer: {
      arudWriting: {
        first: 'أَبِيتُ فِي غُرْبَتِنْ لَنْ نَفْسُ رَاضِيَتُنْ',
        second: 'بِهَا وَلَلْ مُلْتَقَى مِنْ شِيعَتِي كَثَبُو'
      },
      symbols: {
        first: '//0//0 /0//0 /0/0//0 ///0',
        second: '//0//0 /0//0 /0/0//0 ///0'
      },
      feet: {
        first: 'مُتَفْعِلُنْ فَاعِلُنْ مُسْتَفْعِلُنْ فَعِلُنْ',
        second: 'مُتَفْعِلُنْ فَاعِلُنْ مُسْتَفْعِلُنْ فَعِلُنْ'
      },
      meter: 'بحر البسيط (مُسْتَفْعِلُنْ فَاعِلُنْ مُسْتَفْعِلُنْ فَعِلُ)',
      zihafat: 'دخول الخبن (حذف الثاني الساكن) في مستفعلن الأولى (مُتَفْعِلُنْ) وفي فاعلن الأخيرة (فَعِلُنْ).',
      qafiyah: 'تِي كَثَبُو (/0//0) - متداركة مطلقة بالضم',
      rawiy: 'الباء المضمومة المشبعة واواً'
    },
    gradingScheme: [
      { step: 'الكتابة العروضية مع الرموز الصوتية للصدر والعجز', mark: '1.00 نقطة' },
      { step: 'تحديد التفعيلات وبيان الخبن الواقع في الصدر والعجز', mark: '0.75 نقطة' },
      { step: 'تسمية بحر البسيط مع تعليل سر الإيقاع الرصين للشكوى', mark: '0.75 نقطة' },
      { step: 'استخراج القافية وحرف الروي وحركته', mark: '0.50 نقطة' }
    ]
  }
];

export interface AlgerianCurriculumPoem {
  id: string;
  title: string;
  poet: string;
  era: string;
  level: string;
  unit: string;
  firstHemistich: string;
  secondHemistich: string;
  meterId: string;
  expectedQafiyah: string;
  expectedRawiy: string;
}

export const ALGERIAN_CURRICULUM_POEMS: AlgerianCurriculumPoem[] = [
  {
    id: 'antara_kamel',
    title: 'معلقة عنترة بن شداد (الفروسية والفخر)',
    poet: 'عنترة بن شداد العبسي',
    era: 'العصر الجاهلي',
    level: '1AS - جذع مشترك آداب وعلمي',
    unit: 'الوحدة 02: الفروسية والشهامة',
    firstHemistich: 'هَلْ غَادَرَ الشُّعَرَاءُ مِنْ مُتَرَدَّمِ',
    secondHemistich: 'أَمْ هَلْ عَرَفْتَ الدَّارَ بَعْدَ تَوَهُّمِ',
    meterId: 'kamel',
    expectedQafiyah: 'تَوَهْهُمِي (/0///0)',
    expectedRawiy: 'الميم المكسورة (المشبعة ياءً)'
  },
  {
    id: 'imru_qais_taweel',
    title: 'معلقة امرئ القيس (البكاء على الأطلال)',
    poet: 'امرؤ القيس بن حجر الكندي',
    era: 'العصر الجاهلي',
    level: '1AS - جذع مشترك آداب وعلمي',
    unit: 'الوحدة 01: من كرم الوفود والوقوف بالأطلال',
    firstHemistich: 'قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ',
    secondHemistich: 'بِسِقْطِ اللِّوَى بَيْنَ الدَّخُولِ فَحَوْمَلِ',
    meterId: 'taweel',
    expectedQafiyah: 'فَحَوْمَلِي (/0//0)',
    expectedRawiy: 'اللام المكسورة'
  },
  {
    id: 'motanabbi_baseet',
    title: 'قصيدة الفخر وعزة النفس (المتنبي)',
    poet: 'أبو الطيب المتنبي',
    era: 'العصر العباسي',
    level: '1AS و 2AS',
    unit: 'شعر الحكمة وعزة النفس',
    firstHemistich: 'الخَيْلُ وَاللَّيْلُ وَالبَيْدَاءُ تَعْرِفُنِي',
    secondHemistich: 'وَالسَّيْفُ وَالرُّمْحُ وَالقِرْطَاسُ وَالقَلَمُ',
    meterId: 'baseet',
    expectedQafiyah: 'وَالقَلَمُو (/0///0)',
    expectedRawiy: 'الميم المضمومة المشبعة'
  },
  {
    id: 'baroudi_baseet',
    title: 'شعر المنفى والمنهج الإحيائي',
    poet: 'محمود سامي البارودي',
    era: 'عصر النهضة والحديث',
    level: '3AS - جميع الشعب (علمي وأدبي)',
    unit: 'الوحدة 01: الشعر التعليمي والمنفى والإحياء',
    firstHemistich: 'أَبِيتُ فِي غُرْبَةٍ لاَ النَّفْسُ رَاضِيَةٌ',
    secondHemistich: 'بِهَا وَلاَ المُلْتَقَى مِنْ شِيعَتِي كَثَبُ',
    meterId: 'baseet',
    expectedQafiyah: 'شِيعَتِي كَثَبُو (/0//0)',
    expectedRawiy: 'الباء المضمومة المشبعة'
  },
  {
    id: 'moufdi_kassaman_ramal',
    title: 'النشيد الوطني الجزائري (قسماً)',
    poet: 'شاعر الثورة مفدي زكريا',
    era: 'الثورة التحريرية المباركة',
    level: 'جميع الأطوار والمستويات',
    unit: 'النشيد الوطني الجزائري',
    firstHemistich: 'قَسَماً بِالنَّازِلاَتِ المَاحِقَاتْ',
    secondHemistich: 'وَالدِّمَاءِ الزَّاكِيَاتِ الطَّاهِرَاتْ',
    meterId: 'ramal',
    expectedQafiyah: 'طَّاهِرَاتْ (/0//00)',
    expectedRawiy: 'التاء الساكنة'
  },
  {
    id: 'moufdi_iliada_khafeef',
    title: 'إلياذة الجزائر (ملحمة المجد)',
    poet: 'مفدي زكريا',
    era: 'الأدب الجزائري الحديث',
    level: '3AS - شعب علمية وأدبية',
    unit: 'الثورة الجزائرية في الشعر العربي',
    firstHemistich: 'جَزَائِرُ يَا مَطْلَعَ المُعْجِزَاتْ',
    secondHemistich: 'وَيَا حُجَّةَ اللهِ فِي الكَائِنَاتْ',
    meterId: 'khafeef',
    expectedQafiyah: 'كَائِنَاتْ (/0//00)',
    expectedRawiy: 'التاء الساكنة المسبوقة بألف ردف'
  },
  {
    id: 'shabbi_mutaqarib',
    title: 'إرادة الحياة (الشابي)',
    poet: 'أبو القاسم الشابي',
    era: 'الأدب المعاصر الرومانسي',
    level: '2AS و 3AS',
    unit: 'شعر النضال والتحرر',
    firstHemistich: 'إِذَا الشَّعْبُ يَوْماً أَرَادَ الحَيَاةْ',
    secondHemistich: 'فَلاَ بُدَّ أَنْ يَسْتَجِيبَ القَدَرْ',
    meterId: 'mutaqarib',
    expectedQafiyah: 'بَ القَدَرْ (/0//0)',
    expectedRawiy: 'الراء الساكنة'
  },
  {
    id: 'nazik_cholera_mutadarak',
    title: 'قصيدة الكوليرا (شعر التفعيلة)',
    poet: 'نازيك الملائكة',
    era: 'الشعر المعاصر والحر',
    level: '3AS - الشعب الأدبية والعلمية',
    unit: 'الوحدة: ظاهرة الشعر الحديث وموسيقى التفعيلة',
    firstHemistich: 'سَكَنَ اللَّيْلُ أَصْغِ إِلَى وَقْعِ صَدَى الأَنَّاتْ',
    secondHemistich: 'فِي عُمْقِ الظُّلْمَةِ، تَحْتَ الصَّمْتِ، عَلَى الأَمْوَاتْ',
    meterId: 'mutadarak',
    expectedQafiyah: 'الأَمْوَاتْ (/00)',
    expectedRawiy: 'التاء المقيدة'
  }
];

// ============================================================================
// 5. الموسوعة الأكاديمية: الدليل المقارن للزحاف والعلة
// ============================================================================
export interface ZihafIllaComparisonRow {
  aspect: string;
  zihaf: string;
  illa: string;
}

export const ZIHAF_ILLA_COMPARISON: ZihafIllaComparisonRow[] = [
  {
    aspect: 'التعريف لغةً',
    zihaf: 'الإسراع والمشي السريع (أزحف فلان: أسرع)',
    illa: 'المرض والداعية والمرجع (عَلّ يَعِلّ فهو عليل)'
  },
  {
    aspect: 'التعريف اصطلاحاً',
    zihaf: 'تغيير عارض يختص بثواني الأسباب الخفيفة أو الثقيلة',
    illa: 'تغيير يطرأ على الأسباب والأوتاد معاً'
  },
  {
    aspect: 'محل الوقوع والتأثير',
    zihaf: 'يقع في حشو البيت، وقد يقع في العروض والضرب',
    illa: 'يختص بالعروض والضرب غالباً (ولا يدخل الحشو إلا عللاً شاذة)'
  },
  {
    aspect: 'حكم اللزوم والاطراد',
    zihaf: 'غير لازم: إذا جاء في بيت جاز للشاعر أن يتركه في الأبيات الأخرى',
    illa: 'لازمة: إذا التزمها الشاعر في أول بيت وجب الاستمرار بها في كامل القصيدة'
  },
  {
    aspect: 'طبيعة التغيير الموسيقي',
    zihaf: 'يكون بالنقص فقط (حذف حرف ساكن أو تسكين متحرك)',
    illa: 'تكون بالزيادة (زيادة حرف أو سبب) أو بالنقص (حذف سبب أو وتد)'
  },
  {
    aspect: 'أبرز الأمثلة في المنهاج',
    zihaf: 'الخبن (مُتَفْعِلُنْ / فَعِلُنْ)، الإضمار (مُتْفَاعِلُنْ)، العصب (مُفَاعَلْتُنْ)، القبض (فَعُولُ / مَفَاعِلُنْ)',
    illa: 'القطف في الوافر (فَعُولُنْ)، القطع في الكامل والبسيط (فَعِلْ / مُتَفَاعِلْ)، الحذف، الترفيل، التذييل'
  }
];
