/**
 * خدمة إدارة وتخزين الجدول الزمني الأسبوعي للأستاذ (WeeklyTimetableService)
 * تتيح للأستاذ ضبط وتخصيص حصصه الأسبوعية من الأحد إلى الخميس وفق نظام الدوام المعتمد
 * وتعتمد عليها خوارزمية التوليد الآلي الشامل للكراس اليومي الأسبوعي.
 */

export type WeekdayNameAr = 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';

export interface TimetableSlot {
  id: string;
  dayIdx: number;        // 0: الأحد, 1: الإثنين, 2: الثلاثاء, 3: الأربعاء, 4: الخميس
  dayNameAr: WeekdayNameAr;
  period: 'MORNING' | 'AFTERNOON';
  slotIndex: number;     // 1 to 4
  startTime: string;     // '08:00'
  endTime: string;       // '09:00'
  className: string;     // e.g. '3AS1', '3 ع ت 1'
  subject: string;       // e.g. 'اللغة العربية وآدابها'
  room?: string;         // e.g. 'قاعة 04'
}

export interface WeeklyScheduleConfig {
  shiftSystem: 'middle-secondary' | 'two-shifts' | 'one-shift';
  stage: 'PRIMARY' | 'MIDDLE' | 'SECONDARY';
  slots: TimetableSlot[];
  lastUpdated?: string;
}

export const WEEK_DAYS: { idx: number; nameAr: WeekdayNameAr }[] = [
  { idx: 0, nameAr: 'الأحد' },
  { idx: 1, nameAr: 'الإثنين' },
  { idx: 2, nameAr: 'الثلاثاء' },
  { idx: 3, nameAr: 'الأربعاء' },
  { idx: 4, nameAr: 'الخميس' },
];

export const PERIOD_HOURS_MAP = {
  'middle-secondary': {
    morning: [
      { slotIndex: 1, start: '08:00', end: '09:00', label: 'الحصة 1 (08:00 - 09:00)' },
      { slotIndex: 2, start: '09:00', end: '10:00', label: 'الحصة 2 (09:00 - 10:00)' },
      { slotIndex: 3, start: '10:10', end: '11:05', label: 'الحصة 3 (10:10 - 11:05)' },
      { slotIndex: 4, start: '11:05', end: '12:00', label: 'الحصة 4 (11:05 - 12:00)' },
    ],
    afternoon: [
      { slotIndex: 1, start: '13:00', end: '14:00', label: 'الحصة 5 (13:00 - 14:00)' },
      { slotIndex: 2, start: '14:00', end: '15:00', label: 'الحصة 6 (14:00 - 15:00)' },
      { slotIndex: 3, start: '15:00', end: '16:00', label: 'الحصة 7 (15:00 - 16:00)' },
      { slotIndex: 4, start: '16:00', end: '17:00', label: 'الحصة 8 (16:00 - 17:00)' },
    ]
  },
  'two-shifts': {
    morning: [
      { slotIndex: 1, start: '08:00', end: '08:45', label: 'الحصة 1 (08:00 - 08:45)' },
      { slotIndex: 2, start: '08:45', end: '09:30', label: 'الحصة 2 (08:45 - 09:30)' },
      { slotIndex: 3, start: '09:45', end: '10:30', label: 'الحصة 3 (09:45 - 10:30)' },
      { slotIndex: 4, start: '10:30', end: '11:15', label: 'الحصة 4 (10:30 - 11:15)' },
    ],
    afternoon: [
      { slotIndex: 1, start: '13:00', end: '14:00', label: 'الحصة 5 (13:00 - 14:00)' },
      { slotIndex: 2, start: '14:00', end: '15:00', label: 'الحصة 6 (14:00 - 15:00)' },
      { slotIndex: 3, start: '15:15', end: '16:15', label: 'الحصة 7 (15:15 - 16:15)' },
      { slotIndex: 4, start: '16:15', end: '17:15', label: 'الحصة 8 (16:15 - 17:15)' },
    ]
  },
  'one-shift': {
    morning: [
      { slotIndex: 1, start: '08:00', end: '08:45', label: 'الحصة 1 (08:00 - 08:45)' },
      { slotIndex: 2, start: '08:45', end: '09:30', label: 'الحصة 2 (08:45 - 09:30)' },
      { slotIndex: 3, start: '09:45', end: '10:30', label: 'الحصة 3 (09:45 - 10:30)' },
      { slotIndex: 4, start: '10:30', end: '11:15', label: 'الحصة 4 (10:30 - 11:15)' },
    ],
    afternoon: [
      { slotIndex: 1, start: '13:00', end: '13:30', label: 'الحصة 5 (13:00 - 13:30)' },
      { slotIndex: 2, start: '13:30', end: '14:00', label: 'الحصة 6 (13:30 - 14:00)' },
      { slotIndex: 3, start: '14:00', end: '14:30', label: 'الحصة 7 (14:00 - 14:30)' },
      { slotIndex: 4, start: '14:30', end: '15:00', label: 'الحصة 8 (14:30 - 15:00)' },
    ]
  }
};

const STORAGE_KEY = 'tamkeen_weekly_timetable_config';

