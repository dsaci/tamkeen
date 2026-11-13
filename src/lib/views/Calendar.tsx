import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight,
  Bell, FileDown, ShieldCheck, CheckCircle2, GraduationCap, Building2,
  CalendarDays, Sparkles, BookOpen, UserCheck, AlertTriangle, Printer
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../utils';
import {
  OFFICIAL_MINISTERIAL_METADATA,
  OFFICIAL_SCHOOL_HOLIDAYS_2026_2027,
  OFFICIAL_EXAM_CALENDAR_2026_2027,
  OFFICIAL_STAFF_LEAVE_2026_2027,
  checkSchoolHoliday,
  checkExamPeriod,
  SchoolHoliday,
  ExamPeriod
} from '../../data/officialSchoolCalendar2026_2027';
import { TeacherProfile } from '../../types';

interface CalendarViewProps {
  profile?: TeacherProfile;
}

const MONTHS_AR = [
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
  'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const CalendarView: React.FC<CalendarViewProps> = ({ profile }) => {
  // Current viewed month and year (Default to active school year: 2026 / 2027)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 10, 1)); // November 2026
  const [selectedStage, setSelectedStage] = useState<'ALL' | 'PRIMARY' | 'MIDDLE' | 'SECONDARY'>('ALL');
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'holidays' | 'staff'>('overview');

  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth(); // 0-11
  const currentMonthName = MONTHS_AR[currentMonthIdx];

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayMonth = () => {
    setCurrentDate(new Date(2026, 10, 1));
  };

  // Filter exams by stage
  const filteredExams = useMemo(() => {
    if (selectedStage === 'ALL') return OFFICIAL_EXAM_CALENDAR_2026_2027;
    return OFFICIAL_EXAM_CALENDAR_2026_2027.filter(e => e.stage === selectedStage);
  }, [selectedStage]);

  // Days in current month
  const daysInMonth = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
    const firstDayWeekday = new Date(currentYear, currentMonthIdx, 1).getDay(); // 0 is Sunday in JS

    const days: {
      dayNumber: number;
      dateStr: string;
      isHoliday: boolean;
      holiday?: SchoolHoliday;
      isExam: boolean;
      exam?: ExamPeriod;
    }[] = [];

    for (let i = 1; i <= totalDays; i++) {
      const mStr = String(currentMonthIdx + 1).padStart(2, '0');
      const dStr = String(i).padStart(2, '0');
      const dateStr = `${currentYear}-${mStr}-${dStr}`;

      const hol = checkSchoolHoliday(dateStr);
      const ex = checkExamPeriod(dateStr, selectedStage === 'ALL' ? 'SECONDARY' : selectedStage, true);

      days.push({
        dayNumber: i,
        dateStr,
        isHoliday: hol.isHoliday,
        holiday: hol.holiday,
        isExam: ex.isExam,
        exam: ex.exam
      });
    }

    return { totalDays, firstDayWeekday, days };
  }, [currentYear, currentMonthIdx, selectedStage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-['Cairo']" dir="rtl">
      {/* Official Ministry Banner */}
      <div className="p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black shadow-sm">
                🇩🇿 {OFFICIAL_MINISTERIAL_METADATA.country}
              </span>
              <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold">
                {OFFICIAL_MINISTERIAL_METADATA.ministry}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">
              {OFFICIAL_MINISTERIAL_METADATA.title}
            </h2>

            <p className="text-xs md:text-sm text-emerald-100/90 font-bold max-w-2xl leading-relaxed">
              تنفيذاً لأحكام <strong>{OFFICIAL_MINISTERIAL_METADATA.decisionNumber}</strong> (بلاغ {OFFICIAL_MINISTERIAL_METADATA.announcementDate}) المحدد لرزنامة الاختبارات الفصلية والعطل المدرسية للسنة الدراسية {OFFICIAL_MINISTERIAL_METADATA.academicYear}.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Printer size={16} />
              <span>طباعة الرزنامة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-500 px-2">الطور الدراسي:</span>
          {(['ALL', 'SECONDARY', 'MIDDLE', 'PRIMARY'] as const).map(stage => {
            const label = stage === 'ALL'
              ? 'كافة الأطوار (شامل)'
              : stage === 'SECONDARY'
                ? 'التعليم الثانوي'
                : stage === 'MIDDLE'
                  ? 'التعليم المتوسط'
                  : 'التعليم الابتدائي';

            const isSelected = selectedStage === stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedStage(stage)}
                className={cn(
                  "px-4 py-2 rounded-2xl text-xs font-black transition-all border",
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeTab === 'overview' ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200" : "text-slate-500"
            )}
          >
            التقويم التفاعلي
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeTab === 'exams' ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200" : "text-slate-500"
            )}
          >
            جدول الاختبارات
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeTab === 'holidays' ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200" : "text-slate-500"
            )}
          >
            العطل الرسمية
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeTab === 'staff' ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200" : "text-slate-500"
            )}
          >
            عطلة الموظفين
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Calendar & Ministerial Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar Month Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          {/* Calendar Header with Stepper */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-sm">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {currentMonthName} {currentYear}
                </h3>
                <span className="text-xs text-slate-400 font-bold">
                  السنة الدراسية 2026-2027
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                title="الشهر السابق"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={handleTodayMonth}
                className="px-3 py-1.5 bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all"
              >
                الدخول المدرسي
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                title="الشهر القادم"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Weekdays Names (Sunday to Saturday) */}
            <div className="grid grid-cols-7 gap-2 text-center mb-3">
              {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day, idx) => (
                <div
                  key={day}
                  className={cn(
                    "text-xs font-black py-2 rounded-xl",
                    idx === 5 || idx === 6
                      ? "text-rose-600 bg-rose-50/60 dark:bg-rose-950/20"
                      : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Cells */}
            <div className="grid grid-cols-7 gap-2 flex-1">
              {/* Empty leading padding slots */}
              {Array.from({ length: daysInMonth.firstDayWeekday }).map((_, i) => (
                <div key={`empty_${i}`} className="min-h-[75px] bg-slate-50/30 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-100 dark:border-slate-800"></div>
              ))}

              {/* Month Days */}
              {daysInMonth.days.map(d => {
                const isHoliday = d.isHoliday;
                const isExam = d.isExam;

                return (
                  <div
                    key={d.dateStr}
                    className={cn(
                      "min-h-[85px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between relative group",
                      isHoliday
                        ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 shadow-sm"
                        : isExam
                          ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-sm"
                          : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-xs font-black",
                        isHoliday
                          ? "text-amber-800 dark:text-amber-300"
                          : isExam
                            ? "text-emerald-800 dark:text-emerald-300"
                            : "text-slate-700 dark:text-slate-300"
                      )}>
                        {d.dayNumber}
                      </span>

                      {isHoliday && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      )}
                      {isExam && !isHoliday && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>

                    {/* Badge text */}
                    {isHoliday && d.holiday && (
                      <span className="text-[9px] font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded-md truncate">
                        {d.holiday.title}
                      </span>
                    )}

                    {isExam && d.exam && !isHoliday && (
                      <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded-md truncate">
                        {d.exam.isOfficialCertificate ? 'امتحان شهادة' : 'اختبارات'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel: Official Bulletin Breakdown */}
        <div className="space-y-6">

          {/* Section 1: Official Holidays */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h4 className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <CalendarIcon size={18} className="text-amber-600" />
                <span>العطل المدرسية الرسمية 2026-2027</span>
              </h4>
              <span className="text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                القرار 41
              </span>
            </div>

            <div className="space-y-3">
              {OFFICIAL_SCHOOL_HOLIDAYS_2026_2027.map(h => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white">
                      {h.title}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      استئناف: {h.resumeDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Official Exams Calendar */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h4 className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <GraduationCap size={18} className="text-emerald-600" />
                <span>رزنامة الاختبارات الرسمية</span>
              </h4>
              <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                3 فصول
              </span>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
              {filteredExams.map(ex => (
                <div
                  key={ex.id}
                  className={cn(
                    "p-3.5 rounded-2xl border space-y-1.5",
                    ex.isOfficialCertificate
                      ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700"
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white">
                      الفصل {ex.trimester}: {ex.title}
                    </span>
                    {ex.isOfficialCertificate && (
                      <span className="bg-amber-200 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-md">
                        شهادة رسمية
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    {ex.notes}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    المعنيون: {ex.gradesDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Staff Annual Leave */}
          <div className="bg-indigo-950 p-6 rounded-[2.5rem] shadow-xl text-white space-y-4 border border-indigo-800">
            <div className="flex items-center justify-between border-b border-indigo-800 pb-3">
              <h4 className="font-black text-sm text-white flex items-center gap-2">
                <UserCheck size={18} className="text-indigo-400" />
                <span>العطلة السنوية للموظفين 2026-2027</span>
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              {OFFICIAL_STAFF_LEAVE_2026_2027.map(st => (
                <div key={st.id} className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-300">{st.title}</span>
                    <span className="text-[10px] text-indigo-300">{st.startDate}</span>
                  </div>
                  <p className="text-[10px] text-indigo-200">{st.notes}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CalendarView;
