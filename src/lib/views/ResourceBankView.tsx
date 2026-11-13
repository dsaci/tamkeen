import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    BookOpenCheck, Search, Loader2, Database, Sparkles,
    FileText, Film, Download, Layers, ChevronDown, ChevronUp, BookOpen,
    Target, Wrench, ArrowRight, ExternalLink, ShieldCheck, GraduationCap,
    Scale, Award, FolderKanban, Check, Zap, Info
} from 'lucide-react';
import { TeacherProfile, Resource, SchoolLevel } from '../../types';
import { listResources, smartFetchResource } from '../../services/resourceBankService';
import {
    OFFICIAL_CURRICULUM_GUIDES,
    searchOfficialCurriculumGuides,
    getGuidesCategoriesSummary,
    CurriculumGuideItem,
    GuideCategory
} from '../../data/officialCurriculumGuidesDB';

const LEVEL_OPTIONS: { id: SchoolLevel; label: string }[] = [
    { id: 'PRIMARY', label: 'ابتدائي' },
    { id: 'MIDDLE', label: 'متوسط' },
    { id: 'HIGH', label: 'ثانوي' },
];

const GRADES_BY_LEVEL: Record<SchoolLevel, string[]> = {
    PRIMARY: ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'السنة الخامسة'],
    MIDDLE: ['السنة الأولى متوسط', 'السنة الثانية متوسط', 'السنة الثالثة متوسط', 'السنة الرابعة متوسط'],
    HIGH: ['السنة الأولى ثانوي', 'السنة الثانية ثانوي', 'السنة الثالثة ثانوي'],
    SECONDARY: ['السنة الأولى ثانوي', 'السنة الثانية ثانوي', 'السنة الثالثة ثانوي'],
};

interface Props {
    profile: TeacherProfile;
}