class WeeklyTimetableService {
  /**
   * جلب الإعدادات والجدول الزمني المحفوظ للأستاذ
   */
  public getConfig(stage: 'PRIMARY' | 'MIDDLE' | 'SECONDARY' = 'SECONDARY'): WeeklyScheduleConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slots)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[WeeklyTimetableService] Failed to parse config, generating default:', e);
    }

    return this.generateDefaultConfig(stage);
  }

  /**
   * حفظ إعدادات الجدول الزمني
   */
  public saveConfig(config: WeeklyScheduleConfig): void {
    try {
      config.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('[WeeklyTimetableService] Save failed:', e);
    }
  }

  /**
   * توليد جدول زمني افتراضي متوازن للطور المحدد
   */
  public generateDefaultConfig(
    stage: 'PRIMARY' | 'MIDDLE' | 'SECONDARY' = 'SECONDARY',
    defaultClass: string = '3AS1',
    defaultSubject: string = 'اللغة العربية وآدابها'
  ): WeeklyScheduleConfig {
    const shiftSystem = stage === 'PRIMARY' ? 'one-shift' : 'middle-secondary';
    const hours = PERIOD_HOURS_MAP[shiftSystem];
    const slots: TimetableSlot[] = [];

    // توزيع حصص أسبوعية نموذجية متوازنة
    WEEK_DAYS.forEach((day) => {
      // الأحد: حصتان صباحاً وحصة مساءً
      if (day.idx === 0) {
        slots.push({
          id: `slot_${day.idx}_m1`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 1,
          startTime: hours.morning[0].start,
          endTime: hours.morning[0].end,
          className: defaultClass,
          subject: defaultSubject
        });
        slots.push({
          id: `slot_${day.idx}_m2`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 2,
          startTime: hours.morning[1].start,
          endTime: hours.morning[1].end,
          className: defaultClass,
          subject: defaultSubject
        });
        slots.push({
          id: `slot_${day.idx}_a1`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'AFTERNOON',
          slotIndex: 1,
          startTime: hours.afternoon[0].start,
          endTime: hours.afternoon[0].end,
          className: defaultClass,
          subject: defaultSubject
        });
      }
      // الإثنين: حصتان صباحاً
      else if (day.idx === 1) {
        slots.push({
          id: `slot_${day.idx}_m1`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 1,
          startTime: hours.morning[0].start,
          endTime: hours.morning[0].end,
          className: defaultClass,
          subject: defaultSubject
        });
        slots.push({
          id: `slot_${day.idx}_m3`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 3,
          startTime: hours.morning[2].start,
          endTime: hours.morning[2].end,
          className: defaultClass,
          subject: defaultSubject
        });
      }
      // الثلاثاء: حصتان صباحاً (مساء الثلاثاء فارغ عادة للأنشطة)
      else if (day.idx === 2) {
        slots.push({
          id: `slot_${day.idx}_m2`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 2,
          startTime: hours.morning[1].start,
          endTime: hours.morning[1].end,
          className: defaultClass,
          subject: defaultSubject
        });
        slots.push({
          id: `slot_${day.idx}_m3`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 3,
          startTime: hours.morning[2].start,
          endTime: hours.morning[2].end,
          className: defaultClass,
          subject: defaultSubject
        });
      }
      // الأربعاء: حصتان صباحاً وحصة مساءً
      else if (day.idx === 3) {
        slots.push({
          id: `slot_${day.idx}_m1`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 1,
          startTime: hours.morning[0].start,
          endTime: hours.morning[0].end,
          className: defaultClass,
          subject: defaultSubject
        });
        slots.push({
          id: `slot_${day.idx}_a2`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'AFTERNOON',
          slotIndex: 2,
          startTime: hours.afternoon[1].start,
          endTime: hours.afternoon[1].end,
          className: defaultClass,
          subject: defaultSubject
        });
      }
      // الخميس: حصتان صباحاً
      else if (day.idx === 4) {
        slots.push({
          id: `slot_${day.idx}_m2`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 2,
          startTime: hours.morning[1].start,
          endTime: hours.morning[1].end,
          className: defaultClass,
          subject: defaultSubject
        });
        slots.push({
          id: `slot_${day.idx}_m4`,
          dayIdx: day.idx,
          dayNameAr: day.nameAr,
          period: 'MORNING',
          slotIndex: 4,
          startTime: hours.morning[3].start,
          endTime: hours.morning[3].end,
          className: defaultClass,
          subject: defaultSubject
        });
      }
    });

    return {
      shiftSystem,
      stage,
      slots
    };
  }

  /**
   * حساب تواريخ أيام الأسبوع المدرسي الجزائري (من الأحد إلى الخميس) لتاريخ محدد
   */
  public getAlgerianSchoolWeekDates(baseDateStr?: string): {
    sunday: string;
    thursday: string;
    dates: { dateStr: string; dayIdx: number; dayNameAr: WeekdayNameAr; formatted: string }[];
  } {
    const base = baseDateStr ? new Date(baseDateStr) : new Date();
    const currentDay = base.getDay(); // 0 is Sunday, 1 is Monday... 5 is Friday, 6 is Saturday

    // العودة إلى الأحد السابق أو الحالي
    // إذا كان اليوم جمعة أو سبت، ننتقل للأحد القادم، وإلا نرجع لأحد هذا الأسبوع
    const sundayDate = new Date(base);
    let diffToSunday = currentDay;
    if (currentDay === 5) diffToSunday = -2; // Friday -> next Sunday
    if (currentDay === 6) diffToSunday = -1; // Saturday -> next Sunday
    sundayDate.setDate(base.getDate() - diffToSunday);

    const dates: { dateStr: string; dayIdx: number; dayNameAr: WeekdayNameAr; formatted: string }[] = [];

    WEEK_DAYS.forEach((wd, i) => {
      const d = new Date(sundayDate);
      d.setDate(sundayDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const formatted = d.toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' });
      dates.push({
        dateStr,
        dayIdx: wd.idx,
        dayNameAr: wd.nameAr,
        formatted
      });
    });

    return {
      sunday: dates[0].dateStr,
      thursday: dates[4].dateStr,
      dates
    };
  }
}

export const weeklyTimetableService = new WeeklyTimetableService();
