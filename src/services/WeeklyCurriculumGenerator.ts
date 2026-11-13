/**
 * خدمة التوليد الآلي الشامل للكراس اليومي الأسبوعي (WeeklyCurriculumGenerator)
 * تقوم بملء أسبوع كامل من الأحد إلى الخميس آلياً استناداً إلى جدول الأستاذ الزمني وتدرجات المنهاج الرسمي الجزائري.
 */

import { Session, TeacherProfile } from '../types';
import { TimetableSlot, WeekdayNameAr } from './WeeklyTimetableService';
import { 
  OFFICIAL_SYLLABUS_DISTRIBUTIONS, 
  SyllabusDistribution, 
  WeekDistributionItem 
} from '../data/secondaryCurriculumDistributions';
import { 
  SECONDARY_ARABIC_CURRICULUM 
} from '../lib/ai/secondaryArabicCurriculumData';
import { getAlgerianMonthFromDate } from './JournalCurriculumService';
import { v4 as uuidv4 } from 'uuid';

export interface GenerateWeekParams {
  weekDates: { dateStr: string; dayIdx: number; dayNameAr: WeekdayNameAr }[];
  slots: TimetableSlot[];
  profile: TeacherProfile;
  monthNameAr?: string;
  weekIndexInMonth?: number; // 1, 2, 3, or 4
}

export function generateFullWeekSessions(params: GenerateWeekParams): Session[] {
  const { weekDates, slots, profile, weekIndexInMonth = 2 } = params;
  const firstDate = weekDates[0]?.dateStr;
  const { monthNameAr } = getAlgerianMonthFromDate(firstDate);
  const targetMonth = params.monthNameAr || monthNameAr;

  const generatedSessions: Session[] = [];

  // تصنيف الحصص حسب كل فوج/قسم لترتيب تسلسل الدروس أسبوعياً
  const classSlotsMap: Record<string, TimetableSlot[]> = {};

  // ترتيب الحصص زمنياً: من الأحد إلى الخميس، ومن الصباح إلى المساء
  const sortedSlots = [...slots].sort((a, b) => {
    if (a.dayIdx !== b.dayIdx) return a.dayIdx - b.dayIdx;
    if (a.period !== b.period) return a.period === 'MORNING' ? -1 : 1;
    return a.startTime.localeCompare(b.startTime);
  });

  sortedSlots.forEach(slot => {
    const cls = slot.className || 'الفوج 1';
    if (!classSlotsMap[cls]) classSlotsMap[cls] = [];
    classSlotsMap[cls].push(slot);
  });

  // لكل قسم، نقوم بتوليد الحصص المتسلسلة (نص أدبي -> قواعد -> بلاغة/عروض -> مطالعة -> إدماج)
  Object.entries(classSlotsMap).forEach(([className, classSlots]) => {
    const curriculumData = resolveCurriculumForClass(className, profile, targetMonth, weekIndexInMonth);

    classSlots.forEach((slot, slotSeqIndex) => {
      // إيجاد تاريخ اليوم الموافق للحصة
      const dayDateObj = weekDates.find(d => d.dayIdx === slot.dayIdx);
      const sessionDate = dayDateObj ? dayDateObj.dateStr : firstDate;

      const session = buildSequencedSession({
        slot,
        sessionDate,
        sequenceIndex: slotSeqIndex,
        curriculumData,
        className,
        profile
      });

      generatedSessions.push(session);
    });
  });

  return generatedSessions;
}

/**
 * استخراج المحتوى الرسمي للقسم والشهر والأسبوع من التدرج المعتمد
 */
