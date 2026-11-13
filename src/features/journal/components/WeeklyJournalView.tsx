import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Session, TeacherProfile } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme, themeStyles } from '../../../utils/theme';
import { cn } from '../../../lib/utils';
import {
  CalendarDays, Sparkles, Clock, Edit3, Trash2, Plus, Loader2,
  FileDown, Settings, ChevronRight, ChevronLeft, CheckCircle2,
  BookOpen, Layers, Zap, Info, ShieldCheck, Printer, RefreshCw
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  weeklyTimetableService,
  WEEK_DAYS,
  WeekdayNameAr
} from '../../../services/WeeklyTimetableService';
import { generateFullWeekSessions, AvailableWeekOption } from '../../../services/WeeklyCurriculumGenerator';
import { WeeklyTimetableModal } from './WeeklyTimetableModal';
import { WeeklyCurriculumPacingModal } from './WeeklyCurriculumPacingModal';
import {
  getDailyJournal,
  addSessionToJournal,
  deleteSessionFromJournal
} from '../../../lib/services/dailyJournal.service';
import { getAlgerianMonthFromDate } from '../../../services/JournalCurriculumService';

interface WeeklyJournalViewProps {
  profile: TeacherProfile;
  onEditSession: (session: Session) => void;
  onAddNewSession: (dateStr: string) => void;
}

