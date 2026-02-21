
import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Calendar as CalendarIcon, BookOpen, Trash2, Edit2, FileText,
  Sparkles, CheckCircle2, Clock, X, Save, Loader2,
  GraduationCap, Briefcase, Zap, CalendarDays, MoreHorizontal, Layers, LayoutGrid
} from 'lucide-react';
import { Session, SessionCategory, TeacherProfile, AppLanguage } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  getDailyJournal,
  addSessionToJournal,
  updateSessionInJournal,
  deleteSessionFromJournal,
  createSession
} from '../services/dailyJournal.service';
import LoadingScreen from '../../components/LoadingScreen';

// Lazy Load Utils
const loadPdfGenerator = () => import('../utils/pdfGenerator');
const loadMagicGenerator = () => import('../services/magicGenerator');

// --- CONSTANTS ---
const CATEGORIES: { id: SessionCategory; label: string; icon: any; color: string }[] = [
  { id: 'LESSON', label: 'حصة عادية', icon: BookOpen, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'BREAK', label: 'استراحة', icon: Clock, color: 'bg-orange-100 text-orange-600' },
  { id: 'EXAM', label: 'اختبار / فرض', icon: GraduationCap, color: 'bg-rose-100 text-rose-600' },
  { id: 'SUPPORT', label: 'معالجة', icon: Zap, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'TRAINING', label: 'تدريبات', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  { id: 'INTEGRATION', label: 'إدماج', icon: Layers, color: 'bg-purple-100 text-purple-600' },
  { id: 'HOLIDAY', label: 'عطلة', icon: CalendarDays, color: 'bg-green-100 text-green-600' },
];

const TRAINING_TYPES = ['تدريبات عامة', 'تدريبات في كراس القسم', 'تدريبات في دفتر الانشطة', 'مراجعة عامة', 'تحضير للإمتحانات'];
const INTEGRATION_TYPES = ['أسبوع كامل', 'نصف أسبوع', 'يوم واحد', 'ساعة واحدة'];
const EXAM_TYPES = ['اختبار فصلي', 'فرض محروس', 'تقويم بيداغوجي'];
const BREAK_DURATIONS: { label: string; value: number }[] = [
  { label: '15 دقيقة', value: 15 },
  { label: '30 دقيقة', value: 30 },
  { label: '45 دقيقة', value: 45 },
  { label: '60 دقيقة', value: 60 },
];
const PEDAGOGICAL_OBSERVATIONS = [
  'التلاميذ منتبهون ومتفاعلون مع الدرس.',
  'الدرس تم تقديمه بشكل جيد، مع بعض الصعوبات لدى البعض.',
  'يحتاج التلاميذ إلى مزيد من التركيز في الحصة القادمة.',
  'تم تحقيق الأهداف المسطرة بنجاح.',
  'مشاركة ممتازة من قبل الفوج.',
  'الهدوء والانضباط سائدان طيلة الحصة.'
];
const SECTION_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);


const HOLIDAYS = [
  'أول نوفمبر (عيد الثورة)', '12 يناير (رأس السنة الأمازيغية)', '1 ماي (عيد العمال)',
  '5 جويلية (عيد الاستقلال)', 'عيد الفطر المبارك', 'عيد الأضحى المبارك',
  'المولد النبوي الشريف', 'أول محرم', 'عاشوراء', 'عطلة الشتاء', 'عطلة الربيع'
];

interface Props {
  profile?: TeacherProfile;
  lang?: AppLanguage;
  useBackend?: boolean;
  userId?: string;
}

