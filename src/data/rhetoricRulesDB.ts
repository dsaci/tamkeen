/**
 * ============================================================================
 * 📚 مستودع قواعد البلاغة العربية والمنهاج الجزائري (Rhetoric Rules & Knowledge Base)
 * «المختبر البلاغي الذكي - من تمكين»
 * متوافق مع المرجعية العامة للمناهج (علم البيان، علم البديع، علم المعاني)
 * ============================================================================
 */

export type RhetoricCategory = 'bayaan' | 'badi' | 'maani' | 'usloobi';

export type RhetoricLevel = 'elementary' | 'middle' | 'secondary' | 'academic';

export type RhetoricScope = 'all' | 'bayaan' | 'badi' | 'maani';

export type RhetoricDetail = 'concise' | 'detailed';

export interface RhetoricSpan {
  start: number;
  end: number;
  quote: string;
}

export interface RhetoricFinding {
  id: string;
  category: RhetoricCategory;
  categoryLabel: string;
  family: string;
  type: string;
  label: string;
  span: RhetoricSpan;
  explanation: string;
  evidence: string[];
  elements: Record<string, string>;
  effect: string;
  educationalNote?: string;
  alternatives?: Array<{
    label: string;
    reason: string;
  }>;
  confidence: {
    level: 'high' | 'medium' | 'low';
    reason: string;
  };
  status: 'certain' | 'probable' | 'ambiguous';
}

export interface RhetoricAnalysisResult {
  analysisId: string;
  timestamp: string;
  originalText: string;
  scope: RhetoricScope;
  level: RhetoricLevel;
  detail: RhetoricDetail;
  summary: {
    textTypeEstimate: string;
    totalFindings: number;
    bayaanCount: number;
    badiCount: number;
    maaniCount: number;
    usloobiCount: number;
    ambiguousCount: number;
  };
  findings: RhetoricFinding[];
  warnings: string[];
  pedagogicalAdvice: string[];
  engineUsed: 'hybrid_ai_verified' | 'local_rule_engine' | 'ai_deep_context';
}

/**
 * التصنيفات البلاغية الكبرى وفروعها وفق المنهاج
 */
export interface RhetoricConceptInfo {
  id: string;
  category: RhetoricCategory;
  name: string;
  definition: string;
  targetGrades: string;
  keyElements: string[];
  commonMistakes: string;
  typicalEffect: string;
}

