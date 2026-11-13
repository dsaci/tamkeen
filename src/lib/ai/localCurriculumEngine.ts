/**
 * محرك الذكاء الاصطناعي المحلي التربوي المفتوح والمجاني (Local Pedagogical AI Engine)
 * مبني وفق فلسفة "مشروع باقون": توليد بيداغوجي ذاتي دائم، بدون انقطاع، برصيد غير منتهي،
 * مستند إلى قاعدة بيانات المنهاج الجزائري الرسمي وبطاقات التفتيش الوزارية لمادة اللغة العربية (الجيل الثاني).
 */

import { 
  SECONDARY_ARABIC_CURRICULUM, 
  findCurriculumLesson, 
  CurriculumLessonItem,
  PedagogicalStepItem,
  IntegrationTaskRow,
  EvaluationCriterionRow
} from './secondaryArabicCurriculumData';

export interface MemoStepItem {
  stage: string;                  // وضعيّات التعلّم: وضعيّة الانطلاق / بناء التعلّمات / التّقييم والاستثمار
  objectiveDomain?: string;       // الهدف التعلّمي: معرفيّ / مهاريّ / وجدانيّ
  teacherActivity: string;        // نشاط الأستاذ (متضمناً الاستراتيجية: فكر-زاوج-شارك، التعلم التعاوني، لعب الأدوار...)
  strategy?: string;              // استراتيجية التدريس المعتمدة
  studentActivity: string;        // نشاط المتعلم
  evaluationType?: string;        // التّقويم: تشخيصيّ / تكوينيّ / تحصيليّ
  indicatorsAndTiming: string;    // معايير ومؤشرات تحقق الإنجاز والزمن (03 دقائق، 03 أسطر، 04 خصائص...)
  method?: string;                // الطريقة البيداغوجية
}

export interface GeneratedMemoResult {
  institution?: string;
  targetGroup: string;            // الفئة المستهدفة: المستوى والشعبة
  unitNumberAndTitle: string;     // الوحدة التعلمية
  unitDuration: string;           // المدة الزمنية للوحدة (مثلاً: 06 ساعات)
  activity: string;               // النشاط (نص أدبي، قواعد، بلاغة...)
  topic: string;                  // الموضوع والكاتب/الشاعر
  support: string;                // السندات العلمية والتربوية
  competencyFinal: string;        // الكفاءة الختامية
  competencyTarget?: string;      // الكفاءات المستهدفة
  objectivesList?: string[];      // الأهداف التعلمية
  indicators: string[];           // مؤشرات الأداء
  prerequisites: string;          // المكتسبات القبلية
  problemSituation: string;       // الوضعية المشكلة الانطلاقية
  tools: string;                  // الوسائل والسندات
  toolsNote?: string;             // ملاحظة الوسائل
  steps: MemoStepItem[];          // جدول سير الحصة البيداغوجي (5 أعمدة)
  evaluationDiag: string;
  evaluationFormative: string;
  evaluationFinal: string;
  remediation: string;
  enrichment: string;
  notes: string;
  values: string;
  // حقول خاصة بالوضعية الإدماجية النقدية
  isIntegration?: boolean;
  writingTechniques?: string;
  rhetoricResources?: string;
  linguisticResources?: string;
  intellectualResources?: string;
  integrationTasks?: IntegrationTaskRow[];
  rubricCriteria?: EvaluationCriterionRow[];
  source: 'local_curriculum_engine' | 'local_ollama' | 'cloud_ai';
}

export interface GeneratedExamResult {
  title: string;
  level: string;
  stream: string;
  subject: string;
  duration: string;
  readingText: string;
  author: string;
  intellectualComprehension: { question: string; points: number }[]; // البناء الفكري
  linguisticCompetence: { question: string; points: number }[];       // البناء اللغوي
  criticalEvaluation?: { question: string; points: number }[];       // التقويم النقدي (للشعب الأدبية)
  integrationSituation: { context: string; task: string; points: number }; // الوضعية الإدماجية
  rubric: { question: string; answer: string; points: number }[];
}

/**
 * 1. التوليد المحلي الذكي للمذكرات البيداغوجية (مجاني 100% برصيد غير منتهي)
 */
