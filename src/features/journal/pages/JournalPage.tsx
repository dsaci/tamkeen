import React, { useState } from 'react';
import { useTheme } from '../../../utils/theme';
import { useAuth } from '../../../contexts/AuthContext';
import { JournalHeader } from '../components/JournalHeader';
import { SessionList } from '../components/SessionList';
import { SessionModal } from '../components/SessionModal';
import { WeeklyJournalView } from '../components/WeeklyJournalView';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useJournalStore } from '../store/journalStore';
import { Button } from '../../../components/ui/Button';
import {
    Plus, Loader2, FileText, CalendarDays, Calendar,
    Sparkles, LayoutGrid, Layers, CheckCircle2
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Session } from '../../../types';

export const JournalPage = () => {
    const { theme } = useTheme();
    const { user, profile } = useAuth();
    const { entries, isLoading, addSession, updateSession, deleteSession, refresh } = useJournalEntries();
    const { selectedClass } = useJournalStore();

    // Mode Selector: Weekly vs Daily (persisted in localStorage)
    const [viewMode, setViewMode] = useState<'weekly' | 'daily'>(() => {
        return (localStorage.getItem('tamkeen_journal_view_mode') as 'weekly' | 'daily') || 'weekly';
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [targetDateForNewSession, setTargetDateForNewSession] = useState<string | null>(null);

    const handleSwitchMode = (mode: 'weekly' | 'daily') => {
        setViewMode(mode);
        localStorage.setItem('tamkeen_journal_view_mode', mode);
    };

    const handleEdit = (session: Session) => {
        setEditingSession(session);
        setTargetDateForNewSession(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("هل أنت متأكد من حذف هذه الحصة؟")) {
            await deleteSession(id);
        }
    };

    const handleSave = async (session: Session) => {
        if (editingSession) {
            await updateSession(session);
        } else {
            await addSession(session);
        }
        await refresh();
    };

    const handleExport = async () => {
        if (entries.length === 0 || !profile) return;
        setIsExporting(true);
        try {
            const { exportDailyJournalToPDF } = await import('../../../lib/utils/pdfGenerator');
            const dayName = new Date(useJournalStore.getState().selectedDate).toLocaleDateString('ar-DZ', { weekday: 'long' });
            await exportDailyJournalToPDF(profile, useJournalStore.getState().selectedDate, dayName, entries);
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء إعداد ملف PDF.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleAddNewDaily = () => {
        if (!selectedClass) {
            alert("يرجى تحديد القسم أولاً من الشريط العلوي.");
            return;
        }
        setEditingSession(null);
        setTargetDateForNewSession(null);
        setIsModalOpen(true);
    };

    // Triggered by Weekly View when clicking "+ حصة جديدة" on a specific day
    const handleWeeklyAddNew = (dateStr: string) => {
        setEditingSession(null);
        setTargetDateForNewSession(dateStr);
        setIsModalOpen(true);
    };

    return (
        <div className={cn(
            "min-h-screen p-4 md:p-8 transition-colors duration-500",
            theme === 'v3' ? "bg-slate-900" : "bg-slate-50"
        )} dir="rtl">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Mode Switcher Navigation Bar (Weekly vs Daily) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs font-black text-slate-400 px-2 whitespace-nowrap">نمط العرض:</span>
                        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl w-full sm:w-auto">
                            {/* Weekly Mode Button */}
                            <button
                                type="button"
                                onClick={() => handleSwitchMode('weekly')}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all",
                                    viewMode === 'weekly'
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-100"
                                        : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white"
                                )}
                            >
                                <CalendarDays size={16} />
                                <span>الاستظهار الأسبوعي الشامل (المولد)</span>
                                <span className="bg-amber-400 text-indigo-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                                    جديد ⚡
                                </span>
                            </button>

                            {/* Daily Mode Button */}
                            <button
                                type="button"
                                onClick={() => handleSwitchMode('daily')}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all",
                                    viewMode === 'daily'
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-100"
                                        : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white"
                                )}
                            >
                                <Calendar size={16} />
                                <span>العرض اليومي الكلاسيكي (حصة بحصة)</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 font-bold hidden md:block">
                        {viewMode === 'weekly' 
                            ? 'عرض أسبوعي من الأحد إلى الخميس مولد وفق جدولك الزمني'
                            : 'تدوين وتسجيل حصة بحصة وفق التاريخ والقسم'}
                    </div>
                </div>

                {/* 1. WEEKLY MODE (NEW) */}
                {viewMode === 'weekly' && profile && (
                    <WeeklyJournalView
                        profile={profile}
                        onEditSession={handleEdit}
                        onAddNewSession={handleWeeklyAddNew}
                    />
                )}

                {/* 2. DAILY MODE (CLASSIC) */}
                {viewMode === 'daily' && (
                    <div className="space-y-6 animate-in fade-in">
                        <JournalHeader />

                        <div className="flex justify-between items-center">
                            <h2 className={cn("text-2xl font-black", theme === 'v3' ? "text-white" : "text-slate-800")}>يومياتي (حصة بحصة)</h2>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleExport}
                                    disabled={entries.length === 0 || isExporting}
                                    variant="secondary"
                                    leftIcon={isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                                >
                                    {isExporting ? 'جاري التحضير...' : 'تصدير PDF لليوم'}
                                </Button>
                                <Button
                                    onClick={handleAddNewDaily}
                                    disabled={!selectedClass}
                                    leftIcon={<Plus size={18} />}
                                    className={!selectedClass ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                    تدوين جديد
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
                        ) : (
                            <SessionList
                                entries={entries}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                )}

                {/* Modal for adding/editing a session (shared by both modes) */}
                <SessionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingSession(null);
                        setTargetDateForNewSession(null);
                    }}
                    onSave={handleSave}
                    initialData={editingSession || (targetDateForNewSession ? {
                        timing: {
                            date: targetDateForNewSession,
                            category: 'LESSON',
                            period: 'MORNING',
                            startTime: '08:00',
                            endTime: '09:00'
                        }
                    } as Session : null)}
                    lastSession={entries.filter(e => e.timing.category === 'LESSON').sort((a, b) => (b.sessionNumber || 0) - (a.sessionNumber || 0))[0]}
                />
            </div>
        </div>
    );
};
