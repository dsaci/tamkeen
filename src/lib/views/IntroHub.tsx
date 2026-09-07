import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpenCheck, Zap, BarChart2, ClipboardList, Cpu,
  PenLine, Layers, Monitor, Calendar, Library, FileStack,
  BookOpen, CloudUpload, Sparkles, ArrowLeft, Sun, Moon,
  LogOut, ShieldCheck, Star, X, CheckCircle2,
  GraduationCap, ChevronRight, ChevronLeft, Play, Pause,
  Search, ArrowUpRight, Award, Compass, HeartHandshake,
  FileCheck2, Shield, BellRing, Home, Users
} from 'lucide-react';
import { TeacherProfile, TabType } from '../../types';
import { TamkeenLogoBrand as TamkeenLogo } from '../../components/ui/TamkeenLogo';
import { useVisitorCount } from '../../services/visitorService';

interface Props {
  profile: TeacherProfile;
  onNavigate: (tab: TabType | string) => void;
  onGoToLanding?: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'classroom' | 'ai' | 'interactive' | 'resources';
  categoryLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  gradient: string;
  glowColor: string;
  accentBorder: string;
  isAi?: boolean;
  isHot?: boolean;
  overview: string;
  benefits: string[];
  steps: { num: string; text: string; detail: string }[];
  proTip: string;
  tags: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: '/korras-yawmi',
    title: 'الكراس اليومي',
    subtitle: 'التدوين والمتابعة البيداغوجية للحصص',
    category: 'classroom',
    categoryLabel: 'الإدارة والتوثيق',
    icon: BookOpenCheck,
    gradient: 'from-emerald-400 via-teal-500 to-teal-700',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    accentBorder: 'border-teal-400/40',
    isHot: true,
    overview: 'الدفتر البيداغوجي الأساسي للأستاذ لتدوين الحصص اليومية، الكفاءات الختامية المستهدفة، مراحل الأنشطة، والغيابات وفق المتطلبات الوزارية الجزائرية.',
    benefits: [
      'توليد جاهز للطباعة متوافق 100% مع معايير مفتش التربية الوطنية.',
      'ربط تلقائي مع التوزيع السنوي والمخططات البيداغوجية للجيل الثاني.',
      'حفظ سحابي ومحلي فوري يحمي سجلاتك من الضياع والتلف.'
    ],
    steps: [
      { num: '1', text: 'اختيار الفوج والحصة', detail: 'حدد المستوى التعليمي، التوقيت، ورقم الحصة من جدولك الأسبوعي.' },
      { num: '2', text: 'إدراج الكفاءة والمحتوى', detail: 'اختر الميدان، الكفاءة المستهدفة، وسير الأنشطة التعليمية التعلمية.' },
      { num: '3', text: 'الاعتماد والطباعة', detail: 'احفظ الحصة مباشرة أو صدّر الكراس كملف PDF رسمي بختم المؤسسة.' }
    ],
    proTip: 'اجعل كراسك اليومي مرآة عاكسة لتنفيذ التدرج السنوي ولا تؤجل تدوين الحصة بعد انتهائها ليكون عملك مستوفياً لشروط التفتيش البيداغوجي.',
    tags: ['توثيق إلزامي', 'تصدير PDF', 'مطابق للمنهاج']
  },
  {
    id: '/mothakira-thakiya',
    title: 'المذكرة الذكية',
    subtitle: 'تحضير الدروس بالذكاء الاصطناعي',
    category: 'ai',
    categoryLabel: 'الذكاء الاصطناعي',
    icon: Zap,
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    glowColor: 'rgba(147, 51, 234, 0.4)',
    accentBorder: 'border-purple-400/40',
    isAi: true,
    isHot: true,
    overview: 'محرك بيداغوجي متطور لصياغة مذكرات الدروس النموذجية بمراحلها الثلاث (الانطلاق، بناء التعلمات، الاستثمار والتقويم) بأسلوب المقاربة بالكفاءات.',
    benefits: [
      'توفير ما يزيد عن 80% من وقت التحضير الذهني والكتابي اليدوي.',
      'صياغة وضعيات مشكلة وسياقات دالة متوافقة مع البيئة الجزائرية.',
      'إمكانية التخصيص الكامل والتعديل المباشر قبل الحفظ والتصدير.'
    ],
    steps: [
      { num: '1', text: 'تحديد معطيات الدرس', detail: 'أدخل المادة، المستوى التعليمي، المركبة، وعنوان الدرس المراد تحضيره.' },
      { num: '2', text: 'التوليد الذكي الفوري', detail: 'انقر على توليد بالذكاء الاصطناعي لبناء المذكرة المتكاملة مع عناصر التقييم.' },
      { num: '3', text: 'المراجعة والطباعة', detail: 'عدل ما تراه مناسباً ثم صدّر المذكرة بتنسيق أنيق مجهّز للطباعة.' }
    ],
    proTip: 'المذكرة الذكية توفر لك هيكلاً بيداغوجياً رصيناً؛ أضف إليها دائماً لمستك الذاتية وراعِ الفروق الفردية وواقع تلاميذ قسمك.',
    tags: ['ذكاء اصطناعي', 'المقاربة بالكفاءات', 'جاهز للطباعة']
  },
  {
    id: '/whiteboard',
    title: 'السبورة التفاعلية',
    subtitle: 'مساحة شرح صفي وأدوات هندسية',
    category: 'interactive',
    categoryLabel: 'التفاعل والشرح',
    icon: Compass,
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    accentBorder: 'border-orange-400/40',
    isHot: true,
    overview: 'سبورة ذكية متكاملة مصممة خصيصاً للشاشات التفاعلية وعارض البيانات (Data Show)، مزودة بأدوات الهندسة الدقيقة (مسطرة، منقلة، فرجار) وشبكات تربيعية.',
    benefits: [
      'رسم وكتابة متجاوبة تدعم اللمس والأقلام الضوئية بدقة عالية.',
      'أدوات هندسية تفاعلية تحاكي الأدوات الواقعية على السبورة الصفية.',
      'خلفيات متعددة (بيضاء، مسطرة، شبكة بيانية، سبورة كلاسيكية خضراء).'
    ],
    steps: [
      { num: '1', text: 'اختيار الخلفية المناسبة', detail: 'اختر خلفية مربعات للرياضيات، أسطر للغات، أو بيضاء حرة للرسم.' },
      { num: '2', text: 'استخدام أدوات الشرح', detail: 'استعن بالمسطرة أو الفرجار أو الأشكال الهندسية لتقديم المفاهيم بوضوح.' },
      { num: '3', text: 'حفظ وتصدير اللوحة', detail: 'احفظ ملخص الدرس كصورة عالية الدقة لمشاركتها مع التلاميذ عبر وسائل التواصل.' }
    ],
    proTip: 'قسّم السبورة إلى ثلاثة أقسام منتظمة: الهامش الأيمن للمفردات والملاحظات، الوسط لبناء الدرس، والأيسر للخلاصة والواجب المنزلي.',
    tags: ['شاشة تفاعلية', 'أدوات هندسة', 'خلفيات متنوعة']
  },
  {
    id: '/grading',
    title: 'دفتر التنقيط والتقويم',
    subtitle: 'رصد العلامات وحساب المعدلات آلياً',
    category: 'classroom',
    categoryLabel: 'الإدارة والتوثيق',
    icon: BarChart2,
    gradient: 'from-blue-500 via-indigo-600 to-cyan-700',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    accentBorder: 'border-blue-400/40',
    overview: 'نظام رقمي شامل لرصد علامات المراقبة المستمرة، الفروض، والاختبارات الفصلية مع احتساب المعدلات والتقديرات البيداغوجية آلياً وفق المناشير الرسمية.',
    benefits: [
      'حساب دقيق للمعدلات الفردية والجماعية بدون أخطاء حسابية يدوية.',
      'إحصائيات فورية لنسب النجاح والتوزيع التكراري لنقاط التلاميذ.',
      'تصدير كشوف النقاط الرسمية متوافقة مع نظام الرقمنة الوزاري.'
    ],
    steps: [
      { num: '1', text: 'تحديد الفوج والتقويم', detail: 'اختر القسم، المادة، والفصل الدراسي (الأول، الثاني، أو الثالث).' },
      { num: '2', text: 'رصد النقاط والملاحظات', detail: 'أدخل نقاط الفروض والاختبارات وتقويم الكراس والمشاركة الصفية.' },
      { num: '3', text: 'استخراج الكشوف والإحصائيات', detail: 'استعرض ترتيب التلاميذ واطبع محضر النقاط الرسمي لتقديمه للإدارة.' }
    ],
    proTip: 'استغل دفتر التنقيط لتشخيص التعثرات مبكراً عبر خانة الملاحظات النوعية ولا تكتفِ بالرقم المجرد.',
    tags: ['حساب تلقائي', 'إحصائيات ونسب', 'مطابق للرقمنة']
  },
  {
    id: '/absence',
    title: 'متابعة الغياب والمواظبة',
    subtitle: 'تسجيل الحضور والغياب اليومي',
    category: 'classroom',
    categoryLabel: 'الإدارة والتوثيق',
    icon: ClipboardList,
    gradient: 'from-rose-500 via-pink-600 to-red-600',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    accentBorder: 'border-rose-400/40',
    overview: 'منظومة متابعة المواظبة اليومية لرصد غيابات وتأخرات وسلوكات التلاميذ بكل حصة، مع توليد تقارير شهرية وإشعارات غياب موجهة للإدارة والأولياء.',
    benefits: [
      'رصد سريع بنقرة واحدة خلال أول 5 دقائق من الحصة دون إضاعة وقت التعلم.',
      'سجل تراكمي لحالات الغياب المبرر وغير المبرر وتكرار التأخر.',
      'طباعة استمارات التبليغ عن الغياب المتكرر وفق النماذج الإدارية.'
    ],
    steps: [
      { num: '1', text: 'فتح قائمة الفوج', detail: 'اختر القسم والحصة الحالية لتظهر لك قائمة التلاميذ بالصور والأسماء.' },
      { num: '2', text: 'تحديد الحالات', detail: 'انقر على اسم التلميذ لتبديل حالته (حاضر / غائب / متأخر / معفى).' },
      { num: '3', text: 'حفظ الحصة وإصدار التقارير', detail: 'احفظ البيانات لتغذية سجل المواظبة العام وطباعة إشعار الإدارة عند الحاجة.' }
    ],
    proTip: 'التوثيق الفوري للغياب يحميك قانونياً من أي تبعات ويوفر لإدارة المؤسسة سنداً رسمياً للمتابعة التأديبية والتربوية.',
    tags: ['حضور وغياب', 'تقارير دورية', 'حماية قانونية']
  },
  {
    id: '/copilot',
    title: 'المساعد البيداغوجي الذكي',
    subtitle: 'مستشارك التربوي بالذكاء الاصطناعي',
    category: 'ai',
    categoryLabel: 'الذكاء الاصطناعي',
    icon: Cpu,
    gradient: 'from-cyan-400 via-teal-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    accentBorder: 'border-cyan-400/40',
    isAi: true,
    overview: 'شات بوت تربوي متخصص مدرب على المناهج التعليمية الجزائرية والوثائق المرافقة، يساعدك في حل الإشكاليات الصفية وصياغة مؤشرات الكفاءة.',
    benefits: [
      'إجابات بيداغوجية فورية مبنية على نظريات التعلم والمناهج الوزارية.',
      'اقتراح استراتيجيات تعليم نشط، ألعاب تربوية، وأنشطة علاجية.',
      'مساعدة في التعامل مع صعوبات التعلم والتلاميذ ذوي الاحتياجات الخاصة.'
    ],
    steps: [
      { num: '1', text: 'طرح السؤال أو المشكلة', detail: 'اكتب استفسارك البيداغوجي أو اطلب خطة علاجية لدرس أو مفهوم مستعصٍ.' },
      { num: '2', text: 'تلقي الحل المقترح', detail: 'احصل على تحليل تربوي مدعم بالأمثلة والخطوات القابلة للتطبيق المباشر.' },
      { num: '3', text: 'توظيف المقترحات في قسمك', detail: 'انسخ التوجيهات أو أدرجها ضمن خطة الدرس أو دفتر المعالجة البيداغوجية.' }
    ],
    proTip: 'استشر المساعد الذكي عند التخطيط لوضعيات الإدماج الكلي، واطلب منه وضعيات مشكلة من واقع التلميذ الجزائري.',
    tags: ['مستشار ذكي', 'استراتيجيات تدريس', 'معالجة بيداغوجية']
  },
  {
    id: '/exam-generator',
    title: 'مولد الاختبارات والتقويمات',
    subtitle: 'توليد مواضيع الامتحانات وسلم التنقيط',
    category: 'ai',
    categoryLabel: 'الذكاء الاصطناعي',
    icon: PenLine,
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    accentBorder: 'border-amber-400/40',
    isAi: true,
    overview: 'أداة ذكية متخصصة في بناء مواضيع الفروض والاختبارات الفصلية والتقويمات التشخيصية مرفقة بعناصر الإجابة وشبكة التنقيط وفق معايير التفتيش.',
    benefits: [
      'بناء متوازن للموضوع (تمارين استرجاع المعارف + مسألة إدماجية مركبة).',
      'توليد شبكة تصحيح مفصلة بسلم تنقيط دقيق يسهل عملية التصحيح.',
      'تصدير الاختبار بملف وورد أو PDF منسق برأسية رسمية جاهزة للطباعة.'
    ],
    steps: [
      { num: '1', text: 'ضبط خصائص الاختبار', detail: 'اختر المادة، المستوى، الفصل، ونوع الموضوع (فرض محروس أو اختبار).' },
      { num: '2', text: 'تحديد المحاور والأهداف', detail: 'حدد الدروس المشمولة ودرجة الصعوبة وأسلوب صياغة الأسئلة.' },
      { num: '3', text: 'التوليد وسحب النسخة', detail: 'احصل على الموضوع وسلم التنقيط النموذجي بنقرة واحدة وصدّره للطباعة.' }
    ],
    proTip: 'تأكد دائماً من أن مجموع علامات الوضعية الإدماجية يمثل 8 نقاط في المواد الأساسية لمطابقة التوجيهات الرسمية.',
    tags: ['فروض واختبارات', 'سلم تنقيط', 'رأسية رسمية']
  },
  {
    id: '/worksheet-generator',
    title: 'أوراق العمل والوضعيات',
    subtitle: 'بناء وضعيات إدماجية وتدريبات مركبة',
    category: 'classroom',
    categoryLabel: 'المحتوى والتدريب',
    icon: Layers,
    gradient: 'from-sky-400 via-blue-600 to-indigo-700',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    accentBorder: 'border-sky-400/40',
    overview: 'مكتبة ومولد أوراق عمل تفاعلية تدمج السندات والصور والأسئلة الهادفة لتعزيز الكفاءات المكتسبة والتحضير للامتحانات الرسمية.',
    benefits: [
      'نماذج جاهزة للأطوار التعليمية الثلاثة (ابتدائي، متوسط، ثانوي).',
      'صياغة وضعيات انطلاق ووضعيات مشكلة محفزة للتفكير النقدي.',
      'أوراق عمل مجهزة بمساحات الإجابة ومناسبة للمهام الفردية والجماعية.'
    ],
    steps: [
      { num: '1', text: 'اختيار النموذج أو التوليد الحر', detail: 'تصفح النماذج الجاهزة أو اختر الطور والمادة لإنشاء ورقة مخصصة.' },
      { num: '2', text: 'معاينة السياق والسندات', detail: 'راجع وضوح السندات والمهمات المطلوبة وتعديلها وفق وتيرة قسمك.' },
      { num: '3', text: 'الطباعة والتوزيع', detail: 'اطبع ورقة العمل مباشرة بحجم ورقة A4 أو صدّرها لمشاركتها رقمياً.' }
    ],
    proTip: 'اجعل ورقة العمل تحتوي على مهمة مركبة واحدة على الأقل تتطلب تجنيد أكثر من مورد معرفي لتحقيق الكفاءة العرضية.',
    tags: ['وضعيات إدماجية', 'سندات بيداغوجية', 'طباعة A4']
  },
  {
    id: '/presentation-stepper',
    title: 'صانع العروض البيداغوجية',
    subtitle: 'توليد عروض PowerPoint للمراحل التعليمية',
    category: 'interactive',
    categoryLabel: 'التفاعل والشرح',
    icon: Monitor,
    gradient: 'from-fuchsia-500 via-pink-600 to-purple-700',
    glowColor: 'rgba(217, 70, 239, 0.4)',
    accentBorder: 'border-fuchsia-400/40',
    overview: 'صانع عروض تفاعلية متسلسلة يقود الأستاذ والتلاميذ عبر المراحل البيداغوجية الثلاث للدرس مع وضعيات عرض مخصصة للشاشات والسبورات الذكية.',
    benefits: [
      'هيكلة جاهزة للدرس (وضعية الانطلاق ← بناء التعلمات ← التطبيق والتقويم).',
      'نمط العرض الصفي التفاعلي (Present Mode) مع تحكم كامل بالشرائح.',
      'تصميم بصري مريح للعين يدعم النصوص الكبيرة والخطوط التربوية الواضحة.'
    ],
    steps: [
      { num: '1', text: 'اختيار الدرس أو النموذج', detail: 'اختر النموذج الجاهز لمادتك أو أدرج عناصر درسك الجديد.' },
      { num: '2', text: 'توليد الشرائح البيداغوجية', detail: 'شاهد توليد شرائح كل مرحلة مع الأسئلة الموجهة وأنشطة التعلم.' },
      { num: '3', text: 'إطلاق العرض الصفي', detail: 'انقر على "بدء العرض التفاعلي" لشرح الدرس على السبورة أو المسلاط.' }
    ],
    proTip: 'استخدم الشريحة الأولى دائماً كعقد تعليمي توضح فيه أهداف الحصة للتلاميذ قبل البدء في الأنشطة.',
    tags: ['عروض تفاعلية', 'وضع العرض الصفي', 'مراحل الدرس']
  },
  {
    id: '/timetable',
    title: 'جداول التوقيت الأسبوعي',
    subtitle: 'تنظيم الحصص والفترات الصباحية والمسائية',
    category: 'classroom',
    categoryLabel: 'الإدارة والتوثيق',
    icon: Calendar,
    gradient: 'from-purple-500 via-indigo-600 to-blue-700',
    glowColor: 'rgba(129, 140, 248, 0.4)',
    accentBorder: 'border-indigo-400/40',
    overview: 'إدارة الجدول الأسبوعي لحصص الأستاذ وتوزيع الأفواج التربوية والقاعات مع مراعاة نظام الدوامين والنظام العادي وتنبيهات الحصص الآنية.',
    benefits: [
      'رؤية شاملة للتوزيع الزمني الأسبوعي مع تمييز الفترات الصباحية والمسائية.',
      'تكامل مباشر مع الكراس اليومي لفتح حصة اليوم بنقرة واحدة.',
      'طباعة وثيقة استعمال الزمن المعلقة بختم وتوقيع الإدارة المدرسية.'
    ],
    steps: [
      { num: '1', text: 'تعبئة الحصص والأفواج', detail: 'أدخل المواد، أسماء الأقسام، والقاعات المخصصة لكل فترة زمنية.' },
      { num: '2', text: 'مراجعة التوزيع البيداغوجي', detail: 'تحقق من عدم وجود تضارب وتوزيع الحصص بما يراعي المردود الذهني للتلاميذ.' },
      { num: '3', text: 'تصدير جدول التوقيت', detail: 'اطبع جدولاً ملوناً وأنيقاً لتعليقه في قاعة الأساتذة وكراس النشاط.' }
    ],
    proTip: 'برمج حصص المواد ذات العبء الإدراكي العالي في الساعات الصباحية الأولى واستغل حصص ما بعد الظهيرة للأنشطة التطبيقية.',
    tags: ['استعمال الزمن', 'تنظيم أسبوعي', 'طباعة رسمية']
  },
  {
    id: '/resources',
    title: 'بنك الموارد البيداغوجية',
    subtitle: 'مشاركة واستعراض المذكرات والمشاريع',
    category: 'resources',
    categoryLabel: 'الموارد والتطوير',
    icon: Library,
    gradient: 'from-teal-400 via-emerald-600 to-cyan-700',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    accentBorder: 'border-teal-400/40',
    overview: 'المستودع السحابي التعاوني الأول للأستاذ الجزائري لمشاركة وتنزيل المذكرات، التوزيعات السنوية، والكتب المدرسية والوثائق المرافقة.',
    benefits: [
      'آلاف المذكرات والمستندات المصنفة حسب الطور، السنة، والمادة.',
      'مراجعة ومصادقة دورية من طرف أساتذة ومفتشين ذوي خبرة.',
      'إمكانية رفع ومشاركة إنتاجك البيداغوجي لخدمة المجتمع التعليمي.'
    ],
    steps: [
      { num: '1', text: 'البحث والتصفية', detail: 'استعمل محرك البحث الدقيق لتحديد الطور والمادة ونوع الوثيقة المطلوبة.' },
      { num: '2', text: 'المعاينة والتحميل', detail: 'عاين محتوى المستند بنقرة واحدة ثم حمّله بصيغة PDF أو Word قابلة للتعديل.' },
      { num: '3', text: 'المشاركة والتقييم', detail: 'قيم المستندات التي أفادتك وشارك مساهماتك الخاصة لنيل أوسمة المنصة.' }
    ],
    proTip: 'حمّل الوثائق المرافقة للمناهج الرسمية فهي المرجع الأساسي الذي يعتمد عليه المفتش في تقييم أدائك التربوي.',
    tags: ['مذكرات جاهزة', 'مستندات رسمية', 'مشاركة مجتمعية']
  },
  {
    id: '/new-teacher',
    title: 'حقيبة الأستاذ الجديد',
    subtitle: 'التشريع المدرسي والتوجيه المهني',
    category: 'resources',
    categoryLabel: 'الموارد والتطوير',
    icon: FileStack,
    gradient: 'from-emerald-400 via-green-600 to-teal-700',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    accentBorder: 'border-green-400/40',
    overview: 'دليل مهني شامل وملاذ قانوني وإداري للأستاذ في سنواته الأولى، يضم نصوص التشريع المدرسي الجزائري، نماذج العرائض، وإجراءات الترسيم والتثبيت.',
    benefits: [
      'معرفة الحقوق والواجبات المهنية وفق الأمر 06-03 والقانون الخاص بالتربية.',
      'دليل التحضير لامتحان الترسيم (تثبيت الأستاذ) مع نصائح المفتشين.',
      'نماذج المراسلات الإدارية الرسمية (طلب عطلة، تبرير غياب، مراسلة الإدارة).'
    ],
    steps: [
      { num: '1', text: 'استعراض محاور الدليل', detail: 'تصفح أبواب التشريع، العلاقات الإدارية، التحضير لزيارة التفتيش، وإدارة الصف.' },
      { num: '2', text: 'تنزيل النماذج القانونية', detail: 'حمّل استمارات ونماذج المراسلات المعتمدة بقطاع التربية الوطنية.' },
      { num: '3', text: 'تطبيق النصائح البيداغوجية', detail: 'استرشد بالتوجيهات العملية للسيطرة على الصف وبناء علاقة تربوية سليمة.' }
    ],
    proTip: 'التحكم في الوثائق البيداغوجية الرسمية من اليوم الأول هو المفتاح الأسرع لاجتياز امتحان التثبيت ونيل تقدير مفتش المادة.',
    tags: ['امتحان الترسيم', 'التشريع المدرسي', 'دليل الأستاذ الجديد']
  },
  {
    id: '/blog',
    title: 'المدونة والبحوث التربوية',
    subtitle: 'مقالات ونظريات التعلم الحديثة',
    category: 'resources',
    categoryLabel: 'الموارد والتطوير',
    icon: BookOpen,
    gradient: 'from-orange-400 via-amber-600 to-yellow-600',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    accentBorder: 'border-amber-400/40',
    overview: 'منصة فكرية ثرية بالمقالات والدراسات البيداغوجية الحديثة التي تناقش قضايا التعليم في الجزائر، التمايز البيداغوجي، والتقويم التكويني المعاصر.',
    benefits: [
      'مقالات متخصصة يكتبها خبراء تربية ومفتشون جزائريون.',
      'إضاءات حول المناهج الجديدة والتحول الرقمي في المؤسسات التعليمية.',
      'فرصة للأستاذ لنشر أبحاثه وتجاربه الناجحة داخل القسم.'
    ],
    steps: [
      { num: '1', text: 'استكشاف المقالات الرائجة', detail: 'اختر المقالات حسب الموضوع: علم نفس الطفل، استراتيجيات التدريس، أو الإدارة.' },
      { num: '2', text: 'القراءة والتحليل', detail: 'اطلع على التجارب الميدانية وكيفية تكييفها داخل واقع الأقسام الجزائرية.' },
      { num: '3', text: 'المناقشة والتفاعل', detail: 'شارك بتعليقاتك واستفساراتك مع نخبة من الأساتذة والباحثين.' }
    ],
    proTip: 'التطوير المهني المستمر والقراءة في علوم التربية يمنحك ثقة وثباتاً بيداغوجياً ينعكس مباشرة على تفوق تلاميذك.',
    tags: ['مقالات تربوية', 'تطوير مهني', 'علم نفس التعلم']
  },
  {
    id: '/database',
    title: 'السحابة الرقمية والمزامنة',
    subtitle: 'إدارة وتأمين وحفظ البيانات السحابية',
    category: 'resources',
    categoryLabel: 'الموارد والتطوير',
    icon: CloudUpload,
    gradient: 'from-sky-400 via-cyan-500 to-blue-600',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    accentBorder: 'border-sky-400/40',
    overview: 'مركز المزامنة الرقمية المشفرة الذي يضمن حفظ كل مذكراتك، علامات تلاميذك، وسجلات غيابك في بيئة سحابية آمنة مع إمكانية العمل أوفلاين.',
    benefits: [
      'مزامنة آلية فورية لجميع البيانات بين أجهزتك المختلفة.',
      'تشفير عالي الأمان يحمي خصوصية المعطيات وسجلات التلاميذ.',
      'إمكانية تصدير واسترجاع نسخة احتياطية محلية متكاملة بضغطة زر.'
    ],
    steps: [
      { num: '1', text: 'التحقق من حالة الاتصال', detail: 'تأكد من شارة الاتصال السحابي الأخضر لضمان المزامنة التلقائية.' },
      { num: '2', text: 'طلب مزامنة فورية', detail: 'اضغط على "مزامنة الآن" لرفع أو سحب التحديثات بين الحاسوب والهاتف.' },
      { num: '3', text: 'تنزيل نسخة احتياطية', detail: 'احفظ نسخة JSON احتياطية محلية على جهازك أو قرص تخزين خارجي للطوارئ.' }
    ],
    proTip: 'قم بتنزيل نسخة احتياطية محلية في نهاية كل فصل دراسي بعد رصد النقاط لضمان أرشيف رقمي دائم لمسيرتك.',
    tags: ['مزامنة سحابية', 'أمان عالي', 'نسخ احتياطي']
  }
];

