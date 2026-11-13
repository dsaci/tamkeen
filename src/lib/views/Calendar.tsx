import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight,
  Bell, FileDown, ShieldCheck, CheckCircle2, GraduationCap, Building2,
  CalendarDays, Sparkles, BookOpen, UserCheck, AlertTriangle, Printer,
  Download, FileText, X, Settings2, SlidersHorizontal, Loader2, Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
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

  // Export State & Modal
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportMode, setExportMode] = useState<'both' | 'holidays' | 'exams'>('both');
  const [exportStage, setExportStage] = useState<'ALL' | 'PRIMARY' | 'MIDDLE' | 'SECONDARY'>('ALL');
  const [showCustomHeaderSettings, setShowCustomHeaderSettings] = useState<boolean>(false);

  // Editable Official Header Data (Prefilled from Profile)
  const [customHeader, setCustomHeader] = useState({
    institution: profile?.institution || '',
    wilaya: profile?.province || profile?.wilaya || '',
    teacherName: profile?.name || '',
    pedagogicalDistrict: profile?.pedagogicalDistrict || '',
    administrativeDistrict: profile?.administrativeDistrict || '',
    academicYear: profile?.academicYear || '2026-2027'
  });

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

  // Handle Export to PDF
  const handleExportPDF = async (modeToExport?: 'both' | 'holidays' | 'exams', stageToExport?: 'ALL' | 'PRIMARY' | 'MIDDLE' | 'SECONDARY') => {
    const finalMode = modeToExport || exportMode;
    const finalStage = stageToExport || exportStage;
    setIsExporting(true);
    try {
      const { exportOfficialSchoolCalendarToPDF } = await import('../utils/pdfGenerator');
      await exportOfficialSchoolCalendarToPDF(profile, {
        mode: finalMode,
        selectedStage: finalStage,
        customHeader: customHeader
      });
      setShowExportModal(false);
    } catch (err) {
      console.error('Error exporting calendar:', err);
      alert('حدث خطأ أثناء تصدير وثيقة PDF، يرجى المحاولة ثانية.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-sans" dir="rtl">
      {/* Print-specific style */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; font-size: 11pt !important; }
          .no-print, header, nav, aside, footer { display: none !important; }
          .print-only { display: block !important; }
          .print-section { page-break-inside: avoid; margin-bottom: 20px; }
          .print-table { width: 100% !important; border-collapse: collapse !important; border: 1.5px solid #000 !important; }
          .print-table th, .print-table td { border: 1px solid #000 !important; padding: 6px 8px !important; color: #000 !important; }
        }
        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>

      {/* Screen View: Official Ministry Banner & Export Suite */}
      <div className="no-print p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-xl relative overflow-hidden">
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
              <span className="text-xs bg-emerald-500/40 text-emerald-100 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
                الموسم {OFFICIAL_MINISTERIAL_METADATA.academicYear}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">
              {OFFICIAL_MINISTERIAL_METADATA.title}
            </h2>

            <p className="text-xs md:text-sm text-emerald-100/90 font-bold max-w-2xl leading-relaxed">
              تنفيذاً لأحكام <strong>{OFFICIAL_MINISTERIAL_METADATA.decisionNumber}</strong> (بلاغ {OFFICIAL_MINISTERIAL_METADATA.announcementDate}) المحدد لرزنامة الاختبارات الفصلية والعطل المدرسية للسنة الدراسية {OFFICIAL_MINISTERIAL_METADATA.academicYear}.
            </p>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-start lg:self-auto flex-wrap">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 border border-amber-300"
            >
              <Download size={16} className="text-slate-950" />
              <span>تصدير رسمي متقدم (PDF)</span>
            </button>

            <button
              onClick={() => handleExportPDF('both')}
              disabled={isExporting}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 backdrop-blur-md transition-all active:scale-95 border border-white/20"
              title="تصدير الرزنامة والعطل معاً في وثيقة موحدة"
            >
              {isExporting ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
              <span>معاً (PDF)</span>
            </button>

            <button
              onClick={() => handleExportPDF('holidays')}
              disabled={isExporting}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 backdrop-blur-md transition-all active:scale-95 border border-white/20"
              title="تصدير العطل المدرسية فقط"
            >
              <CalendarIcon size={15} />
              <span>العطل فقط (PDF)</span>
            </button>

            <button
              onClick={() => handleExportPDF('exams')}
              disabled={isExporting}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 backdrop-blur-md transition-all active:scale-95 border border-white/20"
              title="تصدير رزنامة الاختبارات فقط"
            >
              <GraduationCap size={15} />
              <span>الاختبارات (PDF)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              title="طباعة فورية للوثيقة الحالية"
            >
              <Printer size={15} />
              <span>طباعة 🖨️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="no-print flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex-wrap">
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
                onClick={() => {
                  setSelectedStage(stage);
                  setExportStage(stage);
                }}
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
      <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-6">

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
        <div className="no-print space-y-6">

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

      {/* ========================================================================= */}
      {/* 🏛️ Official Print Layout (Appears exclusively when clicking Print / Ctrl+P) */}
      {/* ========================================================================= */}
      <div className="print-only font-sans text-black p-4" dir="rtl">
        {/* Ministry Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-4">
          <div className="w-1/3 text-right">
            <p className="font-black text-xs m-0">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-black text-xs m-0">وزارة التربية الوطنية</p>
            <p className="font-bold text-[11px] m-0">مديرية التربية لولاية: {customHeader.wilaya || '...................'}</p>
            <p className="font-bold text-[11px] m-0">المؤسسة التعليمية: {customHeader.institution || '...................'}</p>
          </div>
          <div className="w-1/3 text-center">
            <h1 className="font-black text-lg underline m-0">الرزنامة الرسمية للاختبارات والعطل المدرسية</h1>
            <p className="font-bold text-xs m-0 mt-1">الموسم الدراسي: {customHeader.academicYear}</p>
            <p className="text-[10px] m-0 text-slate-700">تنفيذاً لأحكام القرار رقم 41 وبلاغ 05 أكتوبر 2026</p>
          </div>
          <div className="w-1/3 text-left">
            <p className="font-bold text-[11px] m-0">المقاطعة البيداغوجية: {customHeader.pedagogicalDistrict || '...................'}</p>
            <p className="font-black text-[11px] m-0">الأستاذ(ة): {customHeader.teacherName || '...................'}</p>
            <p className="text-[10px] m-0">تاريخ الاستخراج: {new Date().toLocaleDateString('ar-DZ')}</p>
          </div>
        </div>

        {/* Holidays Table */}
        <div className="print-section">
          <div className="bg-gray-200 border border-black border-b-0 p-1.5 font-black text-xs flex justify-between">
            <span>🏖️ أولاً: جدول العطل المدرسية الرسمية للسنة الدراسية 2026-2027</span>
            <span>القرار الوزاري رقم 41</span>
          </div>
          <table className="print-table text-[10px]">
            <thead className="bg-gray-100 font-black">
              <tr>
                <th className="w-[20%] text-center">العطلة المدرسية</th>
                <th className="w-[22%] text-center">تاريخ البداية (مساءً)</th>
                <th className="w-[22%] text-center">استئناف الدراسة (صباحاً)</th>
                <th className="w-[36%] text-center">التفاصيل والملاحظات التنظيمية</th>
              </tr>
            </thead>
            <tbody>
              {OFFICIAL_SCHOOL_HOLIDAYS_2026_2027.map(h => (
                <tr key={h.id}>
                  <td className="font-black text-center">{h.title}</td>
                  <td className="text-center">{h.startDate}</td>
                  <td className="font-black text-center">{h.resumeDate}</td>
                  <td>{h.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Exams Table */}
        <div className="print-section mt-4">
          <div className="bg-gray-200 border border-black border-b-0 p-1.5 font-black text-xs flex justify-between">
            <span>📝 ثانياً: رزنامة الاختبارات الفصلية والامتحانات الرسمية 2026-2027</span>
            <span>بلاغ 05 أكتوبر 2026</span>
          </div>
          <table className="print-table text-[10px]">
            <thead className="bg-gray-100 font-black">
              <tr>
                <th className="w-[10%] text-center">الفصل</th>
                <th className="w-[10%] text-center">الطور</th>
                <th className="w-[30%] text-center">عنوان الاختبار / الامتحان</th>
                <th className="w-[25%] text-center">الفترة المحددة</th>
                <th className="w-[25%] text-center">الأقسام والفئات المعنية</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(e => (
                <tr key={e.id}>
                  <td className="font-black text-center">الفصل {e.trimester}</td>
                  <td className="text-center font-bold">{e.stage === 'PRIMARY' ? 'ابتدائي' : e.stage === 'MIDDLE' ? 'متوسط' : 'ثانوي'}</td>
                  <td className="font-bold">{e.title}</td>
                  <td className="font-black text-center">{e.notes || `${e.startDate} إلى ${e.endDate}`}</td>
                  <td>{e.gradesDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Staff Holidays */}
        <div className="print-section mt-4">
          <div className="bg-gray-200 border border-black border-b-0 p-1.5 font-black text-xs">
            <span>👥 ثالثاً: رزنامة العطلة السنوية للموظفين الإداريين والتربويين (صيف 2027)</span>
          </div>
          <table className="print-table text-[10px]">
            <thead className="bg-gray-100 font-black">
              <tr>
                <th className="w-[25%] text-center">الفئة الوظيفية</th>
                <th className="w-[25%] text-center">المناطق والولايات المشمولة</th>
                <th className="w-[22%] text-center">تاريخ سريان العطلة</th>
                <th className="w-[28%] text-center">الشروط والتوجيهات</th>
              </tr>
            </thead>
            <tbody>
              {OFFICIAL_STAFF_LEAVE_2026_2027.map(st => (
                <tr key={st.id}>
                  <td className="font-black">{st.title}</td>
                  <td className="text-center">{st.region}</td>
                  <td className="font-black text-center">{st.startDate}</td>
                  <td>{st.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-8 pt-4 flex justify-around text-center text-xs font-black">
          <div>
            <p>توقيع الأستاذ(ة):</p>
            <div className="h-12"></div>
            <p>{customHeader.teacherName || '...................'}</p>
          </div>
          <div>
            <p>تأشيرة ومدير المؤسسة:</p>
            <div className="h-12"></div>
            <p>(الختم والإمضاء)</p>
          </div>
          <div>
            <p>تأشيرة مفتش التربية الوطنية:</p>
            <div className="h-12"></div>
            <p>(الختم والإمضاء)</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📄 Interactive Official Export Modal (نافذة التصدير الاحترافية المتقدمة) */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl shadow-md">
                  <Download size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    تصدير الرزنامة والعطل المدرسية الرسمية
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    وثيقة معتمدة ومطابقة للقرار الوزاري رقم 41 لسنة 2026-2027
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scope Selection Cards (معاً / العطل فقط / الاختبارات فقط) */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                اختر نطاق الوثيقة المراد تصديرها:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Option 1: Both Together */}
                <div
                  onClick={() => setExportMode('both')}
                  className={cn(
                    "p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 relative",
                    exportMode === 'both'
                      ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/60"
                  )}
                >
                  {exportMode === 'both' && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white rounded-full p-1">
                      <Check size={12} />
                    </span>
                  )}
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 w-fit">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">معاً (شامل)</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mt-1">
                      العطل المدرسية + رزنامة الاختبارات + عطلة الموظفين في وثيقة واحدة موحدة.
                    </p>
                  </div>
                </div>

                {/* Option 2: Holidays Only */}
                <div
                  onClick={() => setExportMode('holidays')}
                  className={cn(
                    "p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 relative",
                    exportMode === 'holidays'
                      ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/60"
                  )}
                >
                  {exportMode === 'holidays' && (
                    <span className="absolute top-3 left-3 bg-amber-600 text-white rounded-full p-1">
                      <Check size={12} />
                    </span>
                  )}
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 w-fit">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">العطل الرسمية فقط</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mt-1">
                      جدول العطل المدرسية وتواريخ استئناف الدراسة صباحاً + عطلة الموظفين.
                    </p>
                  </div>
                </div>

                {/* Option 3: Exams Only */}
                <div
                  onClick={() => setExportMode('exams')}
                  className={cn(
                    "p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 relative",
                    exportMode === 'exams'
                      ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/60"
                  )}
                >
                  {exportMode === 'exams' && (
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white rounded-full p-1">
                      <Check size={12} />
                    </span>
                  )}
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 w-fit">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">رزنامة الاختبارات فقط</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mt-1">
                      مواعيد اختبارات الفصول الثلاثة والامتحانات الرسمية لشهادة BEM وبكالوريا تجريبية.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Filter Option (for exams or both) */}
            {(exportMode === 'both' || exportMode === 'exams') && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  الطور التعليمي المخصص للاختبارات:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ALL', label: 'كافة الأطوار' },
                    { id: 'PRIMARY', label: 'الابتدائي' },
                    { id: 'MIDDLE', label: 'المتوسط' },
                    { id: 'SECONDARY', label: 'الثانوي' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setExportStage(st.id as any)}
                      className={cn(
                        "py-2 px-3 rounded-2xl text-xs font-black transition-all border",
                        exportStage === st.id
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible Header Customization Section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-3xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div
                onClick={() => setShowCustomHeaderSettings(!showCustomHeaderSettings)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-600" />
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    تخصيص بيانات الترويسة الرسمية (المؤسسة، الأستاذ، الولاية)
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600">
                  {showCustomHeaderSettings ? 'إخفاء ▲' : 'تعديل ▼'}
                </span>
              </div>

              {showCustomHeaderSettings && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">المؤسسة التعليمية:</label>
                    <input
                      type="text"
                      value={customHeader.institution}
                      onChange={e => setCustomHeader({ ...customHeader, institution: e.target.value })}
                      placeholder="اسم الثانوية / المتوسطة / الابتدائية"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">مديرية التربية لولاية:</label>
                    <input
                      type="text"
                      value={customHeader.wilaya}
                      onChange={e => setCustomHeader({ ...customHeader, wilaya: e.target.value })}
                      placeholder="مثال: الجزائر وسط، سطيف، وهران..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">اسم الأستاذ(ة):</label>
                    <input
                      type="text"
                      value={customHeader.teacherName}
                      onChange={e => setCustomHeader({ ...customHeader, teacherName: e.target.value })}
                      placeholder="الاسم واللقب"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">المقاطعة البيداغوجية:</label>
                    <input
                      type="text"
                      value={customHeader.pedagogicalDistrict}
                      onChange={e => setCustomHeader({ ...customHeader, pedagogicalDistrict: e.target.value })}
                      placeholder="رقم أو اسم المقاطعة التفتيشية"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Execution Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  setTimeout(() => window.print(), 200);
                }}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95"
              >
                <Printer size={15} />
                <span>طباعة فورية</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportPDF()}
                disabled={isExporting}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                <span>{isExporting ? 'جاري إنشاء وثيقة PDF...' : 'تحميل وثيقة PDF رسمية'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
