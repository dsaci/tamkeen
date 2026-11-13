/**
 * التوزيعات السنوية والشهرية المعتمدة لوزارة التربية الوطنية الجزائرية
 * مستخلصة من وثائق التدرجات السنوية الرسمية (الجيل الثاني) للطور الثانوي
 * مصممة وفق معمارية محاكاة لمنصة باقون
 */

export interface WeekDistributionItem {
  weekNumber: number;
  monthNameAr: string;
  unitNumber: number;
  unitTitle: string;
  theme: string;
  literaryText: string;
  grammar: string;
  rhetoricOrProsody?: string;
  guidedReadingOrCommunicative?: string;
  writingOrIntegration: string;
  hours: number;
  isExamPeriod?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  notes?: string;
}

export interface MonthDistributionItem {
  id: string;
  monthNameAr: string;
  monthIndex: number; // 9 = سبتمبر, 10 = أكتوبر ...
  semester: 1 | 2 | 3;
  weeksCount: number;
  isExamPeriod?: boolean;
  examTitle?: string;
  weeks: WeekDistributionItem[];
  branchSummary: {
    literature: string[];
    grammar: string[];
    rhetoric: string[];
    writing: string[];
  };
}

export interface SyllabusDistribution {
  id: string;
  academicYear: string;
  grade: 'السنة الأولى' | 'السنة الثانية' | 'السنة الثالثة';
  stream: string;
  subject: string;
  weeklyHours: number;
  totalAnnualHours: number;
  trimesters: {
    trimester: 1 | 2 | 3;
    title: string;
    monthsRange: string;
    weeksCount: number;
    hoursCount: number;
    months: MonthDistributionItem[];
  }[];
}

