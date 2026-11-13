/**
 * رزنامة الاختبارات الفصلية والعطل المدرسية للسنة الدراسية 2026-2027
 * الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية
 * تنفيذاً لأحكام القرار رقم 41 المؤرخ في 28 سبتمبر 2026 / بلاغ 05 أكتوبر 2026
 */

export interface SchoolHoliday {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  resumeDate: string;// YYYY-MM-DD (تاريخ استئناف الدراسة صباحاً)
  description: string;
  color: string;
  category: 'AUTUMN' | 'WINTER' | 'SPRING' | 'SUMMER';
}

export interface ExamPeriod {
  id: string;
  stage: 'PRIMARY' | 'MIDDLE' | 'SECONDARY';
  gradesDescription: string;
  trimester: 1 | 2 | 3;
  startDate: string;
  endDate: string;
  exactDays?: string[]; // أيام محددة كأيام 2، 3، 4، 7، 8 مارس
  title: string;
  notes?: string;
  isOfficialCertificate?: boolean; // شهادة التعليم المتوسط أو البكالوريا
}

export interface StaffHoliday {
  id: string;
  role: 'TEACHERS' | 'ADMIN_ZONE_1_2' | 'ADMIN_ZONE_3';
  title: string;
  startDate: string;
  region: string;
  notes: string;
}

export const OFFICIAL_MINISTERIAL_METADATA = {
  country: 'الجمهورية الجزائرية الديمقراطية الشعبية',
  ministry: 'وزارة التربية الوطنية',
  decisionNumber: 'القرار رقم 41 المؤرخ في 28 سبتمبر 2026',
  announcementDate: '05 أكتوبر 2026',
  academicYear: '2026-2027',
  title: 'رزنامة الاختبارات الفصلية والعطل المدرسية للسنة الدراسية 2026-2027'
};

/**
 * ثانياً: رزنامة العطل المدرسية الرسمية 2026-2027
 */
export const OFFICIAL_SCHOOL_HOLIDAYS_2026_2027: SchoolHoliday[] = [
  {
    id: 'holiday_autumn_2026',
    title: 'عطلة الخريف',
    startDate: '2026-10-27', // مساء الثلاثاء 27 أكتوبر 2026
    endDate: '2026-11-01',
    resumeDate: '2026-11-02', // صباح الإثنين 02 نوفمبر 2026
    description: 'من مساء الثلاثاء 27 أكتوبر 2026 إلى صباح الإثنين 02 نوفمبر 2026',
    color: 'amber',
    category: 'AUTUMN'
  },
  {
    id: 'holiday_winter_2026_2027',
    title: 'عطلة الشتاء',
    startDate: '2026-12-17', // مساء الخميس 17 ديسمبر 2026
    endDate: '2027-01-02',
    resumeDate: '2027-01-03', // صباح الأحد 03 جانفي 2027
    description: 'من مساء الخميس 17 ديسمبر 2026 إلى صباح الأحد 03 جانفي 2027',
    color: 'blue',
    category: 'WINTER'
  },
  {
    id: 'holiday_spring_2027',
    title: 'عطلة الربيع',
    startDate: '2027-03-18', // مساء الخميس 18 مارس 2027
    endDate: '2027-04-03',
    resumeDate: '2027-04-04', // صباح الأحد 04 أفريل 2027
    description: 'من مساء الخميس 18 مارس 2027 إلى صباح الأحد 04 أفريل 2027',
    color: 'emerald',
    category: 'SPRING'
  },
  {
    id: 'holiday_summer_2027',
    title: 'عطلة الصيف',
    startDate: '2027-07-08',
    endDate: '2027-09-01',
    resumeDate: '2027-09-05',
    description: 'بعد الانتهاء من إجراء اختبارات الفصل الثالث والامتحانات الاستدراكية وتصحيحها جماعياً ومجالس الأقسام',
    color: 'rose',
    category: 'SUMMER'
  }
];

/**
 * أولاً: رزنامة الاختبارات الفصلية الرسمية 2026-2027
 */