function resolveCurriculumForClass(
  className: string, 
  profile: TeacherProfile, 
  monthNameAr: string,
  weekIndex: number
): {
  unitNumber: number;
  unitTitle: string;
  theme: string;
  literaryText: string;
  grammar: string;
  rhetoricOrProsody: string;
  guidedReading: string;
  writingOrIntegration: string;
} {
  // تحديد المستوى من اسم القسم أو ملف الأستاذ
  const is3AS = className.includes('3') || className.includes('3AS') || profile.level === 'SECONDARY';
  const is2AS = className.includes('2') || className.includes('2AS');
  const is1AS = className.includes('1') || className.includes('1AS');
  const isLiterary = className.includes('أدب') || className.includes('فلسفة') || className.includes('لغات') || className.includes('آ ف');

  // جلب التوزيع المناسب
  let distribution: SyllabusDistribution | undefined;
  if (is1AS) {
    distribution = isLiterary 
      ? OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => d.id === '1as-literary-annual-2024')
      : OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => d.id === '1as-scientific-annual-2024');
  } else if (is2AS) {
    distribution = isLiterary
      ? OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => d.id === '2as-literary-annual-2024')
      : OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => d.id === '2as-scientific-annual-2024');
  } else {
    distribution = isLiterary
      ? OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => d.id === '3as-literary-annual-2024')
      : OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => d.id === '3as-scientific-annual-2024');
  }

  if (!distribution) {
    distribution = OFFICIAL_SYLLABUS_DISTRIBUTIONS[0];
  }

  // البحث عن أسبوع الشهر المطلوب
  let matchedWeek: WeekDistributionItem | undefined;
  for (const tri of distribution.trimesters) {
    for (const mon of tri.months) {
      if (mon.monthNameAr === monthNameAr || mon.weeks.some(w => w.monthNameAr === monthNameAr)) {
        const nonHolidayWeeks = mon.weeks.filter(w => !w.isExamPeriod && !w.isHoliday);
        const idx = Math.min(Math.max(weekIndex - 1, 0), nonHolidayWeeks.length - 1);
        matchedWeek = nonHolidayWeeks[idx] || nonHolidayWeeks[0];
        break;
      }
    }
    if (matchedWeek) break;
  }

  if (!matchedWeek) {
    matchedWeek = distribution.trimesters[0].months[1]?.weeks[0] || distribution.trimesters[0].months[0]?.weeks[0];
  }

  return {
    unitNumber: matchedWeek?.unitNumber || 1,
    unitTitle: matchedWeek?.unitTitle || 'الوحدة التعليمية',
    theme: matchedWeek?.theme || 'الأدب والفكر العربي',
    literaryText: matchedWeek?.literaryText || 'دراسة نص أدبي تحليلي',
    grammar: matchedWeek?.grammar || 'قواعد وبناء لغوي',
    rhetoricOrProsody: matchedWeek?.rhetoricOrProsody || 'بلاغة ونقد أدبي',
    guidedReading: matchedWeek?.guidedReadingOrCommunicative || 'مطالعة موجهة وسند تواصلي',
    writingOrIntegration: matchedWeek?.writingOrIntegration || 'وضعية إدماجية تقويمية',
  };
}

/**
 * بناء حصة بيداغوجية مكتملة وفق تسلسل الحصص الأسبوعي المعتمد في المناهج الجزائرية
 */