export async function generateLocalMemo(params: {
  grade: string;
  subject: string;
  activity: string;
  topic: string;
  unit?: string;
  stream?: string;
  institution?: string;
  useOllama?: boolean;
  ollamaModel?: string;
}): Promise<GeneratedMemoResult> {
  const { grade, activity, topic, unit, stream, institution, useOllama, ollamaModel } = params;

  // المحاولة الأولى: إذا اختار المستخدم خادم Ollama المحلي على جهازه وكان نشطاً
  if (useOllama) {
    try {
      const ollamaRes = await callLocalOllama({
        model: ollamaModel || 'qwen2.5:7b',
        prompt: `أنت مفتش تربوي للغة العربية بالتعليم الثانوي الجزائري. ولد مذكرة بيداغوجية رسمية بالجيل الثاني وفق المقاربة بالكفاءات لموضوع: "${topic}"، نشاط: "${activity}"، مستوى: "${grade}". بصيغة JSON حصراً.`
      });
      if (ollamaRes) {
        return { ...ollamaRes, source: 'local_ollama' };
      }
    } catch (e) {
      console.warn('[LocalAIEngine] Ollama offline or unavailable, switching smoothly to Local Curriculum Engine');
    }
  }

  // المحاولة الثانية: استرجاع مباشر من قاعدة بيانات المنهاج المفككة (RAG محلي فائق السرعة)
  const curriculumMatch = findCurriculumLesson({ grade, activity, topic, unit });

  if (curriculumMatch) {
    return formatCurriculumItemToMemo(curriculumMatch, topic, activity, stream, institution);
  }

  // المحاولة الثالثة: محرك القوالب البيداغوجية الذاتي المنشئ وفق المقاربة بالكفاءات (Deterministic Engine)
  return buildDynamicPedagogicalMemo({
    grade,
    subject: params.subject || 'اللغة العربية وآدابها',
    activity: activity || 'أدب ونصوص',
    topic: topic || 'الدرس المنهجي المقترح',
    unit: unit || 'الوحدة التعليمية المعتمدة',
    stream: stream || 'شعب علمية مشتركة',
    institution: institution || 'مؤسسة تربوية رسمية'
  });
}

/**
 * تحويل عنصر المنهاج المسترجع إلى مذكرة رسمية مطابقة 100% لنموذج التفتيش المعتمد
 */
function formatCurriculumItemToMemo(
  item: CurriculumLessonItem, 
  requestedTopic: string, 
  activity: string, 
  stream?: string,
  institution?: string
): GeneratedMemoResult {
  const steps: MemoStepItem[] = item.structuredSteps && item.structuredSteps.length > 0
    ? item.structuredSteps.map(s => ({
        stage: s.stage,
        objectiveDomain: s.objectiveDomain,
        teacherActivity: s.teacherActivity,
        strategy: s.strategy || item.method,
        studentActivity: s.studentActivity,
        evaluationType: s.evaluationType,
        indicatorsAndTiming: s.indicatorsAndTiming,
        method: s.strategy || item.method
      }))
    : [
        {
          stage: 'وضعيّة الانطلاق',
          objectiveDomain: 'معرفيّ',
          strategy: 'العصف الذهني والحوار الاستكشافي',
          teacherActivity: `يطرح وضعية مشكلة دالة مستمدة من الواقع: "${item.problemSituation.slice(0, 160)}..." ويحفز تمثلات المتعلمين.`,
          studentActivity: 'يسترجع مكتسباته القبلية، يتفاعل مع الإشكال المطروح، ويصيغ فرضيات أولية لبناء التعلم.',
          evaluationType: 'تشخيصيّ',
          indicatorsAndTiming: '03 إلى 05 دقائق',
          method: 'العصف الذهني'
        },
        {
          stage: 'وضعيّة بناء التعلّمات (الملاحظة والاكتشاف)',
          objectiveDomain: 'معرفيّ ومهاريّ',
          strategy: item.method || 'التحليل الاستقرائي / فكر-زاوج-شارك',
          teacherActivity: `${item.teacherActivity} — يوجه إلى تفكيك الظاهرة وتحليل الشواهد اللغوية والأدبية.`,
          studentActivity: `${item.studentActivity} — يلاحظ، يقارن، ويستخرج الخصائص النوعية والروابط النصية.`,
          evaluationType: 'تكوينيّ',
          indicatorsAndTiming: '15 إلى 20 دقيقة / 3 أسطر',
          method: item.method || 'التحليل الاستقرائي'
        },
        {
          stage: 'وضعيّة بناء التعلّمات (التحليل وبناء القاعدة)',
          objectiveDomain: 'مهاريّ ونقديّ',
          strategy: 'التعلم التعاوني بأفواج رباعية',
          teacherActivity: 'يدير المناقشة لصياغة الاستنتاجات وضبط المفاهيم البيداغوجية والقواعد الأساسية وتدوينها على السبورة.',
          studentActivity: 'يشارك في بناء القاعدة العامة، يرتب النتائج، ويدون الخلاصة في كراسه بدقة وإتقان.',
          evaluationType: 'تكوينيّ',
          indicatorsAndTiming: '20 دقيقة / خلاصة متكاملة',
          method: 'العمل الجماعي التعاوني'
        },
        {
          stage: 'وضعيّة التّقييم والاستثمار',
          objectiveDomain: 'مهاريّ وتحصيليّ',
          strategy: 'الإنتاج الفردي والتقييم الذاتي',
          teacherActivity: `يطرح نشاطاً تطبيقياً إدماجياً لترسيخ التعلمات: "${item.evaluationFinal}" مع متابعة الأداء الفردي ورصد التعثرات.`,
          studentActivity: 'يوظف الموارد المكتسبة حديثاً في حل الوضعية التطبيقية ويصحح ذاتياً وجماعياً.',
          evaluationType: 'تحصيليّ',
          indicatorsAndTiming: '15 دقيقة / فقرة من 5 أسطر',
          method: 'الإنتاج الفردي والتصويب'
        }
      ];

  const objectives = item.objectivesList && item.objectivesList.length > 0
    ? item.objectivesList
    : item.indicators.map(ind => ind.replace(/^أن\s*/, ''));

  return {
    institution: institution || item.institution || 'مدرسة أشبال الأمّة وعواع المدني ن ع 1 –المسيلة-',
    targetGroup: `${item.grade} (${stream || item.stream})`,
    unitNumberAndTitle: item.unitTitle,
    unitDuration: item.unitDuration || '06 ساعات',
    activity: item.activity || activity,
    topic: item.topic || requestedTopic,
    support: item.supportPage ? `${item.supportPage}، الكتاب المدرسي، السبورة` : 'الكتاب المدرسي، السبورة، وثائق المنهاج',
    competencyFinal: item.competencyFinal,
    competencyTarget: item.competencyTarget || item.competencyFinal,
    objectivesList: objectives,
    indicators: item.indicators,
    prerequisites: item.prerequisites,
    problemSituation: item.problemSituation,
    tools: item.tools || 'الكتاب المدرسي، السبورة، وثائق المنهاج، نصوص مساعدة',
    toolsNote: item.toolsNote || 'تحدد الوسائل: الكتاب المدرسي - الكتب والمصادر والمراجع - الأسناد المكتوبة (المطبوعات والصور) والمرئية (فيديو) والمسموعة (تسجيل صوتي).',
    steps: steps,
    evaluationDiag: item.evaluationDiag,
    evaluationFormative: item.evaluationFormative,
    evaluationFinal: item.evaluationFinal,
    remediation: item.remediation,
    enrichment: item.enrichment,
    notes: `تم التوليد محلياً بالاعتماد التام على المنهاج الرسمي الجزائري وبطاقات التفتيش (المحور: ${item.unitTitle} - ${item.theme}) برصيد غير منتهي.`,
    values: item.values,
    // وضعية إدماجية
    isIntegration: item.isIntegration,
    writingTechniques: item.writingTechniques,
    rhetoricResources: item.rhetoricResources,
    linguisticResources: item.linguisticResources,
    intellectualResources: item.intellectualResources,
    integrationTasks: item.integrationTasks,
    rubricCriteria: item.rubricCriteria,
    source: 'local_curriculum_engine'
  };
}

