import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Session,
    SessionCategory,
    ExamType,
    SupportType,
    TrainingType,
    IntegrationType,
    DayPeriod,
    Resource
} from '../../../types';
import { useTheme, themeStyles } from '../../../utils/theme';
import { useJournalStore } from '../store/journalStore';
import {
    BookOpen, Clock, GraduationCap, Zap, Briefcase, Layers, CalendarDays,
    X, Save, Loader2, Sparkles, AlertCircle, Info, Database, ChevronDown,
    CheckCircle2, Search, Filter, Wand2, FileText, BookMarked, ArrowRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { curriculumRepository } from '../../../services/CurriculumRepository';
import { listResources } from '../../../services/resourceBankService';
import {
    getSmartCurriculumSuggestions,
    searchCurriculumLessons,
    getAlgerianMonthFromDate,
    CurriculumSuggestionItem
} from '../../../services/JournalCurriculumService';

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
    const { selectedDate, selectedClass, selectedLevel, selectedGrade } = useJournalStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [resourceSuggestions, setResourceSuggestions] = useState<Resource[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Curriculum Suggestions & Explorer State
    const [curriculumSuggestions, setCurriculumSuggestions] = useState<CurriculumSuggestionItem[]>([]);
    const [isCurriculumExplorerOpen, setIsCurriculumExplorerOpen] = useState(false);
    const [curriculumSearchQuery, setCurriculumSearchQuery] = useState('');
    const [curriculumGradeFilter, setCurriculumGradeFilter] = useState<'ALL' | '1AS' | '2AS' | '3AS' | 'MIDDLE' | 'PRIMARY'>('ALL');
    const [curriculumActivityFilter, setCurriculumActivityFilter] = useState<'ALL' | 'texts' | 'grammar' | 'rhetoric' | 'reading' | 'writing'>('ALL');
    const [justAutoFilled, setJustAutoFilled] = useState(false);
    const [autoFilledTitle, setAutoFilledTitle] = useState('');

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

    // Load curriculum suggestions whenever modal opens or date/grade changes
    useEffect(() => {
        if (isOpen) {
            const suggestions = getSmartCurriculumSuggestions({
                level: selectedLevel,
                grade: selectedGrade,
                dateStr: formData.timing?.date || selectedDate,
                subject: formData.subject || 'اللغة العربية'
            });
            setCurriculumSuggestions(suggestions);
        }
    }, [isOpen, selectedLevel, selectedGrade, formData.timing?.date, selectedDate, formData.subject]);

    // Auto-fetch suggestions when subject or activity changes
    useEffect(() => {
        if (formData.subject && formData.activity) {
            curriculumRepository.getSuggestions(formData.subject, formData.activity, selectedLevel || 'SECONDARY')
                .then(data => {
                    if (data.tools.length > 0 && !formData.tools) {
                        setFormData(prev => ({ ...prev, tools: data.tools.join('، ') }));
                    }
                });
        }
    }, [formData.subject, formData.activity, selectedLevel]);

    // Auto-search resource bank when subject/activity/title changes
    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (formData.subject || formData.activity || formData.title) {
                setIsSearching(true);
                try {
                    const results = await listResources({
                        subject: formData.subject || undefined,
                        activity: formData.activity || undefined,
                        search: formData.title || undefined,
                    });
                    setResourceSuggestions(results.slice(0, 5));
                    if (results.length > 0) setShowSuggestions(true);
                } catch (err) {
                    console.warn('[SessionModal] Resource search error:', err);
                }
                setIsSearching(false);
            } else {
                setResourceSuggestions([]);
            }
        }, 500); // debounce
        return () => clearTimeout(searchTimeout);
    }, [formData.subject, formData.activity, formData.title]);

    const applyResourceSuggestion = useCallback((resource: Resource) => {
        setFormData(prev => ({
            ...prev,
            title: resource.title || prev.title,
            activity: resource.activity || prev.activity,
            subject: resource.subject || prev.subject,
            objective: resource.objective || prev.objective,
            content: resource.content || prev.content,
            tools: resource.tools || prev.tools,
        }));
        setShowSuggestions(false);
    }, []);

    // 1-Click Instant Auto-Fill from Official Curriculum
    const applyCurriculumSuggestion = useCallback((item: CurriculumSuggestionItem) => {
        setFormData(prev => ({
            ...prev,
            subject: item.subject || prev.subject || 'اللغة العربية وآدابها',
            activity: item.activity || prev.activity,
            title: item.title || prev.title,
            sectionNumber: item.sectionNumber || prev.sectionNumber || 1,
            sectionName: item.sectionName || prev.sectionName || 'الوحدة التعليمية',
            unityNumber: item.unityNumber || prev.unityNumber || 1,
            objective: item.objective || prev.objective,
            tools: item.tools || prev.tools,
            content: item.content || prev.content,
            notes: item.notes || prev.notes,
        }));
        setAutoFilledTitle(item.title);
        setJustAutoFilled(true);
        setTimeout(() => setJustAutoFilled(false), 4500);
        setIsCurriculumExplorerOpen(false);
    }, []);

    // Generate pedagogical 3-phase content dynamically if user wrote a custom title
    const handleGeneratePedagogicalContent = () => {
        const title = formData.title?.trim() || 'الدرس المنهجي';
        const activity = formData.activity?.trim() || 'أدب ونصوص';
        const subject = formData.subject?.trim() || 'اللغة العربية وآدابها';

        const isGrammar = activity.includes('قواعد') || activity.includes('نحو') || activity.includes('صرف');
        const isRhetoric = activity.includes('بلاغة') || activity.includes('عروض');
        const isWriting = activity.includes('تعبير') || activity.includes('إدماج');

        let dynamicObjective = '';
        let dynamicTools = '';
        let dynamicContent = '';
        let dynamicNotes = 'تحقق مؤشر الكفاءة ومشاركة إيجابية من معظم المتعلمين.';

        if (isGrammar) {
            dynamicObjective = `أن يكتشف المتعلم أحكام وقواعد "${title}"، ويستنتج ضوابط إعرابها، ويوظفها توظيفاً سليماً مشافهة وكتابة.`;
            dynamicTools = 'الكتاب المدرسي، السبورة، بطاقات الشواهد، كراس الأنشطة';
            dynamicContent = `1. وضعيّة الانطلاق (05 د): استحضار شواهد لغوية من النص الأدبي ذات صلة بـ "${title}".\n` +
                             `2. وضعيّة بناء التعلّمات (35 د):\n` +
                             `   - ملاحظة الشواهد، استقراء الظاهرة وتفكيك عناصرها التركيبية.\n` +
                             `   - استخلاص وضبط أحكام قاعدة "${title}" وتدوينها مرحلياً على السبورة.\n` +
                             `3. وضعيّة الاستثمار والتقييم (20 د): إنجاز تمارين تطبيقية ونماذج إعرابية لتثبيت المكتسبات.`;
        } else if (isRhetoric) {
            dynamicObjective = `أن يتعرف المتعلم على أبعاد وجماليات "${title}"، ويدرك أثرها البلاغي في توضيح المعنى وتأكيد الفكرة.`;
            dynamicTools = 'الكتاب المدرسي، السبورة، شواهد بلاغية مختارة، نصوص شعرية ونثرية';
            dynamicContent = `1. وضعيّة الانطلاق (05 د): التمهيد بشواهد بيانية تثير المقارنة والتذوق الجمالي.\n` +
                             `2. وضعيّة بناء التعلّمات (35 د): تحليل عناصر الصورة أو المحسن البديعي واستخراج سر الفصاحة والبلاغة.\n` +
                             `3. وضعيّة الاستثمار والتقييم (20 د): تطبيقات استخراجية ونقدية على نصوص إضافية.`;
        } else if (isWriting) {
            dynamicObjective = `أن ينتج المتعلم نصاً متناسقاً وفق معايير النمط المطلوب موظفاً الموارد المكتسبة حول "${title}".`;
            dynamicTools = 'سند الوضعية المشكلة، شبكة التقويم الذاتي، السبورة';
            dynamicContent = `1. تحليل الوضعية المشكلة وتعليماتها ومعايير الإنجاز (10 د).\n` +
                             `2. التحرير الفردي على المسودات مع التوجيه والمرافقة التربوية (35 د).\n` +
                             `3. العرض والتقويم التبادلي والتصويب وفق شبكة المؤشرات (15 د).`;
        } else {
            dynamicObjective = `أن يحلل المتعلم نص "${title}" مستخلصاً الأفكار الأساسية، الخصائص الفنية، ومؤشرات النمط النصي المناسب.`;
            dynamicTools = 'الكتاب المدرسي المقرر، السبورة، السند الأدبي، مسلاط رقمي';
            dynamicContent = `1. وضعيّة الانطلاق (10 د): التمهيد بمكتسبات قبلية ترتبط بموضوع النص وسياقه الأدبي والتاريخي.\n` +
                             `2. وضعيّة بناء التعلّمات (35 د):\n` +
                             `   - القراءة النموذجية والتلمذية، استخراج الفكرة العامة والأفكار الأساسية.\n` +
                             `   - اكتشاف معطيات النص: الدلالات، الصور البيانية، والحقل المعجمي ومؤشرات النمط.\n` +
                             `   - مناقشة وتحليل أبعاد النص الجمالية والإنسانية.\n` +
                             `3. وضعيّة الاستثمار والتقييم (15 د): صياغة خلاصة تركيبية وتقويم مدى تحقق الكفاءة المستهدفة.`;
        }

        setFormData(prev => ({
            ...prev,
            objective: prev.objective || dynamicObjective,
            tools: prev.tools || dynamicTools,
            content: dynamicContent,
            notes: prev.notes || dynamicNotes,
        }));
        setAutoFilledTitle(title);
        setJustAutoFilled(true);
        setTimeout(() => setJustAutoFilled(false), 4500);
    };

    // Filtered explorer search results
    const explorerResults = useMemo(() => {
        let items = searchCurriculumLessons(curriculumSearchQuery, selectedLevel, selectedGrade);
        if (curriculumGradeFilter !== 'ALL') {
            if (curriculumGradeFilter === '1AS') items = items.filter(i => i.levelBadge.includes('الأولى') || i.id.includes('1as'));
            if (curriculumGradeFilter === '2AS') items = items.filter(i => i.levelBadge.includes('الثانية') || i.id.includes('2as'));
            if (curriculumGradeFilter === '3AS') items = items.filter(i => i.levelBadge.includes('الثالثة') || i.id.includes('3as'));
            if (curriculumGradeFilter === 'MIDDLE') items = items.filter(i => i.source === 'middle_template');
            if (curriculumGradeFilter === 'PRIMARY') items = items.filter(i => i.source === 'primary_template');
        }
        if (curriculumActivityFilter !== 'ALL') {
            if (curriculumActivityFilter === 'texts') items = items.filter(i => i.activity.includes('نص') || i.activity.includes('أدب'));
            if (curriculumActivityFilter === 'grammar') items = items.filter(i => i.activity.includes('قواعد') || i.activity.includes('نحو') || i.activity.includes('تركيب'));
            if (curriculumActivityFilter === 'rhetoric') items = items.filter(i => i.activity.includes('بلاغة') || i.activity.includes('عروض'));
            if (curriculumActivityFilter === 'reading') items = items.filter(i => i.activity.includes('مطالعة') || i.activity.includes('تواصلي'));
            if (curriculumActivityFilter === 'writing') items = items.filter(i => i.activity.includes('إدماج') || i.activity.includes('تعبير'));
        }
        return items;
    }, [curriculumSearchQuery, selectedLevel, selectedGrade, curriculumGradeFilter, curriculumActivityFilter]);

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
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const currentCat = CATEGORIES.find(c => c.id === formData.timing?.category) || CATEGORIES[0];
    const { monthNameAr } = getAlgerianMonthFromDate(formData.timing?.date || selectedDate);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in" dir="rtl">
            <div className={cn(
                "w-full max-w-5xl rounded-[2.5rem] shadow-2xl max-h-[94vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 transition-all",
                theme === 'v3' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
            )}>
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/60 dark:bg-slate-900/60">
                    <div className="flex items-center gap-4">
                        <div className={cn("p-4 rounded-3xl shadow-lg", currentCat.activeColor)}>
                            <currentCat.icon size={26} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl md:text-2xl font-black">{initialData ? 'تعديل السجل' : 'تدوين حصة جديدة'}</h3>
                                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[11px] px-3 py-1 rounded-full font-black border border-emerald-300 dark:border-emerald-700">
                                    تعبئة فورية ⚡
                                </span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                                سجل الكراس اليومي الرسمي — منهاج وزارة التربية الوطنية (الجيل الثاني)
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 rounded-2xl transition-all">
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6">
                    {/* 1. Category Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFormData({ ...formData, timing: { ...formData.timing!, category: cat.id } })}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-3.5 rounded-[1.8rem] border-2 transition-all group",
                                    formData.timing?.category === cat.id
                                        ? `${cat.activeColor} border-transparent shadow-xl scale-105`
                                        : `${cat.color} border-transparent hover:border-current/20`
                                )}
                            >
                                <cat.icon size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase whitespace-nowrap">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* 2. ⚡ SMART 1-CLICK CURRICULUM GENERATOR BAR */}
                    {formData.timing?.category === 'LESSON' && (
                        <div className="relative p-5 md:p-6 rounded-[2.2rem] bg-gradient-to-br from-indigo-50/90 via-emerald-50/60 to-teal-50/80 dark:from-indigo-950/40 dark:via-emerald-950/30 dark:to-teal-950/40 border-2 border-indigo-200/80 dark:border-indigo-800/60 shadow-md space-y-4 animate-in fade-in">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-600/30">
                                        <Sparkles size={20} className="animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                                            <span>مقترحات التدرج السنوي والمنهاج الرسمي الجزائري</span>
                                            <span className="text-[10px] bg-indigo-200/80 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                                                بنقرة واحدة بدون كتابة
                                            </span>
                                        </h4>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                                            توليد فوري لكافة الحقول: المادة، النشاط، العنوان، المقطع، الأهداف، الوسائل، وسير الحصة بيداغوجياً.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                                        <CalendarDays size={13} className="text-emerald-600" />
                                        شهر: <span className="font-black text-emerald-700 dark:text-emerald-400">{monthNameAr}</span>
                                    </span>
                                    {selectedGrade && (
                                        <span className="text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            المستوى: <span className="font-black text-indigo-600 dark:text-indigo-400">{selectedGrade}</span>
                                        </span>
                                    )}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setIsCurriculumExplorerOpen(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs px-3.5 py-1.5 shadow-sm"
                                        leftIcon={<Search size={14} />}
                                    >
                                        تصفح كامل بنك الدروس
                                    </Button>
                                </div>
                            </div>

                            {/* Success Notification Alert */}
                            {justAutoFilled && (
                                <div className="p-3.5 bg-emerald-100/90 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200 animate-in slide-in-from-top-2">
                                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <span className="text-xs font-black">
                                        تم بنجاح توليد وتعبئة بيانات الحصة بالكامل من التدرج الرسمي: "{autoFilledTitle}"
                                    </span>
                                </div>
                            )}

                            {/* 1-Click Quick Chips Bar */}
                            {curriculumSuggestions.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
                                        <span>اختر درساً لتعبئة الحصة فوراً:</span>
                                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black">
                                            ({curriculumSuggestions.length} حصة متوفرة في تدرج الشهر)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                        {curriculumSuggestions.slice(0, 10).map((sug) => (
                                            <button
                                                key={sug.id}
                                                type="button"
                                                onClick={() => applyCurriculumSuggestion(sug)}
                                                className="flex-shrink-0 group flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-right"
                                                title={`انقر لتعبئة: ${sug.title} (${sug.activity})`}
                                            >
                                                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 group-hover:bg-white/20 group-hover:text-white font-black whitespace-nowrap">
                                                    {sug.activity}
                                                </span>
                                                <span className="text-xs font-black text-slate-800 dark:text-white group-hover:text-white whitespace-nowrap max-w-[200px] truncate">
                                                    {sug.title}
                                                </span>
                                                <Zap size={14} className="text-amber-500 group-hover:text-amber-300 flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-white/70 dark:bg-slate-800/70 rounded-2xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                                    <Info size={15} className="text-indigo-500" />
                                    <span>اضغط على "تصفح كامل بنك الدروس" لاختيار أي درس رسمي من منهاج الثانوي أو المتوسط.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Content Cards */}
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
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <BookOpen size={18} />
                                        <h4 className="font-black text-sm uppercase tracking-wider">تفاصيل الحصة والمنهاج</h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsCurriculumExplorerOpen(true)}
                                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                    >
                                        <BookMarked size={12} />
                                        <span>استعراض بنك المنهاج</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">المادة</label>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="مثال: اللغة العربية وآدابها"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase block">اسم الحصة / العنوان</label>
                                            {formData.title && (
                                                <button
                                                    type="button"
                                                    onClick={handleGeneratePedagogicalContent}
                                                    className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 hover:bg-emerald-200"
                                                    title="توليد الهدف وسير الحصة بيداغوجياً لهذا العنوان"
                                                >
                                                    <Wand2 size={11} />
                                                    <span>توليد سير الحصة بيداغوجياً ⚡</span>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="مثال: من الكرم العربي لحاتم الطائي"
                                        />
                                        {isSearching && (
                                            <div className="absolute left-4 top-1/2 translate-y-1">
                                                <Loader2 size={14} className="animate-spin text-emerald-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Resource Bank Suggestions */}
                                    {resourceSuggestions.length > 0 && showSuggestions && (
                                        <div className="mt-2 p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in slide-in-from-top-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                                    <Database size={14} />
                                                    <span className="text-[10px] font-black uppercase">اقتراحات من بنك الموارد</span>
                                                    <span className="text-[9px] bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-black">{resourceSuggestions.length}</span>
                                                </div>
                                                <button onClick={() => setShowSuggestions(false)} className="text-slate-400 hover:text-rose-500">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            {resourceSuggestions.map(res => (
                                                <button
                                                    key={res.id}
                                                    type="button"
                                                    onClick={() => applyResourceSuggestion(res)}
                                                    className="w-full text-right p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-emerald-400 hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{res.title}</span>
                                                        <span className="text-[9px] font-bold text-slate-400">{res.activity}</span>
                                                    </div>
                                                    {res.objective && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">{res.objective}</p>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
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
                                                placeholder="مثال: عصر الضعف والانحطاط"
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

                    {/* 4. Full Width Pedagogical Content Card */}
                    <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-800/30">
                        <CardContent className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">النشاط</label>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner", styles.input)}
                                            value={formData.activity}
                                            onChange={e => setFormData({ ...formData, activity: e.target.value })}
                                            placeholder="أدب ونصوص، قواعد لغة، بلاغة، مطالعة، وضعية إدماجية..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">الهدف التعلمي / مؤشر الكفاءة</label>
                                        <textarea
                                            rows={2}
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 shadow-inner resize-none", styles.input)}
                                            value={formData.objective}
                                            onChange={e => setFormData({ ...formData, objective: e.target.value })}
                                            placeholder="تحديد الهدف الإجرائي من الحصة..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase block">الوسائل البيداغوجية</label>
                                            <span className="text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full font-black">مقترح تلقائي</span>
                                        </div>
                                        <input
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-inner", styles.input)}
                                            value={formData.tools}
                                            onChange={e => setFormData({ ...formData, tools: e.target.value })}
                                            placeholder="الكتاب المدرسي المقرر، السبورة، مسلاط رقمي..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">الملاحظة البيداغوجية</label>
                                        <textarea
                                            rows={2}
                                            className={cn("w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-inner resize-none", styles.input)}
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="سير الحصة، تفاعل التلاميذ، مدى تحقق مؤشر الكفاءة..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase block">سير الحصة والمحتوى التربوي (وفق المقاربة بالكفاءات)</label>
                                    <button
                                        type="button"
                                        onClick={handleGeneratePedagogicalContent}
                                        className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black hover:underline flex items-center gap-1.5"
                                    >
                                        <Wand2 size={13} />
                                        <span>توليد بيداغوجي ذاتي للمراحل الثلاث ⚡</span>
                                    </button>
                                </div>
                                <textarea
                                    rows={5}
                                    className={cn("w-full p-5 rounded-[2.2rem] border-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner leading-relaxed text-sm", styles.input)}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="وضعية الانطلاق (التمهيد) -> وضعية بناء التعلمات (الملاحظة والتحليل وبناء القاعدة) -> وضعية الاستثمار والتقييم..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. Holiday Info Section (Conditional) */}
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
                <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Info size={16} />
                        <span className="text-[10px] font-bold">يتم الحفظ والتسجيل آلياً في قاعدة البيانات السحابية والمحلية</span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 sm:flex-none bg-white dark:bg-slate-800 px-6 rounded-2xl font-black"
                        >
                            إلغاء التعديل
                        </Button>
                        <Button
                            onClick={handleSave}
                            isLoading={isSubmitting}
                            className={cn("flex-1 sm:flex-none px-10 rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-base", currentCat.activeColor)}
                            leftIcon={<Save size={20} />}
                        >
                            حفظ وتدوين
                        </Button>
                    </div>
                </div>
            </div>

            {/* CURRICULUM EXPLORER MODAL (Full Bank Explorer) */}
            {isCurriculumExplorerOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in" dir="rtl">
                    <div className={cn(
                        "w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden",
                        theme === 'v3' ? "bg-slate-900 text-white" : "bg-white text-slate-900"
                    )}>
                        {/* Explorer Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/70">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md">
                                    <BookMarked size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">بنك دروس وتدرجات المنهاج الرسمي الجزائري</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        اختر أي درس رسمي لتعبئة كافة بيانات الحصة بضغطة زر واحدة (بدون كتابة)
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCurriculumExplorerOpen(false)}
                                className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search & Filter Controls */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
                            <div className="relative">
                                <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={curriculumSearchQuery}
                                    onChange={e => setCurriculumSearchQuery(e.target.value)}
                                    placeholder="ابحث بالعنوان، الكاتب، النشاط أو الدرس (مثال: إعراب إذا، حاتم الطائي، مفدي زكريا، فلسطين، النمط الحجاجي...)"
                                    className={cn("w-full pr-12 pl-4 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-inner text-sm", styles.input)}
                                />
                                {curriculumSearchQuery && (
                                    <button
                                        onClick={() => setCurriculumSearchQuery('')}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 text-xs font-bold"
                                    >
                                        مسح
                                    </button>
                                )}
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                {/* Level Tabs */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] font-bold text-slate-400 ml-1">السنة:</span>
                                    {(['ALL', '3AS', '2AS', '1AS', 'MIDDLE', 'PRIMARY'] as const).map(f => (
                                        <button
                                            key={f}
                                            type="button"
                                            onClick={() => setCurriculumGradeFilter(f)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-xl font-black text-[11px] transition-all",
                                                curriculumGradeFilter === f
                                                    ? "bg-indigo-600 text-white shadow-sm"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                            )}
                                        >
                                            {f === 'ALL' && 'الكل'}
                                            {f === '3AS' && 'السنة 3 ثانوي (بكالوريا)'}
                                            {f === '2AS' && 'السنة 2 ثانوي'}
                                            {f === '1AS' && 'السنة 1 ثانوي'}
                                            {f === 'MIDDLE' && 'متوسط (CEM)'}
                                            {f === 'PRIMARY' && 'ابتدائي'}
                                        </button>
                                    ))}
                                </div>

                                {/* Activity Tabs */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] font-bold text-slate-400 ml-1">النشاط:</span>
                                    {(['ALL', 'texts', 'grammar', 'rhetoric', 'reading', 'writing'] as const).map(af => (
                                        <button
                                            key={af}
                                            type="button"
                                            onClick={() => setCurriculumActivityFilter(af)}
                                            className={cn(
                                                "px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all",
                                                curriculumActivityFilter === af
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                                            )}
                                        >
                                            {af === 'ALL' && 'كافة الأنشطة'}
                                            {af === 'texts' && 'أدب ونصوص'}
                                            {af === 'grammar' && 'قواعد لغة'}
                                            {af === 'rhetoric' && 'بلاغة وعروض'}
                                            {af === 'reading' && 'مطالعة وتواصل'}
                                            {af === 'writing' && 'وضعية إدماجية'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Explorer Results List */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                            <div className="text-[11px] font-bold text-slate-400 px-1 flex justify-between">
                                <span>النتائج المتطابقة:</span>
                                <span>{explorerResults.length} درس مسجل</span>
                            </div>

                            {explorerResults.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {explorerResults.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all flex flex-col justify-between group"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full truncate">
                                                        {item.levelBadge}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                        {item.activity}
                                                    </span>
                                                </div>

                                                <h5 className="font-black text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {item.title}
                                                </h5>

                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {item.objective}
                                                </p>
                                                {item.sectionName && (
                                                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <span>المقطع:</span>
                                                        <span className="font-bold text-slate-600 dark:text-slate-300">{item.sectionName}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-end">
                                                <Button
                                                    size="sm"
                                                    onClick={() => applyCurriculumSuggestion(item)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs py-2 shadow-sm"
                                                    leftIcon={<Zap size={14} className="text-amber-300" />}
                                                >
                                                    تعبئة الحصة فوراً بهذا الدرس ⚡
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-slate-400 space-y-2">
                                    <BookOpen size={40} className="mx-auto opacity-40" />
                                    <p className="font-bold">لم نجد دروساً تطابق بحثك: "{curriculumSearchQuery}"</p>
                                    <p className="text-xs text-slate-500">جرب البحث بكلمة عامة مثل: "نص"، "إعراب"، "استعارة"، "إدماج".</p>
                                </div>
                            )}
                        </div>

                        {/* Explorer Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">
                                قاعدة بيانات منهاج الجيل الثاني لوزارة التربية الوطنية
                            </span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsCurriculumExplorerOpen(false)}
                                className="rounded-xl px-5"
                            >
                                إغلاق
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
