/**
 * محرك الذكاء الاصطناعي المحلي التربوي المفتوح والمجاني (Local Pedagogical AI Engine)
 * مبني وفق فلسفة "مشروع باقون": توليد بيداغوجي ذاتي دائم، بدون انقطاع، برصيد غير منتهي،
 * مستند إلى قاعدة بيانات المنهاج الجزائري الرسمي لمادة اللغة العربية في الطور الثانوي.
 */

import { SECONDARY_ARABIC_CURRICULUM, findCurriculumLesson, CurriculumLessonItem } from './secondaryArabicCurriculumData';

export interface GeneratedMemoResult {
  competencyFinal: string;
  competencyTarget: string;
  indicators: string[];
  prerequisites: string;
  problemSituation: string;
  steps: {
    stage: string;
    teacherActivity: string;
    studentActivity: string;
    method: string;
  }[];
  tools: string;
  evaluationDiag: string;
  evaluationFormative: string;
  evaluationFinal: string;
  remediation: string;
  enrichment: string;
  notes: string;
  values: string;
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
  useOllama?: boolean;
  ollamaModel?: string;
}): Promise<GeneratedMemoResult> {
  const { grade, activity, topic, unit, stream, useOllama, ollamaModel } = params;

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
    return formatCurriculumItemToMemo(curriculumMatch, topic, activity);
  }

  // المحاولة الثالثة: محرك القوالب البيداغوجية الذاتي المنشئ وفق المقاربة بالكفاءات (Deterministic Engine)
  return buildDynamicPedagogicalMemo({
    grade,
    subject: params.subject || 'اللغة العربية وآدابها',
    activity: activity || 'أدب ونصوص',
    topic: topic || 'الدرس المنهجي المقترح',
    unit: unit || 'الوحدة التعليمية المعتمدة',
    stream: stream || 'جميع الشعب'
  });
}

/**
 * تحويل عنصر المنهاج المسترجع إلى مذكرة متكاملة المراحل
 */
function formatCurriculumItemToMemo(item: CurriculumLessonItem, requestedTopic: string, activity: string): GeneratedMemoResult {
  return {
    competencyFinal: item.competencyFinal,
    competencyTarget: item.competencyTarget,
    indicators: item.indicators,
    prerequisites: item.prerequisites,
    problemSituation: item.problemSituation,
    steps: [
      {
        stage: 'وضعية الانطلاق (05 د)',
        teacherActivity: `يطرح وضعية مشكلة دالة مستمدة من الواقع: "${item.problemSituation.slice(0, 150)}..." ويحفز تمثلات المتعلمين.`,
        studentActivity: 'يسترجع مكتسباته القبلية، يتفاعل مع الإشكال المطروح، ويصيغ فرضيات أولية لبناء التعلم.',
        method: 'العصف الذهني والحوار الاستكشافي'
      },
      {
        stage: 'بناء التعلمات - نشاط 1: الملاحظة والاكتشاف (20 د)',
        teacherActivity: `${item.teacherActivity} - يوجه إلى تفكيك الظاهرة وتحليل الشواهد اللغوية/الأدبية.`,
        studentActivity: `${item.studentActivity} - يلاحظ، يقارن، ويستخرج الخصائص النوعية والروابط النصية.`,
        method: item.method || 'التحليل الاستقرائي'
      },
      {
        stage: 'بناء التعلمات - نشاط 2: التحليل والتركيب والتعميم (20 د)',
        teacherActivity: 'يدير المناقشة لصياغة الاستنتاجات الكلية وضبط المفاهيم البيداغوجية والقواعد الأساسية وتدوينها.',
        studentActivity: 'يشارك في بناء القاعدة العامة، يرتب النتائج، ويدون الخلاصة في كراسه بدقة.',
        method: 'العمل الجماعي / الثنائي الموجه'
      },
      {
        stage: 'استثمار المكتسبات والتقويم الختامي (15 د)',
        teacherActivity: `يطرح نشاطاً تطبيقياً إدماجياً لترسيخ التعلمات: "${item.evaluationFinal}" مع متابعة الأداء الفردي.`,
        studentActivity: 'يوظف الموارد المكتسبة حديثاً في حل الوضعية التطبيقية ويصحح ذاتياً وجماعياً.',
        method: 'الإنتاج الفردي والتصويب التفاعلي'
      }
    ],
    tools: item.tools || 'الكتاب المدرسي، السبورة، وثائق المنهاج، نصوص مساعدة',
    evaluationDiag: item.evaluationDiag,
    evaluationFormative: item.evaluationFormative,
    evaluationFinal: item.evaluationFinal,
    remediation: item.remediation,
    enrichment: item.enrichment,
    notes: `تم التوليد محلياً بالاعتماد التام على المنهاج الرسمي الجزائري (المحور: ${item.unitTitle} - ${item.theme}) برصيد غير منتهي.`,
    values: item.values,
    source: 'local_curriculum_engine'
  };
}