export default function JournalView({ profile, lang, useBackend, userId }: Props) {
  // Use Auth Context
  const { user } = useAuth();
  const currentUid = userId || user?.id;

  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState<Partial<Session>>({
    subject: profile?.teachingSubject || '',
    activity: '',
    title: '',
    sessionNumber: 1,
    sectionId: '',
    sectionName: '',
    content: '',
    objective: '',
    notes: '',
    tools: '',
    timing: {
      date: selectedDate,
      category: 'LESSON',
      period: 'MORNING',
      startTime: '08:00',
      endTime: '09:00'
    }
  });

  // --- FETCH DATA ---
  const fetchEntries = useCallback(async () => {
    if (!currentUid) return;
    try {
      setIsLoading(true);
      const journal = await getDailyJournal(currentUid, selectedDate);
      if (journal && journal.sessions) {
        const sorted = [...journal.sessions].sort((a, b) => {
          if (a.timing.period === b.timing.period) return (a.timing.startTime || '').localeCompare(b.timing.startTime || '');
          return a.timing.period === 'MORNING' ? -1 : 1;
        });
        setEntries(sorted);
        // Auto increment logic
        if (!editingSessionId) {
          const lastSession = sorted.filter(s => s.timing.category === 'LESSON').pop();
          if (lastSession) {
            setFormData(prev => ({ ...prev, sessionNumber: (lastSession.sessionNumber || 0) + 1 }));
          }
        }
      } else {
        setEntries([]);
        if (!editingSessionId) setFormData(prev => ({ ...prev, sessionNumber: 1 }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [currentUid, selectedDate, editingSessionId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // --- ACTION HANDLERS ---

  const handleEdit = (session: Session) => {
    setEditingSessionId(session.id);
    setFormData({ ...session });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingSessionId(null);
    setFormData({
      subject: profile?.teachingSubject || '',
      activity: '',
      title: '',
      sectionId: '',
      sectionName: '',
      sessionNumber: (entries.filter(e => e.timing.category === 'LESSON').length) + 1,
      content: '',
      objective: '',
      notes: '',
      tools: '',
      timing: {
        date: selectedDate,
        category: 'LESSON',
        period: 'MORNING',
        startTime: '08:00',
        endTime: '09:00'
      }
    });
  };

  const handlePeriodChange = (period: 'MORNING' | 'AFTERNOON') => {
    const startTime = period === 'MORNING' ? '08:00' : '13:00';
    const endTime = period === 'MORNING' ? '09:00' : '14:00';
    setFormData(prev => ({
      ...prev,
      timing: {
        ...prev.timing!,
        period,
        startTime,
        endTime
      }
    }));
  };

  const generatePedagogicalObservation = (e: React.MouseEvent) => {
    e.preventDefault();
    const randomObs = PEDAGOGICAL_OBSERVATIONS[Math.floor(Math.random() * PEDAGOGICAL_OBSERVATIONS.length)];
    setFormData(prev => ({ ...prev, notes: randomObs }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // --- SAVE ---
  const handleSave = async () => {
    if (!currentUid) { alert("يرجى تسجيل الدخول"); return; }

    // Validation
    if (formData.timing?.category !== 'HOLIDAY' && (!formData.subject || !formData.title)) {
      alert("يرجى ملء المادة وعنوان الحصة");
      return;
    }

    setIsModalOpen(false);

    // Prepare Data
    const sessionData = {
      ...formData,
      timing: { ...formData.timing!, date: selectedDate }
    };

    // Optimistic Update
    const prevEntries = [...entries];

    try {
      if (editingSessionId) {
        const updatedSession = { ...sessionData, id: editingSessionId } as Session;
        setEntries(prev => prev.map(e => e.id === editingSessionId ? updatedSession : e).sort((a, b) => (a.timing.startTime || '').localeCompare(b.timing.startTime || '')));
        await updateSessionInJournal(currentUid, selectedDate, updatedSession);
      } else {
        const newSession = createSession(sessionData);
        setEntries(prev => [...prev, newSession].sort((a, b) => (a.timing.startTime || '').localeCompare(b.timing.startTime || '')));
        await addSessionToJournal(currentUid, selectedDate, newSession);
      }
      resetForm();
    } catch (e) {
      console.error("Sync failed", e);
      alert("حدث خطأ في الحفظ");
      setEntries(prevEntries);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentUid || !confirm("هل أنت متأكد من حذف هذه الحصة؟")) return;
    const prevEntries = [...entries];
    setEntries(prev => prev.filter(e => e.id !== id));
    try {
      await deleteSessionFromJournal(currentUid, selectedDate, id);
    } catch (e) {
      console.error(e);
      setEntries(prevEntries);
    }
  };

  const handleMagicGenerate = async () => {
    if (!formData.subject || !formData.title) {
      alert("أدخل المادة والعنوان أولاً");
      return;
    }
    setIsGenerating(true);
    try {
      const { generateMagicSession } = await loadMagicGenerator();
      const generated = await generateMagicSession(formData.subject!, formData.title!);
      setFormData(prev => ({
        ...prev,
        content: generated.content || prev.content,
        objective: generated.objective || prev.objective,
        tools: generated.tools || prev.tools,
        activity: generated.activity || prev.activity,
        notes: generated.notes || prev.notes
      }));
    } catch (e) {
      alert("الخدمة غير متوفرة حالياً");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (entries.length === 0 || !profile) return;
    setIsExporting(true);
    try {
      const { exportDailyJournalToPDF } = await loadPdfGenerator();
      const dayName = new Date(selectedDate).toLocaleDateString('ar-DZ', { weekday: 'long' });
      await exportDailyJournalToPDF(profile, selectedDate, dayName, entries);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء إعداد ملف PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const isHoliday = formData.timing?.category === 'HOLIDAY';

  return (
    <div className="space-y-6 animate-in fade-in pb-20">

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-indigo-50 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group cursor-pointer w-full md:w-auto bg-gray-50 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors rounded-2xl border border-transparent hover:border-indigo-200 dark:hover:border-slate-500">
            <div className="flex items-center gap-3 px-5 py-3">
              <CalendarIcon className="text-indigo-600 dark:text-indigo-400" size={20} />
              <span className="font-black text-gray-700 dark:text-white">{formattedDate}</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleExport}
            disabled={entries.length === 0 || isExporting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 transition-all shadow-md"
          >
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
            <span>{isExporting ? 'جاري التحضير...' : 'تصدير PDF'}</span>
          </button>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 hover:bg-emerald-700 hover:scale-[1.02] transition-all"
          >
            <Plus size={20} />
            <span>تدوين جديد</span>
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3 min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 z-10 rounded-3xl overflow-hidden flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-700 flex flex-col items-center transition-colors">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-full mb-4"><BookOpen className="text-gray-300 dark:text-slate-500" size={32} /></div>
            <p className="text-gray-400 dark:text-slate-500 font-bold mb-2">لا توجد إدخالات لهذا اليوم</p>
            <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">أضف حصتك الأولى الآن</button>
          </div>
        ) : (
          entries.map(entry => {
            const CatIcon = CATEGORIES.find(c => c.id === entry.timing.category)?.icon || BookOpen;
            return (
              <div key={entry.id} className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm flex items-start gap-4 group hover:shadow-md transition-all ${entry.timing.category === 'HOLIDAY' ? 'border-green-100 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10' : 'border-gray-100 dark:border-slate-700'}`}>

                <div className="w-24 md:w-28 text-center shrink-0 pt-1">
                  <div className={`rounded-2xl py-3 px-2 border flex flex-col items-center justify-center gap-1 ${entry.timing.category === 'HOLIDAY' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                    entry.timing.category === 'BREAK' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800' :
                      'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800'
                    }`}>
                    {entry.timing.category !== 'HOLIDAY' && entry.timing.startTime ? (
                      <>
                        <div className="text-lg font-black leading-none font-mono tracking-tight">{entry.timing.startTime}</div>
                        <div className="text-xs font-medium opacity-60 font-mono">{entry.timing.endTime}</div>
                      </>
                    ) : (
                      <CatIcon size={24} />
                    )}
                    <span className="text-[10px] font-bold mt-1 opacity-80">{entry.timing.period === 'MORNING' ? 'صبيحة' : 'أمسية'}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                      {entry.timing.category === 'HOLIDAY' ? (
                        <div>
                          <h3 className="font-black text-xl text-green-700 dark:text-green-400 flex items-center gap-2">
                            <CheckCircle2 size={20} />
                            {entry.timing.holidayName || 'عطلة بيداغوجية'}
                          </h3>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${CATEGORIES.find(c => c.id === entry.timing.category)?.color.replace('text-', 'border-').replace('bg-', 'border-opacity-20 ')}`}>
                              {CATEGORIES.find(c => c.id === entry.timing.category)?.label}
                            </span>
                            {entry.subject && (
                              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                                {entry.subject}
                              </span>
                            )}
                            {entry.sectionName && (
                              <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                                {entry.sectionName}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight mt-1 truncate">
                            {entry.title || 'بدون عنوان'}
                          </h3>

                          {entry.content && (
                            <div className="text-sm text-gray-600 dark:text-slate-400 font-medium leading-relaxed border-r-4 border-indigo-100 dark:border-indigo-900/50 pr-3 py-1 bg-gray-50/50 dark:bg-slate-700/30 rounded-l-lg mt-2 line-clamp-2">
                              {entry.content}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            {entry.objective && <span title="الهدف" className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800 flex items-center gap-1"><CheckCircle2 size={10} /> {entry.objective}</span>}
                            {entry.tools && <span title="الوسائل" className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 flex items-center gap-1"><MoreHorizontal size={10} /> {entry.tools}</span>}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0 mr-2">
                      <button onClick={() => handleEdit(entry)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-xl transition-all" title="تعديل"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(entry.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-xl transition-all" title="حذف"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 flex flex-col">

            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-20">
              <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                <Edit2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                {editingSessionId ? 'تعديل الحصة' : 'تدوين جديد'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 space-y-8">
              {/* Session Type Grid */}
              <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-600">
                <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2"><LayoutGrid size={14} /> نوع الحصة</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, timing: { ...formData.timing!, category: cat.id } })}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${formData.timing?.category === cat.id
                        ? `${cat.color} border-current bg-white dark:bg-slate-800 shadow-xl scale-110 ring-2 ring-offset-2 ring-emerald-500/20 z-10`
                        : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400 hover:scale-105 hover:shadow-md'
                        }`}
                    >
                      <cat.icon size={20} />
                      <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timing Section */}
              {!isHoliday && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">الفترة</label>
                    <div className="flex bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-600">
                      <button
                        onClick={() => handlePeriodChange('MORNING')}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${formData.timing?.period === 'MORNING' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600'}`}
                      >صبيحة (08:00 - 13:00)</button>
                      <button
                        onClick={() => handlePeriodChange('AFTERNOON')}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${formData.timing?.period === 'AFTERNOON' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600'}`}
                      >أمسية (13:00 - 17:00)</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">التوقيت (من - إلى)</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="time"
                          className="w-full bg-slate-800 text-white p-3 rounded-xl font-mono text-center font-bold tracking-widest text-lg outline-none border-2 border-slate-800 focus:border-indigo-500 transition-colors"
                          value={formData.timing?.startTime}
                          min={formData.timing?.period === 'MORNING' ? "08:00" : "13:00"}
                          max={formData.timing?.period === 'MORNING' ? "13:00" : "17:00"}
                          onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, startTime: e.target.value } })}
                        />
                      </div>
                      <span className="text-slate-300 font-black">-</span>
                      <div className="flex-1 relative">
                        <input
                          type="time"
                          className="w-full bg-slate-800 text-white p-3 rounded-xl font-mono text-center font-bold tracking-widest text-lg outline-none border-2 border-slate-800 focus:border-indigo-500 transition-colors"
                          value={formData.timing?.endTime}
                          min={formData.timing?.period === 'MORNING' ? "08:00" : "13:00"}
                          max={formData.timing?.period === 'MORNING' ? "13:00" : "17:00"}
                          onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, endTime: e.target.value } })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Content Fields based on Category */}
              {formData.timing?.category === 'BREAK' ? (
                <div className="text-center py-8 bg-orange-50 dark:bg-orange-900/20 rounded-3xl border border-orange-100 dark:border-orange-800">
                  <Clock size={48} className="mx-auto text-orange-500 mb-4" />
                  <h4 className="font-black text-orange-800 dark:text-orange-400 text-lg mb-4">مدة الاستراحة</h4>
                  <div className="flex justify-center flex-wrap gap-3">
                    {BREAK_DURATIONS.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setFormData({ ...formData, title: 'استراحة', content: d.label, activity: `${d.value} دقيقة` })}
                        className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${formData.content === d.label
                          ? 'bg-orange-500 text-white border-orange-500 shadow-lg scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-orange-200 dark:border-orange-800 hover:border-orange-400'
                          }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : formData.timing?.category === 'TRAINING' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">نوع التدريب</label>
                    <select
                      className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl font-bold text-blue-800 dark:text-blue-300 outline-none cursor-pointer"
                      value={formData.activity || ''}
                      onChange={e => setFormData({ ...formData, activity: e.target.value, title: e.target.value })}
                    >
                      <option value="">اختر نوع التدريب...</option>
                      {TRAINING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">المادة</label><input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} /></div>
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">القسم/الفوج</label><input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.sectionName} onChange={e => setFormData({ ...formData, sectionName: e.target.value })} /></div>
                  </div>
                </div>
              ) : formData.timing?.category === 'INTEGRATION' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">مدة الإدماج</label>
                    <select
                      className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl font-bold text-purple-800 dark:text-purple-300 outline-none cursor-pointer"
                      value={formData.activity || ''}
                      onChange={e => setFormData({ ...formData, activity: e.target.value, title: `إدماج - ${e.target.value}` })}
                    >
                      <option value="">اختر المدة...</option>
                      {INTEGRATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">المادة</label><input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} /></div>
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">القسم/الفوج</label><input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.sectionName} onChange={e => setFormData({ ...formData, sectionName: e.target.value })} /></div>
                  </div>
                </div>
              ) : formData.timing?.category === 'EXAM' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">نوع الاختبار</label>
                    <select
                      className="w-full p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl font-bold text-rose-800 dark:text-rose-300 outline-none cursor-pointer"
                      value={formData.activity || ''}
                      onChange={e => setFormData({ ...formData, activity: e.target.value, title: e.target.value })}
                    >
                      <option value="">اختر النوع...</option>
                      {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">المادة</label><input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} /></div>
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">القسم/الفوج</label><input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.sectionName} onChange={e => setFormData({ ...formData, sectionName: e.target.value })} /></div>
                  </div>
                </div>
              ) : isHoliday ? (
                <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-100 dark:border-green-800">
                  <CalendarDays size={48} className="mx-auto text-green-500 mb-4" />
                  <h4 className="font-black text-green-800 dark:text-green-400 text-lg mb-2">تسجيل مناسبة رسمية</h4>
                  <select
                    className="mt-4 p-3 bg-white dark:bg-slate-700 border border-green-200 dark:border-green-800 rounded-xl font-bold text-green-700 dark:text-green-400 outline-none w-64 text-center"
                    value={formData.timing?.holidayName || ''}
                    onChange={(e) => setFormData({ ...formData, timing: { ...formData.timing!, holidayName: e.target.value } })}
                  >
                    <option value="">اختر المناسبة...</option>
                    {HOLIDAYS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Subject */}
                    <div className="col-span-12 md:col-span-4">
                      <label className="block text-xs font-bold text-slate-400 mb-1">المادة</label>
                      <input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
                        value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                    </div>

                    {/* Activity */}
                    <div className="col-span-12 md:col-span-4">
                      <label className="block text-xs font-bold text-slate-400 mb-1">النشاط</label>
                      <input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
                        value={formData.activity} onChange={e => setFormData({ ...formData, activity: e.target.value })} />
                    </div>

                    {/* Session Number */}
                    <div className="col-span-12 md:col-span-4">
                      <label className="block text-xs font-bold text-slate-400 mb-1">رقم الحصة</label>
                      <select
                        className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                        value={formData.sessionNumber}
                        onChange={e => setFormData({ ...formData, sessionNumber: parseInt(e.target.value) || 0 })}
                      >
                        {SECTION_NUMBERS.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    {/* Section */}
                    <div className="col-span-4 md:col-span-3">
                      <label className="block text-xs font-bold text-slate-400 mb-1">رقم المقطع</label>
                      <input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
                        value={formData.sectionId} onChange={e => setFormData({ ...formData, sectionId: e.target.value })} />
                    </div>
                    <div className="col-span-8 md:col-span-9">
                      <label className="block text-xs font-bold text-slate-400 mb-1">اسم المقطع</label>
                      <input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
                        value={formData.sectionName} onChange={e => setFormData({ ...formData, sectionName: e.target.value })} />
                    </div>

                    {/* Title */}
                    <div className="col-span-12">
                      <label className="block text-xs font-bold text-slate-400 mb-1">عنوان الحصة</label>
                      <input type="text" className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={handleMagicGenerate} disabled={!formData.subject || !formData.title || isGenerating} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2 text-xs font-black disabled:opacity-50">
                      {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                      <span>توليد تلقائي</span>
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-xs font-bold text-slate-400">المحتوى</label>
                      <button onClick={generatePedagogicalObservation} className="text-[10px] text-indigo-600 hover:underline font-bold flex items-center gap-1">
                        <Sparkles size={10} /> ملاحظة بيداغوجية
                      </button>
                    </div>
                    <textarea rows={4} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl font-medium text-sm text-gray-900 dark:text-white outline-none resize-none"
                      value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">ملاحظات إضافية</label>
                    <textarea rows={2} className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl font-medium text-sm text-gray-900 dark:text-white outline-none resize-none"
                      value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">الهدف</label><input type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.objective} onChange={e => setFormData({ ...formData, objective: e.target.value })} /></div>
                    <div><label className="block text-xs font-bold text-slate-400 mb-1">الوسائل</label><input type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-gray-900 dark:text-white outline-none" value={formData.tools} onChange={e => setFormData({ ...formData, tools: e.target.value })} /></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-800 z-20">
              <button onClick={handleCloseModal} className="px-6 py-3 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">إلغاء</button>
              <button onClick={handleSave} className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 flex items-center gap-2">
                <Save size={18} /> <span>{editingSessionId ? 'تحديث' : 'حفظ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