/**
 * محرك التوليد البيداغوجي الذاتي لأي موضوع غير مدرج حرفياً
 * يصيغ المذكرة وفق نموذج التفتيش المعتمد بـ 5 أعمدة واستراتيجيات التعلم النشط
 */
function buildDynamicPedagogicalMemo(params: {
  grade: string;
  subject: string;
  activity: string;
  topic: string;
  unit: string;
  stream: string;
  institution: string;
}): GeneratedMemoResult {
  const { grade, activity, topic, unit, stream, institution } = params;

  const isGrammar = activity.includes('قواعد') || activity.includes('نحو') || activity.includes('صرف') || activity.includes('إعراب');
  const isRhetoric = activity.includes('بلاغة') || activity.includes('بيان') || activity.includes('بديع') || activity.includes('عروض');
  const isWriting = activity.includes('تعبير') || activity.includes('إدماج') || activity.includes('وضعية');
  const isReading = activity.includes('مطالعة') || activity.includes('نص تواصلي');

  let compFinal = `في مقام تواصل دال، ينتج المتعلم مشافهة أو كتابة نصاً منسجماً موظفاً معارفه حول (${topic}) في إطار ${unit}.`;
  let problem = `تطرح اللغة العربية أساليب متعددة للتعبير عن الدلالات بدقة؛ فكيف يسهم موضوع (${topic}) في إحكام بناء النص وإبراز المعنى المقصود بوضوح؟`;
  let val = 'الاعتزاز باللغة العربية كوعاء حضاري، وتنمية التفكير المنطقي والذوق الجمالي الرفيع.';
  let tools = 'الكتاب المدرسي، السبورة، وثيقة التدرجات السنوية، نصوص مساعدة';

  let steps: MemoStepItem[] = [];

  if (isGrammar) {
    compFinal = `يتحكم في الظاهرة اللغوية (${topic}) ويعرب شواهدها إعراباً سليماً ويدمجها في إنتاجه الشفهي والكتابي.`;
    problem = `الأصل في الإعراب أن يطابق مقتضى المعنى والتركيب؛ فما هي الضوابط الإعرابية والمفاهيمية التي تضبط (${topic}) في لغة الضاد؟`;
    steps = [
      {
        stage: 'وضعيّة الانطلاق',
        objectiveDomain: 'معرفيّ',
        strategy: 'التعلم بالاكتشاف / العصف الذهني',
        teacherActivity: `يطرح إشكالاً دالاً يستحضر تمثلات التلاميذ لتشخيص المكتسبات القبلية حول (${topic}) وإثارة التساؤل حول وظيفتها الإعرابية.`,
        studentActivity: 'يتذكر ويسترجع معارفه السابقة، يكتشف موقع الظاهرة الإعرابية، ويعلل فرضياته الأولية.',
        evaluationType: 'تشخيصيّ',
        indicatorsAndTiming: '03 دقائق',
        method: 'التعلم بالاكتشاف'
      },
      {
        stage: 'وضعيّة بناء التعلمات (الملاحظة والاستقراء)',
        objectiveDomain: 'مهاريّ ومعرفيّ',
        strategy: 'فكر - زاوج - شارك',
        teacherActivity: `يسجل الشواهد والأمثلة البانية للتعلمات على السبورة ويوجه أسئلة الاستكشاف والتحليل لتفكيك (${topic}).`,
        studentActivity: 'يقرأ الأمثلة وضبطها بالشكل، يلاحظ عناصر الظاهرة، ويستنتج التغييرات الإعرابية والدلالية.',
        evaluationType: 'تكوينيّ',
        indicatorsAndTiming: '15 دقيقة / 3 أسطر',
        method: 'استقراء الشواهد'
      },
      {
        stage: 'وضعيّة بناء التعلمات (بناء القاعدة ورسم الخرائط)',
        objectiveDomain: 'معرفيّ ومهاريّ',
        strategy: 'خرائط المفاهيم الذهنية / التعلم التعاوني',
        teacherActivity: `يقود المناقشة لصياغة أحكام القاعدة العامة لـ (${topic})، ويدعو المتعلمين لرسم خريطة مفاهيمية تلخص الأحكام بدقة.`,
        studentActivity: 'يشارك في بناء القاعدة، يرسم الخريطة الذهنية على كراسه، وينشئ أمثلة توضيحية لكل حكم.',
        evaluationType: 'تكوينيّ',
        indicatorsAndTiming: '20 دقيقة / خريطة مفاهيم',
        method: 'خرائط المفاهيم'
      },
      {
        stage: 'وضعيّة التّقييم والاستثمار (إحكام الموارد)',
        objectiveDomain: 'مهاريّ وتحصيليّ',
        strategy: 'الرؤوس المرقمة وتطبيقات البكالوريا',
        teacherActivity: `يعرض تطبيقات إعرابية مأخوذة من أسئلة الامتحانات الرسمية حول (${topic})، ويكلف بإنتاج فقرة توظف الظاهرة المدروسة.`,
        studentActivity: 'يعرب الشواهد بدقة، ويعلل الأحكام، وينتج نصاً قصيراً موظفاً المكتسبات الجديدة.',
        evaluationType: 'تحصيليّ',
        indicatorsAndTiming: '15 دقيقة / 05 جمل مضبوطة',
        method: 'الإنتاج الفردي والتقويم'
      }
    ];
  } else if (isRhetoric) {
    compFinal = `يقف على جماليات البلاغة والبيان في (${topic})، ويميز أثرها النفسي والمعنوي في المتلقي، ويوظفها في التعبير.`;
    problem = `الكلام البليغ هو ما طابق مقتضى الحال وأفاد المعنى بأجمل عبارة؛ فما هي لطائف (${topic}) البلاغية وكيف نميزها في النصوص؟`;
    steps = [
      {
        stage: 'وضعيّة الانطلاق',
        objectiveDomain: 'معرفيّ',
        strategy: 'الملاحظة والمفاضلة البيانية',
        teacherActivity: `يعرض أسلوبين أحدهما حقيقي والآخر مجازي يتضمن (${topic}) للمفاضلة بينهما واستشعار الأثر البلاغي.`,
        studentActivity: 'يقارن بين الأسلوبين، يستشعر جمال التعبير البلاغي، ويتحفز لاكتشاف أركانه.',
        evaluationType: 'تشخيصيّ',
        indicatorsAndTiming: '03 دقائق',
        method: 'المفاضلة والاستكشاف'
      },
      {
        stage: 'وضعيّة بناء التعلمات (اكتشاف وبناء الخلاصة)',
        objectiveDomain: 'مهاريّ ووجدانيّ',
        strategy: 'فكر - زاوج - شارك',
        teacherActivity: `يوجه المتعلمين إلى تحليل شواهد (${topic})، استخراج أركانها، وبيان وجه البلاغة وسر الجمال المعنوي والحركي.`,
        studentActivity: 'يناقش زميله، يشرح الصورة البلاغية، يحدد أركانها، ويستخلص الأغراض الجمالية (توضيح المعنى، التأثير في النفس).',
        evaluationType: 'تكوينيّ',
        indicatorsAndTiming: '20 دقيقة / 4 تشبيهات',
        method: 'فكر-زاوج-شارك'
      },
      {
        stage: 'وضعيّة التّقييم والاستثمار',
        objectiveDomain: 'مهاريّ وتحصيليّ',
        strategy: 'الإنتاج الإبداعي الفردي',
        teacherActivity: `يكلف بإنشاء أساليب بلاغية من إبداع المتعلمين تجسد (${topic}) في سياقات وصفية وجدانية مستوحاة من الواقع.`,
        studentActivity: 'ينشئ أساليب بلاغية متنوعة، يتذوق جمال المعنى، ويوظف الصور في فقرة إنشائية متماسكة.',
        evaluationType: 'تحصيليّ',
        indicatorsAndTiming: '15 دقيقة / فقرة من 5 أسطر',
        method: 'الإنتاج الإبداعي'
      }
    ];
  } else if (isWriting) {
    compFinal = `ينتج مقالاً نقدياً أو وضعية إدماجية مركبة حول (${topic}) مستوفية لمعايير الملاءمة وأدوات المادة والانسجام وجودة العرض.`;
    problem = `كيف نصوغ فكرة متماسكة حول (${topic}) في شكل مقال تحليلي نقدي مستوفٍ للشروط الفكرية واللغوية الرسمية؟`;
    steps = [
      {
        stage: 'وضعيّة الانطلاق',
        objectiveDomain: 'معرفيّ ووجدانيّ',
        strategy: 'شاهد - استوعب - عبّر',
        teacherActivity: `عرض سند استثاري دال حول (${topic}) وطرح التعليمة وتحديد أبعاد الوضعية الإدماجية والإنتاج المنتظر.`,
        studentActivity: 'يتفاعل مع السند، يستوعب المطلوب، ويتحفز لصياغة الأفكار وتصميم المقاطع.',
        evaluationType: 'تشخيصيّ',
        indicatorsAndTiming: '05 دقائق',
        method: 'العصف الذهني'
      },
      {
        stage: 'وضعيّة بناء التعلمات (جدول المهام والتصميم)',
        objectiveDomain: 'مهاريّ ونقديّ',
        strategy: 'التعلم التعاوني (أفواج رباعية)',
        teacherActivity: `إدارة صياغة جدول المهام وتوزيع الموارد (المقدمة، العرض، الخاتمة) وضبط الأنماط النصية المناسبة (تفسيري/حجاجي).`,
        studentActivity: 'عمل تعاوني بالأفواج: تنظيم الأفكار، تحديد شواهد الدعم، وصياغة فقرات مستوفية للروابط المنطقية.',
        evaluationType: 'تكوينيّ',
        indicatorsAndTiming: '25 دقيقة / مسودة متكاملة',
        method: 'التعلم التعاوني'
      },
      {
        stage: 'وضعيّة الإنتاج والتقييم',
        objectiveDomain: 'تحصيليّ وشامل',
        strategy: 'شبكات التقييم الذاتي والجماعي',
        teacherActivity: `تطبيق شبكة التقييم وفق المعايير الأربعة (الملاءمة، أدوات المادة، الانسجام، جودة العرض) وبناء التغذية الراجعة.`,
        studentActivity: 'تحرير المنتوج النهائي، إجراء التقييم الذاتي، وتصويب الأخطاء اللغوية والمنهجية.',
        evaluationType: 'تحصيليّ',
        indicatorsAndTiming: '15 دقيقة / شبكة التقييم',
        method: 'شبكة التقييم الذاتي'
      }
    ];
  } else {
    // أدب ونصوص / قراءة وتحليل
    steps = [
      {
        stage: 'وضعيّة الانطلاق',
        objectiveDomain: 'معرفيّ ووجدانيّ',
        strategy: 'العصف الذهني والحوار الاستكشافي',
        teacherActivity: `يطرح إشكالاً دالاً يستحضر تمثلات المتعلمين حول موضوع (${topic}) ويربطه بسياقه التاريخي والأدبي.`,
        studentActivity: 'يتفاعل مع السؤال، يسترجع مكتسباته، ويتحفز لاستكشاف أبعاد النص ومقاصده.',
        evaluationType: 'تشخيصيّ',
        indicatorsAndTiming: '03 دقائق',
        method: 'العصف الذهني'
      },
      {
        stage: 'وضعيّة بناء التعلمات (اكتشاف ومناقشة المعطيات)',
        objectiveDomain: 'معرفيّ ومهاريّ',
        strategy: 'فكر - زاوج - شارك',
        teacherActivity: `يوجه القراءة المعبرة للنص، ويطرح أسئلة اكتشاف المعطيات ومناقشتها لاستخراج الأفكار والحقول الدلالية والرموز.`,
        studentActivity: 'يقرأ قراءة واعية، يستخرج الأفكار، يحلل تجربة الشاعر/الكاتب، ويناقش الأبعاد الفكرية والفنية.',
        evaluationType: 'تكوينيّ',
        indicatorsAndTiming: '20 دقيقة / إجابات معللة',
        method: 'فكر-زاوج-شارك'
      },
      {
        stage: 'وضعيّة بناء التعلمات (بناء النص والاتساق والانسجام)',
        objectiveDomain: 'مهاريّ ونقديّ',
        strategy: 'التعلم التعاوني بأفواج رباعية',
        teacherActivity: `توجيه المتعلمين لتحديد النمط النصي ومؤشراته، واستخراج مظاهر الاتساق والانسجام والروابط المنطقية.`,
        studentActivity: 'يربط بين قصدية النص ونمطه، يستخرج المؤشرات، ويفكك الروابط المعنوية والتركيبية.',
        evaluationType: 'تكوينيّ',
        indicatorsAndTiming: '20 دقيقة / مؤشرات النمط',
        method: 'التعلم التعاوني'
      },
      {
        stage: 'وضعيّة التّقييم والاستثمار',
        objectiveDomain: 'مهاريّ وتحصيليّ',
        strategy: 'الإنتاج الفردي والتقييم',
        teacherActivity: `يكلف بإنتاج فقرة تركيبية تجمل القول في تقدير النص وتحديد النزعة والقيم المستخلصة.`,
        studentActivity: 'ينتج فقرة نقدية مكثفة تبين خصائص النص ونزعة الكاتب وقيم النص الإنسانية والوطنية.',
        evaluationType: 'تحصيليّ',
        indicatorsAndTiming: '15 دقيقة / فقرة من 5 أسطر',
        method: 'الإنتاج الفردي'
      }
    ];
  }

  return {
    institution: institution || 'مؤسسة تربوية رسمية',
    targetGroup: `${grade} (${stream})`,
    unitNumberAndTitle: unit || 'الوحدة التعليمية المعتمدة',
    unitDuration: '06 ساعات',
    activity: activity,
    topic: topic,
    support: tools,
    competencyFinal: compFinal,
    competencyTarget: `التحكم في معطيات ومفاهيم (${topic})، والقدرة على توظيفها السليم في وضعيات تواصلية جديدة في إطار ${unit}.`,
    objectivesList: [
      `أن يتعرف المتعلم بدقة على المفهوم الجوهري لـ: ${topic}.`,
      `أن يحلل الشواهد والسياقات النصية المرتبطة بموضوع الحصة.`,
      `أن يوظف المكتسبات الجديدة في حل تطبيقات وأنشطة إدماجية فردية وجماعية.`
    ],
    indicators: [
      `أن يتعرف المتعلم بدقة على المفهوم الجوهري لـ: ${topic}.`,
      `أن يحلل الشواهد والسياقات النصية المرتبطة بموضوع الحصة.`,
      `أن يوظف المكتسبات الجديدة في حل تطبيقات وأنشطة إدماجية فردية وجماعية.`
    ],
    prerequisites: `المكتسبات القبلية المقررة في المناهج السابقة ذات الصلة بنشاط ${activity}.`,
    problemSituation: problem,
    tools: tools,
    toolsNote: 'تحدد الوسائل: الكتاب المدرسي - الكتب والمصادر والمراجع – الأسناد المكتوبة (المطبوعات والصور) والمرئية (فيديو) والمسموعة (تسجيل صوتي).',
    steps: steps,
    evaluationDiag: 'أسئلة تشخيصية لتحديد المكتسبات القبلية (03 دقائق)',
    evaluationFormative: 'ملاحظة أداء المتعلمين وتدقيق المؤشرات والتعليل أثناء الإنجاز',
    evaluationFinal: 'إنتاج فقرة تطبيقية إدماجية وتقويم تحصيلي فوري (15 دقيقة)',
    remediation: 'دعم فردي للمتعثرين مع تمارين إضافية مبسطة ورأب الصدع المعرفي',
    enrichment: 'أنشطة إثرائية وبحثية للمتفوقين وتعميق في المراجع الأدبية',
    notes: `تم التوليد البيداغوجي وفق المقاربة بالكفاءات ومنهاج الجيل الثاني لوزارة التربية الوطنية.`,
    values: val,
    source: 'local_curriculum_engine'
  };
}

