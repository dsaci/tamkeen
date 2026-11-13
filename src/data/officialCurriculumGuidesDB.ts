/**
 * Official Algerian Curriculum Guides & Pedagogical Knowledge Base
 * قاعدة بيانات الأدلة والمناهج الرسمية والتشريع التربوي الجزائري
 * المصدر المعتمد: وزارة التربية الوطنية - المفتشية العامة للبيداغوجيا
 * مجلد الموارد الرقمية: https://drive.google.com/drive/folders/1wQ4sRhAYt6udqjpeQjJqer0ZQtD68fql
 */

export type GuideCategory = 
    | 'guides'        // أدلة الأستاذ
    | 'curricula'     // المناهج والوثائق المرافقة
    | 'legislation'   // التشريع والتنظيم التربوي
    | 'didactics'     // التعليمية والديداكتيك واستراتيجيات التدريس
    | 'linguistics';  // المراجع اللغوية والبلاغية

export interface CurriculumGuideItem {
    id: string;
    driveId: string;
    title: string;
    category: GuideCategory;
    categoryLabel: string;
    level: 'PRIMARY' | 'MIDDLE' | 'HIGH' | 'ALL';
    levelLabel: string;
    grades: string[];
    streams: string[];
    format: 'PDF' | 'DOC' | 'PPT' | 'ZIP' | 'FOLDER';
    fileSizeApprox?: string;
    description: string;
    tableOfContents?: string[];
    keyCompetencies?: string[];
    didacticStrategies?: string[];
    ministryReference: string;
    driveViewUrl: string;
    driveDownloadUrl: string;
    tags: string[];
    isFeatured?: boolean;
}