export const RHETORIC_CONCEPTS_MAP: Record<string, RhetoricConceptInfo> = {
  // ─── علم البيان ───
  'tashbeeh': {
    id: 'tashbeeh',
    category: 'bayaan',
    name: 'التشبيه',
    definition: 'عقد مماثلة بين شيئين أو أكثر في صفة أو أكثر بأداة ملفوظة أو ملحوظة لغرض يقصده المتكلم.',
    targetGrades: 'السنة الأولى والثانية والثالثة ثانوي',
    keyElements: ['المشبه', 'المشبه به', 'أداة التشبيه', 'وجه الشبه'],
    commonMistakes: 'افتراض وجود تشبيه لمجرد وجود الكاف أو كأن دون اكتمال طرفي التشبيه أو في الجمل الوصفية البحتة.',
    typicalEffect: 'تقريب المعنى، توضيحه، وتجسيم أو تشخيص الفكرة في ذهن المتلقي.'
  },
  'istiara_makniya': {
    id: 'istiara_makniya',
    category: 'bayaan',
    name: 'الاستعارة المكنية',
    definition: 'تشبيه حُذف منه المشبه به (الركن الثاني) مع إبقاء لازم من لوازمه أو صفة من صفاته تسمى قرينة مانعة.',
    targetGrades: 'من الرابعة متوسط إلى الثالثة ثانوي (البكالوريا)',
    keyElements: ['المشبه (المستعار له)', 'المشبه به المحذوف (المستعار منه)', 'القرينة المانعة'],
    commonMistakes: 'الخلط بين المشبه والمشبه به أو تصنيف المجاز المرسل استعارة لعدم فحص علاقة المشابهة.',
    typicalEffect: 'التشخيص (إعطاء الجماد صفة الإنسانية) أو التجسيم (جعل المعنوي محسوساً ملموساً) وإثارة خيال القارئ.'
  },
  'istiara_tasrihiyya': {
    id: 'istiara_tasrihiyya',
    category: 'bayaan',
    name: 'الاستعارة التصريحية',
    definition: 'تشبيه صُرّح فيه بلفظ المشبه به وحُذف المشبه مع قرينة تدل على المعنى الأصلي.',
    targetGrades: 'من الرابعة متوسط إلى الثالثة ثانوي (البكالوريا)',
    keyElements: ['المشبه المحذوف', 'المشبه به المصرح به', 'القرينة'],
    commonMistakes: 'توهم أن الكلمة حقيقة وليست مجازاً، أو الخلط بينها وبين الكناية عن موصوف.',
    typicalEffect: 'إبراز المعنى في صورة جديدة مباغتة، وإبراز مدى التشابه الوجداني بين الطرفين.'
  },
  'majaz_mursal': {
    id: 'majaz_mursal',
    category: 'bayaan',
    name: 'المجاز المرسل',
    definition: 'كلمة استُعملت في غير معناها الأصلي لعلاقة غير المشابهة مع قرينة مانعة من إرادة المعنى الأصلي.',
    targetGrades: 'السنة الأولى والثانية والثالثة ثانوي',
    keyElements: ['اللفظ المذكور', 'المعنى المقصود', 'نوع العلاقة (جزئية، كلية، سببية، مسببية...)', 'القرينة'],
    commonMistakes: 'الخلط بين المجاز المرسل والاستعارة؛ الاستعارة علاقتها دائماً المشابهة بينما المجاز المرسل لا يقوم على المشابهة.',
    typicalEffect: 'الإيجاز، والمهارة في توجيه الذهن والانتقال الذكي من المسبب إلى السبب أو من الجزء إلى الكل.'
  },
  'majaz_aqli': {
    id: 'majaz_aqli',
    category: 'bayaan',
    name: 'المجاز العقلي',
    definition: 'إسناد الفعل أو ما في معناه إلى غير ما هو له في اعتقاد المتكلم لملابسة بينهما مع قرينة مانعة من الإسناد الحقيقي.',
    targetGrades: 'السنة الثانية والثالثة ثانوي',
    keyElements: ['الفعل أو الوصف المسند', 'المسند إليه الظاهر', 'الفاعل الحقيقي', 'علاقة الإسناد (زمانية، مكانية، سببية)'],
    commonMistakes: 'الخلط بين المجاز اللغوي في المفردات والمجاز العقلي الواقع في نسبة الجملة والإسناد.',
    typicalEffect: 'تكثيف العبارة وإعطاء الأمكنة والأزمنة حيوية فاعلة ومشاركة في الحدث.'
  },
  'kinayah': {
    id: 'kinayah',
    category: 'bayaan',
    name: 'الكناية',
    definition: 'لفظ أُطلق وأُريد به لازم معناه مع جواز إرادة المعنى الأصلي لعدم وجود قرينة مانعة.',
    targetGrades: 'التعليم المتوسط والثانوي',
    keyElements: ['المكنى عنه', 'المعنى الظاهر المباشر', 'المعنى الملازم المقصود', 'نوع الكناية (صفة، موصوف، نسبة)'],
    commonMistakes: 'اعتقاد وجود قرينة مانعة؛ الكناية لا تمنع صحة المعنى الحقيقي بل تنتقل منه إلى المعنى الملازم.',
    typicalEffect: 'الإتيان بالمعنى مصحوباً بالدليل عليه في إيجاز وتجسيم، والابتعاد عن الألفاظ الخادشة أو المباشرة الفجة.'
  },

  // ─── علم البديع ───
  'tibaaq': {
    id: 'tibaaq',
    category: 'badi',
    name: 'الطباق',
    definition: 'الجمع بين كلمتين متضادتين في المعنى، وهو إيجاب (بين كلمتين مثبتتين) وسلب (بين إثبات ونفي أو أمر ونهي).',
    targetGrades: 'جميع المستويات من الأولى متوسط إلى البكالوريا',
    keyElements: ['الكلمة الأولى', 'الكلمة الثانية', 'نوع الطباق (إيجاب / سلب)'],
    commonMistakes: 'اعتبار كل كلمتين مختلفتين طباقاً دون تحقق التضاد المعجمي أو السياقي الصريح.',
    typicalEffect: 'تقوية المعنى وتأكيده لأن "الضد يظهر حسنه الضدُّ"، وتوضيح الفروق في ذهن المتلقي.'
  },
  'muqabala': {
    id: 'muqabala',
    category: 'badi',
    name: 'المقابلة',
    definition: 'أن يؤتى بكلمتين أو أكثر ثم يؤتى بما يقابل ذلك على الترتيب.',
    targetGrades: 'التعليم المتوسط والثانوي',
    keyElements: ['الطرف الأول (معنيان فأكثر)', 'الطرف المقابل على الترتيب'],
    commonMistakes: 'تسمية المقابلة طباقاً؛ الطباق يكون بين لفظين مفردين فقط، أما المقابلة فبين جملتين أو تركيبين فأكثر على الترتيب.',
    typicalEffect: 'اتساع دائرة التضاد، وإحداث توازن فكري وهندسة بلاغية تقارن بين مشهدين متقابلين.'
  },
  'jinas': {
    id: 'jinas',
    category: 'badi',
    name: 'الجناس',
    definition: 'تشابه لفظين في النطق مع اختلافهما في المعنى، وهو تام (تطابق في الحروف وعددها وحركاتها وترتيبها) وناقص.',
    targetGrades: 'التعليم المتوسط والثانوي',
    keyElements: ['اللفظ الأول ومعناه', 'اللفظ الثاني ومعناه', 'نوع الجناس (تام / ناقص)', 'أوجه الاختلاف إن كان ناقصاً'],
    commonMistakes: 'اعتبار تكرار نفس الكلمة بنفس المعنى جناساً؛ يجب قطعاً اختلاف المعنى في السياق.',
    typicalEffect: 'إحداث نغمة موسيقية عذبة تطرب لها الآذان وتشد انتباه السامع للتمييز بين المعنيين.'
  },
  'saja': {
    id: 'saja',
    category: 'badi',
    name: 'السجع',
    definition: 'توافق الفاصلتين في النثر على حرف أخير واحد، وأحسنه ما تساوت فقره وخلا من التكلف.',
    targetGrades: 'التعليم المتوسط والثانوي (خاص بالنثر فقط)',
    keyElements: ['الفاصلة الأولى', 'الفاصلة الثانية', 'الحرف المشترك'],
    commonMistakes: 'استخراج السجع في الشعر؛ السجع خاص بالنثر فقط، وما يقابله في الشعر هو التصريع في المطلع أو التقفية الداخلية.',
    typicalEffect: 'منح النثر إيقاعاً موسيقياً جذاباً يسهم في ترسيخ المعنى في الأذهان.'
  },
  'tasree': {
    id: 'tasree',
    category: 'badi',
    name: 'التصريع',
    definition: 'اتفاق نهاية الشطر الأول (العروض) مع نهاية الشطر الثاني (الضرب) في الحرف الأخير وحركته في المطلع غالباً.',
    targetGrades: 'التعليم الثانوي (خاص بالشعر فقط)',
    keyElements: ['عروض البيت الأول', 'ضرب البيت الأول', 'حرف الروي المشترك'],
    commonMistakes: 'البحث عن التصريع في منتصف القصيدة؛ التصريع ظاهرة مطلعية غالباً في البيت الأول.',
    typicalEffect: 'افتتاح القصيدة بجرس موسيقي رنان يُهيئ أذن المتلقي ويؤذن بنغمة البحر والقافية.'
  },

  // ─── علم المعاني ───
  'insha_talabi': {
    id: 'insha_talabi',
    category: 'maani',
    name: 'الإنشاء الطلبي',
    definition: 'ما يستدعي مطلوباً غير حاصل وقت الطلب، وله خمس صيغ رئيسية: الأمر، النهي، الاستفهام، النداء، التمني.',
    targetGrades: 'التعليم المتوسط والثانوي',
    keyElements: ['الصيغة التركيبية', 'المعنى الأصلي', 'الغرض البلاغي المستفاد من السياق'],
    commonMistakes: 'الجزم بأن صيغة الأمر دائماً تفيد الوجوب؛ فالأمر في البلاغة يخرج للنصح، الدعاء، الالتماس، التعجيز...',
    typicalEffect: 'تحريك الذهن، بعث الحيوية في الخطاب، ومشاركة المتلقي انفعالياً مع المتكلم.'
  },
  'qasr': {
    id: 'qasr',
    category: 'maani',
    name: 'أسلوب القصر والتوكيد',
    definition: 'تخصيص شيء بشيء بطريق مخصوص (إنما، النفي والاستثناء، التقديم والتأخير، العطف بـ لا وبل ولكن).',
    targetGrades: 'السنة الثانية والثالثة ثانوي (البكالوريا)',
    keyElements: ['طريق القصر', 'المقصور', 'المقصور عليه', 'نوع القصر (موصوف على صفة أو صفة على موصوف)'],
    commonMistakes: 'تحديد المقصور والمقصور عليه بشكل مقلوب، خاصة في جمل النفي والاستثناء أو إنما.',
    typicalEffect: 'تأكيد الحكم، نفي الشك والتردد، وحصر الصفة أو الفضيلة في الموصوف دون غيره.'
  },
  'iltifat': {
    id: 'iltifat',
    category: 'maani',
    name: 'الالتفات',
    definition: 'الانتقال في سياق الكلام من صيغة ضمير إلى أخرى (من الغيبة إلى الخطاب أو المتكلم، أو العكس) للتنبيه.',
    targetGrades: 'السنة الثالثة ثانوي والأقسام الأدبية',
    keyElements: ['الصيغة الأولى', 'الصيغة الثانية بعد التحول', 'أثر الانتقال في تنشيط الذهن'],
    commonMistakes: 'اعتبار التحول خطأ نحوياً في الضمائر؛ بل هو من أبلغ أسرار التعبير القرآني والشعري.',
    typicalEffect: 'تجديد نشاط السامع، دفع السآمة والملل، وتلوين الخطاب للتأثير الوجداني.'
  }
};