/**
 * 2. توليد مواضيع الفروض والامتحانات الرسمية بسلالم التنقيط
 */
export function generateLocalExam(params: {
  grade: 'السنة الأولى' | 'السنة الثانية' | 'السنة الثالثة';
  stream: string;
  unitTheme?: string;
}): GeneratedExamResult {
  const is3AS = params.grade === 'السنة الثالثة';
  const isLiterary = params.stream.includes('آداب') || params.stream.includes('لغات');

  if (is3AS && !isLiterary) {
    // امتحان بكالوريا تجريبي للشعب العلمية المشتركة (محور القضية الفلسطينية والالتزام)
    return {
      title: 'امتحان البكالوريا التجريبي الموحد في مادة اللغة العربية وآدابها (الشعب العلمية)',
      level: 'السنة الثالثة ثانوي (3AS)',
      stream: 'شعب علمية مشتركة (علوم تجريبية / رياضيات / تقني رياضي / تسيير واقتصاد)',
      subject: 'اللغة العربية وآدابها',
      duration: 'ساعتان ونصف (02 سا و30 د)',
      readingText: `1. هُنَا، عِنْدَ مُنْحَدَرَاتِ التِّلاَلِ، أَمَامَ الغُرُوبِ وَفُوَّهَةِ الوَقْتِ،
قُرْبَ بَسَاتِينِ مَقْطُوعَةِ الظِّلِّ،
نَفْعَلُ مَا يَفْعَلُ السَّاجِنُونَ،
وَمَا يَفْعَلُ العَاطِلُونَ عَنِ العَمَلِ:
نُرَبِّي الأَمَلْ.
2. بِلادٌ عَلَى أُهْبَةِ الفَجْرِ. صِرْنَا أَقَلَّ ذَكَاءً،
لأَنَّا نُحَمْلِقُ فِي سَاعَةِ النَّصْرِ:
لاَ لَيْلَ فِي لَيْلِنَا المُتَلأْلِئِ بِالقَصْفِ.
أَعْدَاؤُنَا يُوقِدُونَ لَنَا النَّارَ فِي غَسَقِ الأَقْبِيَةْ.
3. أَيُّهَا الوَاقِفُونَ عَلَى العَتَبَاتِ ادْخُلُوا،
وَاشْرَبُوا مَعَنَا القَهْوَةَ العَرَبِيَّةَ
[قَدْ تَشْعُرُونَ بِأَنَّكُمْ بَشَرٌ مِثْلَنَا]
أَيُّهَا الوَاقِفُونَ عَلَى عَتَبَاتِ البُيُوتِ!
اخْرُجُوا مِنْ صَبَاحَاتِنَا،
نَطْمَئِنَّ عَلَى أَنَّنَا... بَشَرٌ مِثْلَكُمْ!`,
      author: 'محمود درويش (قصيدة: حالة حصار)',
      intellectualComprehension: [
        { question: 'ما الحالة النفسية والواقعية التي يصورها الشاعر في المقطع الأول؟ وما دلالة عبارة "نربي الأمل"؟', points: 2 },
        { question: 'في المقطع الثالث تعريض وسخرية لاذعة من المحتل؛ وضح ذلك مبيناً الرسالة الإنسانية التي يوجهها درويش.', points: 2 },
        { question: 'تنتمي القصيدة إلى شعر الالتزام؛ عرفه، ثم استخرج مظهرين من مظاهره مجسدين في النص.', points: 2 },
        { question: 'حدد نمط المقطع الأخير مع ذكر مؤشرين مميزين له مع التمثيل من الأسطر الشعرية.', points: 2 },
        { question: 'لخص مضمون النص بأسلوبك الخاص مراعياً تقنيات التلخيص (حجم الربع، سلامة اللغة، الأمانة الدلالية).', points: 2 }
      ],
      linguisticCompetence: [
        { question: 'أعرب ما تحته خط إعراب مفردات: "بشرٌ"، وما بين قوسين إعراب جمل: (قد تشعرون بأنكم بشرٌ).', points: 3 },
        { question: 'في قول الشاعر: "نربي الأمل" صورة بيانية؛ سمها، اشرحها، وبين سر بلاغتها وأثرها في المعنى.', points: 2 },
        { question: 'استخرج من النص أسلوباً إنشائياً مبيناً نوعه وصيغته وغرضه البلاغي.', points: 1.5 },
        { question: 'بين مظهراً من مظاهر الاتساق والانسجام في النص (الروابط أو الإحالة) مع التمثيل.', points: 1.5 }
      ],
      integrationSituation: {
        context: 'تظل القضية الفلسطينية قضية العرب المركزية ومحور التزام الشعراء والأدباء الأحرار.',
        task: 'اكتب مقالاً تفسيرياً حجاجياً في حدود 10 إلى 12 سطراً تبين فيه دور الكلمة الحرة المقاومة في فضح جرائم المحتل ودعم صمود الشعب الفلسطيني، موظفاً (إذا) الشرطية، ومحسناً بديعياً لفظياً، ومستثمراً جملة لا محل لها من الإعراب.',
        points: 4
      },
      rubric: [
        { question: 'الحالة النفسية ودلالة نربي الأمل', answer: 'الحالة: الصمود والتحدي رغم قسوة الحصار والدمار. دلالة "نربي الأمل": التمسك بالحياة والحرية وتحويل المعاناة إلى قوة وصبر دائم.', points: 2 },
        { question: 'السخرية والرسالة الإنسانية', answer: 'السخرية: دعوة المحتل لشرب القهوة والتذكير بإنسانيته المفقودة. الرسالة: الشعب الفلسطيني شعب حي يطالب بحقه الطبيعي في العيش الكريم وطرد الغزاة.', points: 2 },
        { question: 'شعر الالتزام ومظاهره', answer: 'التعريف: أن يسخر الشاعر فنه وقلمه لخدمة قضايا وطنه وأمته متحملاً المسؤولية. المظهران: 1. تبني قضية الوطن 2. النبرة التحررية والدعوة للصمود.', points: 2 },
        { question: 'النمط', answer: 'إيعازي (طلبي) / حجاجي؛ المؤشرات: الأفعال الإنشائية (ادخلوا، اخرجوا)، النداء (أيها الواقفون)، التعليل والمنطق.', points: 2 },
        { question: 'الإعراب والصور البيانية', answer: 'بشر: خبر تشعرون مرفوع وعلامة رفعه الضمة. (قد تشعرون...): جملة لا محل لها من الإعراب (ابتدائية أو استئنافية). نربي الأمل: استعارة مكنية حيث شبه الأمل بطفل يربى.', points: 5 }
      ]
    };
  }

  // امتحان افتراضي للأقسام الأدبية أو السنوات الأخرى
  return {
    title: 'امتحان الثلاثي النموذجي في مادة اللغة العربية وآدابها (عصر الضعف والنثر العلمي)',
    level: 'السنة الثالثة ثانوي (3AS)',
    stream: isLiterary ? 'شعبة آداب وفلسفة ولغات أجنبية' : 'الشعب العلمية المشتركة',
    subject: 'اللغة العربية وآدابها',
    duration: 'ساعتان ونصف (02 سا و30 د)',
    readingText: `« اعْلَمْ أَنَّ فَنَّ التَّارِيخِ فَنٌّ عَزِيزُ المَذْهَبِ، جَمُّ الفَوَائِدِ، شَرِيفُ الغَايَةِ؛ إِذْ هُوَ يُوقِفُنَا عَلَى أَحْوَالِ المَاضِينَ مِنَ الأُمَمِ فِي أَخْلاَقِهِمْ، وَالأَنْبِيَاءِ فِي سِيَرِهِمْ، وَالمُلُوكِ فِي دُوَلِهِمْ وَسِيَاسَتِهِمْ، حَتَّى تَتِمَّ فَائِدَةُ الاقْتِدَاءِ فِي ذَلِكَ لِمَنْ يَرُومُهُ فِي أَحْوَالِ الدِّينِ وَالدُّنْيَا.
وَهُوَ مُحْتَاجٌ إِلَى مَآخِذَ مُتَعَدِّدَةٍ، وَمَعَارِفَ مُتَنَوِّعَةٍ، وَحُسْنِ نَظَرٍ وَتَثَبُّتٍ يُفْضِيَانِ بِصَاحِبِهِمَا إِلَى الحَقِّ، وَيَنْكُبَانِ بِهِ عَنِ المَزَلاَّتِ وَالمُغَالَطَاتِ؛ لأَنَّ الأَخْبَارَ إِذَا اعْتُمِدَ فِيهَا عَلَى مُجَرَّدِ النَّقْلِ، وَلَمْ تُحَكَّمْ أُصُولُ العَادَةِ وَقَوَاعِدُ السِّيَاسَةِ، وَطَبِيعَةُ العُمْرَانِ وَالأَحْوَالِ فِي الاِجْتِمَاعِ الإِنْسَانِيِّ، فَكَثِيرًا مَا يَكُونُ المَزَلُّ وَمَدْحَضُ البَاطِلِ! »`,
    author: 'عبد الرحمن بن خلدون (مقدمة ابن خلدون)',
    intellectualComprehension: [
      { question: 'ما هو المفهوم الظاهري للتاريخ وما هو مفهومه الباطني الحقيقي حسب النص؟', points: 3 },
      { question: 'ينتمي النص إلى فن النثر العلمي المتأدب؛ اذكر ثلاثة من أبرز خصائصه المجسدة في الفقرة.', points: 3 },
      { question: 'حدد نمط النص مع ذكر مؤشرين مميزين له.', points: 2 },
      { question: 'لخص مضمون النص بأسلوبك الخاص مع الالتزام بشروط التلخيص المنهجي.', points: 4 }
    ],
    linguisticCompetence: [
      { question: 'أعرب ما تحته خط إعراب مفردات: "فَنٌّ"، وما بين قوسين إعراب جمل: (يُوقِفُنَا عَلَى أَحْوَالِ المَاضِينَ).', points: 3 },
      { question: 'في العبارة: "فن التاريخ عزيز المذهب" صورة بيانية؛ بين نوعها وسر بلاغتها.', points: 2 },
      { question: 'استخرج من النص محسناً بديعياً لفظياً وآخر معنوياً، مبيناً نوعهما وأثرهما في المعنى.', points: 3 }
    ],
    criticalEvaluation: isLiterary ? [
      { question: 'عرف فن النثر العلمي المتأدب، واذكر أسباب ازدهاره في عصر المماليك وأبرز رواده.', points: 2 },
      { question: 'قارن بين أسلوب ابن خلدون وأسلوب معاصريه كابن بطوطة والقزويني من حيث الصنعة اللفظية والموضوعية.', points: 2 }
    ] : undefined,
    integrationSituation: {
      context: 'يمثل المنهج العلمي أساس التطور البشري وحماية العقل من الخرافات والشائعات.',
      task: 'اكتب نصاً تفسيرياً حجاجياً في حدود 10 أسطر تبرز فيه أهمية التحري والموضوعية في نقل الأخبار وتحليلها في عصر شبكات التواصل الاجتماعي، موظفاً (إذا) الفجائية واستعارة تصريحية.',
      points: 5
    },
    rubric: [
      { question: 'مفهوم التاريخ', answer: 'المفهوم الظاهري: سرد أخبار القرون الماضية. المفهوم الباطني: التحقيق والتعليل والبحث في أسباب الوقائع وقوانين العمران البشري.', points: 3 },
      { question: 'خصائص النثر العلمي المتأدب', answer: 'الدقة والمصطلحات، الاستدلال المنطقي والحياد، الاستعانة بالسجع العفوي والمحسنات غير المتكلفة للبيان.', points: 3 },
      { question: 'النمط', answer: 'تفسيري؛ المؤشرات: أدوات التعليل (لذلك، فهو، إذ)، الجمل الاسمية الدالة على الثبوت، غياب العاطفة الشخصية.', points: 2 }
    ]
  };
}

/**
 * دالة مساعدة لاستدعاء خادم Ollama المحلي على الجهاز إن وُجد (اختياري 100%)
 */
async function callLocalOllama(params: { model: string; prompt: string }): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout

    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: params.model,
        prompt: params.prompt,
        stream: false,
        format: 'json'
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.response) {
      return JSON.parse(data.response);
    }
  } catch (err) {
    // Ollama not installed or offline, purely silent fail
  }
  return null;
}