function buildSequencedSession(params: {
  slot: TimetableSlot;
  sessionDate: string;
  sequenceIndex: number;
  curriculumData: any;
  className: string;
  profile: TeacherProfile;
}): Session {
  const { slot, sessionDate, sequenceIndex, curriculumData, className, profile } = params;

  let activity = 'أدب ونصوص';
  let title = curriculumData.literaryText;
  let objective = `أن يحلل المتعلم نص "${title}" مستخلصاً الأفكار الأساسية، الحقل المعجمي لـ ${curriculumData.theme}، والخصائص البلاغية والنمط النصي.`;
  let tools = 'الكتاب المدرسي المقرر، السبورة، السند الأدبي الشعري/النثري، مسلاط رقمي';
  let content = `1. وضعيّة الانطلاق (10 د): التمهيد بمكتسبات قبلية دالة حول ${curriculumData.theme}.\n` +
                `2. وضعيّة بناء التعلّمات (35 د):\n` +
                `   - القراءة النموذجية والتلمذية المعبرة، استخراج الفكرة العامة والأفكار الأساسية.\n` +
                `   - اكتشاف معطيات النص وتحليل الحقل الدلالي والصور البيانية ومؤشرات النمط.\n` +
                `   - مناقشة الأبعاد الفنية والقيم التربوية والوطنية.\n` +
                `3. وضعيّة الاستثمار والتقييم (15 د): صياغة خلاصة تركيبية تؤكد مدى تحقق الكفاءة الختامية.`;
  let notes = `حصة 1 للأسبوع لفوج ${className} - تفاعل إيجابي ومشاركة فعالة في اكتشاف معطيات النص.`;

  // الحصة الثانية في الأسبوع: قواعد اللغة
  if (sequenceIndex === 1) {
    activity = 'قواعد اللغة';
    title = curriculumData.grammar;
    objective = `أن يتعرف المتعلم على أحكام ومحددات "${title}"، ويستنتج القاعدة النحوية ويوظفها بدقة في سياقات إعرابية وتواصلية.`;
    tools = 'الكتاب المدرسي، السبورة، بطاقات الشواهد النحوية، كراس الأنشطة';
    content = `1. وضعيّة الانطلاق (05 د): استدعاء شواهد لغوية مستمدة من نص القراءة.\n` +
              `2. وضعيّة بناء التعلّمات (35 د):\n` +
              `   - استقراء وملاحظة الشواهد، تفكيك الظاهرة النحوية وتحليل عناصرها التركيبية.\n` +
              `   - صياغة واستخلاص أحكام قاعدة "${title}" وتدوينها مرحلياً على السبورة.\n` +
              `3. وضعيّة الاستثمار والتقييم (20 د): إنجاز تطبيقات إعرابية فورية ونماذج إعراب نموذجية.`;
    notes = `حصة 2 للأسبوع لفوج ${className} - استيعاب طيب للقاعدة وتطبيق سليم على الألواح والكراريس.`;
  }
  // الحصة الثالثة في الأسبوع: بلاغة أو عروض
  else if (sequenceIndex === 2) {
    const isProsody = curriculumData.rhetoricOrProsody.includes('بحر') || curriculumData.rhetoricOrProsody.includes('تفعيلة');
    activity = isProsody ? 'عروض وموسيقى الشعر' : 'بلاغة ونقد أدبي';
    title = curriculumData.rhetoricOrProsody;
    objective = isProsody
      ? `أن يكتشف المتعلم التقطيع العروضي لـ "${title}" ويميز تفعيلاته ووزنه وقافيته.`
      : `أن يتذوق المتعلم جماليات وأبعاد "${title}" ويدرك أثرها البلاغي في إيضاح المعنى وتأكيده.`;
    tools = 'الكتاب المدرسي، السبورة، أبيات وشواهد بلاغية مختارة';
    content = `1. وضعيّة الانطلاق (05 د): التمهيد بشواهد بلاغية تمثيلية لإثارة الملاحظة الجمالية.\n` +
              `2. وضعيّة بناء التعلّمات (35 د): تحليل الصورة البلاغية / التقطيع العروضي واستنباط سر البلاغة.\n` +
              `3. وضعيّة الاستثمار (20 د): تدريبات استخراجية على شواهد ونصوص إضافية.`;
    notes = `حصة 3 للأسبوع لفوج ${className} - تحقق مؤشر التذوق الأدبي والقدرة على استخراج الظاهرة.`;
  }
  // الحصة الرابعة: مطالعة موجهة أو نص تواصلي
  else if (sequenceIndex === 3) {
    activity = 'مطالعة موجهة / نص تواصلي';
    title = curriculumData.guidedReading;
    objective = `أن يكتشف المتعلم البعد التواصلي والفكري لـ "${title}" ويناقش القضايا النقدية والاجتماعية الواردة فيه.`;
    tools = 'الكتاب المدرسي، السند التواصلي، المراجع والمصادر الإثرائية';
    content = `1. وضعيّة الانطلاق (05 د): إثارة إشكالية فكرية ذات صلة بالسياق الأدبي للوحدة.\n` +
              `2. وضعيّة بناء التعلّمات (35 د): قراءة ومناقشة أطروحة الكاتب، تحليل الحجج والأدلة النقدية.\n` +
              `3. وضعيّة الاستثمار (20 د): إبداء الرأي النقدي وصياغة ملخص للأفكار المحورية.`;
    notes = `حصة 4 للأسبوع لفوج ${className} - مناقشة ثرية وحوار هادف حول إشكالية النص.`;
  }
  // الحصة الخامسة فما فوق: وضعية إدماجية / تعبير كتابي / معالجة
  else if (sequenceIndex >= 4) {
    activity = 'وضعية إدماجية تقويمية';
    title = curriculumData.writingOrIntegration;
    objective = `أن ينتج المتعلم نصاً متناسقاً يوظف فيه الموارد اللغوية والبلاغية المكتسبة في سياق "${title}".`;
    tools = 'سند الوضعية المشكلة، شبكة التقويم الذاتي والتبادلي، السبورة';
    content = `1. تقديم الوضعية المشكلة وتحليل تعليمتها ومعايير الإنجاز (10 د).\n` +
              `2. التحرير الفردي على المسودات مع المرافقة والتوجيه البيداغوجي (35 د).\n` +
              `3. العرض والتقويم التبادلي والتصويب وفق شبكة المؤشرات (15 د).`;
    notes = `حصة 5 للأسبوع لفوج ${className} - إنتاج نصوص تراعي النمط وتوظف الموارد المكتسبة بإتقان.`;
  }

  return {
    id: uuidv4(),
    subject: slot.subject || profile.teachingSubject || 'اللغة العربية وآدابها',
    activity: activity,
    title: title,
    sectionNumber: curriculumData.unitNumber || 1,
    sectionName: curriculumData.unitTitle || 'الوحدة التعليمية',
    unityNumber: curriculumData.unitNumber || 1,
    objective: objective,
    tools: tools,
    content: content,
    notes: notes,
    timing: {
      date: sessionDate,
      category: 'LESSON',
      period: slot.period,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }
  };
}
