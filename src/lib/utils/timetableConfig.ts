export interface TimetableTimingConfig {
  stageTitle: string;
  systemTitle: string;
  morningRecessTime: string; // e.g. '09:30 - 09:45' or '10:00 - 10:10'
  morningRecessDuration: string; // '15 د' or '10 د'
  morningHours: string[];    // 4 periods
  morningDurations: string[];// 4 durations
  middayTime: string;        // '11:15 - 13:00' or '12:00 - 13:00'
  afternoonHours: string[];  // 4 periods
  afternoonDurations: string[];
  afternoonRecessTime: string | null; // '15:00 - 15:15' or null
  afternoonRecessDuration: string | null; // '15 د' or '10 د' or null
  endTime: string;           // '15:00' | '17:15' | '17:00'
  afternoonTitle: string;
  isPrimary: boolean;
  isOneShift: boolean;
}

export const getTimetableTimingConfig = (stage?: string, system?: string): TimetableTimingConfig => {
  const isPrimary = stage === 'primary' || !stage;
  const isSecondary = stage === 'secondary';
  const isOneShift = system === 'one-shift' || system === 'one-shift-amazigh';

  if (isPrimary) {
    if (isOneShift) {
      // 1️⃣ الطور الابتدائي - نظام الدوام الواحد: ينتهي في 15:00
      return {
        stageTitle: 'التعليم الابتدائي',
        systemTitle: 'نظام الدوام الواحد',
        morningRecessTime: '09:30 - 09:45',
        morningRecessDuration: '15 د',
        morningHours: ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15'],
        morningDurations: ['45 د', '45 د', '45 د', '45 د'],
        middayTime: '11:15 - 13:00',
        afternoonHours: ['13:00 - 13:30', '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00'],
        afternoonDurations: ['30 د', '30 د', '30 د', '30 د'],
        afternoonRecessTime: null,
        afternoonRecessDuration: null,
        endTime: '15:00',
        afternoonTitle: 'الفترة المسائية (تنتهي 15:00)',
        isPrimary: true,
        isOneShift: true,
      };
    } else {
      // 2️⃣ الطور الابتدائي - نظام الدوامين: ينتهي في 17:15
      return {
        stageTitle: 'التعليم الابتدائي',
        systemTitle: 'نظام الدوامين',
        morningRecessTime: '09:30 - 09:45',
        morningRecessDuration: '15 د',
        morningHours: ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15'],
        morningDurations: ['45 د', '45 د', '45 د', '45 د'],
        middayTime: '11:15 - 13:00',
        afternoonHours: ['13:00 - 14:00', '14:00 - 15:00', '15:15 - 16:15', '16:15 - 17:15'],
        afternoonDurations: ['60 د', '60 د', '60 د', '60 د'],
        afternoonRecessTime: '15:00 - 15:15',
        afternoonRecessDuration: '15 د',
        endTime: '17:15',
        afternoonTitle: 'الفترة المسائية (تنتهي 17:15)',
        isPrimary: true,
        isOneShift: false,
      };
    }
  } else {
    // 3️⃣ الطور المتوسط والثانوي: ينتهي في 17:00
    return {
      stageTitle: isSecondary ? 'التعليم الثانوي' : 'التعليم المتوسط',
      systemTitle: system === 'partial-shift' ? 'الدوام الجزئي' : 'الدوام الكامل',
      morningRecessTime: '10:00 - 10:10',
      morningRecessDuration: '10 د',
      morningHours: ['08:00 - 09:00', '09:00 - 10:00', '10:10 - 11:05', '11:05 - 12:00'],
      morningDurations: ['1 سا', '1 سا', '55 د', '55 د'],
      middayTime: '12:00 - 13:00',
      afternoonHours: ['13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'],
      afternoonDurations: ['1 سا', '1 سا', '1 سا', '1 سا'],
      afternoonRecessTime: null,
      afternoonRecessDuration: null,
      endTime: '17:00',
      afternoonTitle: 'الفترة المسائية (تنتهي 17:00)',
      isPrimary: false,
      isOneShift: false,
    };
  }
};