export default function IntroHub({ profile, onNavigate, onGoToLanding, darkMode, toggleDarkMode, onLogout, isAdmin = false }: Props) {
  const { count: visitorCount } = useVisitorCount(true);
  // Active Tutorial Modal State
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isAutoTourRunning, setIsAutoTourRunning] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Daily dynamic greeting info
  const dateInfo = useMemo(() => {
    try {
      const today = new Date();
      const arabicDate = today.toLocaleDateString('ar-DZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return arabicDate;
    } catch {
      return 'يوم جديد من العطاء التربوي';
    }
  }, []);

  const levelLabel = useMemo(() => {
    if (profile.level === 'PRIMARY') return 'التعليم الابتدائي';
    if (profile.level === 'MIDDLE') return 'التعليم المتوسط';
    if (profile.level === 'HIGH') return 'التعليم الثانوي';
    return 'التعليم العام';
  }, [profile.level]);

  // Filtered services
  const visibleServices = useMemo(() => {
    return SERVICES.filter(service => {
      if (service.id === '/database' && !isAdmin) return false;
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() ||
        service.title.includes(searchQuery) ||
        service.subtitle.includes(searchQuery) ||
        service.tags.some(t => t.includes(searchQuery));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, isAdmin]);

  // Auto-tour timer
  useEffect(() => {
    let timer: any;
    if (isAutoTourRunning && activeModalIndex !== null) {
      timer = setTimeout(() => {
        setActiveModalIndex(prev => {
          if (prev === null) return 0;
          return (prev + 1) % SERVICES.length;
        });
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isAutoTourRunning, activeModalIndex]);

  const activeService = activeModalIndex !== null ? SERVICES[activeModalIndex] : null;

  const openTutorial = (serviceId: string) => {
    const idx = SERVICES.findIndex(s => s.id === serviceId);
    if (idx !== -1) {
      setActiveModalIndex(idx);
    }
  };

  const nextTutorial = () => {
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % SERVICES.length);
    }
  };

  const prevTutorial = () => {
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex - 1 + SERVICES.length) % SERVICES.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-['Cairo'] flex flex-col transition-colors duration-500 overflow-x-hidden relative selection:bg-amber-500 selection:text-white" dir="rtl">

      {/* ═══ TOP AMBER ACCENT BAR ═══ */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 z-50 shadow-sm shadow-amber-200/50"></div>

      {/* Ambient background lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/8 dark:bg-amber-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute top-40 left-1/4 w-[28rem] h-[28rem] bg-indigo-500/8 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-teal-400/8 dark:bg-teal-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
      </div>

      {/* ═══ TOP NAVBAR ═══ */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 z-20 mt-1.5 backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 sticky top-1.5">
        <div className="flex items-center gap-4">
          <TamkeenLogo size={38} />
          <div className="hidden md:block h-8 w-px bg-slate-200 dark:slate-800"></div>
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
              <span>تمكين PRO</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-black">2026</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">المنظومة البيداغوجية المتكاملة للأستاذ الجزائري</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live Visitor Counter Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm" title="إجمالي الزوار بعد كل تحديث وزيارة منذ الآن">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users size={14} className="text-emerald-500" />
            <span className="text-[10px] text-slate-400 font-bold hidden md:inline">الزوار:</span>
            <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
              {visitorCount.toLocaleString()}
            </span>
          </div>

          {/* Smart Interactive Return to First Landing Page Button */}
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="group/first relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 hover:from-emerald-600 hover:to-teal-600 text-emerald-800 dark:text-emerald-300 hover:text-white border border-emerald-200/80 dark:border-emerald-800/80 hover:border-transparent font-black text-xs shadow-sm hover:shadow-md hover:shadow-emerald-600/20 hover:scale-105 transition-all duration-300"
              title="العودة إلى الواجهة الرئيسية الأولى (صفحة الاستقبال والتعريف بالمنصة)"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/first:bg-white animate-pulse"></div>
              <Home size={15} className="text-emerald-600 dark:text-emerald-400 group-hover/first:text-white transition-colors" />
              <span className="hidden sm:inline tracking-tight">الواجهة الرئيسية الأولى</span>
            </button>
          )}

          {/* Quick Guided Tour Button */}
          <button
            onClick={() => {
              setActiveModalIndex(0);
              setIsAutoTourRunning(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
            title="جولة إرشادية في جميع الخدمات"
          >
            <GraduationCap size={16} />
            <span className="hidden sm:inline">دليل الخدمات التفاعلي</span>
          </button>

          {/* Go to full dashboard */}
          <button
            onClick={() => onNavigate('/dashboard')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-300 dark:hover:border-amber-500 font-bold text-xs shadow-sm hover:scale-105 transition-all"
          >
            <span>لوحة القيادة</span>
            <ArrowLeft size={14} />
          </button>

          {isAdmin && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-black">
              <ShieldCheck size={14} />
              <span>مشرف النظام</span>
            </div>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400 hover:scale-110 hover:border-amber-300 transition-all shadow-sm"
            title="تبديل الوضع الليلي"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:scale-110 hover:border-rose-200 transition-all shadow-sm"
            title="تسجيل الخروج"
          >
            <LogOut size={17} />
          </button>
        </div>
      </nav>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <main className="flex-1 flex flex-col items-center max-w-7xl mx-auto w-full px-5 md:px-10 pb-20 z-10">

        {/* ═══ DAILY PRODUCTIVITY & TEACHER COCKPIT ═══ */}
        <section className="w-full mt-6 mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/70 dark:border-slate-800 p-6 md:p-8 shadow-xl shadow-slate-200/30 dark:shadow-slate-950/40 relative overflow-hidden">
          {/* Top subtle highlight */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500 opacity-80"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Teacher Info & Status */}
            <div className="space-y-2 text-right">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-black border border-amber-200 dark:border-amber-800">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{dateInfo}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <FileCheck2 size={12} />
                  <span>{levelLabel}</span>
                </span>
                {profile.institution && (
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {profile.institution}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                طاب يومك البيداغوجي، أستاذ{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600">
                  {profile.name}
                </span>
              </h1>
              <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                بوابتك الرقمية المهنية: اختر الخدمة للبدء المباشر، أو انقر على زر دليل الاستخدام لعرض نافذة الشرح البيداغوجية الشفافة.
              </p>
            </div>

            {/* Right: Quick Launch Shortcuts Bar */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <div className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span>إجراءات الإنتاجية السريعة:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onNavigate('/mothakira-thakiya')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200 dark:border-violet-800/60 transition-all shadow-sm"
                >
                  <Zap size={13} className="text-violet-500" />
                  <span>تحضير مذكرة</span>
                </button>

                <button
                  onClick={() => onNavigate('/whiteboard')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 transition-all shadow-sm"
                >
                  <Compass size={13} className="text-amber-500" />
                  <span>السبورة التفاعلية</span>
                </button>

                <button
                  onClick={() => onNavigate('/korras-yawmi')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800/60 transition-all shadow-sm"
                >
                  <BookOpenCheck size={13} className="text-teal-500" />
                  <span>الكراس اليومي</span>
                </button>

                <button
                  onClick={() => onNavigate('/absence')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/60 transition-all shadow-sm"
                >
                  <ClipboardList size={13} className="text-rose-500" />
                  <span>رصد الغياب</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FILTER & SEARCH BAR ═══ */}
        <section className="w-full mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 overflow-x-auto max-w-full shadow-sm">
            {[
              { id: 'all', label: 'جميع الخدمات', count: SERVICES.length },
              { id: 'classroom', label: '🏛️ الإدارة والتوثيق', count: SERVICES.filter(s => s.category === 'classroom').length },
              { id: 'ai', label: '⚡ الذكاء الاصطناعي', count: SERVICES.filter(s => s.category === 'ai').length },
              { id: 'interactive', label: '🎨 الشرح والتفاعل', count: SERVICES.filter(s => s.category === 'interactive').length },
              { id: 'resources', label: '📚 الموارد والتطوير', count: SERVICES.filter(s => s.category === 'resources').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-black text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === tab.id ? 'bg-white/25 text-white' : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أداة أو خدمة..."
              className="w-full pr-10 pl-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </section>

        {/* ═══ SERVICES GRID (iOS 18 SQUIRCLE LIQUID GLASS DESIGN) ═══ */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5 animate-in fade-in duration-500">
          {visibleServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between p-5 rounded-[2rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800/80 hover:border-amber-300/80 dark:hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/60 overflow-hidden text-right"
              >
                {/* Background ambient color wash on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
                  style={{ background: `radial-gradient(circle at top right, ${service.glowColor}, transparent 70%)` }}
                />

                {/* Top Strip */}
                <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                  {/* Apple iOS 18 Squircle Liquid Glass Icon */}
                  <div
                    onClick={() => onNavigate(service.id)}
                    className="relative w-16 h-16 rounded-[1.5rem] p-0.5 cursor-pointer transform group-hover:scale-110 group-hover:-rotate-2 transition-all duration-300 shrink-0"
                    style={{
                      boxShadow: `0 10px 25px -4px ${service.glowColor}, 0 4px 6px -2px rgba(0, 0, 0, 0.1)`
                    }}
                    title={`انقر لفتح ${service.title}`}
                  >
                    {/* Multi-stop liquid gradient base */}
                    <div className={`w-full h-full rounded-[1.4rem] bg-gradient-to-br ${service.gradient} flex items-center justify-center relative overflow-hidden border border-white/40 dark:border-white/20`}>
                      {/* Top Specular Gloss Highlight (Signature Apple Liquid Glass Effect) */}
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/45 via-white/15 to-transparent rounded-t-[1.4rem] pointer-events-none"></div>

                      {/* Bottom Glow Shimmer */}
                      <div className="absolute -bottom-2 inset-x-0 h-1/3 bg-white/10 blur-sm pointer-events-none"></div>

                      {/* Icon glyph */}
                      <Icon size={28} className="text-white drop-shadow-md relative z-10" strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Badges & Educational Help Modal Trigger */}
                  <div className="flex flex-col items-end gap-1.5">
                    {service.isAi && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-[10px] font-black text-white shadow-sm shadow-purple-500/30">
                        <Sparkles size={9} />
                        <span>AI ذكي</span>
                      </span>
                    )}
                    {service.isHot && !service.isAi && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black border border-amber-300/40 dark:border-amber-700/40">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        <span>أساسي</span>
                      </span>
                    )}

                    {/* Explanatory Frosted Glass Modal Launcher */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTutorial(service.id);
                      }}
                      className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 text-[10px] font-black border border-slate-200/80 dark:border-slate-700 transition-all shadow-sm group/btn"
                      title="عرض نافذة الدليل التعليمي والشرح البيداغوجي"
                    >
                      <GraduationCap size={12} className="text-amber-500 group-hover/btn:rotate-12 transition-transform" />
                      <span>دليل الاستخدام</span>
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5 relative z-10 mb-4">
                  <h3
                    onClick={() => onNavigate(service.id)}
                    className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{service.title}</span>
                    <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 text-amber-500 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {service.subtitle}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                  {service.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Direct Action Bottom Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between relative z-10">
                  <button
                    onClick={() => onNavigate(service.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 text-slate-700 dark:text-slate-200 hover:text-white font-black text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md"
                  >
                    <span>فتح الخدمة الآن</span>
                    <ArrowLeft size={13} className="transform group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

      </main>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ═══ INTERACTIVE FROSTED GLASS TUTORIAL MODAL (نافذة بلور جلاس) ═══ */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeService && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setActiveModalIndex(null)}
        >
          <div
            className="w-full max-w-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 dark:border-slate-700/60 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            {/* Top Amber Shimmer Strip */}
            <div className={`h-2 w-full bg-gradient-to-r ${activeService.gradient}`}></div>

            {/* Modal Header */}
            <div className="p-6 md:p-8 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* iOS 18 Squircle inside Modal */}
                <div
                  className="w-16 h-16 rounded-[1.5rem] p-0.5 shrink-0"
                  style={{ boxShadow: `0 8px 20px -3px ${activeService.glowColor}` }}
                >
                  <div className={`w-full h-full rounded-[1.4rem] bg-gradient-to-br ${activeService.gradient} flex items-center justify-center relative overflow-hidden border border-white/40`}>
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"></div>
                    <activeService.icon size={30} className="text-white drop-shadow" strokeWidth={2.2} />
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {activeService.categoryLabel}
                    </span>
                    {activeService.isAi && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        ⚡ ذكاء اصطناعي
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {activeService.title}
                  </h2>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {activeService.subtitle}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModalIndex(null)}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-right">

              {/* Section 1: Overview */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-4 border border-amber-200/60 dark:border-amber-800/40">
                <div className="flex items-center gap-2 mb-1.5 text-amber-700 dark:text-amber-400 font-black text-xs">
                  <Compass size={14} />
                  <span>الهدف البيداغوجي والجدوى التربوية:</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeService.overview}
                </p>
              </div>

              {/* Section 2: Step-by-Step How-To (كيفية الاستخدام في 3 خطوات) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 size={14} className="text-amber-500" />
                  <span>دليل الاستخدام العملي في 3 خطوات سريعة:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeService.steps.map((step) => (
                    <div
                      key={step.num}
                      className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-right"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                        {step.num}
                      </div>
                      <div className="text-xs font-black text-slate-800 dark:text-white">
                        {step.text}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-snug">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Pro Inspector Tip */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-4 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-3">
                <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm shrink-0">
                  <Award size={16} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                    نصيحة المفتش البيداغوجي الذهبية:
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeService.proTip}
                  </p>
                </div>
              </div>

              {/* Section 4: Key Benefits Pills */}
              <div className="space-y-2">
                <div className="text-xs font-black text-slate-400">أبرز المزايا والمخرجات:</div>
                <div className="flex flex-col gap-1.5">
                  {activeService.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 md:px-8 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Service Stepper */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevTutorial}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm"
                  title="الخدمة السابقة"
                >
                  <ChevronRight size={16} />
                </button>
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 px-2">
                  {activeModalIndex! + 1} من {SERVICES.length}
                </span>
                <button
                  onClick={nextTutorial}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm"
                  title="الخدمة التالية"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setIsAutoTourRunning(!isAutoTourRunning)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border transition-all flex items-center gap-1.5 ${
                    isAutoTourRunning
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                  title="عرض آلي متتالي للخدمات"
                >
                  {isAutoTourRunning ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isAutoTourRunning ? 'إيقاف مؤقت' : 'عرض آلي'}</span>
                </button>
              </div>

              {/* Launch Service Button */}
              <button
                onClick={() => {
                  const targetId = activeService.id;
                  setActiveModalIndex(null);
                  onNavigate(targetId);
                }}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r ${activeService.gradient} text-white font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2`}
              >
                <span>فتح {activeService.title} والبدء الآن</span>
                <ArrowLeft size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SMART INTERACTIVE FLOATING PILL (Non-crowded) ═══ */}
      {onGoToLanding && (
        <div className="fixed bottom-5 left-5 z-40">
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold text-xs shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            title="العودة إلى الواجهة الرئيسية الأولى (صفحة الاستقبال)"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform animate-pulse"></div>
            <Home size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-black">الواجهة الرئيسية الأولى</span>
          </button>
        </div>
      )}

      {/* ═══ BOTTOM GRADIENT ACCENT ═══ */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 opacity-60 pointer-events-none"></div>
    </div>
  );
}