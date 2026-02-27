import React, { useState, useEffect } from 'react';
import {
    BookOpenCheck, Search, Loader2, Database, Sparkles,
    FileText, Film, Download, Layers, ChevronDown, BookOpen,
    Target, Wrench, ArrowRight
} from 'lucide-react';
import { TeacherProfile, Resource } from '../../types';
import { listResources, smartFetchResource } from '../../services/resourceBankService';

interface Props {
    profile: TeacherProfile;
}

const ResourceBankView: React.FC<Props> = ({ profile }) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [lastSource, setLastSource] = useState<'database' | 'ai' | 'none' | null>(null);

    // Filters
    const [filterSubject, setFilterSubject] = useState(profile.teachingSubject || '');
    const [filterGrade, setFilterGrade] = useState(profile.grades?.[0] || '');
    const [filterActivity, setFilterActivity] = useState('');
    const [searchTitle, setSearchTitle] = useState('');

    // Load resources on mount and filter change
    useEffect(() => {
        loadResources();
    }, [filterSubject, filterGrade, filterActivity]);

    const loadResources = async () => {
        setIsLoading(true);
        const results = await listResources({
            subject: filterSubject || undefined,
            level: profile.level,
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
            level: profile.level,
            grade: filterGrade,
            activity: filterActivity,
            title: searchTitle,
        });

        if (result.resource) {
            setSelectedResource(result.resource);
            setLastSource(result.source);
            // Refresh list
            loadResources();
        } else {
            setLastSource('none');
        }

        setIsFetching(false);
    };

    const levelLabel = profile.level === 'PRIMARY' ? 'ابتدائي' : profile.level === 'MIDDLE' ? 'متوسط' : 'ثانوي';

    const commonActivities = [
        'فهم المنطوق', 'فهم المكتوب', 'إنتاج كتابي', 'إنتاج شفهي',
        'قراءة', 'قواعد', 'إملاء', 'محفوظات', 'تعبير شفوي', 'تعبير كتابي',
        'أعداد وحساب', 'هندسة', 'قياس ومقادير', 'تنظيم معطيات',
        'تمارين', 'وضعية إدماجية', 'معالجة', 'تقويم'
    ];

    return (
        <div className="space-y-6 font-['Cairo'] pb-20" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-indigo-900 to-violet-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="p-5 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
                        <BookOpenCheck size={36} className="text-violet-200" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">بنك الموارد الوطني</h2>
                        <p className="text-violet-200/80 text-sm font-bold mt-1">
                            قاعدة المعرفة البيداغوجية — {levelLabel}
                        </p>
                    </div>
                </div>
                <div className="relative z-10 mt-4 flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2 w-fit">
                    <Database size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-200">{resources.length} مورد متاح</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                    <Layers className="text-indigo-500" size={20} />
                    <h3 className="font-black text-slate-800 dark:text-white">تصفية البحث</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase pr-2">المادة</label>
                        <input
                            type="text"
                            value={filterSubject}
                            onChange={e => setFilterSubject(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        />
                    </div>

                    {/* Grade */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase pr-2">المستوى</label>
                        <select
                            value={filterGrade}
                            onChange={e => setFilterGrade(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        >
                            {profile.grades?.map(g => (
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
                    <div className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${lastSource === 'database' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        lastSource === 'ai' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                        {lastSource === 'database' && <><Database size={14} /> تم استرجاع المورد من قاعدة البيانات</>}
                        {lastSource === 'ai' && <><Sparkles size={14} /> تم التوليد بالذكاء الاصطناعي وحُفظ في المستودع</>}
                        {lastSource === 'none' && <>لم يتم العثور على المورد. يرجى إضافة مفتاح Gemini API في الإعدادات للتوليد الآلي.</>}
                    </div>
                )}
            </div>

            {/* Selected Resource Detail */}
            {selectedResource && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-2 border-indigo-200 dark:border-indigo-800 space-y-6 animate-in">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${selectedResource.source === 'admin' ? 'bg-emerald-100 text-emerald-700' :
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
                                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">الوسائل</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedResource.tools}</p>
                            </div>
                        )}
                    </div>

                    {selectedResource.content && (
                        <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen size={16} className="text-slate-600" />
                                <span className="text-xs font-black text-slate-600 dark:text-slate-400">سير الحصة</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {selectedResource.content}
                            </p>
                        </div>
                    )}

                    {/* Files */}
                    {selectedResource.files && selectedResource.files.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-500">الملفات المرفقة</h4>
                            <div className="flex flex-wrap gap-3">
                                {selectedResource.files.map(f => (
                                    <a
                                        key={f.id}
                                        href={f.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                                    >
                                        {f.media_type === 'video' ? <Film size={16} className="text-rose-500" /> : <FileText size={16} className="text-blue-500" />}
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{f.file_name}</span>
                                        <Download size={14} className="text-slate-400" />
                                    </a>
                                ))}
                            </div>
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
                    <p className="text-slate-400 font-black">لا توجد موارد بعد. استخدم البحث الذكي أو اطلب من الأدمن إضافة موارد.</p>
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
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${r.source === 'admin' ? 'bg-emerald-100 text-emerald-700' :
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
    );
};

export default ResourceBankView;