export const OFFICIAL_EXAM_CALENDAR_2026_2027: ExamPeriod[] = [
  // --- مرحلة التعليم الابتدائي ---
  {
    id: 'primary_t1_2026',
    stage: 'PRIMARY',
    gradesDescription: 'كافة سنوات مرحلة التعليم الابتدائي (1AP - 5AP)',
    trimester: 1,
    startDate: '2026-12-06',
    endDate: '2026-12-10',
    title: 'اختبارات الفصل الأول — التعليم الابتدائي',
    notes: 'من 06 إلى 10 ديسمبر 2026'
  },
  {
    id: 'primary_t2_2027',
    stage: 'PRIMARY',
    gradesDescription: 'كافة سنوات مرحلة التعليم الابتدائي (1AP - 5AP)',
    trimester: 2,
    startDate: '2027-03-02',
    endDate: '2027-03-08',
    exactDays: ['2027-03-02', '2027-03-03', '2027-03-04', '2027-03-07', '2027-03-08'],
    title: 'اختبارات الفصل الثاني — التعليم الابتدائي',
    notes: 'أيام: 2، 3، 4، 7، 8 مارس 2027'
  },
  {
    id: 'primary_t3_2027',
    stage: 'PRIMARY',
    gradesDescription: 'كافة سنوات مرحلة التعليم الابتدائي (1AP - 5AP)',
    trimester: 3,
    startDate: '2027-05-23',
    endDate: '2027-05-27',
    title: 'اختبارات الفصل الثالث — التعليم الابتدائي',
    notes: 'من 23 إلى 27 ماي 2027'
  },

  // --- مرحلة التعليم المتوسط ---
  {
    id: 'middle_t1_2026',
    stage: 'MIDDLE',
    gradesDescription: 'السنوات الأولى والثانية والثالثة (1AM، 2AM، 3AM)',
    trimester: 1,
    startDate: '2026-12-06',
    endDate: '2026-12-10',
    title: 'اختبارات الفصل الأول — التعليم المتوسط (1م، 2م، 3م)',
    notes: 'من 06 إلى 10 ديسمبر 2026'
  },
  {
    id: 'middle_t2_2027',
    stage: 'MIDDLE',
    gradesDescription: 'السنوات الأولى والثانية والثالثة (1AM، 2AM، 3AM)',
    trimester: 2,
    startDate: '2027-03-02',
    endDate: '2027-03-08',
    exactDays: ['2027-03-02', '2027-03-03', '2027-03-04', '2027-03-07', '2027-03-08'],
    title: 'اختبارات الفصل الثاني — التعليم المتوسط (1م، 2م، 3م)',
    notes: 'أيام: 2، 3، 4، 7، 8 مارس 2027'
  },
  {
    id: 'middle_t3_2027',
    stage: 'MIDDLE',
    gradesDescription: 'السنوات الأولى والثانية والثالثة (1AM، 2AM، 3AM)',
    trimester: 3,
    startDate: '2027-05-23',
    endDate: '2027-05-27',
    title: 'اختبارات الفصل الثالث — التعليم المتوسط (1م، 2م، 3م)',
    notes: 'من 23 إلى 27 ماي 2027'
  },
  {
    id: 'middle_4am_t3_2027',
    stage: 'MIDDLE',
    gradesDescription: 'السنة الرابعة متوسط (4AM — شهادة التعليم المتوسط BEM)',
    trimester: 3,
    startDate: '2027-05-09',
    endDate: '2027-05-11',
    title: 'اختبارات الفصل الثالث — السنة الرابعة متوسط (BEM)',
    notes: 'من 09 إلى 11 ماي 2027',
    isOfficialCertificate: true
  },

  // --- مرحلة التعليم الثانوي ---
  {
    id: 'secondary_t1_2026',
    stage: 'SECONDARY',
    gradesDescription: 'السنتان الأولى والثانية ثانوي (1AS، 2AS)',
    trimester: 1,
    startDate: '2026-12-06',
    endDate: '2026-12-10',
    title: 'اختبارات الفصل الأول — التعليم الثانوي (1ث، 2ث)',
    notes: 'من 06 إلى 10 ديسمبر 2026'
  },
  {
    id: 'secondary_t2_2027',
    stage: 'SECONDARY',
    gradesDescription: 'السنتان الأولى والثانية ثانوي (1AS، 2AS)',
    trimester: 2,
    startDate: '2027-03-02',
    endDate: '2027-03-08',
    exactDays: ['2027-03-02', '2027-03-03', '2027-03-04', '2027-03-07', '2027-03-08'],
    title: 'اختبارات الفصل الثاني — التعليم الثانوي (1ث، 2ث)',
    notes: 'أيام: 2، 3، 4، 7، 8 مارس 2027'
  },
  {
    id: 'secondary_t3_2027',
    stage: 'SECONDARY',
    gradesDescription: 'السنتان الأولى والثانية ثانوي (1AS، 2AS)',
    trimester: 3,
    startDate: '2027-05-23',
    endDate: '2027-05-27',
    title: 'اختبارات الفصل الثالث — التعليم الثانوي (1ث، 2ث)',
    notes: 'من 23 إلى 27 ماي 2027'
  },
  {
    id: 'secondary_3as_t3_2027',
    stage: 'SECONDARY',
    gradesDescription: 'السنة الثالثة ثانوي (3AS — امتحان البكالوريا التجريبية)',
    trimester: 3,
    startDate: '2027-05-09',
    endDate: '2027-05-13',
    title: 'اختبارات الفصل الثالث — السنة الثالثة ثانوي (البكالوريا التجريبية)',
    notes: 'من 09 إلى 13 ماي 2027',
    isOfficialCertificate: true
  }
];