/**
 * محرك التوليد البيداغوجي الذاتي لأي موضوع غير مدرج حرفياً
 */
function buildDynamicPedagogicalMemo(params: {
  grade: string;
  subject: string;
  activity: string;
  topic: string;
  unit: string;
  stream: string;
}): GeneratedMemoResult {
  const { grade, activity, topic, unit } = params;

  const isGrammar = activity.includes('قواعد') || activity.includes('نحو') || activity.includes('صرف');
  const isRhetoric = activity.includes('بلاغة') || activity.includes('بيان') || activity.includes('بديع');
  const isWriting = activity.includes('تعبير') || activity.includes('إدماج') || activity.includes('وضعية');
  const isPoetry = activity.includes('نصوص') || activity.includes('أدب') || activity.includes('شعر');

  let compFinal = `في مقام تواصل دال، ينتج المتعلم مشافهة أو كتابة خطاباً منسجماً موظفاً معارفه حول (${topic}) بما يعكس كفاءته اللغوية والفكرية.`;
  let compTarget = `التحكم في معطيات ومفاهيم (${topic})، والقدرة على توظيفها السليم في وضعيات تواصلية جديدة في إطار ${unit}.`;
  let problem = `تطرح اللغة العربية أساليب متعددة للتعبير عن الدلالات بدقة؛ فكيف يسهم موضوع (${topic}) في إحكام بناء النص وإبراز المعنى المقصود بوضوح؟`;
  let val = 'الاعتزاز باللغة العربية كوعاء حضاري، وتنمية التفكير المنطقي والذوق الجمالي الرفيع.';

  if (isGrammar) {
    compFinal = `التحكم في الظاهرة اللغوية (${topic}) واستعمالها مشافهة وكتابة استعمالاً صحيحاً خالياً من اللحن والخطأ التركيبي.`;
    compTarget = `اكتشاف أحكام وقواعد (${topic}) وتحديد موقعها في الاتساق والانسجام النحوي.`;
    problem = `كثيراً ما يقع المتعلمون في اللحن عند صياغة جمل تتضمن (${topic})؛ فما هي الضوابط الإعرابية والمفاهيمية التي تضبط هذه الظاهرة؟`;
  } else if (isRhetoric) {
    compFinal = `تذوق بلاغة القول، وتوظيف الأساليب البيانية والبديعية المناسبة لمقتضى الحال في الإنتاج الأدبي والتواصلي.`;
    compTarget = `الوقوف على سر الجمال البلاغي لـ (${topic}) وأثرها المعنوي والنفسي في المتلقي.`;
    problem = `الكلام البليغ هو ما طابق مقتضى الحال وأفاد المعنى بأجمل عبارة؛ فما هي لطائف (${topic}) البلاغية وكيف نميزها في النصوص؟`;
  } else if (isWriting) {
    compFinal = `إنتاج نصوص مركبة ذات طابع حجاجي أو تفسيري تستوفي معايير الملاءمة والانسجام والاتساق مع سلامة اللغة.`;
    compTarget = `التدرب على تقنيات التحرير الكتابي وتوظيف الروابط المنهجية لمعالجة إشكالية (${topic}).`;
    problem = `كيف نصوغ فكرة متماسكة حول (${topic}) في شكل مقال أو وضعية مستوفية للشروط الفكرية واللغوية الرسمية؟`;
  }

  return {
    competencyFinal: compFinal,
    competencyTarget: compTarget,
    indicators: [
      `أن يتعرف المتعلم بدقة على المفهوم الجوهري لـ: ${topic}.`,
      `أن يحلل الشواهد والسياقات النصية المرتبطة بموضوع الحصة.`,
      `أن يوظف المكتسبات الجديدة في حل تطبيقات وأنشطة إدماجية فردية وجماعية.`
    ],
    prerequisites: `المكتسبات القبلية المقررة في المناهج السابقة ذات الصلة بنشاط ${activity}.`,
    problemSituation: problem,
    steps: [
      {
        stage: 'وضعية الانطلاق (05 د)',
        teacherActivity: `يطرح إشكالاً دالاً يستحضر تمثلات التلاميذ حول (${topic}) لتشخيص المكتسبات القبلية.`,
        studentActivity: 'يجيب المتعلم، يقارن بين الإجابات، ويتحفز لاكتشاف الجديد واقتراح الفرضيات.',
        method: 'الحوار الأفقي والعصف الذهني'
      },
      {
        stage: 'بناء التعلمات - الملاحظة والاستقراء (20 د)',
        teacherActivity: 'يعرض سند التعلم (نص / شواهد / أمثلة) على السبورة ويوجه أسئلة الاستكشاف والتحليل المنهجي.',
        studentActivity: 'يقرأ السند، يحدد عناصر الظاهرة، ويفكك الروابط الدلالية والتركيبية بمساعدة الأستاذ.',
        method: 'الطريقة الاستقرائية التحليلية'
      },
      {
        stage: 'بناء التعلمات - الاستنتاج والتركيب (20 د)',
        teacherActivity: 'يدير صياغة القاعدة أو الخلاصة التركيبية، ويشجع المتعلمين على توليد القواعد بألفاظهم.',
        studentActivity: 'يشارك بفاعلية في صياغة الاستنتاج، يلخص الأفكار الأساسية، ويثبتها في كراسه.',
        method: 'التعلم التعاوني الموجه'
      },
      {
        stage: 'استثمار المكتسبات والتقويم (15 د)',
        teacherActivity: `يقدم تمرين تطبيقياً فورياً أو وضعية إدماجية مصغرة حول (${topic}) ويتابع الإنجاز.`,
        studentActivity: 'ينجز التطبيق بشكل فردي، يصحح على السبورة، ويقوم أداءه الذاتي.',
        method: 'الإنتاج المستقل والتغذية الراجعة'
      }
    ],
    tools: 'الكتاب المدرسي، السبورة، بطاقات الشواهد، سندات الإيضاح المعتمدة',
    evaluationDiag: `أسئلة استكشافية سريعة لتشخيص مدى استيعاب المكتسبات السابقة ذات الصلة بـ ${topic}.`,
    evaluationFormative: `مراقبة إنجاز المتعلمين أثناء مراحل التحليل وتصويب التمثلات الخاطئة في حينها.`,
    evaluationFinal: `حل تمرين تطبيقي أو كتابة فقرة توظف فيها مكتسبات درس (${topic}) بشكل سليم.`,
    remediation: 'تقديم سندات مبسطة وأمثلة شارحة إضافية للمتعثرين مع التركيز على جوهر الظاهرة.',
    enrichment: 'تكليف المتفوقين باستخراج شواهد متقدمة من التراث الأدبي أو القرآن الكريم وتطبيق القواعد عليها.',
    notes: `مذكرة مولدة بنظام الذكاء الاصطناعي المحلي المنهجي لتمكين، مطابقة للمقاربة بالكفاءات (الجيل الثاني).`,
    values: val,
    source: 'local_curriculum_engine'
  };
}

