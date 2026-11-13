import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Sparkles, Check, Compass, CalendarDays, BookOpen,
  AlertTriangle, Clock, Layers, ArrowLeft, Loader2, CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import { useTheme, themeStyles } from '../../../utils/theme';
import { TeacherProfile } from '../../../types';
import {
  ALGERIAN_SCHOOL_MONTHS,
  AvailableWeekOption,
  getAvailableWeeksForMonth
} from '../../../services/WeeklyCurriculumGenerator';

export type PacingStatus = 'ON_SCHEDULE' | 'BEHIND_SCHEDULE' | 'AHEAD_OF_SCHEDULE';

interface WeeklyCurriculumPacingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  initialMonthNameAr: string;
  weekRangeText: string;
  onConfirmGenerate: (params: { monthNameAr: string; weekIndexInMonth: number; selectedWeekData?: AvailableWeekOption }) => Promise<void>;
  isLoading?: boolean;
}

export const WeeklyCurriculumPacingModal: React.FC<WeeklyCurriculumPacingModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialMonthNameAr,
  weekRangeText,
  onConfirmGenerate,
  isLoading = false
}) => {
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  // 1. Pacing Status State (أين أنت من البرنامج)
  const [pacingStatus, setPacingStatus] = useState<PacingStatus>('ON_SCHEDULE');

  // 2. Selected Month State (الشهر البيداغوجي)
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonthNameAr || 'نوفمبر');

  // 3. Selected Week in Month (1, 2, 3, 4)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(1);

  // Sync initial month
  useEffect(() => {
    if (initialMonthNameAr) {
      setSelectedMonth(initialMonthNameAr);
    }
  }, [initialMonthNameAr, isOpen]);

  // Load available weeks from database for the selected month
  const availableWeeks: AvailableWeekOption[] = useMemo(() => {
    return getAvailableWeeksForMonth(selectedMonth, profile);
  }, [selectedMonth, profile]);

  // Ensure selectedWeekIndex is valid when availableWeeks change
  useEffect(() => {
    if (availableWeeks.length > 0) {
      const exists = availableWeeks.some(w => w.weekIndexInMonth === selectedWeekIndex);
      if (!exists) {
        setSelectedWeekIndex(availableWeeks[0].weekIndexInMonth);
      }
    }
  }, [availableWeeks, selectedWeekIndex]);

  if (!isOpen) return null;

  const currentSelectedWeekData = availableWeeks.find(w => w.weekIndexInMonth === selectedWeekIndex) || availableWeeks[0];

  const handleConfirm = async () => {
    await onConfirmGenerate({
      monthNameAr: selectedMonth,
      weekIndexInMonth: selectedWeekIndex,
      selectedWeekData: currentSelectedWeekData
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className={cn(
        "w-full max-w-4xl rounded-[2.5rem] shadow-2xl max-h-[94vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800",
        theme === 'v3' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      )}>
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-50/80 via-emerald-50/50 to-teal-50/70 dark:from-indigo-950/40 dark:via-emerald-950/30 dark:to-teal-950/40">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-600/30">
              <Compass size={26} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl md:text-2xl font-black">ضبط وتيرة المنهاج وتوليد الأسبوع</h3>
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-3 py-1 rounded-full font-black">
                  مخصص حسب وتيرتك ⚡
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                حدد الشهر والأسبوع الدراسيين بدقة وفق وتيرة تقدمك الفعلي في البرنامج السنوي
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6">

          {/* Question 1: Pacing Status */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 dark:text-slate-300 flex items-center gap-2">
              <Clock size={15} className="text-indigo-600" />
              <span>1. ما هي وتيرة إنجازك للبرنامج السنوي حالياً؟</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPacingStatus('ON_SCHEDULE')}
                className={cn(
                  "p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-2 group",
                  pacingStatus === 'ON_SCHEDULE'
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 shadow-md scale-[1.02]"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs">
                    🟢
                  </span>
                  {pacingStatus === 'ON_SCHEDULE' && <Check size={16} className="text-emerald-600" />}
                </div>
                <div>
                  <h5 className="font-black text-xs text-slate-900 dark:text-white">على موعد البرنامج تماماً</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">مطابق للرزنامة الوزارية والشهر الفعلي</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPacingStatus('BEHIND_SCHEDULE')}
                className={cn(
                  "p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-2 group",
                  pacingStatus === 'BEHIND_SCHEDULE'
                    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-600 shadow-md scale-[1.02]"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-xs">
                    🟡
                  </span>
                  {pacingStatus === 'BEHIND_SCHEDULE' && <Check size={16} className="text-amber-600" />}
                </div>
                <div>
                  <h5 className="font-black text-xs text-slate-900 dark:text-white">متأخر عن التدرج (استدراك)</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">أريد استدراك دروس أو أسابيع سابقة</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPacingStatus('AHEAD_OF_SCHEDULE')}
                className={cn(
                  "p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-2 group",
                  pacingStatus === 'AHEAD_OF_SCHEDULE'
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 shadow-md scale-[1.02]"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs">
                    🔵
                  </span>
                  {pacingStatus === 'AHEAD_OF_SCHEDULE' && <Check size={16} className="text-blue-600" />}
                </div>
                <div>
                  <h5 className="font-black text-xs text-slate-900 dark:text-white">متقدم في إنجاز البرنامج</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">أريد تقديم أسابيع أو وحدات لاحقة</p>
                </div>
              </button>
            </div>
          </div>

          {/* Question 2: Select Month (Dropdown / Pills) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-500 dark:text-slate-300 flex items-center gap-2">
                <CalendarDays size={15} className="text-indigo-600" />
                <span>2. اختر الشهر البيداغوجي الذي تدرّسه الآن (منسدل من قاعدة البيانات):</span>
              </label>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                الشهر المحدد: <strong className="font-black text-emerald-600 dark:text-emerald-400">{selectedMonth}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ALGERIAN_SCHOOL_MONTHS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMonth(m.nameAr)}
                  className={cn(
                    "p-3 rounded-xl border text-right transition-all flex flex-col justify-between",
                    selectedMonth === m.nameAr
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm font-black"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                  )}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                    <span>ث {m.trimester}</span>
                    {selectedMonth === m.nameAr && <Check size={12} />}
                  </div>
                  <span className="text-xs font-black truncate">{m.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Select Week in Month (Visual Database Content Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-500 dark:text-slate-300 flex items-center gap-2">
                <BookOpen size={15} className="text-indigo-600" />
                <span>3. اختر الأسبوع والمقطع الدراسي المراد بناؤه وتعبئته في الكراس:</span>
              </label>
              <span className="text-[11px] text-slate-400 font-bold">
                ({availableWeeks.length} أسابيع مبرمجة في شهر {selectedMonth})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {availableWeeks.map((week) => {
                const isSelected = selectedWeekIndex === week.weekIndexInMonth;

                return (
                  <button
                    key={`w_${week.weekIndexInMonth}`}
                    type="button"
                    onClick={() => setSelectedWeekIndex(week.weekIndexInMonth)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-right transition-all space-y-2.5 relative group overflow-hidden",
                      isSelected
                        ? "bg-gradient-to-br from-indigo-50/90 to-emerald-50/70 dark:from-indigo-950/50 dark:to-emerald-950/40 border-indigo-600 dark:border-indigo-500 shadow-md scale-[1.01]"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                    )}
                  >
                    {/* Top Row: Week Number & Unit Title */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center",
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        )}>
                          {week.weekIndexInMonth}
                        </span>
                        <div>
                          <span className="text-xs font-black text-slate-900 dark:text-white block">
                            الأسبوع {week.weekIndexInMonth} من شهر {selectedMonth}
                          </span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold truncate block">
                            {week.unitTitle || `المقطع ${week.unitNumber}`}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="bg-emerald-600 text-white p-1 rounded-full shadow-sm">
                          <Check size={13} />
                        </span>
                      )}
                    </div>

                    {/* Content Preview Pills */}
                    <div className="space-y-1.5 text-xs">
                      {week.literaryText && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-black text-[9px] whitespace-nowrap">
                            نص أدبي
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {week.literaryText}
                          </span>
                        </div>
                      )}

                      {week.grammar && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-black text-[9px] whitespace-nowrap">
                            قواعد
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                            {week.grammar}
                          </span>
                        </div>
                      )}

                      {week.rhetoricOrProsody && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 font-black text-[9px] whitespace-nowrap">
                            بلاغة/عروض
                          </span>
                          <span className="font-bold text-slate-600 dark:text-slate-300 truncate">
                            {week.rhetoricOrProsody}
                          </span>
                        </div>
                      )}

                      {week.writingOrIntegration && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-black text-[9px] whitespace-nowrap">
                            إدماج
                          </span>
                          <span className="font-bold text-slate-600 dark:text-slate-300 truncate">
                            {week.writingOrIntegration}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Generation Summary Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs leading-relaxed">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <span className="font-black text-slate-800 dark:text-white block">
                ملخص التوليد للأسبوع ({weekRangeText}):
              </span>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                سيتم توزيع حصص <strong>شهر {selectedMonth}</strong> — <strong>الأسبوع {selectedWeekIndex}</strong> ({currentSelectedWeekData?.unitTitle || 'الوحدة التعليمية'}) على كافة أيام التدريس من <strong>الأحد إلى الخميس</strong> وفق جدولك الزمني المعتمد، مع صياغة الأهداف والوسائل ومراحل الدرس تلقائياً، مع بقاء إمكانية تعديل أي حصة لاحقاً.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex justify-between items-center">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="rounded-xl px-5">
            إلغاء
          </Button>

          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 font-black shadow-lg shadow-emerald-600/20 text-sm"
            leftIcon={<Sparkles size={18} className="text-amber-300 animate-pulse" />}
          >
            تأكيد التوليد وملء الأسبوع كاملاً ⚡
          </Button>
        </div>
      </div>
    </div>
  );
};
