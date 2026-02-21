import React, { useState } from 'react';
import { useTheme } from '../../../utils/theme';
import { useAuth } from '../../../contexts/AuthContext';
import { JournalHeader } from '../components/JournalHeader';
import { SessionList } from '../components/SessionList';
import { SessionModal } from '../components/SessionModal';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useJournalStore } from '../store/journalStore';
import { Button } from '../../../components/ui/Button';
import { Plus, Loader2, FileText } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Session } from '../../../types';

export const JournalPage = () => {
    const { theme } = useTheme();
    const { user, profile } = useAuth();
    const { entries, isLoading, addSession, updateSession, deleteSession } = useJournalEntries();
    const { selectedClass } = useJournalStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleEdit = (session: Session) => {
        setEditingSession(session);
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

    const handleAddNew = () => {
        if (!selectedClass) {
            alert("يرجى تحديد القسم أولاً من الشريط العلوي.");
            return;
        }
        setEditingSession(null);
        setIsModalOpen(true);
    };

    return (
        <div className={cn(
            "min-h-screen p-4 md:p-8 transition-colors duration-500",
            theme === 'v3' ? "bg-slate-900" : "bg-slate-50"
        )} dir="rtl">
            <div className="max-w-4xl mx-auto space-y-6">

                <JournalHeader />

                <div className="flex justify-between items-center">
                    <h2 className={cn("text-2xl font-black", theme === 'v3' ? "text-white" : "text-slate-800")}>يومياتي</h2>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleExport}
                            disabled={entries.length === 0 || isExporting}
                            variant="secondary"
                            leftIcon={isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                        >
                            {isExporting ? 'جاري التحضير...' : 'تصدير PDF'}
                        </Button>
                        <Button
                            onClick={handleAddNew}
                            disabled={!selectedClass} // Disable if no context
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

                <SessionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    initialData={editingSession}
                    lastSession={entries.filter(e => e.timing.category === 'LESSON').sort((a, b) => (b.sessionNumber || 0) - (a.sessionNumber || 0))[0]}
                />
            </div>
        </div>
    );
};