/**
 * ثالثاً: العطلة السنوية للموظفين 2026-2027
 */
export const OFFICIAL_STAFF_LEAVE_2026_2027: StaffHoliday[] = [
  {
    id: 'teachers_annual_leave',
    role: 'TEACHERS',
    title: 'العطلة السنوية للأساتذة',
    startDate: '2027-07-08', // مساء الخميس 08 جويلية 2027
    region: 'كافة ولايات الوطن (جميع المناطق)',
    notes: 'ابتداءً من مساء الخميس 08 جويلية 2027، بجميع المناطق'
  },
  {
    id: 'admin_leave_zone_1_2',
    role: 'ADMIN_ZONE_1_2',
    title: 'العطلة السنوية للإداريين (المنطقتان الأولى والثانية)',
    startDate: '2027-07-22', // مساء الخميس 22 جويلية 2027
    region: 'المنطقة الأولى والثانية (الشمال والهضاب العليا)',
    notes: 'ابتداءً من مساء الخميس 22 جويلية 2027'
  },
  {
    id: 'admin_leave_zone_3',
    role: 'ADMIN_ZONE_3',
    title: 'العطلة السنوية للإداريين (المنطقة الثالثة)',
    startDate: '2027-07-15', // مساء الخميس 15 جويلية 2027
    region: 'المنطقة الثالثة (ولايات الجنوب)',
    notes: 'ابتداءً من مساء الخميس 15 جويلية 2027'
  }
];

/**
 * التحقق مما إذا كان تاريخ معين يقع ضمن عطلة مدرسية رسمية
 */
export function checkSchoolHoliday(dateStr: string): { isHoliday: boolean; holiday?: SchoolHoliday } {
  const target = new Date(dateStr).getTime();
  for (const h of OFFICIAL_SCHOOL_HOLIDAYS_2026_2027) {
    const start = new Date(h.startDate).getTime();
    const end = new Date(h.endDate).getTime();
    if (target >= start && target <= end) {
      return { isHoliday: true, holiday: h };
    }
  }
  return { isHoliday: false };
}

/**
 * التحقق مما إذا كان تاريخ معين يقع ضمن فترة اختبارات فصلية
 */
export function checkExamPeriod(
  dateStr: string,
  stage: 'PRIMARY' | 'MIDDLE' | 'SECONDARY' = 'SECONDARY',
  isCandidateClass: boolean = false
): { isExam: boolean; exam?: ExamPeriod } {
  const target = new Date(dateStr).getTime();

  for (const exam of OFFICIAL_EXAM_CALENDAR_2026_2027) {
    if (exam.stage !== stage) continue;

    // فحص إذا كانت السنة شهادة (4AM أو 3AS)
    if (exam.isOfficialCertificate && !isCandidateClass) continue;
    if (!exam.isOfficialCertificate && isCandidateClass && exam.trimester === 3) continue;

    // فحص إذا كانت هناك أيام دقيقة محددة
    if (exam.exactDays && exam.exactDays.length > 0) {
      if (exam.exactDays.includes(dateStr)) {
        return { isExam: true, exam };
      }
    } else {
      const start = new Date(exam.startDate).getTime();
      const end = new Date(exam.endDate).getTime();
      if (target >= start && target <= end) {
        return { isExam: true, exam };
      }
    }
  }

  return { isExam: false };
}
