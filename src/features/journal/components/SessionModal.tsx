
import React, { useState, useEffect } from 'react';
import {
    Session,
    SessionCategory,
    ExamType,
    SupportType,
    TrainingType,
    IntegrationType,
    DayPeriod
} from '../../../types';
import { useTheme, themeStyles } from '../../../utils/theme';
import { useJournalStore } from '../store/journalStore';
import {
    BookOpen, Clock, GraduationCap, Zap, Briefcase, Layers, CalendarDays,
    X, Save, Loader2, Sparkles, AlertCircle, Info
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { curriculumRepository } from '../../../services/CurriculumRepository';

const CATEGORIES: { id: SessionCategory; label: string; icon: any; color: string; activeColor: string }[] = [
    { id: 'LESSON', label: 'حصة عادية', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600', activeColor: 'bg-indigo-600 text-white' },
    { id: 'BREAK', label: 'استراحة', icon: Clock, color: 'bg-orange-50 text-orange-600', activeColor: 'bg-orange-600 text-white' },
    { id: 'EXAM', label: 'اختبار / فرض', icon: GraduationCap, color: 'bg-rose-50 text-rose-600', activeColor: 'bg-rose-600 text-white' },
    { id: 'SUPPORT', label: 'معالجة', icon: Zap, color: 'bg-emerald-50 text-emerald-600', activeColor: 'bg-emerald-600 text-white' },
    { id: 'TRAINING', label: 'تدريبات', icon: Briefcase, color: 'bg-blue-50 text-blue-600', activeColor: 'bg-blue-600 text-white' },
    { id: 'INTEGRATION', label: 'إدماج', icon: Layers, color: 'bg-purple-50 text-purple-600', activeColor: 'bg-purple-600 text-white' },
    { id: 'HOLIDAY', label: 'عطلة', icon: CalendarDays, color: 'bg-green-50 text-green-600', activeColor: 'bg-green-600 text-white' },
];

const EXAM_TYPES: { id: ExamType; label: string }[] = [
    { id: 'TERM_EXAM', label: 'اختبار فصلي' },
    { id: 'QUIZ', label: 'فرض محروس' },
    { id: 'PEDAGOGICAL', label: 'تقويم بيداغوجي' },
    { id: 'DIAGNOSTIC', label: 'تقويم تشخيصي' },
    { id: 'MAKTASABAT', label: 'تقييم المكتسبات' },
];

const SUPPORT_TYPES: { id: SupportType; label: string }[] = [
    { id: 'IMMEDIATE', label: 'معالجة آنية' },
    { id: 'PEDAGOGICAL', label: 'معالجة بيداغوجية' },
];

const TRAINING_TYPES: { id: TrainingType; label: string }[] = [
    { id: 'EXERCISES', label: 'تمارين' },
    { id: 'CLASSWORK', label: 'تمارين كراس القسم' },
    { id: 'REVIEW', label: 'مراجعة عامة' },
    { id: 'OFFICIAL_EXAM', label: 'تحضير للامتحانات الرسمية' },
    { id: 'WORKBOOK', label: 'تمارين دفتر الأنشطة' },
];

const INTEGRATION_TYPES: { id: IntegrationType; label: string }[] = [
    { id: 'FULL_WEEK', label: 'إدماج أسبوع كامل' },
    { id: 'HALF_WEEK', label: 'نصف أسبوع' },
];

const UNITY_NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);

interface SessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (session: Session) => Promise<void>;
    initialData?: Session | null;
}

