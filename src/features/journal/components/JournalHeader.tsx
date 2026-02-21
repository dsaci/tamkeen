import React from 'react';
import { useJournalStore } from '../store/journalStore';
import { EDUCATION_LEVELS, GRADES, GROUPS, generateClasses } from '../utils/educationData';
import { useTheme, themeStyles } from '../../../utils/theme';
import { cn } from '../../../lib/utils';
import { Calendar as CalendarIcon, Filter, Layers, Users } from 'lucide-react';

export const JournalHeader = () => {
    const { theme } = useTheme();
    const styles = themeStyles[theme];

    const {
        selectedDate, setSelectedDate,
        selectedLevel, setSelectedLevel,
        selectedGrade, setSelectedGrade,
        selectedClass, setSelectedClass,
    } = useJournalStore();

    const currentGrades = selectedLevel ? GRADES[selectedLevel as keyof typeof GRADES] : [];
    const currentClasses = selectedGrade ? generateClasses(selectedGrade) : [];

    // Helper for formatting date
    const formattedDate = new Date(selectedDate).toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className={cn(
            "p-5 rounded-3xl border shadow-sm transition-colors mb-6",
            theme === 'v3' ? "bg-slate-800 border-slate-700" : "bg-white border-indigo-50"
        )}>
            {/* Top Row: Date & Global Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative group cursor-pointer w-full md:w-auto">
                    <div className={cn(
                        "flex items-center gap-3 px-5 py-3 rounded-2xl border transition-colors",
                        theme === 'v3' ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-gray-50 hover:bg-indigo-50 border-transparent hover:border-indigo-200"
                    )}>
                        <CalendarIcon className={theme === 'v3' ? "text-indigo-400" : "text-indigo-600"} size={20} />
                        <span className={cn("font-black", theme === 'v3' ? "text-white" : "text-gray-700")}>{formattedDate}</span>
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>
            </div>

            {/* Selection Row: Level -> Grade -> Class -> Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

                {/* Level */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 block px-1">الطور</label>
                    <select
                        value={selectedLevel || ''}
                        onChange={(e) => setSelectedLevel(e.target.value || null)}
                        className={cn(
                            "w-full p-3 rounded-xl font-bold outline-none cursor-pointer transition-colors border",
                            styles.input
                        )}
                    >
                        <option value="">اختر الطور...</option>
                        {EDUCATION_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>
                </div>

                {/* Grade */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 block px-1">المستوى</label>
                    <select
                        value={selectedGrade || ''}
                        onChange={(e) => setSelectedGrade(e.target.value || null)}
                        disabled={!selectedLevel}
                        className={cn(
                            "w-full p-3 rounded-xl font-bold outline-none cursor-pointer transition-colors border",
                            styles.input,
                            !selectedLevel && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <option value="">اختر السنة...</option>
                        {currentGrades.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                    </select>
                </div>

                {/* Class */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 block px-1">القسم</label>
                    <select
                        value={selectedClass || ''}
                        onChange={(e) => setSelectedClass(e.target.value || null)}
                        disabled={!selectedGrade}
                        className={cn(
                            "w-full p-3 rounded-xl font-bold outline-none cursor-pointer transition-colors border",
                            styles.input,
                            !selectedGrade && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <option value="">اختر القسم...</option>
                        {currentClasses.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                </div>

            </div>

            {/* Validation Message */}
            {!selectedClass && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-amber-100">
                    <Filter size={16} />
                    <span>يجب تحديد القسم لتتمكن من تدوين الملاحظات وحفظها.</span>
                </div>
            )}
        </div>
    );
};