export const OFFICIAL_SYLLABUS_DISTRIBUTIONS: SyllabusDistribution[] = [
  // ==========================================================================
  // 1. السنة الثالثة ثانوي (3AS) - الشعب العلمية المشتركة (بكالوريا)
  // (علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد)
  // ==========================================================================
  {
    id: '3as-scientific-annual-2024',
    academicYear: '2024/2025',
    grade: 'السنة الثالثة',
    stream: 'شعب علمية مشتركة (علوم/رياضيات/تقني/تسيير)',
    subject: 'اللغة العربية وآدابها',
    weeklyHours: 3,
    totalAnnualHours: 96,
    trimesters: [
      // ── الفصل الأول: سبتمبر - ديسمبر ──
      {
        trimester: 1,
        title: 'الفصل الدراسي الأول',
        monthsRange: 'سبتمبر — ديسمبر',
        weeksCount: 12,
        hoursCount: 36,
        months: [
          {
            id: '3as-sci-sep',
            monthNameAr: 'سبتمبر',
            monthIndex: 9,
            semester: 1,
            weeksCount: 2,
            branchSummary: {
              literature: ['الدخول المدرسي وتشخيص المكتسبات القبلية', 'في المديح النبوي والزهد (البوصيري)'],
              grammar: ['مراجعة المفاهيم الإعرابية الكبرى', 'إعراب المبتدأ والخبر ونواسخهما'],
              rhetoric: ['مراجعة الصور البيانية (التشبيه والاستعارة)'],
              writing: ['وضعية تقويم تشخيصي أولي في التعبير الكتابي']
            },
            weeks: [
              {
                weekNumber: 1,
                monthNameAr: 'سبتمبر',
                unitNumber: 0,
                unitTitle: 'التقويم التشخيصي والدخول المدرسي',
                theme: 'تشخيص المكتسبات القبلية وتوجيه التعلمات',
                literaryText: 'سند تشخيصي في القراءة التحليلية',
                grammar: 'تثبيت مكتسبات الجمل والإعراب',
                writingOrIntegration: 'وضعية كتابية تقويمية أولية',
                hours: 3,
                notes: 'إجراء التقويم التشخيصي ورصد الفروق الفردية'
              },
              {
                weekNumber: 2,
                monthNameAr: 'سبتمبر',
                unitNumber: 1,
                unitTitle: 'الوحدة 01: عصر الضعف والانحطاط (المدائح النبوية والزهد)',
                theme: 'شعر المديح النبوي وأسباب شيوعه في عصر المماليك',
                literaryText: 'في المديح النبوي (نهج البردة) للإمام البوصيري',
                grammar: 'إعراب إذا الفجائية وإذا الشرطية',
                rhetoricOrProsody: 'بلاغة الاستعارة التصريحية والمكنية',
                writingOrIntegration: 'تقنيات تلخيص نص أدبي شعري',
                hours: 3
              }
            ]
          },
          {
            id: '3as-sci-oct',
            monthNameAr: 'أكتوبر',
            monthIndex: 10,
            semester: 1,
            weeksCount: 4,
            branchSummary: {
              literature: ['الزهد عند ابن نباتة المصري', 'النثر العلمي المتأدب (ابن خلدون)'],
              grammar: ['إعراب إذ، إذًا، وحينئذ', 'الجمل التي لها محل من الإعراب (الخبر، المفعول، الحال)'],
              rhetoric: ['بلاغة المجاز المرسل وعلاقاته', 'الكناية وأسرارها الجمالية'],
              writing: ['كتابة مقال تفسيري حول خصائص النثر العلمي']
            },
            weeks: [
              {
                weekNumber: 3,
                monthNameAr: 'أكتوبر',
                unitNumber: 1,
                unitTitle: 'الوحدة 01: شعر الزهد والمديح',
                theme: 'دعوة الزهد ومحاسبة النفس',
                literaryText: 'شعر الزهد لابن نباتة المصري',
                grammar: 'إعراب (إذْ) وأحكامها الزمنية والتعليلية',
                rhetoricOrProsody: 'المجاز العقلي والمرسل',
                guidedReadingOrCommunicative: 'المطالعة: أثر حركة التأليف في عصر الضعف',
                writingOrIntegration: 'وضعية إدماجية نقدية حول ظاهرة الزهد',
                hours: 3
              },
              {
                weekNumber: 4,
                monthNameAr: 'أكتوبر',
                unitNumber: 2,
                unitTitle: 'الوحدة 02: النثر العلمي المتأدب في عصر المماليك',
                theme: 'ظاهرة النثر العلمي وموسوعية ابن خلدون والقزويني',
                literaryText: 'المقدمة: في فضل علم التاريخ لابن خلدون',
                grammar: 'إعراب (إذًا / إذن) وأحكام نصب المضارع بها',
                rhetoricOrProsody: 'السجع والجناس وأثرهما في النثر القديم',
                writingOrIntegration: 'كتابة فقرة تفسيرية لمنهجية المؤرخ الموضوعي',
                hours: 3
              },
              {
                weekNumber: 5,
                monthNameAr: 'أكتوبر',
                unitNumber: 2,
                unitTitle: 'الوحدة 02: رواد النثر العلمي الموسوعي',
                theme: 'النثر العلمي وتدوين المعارف الجغرافية والطبيعية',
                literaryText: 'من عجائب المخلوقات للقزويني',
                grammar: 'الجمل التي لها محل من الإعراب: جملة الخبر والصلة',
                guidedReadingOrCommunicative: 'النص التواصلي: خصائص حركة التأليف',
                writingOrIntegration: 'تحرير نص حجاجي حول قيمة العقل والمنهج العلمي',
                hours: 3
              },
              {
                weekNumber: 6,
                monthNameAr: 'أكتوبر',
                unitNumber: 2,
                unitTitle: 'الوحدة 02: تقويم ختامي ومعالجة',
                theme: 'إدماج معارف عصر الضعف',
                literaryText: 'تطبيقات على نصوص النثر العلمي المتأدب',
                grammar: 'تمارين تطبيقية مأخوذة من مواضيع البكالوريا الرسمية',
                rhetoricOrProsody: 'مراجعة أساليب القصر وأثرها في الإيضاح',
                writingOrIntegration: 'إنتاج وضعية إدماجية حول عصر الضعف',
                hours: 3
              }
            ]
          },
          {
            id: '3as-sci-nov',
            monthNameAr: 'نوفمبر',
            monthIndex: 11,
            semester: 1,
            weeksCount: 4,
            isExamPeriod: true,
            examTitle: 'فرض الفصل الأول الرسمي',
            branchSummary: {
              literature: ['نزعة التفاؤل والنزعة الإنسانية في شعر المهجر (إيليا أبو ماضي)', 'شعر المنفى والحنين إلى الوطن (أحمد شوقي)'],
              grammar: ['الجمل التي لها محل من الإعراب: جملة النعت والحال ومضاف إليه', 'الجمل التي لا محل لها من الإعراب: الابتدائية والصلة'],
              rhetoric: ['البلاغة الرمزية والصور الشعرية الرومانسية', 'بحر الرجز وتطبيقاته'],
              writing: ['كتابة مقال حول الالتزام الإنساني في شعر المهجر']
            },
            weeks: [
              {
                weekNumber: 7,
                monthNameAr: 'نوفمبر',
                unitNumber: 3,
                unitTitle: 'الوحدة 03: عصر النهضة وأدب المهجر (الرابطة القلمية)',
                theme: 'نزعة التفاؤل والتمرد على اليأس والقيم الإنسانية',
                literaryText: 'فلسفة الحياة (كن جميلاً) لإيليا أبو ماضي',
                grammar: 'الجملة الحالية والجملة الوصفية (النعتية)',
                rhetoricOrProsody: 'بلاغة التشبيه التمثيلي في الشعر الرومانسي',
                writingOrIntegration: 'تحرير نص يبرز الأثر النفسي للتفاؤل والأمل',
                hours: 3
              },
              {
                weekNumber: 8,
                monthNameAr: 'نوفمبر',
                unitNumber: 3,
                unitTitle: 'الوحدة 03: النزعة الروحية والتأمل في الطبيعة',
                theme: 'شعر التأمل والحنين عند شعراء الشمال والجنوب',
                literaryText: 'النهر المتجمد لميخائيل نعيمة',
                grammar: 'الجملة المضاف إليها والجملة الواقعة جواب شرط جازم',
                guidedReadingOrCommunicative: 'النص التواصلي: الرابطة القلمية ومبادئ التجديد',
                writingOrIntegration: 'تلخيص نص نثري ونقده وفق معايير الاتساق والانسجام',
                hours: 3
              },
              {
                weekNumber: 9,
                monthNameAr: 'نوفمبر',
                unitNumber: 3,
                unitTitle: 'محطة الفرض المحروس الأول',
                theme: 'تقويم فصلي ومتابعة بيداغوجية',
                literaryText: 'موضوع الفرض المحروس الأول (بناء فكري ولغوي)',
                grammar: 'إجراء الفرض الفصلي الموحد وتصحيحه النموذجي',
                writingOrIntegration: 'شبكة التقويم الذاتي وسلم التنقيط',
                hours: 3,
                isExamPeriod: true,
                notes: 'إجراء وتصحيح الفرض المحروس الأول للفصل الأول'
              },
              {
                weekNumber: 10,
                monthNameAr: 'نوفمبر',
                unitNumber: 4,
                unitTitle: 'الوحدة 04: شعر المنفى والحنين (الإحياء والبعث)',
                theme: 'شعر الشوق والوطنية ومعاناة النفي',
                literaryText: 'نكبة دمشق لأحمد شوقي (أمير الشعراء)',
                grammar: 'الجمل التي لا محل لها من الإعراب (الابتدائية والاعتراضية)',
                rhetoricOrProsody: 'الموسيقى الداخلية والخارجية في القصيدة الكلاسيكية',
                writingOrIntegration: 'وضعية إدماجية حول أصالة القصيدة الكلاسيكية',
                hours: 3
              }
            ]
          },
          {
            id: '3as-sci-dec',
            monthNameAr: 'ديسمبر',
            monthIndex: 12,
            semester: 1,
            weeksCount: 2,
            isExamPeriod: true,
            examTitle: 'اختبارات الفصل الأول الرسمية',
            branchSummary: {
              literature: ['مراجعة شاملة لوحدات الفصل الأول', 'تصحيح اختبار الفصل الأول'],
              grammar: ['تطبيقات شاملة في إعراب الجمل والمفردات'],
              rhetoric: ['تطبيقات شاملة في البلاغة والصور البيانية'],
              writing: ['معالجة نقائص التعبير الكتابي والإنشاء']
            },
            weeks: [
              {
                weekNumber: 11,
                monthNameAr: 'ديسمبر',
                unitNumber: 4,
                unitTitle: 'أسبوع اختبارات الفصل الدراسي الأول',
                theme: 'التقويم التحصيلي الرسمي للثلاثي الأول',
                literaryText: 'موضوع اختبار الفصل الأول (سند شعري/نثري + أسئلة البكالوريا)',
                grammar: 'إجراء الاختبار وتصحيحه وسلالم التنقيط',
                writingOrIntegration: 'تقييم شامل للأداء الفردي والتحصيلي',
                hours: 3,
                isExamPeriod: true,
                notes: 'اختبارات الفصل الأول + رصد النقاط'
              },
              {
                weekNumber: 12,
                monthNameAr: 'ديسمبر',
                unitNumber: 4,
                unitTitle: 'أسبوع التصحيح والمعالجة البيداغوجية',
                theme: 'معالجة الثغرات ورأب الصدع المعرفي للمتعلمين',
                literaryText: 'تحليل أخطاء البناء الفكري في نصوص الاختبار',
                grammar: 'معالجة أخطاء الإعراب وتوظيف الجمل',
                writingOrIntegration: 'ورشة تصويب الوضعيات الإدماجية',
                hours: 3,
                notes: 'تسليم كشوف النقاط + بداية عطلة الشتاء'
              }
            ]
          }
        ]
      },

      // ── الفصل الثاني: جانفي - مارس ──
      {
        trimester: 2,
        title: 'الفصل الدراسي الثاني',
        monthsRange: 'جانفي — مارس',
        weeksCount: 11,
        hoursCount: 33,
        months: [
          {
            id: '3as-sci-jan',
            monthNameAr: 'جانفي',
            monthIndex: 1,
            semester: 2,
            weeksCount: 4,
            branchSummary: {
              literature: ['الثورة الجزائرية في الشعر العربي المعاصر (مفدي زكريا)', 'شعر الالتزام والقضايا التحررية (سليمان العيسى)'],
              grammar: ['معاني الحروف: حروف الجر وأثرها في الاتساق', 'حروف العطف ومعانيها الدقيقة في الخطاب'],
              rhetoric: ['الرمز والأسطورة في الشعر الحديث', 'بحر الكامل وتفعيلاته في شعر التفعيلة'],
              writing: ['تحرير وضعية حجاجية حول البعد المغاربي والعربي للثورة الجزائرية']
            },
            weeks: [
              {
                weekNumber: 13,
                monthNameAr: 'جانفي',
                unitNumber: 5,
                unitTitle: 'الوحدة 05: الثورة التحريرية في الشعر العربي',
                theme: 'الثورة الجزائرية والالتزام ونصرة الشعوب التحررية',
                literaryText: 'إلياذة الجزائر لشاعر الثورة مفدي زكريا',
                grammar: 'معاني حروف الجر ودورها في اتساق النص',
                rhetoricOrProsody: 'الأساليب الإنشائية وأغراضها البلاغية في شعر الثورة',
                writingOrIntegration: 'كتابة مقال حول سمات شعر الالتزام ونزعة الشاعر',
                hours: 3
              },
              {
                weekNumber: 14,
                monthNameAr: 'جانفي',
                unitNumber: 5,
                unitTitle: 'الوحدة 05: البعد القومي العربي للثورة الجزائرية',
                theme: 'تفاعل الشعراء العرب مع ثورة نوفمبر المجيدة',
                literaryText: 'تحية إلى جيش التحرير لسليمان العيسى',
                grammar: 'حروف العطف ودلالاتها في ربط الأفكار والتعليل',
                guidedReadingOrCommunicative: 'النص التواصلي: الثورة الجزائرية في الضمير العربي',
                writingOrIntegration: 'إنتاج نص يبرز دور الكلمة الحرة في مناهضة الاستعمار',
                hours: 3
              },
              {
                weekNumber: 15,
                monthNameAr: 'جانفي',
                unitNumber: 6,
                unitTitle: 'الوحدة 06: فلسطين في الشعر العربي المعاصر',
                theme: 'القضية الفلسطينية ومعاناة الحصار والمقاومة الباسلة',
                literaryText: 'حالة حصار لمحمود درويش (النص الأدبي النموذجي)',
                grammar: 'الجمل التي لا محل لها من الإعراب ص 100',
                rhetoricOrProsody: 'بلاغة التشبيه وأغراضه الجمالية ص 101',
                guidedReadingOrCommunicative: 'المطالعة الموجهة: إشكالية التعبير في الأدب الجزائري',
                writingOrIntegration: 'وضعية إدماجية نقدية حول الالتزام تجاه فلسطين',
                hours: 3,
                notes: 'الوحدة النموذجية المعتمدة رسمياً في بطاقة التفتيش'
              },
              {
                weekNumber: 16,
                monthNameAr: 'جانفي',
                unitNumber: 6,
                unitTitle: 'الوحدة 06: فلسطين والشعر الجزائري',
                theme: 'المواقف الأصيلة للأدب الجزائري من نصرة فلسطين والقدس',
                literaryText: 'فلسطين في الشعر الجزائري لعبد الله الركيبي (نص تواصلي)',
                grammar: 'تطبيقات إعراب الجمل من امتحانات البكالوريا 2019-2022',
                rhetoricOrProsody: 'تطبيقات بلاغة التشبيه وإحكام موارده',
                writingOrIntegration: 'إنجاز شبكة التقييم الذاتي والجماعي للوضعية النقدية',
                hours: 3
              }
            ]
          },
          {
            id: '3as-sci-feb',
            monthNameAr: 'فيفري',
            monthIndex: 2,
            semester: 2,
            weeksCount: 4,
            isExamPeriod: true,
            examTitle: 'فرض الفصل الثاني الرسمي',
            branchSummary: {
              literature: ['ظاهرة الحزن والألم في الشعر المعاصر (نازك الملائكة)', 'الشعر التحرري وثورة الأوراس'],
              grammar: ['لو، لولا، لوما وأحكامها الامتناعية والشرطية', 'أحكام التمييز والحال والفرق الإعرابي بينهما'],
              rhetoric: ['التناص الديني والتاريخي في الشعر المعاصر'],
              writing: ['تحليل نقد أدبي حول ظاهرة الحزن والألم']
            },
            weeks: [
              {
                weekNumber: 17,
                monthNameAr: 'فيفري',
                unitNumber: 7,
                unitTitle: 'الوحدة 07: ظاهرة الحزن والألم في الشعر الحديث',
                theme: 'مأساة الواقع العربي ونكسة 1967 وتداعياتها النفسية',
                literaryText: 'أنا لنازك الملائكة (رائدة شعر التفعيلة)',
                grammar: 'أحكام (لو، لولا، لوما) ومعانيها الشرطية والامتناعية',
                rhetoricOrProsody: 'الرمز الفني والأسطورة ودورهما في التعبير عن الألم',
                writingOrIntegration: 'كتابة مقال تحليلي حول أسباب ظاهرة الحزن والشعر الحر',
                hours: 3
              },
              {
                weekNumber: 18,
                monthNameAr: 'فيفري',
                unitNumber: 7,
                unitTitle: 'الوحدة 07: شعر التفعيلة والرمز',
                theme: 'المطر ورمز الخصب والتجدد في الشعر العراقي الحديث',
                literaryText: 'أنشودة المطر لبدر شاكر السياب',
                grammar: 'التمييز وأنواعه (تمييز الذات وتمييز النسبة)',
                guidedReadingOrCommunicative: 'النص التواصلي: حركة التجديد في الشعر المعاصر',
                writingOrIntegration: 'وضعية إدماجية حول توظيف الرمز في الشعر الجزائري',
                hours: 3
              },
              {
                weekNumber: 19,
                monthNameAr: 'فيفري',
                unitNumber: 7,
                unitTitle: 'محطة الفرض المحروس الثاني',
                theme: 'تقويم فصلي ومتابعة بيداغوجية',
                literaryText: 'موضوع الفرض المحروس للثلاثي الثاني',
                grammar: 'إجراء الفرض الفصلي الموحد وتصحيحه النموذجي',
                writingOrIntegration: 'سلم التنقيط وتحليل نتائج المتعلمين',
                hours: 3,
                isExamPeriod: true
              },
              {
                weekNumber: 20,
                monthNameAr: 'فيفري',
                unitNumber: 8,
                unitTitle: 'الوحدة 08: فن المقال الصحفي الجزائري',
                theme: 'الحركة الإصلاحية ودور الصحافة في التوعية الوطنية',
                literaryText: 'في التربية والتعليم للشيخ عبد الحميد بن باديس',
                grammar: 'البدل وعطف البيان وأحكامهما الإعرابية',
                rhetoricOrProsody: 'أساليب الإقناع والحجاج المنطقي في المقال الصحفي',
                writingOrIntegration: 'كتابة مقال صحفي معالج لقضية اجتماعية أو تربوية',
                hours: 3
              }
            ]
          },
          {
            id: '3as-sci-mar',
            monthNameAr: 'مارس',
            monthIndex: 3,
            semester: 2,
            weeksCount: 3,
            isExamPeriod: true,
            examTitle: 'اختبارات الفصل الثاني الرسمية',
            branchSummary: {
              literature: ['المقال الإصلاحي عند البشير الإبراهيمي', 'مراجعة واختبارات الفصل الثاني'],
              grammar: ['توكيد اللفظ والمعنى ومسائل الإعراب الدقيقة'],
              rhetoric: ['البلاغة النقدية للمقال الجزائري الكلاسيكي'],
              writing: ['تصحيح ومعالجة بيداغوجية لاختبار الفصل الثاني']
            },
            weeks: [
              {
                weekNumber: 21,
                monthNameAr: 'مارس',
                unitNumber: 8,
                unitTitle: 'الوحدة 08: بلاغة المقال عند الإبراهيمي',
                theme: 'أسلوب السهل الممتنع ودقة الألفاظ في آثار الإبراهيمي',
                literaryText: 'آثار الإبراهيمي: في الإصلاح الاجتماعي ومحاربة الجهل',
                grammar: 'التوكيد اللفظي والمعنوي وأحكامهما في تماسك النص',
                guidedReadingOrCommunicative: 'المطالعة: أثر مجلة الشهاب والبصائر في النهضة الجزائرية',
                writingOrIntegration: 'تحرير خاتمة نقدية لأطوار المقال الصحفي في الجزائر',
                hours: 3
              },
              {
                weekNumber: 22,
                monthNameAr: 'مارس',
                unitNumber: 8,
                unitTitle: 'أسبوع اختبارات الفصل الدراسي الثاني',
                theme: 'التقويم التحصيلي الرسمي للثلاثي الثاني',
                literaryText: 'موضوع اختبار الفصل الثاني المنظم وفق معايير البكالوريا',
                grammar: 'إجراء الاختبار وتصحيحه النموذجي',
                writingOrIntegration: 'تقويم شامل للمكتسبات المعرفية واللغوية',
                hours: 3,
                isExamPeriod: true
              },
              {
                weekNumber: 23,
                monthNameAr: 'مارس',
                unitNumber: 8,
                unitTitle: 'أسبوع المعالجة ونتائج الفصل الثاني',
                theme: 'تحليل الأخطاء ورأب الصدع البيداغوجي قبل عطلة الربيع',
                literaryText: 'تصحيح اختلالات قراءة السند واستخراج المؤشرات',
                grammar: 'تثبيت قواعد إعراب الجمل والمفردات الصعبة',
                writingOrIntegration: 'ورشة علاجية للمتعثرين في التعبير',
                hours: 3,
                notes: 'تسليم النتائج وبداية عطلة الربيع'
              }
            ]
          }
        ]
      },

      // ── الفصل الثالث: أفريل - جوان ──
      {
        trimester: 3,
        title: 'الفصل الدراسي الثالث والمراجعة النهائية للبكالوريا',
        monthsRange: 'أفريل — جوان',
        weeksCount: 9,
        hoursCount: 27,
        months: [
          {
            id: '3as-sci-apr',
            monthNameAr: 'أفريل',
            monthIndex: 4,
            semester: 3,
            weeksCount: 4,
            branchSummary: {
              literature: ['المسرحية الشعرية في الأدب العربي', 'فن القصة القصيرة والرواية الجزائرية'],
              grammar: ['أسلوب الاستثناء وأحكامه الإعرابية الدقيقة', 'أحكام العدد والمعدود وتطبيقاته'],
              rhetoric: ['مراجعة شاملة لجميع علوم البلاغة (البيان، البديع، المعاني)'],
              writing: ['التدريب على مواضيع البكالوريا الرسمية للسنوات الخمس السابقة']
            },
            weeks: [
              {
                weekNumber: 24,
                monthNameAr: 'أفريل',
                unitNumber: 9,
                unitTitle: 'الوحدة 09: الفنون النثرية الحديثة (المسرحية والرواية)',
                theme: 'نشأة المسرح العربي ومسرحيات توفيق الحكيم وأحمد شوقي',
                literaryText: 'مشهد مسرحي تحليلي (مصرع كليوباترا أو أهل الكهف)',
                grammar: 'أسلوب الاستثناء (إلا، غير، سوى، خلا، عدا، حاشا)',
                rhetoricOrProsody: 'علاقة الحوار الدرامي بالبلاغة ومقتضى الحال',
                writingOrIntegration: 'تحرير نص حواري درامي حول قضية علمية أو أخلاقية',
                hours: 3
              },
              {
                weekNumber: 25,
                monthNameAr: 'أفريل',
                unitNumber: 9,
                unitTitle: 'الوحدة 09: فن القصة القصيرة الجزائرية',
                theme: 'القصة الجزائرية وتصوير واقع المجتمع الجزائري ومعاناته',
                literaryText: 'ريح الجنوب لعبد الحميد بن هدوقة أو قصة للطاهر وطار',
                grammar: 'أحكام تمييز العدد وضبط المعدود كتابة وإعراباً',
                guidedReadingOrCommunicative: 'النص التواصلي: تطور السرد الروائي والقصصي في الجزائر',
                writingOrIntegration: 'إنتاج قصة قصيرة مستوفية لعناصر الزمان والمكان والعقدة',
                hours: 3
              },
              {
                weekNumber: 26,
                monthNameAr: 'أفريل',
                unitNumber: 10,
                unitTitle: 'الوحدة 10: مراجعة شاملة لمحاور البكالوريا',
                theme: 'حل وتحليل مواضيع بكالوريا سابقة (الشعب العلمية 2020-2023)',
                literaryText: 'دراسة ومناقشة سند شعري من البكالوريات السابقة',
                grammar: 'بنك أسئلة الإعراب الأكثر تكراراً في امتحانات البكالوريا',
                rhetoricOrProsody: 'بنك أسئلة الصور البيانية والمحسنات البديعية',
                writingOrIntegration: 'التدرب على التحرير الزمني لورقة الإجابة (ساعتان ونصف)',
                hours: 3
              },
              {
                weekNumber: 27,
                monthNameAr: 'أفريل',
                unitNumber: 10,
                unitTitle: 'الوحدة 10: البكالوريا التجريبية والتقويم الختامي',
                theme: 'محاكاة كاملة لظروف امتحان شهادة البكالوريا الرسمية',
                literaryText: 'امتحان البكالوريا التجريبية (الموضوع الأول والثاني)',
                grammar: 'إجراء الامتحان التجريبي وسلالم التنقيط النموذجية',
                writingOrIntegration: 'تصحيح جماعي تحليلي للامتحان التجريبي',
                hours: 3,
                isExamPeriod: true,
                notes: 'إجراء البكالوريا التجريبية الموحدة على مستوى المؤسسة'
              }
            ]
          },
          {
            id: '3as-sci-may',
            monthNameAr: 'ماي',
            monthIndex: 5,
            semester: 3,
            weeksCount: 4,
            isExamPeriod: true,
            examTitle: 'البكالوريا التجريبية والمراجعة النهائية المكثفة',
            branchSummary: {
              literature: ['المراجعة المركزة للمحاور الأدبية الثمانية المقررة في البكالوريا'],
              grammar: ['مخطط ذهني شامل لقواعد الإعراب والجمل'],
              rhetoric: ['مخطط ذهني للبلاغة والأساليب والأنماط النصية ومؤشراتها'],
              writing: ['إرشادات التفوق في ورقة إجابة البكالوريا وضبط الوقت']
            },
            weeks: [
              {
                weekNumber: 28,
                monthNameAr: 'ماي',
                unitNumber: 10,
                unitTitle: 'أسبوع تصحيح البكالوريا التجريبية واستخلاص التوصيات',
                theme: 'تحليل الأخطاء الشائعة في البناء الفكري والبناء اللغوي',
                literaryText: 'عرض الإجابة النموذجية الوزارية للبكالوريا التجريبية',
                grammar: 'تثبيت المنهجية الصحيحة لإعراب المفردات وإعراب الجمل',
                writingOrIntegration: 'توجيهات منهجية في استثمار الوقت وتفادي التشطيب',
                hours: 3
              },
              {
                weekNumber: 29,
                monthNameAr: 'ماي',
                unitNumber: 10,
                unitTitle: 'أسبوع الورشات المكثفة للأنماط النصية والتلخيص',
                theme: 'التحكم في الأنماط ومؤشراتها (تفسيري، حجاجي، وصفي، سردي)',
                literaryText: 'تطبيقات على تحديد القصدية وربطها بالنمط النصي المناسب',
                grammar: 'مراجعة أدوات الربط والاتساق والانسجام ومظاهرهما',
                writingOrIntegration: 'ورشة تطبيقية في التلخيص المنهجي وتقنياته الصارمة',
                hours: 3
              },
              {
                weekNumber: 30,
                monthNameAr: 'ماي',
                unitNumber: 10,
                unitTitle: 'الأسبوع الأخير للمراجعة والدعم النفسي والتربوي',
                theme: 'الاستعداد الذهني والمعنوي لاجتياز امتحان شهادة البكالوريا',
                literaryText: 'استعراض نماذج مقترحة لشهادة البكالوريا 2025',
                grammar: 'جلسة أسئلة واستفسارات المتعلمين المفتوحة',
                writingOrIntegration: 'وصايا الإجابة النموذجية وثبات الخط والأداء',
                hours: 3,
                notes: 'اختتام السنة الدراسية والدعاء للتلاميذ بالنجاح والتوفيق'
              },
              {
                weekNumber: 31,
                monthNameAr: 'ماي',
                unitNumber: 10,
                unitTitle: 'مجالس الأقسام وإعداد ملفات شهادة البكالوريا',
                theme: 'العمل الإداري والتربوي لنهاية السنة الدراسية',
                literaryText: 'انعقاد مجالس الأساتذة والأقسام النهائية',
                grammar: 'تأشيرة الوثائق التربوية والمذكرات والتوزيعات من المفتشية',
                writingOrIntegration: 'المصادقة الرسمية على النتائج السنوية',
                hours: 3,
                notes: 'تسليم كشوف النقاط ودفاتر النصوص'
              }
            ]
          },
          {
            id: '3as-sci-jun',
            monthNameAr: 'جوان',
            monthIndex: 6,
            semester: 3,
            weeksCount: 1,
            isExamPeriod: true,
            examTitle: 'امتحان شهادة البكالوريا الرسمي لوزارة التربية الوطنية',
            branchSummary: {
              literature: ['اجتياز امتحان شهادة البكالوريا الرسمي'],
              grammar: ['مراكز الإجراء ومراكز التصحيح الرسمية'],
              rhetoric: ['التصحيح الوزاري المعتمد'],
              writing: ['مداولات نتائج شهادة البكالوريا']
            },
            weeks: [
              {
                weekNumber: 32,
                monthNameAr: 'جوان',
                unitNumber: 10,
                unitTitle: 'أسبوع إجراء امتحان شهادة البكالوريا الرسمية',
                theme: 'الامتحان الوطني الموحد لشهادة البكالوريا',
                literaryText: 'اجتياز اختبار مادة اللغة العربية وآدابها (اليوم الأول)',
                grammar: 'متابعة وتأطير مراكز الإجراء والتصحيح',
                writingOrIntegration: 'التقييم الوطني العام لنتائج الامتحان',
                hours: 3,
                isExamPeriod: true,
                notes: 'امتحان شهادة البكالوريا الرسمي لوزارة التربية الوطنية'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // 2. السنة الثالثة ثانوي (3AS) - شعبة آداب وفلسفة ولغات أجنبية (بكالوريا)
  // ==========================================================================
  {
    id: '3as-literary-annual-2024',
    academicYear: '2024/2025',
    grade: 'السنة الثالثة',
    stream: 'شعبة آداب وفلسفة',
    subject: 'اللغة العربية وآدابها',
    weeklyHours: 6,
    totalAnnualHours: 192,
    trimesters: [
      {
        trimester: 1,
        title: 'الفصل الدراسي الأول (الآداب والعلوم الإنسانية)',
        monthsRange: 'سبتمبر — ديسمبر',
        weeksCount: 12,
        hoursCount: 72,
        months: [
          {
            id: '3as-lit-sep',
            monthNameAr: 'سبتمبر',
            monthIndex: 9,
            semester: 1,
            weeksCount: 2,
            branchSummary: {
              literature: ['التقويم التشخيصي', 'شعر المديح النبوي والزهد (البوصيري)'],
              grammar: ['مراجعة النحو الوظيفي', 'إعراب إذا الشرطية والفجائية والظرفية'],
              rhetoric: ['البلاغة: علم البيان ومراجعة التشبيه والاستعارة والكناية'],
              writing: ['التقويم النقدي: أسباب ركود الأدب في عصر الضعف ومحاولات النهوض']
            },
            weeks: [
              {
                weekNumber: 1,
                monthNameAr: 'سبتمبر',
                unitNumber: 0,
                unitTitle: 'التقويم التشخيصي والتثبيت المنهجي',
                theme: 'رصد مكتسبات الشعبة الأدبية في النقد الأدبي والنحو',
                literaryText: 'سند أدبي شعري من التراث العباسي المتأخر',
                grammar: 'مراجعة المرفوعات والمنصوبات والمجرورات',
                writingOrIntegration: 'تحرير نص حجاجي قصير حول أهمية النقد الأدبي',
                hours: 6
              },
              {
                weekNumber: 2,
                monthNameAr: 'سبتمبر',
                unitNumber: 1,
                unitTitle: 'الوحدة 01: شعر المديح النبوي في عصر المماليك',
                theme: 'ازدهار المدائح النبوية كاستجابة روحية لنكبات العالم الإسلامي',
                literaryText: 'نهج البردة للبوصيري (نص أدبي كامل التحليل)',
                grammar: 'إعراب (إذا) بجميع أحوالها: الشرطية، الفجائية، التفسيرية، والزائدة',
                rhetoricOrProsody: 'البلاغة: أسرار التشبيه التمثيلي والضمني / العروض: بحر البسيط',
                writingOrIntegration: 'التقويم النقدي: ظاهرة المديح النبوي وأثرها الديني والاجتماعي',
                hours: 6
              }
            ]
          },
          {
            id: '3as-lit-oct',
            monthNameAr: 'أكتوبر',
            monthIndex: 10,
            semester: 1,
            weeksCount: 4,
            branchSummary: {
              literature: ['شعر الزهد لابن نباتة وابن عربي', 'النثر العلمي المتأدب (ابن خلدون، ابن بطوطة)'],
              grammar: ['إعراب إذ، إذًا، وحينئذ', 'الجمل التي لها محل من الإعراب'],
              rhetoric: ['المجاز العقلي والمرسل وعلاقاتهما', 'العروض: بحر الطويل وتقطيعاته'],
              writing: ['التقويم النقدي: خصائص النثر العلمي عند ابن خلدون والقلقشندي']
            },
            weeks: [
              {
                weekNumber: 3,
                monthNameAr: 'أكتوبر',
                unitNumber: 1,
                unitTitle: 'الوحدة 01: شعر الزهد والتصوف',
                theme: 'التجربة الصوفية وأبعادها الشعرية في العصر المملوكي',
                literaryText: 'في محاسبة النفس لابن نباتة المصري',
                grammar: 'إعراب (إذْ) الظرفية والفجائية والتعليلية',
                rhetoricOrProsody: 'المجاز المرسل وعلاقاته الثمانية المشهورة',
                guidedReadingOrCommunicative: 'المطالعة: أثر التصوف في اللغة والتصوير الأدبي',
                writingOrIntegration: 'التقويم النقدي: هل شعر الزهد فن أصيل أم تقليد؟',
                hours: 6
              },
              {
                weekNumber: 4,
                monthNameAr: 'أكتوبر',
                unitNumber: 2,
                unitTitle: 'الوحدة 02: النثر العلمي المتأدب ورواده الكبار',
                theme: 'منهجية البحث التاريخي والاجتماعي عند عبد الرحمن بن خلدون',
                literaryText: 'المقدمة: في أن التاريخ فن عزيز المذهب لابن خلدون',
                grammar: 'إعراب (إذًا / إذن) وشروط إعمالها وإلغائها',
                rhetoricOrProsody: 'بلاغة الإيجاز والإطناب والمساواة في النثر الفكري',
                writingOrIntegration: 'التقويم النقدي: مميزات النثر العلمي المتأدب ومقارنته بالنثر العلمي الخالص',
                hours: 6
              },
              {
                weekNumber: 5,
                monthNameAr: 'أكتوبر',
                unitNumber: 2,
                unitTitle: 'الوحدة 02: أدب الرحلات والجغرافيا الموسوعية',
                theme: 'أدب الرحلة ووصف البلدان والأمم في العصر المملوكي',
                literaryText: 'تحفة النظار في غرائب الأمصار لابن بطوطة',
                grammar: 'الجمل التي لها محل من الإعراب: الخبر، النعت، الحال، والمفعول به',
                rhetoricOrProsody: 'العروض: بحر الوافر وتطبيقاته الشعرية',
                guidedReadingOrCommunicative: 'النص التواصلي: حركة التأليف الموسوعي وأثرها',
                writingOrIntegration: 'وضعية إدماجية مركبة حول خصائص النثر العلمي المتأدب',
                hours: 6
              },
              {
                weekNumber: 6,
                monthNameAr: 'أكتوبر',
                unitNumber: 2,
                unitTitle: 'الوحدة 02: مراجعة وتقويم مرحلي شامل',
                theme: 'تثبيت معارف عصر الضعف والانحطاط لغة ونقداً وبلاغة',
                literaryText: 'دراسة نص نقدي تطبيقي حول عصر المماليك',
                grammar: 'تطبيقات مكثفة في إعراب الجمل المستخرجة من النصوص',
                rhetoricOrProsody: 'تدريب على استخراج الصور البيانية وتحديد سر جمالها',
                writingOrIntegration: 'تحرير مقال نقدي حول دور ابن خلدون في تأسيس علم الاجتماع',
                hours: 6
              }
            ]
          },
          {
            id: '3as-lit-nov',
            monthNameAr: 'نوفمبر',
            monthIndex: 11,
            semester: 1,
            weeksCount: 4,
            isExamPeriod: true,
            examTitle: 'فرض الفصل الأول للأقسام الأدبية',
            branchSummary: {
              literature: ['أدب المهجر الشمالي والجنوبي (إيليا أبو ماضي، جبران)', 'مدرسة الإحياء والبعث (شوقي، البارودي)'],
              grammar: ['الجمل التي لا محل لها من الإعراب', 'أحكام التوابع وعطف البيان والبدل'],
              rhetoric: ['البلاغة: أسلوب القصر وطرقه / العروض: بحر الخفيف'],
              writing: ['التقويم النقدي: مبادئ الرابطة القلمية والعصبة الأندلسية والمذهب الرومانسي']
            },
            weeks: [
              {
                weekNumber: 7,
                monthNameAr: 'نوفمبر',
                unitNumber: 3,
                unitTitle: 'الوحدة 03: الرومانسية وأدب المهجر (الرابطة القلمية)',
                theme: 'النزعة الإنسانية والروحية والتأمل الفلسفي عند مهجري الشمال',
                literaryText: 'ابتسم (أيها الشاكي وما بك داء) لإيليا أبو ماضي',
                grammar: 'الجمل التي لا محل لها من الإعراب: الابتدائية والاستئنافية والاعتراضية',
                rhetoricOrProsody: 'بلاغة التعبير الرمزي والتناغم الموسيقي الرومانسي',
                writingOrIntegration: 'التقويم النقدي: مقارنة بين الرابطة القلمية بنيويورك والعصبة الأندلسية بالبرازيل',
                hours: 6
              },
              {
                weekNumber: 8,
                monthNameAr: 'نوفمبر',
                unitNumber: 3,
                unitTitle: 'الوحدة 03: النزعة التأملية في الطبيعة والكون',
                theme: 'الهروب إلى الغاب والحلول في الطبيعة عند جبران خليل جبران',
                literaryText: 'أعطني الناي وغنّ لجبران خليل جبران',
                grammar: 'الجملة الواقعة صلة موصول والواقعة جواب قسم وجواب شرط غير جازم',
                rhetoricOrProsody: 'العروض: بحر الرمل وجوازاته الشعرية',
                guidedReadingOrCommunicative: 'النص التواصلي: التجديد في القصيدة العربية المهجرية',
                writingOrIntegration: 'تحرير مقال تحليلي حول النزعة الإنسانية والتفاؤل عند شعراء المهجر',
                hours: 6
              },
              {
                weekNumber: 9,
                monthNameAr: 'نوفمبر',
                unitNumber: 3,
                unitTitle: 'محطة الفرض المحروس الأول (الشعبة الأدبية)',
                theme: 'تقويم شامل للمعارف الأدبية واللغوية والنقدية',
                literaryText: 'موضوع الفرض المحروس الأول (نص أدبي + بناء فكري ولغوي وتقويم نقدي)',
                grammar: 'إجراء الفرض الفصلي وتصحيحه وفق سلم التنقيط المعتمد',
                writingOrIntegration: 'رصد الفروق الفردية ومعالجة التعثرات في التقويم النقدي',
                hours: 6,
                isExamPeriod: true
              },
              {
                weekNumber: 10,
                monthNameAr: 'نوفمبر',
                unitNumber: 4,
                unitTitle: 'الوحدة 04: الكلاسيكية وشعر الإحياء والبعث',
                theme: 'استنهاض القصيدة العربية القديمة ومحاكاة القدماء (العمودية)',
                literaryText: 'طربتُ ولم ترعبني بيض النصال لمحمود سامي البارودي',
                grammar: 'أحكام التوابع: البدل وأنواعه وعطف البيان',
                rhetoricOrProsody: 'أسلوب القصر طرقه وأسراره البلاغية',
                writingOrIntegration: 'التقويم النقدي: مدرسة الإحياء والبعث وظاهرة المعارضات الشعرية',
                hours: 6
              }
            ]
          },
          {
            id: '3as-lit-dec',
            monthNameAr: 'ديسمبر',
            monthIndex: 12,
            semester: 1,
            weeksCount: 2,
            isExamPeriod: true,
            examTitle: 'اختبارات الفصل الأول للشعبة الأدبية',
            branchSummary: {
              literature: ['مراجعة شاملة لجميع المحاور المقررة في الفصل الأول'],
              grammar: ['مراجعة إعراب الجمل والمفردات'],
              rhetoric: ['مراجعة البلاغة والعروض'],
              writing: ['اختبار الفصل الأول والتصحيح النموذجي والمعالجة']
            },
            weeks: [
              {
                weekNumber: 11,
                monthNameAr: 'ديسمبر',
                unitNumber: 4,
                unitTitle: 'أسبوع اختبارات الفصل الدراسي الأول للأقسام الأدبية',
                theme: 'التقويم التحصيلي الرسمي للثلاثي الأول في الأدب العربي',
                literaryText: 'موضوع الاختبار الرسمي للبكالوريا (شعر مهجري / كلاسيكي / نثر علمي)',
                grammar: 'إجراء الاختبار وتصحيحه وسلالم التنقيط الرسمية (20 نقطة)',
                writingOrIntegration: 'تقييم كفاءة الإنتاج الكتابي والتقويم النقدي',
                hours: 6,
                isExamPeriod: true
              },
              {
                weekNumber: 12,
                monthNameAr: 'ديسمبر',
                unitNumber: 4,
                unitTitle: 'أسبوع التصحيح والمعالجة البيداغوجية والنتائج',
                theme: 'تحليل الأخطاء ورأب الصدع المعرفي قبل عطلة الشتاء',
                literaryText: 'تصحيح أسئلة التقويم النقدي وأخطاء التمثيل من النص',
                grammar: 'تصويب أخطاء إعراب الجمل والمفردات في ورقة الإجابة',
                writingOrIntegration: 'تسليم كشوف النقاط ودفاتر المراسلة والتوجيه',
                hours: 6,
                notes: 'تسليم النتائج وبداية عطلة الشتاء'
              }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * دالة استرجاع التوزيع السنوي والشهري المعتمد لمستوى وشعبة محددة
 */
export function getSyllabusDistribution(grade: string, stream?: string): SyllabusDistribution {
  const normalizedGrade = grade.trim();
  const normalizedStream = (stream || '').trim().toLowerCase();

  const isLiterary = normalizedStream.includes('آداب') || normalizedStream.includes('لغات') || normalizedStream.includes('فلسفة');

  const match = OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => {
    const gradeMatch = d.grade === normalizedGrade || d.grade.includes(normalizedGrade) || normalizedGrade.includes(d.grade);
    const streamMatch = isLiterary 
      ? d.stream.includes('آداب') || d.stream.includes('فلسفة')
      : d.stream.includes('علمي') || d.stream.includes('مشترك');
    return gradeMatch && streamMatch;
  });

  return match || OFFICIAL_SYLLABUS_DISTRIBUTIONS[0];
}