export const WeeklyJournalView: React.FC<WeeklyJournalViewProps> = ({
  profile,
  onEditSession,
  onAddNewSession
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  // Current Base Date for the school week
  const [baseDate, setBaseDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [weekSessions, setWeekSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isPacingModalOpen, setIsPacingModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Calculate the 5 school days (Sunday to Thursday)
  const weekInfo = useMemo(() => {
    return weeklyTimetableService.getAlgerianSchoolWeekDates(baseDate);
  }, [baseDate]);

  const { monthNameAr } = getAlgerianMonthFromDate(weekInfo.sunday);

  // Fetch all sessions across Sunday-Thursday
  const fetchWeekSessions = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const promises = weekInfo.dates.map(d => getDailyJournal(user.id, d.dateStr));
      const journals = await Promise.all(promises);

      const all: Session[] = [];
      journals.forEach((j) => {
        if (j && Array.isArray(j.sessions)) {
          all.push(...j.sessions);
        }
      });

      // Sort by day and time
      all.sort((a, b) => {
        if (a.timing.date !== b.timing.date) return a.timing.date.localeCompare(b.timing.date);
        if (a.timing.period !== b.timing.period) return a.timing.period === 'MORNING' ? -1 : 1;
        return (a.timing.startTime || '').localeCompare(b.timing.startTime || '');
      });

      setWeekSessions(all);
    } catch (err) {
      console.error('[WeeklyJournalView] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, weekInfo]);

  useEffect(() => {
    fetchWeekSessions();
  }, [fetchWeekSessions]);

  // Navigate Weeks
  const handlePrevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d.toISOString().split('T')[0]);
  };

  const handleTodayWeek = () => {
    setBaseDate(new Date().toISOString().split('T')[0]);
  };

  // 1-Click Generate & Fill the Entire Week: Open Pacing Question Dialog
  const handleGenerateWholeWeek = () => {
    if (!user?.id) return;
    const stage = (profile?.level === 'PRIMARY' || profile?.level === 'MIDDLE' || profile?.level === 'SECONDARY')
      ? profile.level
      : 'SECONDARY';

    const timetableConfig = weeklyTimetableService.getConfig(stage);

    if (!timetableConfig.slots || timetableConfig.slots.length === 0) {
      alert("الجدول الزمني فارغ حالياً! سنفتح نافذة ضبط الجدول أولاً لتحديده بنقرة واحدة.");
      setIsTimetableModalOpen(true);
      return;
    }

    // Open pacing selection dialog so the teacher can pick their actual progress/month/week
    setIsPacingModalOpen(true);
  };

  // Confirmed Generation from Pacing Modal
  const handleConfirmPacingGenerate = async (params: {
    monthNameAr: string;
    weekIndexInMonth: number;
    selectedWeekData?: AvailableWeekOption;
  }) => {
    if (!user?.id) return;
    setIsGeneratingWeek(true);
    try {
      const stage = (profile?.level === 'PRIMARY' || profile?.level === 'MIDDLE' || profile?.level === 'SECONDARY')
        ? profile.level
        : 'SECONDARY';

      const timetableConfig = weeklyTimetableService.getConfig(stage);

      if (!timetableConfig.slots || timetableConfig.slots.length === 0) {
        alert("الجدول الزمني فارغ حالياً! سنفتح نافذة ضبط الجدول أولاً.");
        setIsTimetableModalOpen(true);
        setIsPacingModalOpen(false);
        setIsGeneratingWeek(false);
        return;
      }

      // Generate the sessions matching the teacher's selected pacing & month & week
      const generated = generateFullWeekSessions({
        weekDates: weekInfo.dates,
        slots: timetableConfig.slots,
        profile: profile,
        monthNameAr: params.monthNameAr,
        weekIndexInMonth: params.weekIndexInMonth,
      });

      // Save to backend
      for (const sess of generated) {
        await addSessionToJournal(user.id, sess.timing.date, sess);
      }

      await fetchWeekSessions();
      setIsPacingModalOpen(false);
      setSuccessToast(`✨ تم بنجاح توليد وتعبئة الأسبوع كاملاً (${generated.length} حصة) بناءً على تقدمك في شهر ${params.monthNameAr} (الأسبوع ${params.weekIndexInMonth}) من التدرج الرسمي!`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      console.error('[WeeklyJournalView] Generation error:', err);
      alert('حدث خطأ أثناء التوليد الأسبوعي، يرجى التحقق من الاتصال.');
    } finally {
      setIsGeneratingWeek(false);
    }
  };

  // Delete Single Session
  const handleDeleteSession = async (session: Session) => {
    if (!user?.id) return;
    if (confirm(`هل أنت متأكد من حذف حصة "${session.title}"؟`)) {
      try {
        await deleteSessionFromJournal(user.id, session.timing.date, session.id);
        setWeekSessions(prev => prev.filter(s => s.id !== session.id));
      } catch (e) {
        console.error(e);
        alert('فشل حذف الحصة.');
      }
    }
  };

  // Zero-out / Clear all sessions for the active week
  const handleClearWholeWeek = async () => {
    if (!user?.id) return;
    if (weekSessions.length === 0) {
      alert("لا توجد حصص مسجلة في هذا الأسبوع لتصفيرها!");
      return;
    }

    if (confirm(`هل أنت متأكد تماماً من تصفير ومسح جميع حصص هذا الأسبوع (${weekSessions.length} حصة من الأحد إلى الخميس)؟\n\nسيتم حذفها بالكامل لتتمكن من إعادة التوليد أو التعبئة من الصفر.`)) {
      setIsLoading(true);
      try {
        for (const sess of weekSessions) {
          await deleteSessionFromJournal(user.id, sess.timing.date, sess.id);
        }
        setWeekSessions([]);
        setSuccessToast(`🗑️ تم بنجاح تصفير وتفريغ حصص الأسبوع بالكامل!`);
        setTimeout(() => setSuccessToast(null), 4000);
      } catch (e) {
        console.error('[WeeklyJournalView] Clear week error:', e);
        alert('حدث خطأ أثناء تصفير الحصص.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Zero-out / Clear sessions for a specific day
  const handleClearDaySessions = async (dateStr: string, dayNameAr: string) => {
    if (!user?.id) return;
    const daySessions = weekSessions.filter(s => s.timing.date === dateStr);
    if (daySessions.length === 0) return;

    if (confirm(`هل تريد تصفير ومسح حصص يوم ${dayNameAr} (${daySessions.length} حصة)؟`)) {
      try {
        for (const s of daySessions) {
          await deleteSessionFromJournal(user.id, dateStr, s.id);
        }
        setWeekSessions(prev => prev.filter(s => s.timing.date !== dateStr));
        setSuccessToast(`تم مسح حصص يوم ${dayNameAr} بنجاح.`);
        setTimeout(() => setSuccessToast(null), 3000);
      } catch (e) {
        console.error(e);
        alert('حدث خطأ أثناء مسح حصص اليوم.');
      }
    }
  };

  // Export Weekly Notebook to PDF
  const handleExportWeeklyPDF = async () => {
    if (!profile || weekSessions.length === 0) {
      alert('لا توجد حصص مسجلة لتصديرها في هذا الأسبوع.');
      return;
    }
    setIsExporting(true);
    try {
      const { exportWeeklyJournalToPDF } = await import('../../../lib/utils/pdfGenerator');
      await exportWeeklyJournalToPDF(
        profile,
        weekInfo.dates.map(d => ({ dateStr: d.dateStr, dayNameAr: d.dayNameAr })),
        weekSessions,
        `الكراس اليومي الأسبوعي — شهر ${monthNameAr}`
      );
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير ملف PDF الأسبوعي.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in" dir="rtl">
      {/* Top Banner & Week Navigation Bar */}
      <div className="p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-700 text-white shadow-xl shadow-indigo-950/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Title & Info */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-3xl shadow-inner">
              <CalendarDays size={32} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl md:text-2xl font-black">الاستظهار الأسبوعي الشامل للكراس اليومي</h3>
                <span className="bg-amber-400 text-indigo-950 text-xs px-3 py-1 rounded-full font-black shadow-sm">
                  النمط الأسبوعي المولد ⚡
                </span>
              </div>
              <p className="text-indigo-100 text-xs md:text-sm font-bold mt-1">
                استعراض ومتابعة أيام التدريس الخمسة (الأحد إلى الخميس) وتوليد محتواها بيداغوجياً من التدرج السنوي
              </p>
            </div>
          </div>

          {/* Week Date Stepper */}
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md p-2 rounded-2xl border border-white/20 self-start md:self-auto">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
              title="الأسبوع السابق"
            >
              <ChevronRight size={20} />
            </button>

            <div className="px-3 text-center">
              <span className="text-[10px] text-indigo-200 block font-bold">شهر: {monthNameAr}</span>
              <span className="text-xs font-black text-white whitespace-nowrap">
                {weekInfo.dates[0]?.formatted.slice(0, 10)} ➔ {weekInfo.dates[4]?.formatted.slice(0, 10)}
              </span>
            </div>

            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
              title="الأسبوع القادم"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleTodayWeek}
              className="px-3 py-1.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-black transition-all ml-1"
            >
              اليوم
            </button>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Main Generate Button */}
          <Button
            onClick={handleGenerateWholeWeek}
            isLoading={isGeneratingWeek}
            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            leftIcon={<Sparkles size={18} className="text-amber-300 animate-pulse" />}
          >
            توليد وملء الأسبوع كاملاً آلياً ⚡
          </Button>

          {/* Timetable Config Button */}
          <Button
            variant="secondary"
            onClick={() => setIsTimetableModalOpen(true)}
            className="rounded-2xl text-xs font-bold px-4 py-3"
            leftIcon={<Settings size={16} />}
          >
            ضبط وتعديل الجدول الأسبوعي
          </Button>

          {/* Zero-Out / Clear Whole Week Button */}
          <Button
            variant="secondary"
            onClick={handleClearWholeWeek}
            disabled={weekSessions.length === 0 || isLoading}
            className="rounded-2xl text-xs font-bold px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-800 transition-all"
            leftIcon={<Trash2 size={16} className="text-rose-600" />}
          >
            تصفير حصص الأسبوع 🗑️
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            variant="secondary"
            onClick={handleExportWeeklyPDF}
            disabled={weekSessions.length === 0 || isExporting}
            isLoading={isExporting}
            className="rounded-2xl text-xs font-bold px-5 py-3"
            leftIcon={<FileDown size={16} className="text-indigo-600" />}
          >
            تصدير الأسبوع (PDF)
          </Button>

          <span className="text-xs font-black bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-600 whitespace-nowrap">
            {weekSessions.length} حصص بالأسبوع
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-4 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center gap-3 text-emerald-900 dark:text-emerald-200 animate-in slide-in-from-top-2">
          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-black">{successToast}</span>
        </div>
      )}

      {/* 5-Day Weekly Columns (Sunday to Thursday) */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={40} className="animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-black text-slate-500">جاري تحميل بيانات الأسبوع...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weekInfo.dates.map(day => {
            const daySessions = weekSessions.filter(s => s.timing.date === day.dateStr);

            return (
              <div
                key={day.dayIdx}
                className={cn(
                  "flex flex-col rounded-3xl border transition-all overflow-hidden shadow-sm",
                  theme === 'v3'
                    ? "bg-slate-800/70 border-slate-700"
                    : "bg-white border-slate-200/80"
                )}
              >
                {/* Column Day Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/90 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">
                        {day.dayIdx + 1}
                      </span>
                      <span>يوم {day.dayNameAr}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        {daySessions.length} حصص
                      </span>
                      {daySessions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleClearDaySessions(day.dateStr, day.dayNameAr)}
                          title={`تصفير ومسح حصص يوم ${day.dayNameAr}`}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 pr-7">
                    {day.formatted.slice(0, 16)}
                  </span>
                </div>

                {/* Day Sessions List */}
                <div className="flex-1 p-3 space-y-3 min-h-[380px] overflow-y-auto custom-scrollbar">
                  {daySessions.length > 0 ? (
                    daySessions.map(session => (
                      <div
                        key={session.id}
                        className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all space-y-2 group"
                      >
                        {/* Time & Class Badge */}
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <span className="font-black text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                            <Clock size={11} />
                            {session.timing.startTime} - {session.timing.endTime}
                          </span>
                          <span className="font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                            {session.activity}
                          </span>
                        </div>

                        {/* Title */}
                        <h5 className="font-black text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {session.title || 'حصة بدون عنوان'}
                        </h5>

                        {/* Objective Preview */}
                        {session.objective && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {session.objective}
                          </p>
                        )}

                        {/* Card Actions */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => onEditSession(session)}
                            className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <Edit3 size={12} />
                            <span>تعديل الحصة</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSession(session)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="حذف الحصة"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 space-y-2">
                      <Clock size={24} className="opacity-30" />
                      <p className="text-[11px] font-bold">لا توجد حصص مسجلة</p>
                      <button
                        type="button"
                        onClick={() => onAddNewSession(day.dateStr)}
                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> إضافة حصة
                      </button>
                    </div>
                  )}
                </div>

                {/* Day Footer Add Button */}
                <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <button
                    type="button"
                    onClick={() => onAddNewSession(day.dateStr)}
                    className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus size={13} className="text-indigo-600" />
                    <span>حصة جديدة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Weekly Timetable Config Modal */}
      <WeeklyTimetableModal
        isOpen={isTimetableModalOpen}
        onClose={() => setIsTimetableModalOpen(false)}
        profile={profile}
        onSaveSuccess={() => {
          setSuccessToast("تم تحديث جدولك الزمني الأسبوعي بنجاح! يمكنك الآن الضغط على 'توليد وملء الأسبوع كاملاً'.");
          setTimeout(() => setSuccessToast(null), 4000);
        }}
      />

      {/* Interactive Curriculum Pacing Modal (Ahead/Behind/On-Schedule with Month and Week picker) */}
      <WeeklyCurriculumPacingModal
        isOpen={isPacingModalOpen}
        onClose={() => setIsPacingModalOpen(false)}
        profile={profile}
        initialMonthNameAr={monthNameAr}
        weekRangeText={`${weekInfo.dates[0]?.formatted.slice(0, 10)} ➔ ${weekInfo.dates[4]?.formatted.slice(0, 10)}`}
        onConfirmGenerate={handleConfirmPacingGenerate}
        isLoading={isGeneratingWeek}
      />
    </div>
  );
};