/**
 * توليد موضوع اختبار أو فرض نموذجي كامل للغة العربية بالثانوي مع سلم التنقيط
 */
export function generateLocalExam(params: {
  grade: 'السنة الأولى' | 'السنة الثانية' | 'السنة الثالثة';
  stream: string;
  unitTheme?: string;
}): GeneratedExamResult {
  const is3AS = params.grade === 'السنة الثالثة';
  const isLiterary = params.stream.includes('آداب') || params.stream.includes('لغات');

  if (is3AS && isLiterary) {
    return {
      title: 'امتحان تجريبي موحد في مادة اللغة العربية وآدابها (شهادة البكالوريا)',
      level: 'السنة الثالثة ثانوي',
      stream: 'شعبة أدب وفلسفة / لغات أجنبية',
      subject: 'اللغة العربية وآدابها',
      duration: '03 ساعات ونصف',
      readingText: `قال الشاعر مفدي زكريا في الثورة التحريرية وقيم الالتزام:
1. وقـفـنـا عـلى قِـمَـمِ الـمَـجْـدِ هَـامـا *** نُـحَـيِّـي الـجَـزائـرَ عَـامـاً فَـعَـامـا
2. ونَـبْـعَـثُ فـي الأُمَـمِ الـحُـرَّةِ صَـوْتـاً *** تَـعَـوَّدَ أَنْ لا يَـهَـابَ الـحِـمَـامـا
3. كَـتَـبْـنَـا عَـلى صَـفَـحـاتِ الـخُـلـودِ *** حَـيـاةً تُـذِلُّ الـمَـمـاتَ الـزُّؤامـا
4. هُـوَ الـشَّـعْـبُ قَـالَ فَـكَـانَ الـقَـضـاءُ *** وأَمْـضَـى عَـلى غَـاصِـبِـيـهِ انْـتِـقَـامـا
5. فَـثُـوْرُوا فَـإِنَّ الـشُّـعُـوبَ انْـتَـهَـتْ *** إِلـى أَنْ تُـحَـطِّـمَ عَـنْـهـا الـلِّـثـامـا`,
      author: 'مفدي زكريا (إلياذة الجزائر)',
      intellectualComprehension: [
        { question: 'إلى من يوجه الشاعر خطابه في مطلع القصيدة؟ وما الهدف من وراء ذلك؟', points: 2 },
        { question: 'تتجلى في النص نزعة الالتزام بقضايا الوطن والأمة؛ وضح معالمها من خلال ألفاظ النص.', points: 2.5 },
        { question: 'حدد نمط النص الغالب ومثل له بمؤشرين بارزين مع التمثيل.', points: 2 },
        { question: 'لخص مضمون الأبيات بأسلوبك الخاص مراعياً تقنيات التلخيص وسلامة اللغة.', points: 3.5 }
      ],
      linguisticCompetence: [
        { question: 'أعرب ما تحته خط إعراب مفردات، وما بين قوسين إعراب جمل.', points: 3 },
        { question: 'استخرج من البيت الثالث صورة بيانية، واشرحها مبيناً نوعها وسر بلاغتها.', points: 2 },
        { question: 'بين المعنى الدلالي لأدوات الاتساق والانسجام الواردة في البيتين الرابع والخامس.', points: 2 }
      ],
      criticalEvaluation: [
        { question: 'يُعد مفدي زكريا رائد شعر الثورة الجزائرية؛ ناقش مفهوم ظاهرة "الالتزام" في الأدب الحديث، مبيناً خصائصها وأبرز روادها في الجزائر والوطن العربي.', points: 3 }
      ],
      integrationSituation: {
        context: 'تعد الثورة التحريرية الجزائرية مصدر إلهام لكل حركات التحرر في العالم ورمزاً لعزة الإنسان.',
        task: 'حرر فقرة نقدية حجاجية في حدود 14 سطراً تبرز فيها كيف زاوج الشاعر الملتزم بين الكلمة الصادقة والبندقية، موظفاً جملة لها محل من الإعراب ومحسناً بديعياً معنوياً.',
        points: 4
      },
      rubric: [
        { question: 'مخاطب الشاعر وهدفه', answer: 'يوجه الشاعر خطابه إلى الشعب الجزائري والأمم الحرة بهدف إيقاظ الهمم وتمجيد انتصارات الثورة.', points: 2 },
        { question: 'نزعة الالتزام', answer: 'تسخير القلم لنصرة الثورة، ضمير المتكلم الجمعي (وقفنا، كتبنا)، معجم البطولة والتحرر.', points: 2.5 },
        { question: 'نمط النص ومؤشراته', answer: 'النمط حماسي حجاجي موشح بالوصفي؛ المؤشرات: الأفعال الماضية المعبرة، الجمل الخبرية التقريرية.', points: 2 },
        { question: 'التلخيص', answer: 'استيفاء الأفكار الأربعة، احترام الحجم (الربع)، سلامة اللغة وتجنب الاستنساخ الحرفي.', points: 3.5 }
      ]
    };
  }

  // الشعب العلمية المشتركة (3AS علمي)
  return {
    title: 'موضوع مقترح للبكالوريا في مادة اللغة العربية وآدابها (الشعب العلمية)',
    level: 'السنة الثالثة ثانوي',
    stream: 'علوم تجريبية / رياضيات / تقني رياضي / تسيير واقتصاد',
    subject: 'اللغة العربية وآدابها',
    duration: '02 ساعتان ونصف',
    readingText: `نص نثري في الأدب العلمي المتأدب للإمام عبد الرحمن ابن خلدون:
"إن التاريخ في ظاهره لا يزيد على أخبار عن الأيام والدول، والسوابق من القرون الأول، تنمو فيها الأقوال وتضرب فيها الأمثال... وفي باطنه نظر وتحقيق، وتعليل للكائنات ومبادئها دقيق، وعلم بكيفيات الوقائع وأسبابها عميق، فهو لذلك أصيل في الحكمة عريق، وجدير بأن يُعدَّ في علومها وخليق."`,
    author: 'عبد الرحمن بن خلدون (مقدمة ابن خلدون)',
    intellectualComprehension: [
      { question: 'ما هو المفهوم الظاهري للتاريخ وما هو مفهومه الباطني الحقيقي حسب النص؟', points: 3 },
      { question: 'ينتمي النص إلى فن النثر العلمي المتأدب؛ اذكر ثلاثة من أبرز خصائصه المجسدة في الفقرة.', points: 3 },
      { question: 'حدد نمط النص مع ذكر مؤشرين مميزين له.', points: 2 },
      { question: 'لخص مضمون النص بأسلوبك الخاص مع الالتزام بشروط التلخيص المنهجي.', points: 4 }
    ],
    linguisticCompetence: [
      { question: 'أعرب ما تحته خط إعراب مفردات: "دقيقٌ" ، وما بين قوسين إعراب جمل: (تضرب فيها الأمثال).', points: 3 },
      { question: 'في العبارة: "وفي باطنه نظر وتحقيق" أسلوب قصر، بين طريقته وغرضه البلاغي.', points: 2 },
      { question: 'استخرج من النص محسناً بديعياً لفظياً وآخر معنوياً، مبيناً نوعهما وأثرهما في المعنى.', points: 3 }
    ],
    integrationSituation: {
      context: 'يمثل المنهج العلمي أساس التطور البشري وحماية العقل من الخرافات والشائعات.',
      task: 'اكتب نصاً تفسيرياً حجاجياً في حدود 10 أسطر تبرز فيه أهمية التحري والموضوعية في نقل الأخبار وتحليلها في عصر شبكات التواصل الاجتماعي، موظفاً (إذا) الفجائية واستعارة تصريحية.',
      points: 5
    },
    rubric: [
      { question: 'مفهوم التاريخ', answer: 'المفهوم الظاهري: سرد أخبار القرون الماضية. المفهوم الباطني: التحقيق والتعليل والبحث في أسباب الوقائع وقوانينها.', points: 3 },
      { question: 'خصائص النثر العلمي المتأدب', answer: 'الدقة والمصطلحات، الاستدلال المنطقي والحياد، الاستعانة بالسجع العفوي والمحسنات غير المتكلفة للبيان.', points: 3 },
      { question: 'النمط', answer: 'تفسيري؛ المؤشرات: أدوات التعليل (لذلك، فهو)، الجمل الاسمية الدالة على الثبوت، غياب العاطفة الشخصية.', points: 2 }
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