/**
 * بنك الشواهد البلاغية النموذجية الموثقة للاختبار وضبط المعايرة
 */
export interface BenchmarkExample {
  id: string;
  text: string;
  source: string;
  expectedFindings: Array<{
    category: RhetoricCategory;
    family: string;
    type: string;
    quote: string;
    label: string;
  }>;
}

export const BENCHMARK_EXAMPLES: BenchmarkExample[] = [
  {
    id: 'bm-1',
    text: 'وَاشْتَعَلَ الرَّأْسُ شَيْبًا',
    source: 'القرآن الكريم - سورة مريم',
    expectedFindings: [
      {
        category: 'bayaan',
        family: 'istiara_makniya',
        type: 'makniya',
        quote: 'وَاشْتَعَلَ الرَّأْسُ شَيْبًا',
        label: 'استعارة مكنية'
      }
    ]
  },
  {
    id: 'bm-2',
    text: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
    source: 'القرآن الكريم - سورة فاطر',
    expectedFindings: [
      {
        category: 'maani',
        family: 'qasr',
        type: 'innama',
        quote: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
        label: 'أسلوب قصر بـ (إنما)'
      }
    ]
  },
  {
    id: 'bm-3',
    text: 'يَقُولُونَ لِي فِيكَ انْقِبَاضٌ وَإِنَّمَا ... رَأَوْا رَجُلاً عَنْ مَوْقِفِ الذُّلِّ أَحْجَمَا',
    source: 'أبو الحسن الجرجاني',
    expectedFindings: [
      {
        category: 'bayaan',
        family: 'kinayah',
        type: 'sifah',
        quote: 'عَنْ مَوْقِفِ الذُّلِّ أَحْجَمَا',
        label: 'كناية عن عزة النفس'
      }
    ]
  },
  {
    id: 'bm-4',
    text: 'فَأَمَّا مَنْ أَعْطَى وَاتَّقَى * وَصَدَّقَ بِالْحُسْنَى * فَسَنُيَسِّرُهُ لِلْيُسْرَى * وَأَمَّا مَنْ بَخِلَ وَاسْتَغْنَى * وَكَذَّبَ بِالْحُسْنَى * فَسَنُيَسِّرُهُ لِلْعُسْرَى',
    source: 'القرآن الكريم - سورة الليل',
    expectedFindings: [
      {
        category: 'badi',
        family: 'muqabala',
        type: 'tarkib',
        quote: 'أَعْطَى وَاتَّقَى ... بَخِلَ وَاسْتَغْنَى',
        label: 'مقابلة بلاغية تامة'
      }
    ]
  },
  {
    id: 'bm-5',
    text: 'عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ ... وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ',
    source: 'المتنبي',
    expectedFindings: [
      {
        category: 'badi',
        family: 'tasree',
        type: 'matla',
        quote: 'الْعَزَائِمُ ... الْمَكَارِمُ',
        label: 'تصريع في مطلع القصيدة'
      },
      {
        category: 'badi',
        family: 'jinas',
        type: 'naqis',
        quote: 'الْعَزْمِ ... الْعَزَائِمُ',
        label: 'جناس اشتقاقي ناقص'
      }
    ]
  },
  {
    id: 'bm-6',
    text: 'بَلَغَ عَدَدُ سُكَّانِ الْمَدِينَةِ مِلْيُونَ نَسَمَةٍ فِي الإِحْصَاءِ الأَخِيرِ.',
    source: 'جملة إحصائية تقريرية عادية',
    expectedFindings: [
      {
        category: 'bayaan',
        family: 'majaz_mursal',
        type: 'juziyya',
        quote: 'مِلْيُونَ نَسَمَةٍ',
        label: 'مجاز مرسل علاقته الجزئية (النسمة أُريد بها الإنسان)'
      }
    ]
  },
  {
    id: 'bm-7',
    text: 'قَرَأْتُ الْكِتَابَ أَمْسِ كَامِلاً وَكَتَبْتُ مُلَخَّصَهُ عَلَى الدَّفْتَرِ.',
    source: 'نص إخباري مباشر خالٍ من البلاغة',
    expectedFindings: [] // اختبار خلو النص التام من الصور لتفادي الإيجابيات الكاذبة
  }
];