export const SessionModal: React.FC<SessionModalProps> = ({
    isOpen, onClose, onSave, initialData
}) => {
    const { theme } = useTheme();
    const styles = themeStyles[theme];
    const { selectedDate, selectedClass } = useJournalStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<Partial<Session>>({
        subject: '',
        title: '',
        activity: '',
        content: '',
        sectionNumber: 1,
        sectionName: '',
        unityNumber: 1,
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

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData(prev => ({
                    ...prev,
                    timing: {
                        ...prev.timing!,
                        date: selectedDate,
                    }
                }));
            }
        }
    }, [isOpen, initialData, selectedDate]);

    // Auto-fetch suggestions when subject or activity changes
    useEffect(() => {
        if (formData.subject && formData.activity) {
            curriculumRepository.getSuggestions(formData.subject, formData.activity, 'PRIMARY')
                .then(data => {
                    if (data.tools.length > 0 && !formData.tools) {
                        setFormData(prev => ({ ...prev, tools: data.tools.join('، ') }));
                    }
                });
        }
    }, [formData.subject, formData.activity]);

    // Auto-fetch holiday when date changes or category becomes holiday
    useEffect(() => {
        if (formData.timing?.category === 'HOLIDAY' && formData.timing?.date) {
            const holiday = curriculumRepository.getHolidayForDate(formData.timing.date);
            if (holiday && !formData.timing.holidayName) {
                setFormData(prev => ({
                    ...prev,
                    timing: { ...prev.timing!, holidayName: holiday }
                }));
            }
        }
    }, [formData.timing?.category, formData.timing?.date]);

    const handleNumericInput = (field: keyof Session, value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, ''));
        if (!isNaN(numValue)) {
            setFormData({ ...formData, [field]: numValue });
        } else if (value === '') {
            setFormData({ ...formData, [field]: undefined });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        const cat = formData.timing?.category;

        if (cat === 'LESSON') {
            if (!formData.timing?.period) newErrors.period = 'يجب اختيار صبيحة أو أمسية';
            if (!formData.sectionNumber) newErrors.sectionNumber = 'رقم المقطع مطلوب';
            if (!formData.sectionName) newErrors.sectionName = 'اسم المقطع مطلوب';
            if (!formData.unityNumber) newErrors.unityNumber = 'رقم الوحدة مطلوب';
        }

        if (cat === 'BREAK') {
            const duration = formData.timing?.breakDuration || 0;
            if (duration < 5 || duration > 20) {
                newErrors.breakDuration = 'المدة يجب أن تكون بين 5 و 20 دقيقة';
            }
        }

        if (['EXAM', 'SUPPORT', 'TRAINING', 'INTEGRATION'].includes(cat!)) {
            if (!formData.timing?.date) newErrors.date = 'اليوم إلزامي';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const sessionToSave: Session = {
                id: initialData?.id || uuidv4(),
                ...formData as Session,
                timing: {
                    ...formData.timing!,
                    date: formData.timing?.date || selectedDate
                }
            };
            console.log("[Modal] Attempting to save session:", sessionToSave);
            await onSave(sessionToSave);
            onClose();
        } catch (error: any) {
            console.error("[Modal] Save error:", error);
            // We use console warning but avoid jarring alerts now that the columns are fixed
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const currentCat = CATEGORIES.find(c => c.id === formData.timing?.category) || CATEGORIES[0];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in" dir="rtl">
            <div className={cn(
                "w-full max-w-4xl rounded-[3rem] shadow-2xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800",
                theme === 'v3' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
            )}>
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className={cn("p-4 rounded-3xl shadow-lg", currentCat.activeColor)}>
                            <currentCat.icon size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">{initialData ? 'تعديل السجل' : 'إضافة تدوين رسمي'}</h3>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">سجل الكراس اليومي - المنهاج الجزائري</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* 1. Category Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFormData({ ...formData, timing: { ...formData.timing!, category: cat.id } })}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 p-4 rounded-[2rem] border-2 transition-all group",
                                    formData.timing?.category === cat.id
                                        ? `${cat.activeColor} border-transparent shadow-xl scale-105`
                                        : `${cat.color} border-transparent hover:border-current/20`
                                )}
                            >
                                <cat.icon size={22} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase whitespace-nowrap">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* 2. Content Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* LEFT CARD: Timing & Logistics */}
                        <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-800/30">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                                    <Clock size={18} />
                                    <h4 className="font-black text-sm uppercase tracking-wider">التوقيت والجدولة</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">اليوم</label>
                                        <input
                                            type="date"
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                            value={formData.timing?.date}
                                            onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, date: e.target.value } })}
                                        />
                                        {errors.date && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.date}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">من</label>
                                            <input
                                                type="time"
                                                className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                                value={formData.timing?.startTime}
                                                onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, startTime: e.target.value } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">إلى</label>
                                            <input
                                                type="time"
                                                className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                                value={formData.timing?.endTime}
                                                onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, endTime: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {formData.timing?.category === 'LESSON' && (
                                    <div className="flex gap-4 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                        {(['MORNING', 'AFTERNOON'] as DayPeriod[]).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setFormData({ ...formData, timing: { ...formData.timing!, period: p } })}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                                                    formData.timing?.period === p
                                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                        : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                )}
                                            >
                                                {p === 'MORNING' ? 'صبيحة' : 'أمسية'}
                                            </button>
                                        ))}
                                        {errors.period && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.period}</p>}
                                    </div>
                                )}

                                {formData.timing?.category === 'BREAK' && (
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">مدة الاستراحة (دقيقة)</label>
                                        <input
                                            type="number"
                                            min={5}
                                            max={20}
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 shadow-inner", styles.input)}
                                            value={formData.timing?.breakDuration || ''}
                                            onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, breakDuration: parseInt(e.target.value) } })}
                                            placeholder="5 - 20"
                                        />
                                        {errors.breakDuration && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.breakDuration}</p>}
                                    </div>
                                )}

                                {formData.timing?.category === 'EXAM' && (
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">نوع التقييم</label>
                                        <select
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 shadow-inner", styles.input)}
                                            value={formData.timing?.examType}
                                            onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, examType: e.target.value as ExamType } })}
                                        >
                                            <option value="">-- اختر النوع --</option>
                                            {EXAM_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                        </select>
                                    </div>
                                )}

                                {formData.timing?.category === 'SUPPORT' && (
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">نوع المعالجة</label>
                                        <div className="flex gap-2">
                                            {SUPPORT_TYPES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setFormData({ ...formData, timing: { ...formData.timing!, supportType: t.id } })}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-xl font-bold text-[11px] border transition-all",
                                                        formData.timing?.supportType === t.id
                                                            ? "bg-emerald-600 border-emerald-600 text-white"
                                                            : "border-slate-200 text-slate-600 hover:bg-emerald-50"
                                                    )}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.timing?.category === 'TRAINING' && (
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">نوع التدريب</label>
                                        <select
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 shadow-inner", styles.input)}
                                            value={formData.timing?.trainingType}
                                            onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, trainingType: e.target.value as TrainingType } })}
                                        >
                                            {TRAINING_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                        </select>
                                    </div>
                                )}

                                {formData.timing?.category === 'INTEGRATION' && (
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">فترة الإدماج</label>
                                        <select
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 shadow-inner", styles.input)}
                                            value={formData.timing?.integrationType}
                                            onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, integrationType: e.target.value as IntegrationType } })}
                                        >
                                            {INTEGRATION_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                        </select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* RIGHT CARD: Pedagogical Details */}
                        <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-800/30">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                                    <BookOpen size={18} />
                                    <h4 className="font-black text-sm uppercase tracking-wider">تفاصيل الحصة والمنهاج</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">المادة</label>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="مثال: لغة عربية"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">اسم الحصة / العنوان</label>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="مثال: الجملة الاسمية"
                                        />
                                    </div>
                                </div>

                                {formData.timing?.category === 'LESSON' && (
                                    <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
                                        <div>
                                            <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">رقم المقطع</label>
                                            <input
                                                type="text"
                                                className={cn("w-full p-3 rounded-xl border-none bg-emerald-50/30 dark:bg-emerald-900/10 focus:ring-1 focus:ring-emerald-500", styles.input)}
                                                value={formData.sectionNumber || ''}
                                                onChange={e => handleNumericInput('sectionNumber', e.target.value)}
                                                placeholder="رقم فقط"
                                            />
                                            {errors.sectionNumber && <p className="text-rose-500 text-[9px] mt-1 font-bold">{errors.sectionNumber}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">اسم المقطع</label>
                                            <input
                                                className={cn("w-full p-3 rounded-xl border-none bg-emerald-50/30 dark:bg-emerald-900/10 focus:ring-1 focus:ring-emerald-500", styles.input)}
                                                value={formData.sectionName}
                                                onChange={e => setFormData({ ...formData, sectionName: e.target.value })}
                                                placeholder="اسم المقطع"
                                            />
                                            {errors.sectionName && <p className="text-rose-500 text-[9px] mt-1 font-bold">{errors.sectionName}</p>}
                                        </div>
                                        <div className="col-span-2 mt-2">
                                            <label className="text-[10px] font-black text-amber-600 uppercase mb-2 block">رقم الوحدة</label>
                                            <select
                                                className={cn("w-full p-3 rounded-xl border-none bg-amber-50/30 dark:bg-amber-900/10 focus:ring-1 focus:ring-amber-500", styles.input)}
                                                value={formData.unityNumber || ''}
                                                onChange={e => setFormData({ ...formData, unityNumber: parseInt(e.target.value) })}
                                            >
                                                {UNITY_NUMBERS.map(n => <option key={n} value={n}>الوحدة {n}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. Full Width Content Card */}
                    <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-800/30">
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">النشاط</label>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                            value={formData.activity}
                                            onChange={e => setFormData({ ...formData, activity: e.target.value })}
                                            placeholder="قراءة، تعبير، هندسة..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">الهدف التعلمي / مؤشر الكفاءة</label>
                                        <textarea
                                            rows={2}
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner resize-none", styles.input)}
                                            value={formData.objective}
                                            onChange={e => setFormData({ ...formData, objective: e.target.value })}
                                            placeholder="تحديد الهدف من الحصة..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase block">الوسائل البيداغوجية</label>
                                            <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-black">مقترح تلقائي</span>
                                        </div>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-inner", styles.input)}
                                            value={formData.tools}
                                            onChange={e => setFormData({ ...formData, tools: e.target.value })}
                                            placeholder="السبورة، الكتاب، جهاز العرض..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">الملاحظة البيداغوجية</label>
                                        <textarea
                                            rows={2}
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-inner resize-none", styles.input)}
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="سير الحصة، تفاعل التلاميذ..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">سير الحصة والمحتوى التربوي</label>
                                <textarea
                                    rows={5}
                                    className={cn("w-full p-6 rounded-[2.5rem] border-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner leading-relaxed", styles.input)}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="اكتب هنا بالتفصيل مراحل الحصة وما تم تقديمه للتلاميذ..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Holiday Info Section (Conditional) */}
                    {formData.timing?.category === 'HOLIDAY' && (
                        <div className="p-8 bg-green-50 dark:bg-green-900/20 rounded-[3rem] border border-green-200 dark:border-green-800 animate-in slide-in-from-bottom-5">
                            <div className="flex items-center gap-4 mb-4">
                                <CalendarDays className="text-green-600" size={32} />
                                <div>
                                    <h4 className="font-black text-green-900 dark:text-green-400">مناسبة وطنية / عطلة رسمية</h4>
                                    <p className="text-xs text-green-700 opacity-70">يتم جلب المناسبات الجزائرية تلقائياً من المستودع الرسمي</p>
                                </div>
                            </div>
                            <input
                                className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-green-500 shadow-inner text-xl font-black text-center text-green-800", styles.input)}
                                value={formData.timing.holidayName}
                                onChange={e => setFormData({ ...formData, timing: { ...formData.timing!, holidayName: e.target.value } })}
                                placeholder="ادخل اسم المناسبة هنا..."
                            />
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Info size={16} />
                        <span className="text-[10px] font-bold">يتم الحفظ آلياً في قاعدة البيانات السحابية والمحلية</span>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="bg-white dark:bg-slate-800 px-8 rounded-2xl font-black"
                        >
                            إلغاء التعديل
                        </Button>
                        <Button
                            onClick={handleSave}
                            isLoading={isSubmitting}
                            className={cn("px-12 rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-lg", currentCat.activeColor)}
                            leftIcon={<Save size={22} />}
                        >
                            حفظ وتدوين
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