const ResourceBankView: React.FC<Props> = ({ profile }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Primary Tab: 'lessons' | 'guides'
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') === 'guides' ? 'guides' : 'lessons';
    const [bankTab, setBankTab] = useState<'lessons' | 'guides'>(initialTab);

    // ──────────────────────────────────────────────────────────
    // 1. STATE FOR LESSONS / MEMOS
    // ──────────────────────────────────────────────────────────
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [lastSource, setLastSource] = useState<'database' | 'ai' | 'none' | null>(null);

    const [filterSubject, setFilterSubject] = useState('');
    const [filterLevel, setFilterLevel] = useState<string>('');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterActivity, setFilterActivity] = useState('');
    const [searchTitle, setSearchTitle] = useState('');

    // ──────────────────────────────────────────────────────────
    // 2. STATE FOR OFFICIAL GUIDES & CURRICULA (Google Drive)
    // ──────────────────────────────────────────────────────────
    const [guideCategory, setGuideCategory] = useState<GuideCategory | 'all'>('all');
    const [guideSearch, setGuideSearch] = useState('');
    const [guideLevelFilter, setGuideLevelFilter] = useState('HIGH');
    const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);

    // Load lesson resources
    useEffect(() => {
        if (bankTab === 'lessons') {
            loadResources();
        }
    }, [filterSubject, filterLevel, filterGrade, filterActivity, bankTab]);

    useEffect(() => {
        if (filterLevel) {
            const newGrades = GRADES_BY_LEVEL[filterLevel as SchoolLevel] || [];
            if (filterGrade && !newGrades.includes(filterGrade)) {
                setFilterGrade('');
            }
        } else {
            setFilterGrade('');
        }
    }, [filterLevel]);

    const loadResources = async () => {
        setIsLoading(true);
        const results = await listResources({
            subject: filterSubject || undefined,
            level: filterLevel,
            grade: filterGrade || undefined,
            activity: filterActivity || undefined,
        });
        setResources(results);
        setIsLoading(false);
    };

    const handleSmartSearch = async () => {
        if (!searchTitle.trim() || !filterActivity.trim()) return;

        setIsFetching(true);
        setLastSource(null);

        const result = await smartFetchResource({
            subject: filterSubject,
            level: filterLevel,
            grade: filterGrade,
            activity: filterActivity,
            title: searchTitle,
        });

        if (result.resource) {
            setSelectedResource(result.resource);
            setLastSource(result.source);
            loadResources();
        } else {
            setLastSource('none');
        }

        setIsFetching(false);
    };

    // Filtered Guides
    const filteredGuides = useMemo(() => {
        return searchOfficialCurriculumGuides({
            category: guideCategory,
            level: guideLevelFilter,
            search: guideSearch,
        });
    }, [guideCategory, guideLevelFilter, guideSearch]);

    const categoriesSummary = useMemo(() => getGuidesCategoriesSummary(), []);

    const levelLabel = filterLevel ? (LEVEL_OPTIONS.find(l => l.id === filterLevel)?.label || '') : 'كل الأطوار';

    const commonActivities = [
        'فهم المنطوق', 'فهم المكتوب', 'إنتاج كتابي', 'إنتاج شفهي',
        'قراءة', 'قواعد', 'إملاء', 'محفوظات', 'تعبير شفوي', 'تعبير كتابي',
        'أعداد وحساب', 'هندسة', 'قياس ومقادير', 'تنظيم معطيات',
        'تمارين', 'وضعية إدماجية', 'معالجة', 'تقويم'
    ];

    return (
        <div className="space-y-6 font-['Cairo'] pb-24" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-4 border-indigo-700">
                <div className="absolute top-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-5 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md shadow-inner">
                            <BookOpenCheck size={38} className="text-violet-200" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-3 py-0.5 rounded-full text-xs font-black">
                                    وزارة التربية الوطنية • المفتشية العامة للبيداغوجيا
                                </span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">بنك الموارد والأدلة البيداغوجية</h2>
                            <p className="text-violet-200/80 text-sm font-bold mt-1">
                                قاعدة المعرفة المعتمدة للتعليم الجزائري — الأدلة الرسمية، المناهج، التشريع، وبنك الدروس
                            </p>
                        </div>
                    </div>

                    {/* View Switcher Tabs */}
                    <div className="flex items-center gap-2 bg-black/30 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <button
                            onClick={() => setBankTab('guides')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                                bankTab === 'guides'
                                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <ShieldCheck size={16} /> الأدلة الرسمية والمناهج ({OFFICIAL_CURRICULUM_GUIDES.length})
                        </button>
                        <button
                            onClick={() => setBankTab('lessons')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                                bankTab === 'lessons'
                                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <Database size={16} /> بنك الدروس والمذكرات ({resources.length})
                        </button>
                    </div>
                </div>

                {/* Sub-banner Quick Link */}
                <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200/90 font-bold">
                    <div className="flex items-center gap-2">
                        <FolderKanban size={14} className="text-amber-400" />
                        <span>مستودع الموارد الرقمي الموحد: مربوط مباشرة بمجلد Google Drive التربوي الرسمي</span>
                    </div>
                    <a
                        href="https://drive.google.com/drive/folders/1wQ4sRhAYt6udqjpeQjJqer0ZQtD68fql?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-black underline underline-offset-4"
                    >
                        <span>فتح المجلد الكامل على Google Drive</span>
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* VIEW 1: OFFICIAL CURRICULUM GUIDES & LEGISLATION           */}
            {/* ══════════════════════════════════════════════════════════ */}
            {bankTab === 'guides' && (
                <div className="space-y-6">
                    {/* Category Filter Pills */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <Layers className="text-amber-500" size={20} />
                                <h3 className="font-black text-slate-800 dark:text-white">أقسام الأدلة والوثائق الرسمية</h3>
                            </div>
                            {/* Search inside guides */}
                            <div className="relative min-w-[280px]">
                                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={guideSearch}
                                    onChange={e => setGuideSearch(e.target.value)}
                                    placeholder="ابحث في الأدلة، المناهج، التشريع، الكفاءات..."
                                    className="w-full pr-11 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Pills */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {categoriesSummary.map(cat => {
                                const isActive = guideCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setGuideCategory(cat.id as any)}
                                        className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                                            isActive
                                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md font-black'
                                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                                        }`}
                                    >
                                        <span>{cat.label}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                            isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                        }`}>
                                            {cat.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Guides Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredGuides.map(guide => {
                            const isExpanded = expandedGuideId === guide.id;
                            const isPdf = guide.format === 'PDF';
                            const isDoc = guide.format === 'DOC';
                            const isFolder = guide.format === 'FOLDER';

                            return (
                                <div
                                    key={guide.id}
                                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Card Top Badges */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black ${
                                                    guide.category === 'guides' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                                                    guide.category === 'curricula' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                                    guide.category === 'legislation' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' :
                                                    guide.category === 'didactics' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' :
                                                    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
                                                }`}>
                                                    {guide.categoryLabel}
                                                </span>
                                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-200 dark:border-slate-700">
                                                    {guide.levelLabel}
                                                </span>
                                            </div>

                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${
                                                isPdf ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                                                isDoc ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' :
                                                'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                            }`}>
                                                <FileText size={12} />
                                                {guide.format}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {guide.title}
                                        </h4>

                                        {/* Ministry Reference */}
                                        <p className="text-[11px] text-slate-400 font-bold mt-1 flex items-center gap-1.5">
                                            <Award size={13} className="text-amber-500 shrink-0" />
                                            <span>{guide.ministryReference}</span>
                                        </p>

                                        {/* Grades & Streams */}
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {guide.grades.map((g, idx) => (
                                                <span key={idx} className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-100 dark:border-slate-700">
                                                    {g}
                                                </span>
                                            ))}
                                            {guide.streams.map((s, idx) => (
                                                <span key={idx} className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-100 dark:border-indigo-800/60">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Pedagogical Description */}
                                        <p className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed mt-3.5 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            {guide.description}
                                        </p>

                                        {/* Expandable Table of Contents & Competencies */}
                                        {isExpanded && (
                                            <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in">
                                                {guide.tableOfContents && guide.tableOfContents.length > 0 && (
                                                    <div>
                                                        <h5 className="text-[11px] font-black text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                                            <BookOpen size={13} className="text-amber-500" /> الفهرس والمحاور الأساسية:
                                                        </h5>
                                                        <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-400 font-bold pr-2 list-disc list-inside">
                                                            {guide.tableOfContents.map((tc, idx) => (
                                                                <li key={idx}>{tc}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {guide.keyCompetencies && guide.keyCompetencies.length > 0 && (
                                                    <div>
                                                        <h5 className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                                                            <Target size={13} /> الكفاءات والمؤشرات المستهدفة:
                                                        </h5>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {guide.keyCompetencies.map((comp, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-100 dark:border-emerald-800">
                                                                    ✓ {comp}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {guide.didacticStrategies && guide.didacticStrategies.length > 0 && (
                                                    <div>
                                                        <h5 className="text-[11px] font-black text-indigo-700 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
                                                            <Zap size={13} /> استراتيجيات التدريس المعتمدة:
                                                        </h5>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {guide.didacticStrategies.map((strat, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800">
                                                                    ⚡ {strat}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                                            className="text-xs font-black text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition"
                                        >
                                            <span>{isExpanded ? 'طي التفاصيل' : 'عرض المحاور والكفاءات'}</span>
                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <a
                                                href={guide.driveViewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
                                            >
                                                <ExternalLink size={13} /> معاينة الملف
                                            </a>
                                            <a
                                                href={guide.driveDownloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md transition flex items-center gap-1.5"
                                            >
                                                <Download size={13} /> تحميل
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════ */}
            {/* VIEW 2: LESSONS & MEMOS DATABASE (Existing Functionality)   */}
            {/* ══════════════════════════════════════════════════════════ */}
            {bankTab === 'lessons' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <Layers className="text-indigo-500" size={20} />
                            <h3 className="font-black text-slate-800 dark:text-white">تصفية البحث في الدروس والمذكرات</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Level */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase pr-2">الطور الدراسي</label>
                                <select
                                    value={filterLevel}
                                    onChange={e => setFilterLevel(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                >
                                    <option value="">كل الأطوار</option>
                                    {LEVEL_OPTIONS.map(l => (
                                        <option key={l.id} value={l.id}>{l.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase pr-2">المادة</label>
                                <input
                                    type="text"
                                    value={filterSubject}
                                    onChange={e => setFilterSubject(e.target.value)}
                                    placeholder="اللغة العربية وآدابها"
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                />
                            </div>

                            {/* Grade */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase pr-2">المستوى (السنة)</label>
                                <select
                                    value={filterGrade}
                                    onChange={e => setFilterGrade(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                >
                                    <option value="">الكل</option>
                                    {filterLevel && (GRADES_BY_LEVEL[filterLevel as SchoolLevel] || []).map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Activity */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase pr-2">النشاط</label>
                                <select
                                    value={filterActivity}
                                    onChange={e => setFilterActivity(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                >
                                    <option value="">الكل</option>
                                    {commonActivities.map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Smart Search */}
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="عنوان الحصة للبحث أو التوليد..."
                                    value={searchTitle}
                                    onChange={e => setSearchTitle(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSmartSearch()}
                                    className="w-full pr-12 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                />
                            </div>
                            <button
                                onClick={handleSmartSearch}
                                disabled={isFetching || !searchTitle.trim() || !filterActivity.trim()}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 border-b-4 border-indigo-800"
                            >
                                {isFetching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                بحث ذكي
                            </button>
                        </div>

                        {/* Source indicator */}
                        {lastSource && (
                            <div className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                lastSource === 'database' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                lastSource === 'ai' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                                {lastSource === 'database' && <><Database size={14} /> تم استرجاع المورد من قاعدة البيانات الموثقة</>}
                                {lastSource === 'ai' && <><Sparkles size={14} /> تم التوليد بنجاح وفق نموذج التفتيش المعتمد</>}
                                {lastSource === 'none' && <>لم يتم العثور على المورد المطلوب.</>}
                            </div>
                        )}
                    </div>

                    {/* Selected Resource Detail */}
                    {selectedResource && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-2 border-indigo-200 dark:border-indigo-800 space-y-6 animate-in">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                            selectedResource.source === 'admin' ? 'bg-emerald-100 text-emerald-700' :
                                            selectedResource.source === 'ai' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {selectedResource.source === 'admin' ? 'مصدر رسمي' : selectedResource.source === 'ai' ? 'توليد آلي' : 'مساهمة مستخدم'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">استخدام: {selectedResource.usage_count}×</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedResource.title}</h3>
                                    <p className="text-sm text-slate-500 font-bold mt-1">
                                        {selectedResource.subject} • {selectedResource.grade} • {selectedResource.activity}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedResource(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">✕</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedResource.objective && (
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target size={16} className="text-indigo-600" />
                                            <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">الهدف التعلمي</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedResource.objective}</p>
                                    </div>
                                )}
                                {selectedResource.tools && (
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Wrench size={16} className="text-emerald-600" />
                                            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">الوسائل والسندات</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedResource.tools}</p>
                                    </div>
                                )}
                            </div>

                            {selectedResource.content && (
                                <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BookOpen size={16} className="text-slate-600" />
                                        <span className="text-xs font-black text-slate-600 dark:text-slate-400">سير الحصة والمحتوى</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                        {selectedResource.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Resource Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-indigo-500" size={40} />
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 border-4 border-dashed border-slate-200 dark:border-slate-700 p-16 rounded-[3rem] text-center flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                                <BookOpenCheck size={40} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-black">لا توجد موارد مطابقة. استخدم البحث الذكي لاستدعاء الدروس من قاعدة البيانات المحلية.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelectedResource(r)}
                                    className="text-right bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                            r.source === 'admin' ? 'bg-emerald-100 text-emerald-700' :
                                            r.source === 'ai' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {r.source === 'admin' ? 'رسمي' : r.source === 'ai' ? 'آلي' : 'مستخدم'}
                                        </span>
                                        <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition" />
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-2 line-clamp-2">{r.title}</h4>
                                    <p className="text-[11px] text-slate-500 font-bold">{r.activity} • {r.grade}</p>
                                    {r.objective && (
                                        <p className="text-[11px] text-slate-400 font-bold mt-2 line-clamp-2">{r.objective}</p>
                                    )}
                                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                                        <Database size={10} /> {r.usage_count}× استخدام
                                        {r.files && r.files.length > 0 && (
                                            <><FileText size={10} className="mr-2" /> {r.files.length} ملف</>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResourceBankView;
