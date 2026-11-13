/**
 * خدمة التوليد والاقتراح البيداغوجي الذاتي للكراس اليومي (JournalCurriculumService)
 * تستخلص الدروس والأنشطة من التدرجات السنوية الرسمية لوزارة التربية الوطنية (الجيل الثاني)
 * وتتيح للأستاذ توليد بيانات الحصة بضغطة زر واحدة دون الحاجة للكتابة المتكررة.
 */

import { 
  OFFICIAL_SYLLABUS_DISTRIBUTIONS, 
  SyllabusDistribution, 
  WeekDistributionItem 
} from '../data/secondaryCurriculumDistributions';
import { 
  SECONDARY_ARABIC_CURRICULUM, 
  CurriculumLessonItem 
} from '../lib/ai/secondaryArabicCurriculumData';

export interface CurriculumSuggestionItem {
  id: string;
  source: 'secondary_distribution' | 'detailed_curriculum' | 'middle_template' | 'primary_template';
  subject: string;
  activity: string;
  title: string;
  sectionNumber: number;
  sectionName: string;
  unityNumber: number;
  objective: string;
  tools: string;
  content: string;
  notes: string;
  levelBadge: string;
  monthNameAr?: string;
  theme?: string;
}

const MONTH_NAMES_AR = [
  'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان'
];

/**
 * معرفة اسم الشهر الجزائري من تاريخ الحصة (YYYY-MM-DD)
 */
export function getAlgerianMonthFromDate(dateStr?: string): { monthIndex: number; monthNameAr: string } {
  if (!dateStr) {
    const now = new Date();
    const m = now.getMonth() + 1;
    return mapCalendarMonthToAlgerian(m);
  }
  const parts = dateStr.split('-');
  const m = parseInt(parts[1] || '1', 10);
  return mapCalendarMonthToAlgerian(m);
}

function mapCalendarMonthToAlgerian(calendarMonth: number): { monthIndex: number; monthNameAr: string } {
  switch (calendarMonth) {
    case 9: return { monthIndex: 1, monthNameAr: 'سبتمبر' };
    case 10: return { monthIndex: 2, monthNameAr: 'أكتوبر' };
    case 11: return { monthIndex: 3, monthNameAr: 'نوفمبر' };
    case 12: return { monthIndex: 4, monthNameAr: 'ديسمبر' };
    case 1: return { monthIndex: 5, monthNameAr: 'جانفي' };
    case 2: return { monthIndex: 6, monthNameAr: 'فيفري' };
    case 3: return { monthIndex: 7, monthNameAr: 'مارس' };
    case 4: return { monthIndex: 8, monthNameAr: 'أفريل' };
    case 5: return { monthIndex: 9, monthNameAr: 'ماي' };
    case 6: return { monthIndex: 10, monthNameAr: 'جوان' };
    default: return { monthIndex: 2, monthNameAr: 'أكتوبر' }; // الافتراضي
  }
}

/**
 * توليد اقتراحات الحصص للشهر الحالي وفق المستوى والسنة المختارة
 */