export const OFFICIAL_CURRICULUM_GUIDES: CurriculumGuideItem[] = [
    // ══════════════════════════════════════════════════════════════
    // 1. أدلة الأستاذ الرسمية (Teacher's Guides)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'guide-sec-general',
        driveId: '1GIN6HnPmWfl0J5E63fV4Kw3SWQ9MTv_c',
        title: 'الدليل التربوي لأستاذ التعليم الثانوي العام والتكنولوجي',
        category: 'guides',
        categoryLabel: 'أدلة الأستاذ',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الأولى ثانوي', 'السنة الثانية ثانوي', 'السنة الثالثة ثانوي'],
        streams: ['جميع الشعب العلمية والأدبية'],
        format: 'PDF',
        fileSizeApprox: '8.4 MB',
        description: 'المرجع البيداغوجي الأساسي المعتمد من المفتشية العامة للبيداغوجيا. يتناول أسس المقاربة بالكفاءات، هندسة الدروس، بناء الوضعيات التعلمية والإدماجية، التخطيط السنوي والفصلي، وإجراءات التقويم والدعم التربوي.',
        tableOfContents: [
            'المدخل العام والمقاربة بالكفاءات في التعليم الثانوي',
            'هندسة المقاطع والوحدات التعلمية وتصميم البطاقة البيداغوجية',
            'استراتيجيات التدريس التفاعلية وإدارة الفوج التربوي',
            'الوضعية المشكلة والوضعية الإدماجية ومعايير التقويم',
            'التنظيم التربوي ودفاتر الأستاذ الإلزامية'
        ],
        keyCompetencies: ['تخطيط التعلمات', 'هندسة الوضعيات الإدماجية', 'التقويم التكويني والتشخيصي', 'تفعيل التعلم النشط'],
        didacticStrategies: ['التعلم التعاوني', 'حل المشكلات', 'التقويم الذاتي والتبادلي', 'بيداغوجيا المشروع'],
        ministryReference: 'وزارة التربية الوطنية - مديرية التعليم الثانوي العام والتكنولوجي',
        driveViewUrl: 'https://drive.google.com/file/d/1GIN6HnPmWfl0J5E63fV4Kw3SWQ9MTv_c/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1GIN6HnPmWfl0J5E63fV4Kw3SWQ9MTv_c',
        tags: ['دليل الأستاذ', 'التعليم الثانوي', 'المقاربة بالكفاءات', 'المفتشية العامة', 'تخطيط التعلمات'],
        isFeatured: true
    },
    {
        id: 'guide-1as-arts',
        driveId: '11S4FCt2TPzW3H0xr8Vi1pOtTxX9Br9T7',
        title: 'دليل الأستاذ - جذع مشترك آداب ولغات (س1 ثانوي)',
        category: 'guides',
        categoryLabel: 'أدلة الأستاذ',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الأولى ثانوي'],
        streams: ['جذع مشترك آداب'],
        format: 'DOC',
        fileSizeApprox: '4.1 MB',
        description: 'دليل منهاج اللغة العربية وآدابها للسنة الأولى من التعليم الثانوي جذع مشترك آداب. يتضمن الكفاءات المستهدفة لكل وحدة، تحليل النصوص الأدبية والتواصلية، والأنشطة اللغوية والبلاغية والمطالعة الموجهة والتعبير الكتابي.',
        tableOfContents: [
            'الأهداف العامة لتعليمية اللغة العربية في الجذع المشترك آداب',
            'مخطط وحدات الفصل الأول (العصر الجاهلي والإسلامي)',
            'توزيع الأنشطة الأسبوعية وساعات التدريس',
            'توجيهات معالجة الظواهر البلاغية والعروضية',
            'شبكات تقويم التعبير الكتابي والإنتاج الأدبي'
        ],
        keyCompetencies: ['فهم المقروء والمنطوق الأدبي', 'التحليل النقدي والبلاغي', 'إتقان بحور الشعر العربي', 'الإنتاج الكتابي المتناسق'],
        didacticStrategies: ['الحوار والمناقشة', 'العصف الذهني', 'خرائط المفاهيم النحوية'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/11S4FCt2TPzW3H0xr8Vi1pOtTxX9Br9T7/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=11S4FCt2TPzW3H0xr8Vi1pOtTxX9Br9T7',
        tags: ['س1 ثانوي', 'جذع مشترك آداب', 'دليل الأستاذ', 'العصر الجاهلي', 'قواعد وبلاغة']
    },
    {
        id: 'guide-1as-tech',
        driveId: '1YqYY_O750Hbc1UYpAgA5T2fZo5PsUurB',
        title: 'دليل الأستاذ - جذع مشترك علوم وتكنولوجيا (س1 ثانوي)',
        category: 'guides',
        categoryLabel: 'أدلة الأستاذ',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الأولى ثانوي'],
        streams: ['جذع مشترك علوم وتكنولوجيا'],
        format: 'DOC',
        fileSizeApprox: '1.4 MB',
        description: 'دليل منهاج اللغة العربية لأستاذ الجذع المشترك علوم وتكنولوجيا. يركز على تزويد المتعلم بزاد لغوي ومنهجي يساعده على استيعاب المصطلحات العلمية والتعبير العلمي الدقيق والتفاعل مع النصوص الإخبارية والتفسيرية والحجاجية.',
        tableOfContents: [
            'خصوصية تدريس اللغة العربية للشعب العلمية والتكنولوجية',
            'الكفاءة الختامية ومؤشرات الكفاءة الخاصة بالسنة الأولى علوم',
            'الوحدات التعليمية المبرمجة وتوزيع الحصص',
            'التعبير الكتابي: التلخيص، إعداد التقارير، والنمط التفسيري'
        ],
        keyCompetencies: ['استيعاب الخطاب العلمي باللسان العربي', 'التلخيص الموضوعي', 'التحليل المنطقي والنمط التفسيري'],
        didacticStrategies: ['التعلم التعاوني', 'دراسة الحالة', 'تحليل الوثائق العلمية'],
        ministryReference: 'اللجنة الوطنية للمناهج - مديرية التعليم الثانوي',
        driveViewUrl: 'https://drive.google.com/file/d/1YqYY_O750Hbc1UYpAgA5T2fZo5PsUurB/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1YqYY_O750Hbc1UYpAgA5T2fZo5PsUurB',
        tags: ['س1 ثانوي', 'علوم وتكنولوجيا', 'دليل الأستاذ', 'النصوص التفسيرية', 'التلخيص']
    },
    {
        id: 'guide-2as',
        driveId: '1MNCs_KF6C3SeOjx0pLrHUB6cZ-uTV4zN',
        title: 'دليل الأستاذ لمرحلة التعليم الثانوي - السنة الثانية ثانوي',
        category: 'guides',
        categoryLabel: 'أدلة الأستاذ',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثانية ثانوي'],
        streams: ['آداب وفلسفة', 'لغات أجنبية', 'علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد'],
        format: 'PDF',
        fileSizeApprox: '5.2 MB',
        description: 'الدليل الرسمي الشامل لمقرر السنة الثانية ثانوي. يغطي محاور الأدب العباسي الأول والثاني وأدب المغرب والأندلس، مع إرشادات معالجة الأنماط النصية (الحجاجي، الإيعازي، التفسيري)، وبناء الوضعيات التقييمية التكوينية.',
        tableOfContents: [
            'التوجهات العامة لمنهاج السنة الثانية ثانوي',
            'مصفوفة كفاءات الوحدات التعليمية (أدب عباسي وأندلسي)',
            'منهجية معالجة النصوص الأدبية والتواصلية',
            'الظواهر اللغوية والبلاغية وتطبيقاتها التحليلية',
            'بيداغوجيا الإدماج وتصميم الوضعيات المشكلة'
        ],
        keyCompetencies: ['تحليل النص الأدبي القديم والحديث', 'التمييز بين الأنماط النصية', 'إتقان فن المناظرة والحجاج'],
        didacticStrategies: ['فكر-زاوج-شارك', 'لعب الأدوار والمناظرة', 'الخرائط الذهنية'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1MNCs_KF6C3SeOjx0pLrHUB6cZ-uTV4zN/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1MNCs_KF6C3SeOjx0pLrHUB6cZ-uTV4zN',
        tags: ['س2 ثانوي', 'دليل الأستاذ', 'الأدب العباسي', 'الأدب الأندلسي', 'الحجاج']
    },
    {
        id: 'guide-3as-bac',
        driveId: '1vSVfOEZsbcMXsQx3mDzbcgkWVw3pH1Xp',
        title: 'دليل الأستاذ لمرحلة التعليم الثانوي - السنة الثالثة ثانوي (البكالوريا)',
        category: 'guides',
        categoryLabel: 'أدلة الأستاذ',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثالثة ثانوي'],
        streams: ['جميع الشعب العلمية والأدبية', 'شعب البكالوريا'],
        format: 'PDF',
        fileSizeApprox: '6.7 MB',
        description: 'الدليل التربوي والمنهجي لأستاذ السنة الثالثة ثانوي. يوضح بالتفصيل محاور الأدب في عصر الضعف والانحطاط، عصر النهضة، والشعر العربي المعاصر (القضية الفلسطينية، الثورة التحريرية، ظواهر الحزن والألم والرمز والأسطورة)، مع التوجيهات الرسمية لإعداد امتحان البكالوريا.',
        tableOfContents: [
            'الكفاءة الختامية الشاملة لمرحلة التعليم الثانوي والتحضير للبكالوريا',
            'محاور البرنامج السنوي لجميع الشعب (عصر الانحطاط، المهجر، الشعر المعاصر)',
            'الظواهر النقدية المعاصرة: الالتزام، الرمز والأسطورة، ظاهرة الحزن والألم',
            'القواعد والبلاغة المقررة وموقعها في امتحان شهادة البكالوريا',
            'معايير بناء موضوع امتحان البكالوريا وشبكة التنقيط الرسمية'
        ],
        keyCompetencies: ['التحليل الأدبي والنقدي للنصوص المعاصرة', 'استيعاب قضايا الأمة التحررية في الشعر', 'التحكم في معايير البكالوريا الرسمية'],
        didacticStrategies: ['الكرسي الساخن', 'المناظرة الصفية', 'تحليل مواضيع البكالوريا الرسمية', 'الكرسي الخبير'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1vSVfOEZsbcMXsQx3mDzbcgkWVw3pH1Xp/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1vSVfOEZsbcMXsQx3mDzbcgkWVw3pH1Xp',
        tags: ['س3 ثانوي', 'دليل الأستاذ', 'البكالوريا', 'فلسطين في الشعر', 'الثورة الجزائرية', 'الالتزام'],
        isFeatured: true
    },
    {
        id: 'guide-strategies',
        driveId: '19LY5Q8AncsJ9QfCO-Bj52SC25yObL4SH',
        title: 'دليل الاستراتيجيات التعليمية والتعلم النشط في القسم',
        category: 'guides',
        categoryLabel: 'أدلة الأستاذ',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['التعليم الابتدائي', 'التعليم المتوسط', 'التعليم الثانوي'],
        streams: ['جميع التخصصات والشعب'],
        format: 'PDF',
        fileSizeApprox: '3.8 MB',
        description: 'دليل تفتيشي شامل يشرح استراتيجيات التدريس الفعالة الموصى بها في التفتيش الرسمي الجزائري: فكر-زاوج-شارك (Think-Pair-Share)، الكرسي الساخن، لعب الأدوار، جيكسو (المجموعات المتشابكة)، خرائط المفاهيم، القبعات الست، ومسرحة المناهج.',
        tableOfContents: [
            'مفهوم التعلم النشط والفارق بين التعليم التقليدي والحديث',
            'استراتيجيات التعلم الفردي والتعاوني داخل حجرة التدريس',
            'خطوات تنفيذ استراتيجية فكر-زاوج-شارك بدقة',
            'استراتيجية الكرسي الساخن وإدارة النقاش والحوار',
            'توظيف خرائط المفاهيم لتثبيت القواعد اللغوية والنحوية'
        ],
        keyCompetencies: ['تفعيل دور المتعلم', 'تسيير العمل الجماعي والتعاوني', 'إثارة الدافعية وبناء التفكير النقدي'],
        didacticStrategies: ['فكر-زاوج-شارك', 'الكرسي الساخن', 'لعب الأدوار', 'جيكسو', 'خرائط المفاهيم'],
        ministryReference: 'المفتشية العامة للبيداغوجيا - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/19LY5Q8AncsJ9QfCO-Bj52SC25yObL4SH/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=19LY5Q8AncsJ9QfCO-Bj52SC25yObL4SH',
        tags: ['استراتيجيات التدريس', 'التعلم النشط', 'التفتيش التربوي', 'فكر زاوج شارك', 'الكرسي الساخن'],
        isFeatured: true
    },
    {
        id: 'guide-new-teachers',
        driveId: '1EMetlaYZ-wiDSCIYd8vVYcwokprPJAW-',
        title: 'إرشادات مهنية وبيداغوجية موجهة للمدرسين المبتدئين',
        category: 'guides',
        categoryLabel: 'أدلة الأستاذ',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['جميع المستويات'],
        streams: ['جميع الأساتذة الجدد'],
        format: 'PDF',
        fileSizeApprox: '2.1 MB',
        description: 'دليل توجيهي رسمي صادر عن التفتيش التربوي لمرافقة الأستاذ في أولى سنوات التدريس. يقدم نصائح عملية لإدارة القسم، كيفية إعداد المذكرة التربوية، التعامل مع الفروق الفردية، وتوثيق السجلات الإدارية والبيداغوجية.',
        tableOfContents: [
            'التحضير للدرس وإعداد دفتر النصوص والمذكرة',
            'إدارة الصف وضبط السلوك بأساليب تربوية',
            'العلاقة المهنية مع الإدارة، الزملاء، والأولياء',
            'كيفية مواجهة المواقف الصفية الصعبة والمحرجة'
        ],
        keyCompetencies: ['الإدارة الصفية الرشيدة', 'إعداد الوثائق البيداغوجية النظامية', 'الانضباط والمهنية التربوية'],
        ministryReference: 'المفتشية العامة للتربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1EMetlaYZ-wiDSCIYd8vVYcwokprPJAW-/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1EMetlaYZ-wiDSCIYd8vVYcwokprPJAW-',
        tags: ['الأساتذة الجدد', 'إرشادات بيداغوجية', 'إدارة الصف', 'التحضير الميداني']
    },

    // ══════════════════════════════════════════════════════════════
    // 2. المناهج والوثائق المرافقة (Curricula & Accompanying Docs)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'curriculum-1as',
        driveId: '1YimvW2MFmutxf_dzyB49Mk-ob3u8mija',
        title: 'منهاج اللغة العربية وآدابها - السنة الأولى ثانوي',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الأولى ثانوي'],
        streams: ['جذع مشترك آداب', 'جذع مشترك علوم وتكنولوجيا'],
        format: 'DOC',
        fileSizeApprox: '3.6 MB',
        description: 'المنهاج الوزاري الرسمي للسنة الأولى ثانوي. يحدد تقديم المادة، الكفاءات الختامية والخاصة، المحتويات المعرفية، أنشطة التعبير الشفوي والكتابي، والظواهر النحوية والبلاغية المقررة.',
        tableOfContents: [
            'تقديم المادة والمنطلقات النظرية',
            'ملمح التخرج من مرحلة التعليم المتوسط ودخول الثانوي',
            'الكفاءات المستهدفة والمحتويات المعرفية المقررة',
            'طرائق التدريس وأساليب التقويم التربوي'
        ],
        keyCompetencies: ['التواصل اللغوي السليم', 'التحليل البلاغي والأدبي الأولي', 'تطبيق القواعد النحوية في الإنتاج'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1YimvW2MFmutxf_dzyB49Mk-ob3u8mija/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1YimvW2MFmutxf_dzyB49Mk-ob3u8mija',
        tags: ['منهاج رسمي', 'س1 ثانوي', 'الكفاءات', 'المحتويات المعرفية']
    },
    {
        id: 'companion-1as',
        driveId: '1LsLFs2o9OzvXFSkqEa4qKS5A6tEzfWp6',
        title: 'الوثيقة المرافقة لمنهاج اللغة العربية - السنة الأولى ثانوي',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الأولى ثانوي'],
        streams: ['جذع مشترك آداب', 'جذع مشترك علوم وتكنولوجيا'],
        format: 'DOC',
        fileSizeApprox: '2.8 MB',
        description: 'الوثيقة المرافقة الرسمية التي تفكك المنهاج إلى ممارسات صفية إجرائية. تشرح أساليب بناء الوضعيات التعلمية، إعداد بطاقة الحصة، كيفية توظيف السندات والنصوص، وتقييم الكفاءات.',
        tableOfContents: [
            'كيفية قراءة المنهاج وتفسير كفاءاته ومؤشراته',
            'تطبيق المقاربة النصية والمقاربة التواصلية',
            'نماذج بطاقات بيداغوجية لمختلف الأنشطة',
            'التقويم التشخيصي والتكويني والتحصيلي'
        ],
        keyCompetencies: ['تفعيل المقاربة النصية', 'إعداد البطاقة البيداغوجية التفتيشية', 'تصميم السندات التعليمية'],
        ministryReference: 'اللجنة الوطنية للمناهج - مديرية التعليم الثانوي',
        driveViewUrl: 'https://drive.google.com/file/d/1LsLFs2o9OzvXFSkqEa4qKS5A6tEzfWp6/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1LsLFs2o9OzvXFSkqEa4qKS5A6tEzfWp6',
        tags: ['الوثيقة المرافقة', 'س1 ثانوي', 'المقاربة النصية', 'البطاقة البيداغوجية']
    },
    {
        id: 'curriculum-2as-arts',
        driveId: '1sCf9IiMTqsun0iA0y3x4eay3re607xIo',
        title: 'منهاج السنة الثانية ثانوي - شعبة آداب وفلسفة',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثانية ثانوي'],
        streams: ['شعبة آداب وفلسفة'],
        format: 'DOC',
        fileSizeApprox: '2.4 MB',
        description: 'المنهاج الرسمي لمادة اللغة العربية وآدابها لشعبة الآداب والفلسفة. يركز على الأدب في العصر العباسي، أدب المغرب والأندلس، والمظاهر التجديدية في الشعر والنثر مع تعميق الفكر النقدي والحجاج.',
        tableOfContents: [
            'الكفاءة الختامية لشعبة الآداب والفلسفة',
            'الوحدات التعليمية ومصفوفة المعارف الأدبية والنقدية',
            'قواعد اللغة، البلاغة، وعلم العروض',
            'التعبير الكتابي: فن المقالة، النمط الحجاجي، ودراسة النصوص الفكرية'
        ],
        keyCompetencies: ['التحليل الفلسفي والنقدي للنصوص الأدبية', 'إتقان النمط الحجاجي والمناظرة', 'استيعاب تطور الأدب العربي في عصوره الذهبية'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1sCf9IiMTqsun0iA0y3x4eay3re607xIo/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1sCf9IiMTqsun0iA0y3x4eay3re607xIo',
        tags: ['س2 ثانوي', 'آداب وفلسفة', 'المنهاج الرسمي', 'الأدب العباسي', 'الأدب الأندلسي']
    },
    {
        id: 'curriculum-2as-science',
        driveId: '16scr2eLvgUi2rT26GK8SAZ85DepHaP5H',
        title: 'منهاج السنة الثانية ثانوي - شعب علوم تجريبية ورياضيات',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثانية ثانوي'],
        streams: ['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد'],
        format: 'DOC',
        fileSizeApprox: '1.9 MB',
        description: 'المنهاج الرسمي المكيف للشعب العلمية والتكنولوجية. يهدف إلى تمكين المتعلم من التفكير العلمي، استثمار المصطلحات، وفهم وتحليل النصوص التفسيرية والعلمية وإعداد التقارير والتلخيصات.',
        tableOfContents: [
            'أهداف المنهاج للشعب العلمية والرياضية',
            'توزيع الوحدات ومواقيتها الأسبوعية',
            'الأنشطة اللغوية الموجهة لدعم الدقة التعبيرية',
            'الوضعيات الإدماجية ذات الطابع العلمي والفكري'
        ],
        keyCompetencies: ['التواصل باللسان العلمي الدقيق', 'التلخيص والتركيب المعرفي', 'تحليل النصوص التفسيرية'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/16scr2eLvgUi2rT26GK8SAZ85DepHaP5H/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=16scr2eLvgUi2rT26GK8SAZ85DepHaP5H',
        tags: ['س2 ثانوي', 'علوم تجريبية', 'رياضيات', 'المنهاج الرسمي', 'تفكير علمي']
    },
    {
        id: 'companion-2as',
        driveId: '1Mfs9zPiJlkQrRQSUmxYCOc_R9-jhmh7I',
        title: 'الوثيقة المرافقة لمنهاج السنة الثانية ثانوي (جميع الشعب)',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثانية ثانوي'],
        streams: ['جميع الشعب العلمية والأدبية'],
        format: 'DOC',
        fileSizeApprox: '3.1 MB',
        description: 'المرجع التطبيقي لمرافقة منهاج س2 ثانوي. تشرح بالتفصيل كيفية بناء الكفاءة المرحلية، منهجية تدريس النصوص التراثية، استثمار البلاغة في خدمة المعنى، وتصميم شبكات التقييم.',
        tableOfContents: [
            'المنطلقات المنهجية لتطبيق المنهاج في الميدان',
            'إجراءات تدريس النص الأدبي والرافد اللغوي',
            'استراتيجيات معالجة أنماط النصوص (حجاجي، تفسيري، إيعازي)',
            'نماذج لشبكات التقويم والمعالجة البيداغوجية'
        ],
        keyCompetencies: ['التدريس بالمقاربة النصية', 'التخطيط الفصلي للمقاطع', 'تصميم وضعيات الإدماج'],
        ministryReference: 'اللجنة الوطنية للمناهج - مديرية التعليم الثانوي',
        driveViewUrl: 'https://drive.google.com/file/d/1Mfs9zPiJlkQrRQSUmxYCOc_R9-jhmh7I/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1Mfs9zPiJlkQrRQSUmxYCOc_R9-jhmh7I',
        tags: ['الوثيقة المرافقة', 'س2 ثانوي', 'شبكات التقويم', 'بيداغوجيا الإدماج']
    },
    {
        id: 'curriculum-3as-science',
        driveId: '1vs62BhBu52Ral7QcI3FXwwf36i7eD_Up',
        title: 'منهاج اللغة العربية وآدابها - السنة الثالثة ثانوي (الشعب العلمية)',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثالثة ثانوي'],
        streams: ['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد'],
        format: 'DOC',
        fileSizeApprox: '2.5 MB',
        description: 'المنهاج الرسمي لشعب البكالوريا العلمية. يركز على تزويد المتعلم بزاد لغوي وفكري يمكنه من التفاعل مع متطلبات العصر، دراسة نصوص عصر الضعف والانحطاط، عصر النهضة، والشعر الحديث والمعاصر (القضية الفلسطينية والثورة التحريرية).',
        tableOfContents: [
            'أهداف المنهاج للشعب العلمية وملمح التخرج في البكالوريا',
            'الوحدات التعليمية السنوية وتوزيع الساعات',
            'الظواهر اللغوية (إعراب إذ وإذا وحينئذ، البدل وعطف البيان، الجمل التي لها محل والتي لا محل لها)',
            'التعبير الكتابي: التلخيص الموضوعي وكتابة المقال الفكري'
        ],
        keyCompetencies: ['تحليل النصوص الأدبية والفكرية الحديثة', 'التلخيص الدقيق والمنهجي', 'التفوق في موضوع اللغة العربية في البكالوريا'],
        ministryReference: 'اللجنة الوطنية للمناهج - مديرية التعليم الثانوي العام والتكنولوجي',
        driveViewUrl: 'https://drive.google.com/file/d/1vs62BhBu52Ral7QcI3FXwwf36i7eD_Up/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1vs62BhBu52Ral7QcI3FXwwf36i7eD_Up',
        tags: ['منهاج س3', 'الشعب العلمية', 'البكالوريا', 'فلسطين في الشعر', 'القواعد والبلاغة'],
        isFeatured: true
    },
    {
        id: 'curriculum-3as-arts',
        driveId: '1rzNx_Ecadghj7PCeWiLoJ7Smvm_r9h29',
        title: 'منهاج اللغة العربية وآدابها - س3 ثانوي (آداب وفلسفة ولغات)',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثالثة ثانوي'],
        streams: ['آداب وفلسفة', 'لغات أجنبية'],
        format: 'DOC',
        fileSizeApprox: '3.2 MB',
        description: 'المنهاج التخصصي لأقسام البكالوريا الأدبية. يتضمن دراسة معمقة للأدب العربي المعاصر، شعر المنفى والمهجر، شعر الثورة التحريرية، القضية الفلسطينية، المقال الأدبي والسياسي، ونظريات النقد الحديث كالاتساق والانسجام والرمز والأسطورة.',
        tableOfContents: [
            'الكفاءة الختامية لأقسام الآداب واللغات في البكالوريا',
            'الوحدات التعليمية النقدية والأدبية والبلاغية',
            'علم العروض وتطور موسيقى الشعر (الشعر الحر والتفعيلة)',
            'النقد الأدبي: المدارس الأدبية (الإحيائية، الرومانسية، الواقعية، الرمزية)',
            'مواصفات موضوع البكالوريا وأساليب التقييم'
        ],
        keyCompetencies: ['التحليل النقدي الأدبي الشامل', 'كتابة المقال النقدي الفكري الموسع', 'فهم موسيقى الشعر الحر والتفعيلة'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1rzNx_Ecadghj7PCeWiLoJ7Smvm_r9h29/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1rzNx_Ecadghj7PCeWiLoJ7Smvm_r9h29',
        tags: ['منهاج س3', 'آداب وفلسفة', 'لغات أجنبية', 'البكالوريا', 'النقد الأدبي', 'شعر التفعيلة'],
        isFeatured: true
    },
    {
        id: 'companion-3as-all',
        driveId: '1ttr5BUphdZHu_mt2Mm5MmMAVZnr65Ex1',
        title: 'الوثيقة المرافقة لمنهاج السنة الثالثة ثانوي (جميع الشعب)',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['السنة الثالثة ثانوي'],
        streams: ['جميع الشعب العلمية والأدبية'],
        format: 'DOC',
        fileSizeApprox: '4.8 MB',
        description: 'الوثيقة التوجيهية الكبرى لأستاذ البكالوريا. تتضمن توجيهات مفصلة لإجراءات تدريس النصوص، شروط التلخيص الصحيح، استكشاف مظاهر الاتساق والانسجام، تفعيل المطالعة الموجهة، وبناء وضعيات الإدماج التقييمية.',
        tableOfContents: [
            'منهجية معالجة النصوص الأدبية والتواصلية في س3',
            'قواعد وإجراءات التلخيص الموضوعي وفق المقاربة بالكفاءات',
            'اكتشاف مظاهر الاتساق والانسجام في تركيب فقرات النص',
            'المطالعة الموجهة وأهميتها التربوية في المرحلة الثانوية',
            'التعبير الكتابي وتفعيل الموارد المكتسبة وفق معايير البكالوريا'
        ],
        keyCompetencies: ['إتقان خطوات التلخيص المعتمد وزارياً', 'استخراج مظاهر الاتساق والانسجام النحوي والدلالي', 'هندسة الوضعيات الإدماجية'],
        didacticStrategies: ['المقاربة النصية', 'القراءة الفاحصة المتدرجة', 'شبكات التقييم الذاتي'],
        ministryReference: 'اللجنة الوطنية للمناهج - مديرية التعليم الثانوي',
        driveViewUrl: 'https://drive.google.com/file/d/1ttr5BUphdZHu_mt2Mm5MmMAVZnr65Ex1/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1ttr5BUphdZHu_mt2Mm5MmMAVZnr65Ex1',
        tags: ['الوثيقة المرافقة', 'س3 ثانوي', 'التلخيص', 'الاتساق والانسجام', 'البكالوريا'],
        isFeatured: true
    },
    {
        id: 'curriculum-general-reference',
        driveId: '12BgbZnfM2Kpx7WHhXDUOlJLakPGmCwyc',
        title: 'المرجعية العامة للمناهج التعليمية الجزائرية',
        category: 'curricula',
        categoryLabel: 'المناهج والوثائق المرافقة',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['الابتدائي', 'المتوسط', 'الثانوي'],
        streams: ['الإطار العام للمنظومة التربوية'],
        format: 'PDF',
        fileSizeApprox: '5.9 MB',
        description: 'الوثيقة المرجعية الرسمية الكبرى لإصلاح المنظومة التربوية في الجزائر. تحدد فلسفة التعليم، القيم الوطنية والإنسانية، مبادئ المقاربة بالكفاءات، ومواصفات المتعلم الجزائري في جميع الأطوار التعليمية.',
        tableOfContents: [
            'الأسس الفلسفية والاجتماعية والثقافية للمنظومة التربوية',
            'المقاربة بالكفاءات: الأسس النظرية والمفاهيمية',
            'مصفوفة القيم والكفاءات العرضية المشتركة بين المواد',
            'استراتيجيات التقويم التربوي ونظام الامتحانات الرسمية'
        ],
        keyCompetencies: ['استيعاب فلسفة المنظومة التربوية الجزائرية', 'تطبيق الكفاءات العرضية في التعليم', 'التربية على المواطنة والقيم'],
        ministryReference: 'اللجنة الوطنية للمناهج - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/12BgbZnfM2Kpx7WHhXDUOlJLakPGmCwyc/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=12BgbZnfM2Kpx7WHhXDUOlJLakPGmCwyc',
        tags: ['المرجعية العامة للمناهج', 'إصلاح المنظومة التربوية', 'المقاربة بالكفاءات', 'القيم الوطنية']
    },

    // ══════════════════════════════════════════════════════════════
    // 3. التشريع والتنظيم التربوي (Legislation & School Admin)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'leg-org-timetable',
        driveId: '15AplSePMY7FdMUny9idrZaw9xtjmKJXB',
        title: 'التنظيم التربوي والتوقيت الأسبوعي لأستاذ التعليم الثانوي',
        category: 'legislation',
        categoryLabel: 'التشريع والتنظيم التربوي',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['جميع المستويات'],
        streams: ['جميع الأساتذة والإداريين'],
        format: 'PDF',
        fileSizeApprox: '1.8 MB',
        description: 'الدليل التنظيمي الرسمي المعتمد لتوزيع الحصص، حساب ساعات العمل النظامية، توزيع الأفواج التربوية، فترات الاستراحة الصباحية، وتنسيق الأنشطة البيداغوجية داخل الثانوية.',
        tableOfContents: [
            'حجم الساعات الأسبوعية القانوني لأستاذ التعليم الثانوي (18 ساعة)',
            'معايير إسناد الأفواج التربوية والمستويات الدراسية',
            'نظام الاستراحة الرسمية في الطور الثانوي (صباحية فقط 10:00 - 10:10)',
            'تنسيق المجالس التعليمية والندوات الداخلية'
        ],
        keyCompetencies: ['احترام التنظيم البيداغوجي الرسمي', 'إعداد جداول التوقيت المتوازنة', 'الالتزام بالحجم الساعي القانوني'],
        ministryReference: 'مديرية التعليم الثانوي - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/15AplSePMY7FdMUny9idrZaw9xtjmKJXB/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=15AplSePMY7FdMUny9idrZaw9xtjmKJXB',
        tags: ['التنظيم التربوي', 'التوقيت الأسبوعي', 'الأفواج التربوية', 'النصاب الساعي'],
        isFeatured: true
    },
    {
        id: 'leg-timings-coeffs',
        driveId: '1Qbk8lbxt9sl61i9fMdSNE5ERQ6CW6Wm_',
        title: 'مواقيت ومعاملات التعليم الثانوي لجميع الشعب والمستويات',
        category: 'legislation',
        categoryLabel: 'التشريع والتنظيم التربوي',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['س1 ثانوي', 'س2 ثانوي', 'س3 ثانوي'],
        streams: ['جميع الشعب الأدبية والعلمية والتكنولوجية'],
        format: 'PDF',
        fileSizeApprox: '2.6 MB',
        description: 'القرار الوزاري الرسمي المحدد لمواقيت ومعاملات جميع المواد التعليمية في الطور الثانوي العام والتكنولوجي. مرجع أساسي لحساب المعدلات، برمجة الفروض والاختبارات، وتوزيع الحصص الأسبوعية.',
        tableOfContents: [
            'جدول مواقيت ومعاملات الجذوع المشتركة س1 ثانوي',
            'جدول مواقيت ومعاملات السنة الثانية ثانوي لمختلف الشعب الست',
            'جدول مواقيت ومعاملات السنة الثالثة ثانوي المقررة في البكالوريا',
            'أحكام التقييم المستمر وحساب المعدلات الفصلية والسنوية'
        ],
        keyCompetencies: ['حساب معاملات المواد بدقة', 'برمجة التوقيت الأسبوعي وفق المعاملات الرسمية'],
        ministryReference: 'وزارة التربية الوطنية - القرار الوزاري الرسمي',
        driveViewUrl: 'https://drive.google.com/file/d/1Qbk8lbxt9sl61i9fMdSNE5ERQ6CW6Wm_/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1Qbk8lbxt9sl61i9fMdSNE5ERQ6CW6Wm_',
        tags: ['المواقيت والمعاملات', 'معاملات المواد', 'البكالوريا', 'التنظيم التربوي'],
        isFeatured: true
    },
    {
        id: 'leg-guidance-law',
        driveId: '1T_y1vWx_RuyvpF1bkgLpB28b1Y38-wR2',
        title: 'القانون التوجيهي للتربية الوطنية (قانون رقم 08-04)',
        category: 'legislation',
        categoryLabel: 'التشريع والتنظيم التربوي',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['جميع المستويات'],
        streams: ['النص التشريعي الأساسي'],
        format: 'PDF',
        fileSizeApprox: '4.5 MB',
        description: 'القانون التوجيهي للتربية الوطنية المؤرخ في 23 جانفي 2008. يُعد الدستور التربوي للجزائر، ويحدد غايات التربية الوطنية، إجبارية ومجانية التعليم، حقوق وواجبات التلاميذ والأساتذة، وتنظيم الحياة المدرسية.',
        tableOfContents: [
            'الباب الأول: أسس المدرسة الجزائرية وغاياتها',
            'الباب الثاني: تنظيم التمدرس في الأطوار الثلاثة',
            'الباب الثالث: الجماعة التربوية وحقوق وواجبات الأستاذ',
            'الباب الرابع: التفتيش والتقويم وضمان الجودة المدرسية'
        ],
        keyCompetencies: ['فهم الإطار القانوني للتربية الوطنية', 'معرفة حقوق وواجبات الأستاذ والتلميذ'],
        ministryReference: 'الجريدة الرسمية للجمهورية الجزائرية - قانون 08-04',
        driveViewUrl: 'https://drive.google.com/file/d/1T_y1vWx_RuyvpF1bkgLpB28b1Y38-wR2/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1T_y1vWx_RuyvpF1bkgLpB28b1Y38-wR2',
        tags: ['القانون التوجيهي', 'قانون 08-04', 'التشريع المدرسي', 'حقوق وواجبات']
    },
    {
        id: 'leg-civil-service',
        driveId: '1jOyMFwje_eVOnsACSyM9fWPbze0eB92N',
        title: 'الأمر رقم 06-03 - القانون الأساسي العام للوظيفة العمومية',
        category: 'legislation',
        categoryLabel: 'التشريع والتنظيم التربوي',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['جميع المستويات'],
        streams: ['جميع الموظفين'],
        format: 'PDF',
        fileSizeApprox: '3.7 MB',
        description: 'الأمر الرئاسي 06-03 المحدد للقواعد العامة المطبقة على الموظفين العموميين، بما فيهم موظفو قطاع التربية الوطنية: حقوق الموظف، التزاماته المهنية، نظام الترقية، العطل والغيابات، والتأديب.',
        tableOfContents: [
            'علاقة العمل وحقوق وواجبات الموظف العام',
            'التوظيف، التربص، التثبيت، والترقية في الدرجات والرتب',
            'النظام التأديبي والضمانات القانونية للموظف',
            'أحكام العطل السنوية والمرضية والاستثنائية'
        ],
        keyCompetencies: ['الإلمام بحقوق الموظف وواجباته في القانون الجزائري'],
        ministryReference: 'الجمهورية الجزائرية - الأمر رقم 06-03',
        driveViewUrl: 'https://drive.google.com/file/d/1jOyMFwje_eVOnsACSyM9fWPbze0eB92N/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1jOyMFwje_eVOnsACSyM9fWPbze0eB92N',
        tags: ['الوظيفة العمومية', 'أمر 06-03', 'حقوق الموظف', 'الترقية والعطل']
    },
    {
        id: 'leg-titularization',
        driveId: '1CTbXsbmMmfvpp49XlCrqOfElHoTFtmmZ',
        title: 'دليل زيارة التثبيت والترسيم واختبارات التفتيش البيداغوجي',
        category: 'legislation',
        categoryLabel: 'التشريع والتنظيم التربوي',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['الأساتذة المتربصون'],
        streams: ['جميع التخصصات'],
        format: 'PDF',
        fileSizeApprox: '2.9 MB',
        description: 'الدليل الإجرائي الرسمي لزيارة التثبيت والترسيم للأساتذة المتربصين. يشمل مراحل الزيارة، تفقد الوثائق والدفاتر الإلزامية، معاينة الحصة التعليمية، شبكة الملاحظة التفتيشية، وجلسة المناقشة الشفوية.',
        tableOfContents: [
            'الوثائق الإلزامية المطلوبة يوم التثبيت (المذكرات، الكراس اليومي، دفتر النصوص، التوزيع السنوي)',
            'شبكة تقويم الأداء التربوي والبيداغوجي للأستاذ داخل الصف',
            'مراحل مناقشة الحصة مع لجنة التثبيت المفتشية',
            'التقرير النهائي وشروط منح الترسيم الرسمي'
        ],
        keyCompetencies: ['الاستعداد التام لزيارة التفتيش والتثبيت', 'تنظيم الوثائق البيداغوجية وفق المعايير الوزارية'],
        ministryReference: 'المفتشية العامة للبيداغوجيا - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1CTbXsbmMmfvpp49XlCrqOfElHoTFtmmZ/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1CTbXsbmMmfvpp49XlCrqOfElHoTFtmmZ',
        tags: ['زيارة التثبيت', 'الترسيم', 'التفتيش البيداغوجي', 'الدفاتر الإلزامية', 'الأساتذة المتربصون'],
        isFeatured: true
    },
    {
        id: 'leg-seminars',
        driveId: '10LCfLKXwKolQrcso-mw0fy1_N5HiXHNJ',
        title: 'دليل الندوة التربوية ومراحل انعقادها وتوثيقها',
        category: 'legislation',
        categoryLabel: 'التشريع والتنظيم التربوي',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['جميع المستويات'],
        streams: ['جميع الأساتذة'],
        format: 'PDF',
        fileSizeApprox: '1.7 MB',
        description: 'دليل تنظيم وتسيير الندوات التربوية الداخلية والولائية. يتناول آليات تبادل الخبرات بين الأساتذة، إعداد الدرس النموذجي، مناقشة الصعوبات البيداغوجية، وتحرير محضر الندوة التربوية.',
        tableOfContents: [
            'أهداف الندوات التربوية وأهميتها في التكوين المستمر',
            'خطوات التحضير للدرس الشاهد والنموذجي',
            'إدارة النقاش التربوي وصياغة التوصيات العملية',
            'النموذج الرسمي لمحضر جلسة الندوة التربوية'
        ],
        keyCompetencies: ['إعداد وتقديم الدروس النموذجية', 'المشاركة الفعالة في التكوين المستمر'],
        ministryReference: 'المفتشية العامة للبيداغوجيا',
        driveViewUrl: 'https://drive.google.com/file/d/10LCfLKXwKolQrcso-mw0fy1_N5HiXHNJ/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=10LCfLKXwKolQrcso-mw0fy1_N5HiXHNJ',
        tags: ['الندوات التربوية', 'التكوين المستمر', 'الدرس النموذجي', 'محضر الندوة']
    },

    // ══════════════════════════════════════════════════════════════
    // 4. التعليمية والديداكتيك والمقاربة بالكفاءات (Didactics & Assessment)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'did-competency-approach',
        driveId: '1C80QbqKCJRyDRQr4kNuPnNJSgYkN_NgM',
        title: 'المقاربة بالكفايات - الأسس النظرية والممارسات التطبيقية',
        category: 'didactics',
        categoryLabel: 'التعليمية واستراتيجيات التدريس',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['جميع المستويات'],
        streams: ['جميع الشعب'],
        format: 'PDF',
        fileSizeApprox: '5.1 MB',
        description: 'المرجع التكويني الشامل لفهم المقاربة بالكفاءات (APC) كما اعتمدتها المنظومة التربوية الجزائرية. يشرح الانتقال من بيداغوجيا الأهداف والمحتويات إلى بيداغوجيا الإدماج، وتصميم الوضعية المشكلة، وشبكات التقويم بالمعايير الأربعة (الملاءمة، الاستعمال السليم لأدوات المادة، الانسجام، الإتقان).',
        tableOfContents: [
            'المفاهيم الأساسية: الكفاءة، المورد، القدرة، والمهارة',
            'الفرق الجوهري بين التدريس بالأهداف والتدريس بالكفاءات',
            'هندسة الوضعية المشكلة الدالة ومكوناتها',
            'بيداغوجيا الإدماج ومراحل تفعيل الموارد',
            'شبكة التقييم بالمعايير ومؤشرات الإنجاز'
        ],
        keyCompetencies: ['هندسة الوضعيات التعلمية المركبة', 'صياغة معايير ومؤشرات التقويم', 'تطبيق بيداغوجيا الإدماج'],
        didacticStrategies: ['حل المشكلات', 'التعلم بالاستكشاف', 'التقويم بالمعايير'],
        ministryReference: 'المفتشية العامة للبيداغوجيا - وزارة التربية الوطنية',
        driveViewUrl: 'https://drive.google.com/file/d/1C80QbqKCJRyDRQr4kNuPnNJSgYkN_NgM/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1C80QbqKCJRyDRQr4kNuPnNJSgYkN_NgM',
        tags: ['المقاربة بالكفاءات', 'بيداغوجيا الإدماج', 'الوضعية المشكلة', 'معايير التقويم'],
        isFeatured: true
    },
    {
        id: 'did-pedagogical-dictionary',
        driveId: '1-15KC6yRpxx8xQ-6knDwV8Fj-uJjZWLr',
        title: 'المعجم التربوي والمصطلحات البيداغوجية الحديثة',
        category: 'didactics',
        categoryLabel: 'التعليمية واستراتيجيات التدريس',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['جميع المستويات'],
        streams: ['معجم مصطلحات'],
        format: 'PDF',
        fileSizeApprox: '4.3 MB',
        description: 'معجم موسوعي شامل يوثق جميع المصطلحات البيداغوجية والديداكتيكية المستخدمة في التفتيش والتقارير التربوية الرسمية: العقد الديداكتيكي، النقل الديداكتيكي، الكفاءة الختامية، الصراع المعرفي، التقويم المعياري والتقويم المحكي.',
        tableOfContents: [
            'مصطلحات التعليمية والديداكتيك العام والخاص',
            'مصطلحات نظريات التعلم والمعرفة (بنائية، سوسيوبنائية)',
            'مصطلحات التخطيط والتقويم والملاحظة البيداغوجية',
            'مسرد المصطلحات عربي - فرنسي'
        ],
        keyCompetencies: ['إتقان المصطلحات البيداغوجية التفتيشية', 'تحرير التقارير التربوية باحترافية'],
        ministryReference: 'وزارة التربية الوطنية - المعهد الوطني للبحث في التربية (INRE)',
        driveViewUrl: 'https://drive.google.com/file/d/1-15KC6yRpxx8xQ-6knDwV8Fj-uJjZWLr/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1-15KC6yRpxx8xQ-6knDwV8Fj-uJjZWLr',
        tags: ['المعجم التربوي', 'مصطلحات بيداغوجية', 'الديداكتيك', 'النقل الديداكتيكي']
    },
    {
        id: 'did-arabic-didactics',
        driveId: '19SsazmbV2YB-kVVcE_rnzWr-_tq6HMKG',
        title: 'تعليمية اللغة العربية - المقاربات النظرية والممارسات التطبيقية',
        category: 'didactics',
        categoryLabel: 'التعليمية واستراتيجيات التدريس',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['التعليم الثانوي والمتوسط'],
        streams: ['أساتذة اللغة العربية'],
        format: 'PDF',
        fileSizeApprox: '6.4 MB',
        description: 'دراسة مرجعية متخصصة في ديداكتيك مادة اللغة العربية. تتناول تعليمية القراءة والنصوص الأدبية، تعليمية النحو والقواعد عبر الاستقراء والاكتشاف، وتعليمية الإنتاج الكتابي والتعبير الإبداعي.',
        tableOfContents: [
            'ديداكتيك القراءة واستراتيجيات استنطاق النص الأدبي',
            'تعليمية النحو والصرف: من التلقين إلى الملاحظة والاستنتاج',
            'تعليمية التعبير الكتابي ومعالجة صعوبات التحرير',
            'توظيف الوسائط السمعية البصرية والتكنولوجية في حصة العربية'
        ],
        keyCompetencies: ['تعليم النحو بالاستقراء والاكتشاف', 'تنمية ملكة التذوق الأدبي والنقدي', 'تجاوز عوائق الإنتاج الكتابي'],
        didacticStrategies: ['الاستقراء والاستنتاج', 'القراءة التفاعلية', 'ورشات الكتابة'],
        ministryReference: 'مجموعة من المفتشين والباحثين التربويين',
        driveViewUrl: 'https://drive.google.com/file/d/19SsazmbV2YB-kVVcE_rnzWr-_tq6HMKG/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=19SsazmbV2YB-kVVcE_rnzWr-_tq6HMKG',
        tags: ['تعليمية اللغة العربية', 'ديداكتيك القراءة', 'ديداكتيك النحو', 'التعبير الكتابي']
    },
    {
        id: 'did-exam-rubric',
        driveId: '1EOoqFnL7sZMWC01wilvb03pIWK5HhyPW',
        title: 'شبكة تقويم وبناء موضوع الاختبار التحصيلي وفق المعايير الرسمية',
        category: 'didactics',
        categoryLabel: 'التعليمية واستراتيجيات التدريس',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['جميع المستويات الدراسية'],
        streams: ['جميع الأساتذة والممتحنين'],
        format: 'PPT',
        fileSizeApprox: '2.2 MB',
        description: 'عرض تقديمي وتدريبي تفتيشي حول كيفية صياغة أسئلة الامتحانات والفروض، بناء جدول المواصفات، احترام مستويات بلوم المعرفية (تذكر، فهم، تطبيق، تحليل، تركيب، تقويم)، وإعداد شبكة التصحيح وسلم التنقيط.',
        tableOfContents: [
            'مواصفات الاختبار التحصيلي الجيد (الصدق، الثبات، الشمولية)',
            'تصنيف بلوم وتوزع الأسئلة حسب المستويات المعرفية',
            'كيفية إعداد سلم التنقيط التفتيشي المفصل',
            'معايير تصحيح الوضعية الإدماجية (الملاءمة، الانسجام، أدوات المادة)'
        ],
        keyCompetencies: ['بناء مواضيع الاختبارات باحترافية', 'إعداد شبكات التصحيح الدقيقة', 'تفادي الأسئلة الغامضة أو المكررة'],
        ministryReference: 'المفتشية العامة للبيداغوجيا',
        driveViewUrl: 'https://drive.google.com/file/d/1EOoqFnL7sZMWC01wilvb03pIWK5HhyPW/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1EOoqFnL7sZMWC01wilvb03pIWK5HhyPW',
        tags: ['شبكة التقويم', 'بناء الاختبارات', 'سلم التنقيط', 'تصنيف بلوم']
    },

    // ══════════════════════════════════════════════════════════════
    // 5. المراجع اللغوية والبلاغية المساندة (Linguistics & Rhetoric)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'ling-balagha-wadiah',
        driveId: '1It0eqSXkCfwdFz7OUqTh4rkddmSntGEZ',
        title: 'البلاغة الواضحة وشروحها (البيان، المعاني، البديع)',
        category: 'linguistics',
        categoryLabel: 'المراجع اللغوية والبلاغية',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['س1 ثانوي', 'س2 ثانوي', 'س3 ثانوي'],
        streams: ['جميع الشعب العلمية والأدبية'],
        format: 'FOLDER',
        fileSizeApprox: 'مكتبة كاملة',
        description: 'المرجع البلاغي الأساسي المعتمد في كل كتب اللغة العربية في التعليم الثانوي. يغطي علوم البلاغة الثلاثة: البيان (التشبيه، الاستعارة، الكناية)، المعاني (الخبر والإنشاء، القصر، الإيجاز والإطناب)، والبديع (المحسنات اللفظية والمعنوية كالطباق والمقابلة والجناس والسجع).',
        tableOfContents: [
            'علم البيان: التشبيه وأقسامه وبلاغته، الاستعارة التصريحية والمكنية، الكناية',
            'علم المعاني: الأسلوب الخبري والإنشائي، صيغ الأمر والنهي والاستفهام، القصر والوصل والفصل',
            'علم البديع: المحسنات المعنوية (الطباق والمقابلة وحسن التعليل)، والمحسنات اللفظية (الجناس والسجع والاقتباس)'
        ],
        keyCompetencies: ['استخراج الصور البيانية وتبيان سر بلاغتها', 'تحليل الأساليب الإنشائية ومعانيها المجازية', 'الاستعانة بالمحسنات البديعية'],
        ministryReference: 'علي الجارم ومصطفى أمين - معتمد في المقررات الجزائرية',
        driveViewUrl: 'https://drive.google.com/drive/folders/1It0eqSXkCfwdFz7OUqTh4rkddmSntGEZ?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/drive/folders/1It0eqSXkCfwdFz7OUqTh4rkddmSntGEZ?usp=sharing',
        tags: ['البلاغة الواضحة', 'علم البيان', 'علم المعاني', 'علم البديع', 'الاستعارة', 'التشبيه'],
        isFeatured: true
    },
    {
        id: 'ling-nahw-wafi',
        driveId: '1BWpzWagZNYMD2WPNnObE8ZuFMfid5YrG',
        title: 'موسوعة النحو الوافي - عباس حسن (الأجزاء الكاملة)',
        category: 'linguistics',
        categoryLabel: 'المراجع اللغوية والبلاغية',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['مرجع تخصصي للأستاذ'],
        streams: ['أساتذة اللغة العربية والأدب'],
        format: 'FOLDER',
        fileSizeApprox: '4 مجلدات',
        description: 'أعظم موسوعة نحوية حديثة تجمع بين دقة القواعد القديمة وسهولة العرض المعاصر مع الشواهد القرآنية والشعرية. المرجع الأول لمفتشي وأساتذة اللغة العربية للبت في المسائل الإعرابية الدقيقة والتراكيب النحوية.',
        tableOfContents: [
            'المجلد الأول: الكلمة والكلام، المعرب والمبني، النكرة والمعرفة، المبتدأ والخبر',
            'المجلد الثاني: النواسخ، المفاعيل الخمسة، الحال والتمييز، الاستثناء',
            'المجلد الثالث: حروف الجر، الإضافة، المشتقات العاملة، إعراب الجمل',
            'المجلد الرابع: التوابع، الأساليب النحوية، أحكام العدد، والظواهر الإعرابية الخاصة'
        ],
        keyCompetencies: ['التمكن التام من دقائق الإعراب', 'حل الإشكالات النحوية الخلافية', 'تدعيم الدروس بالشواهد الموثوقة'],
        ministryReference: 'عباس حسن - دار المعارف',
        driveViewUrl: 'https://drive.google.com/drive/folders/1BWpzWagZNYMD2WPNnObE8ZuFMfid5YrG?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/drive/folders/1BWpzWagZNYMD2WPNnObE8ZuFMfid5YrG?usp=sharing',
        tags: ['النحو الوافي', 'عباس حسن', 'قواعد اللغة', 'إعراب الجمل', 'النواسخ'],
        isFeatured: true
    },
    {
        id: 'ling-easy-irab',
        driveId: '1ZKlgdfsfxnU0lbgTiw4eyvUkVMYMCLna',
        title: 'الإعراب الميسر في قواعد لغة الضاد وتطبيقاتها',
        category: 'linguistics',
        categoryLabel: 'المراجع اللغوية والبلاغية',
        level: 'ALL',
        levelLabel: 'جميع الأطوار',
        grades: ['التعليم المتوسط والثانوي'],
        streams: ['جميع التلاميذ والأساتذة'],
        format: 'PDF',
        fileSizeApprox: '3.4 MB',
        description: 'كتاب تطبيقي عملي مبسط يقدم جداول ونماذج إعرابية جاهزة وميسرة لمختلف التراكيب النحوية: إعراب الجمل التي لها محل والتي لا محل لها، إعراب إذ وإذا وإذن وحينئذ، إعراب التمييز والحال والبدل، وأدوات الشرط.',
        tableOfContents: [
            'جدول إعراب الجمل التي لها محل من الإعراب وتطبيقاتها',
            'جدول إعراب الجمل التي لا محل لها من الإعراب',
            'إعراب الأدوات والظروف الشائعة في البكالوريا',
            'نماذج إعرابية تطبيقية مشروحة خطوة بخطوة'
        ],
        keyCompetencies: ['إتقان إعراب الجمل والمفردات', 'تبسيط قواعد الإعراب للمتعلمين'],
        ministryReference: 'سلسلة المراجع اللغوية المساندة',
        driveViewUrl: 'https://drive.google.com/file/d/1ZKlgdfsfxnU0lbgTiw4eyvUkVMYMCLna/view?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1ZKlgdfsfxnU0lbgTiw4eyvUkVMYMCLna',
        tags: ['الإعراب الميسر', 'إعراب الجمل', 'البكالوريا', 'إذ وإذا', 'قواعد نحوية']
    },
    {
        id: 'ling-arabic-meters',
        driveId: '1JNXbKV7YoQHNOsOyenS0VIBKKK3sjEiE',
        title: 'بحور الشعر العربي وموسيقى التفعيلة وعلم العروض',
        category: 'linguistics',
        categoryLabel: 'المراجع اللغوية والبلاغية',
        level: 'HIGH',
        levelLabel: 'الطور الثانوي',
        grades: ['س1 ثانوي', 'س2 ثانوي', 'س3 ثانوي'],
        streams: ['شعب الآداب واللغات وجميع المهتمين بالشعر'],
        format: 'FOLDER',
        fileSizeApprox: 'مجموعة ملفات عروضية',
        description: 'حقيبة متكاملة في علم العروض وموسيقى الشعر العربي. تشمل مفاتيح البحور الستة عشر للخليلي، الكتابة العروضية، تقطيع الأبيات، الزحافات والعلل، وتطور القصيدة إلى شعر التفعيلة والشعر الحر المقرر في البكالوريا.',
        tableOfContents: [
            'أساسيات الكتابة العروضية والرموز الصوتية',
            'مفاتيح البحور الخليلية وأوزانها الشائعة (الطويل، البسيط، الكامل، الوافر، الخفيف)',
            'الزحافات والعلل وتأثيرها على النغمة الموسيقية',
            'علم القافية وأنواعها وعيوبها',
            'موسيقى شعر التفعيلة المعاصر وكسر الرتابة الوزنية'
        ],
        keyCompetencies: ['التقطيع العروضي السليم للأبيات', 'تحديد بحر القصيدة والزحافات والعلل', 'تحليل موسيقى شعر التفعيلة المعاصر'],
        ministryReference: 'المكتبة التراثية واللغوية المساندة',
        driveViewUrl: 'https://drive.google.com/drive/folders/1JNXbKV7YoQHNOsOyenS0VIBKKK3sjEiE?usp=sharing',
        driveDownloadUrl: 'https://drive.google.com/drive/folders/1JNXbKV7YoQHNOsOyenS0VIBKKK3sjEiE?usp=sharing',
        tags: ['علم العروض', 'بحور الشعر', 'التقطيع العروضي', 'شعر التفعيلة', 'القافية']
    }
];

// ══════════════════════════════════════════════════════════════
// فئات التصفية والإحصائيات
// ══════════════════════════════════════════════════════════════

export interface CategorySummary {
    id: GuideCategory | 'all';
    label: string;
    count: number;
    description: string;
}

export function getGuidesCategoriesSummary(): CategorySummary[] {
    const counts: Record<string, number> = {
        all: OFFICIAL_CURRICULUM_GUIDES.length,
        guides: 0,
        curricula: 0,
        legislation: 0,
        didactics: 0,
        linguistics: 0,
    };

    OFFICIAL_CURRICULUM_GUIDES.forEach(g => {
        if (counts[g.category] !== undefined) {
            counts[g.category]++;
        }
    });

    return [
        { id: 'all', label: 'جميع الوثائق الرسمية', count: counts.all, description: 'كافة الأدلة والمناهج والتشريع والمراجع الرسمية' },
        { id: 'guides', label: 'أدلة الأستاذ', count: counts.guides, description: 'الدليل التربوي الثانوي، أدلة س1، س2، س3 ودليل الاستراتيجيات' },
        { id: 'curricula', label: 'المناهج والوثائق المرافقة', count: counts.curricula, description: 'المناهج والوثائق المرافقة الرسمية لجميع الشعب والمستويات' },
        { id: 'legislation', label: 'التشريع والتنظيم التربوي', count: counts.legislation, description: 'التنظيم التربوي، المواقيت والمعاملات، دليل التثبيت، والقانون التوجيهي' },
        { id: 'didactics', label: 'التعليمية والديداكتيك', count: counts.didactics, description: 'المقاربة بالكفاءات، المعجم التربوي، تعليمية اللغة، وشبكات بناء الاختبارات' },
        { id: 'linguistics', label: 'المراجع اللغوية والبلاغية', count: counts.linguistics, description: 'البلاغة الواضحة، النحو الوافي، الإعراب الميسر، وبحور الشعر العربي' },
    ];
}

/**
 * دالة البحث المتقدم في الأدلة والمناهج الرسمية
 */
export function searchOfficialCurriculumGuides(params: {
    category?: GuideCategory | 'all';
    level?: string;
    grade?: string;
    search?: string;
}): CurriculumGuideItem[] {
    const { category, level, grade, search } = params;
    const cleanSearch = (search || '').trim().toLowerCase();

    return OFFICIAL_CURRICULUM_GUIDES.filter(item => {
        // فلترة الفئة
        if (category && category !== 'all' && item.category !== category) {
            return false;
        }

        // فلترة الطور
        if (level && level !== 'ALL') {
            const matchesLevel = item.level === 'ALL' || item.level === level;
            if (!matchesLevel) return false;
        }

        // فلترة المستوى الدراسي
        if (grade && grade.trim() !== '') {
            const matchesGrade = item.grades.some(g => g.includes(grade) || grade.includes(g)) || item.grades.includes('جميع المستويات');
            if (!matchesGrade) return false;
        }

        // البحث بالنص
        if (cleanSearch) {
            const inTitle = item.title.toLowerCase().includes(cleanSearch);
            const inDesc = item.description.toLowerCase().includes(cleanSearch);
            const inTags = item.tags.some(t => t.toLowerCase().includes(cleanSearch));
            const inRef = item.ministryReference.toLowerCase().includes(cleanSearch);
            const inComps = item.keyCompetencies?.some(c => c.toLowerCase().includes(cleanSearch));
            const inToc = item.tableOfContents?.some(tc => tc.toLowerCase().includes(cleanSearch));
            if (!inTitle && !inDesc && !inTags && !inRef && !inComps && !inToc) {
                return false;
            }
        }

        return true;
    });
}

/**
 * الحصول على دليل محدد بواسطة المعرف
 */
export function getGuideById(id: string): CurriculumGuideItem | undefined {
    return OFFICIAL_CURRICULUM_GUIDES.find(g => g.id === id || g.driveId === id);
}
