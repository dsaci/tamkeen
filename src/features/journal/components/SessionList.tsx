
import React from 'react';
import { Session } from '../../../types';
import { useTheme } from '../../../utils/theme';
import { cn } from '../../../lib/utils';
import { BookOpen, Clock, Trash2, Edit2, Layers, Zap, GraduationCap, Briefcase, CalendarDays } from 'lucide-react';

interface SessionListProps {
    entries: Session[];
    onEdit: (session: Session) => void;
    onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
    LESSON: BookOpen,
    BREAK: Clock,
    EXAM: GraduationCap,
    SUPPORT: Zap,
    TRAINING: Briefcase,
    INTEGRATION: Layers,
    HOLIDAY: CalendarDays
};

export const SessionList: React.FC<SessionListProps> = ({ entries, onEdit, onDelete }) => {
    const { theme } = useTheme();

    if (entries.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400 font-bold">لا توجد إدخالات مسجلة لهذا اليوم وفق المنهاج</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {entries.sort((a, b) => (a.timing.startTime || '').localeCompare(b.timing.startTime || '')).map(entry => {
                const Icon = CATEGORY_ICONS[entry.timing.category] || BookOpen;
                return (
                    <div key={entry.id} className={cn(
                        "p-6 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 group hover:shadow-xl transition-all relative overflow-hidden",
                        theme === 'v3' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100"
                    )}>
                        <div className="w-full md:w-24 text-center shrink-0">
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-300 rounded-[2rem] py-4 px-2 border border-emerald-100 dark:border-emerald-800 shadow-inner">
                                <div className="text-xl font-black">{entry.timing.startTime}</div>
                                <div className="w-full h-px bg-emerald-200 dark:bg-emerald-800 my-2 opacity-30"></div>
                                <div className="text-sm font-bold opacity-60">{entry.timing.endTime}</div>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-right">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5",
                                    entry.timing.category === 'LESSON' ? "bg-indigo-100 text-indigo-700" :
                                        entry.timing.category === 'BREAK' ? "bg-orange-100 text-orange-700" :
                                            "bg-emerald-100 text-emerald-700"
                                )}>
                                    <Icon size={12} />
                                    {entry.timing.category === 'LESSON' ? 'حصة عادية' :
                                        entry.timing.category === 'BREAK' ? `استراحة (${entry.timing.breakDuration}د)` :
                                            entry.timing.category === 'EXAM' ? 'تقييم / فرض' : entry.timing.category}
                                </span>
                                {entry.subject && (
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-[10px] font-black text-slate-600 dark:text-slate-300">
                                        {entry.subject}
                                    </span>
                                )}
                                {entry.activity && (
                                    <span className="px-3 py-1 border border-emerald-200 dark:border-emerald-800 text-emerald-600 rounded-full text-[10px] font-black italic">
                                        {entry.activity}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-black text-xl mb-2">{entry.title || 'بدون عنوان'}</h3>

                            {(entry.sectionName || entry.unityNumber) && (
                                <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                                    {entry.sectionNumber && (
                                        <span className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-lg border border-purple-100 dark:border-purple-800 font-bold">
                                            المقطع {entry.sectionNumber}: {entry.sectionName}
                                        </span>
                                    )}
                                    {entry.unityNumber && (
                                        <span className="text-[10px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-800 font-bold">
                                            الوحدة {entry.unityNumber}
                                        </span>
                                    )}
                                </div>
                            )}

                            <p className="text-sm opacity-60 line-clamp-2 leading-relaxed">{entry.content}</p>

                            {entry.objective && (
                                <div className="mt-4 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">الهدف التعلمي</p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{entry.objective}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 left-6">
                            <button
                                onClick={() => onEdit(entry)}
                                className="p-3 bg-white dark:bg-slate-700 shadow-xl rounded-2xl text-slate-600 hover:text-indigo-600 transition-all active:scale-95 border border-slate-100 dark:border-slate-600"
                                title="تعديل الحصة"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={() => onDelete(entry.id)}
                                className="p-3 bg-white dark:bg-slate-700 shadow-xl rounded-2xl text-slate-600 hover:text-rose-600 transition-all active:scale-95 border border-slate-100 dark:border-slate-600"
                                title="حذف"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