export function getSmartCurriculumSuggestions(params: {
  level?: string | null;
  grade?: string | null;
  dateStr?: string;
  subject?: string;
}): CurriculumSuggestionItem[] {
  const { level, grade, dateStr, subject = 'اللغة العربية' } = params;
  const { monthNameAr } = getAlgerianMonthFromDate(dateStr);
  const results: CurriculumSuggestionItem[] = [];

  const isSecondary = level === 'SECONDARY' || (grade && (grade.includes('AS') || grade.includes('ثانوي')));
  const isMiddle = level === 'MIDDLE' || (grade && (grade.includes('AM') || grade.includes('متوسط')));
  const isPrimary = level === 'PRIMARY' || (grade && (grade.includes('AP') || grade.includes('ابتدائي')));

  // 1. الطور الثانوي: جلب من OFFICIAL_SYLLABUS_DISTRIBUTIONS
  if (isSecondary || (!isMiddle && !isPrimary)) {
    // تحديد الشعبة/السنة المناسبة
    let targetDistributions = OFFICIAL_SYLLABUS_DISTRIBUTIONS;
    if (grade) {
      const isLiterary = grade.includes('أدب') || grade.includes('ادب') || grade.includes('فلسفة') || grade.includes('لغات') || grade.includes('آ ف') || grade.includes('ل أ');
      const isScientific = grade.includes('علوم') || grade.includes('علمي') || grade.includes('ع ت') || grade.includes('ت ر') || grade.includes('ر') || grade.includes('رياضيات') || grade.includes('تقني') || grade.includes('تسيير') || grade.includes('ج م ع ت');

      let filteredByGrade = OFFICIAL_SYLLABUS_DISTRIBUTIONS;
      if (grade.includes('3AS') || grade.includes('3') || grade.includes('ثالثة')) {
        filteredByGrade = OFFICIAL_SYLLABUS_DISTRIBUTIONS.filter(d => d.grade.includes('الثالثة'));
      } else if (grade.includes('2AS') || grade.includes('2') || grade.includes('ثانية')) {
        filteredByGrade = OFFICIAL_SYLLABUS_DISTRIBUTIONS.filter(d => d.grade.includes('الثانية'));
      } else if (grade.includes('1AS') || grade.includes('1') || grade.includes('أولى') || grade.includes('جذع مشترك')) {
        filteredByGrade = OFFICIAL_SYLLABUS_DISTRIBUTIONS.filter(d => d.grade.includes('الأولى'));
      }

      if (isScientific) {
        const sci = filteredByGrade.filter(d => d.stream.includes('علمي') || d.stream.includes('علوم'));
        targetDistributions = sci.length > 0 ? sci : filteredByGrade;
      } else if (isLiterary) {
        const lit = filteredByGrade.filter(d => d.stream.includes('آداب') || d.stream.includes('لغات') || d.stream.includes('أدبي'));
        targetDistributions = lit.length > 0 ? lit : filteredByGrade;
      } else {
        targetDistributions = filteredByGrade;
      }
    }

    if (targetDistributions.length === 0) {
      targetDistributions = OFFICIAL_SYLLABUS_DISTRIBUTIONS;
    }

    // استخراج أسابيع الشهر الحالي
    for (const dist of targetDistributions) {
      for (const tri of dist.trimesters) {
        for (const mon of tri.months) {
          if (mon.monthNameAr === monthNameAr || mon.weeks.some(w => w.monthNameAr === monthNameAr)) {
            for (const week of mon.weeks) {
              if (week.isExamPeriod || week.isHoliday) continue;
              extractWeekLessons(week, dist, results);
            }
          }
        }
      }
    }

    // إذا لم نجد في الشهر الحالي (مثل عطلة الصيف)، نجلب من أول شهر متاح
    if (results.length === 0 && targetDistributions.length > 0) {
      const firstDist = targetDistributions[0];
      const firstMonth = firstDist.trimesters[0]?.months[1] || firstDist.trimesters[0]?.months[0];
      if (firstMonth) {
        for (const week of firstMonth.weeks) {
          if (!week.isExamPeriod && !week.isHoliday) {
            extractWeekLessons(week, firstDist, results);
          }
        }
      }
    }
  }

  // 2. دمج عناصر من SECONDARY_ARABIC_CURRICULUM المفصلة
  if (isSecondary || (!isMiddle && !isPrimary)) {
    for (const detailed of SECONDARY_ARABIC_CURRICULUM) {
      results.push(formatDetailedItemToSuggestion(detailed));
    }
  }

  // 3. الطور المتوسط: بنك مقاطع المنهاج
  if (isMiddle) {
    const middleSuggestions = getMiddleSchoolSuggestions(grade, monthNameAr);
    results.push(...middleSuggestions);
  }

  // 4. الطور الابتدائي: بنك مقاطع المنهاج
  if (isPrimary) {
    const primarySuggestions = getPrimarySchoolSuggestions(grade, monthNameAr);
    results.push(...primarySuggestions);
  }

  // إزالة التكرارات حسب العنوان والنشاط
  const seen = new Set<string>();
  return results.filter(item => {
    const key = `${item.activity}_${item.title}`.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * تحويل أسبوع من التدرج السنوي إلى حصص مفصلة جاهزة للتعبئة
 */
function extractWeekLessons(
  week: WeekDistributionItem, 
  dist: SyllabusDistribution, 
  results: CurriculumSuggestionItem[]
) {
  const badge = `${dist.grade} - ${dist.stream.slice(0, 15)}...`;

  // 1. نص أدبي
  if (week.literaryText && week.literaryText.trim() !== '') {
    results.push({
      id: `lit_${week.weekNumber}_${week.unitNumber}_${dist.id}`,
      source: 'secondary_distribution',
      subject: 'اللغة العربية وآدابها',
      activity: 'أدب ونصوص',
      title: week.literaryText,
      sectionNumber: week.unitNumber || 1,
      sectionName: week.unitTitle || week.theme || 'الوحدة التعليمية',
      unityNumber: week.unitNumber || 1,
      objective: `أن يحلل المتعلم نص "${week.literaryText}" مستخلصاً الأفكار الأساسية، معجم ${week.theme}، والخصائص البلاغية ونمط النص.`,
      tools: 'الكتاب المدرسي المقرر، السبورة، السند الشعري/النثري، مسلاط رقمي',
      content: `1. وضعيّة الانطلاق (10 د): التذكير بالسياق التاريخي والأدبي لـ "${week.theme}" ورصد مكتسبات المتعلمين.\n` +
               `2. وضعيّة بناء التعلّمات (35 د):\n` +
               `   - القراءة النموذجية والتلمذية الواعية، وتحديد الفكرة العامة والأفكار الجزئية.\n` +
               `   - اكتشاف معطيات النص: الدلالات، الصور البيانية، الروابط المنطقية ومؤشرات النمط.\n` +
               `   - مناقشة وتحليل أبعاد النص الإنسانية والفنية.\n` +
               `3. وضعيّة الاستثمار والتقييم (15 د): صياغة خلاصة تركيبية وتقويم مدى تحقق الكفاءة المستهدفة.`,
      notes: 'تفاعل ممتاز ومشاركة فعالة في اكتشاف معطيات النص وتحديد نمطه.',
      levelBadge: badge,
      monthNameAr: week.monthNameAr,
      theme: week.theme
    });
  }

  // 2. قواعد اللغة
  if (week.grammar && week.grammar.trim() !== '') {
    results.push({
      id: `gra_${week.weekNumber}_${week.unitNumber}_${dist.id}`,
      source: 'secondary_distribution',
      subject: 'اللغة العربية وآدابها',
      activity: 'قواعد اللغة',
      title: week.grammar,
      sectionNumber: week.unitNumber || 1,
      sectionName: week.unitTitle || week.theme || 'الوحدة التعليمية',
      unityNumber: week.unitNumber || 1,
      objective: `أن يكتشف المتعلم أحكام ومحددات "${week.grammar}"، ويستنتج القاعدة ويطبقها بإتقان في وضعيات تواصلية.`,
      tools: 'الكتاب المدرسي، السبورة، بطاقات الشواهد النحوية، تمارين تطبيقية',
      content: `1. وضعيّة الانطلاق (05 د): استدعاء شواهد وأمثلة نحوية مقتبسة من نص القراءة.\n` +
               `2. وضعيّة بناء التعلّمات (35 د):\n` +
               `   - قراءة الشواهد وتفكيك عناصرها النحوية بالمقارنة والتحليل الاستقرائي.\n` +
               `   - استخلاص وضبط أحكام قاعدة "${week.grammar}" وتدوينها مرحلياً على السبورة.\n` +
               `3. وضعيّة الاستثمار والتقييم (20 د): إنجاز أنشطة تدريبية فورية ونماذج إعرابية لترسيخ التعلم.`,
      notes: 'استيعاب طيب للقاعدة النحوية والقدرة على توظيفها وإعراب نماذجها.',
      levelBadge: badge,
      monthNameAr: week.monthNameAr,
      theme: week.theme
    });
  }

  // 3. بلاغة أو عروض
  if (week.rhetoricOrProsody && week.rhetoricOrProsody.trim() !== '') {
    const isProsody = week.rhetoricOrProsody.includes('بحر') || week.rhetoricOrProsody.includes('تفعيلة') || week.rhetoricOrProsody.includes('عروض');
    results.push({
      id: `rhe_${week.weekNumber}_${week.unitNumber}_${dist.id}`,
      source: 'secondary_distribution',
      subject: 'اللغة العربية وآدابها',
      activity: isProsody ? 'عروض وموسيقى الشعر' : 'بلاغة ونقد',
      title: week.rhetoricOrProsody,
      sectionNumber: week.unitNumber || 1,
      sectionName: week.unitTitle || week.theme || 'الوحدة التعليمية',
      unityNumber: week.unitNumber || 1,
      objective: isProsody 
        ? `أن يتعرف المتعلم على التقطيع العروضي لـ "${week.rhetoricOrProsody}" ويميز وزنه وتفعيلاته وقافيته.`
        : `أن يدرك المتعلم بلاغة "${week.rhetoricOrProsody}" وأسرارها الجمالية في إبراز المعنى والتأثير.`,
      tools: 'الكتاب المدرسي، السبورة، نماذج تطبيقية وأبيات شعرية مختارة',
      content: `1. وضعيّة الانطلاق (05 د): التمهيد بشاهد بلاغي / بيتين شعريين لإثارة الملاحظة الجمالية.\n` +
               `2. وضعيّة بناء التعلّمات (35 د): تحليل الصورة والموسيقى وتحديد سر الجمال والأثر المعنوي.\n` +
               `3. وضعيّة الاستثمار (20 د): تدريبات استخراجية وتقويم تشكيلي على شواهد جديدة.`,
      notes: 'تحقق مؤشر التذوق الجمالي وتمييز خصائص الظاهرة البلاغية.',
      levelBadge: badge,
      monthNameAr: week.monthNameAr,
      theme: week.theme
    });
  }

  // 4. مطالعة موجهة أو نص تواصلي
  if (week.guidedReadingOrCommunicative && week.guidedReadingOrCommunicative.trim() !== '') {
    const isCommunicative = week.guidedReadingOrCommunicative.includes('تواصلي');
    results.push({
      id: `comm_${week.weekNumber}_${week.unitNumber}_${dist.id}`,
      source: 'secondary_distribution',
      subject: 'اللغة العربية وآدابها',
      activity: isCommunicative ? 'نص تواصلي' : 'مطالعة موجهة',
      title: week.guidedReadingOrCommunicative,
      sectionNumber: week.unitNumber || 1,
      sectionName: week.unitTitle || week.theme || 'الوحدة التعليمية',
      unityNumber: week.unitNumber || 1,
      objective: `أن يكتشف المتعلم معطيات النص الفكرية لـ "${week.guidedReadingOrCommunicative}" ويناقش القضايا النقدية والاجتماعية الواردة فيه.`,
      tools: 'الكتاب المدرسي، السند التواصلي، المراجع والوثائق الخارجية',
      content: `1. وضعيّة الانطلاق (05 د): إثارة إشكالية فكرية ذات صلة بمحور ${week.theme}.\n` +
               `2. وضعيّة بناء التعلّمات (35 د): قراءة ومناقشة أطروحة الكاتب، تحليل الحجج والأدلة، واستخلاص البعد التواصلي.\n` +
               `3. وضعيّة الاستثمار (20 د): إبداء الرأي النقدي وتلخيص الأفكار الجوهرية.`,
      notes: 'مناقشة ثرية وتفاعل بناء في نقد الأفكار وصياغة الحجج.',
      levelBadge: badge,
      monthNameAr: week.monthNameAr,
      theme: week.theme
    });
  }

  // 5. تعبير كتابي / وضعية إدماجية
  if (week.writingOrIntegration && week.writingOrIntegration.trim() !== '') {
    results.push({
      id: `wri_${week.weekNumber}_${week.unitNumber}_${dist.id}`,
      source: 'secondary_distribution',
      subject: 'اللغة العربية وآدابها',
      activity: 'وضعية إدماجية / تعبير كتابي',
      title: week.writingOrIntegration,
      sectionNumber: week.unitNumber || 1,
      sectionName: week.unitTitle || week.theme || 'الوحدة التعليمية',
      unityNumber: week.unitNumber || 1,
      objective: `أن ينتج المتعلم فقرة منسجمة توظف الموارد اللغوية والبلاغية المكتسبة في سياق "${week.writingOrIntegration}".`,
      tools: 'سند الوضعية المشكلة، شبكة التقويم الذاتي، السبورة، كراس المحاولات',
      content: `1. تقديم الوضعية المشكلة وتحليل تعليمتها ومؤشرات النجاح (10 د).\n` +
               `2. مرحلة الإنتاج الفردي والتحرير بمسودات المتعلمين مع المرافقة والتوجيه (35 د).\n` +
               `3. العرض والتقويم التبادلي بالاستناد إلى شبكة المعايير والمؤشرات (15 د).`,
      notes: 'إنتاج نصوص متناسقة تحترم نمط الكتابة وتوظف الموارد المدروسة بدقة.',
      levelBadge: badge,
      monthNameAr: week.monthNameAr,
      theme: week.theme
    });
  }
}

/**
 * تحويل عنصر مفصل من SECONDARY_ARABIC_CURRICULUM إلى اقتراح
 */
function formatDetailedItemToSuggestion(item: CurriculumLessonItem): CurriculumSuggestionItem {
  let content = '';
  if (item.structuredSteps && item.structuredSteps.length > 0) {
    content = item.structuredSteps.map(s => 
      `• ${s.stage} (${s.indicatorsAndTiming}):\n` +
      `  - المعلم: ${s.teacherActivity.slice(0, 140)}...\n` +
      `  - المتعلم: ${s.studentActivity.slice(0, 140)}...`
    ).join('\n\n');
  } else {
    content = `1. وضعيّة الانطلاق: ${item.problemSituation.slice(0, 160)}\n` +
              `2. بناء التعلمات: ${item.teacherActivity.slice(0, 200)}\n` +
              `3. التقويم والاستثمار: ${item.evaluationFinal.slice(0, 160)}`;
  }

  const objective = item.objectivesList && item.objectivesList.length > 0
    ? item.objectivesList[0]
    : item.competencyFinal;

  return {
    id: item.id,
    source: 'detailed_curriculum',
    subject: 'اللغة العربية وآدابها',
    activity: item.activity,
    title: item.topic,
    sectionNumber: item.unitNumber || 1,
    sectionName: item.unitTitle,
    unityNumber: item.unitNumber || 1,
    objective: objective,
    tools: item.tools,
    content: content,
    notes: `مذكرة مستخلصة من المنهاج الرسمي والتفتيشي (المؤسسة: ${item.institution || 'وزارة التربية الوطنية'}).`,
    levelBadge: `${item.grade} - ${item.stream}`,
    theme: item.theme
  };
}

/**
 * مقترحات الطور المتوسط (التعليم المتوسط الجزائري)
 */
function getMiddleSchoolSuggestions(grade?: string | null, monthNameAr?: string): CurriculumSuggestionItem[] {
  const gName = grade || '4AM';
  const label = grade ? `السنة ${grade.replace('AM', '')} متوسط` : 'التعليم المتوسط';

  const modules = [
    { num: 1, name: 'الحياة العائلية', text: 'قلب الأم لأحمد شوقي', grammar: 'الفعل الماضي وبناؤه', exp: 'إنتاج نص سردي عن تضامن الأسرة' },
    { num: 2, name: 'الإعلام والمجتمع', text: 'سحر الشاشة والصورة', grammar: 'الفعل المضارع وإعرابه', exp: 'كتابة مقال تفسيري عن دور مواقع التواصل' },
    { num: 3, name: 'التضامن الإنساني', text: 'ملحمة التكافل الاجتماعي', grammar: 'المبتدأ والخبر وأنواعهما', exp: 'تحرير رسالة تضامن مع ضحايا الكوارث' },
    { num: 4, name: 'الأخلاق والمجتمع', text: 'قيمة الوفاء والصدق', grammar: 'النعت الحقيقي والنعت السببي', exp: 'إنتاج خطبة توجيهية عن مكارم الأخلاق' },
    { num: 5, name: 'العلم والاكتشافات', text: 'غزو الفضاء والذكاء الاصطناعي', grammar: 'الحال وأنواعه ومطابقته', exp: 'كتابة تقرير علمي حول ثورة التكنولوجيا' },
    { num: 6, name: 'الأعياد والمناسبات', text: 'فرحة العيد وثورة نوفمبر', grammar: 'المفعول المطلق والمفعول لأجله', exp: 'وصف أجواء الاحتفال بذكرى وطنية' },
    { num: 7, name: 'الطبيعة والبيئة', text: 'جمال الريف ومخاطر التصحر', grammar: 'التمييز بين الملفوظ والملحوظ', exp: 'تحرير نص حجاجي لحماية البيئة والشجرة' },
    { num: 8, name: 'الصحة والرياضة', text: 'العقل السليم في الجسم السليم', grammar: 'البدل وأنواعه وإعرابه', exp: 'صياغة مطوية إرشادية حول التغذية السليمة' },
  ];

  const items: CurriculumSuggestionItem[] = [];

  modules.forEach(m => {
    // نص قراءة
    items.push({
      id: `mid_text_${m.num}_${gName}`,
      source: 'middle_template',
      subject: 'اللغة العربية',
      activity: 'فهم المنطوق وإنتاجه / قراءة ودراسة نص',
      title: m.text,
      sectionNumber: m.num,
      sectionName: `المقطع ${m.num}: ${m.name}`,
      unityNumber: m.num,
      objective: `أن يفهم المتعلم النص المنطوق/المقروء "${m.text}" ويحدد نمطه النصي ويستخرج قيمه الإنسانية.`,
      tools: 'الكتاب المدرسي، السبورة، مسجل صوتي، دليل الأستاذ',
      content: `1. وضعية الانطلاق (10 د): التمهيد بمناقشة حول ${m.name}.\n` +
               `2. بناء التعلمات (35 د): القراءة الصامتة والمجهرية، استخراج الفكرة العامة والأفكار الأساسية، واكتشاف الرصيد اللغوي ومؤشرات النمط.\n` +
               `3. الاستثمار والتقويم (15 د): إعادة إنتاج المعنى واستخلاص العبرة وتثبيت القيم الأخلاقية والوطنية.`,
      notes: 'تفاعل ممتاز وقدرة طيبة على التعبير الشفوي واستخلاص القيم.',
      levelBadge: label,
      monthNameAr,
      theme: m.name
    });

    // ظاهرة لغوية (قواعد)
    items.push({
      id: `mid_gram_${m.num}_${gName}`,
      source: 'middle_template',
      subject: 'اللغة العربية',
      activity: 'الظاهرة اللغوية (قواعد)',
      title: m.grammar,
      sectionNumber: m.num,
      sectionName: `المقطع ${m.num}: ${m.name}`,
      unityNumber: m.num,
      objective: `أن يتعرف المتعلم على "${m.grammar}" ويميز شروط إعرابه ويوظفه في سياقات لغوية سليمة.`,
      tools: 'الكتاب المدرسي، السبورة، كراس الأنشطة، بطاقات الشواهد',
      content: `1. وضعية الانطلاق (05 د): استحضار شواهد من نص القراءة.\n` +
               `2. بناء التعلمات (35 د): قراءة الشواهد، استقراء القاعدة، استنتاج علامات الإعراب وتدوين الخلاصة.\n` +
               `3. الاستثمار (20 د): إنجاز تطبيقات كراس الأنشطة وتصحيحها فردياً وجماعياً.`,
      notes: 'استيعاب لقاعدة الدرس وإتقان نماذج الإعراب التطبيقي.',
      levelBadge: label,
      monthNameAr,
      theme: m.name
    });

    // تعبير كتابي
    items.push({
      id: `mid_exp_${m.num}_${gName}`,
      source: 'middle_template',
      subject: 'اللغة العربية',
      activity: 'إنتاج المكتوب (تعبير كتابي)',
      title: m.exp,
      sectionNumber: m.num,
      sectionName: `المقطع ${m.num}: ${m.name}`,
      unityNumber: m.num,
      objective: `أن يتدرب المتعلم على كتابة نصوص وفق معايير النمط المطلوب موظفاً موارد المقطع.`,
      tools: 'السند والتعليمة، شبكة التقويم، كراس التعبير',
      content: `1. تحليل التعليمة وتحديد عناصر الإنتاج المطلوب (10 د).\n` +
               `2. مرحلة الإنجاز والكتابة الفردية للمسودات (35 د).\n` +
               `3. تقييم الأعمال والتصويب وفق شبكة المؤشرات (15 د).`,
      notes: 'إنتاج نصوص منسجمة باحترام علامات الوقف وقواعد الإملاء.',
      levelBadge: label,
      monthNameAr,
      theme: m.name
    });
  });

  return items;
}

/**
 * مقترحات الطور الابتدائي (التعليم الابتدائي الجزائري)
 */
function getPrimarySchoolSuggestions(grade?: string | null, monthNameAr?: string): CurriculumSuggestionItem[] {
  const gName = grade || '5AP';
  const label = grade ? `السنة ${grade.replace('AP', '')} ابتدائي` : 'التعليم الابتدائي';

  const modules = [
    { num: 1, name: 'القيم الإنسانية', text: 'رفاق المدرسة', grammar: 'أنواع الكلمة (اسم، فعل، حرف)', tool: 'الألواح، دفتر الأنشطة' },
    { num: 2, name: 'الحياة الاجتماعية', text: 'في المعرض والمدينة', grammar: 'الفعل الماضي وعلامات بنائه', tool: 'صور ملونة، الكتاب المدرسي' },
    { num: 3, name: 'الهوية الوطنية', text: 'أرض الأجداد وثورة التحرير', grammar: 'المبتدأ والخبر', tool: 'العلم الوطني، خريطة الجزائر' },
    { num: 4, name: 'التنمية والبيئة', text: 'حملة التشجير ونظافة الحي', grammar: 'الفاعل والمفعول به', tool: 'مشاهد مصورة، دفتر الأنشطة' },
    { num: 5, name: 'الصحة والرياضة', text: 'أهمية الغذاء الصحي والرياضة', grammar: 'الصفة والموصوف', tool: 'هرم الغذاء، صور رياضية' },
    { num: 6, name: 'عالم العلوم والابتكار', text: 'الحاسوب والإنترنت في حياتنا', grammar: 'حروف العطف واستعمالاتها', tool: 'جهاز كمبيوتر، أشكال ملونة' },
    { num: 7, name: 'الاكتشاف والفنون', text: 'زيارة إلى المتحف الوطني', grammar: 'الاسم المجرور وحروف الجر', tool: 'تحف ومجسمات، صور معالم' },
    { num: 8, name: 'الأسفار والرحلات', text: 'رحلة إلى صحراء طاسيلي', grammar: 'المفعول المطلق', tool: 'ألبوم صور الصحراء، الخريطة' },
  ];

  const items: CurriculumSuggestionItem[] = [];

  modules.forEach(m => {
    // قراءة وتعبير
    items.push({
      id: `pri_read_${m.num}_${gName}`,
      source: 'primary_template',
      subject: 'لغة عربية',
      activity: 'قراءة وفهم نص',
      title: m.text,
      sectionNumber: m.num,
      sectionName: `المقطع ${m.num}: ${m.name}`,
      unityNumber: m.num,
      objective: `أن يقرأ التلميذ النص قراءة معبرة ويفهم معانيه ويجيب عن الأسئلة بدقة.`,
      tools: m.tool,
      content: `1. الانطلاق: تهيئة المتعلمين بطرح أسئلة حول ${m.name}.\n` +
               `2. بناء التعلمات: قراءة المعلم النموذجية ثم قراءات فردية للمتعلمين، شرح المفردات الصعبة، وتحديد الأفكار.\n` +
               `3. الاستثمار: توظيف المفردات في جمل مفيدة وحل أسئلة كراس النشاطات.`,
      notes: 'تحسن في النطق السليم واحترام علامات الوقف.',
      levelBadge: label,
      monthNameAr,
      theme: m.name
    });

    // تراكيب نحوية
    items.push({
      id: `pri_gram_${m.num}_${gName}`,
      source: 'primary_template',
      subject: 'لغة عربية',
      activity: 'تراكيب نحوية',
      title: m.grammar,
      sectionNumber: m.num,
      sectionName: `المقطع ${m.num}: ${m.name}`,
      unityNumber: m.num,
      objective: `أن يتعرف التلميذ على ${m.grammar} ويميزه ويوظفه في جمل بسيطة صحيحة.`,
      tools: 'الألواح، السبورة، دفتر الأنشطة ص 12',
      content: `1. الانطلاق: استخراج جملة الشاهد من نص القراءة.\n` +
               `2. بناء التعلمات: عزل الظاهرة وملاحظتها، استنتاج القاعدة بمشاركة التلاميذ، كتابة القاعدة على الكراس.\n` +
               `3. الاستثمار: إنجاز تمرين "أثبت تعلماتي" على الألواح وتطبيقات دفتر الأنشطة.`,
      notes: 'استيعاب جيد للقاعدة وتطبيق سليم على الألواح.',
      levelBadge: label,
      monthNameAr,
      theme: m.name
    });
  });

  return items;
}

/**
 * البحث المباشر السريع في بنك دروس المنهاج الجزائري الكامل
 */
export function searchCurriculumLessons(query: string, level?: string | null, grade?: string | null): CurriculumSuggestionItem[] {
  const q = query.trim().toLowerCase();
  // جمع جميع المقترحات المتاحة
  const allSecondary = getSmartCurriculumSuggestions({ level: 'SECONDARY', grade: grade || '3AS' });
  const allMiddle = getMiddleSchoolSuggestions(grade);
  const allPrimary = getPrimarySchoolSuggestions(grade);

  const combined = [...allSecondary, ...allMiddle, ...allPrimary];

  if (!q) {
    return combined.slice(0, 30);
  }

  return combined.filter(item => 
    item.title.toLowerCase().includes(q) ||
    item.activity.toLowerCase().includes(q) ||
    item.sectionName.toLowerCase().includes(q) ||
    item.objective.toLowerCase().includes(q) ||
    (item.theme && item.theme.toLowerCase().includes(q))
  ).slice(0, 40);
}
