import React, { useState, useEffect } from 'react';
import {
  X, Save, Clock, CalendarDays, Plus, Trash2, CheckCircle2,
  Sparkles, AlertCircle, RefreshCw, Layers, Building
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import { useTheme, themeStyles } from '../../../utils/theme';
import {
  WeeklyScheduleConfig,
  TimetableSlot,
  WEEK_DAYS,
  PERIOD_HOURS_MAP,
  weeklyTimetableService
} from '../../../services/WeeklyTimetableService';
import { TeacherProfile } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

interface WeeklyTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: TeacherProfile;
  onSaveSuccess?: () => void;
}

export const WeeklyTimetableModal: React.FC<WeeklyTimetableModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveSuccess
}) => {
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  const defaultStage = (profile?.level === 'PRIMARY' || profile?.level === 'MIDDLE' || profile?.level === 'SECONDARY')
    ? profile.level
    : 'SECONDARY';

  const [config, setConfig] = useState<WeeklyScheduleConfig>(() =>
    weeklyTimetableService.getConfig(defaultStage)
  );
  const [selectedShift, setSelectedShift] = useState<'middle-secondary' | 'two-shifts' | 'one-shift'>(
    config.shiftSystem || (defaultStage === 'PRIMARY' ? 'one-shift' : 'middle-secondary')
  );

  const [editingSlot, setEditingSlot] = useState<{
    dayIdx: number;
    period: 'MORNING' | 'AFTERNOON';
    slotIndex: number;
    startTime: string;
    endTime: string;
  } | null>(null);

  const [inputClassName, setInputClassName] = useState('');
  const [inputSubject, setInputSubject] = useState(profile?.teachingSubject || 'اللغة العربية وآدابها');
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = weeklyTimetableService.getConfig(defaultStage);
      setConfig(existing);
      setSelectedShift(existing.shiftSystem);
    }
  }, [isOpen, defaultStage]);

  if (!isOpen) return null;

  const currentHours = PERIOD_HOURS_MAP[selectedShift];

  const assignedClasses = (profile?.grades && profile.grades.length > 0)
    ? profile.grades
    : (defaultStage === 'PRIMARY' ? ['5AP1', '4AP1'] : defaultStage === 'MIDDLE' ? ['4AM1', '3AM1'] : ['3AS1', '2AS1', '1AS1']);

  // العثور على الحصة في يوم وفترة معينة
  const findSlot = (dayIdx: number, period: 'MORNING' | 'AFTERNOON', slotIndex: number) => {
    return config.slots.find(
      s => s.dayIdx === dayIdx && s.period === period && s.slotIndex === slotIndex
    );
  };

  const handleOpenAddSlot = (dayIdx: number, period: 'MORNING' | 'AFTERNOON', slotIndex: number, start: string, end: string) => {
    const existing = findSlot(dayIdx, period, slotIndex);
    if (existing) {
      setInputClassName(existing.className);
      setInputSubject(existing.subject);
    } else {
      setInputClassName(assignedClasses[0] || '3AS1');
      setInputSubject(profile?.teachingSubject || 'اللغة العربية وآدابها');
    }
    setEditingSlot({ dayIdx, period, slotIndex, startTime: start, endTime: end });
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;
    const { dayIdx, period, slotIndex, startTime, endTime } = editingSlot;
    const dayObj = WEEK_DAYS.find(w => w.idx === dayIdx) || WEEK_DAYS[0];

    const filtered = config.slots.filter(
      s => !(s.dayIdx === dayIdx && s.period === period && s.slotIndex === slotIndex)
    );

    const newSlot: TimetableSlot = {
      id: uuidv4(),
      dayIdx,
      dayNameAr: dayObj.nameAr,
      period,
      slotIndex,
      startTime,
      endTime,
      className: inputClassName.trim() || 'الفوج 1',
      subject: inputSubject.trim() || profile?.teachingSubject || 'اللغة العربية وآدابها',
    };

    setConfig({
      ...config,
      slots: [...filtered, newSlot]
    });

    setEditingSlot(null);
  };

  const handleDeleteSlot = (dayIdx: number, period: 'MORNING' | 'AFTERNOON', slotIndex: number) => {
    setConfig({
      ...config,
      slots: config.slots.filter(
        s => !(s.dayIdx === dayIdx && s.period === period && s.slotIndex === slotIndex)
      )
    });
  };

  const handleResetToDefault = () => {
    const defaultCfg = weeklyTimetableService.generateDefaultConfig(
      defaultStage,
      assignedClasses[0] || '3AS1',
      profile?.teachingSubject || 'اللغة العربية وآدابها'
    );
    defaultCfg.shiftSystem = selectedShift;
    setConfig(defaultCfg);
  };

  const handleClearAllSlots = () => {
    if (config.slots.length === 0) {
      alert("الجدول مفرّغ أصلاً!");
      return;
    }
    if (confirm(`هل أنت متأكد من تصفير وتفريغ الجدول الأسبوعي بالكامل (حذف ${config.slots.length} حصة)؟ ستتمكن من بنائه من جديد أو استعادة النموذج الافتراضي.`)) {
      const cleared = weeklyTimetableService.clearAllSlots(defaultStage);
      setConfig(cleared);
    }
  };

  const handleSaveAll = () => {
    weeklyTimetableService.saveConfig({
      ...config,
      shiftSystem: selectedShift,
      stage: defaultStage
    });
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className={cn(
        "w-full max-w-5xl rounded-[2.5rem] shadow-2xl max-h-[94vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800",
        theme === 'v3' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      )}>
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-600/30">
              <CalendarDays size={26} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl md:text-2xl font-black">الجدول الزمني الأسبوعي للأستاذ</h3>
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-3 py-1 rounded-full font-black">
                  يُملأ مرة واحدة ⚡
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                اضبط حصصك الأسبوعية من الأحد إلى الخميس؛ ليتم توليد وتوزيع الكراس اليومي وفقها بدقة وسلاسة.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6">
          {/* Shift System Selection */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Building size={16} className="text-indigo-600" />
                <span>نظام التوقيت وساعات الدوام:</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {defaultStage === 'PRIMARY'
                  ? 'اختر نظام الدوام المعتمد بمدرستك الابتدائية (دوام واحد أو دوامين)'
                  : 'التوقيت الوطني الموحد لجميع المتوسطات والثانويات الجزائرية'}
              </p>
            </div>

            {defaultStage === 'PRIMARY' ? (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedShift('one-shift')}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-black transition-all border",
                    selectedShift === 'one-shift'
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  )}
                >
                  نظام الدوام الواحد (ابتدائي 08:00 - 15:00)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedShift('two-shifts')}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-black transition-all border",
                    selectedShift === 'two-shifts'
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  )}
                >
                  نظام الدوامين (ابتدائي 08:00 - 17:15)
                </button>
              </div>
            ) : (
              <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/60 dark:to-emerald-950/50 text-indigo-950 dark:text-indigo-200 rounded-2xl text-xs font-black border border-indigo-200/80 dark:border-indigo-800/80 flex items-center gap-2 shadow-sm">
                <span>🇩🇿 النظام الوطني الموحد:</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-black">الصباح (08:00 - 12:00)</span>
                <span>•</span>
                <span className="text-indigo-700 dark:text-indigo-300 font-black">المساء (13:30 - 17:30)</span>
              </div>
            )}
          </div>

          {/* Quick Help & Stats & Reset/Clear Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs px-1">
            <span className="font-bold text-slate-500 dark:text-slate-400">
              إجمالي الحصص المسجلة في الجدول: <span className="font-black text-indigo-600 dark:text-indigo-400">{config.slots.length} حصة أسبوعياً</span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClearAllSlots}
                className="text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-800"
                leftIcon={<Trash2 size={13} className="text-rose-600" />}
              >
                تصفير وتفريغ الجدول بالكامل 🗑️
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleResetToDefault}
                className="text-xs font-bold rounded-xl"
                leftIcon={<RefreshCw size={13} />}
              >
                استعادة جدول افتراضي متوازن
              </Button>
            </div>
          </div>

          {/* 5-Day Weekly Table Grid (Sunday to Thursday) */}
          <div className="space-y-4">
            {WEEK_DAYS.map(day => (
              <div
                key={day.idx}
                className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                      {day.idx + 1}
                    </span>
                    <h4 className="font-black text-base text-slate-800 dark:text-white">يوم {day.nameAr}</h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {config.slots.filter(s => s.dayIdx === day.idx).length} حصص مبرمجة
                  </span>
                </div>

                {/* Slots: Morning & Afternoon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Morning Slots */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 px-1">
                      الفترة الصباحية:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {currentHours.morning.map(h => {
                        const slot = findSlot(day.idx, 'MORNING', h.slotIndex);
                        return (
                          <div
                            key={`m_${h.slotIndex}`}
                            className={cn(
                              "p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all min-h-[70px]",
                              slot
                                ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 shadow-sm"
                                : "bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400"
                            )}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                              <span>{h.start} - {h.end}</span>
                              {slot && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(day.idx, 'MORNING', h.slotIndex)}
                                  className="text-slate-400 hover:text-rose-500"
                                  title="حذف الحصة"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>

                            {slot ? (
                              <button
                                type="button"
                                onClick={() => handleOpenAddSlot(day.idx, 'MORNING', h.slotIndex, h.start, h.end)}
                                className="text-right w-full font-black text-xs text-indigo-700 dark:text-indigo-300 truncate"
                              >
                                {slot.className}
                                <span className="block text-[10px] text-slate-500 font-normal truncate">{slot.subject}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenAddSlot(day.idx, 'MORNING', h.slotIndex, h.start, h.end)}
                                className="w-full h-full flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors py-1"
                              >
                                <Plus size={13} />
                                <span>إضافة قسم</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Afternoon Slots */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 px-1">
                      الفترة المسائية:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {currentHours.afternoon.map(h => {
                        const slot = findSlot(day.idx, 'AFTERNOON', h.slotIndex);
                        return (
                          <div
                            key={`a_${h.slotIndex}`}
                            className={cn(
                              "p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all min-h-[70px]",
                              slot
                                ? "bg-white dark:bg-slate-800 border-teal-200 dark:border-teal-800 shadow-sm"
                                : "bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-400"
                            )}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                              <span>{h.start} - {h.end}</span>
                              {slot && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(day.idx, 'AFTERNOON', h.slotIndex)}
                                  className="text-slate-400 hover:text-rose-500"
                                  title="حذف الحصة"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>

                            {slot ? (
                              <button
                                type="button"
                                onClick={() => handleOpenAddSlot(day.idx, 'AFTERNOON', h.slotIndex, h.start, h.end)}
                                className="text-right w-full font-black text-xs text-teal-700 dark:text-teal-300 truncate"
                              >
                                {slot.className}
                                <span className="block text-[10px] text-slate-500 font-normal truncate">{slot.subject}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenAddSlot(day.idx, 'AFTERNOON', h.slotIndex, h.start, h.end)}
                                className="w-full h-full flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 hover:text-teal-600 transition-colors py-1"
                              >
                                <Plus size={13} />
                                <span>إضافة قسم</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            {isSavedToast ? (
              <span className="text-emerald-600 font-black flex items-center gap-1.5">
                <CheckCircle2 size={16} /> تم حفظ الجدول الأسبوعي بنجاح!
              </span>
            ) : (
              <span>يتم تخزين الجدول محلياً وسحابياً كقاعدة لبناء الكراس اليومي.</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="rounded-xl px-5">
              إغلاق
            </Button>
            <Button
              onClick={handleSaveAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 font-black shadow-md shadow-indigo-600/20"
              leftIcon={<Save size={18} />}
            >
              حفظ الجدول الأسبوعي
            </Button>
          </div>
        </div>
      </div>

      {/* Mini Edit Slot Popover/Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className={cn(
            "w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4",
            theme === 'v3' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
          )}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-black text-base flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                <span>تحديد القسم للحصة ({editingSlot.startTime} - {editingSlot.endTime})</span>
              </h4>
              <button onClick={() => setEditingSlot(null)} className="p-1 hover:text-rose-500">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-500 block mb-1.5">اختر الفوج / القسم المسند:</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {assignedClasses.map(ac => (
                    <button
                      key={ac}
                      type="button"
                      onClick={() => setInputClassName(ac)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-black border transition-all",
                        inputClassName === ac
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {ac}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={inputClassName}
                  onChange={e => setInputClassName(e.target.value)}
                  placeholder="أو اكتب اسم قسم آخر..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 block mb-1.5">المادة:</label>
                <input
                  type="text"
                  value={inputSubject}
                  onChange={e => setInputSubject(e.target.value)}
                  placeholder="مثال: اللغة العربية وآدابها"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEditingSlot(null)} className="rounded-xl">
                إلغاء
              </Button>
              <Button size="sm" onClick={handleSaveSlot} className="bg-indigo-600 text-white rounded-xl px-5 font-black">
                تثبيت الحصة
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
