import React, { useState } from 'react';
import { Database, BookOpen, Layers, Server, RefreshCw, Map, Layout, Bookmark } from 'lucide-react';

type RepoTab = 'overview' | 'wilayas' | 'subjects' | 'curriculum';

// ============================================================
// Static Data — Algerian Wilayas
// ============================================================
const WILAYAS = [
    { id: 1, code: '01', name_ar: 'أدرار', name_en: 'Adrar' },
    { id: 2, code: '02', name_ar: 'الشلف', name_en: 'Chlef' },
    { id: 3, code: '03', name_ar: 'الأغواط', name_en: 'Laghouat' },
    { id: 4, code: '04', name_ar: 'أم البواقي', name_en: 'Oum El Bouaghi' },
    { id: 5, code: '05', name_ar: 'باتنة', name_en: 'Batna' },
    { id: 6, code: '06', name_ar: 'بجاية', name_en: 'Béjaïa' },
    { id: 7, code: '07', name_ar: 'بسكرة', name_en: 'Biskra' },
    { id: 8, code: '08', name_ar: 'بشار', name_en: 'Béchar' },
    { id: 9, code: '09', name_ar: 'البليدة', name_en: 'Blida' },
    { id: 10, code: '10', name_ar: 'البويرة', name_en: 'Bouira' },
    { id: 11, code: '11', name_ar: 'تمنراست', name_en: 'Tamanrasset' },
    { id: 12, code: '12', name_ar: 'تبسة', name_en: 'Tébessa' },
    { id: 13, code: '13', name_ar: 'تلمسان', name_en: 'Tlemcen' },
    { id: 14, code: '14', name_ar: 'تيارت', name_en: 'Tiaret' },
    { id: 15, code: '15', name_ar: 'تيزي وزو', name_en: 'Tizi Ouzou' },
    { id: 16, code: '16', name_ar: 'الجزائر', name_en: 'Alger' },
    { id: 17, code: '17', name_ar: 'الجلفة', name_en: 'Djelfa' },
    { id: 18, code: '18', name_ar: 'جيجل', name_en: 'Jijel' },
    { id: 19, code: '19', name_ar: 'سطيف', name_en: 'Sétif' },
    { id: 20, code: '20', name_ar: 'سعيدة', name_en: 'Saïda' },
    { id: 21, code: '21', name_ar: 'سكيكدة', name_en: 'Skikda' },
    { id: 22, code: '22', name_ar: 'سيدي بلعباس', name_en: 'Sidi Bel Abbès' },
    { id: 23, code: '23', name_ar: 'عنابة', name_en: 'Annaba' },
    { id: 24, code: '24', name_ar: 'قالمة', name_en: 'Guelma' },
    { id: 25, code: '25', name_ar: 'قسنطينة', name_en: 'Constantine' },
    { id: 26, code: '26', name_ar: 'المدية', name_en: 'Médéa' },
    { id: 27, code: '27', name_ar: 'مستغانم', name_en: 'Mostaganem' },
    { id: 28, code: '28', name_ar: 'المسيلة', name_en: 'M\'sila' },
    { id: 29, code: '29', name_ar: 'معسكر', name_en: 'Mascara' },
    { id: 30, code: '30', name_ar: 'ورقلة', name_en: 'Ouargla' },
    { id: 31, code: '31', name_ar: 'وهران', name_en: 'Oran' },
    { id: 32, code: '32', name_ar: 'البيض', name_en: 'El Bayadh' },
    { id: 33, code: '33', name_ar: 'إليزي', name_en: 'Illizi' },
    { id: 34, code: '34', name_ar: 'برج بوعريريج', name_en: 'Bordj Bou Arréridj' },
    { id: 35, code: '35', name_ar: 'بومرداس', name_en: 'Boumerdès' },
    { id: 36, code: '36', name_ar: 'الطارف', name_en: 'El Tarf' },
    { id: 37, code: '37', name_ar: 'تندوف', name_en: 'Tindouf' },
    { id: 38, code: '38', name_ar: 'تيسمسيلت', name_en: 'Tissemsilt' },
    { id: 39, code: '39', name_ar: 'الوادي', name_en: 'El Oued' },
    { id: 40, code: '40', name_ar: 'خنشلة', name_en: 'Khenchela' },
    { id: 41, code: '41', name_ar: 'سوق أهراس', name_en: 'Souk Ahras' },
    { id: 42, code: '42', name_ar: 'تيبازة', name_en: 'Tipaza' },
    { id: 43, code: '43', name_ar: 'ميلة', name_en: 'Mila' },
    { id: 44, code: '44', name_ar: 'عين الدفلى', name_en: 'Aïn Defla' },
    { id: 45, code: '45', name_ar: 'النعامة', name_en: 'Naâma' },
    { id: 46, code: '46', name_ar: 'عين تموشنت', name_en: 'Aïn Témouchent' },
    { id: 47, code: '47', name_ar: 'غرداية', name_en: 'Ghardaïa' },
    { id: 48, code: '48', name_ar: 'غليزان', name_en: 'Relizane' },
    { id: 49, code: '49', name_ar: 'تيميمون', name_en: 'Timimoun' },
    { id: 50, code: '50', name_ar: 'برج باجي مختار', name_en: 'Bordj Badji Mokhtar' },
    { id: 51, code: '51', name_ar: 'أولاد جلال', name_en: 'Ouled Djellal' },
    { id: 52, code: '52', name_ar: 'بني عباس', name_en: 'Béni Abbès' },
    { id: 53, code: '53', name_ar: 'عين صالح', name_en: 'In Salah' },
    { id: 54, code: '54', name_ar: 'عين قزّام', name_en: 'In Guezzam' },
    { id: 55, code: '55', name_ar: 'توقرت', name_en: 'Touggourt' },
    { id: 56, code: '56', name_ar: 'جانت', name_en: 'Djanet' },
    { id: 57, code: '57', name_ar: 'المغير', name_en: 'El M\'Ghair' },
    { id: 58, code: '58', name_ar: 'المنيعة', name_en: 'El Meniaa' },
];

// ============================================================
// Static Data — Curriculum per year
// ============================================================
const CURRICULUM: Record<string, { id: number; subject_name: string; category: string; weekly_hours: number; coefficient: number }[]> = {
    '4AM': [
        { id: 1, subject_name: 'اللغة العربية', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 5 },
        { id: 2, subject_name: 'الرياضيات', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 5 },
        { id: 3, subject_name: 'اللغة الفرنسية', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 3 },
        { id: 4, subject_name: 'اللغة الإنجليزية', category: 'المواد الأساسية', weekly_hours: 3, coefficient: 3 },
        { id: 5, subject_name: 'العلوم الطبيعية', category: 'المواد العلمية', weekly_hours: 2, coefficient: 2 },
        { id: 6, subject_name: 'العلوم الفيزيائية', category: 'المواد العلمية', weekly_hours: 2, coefficient: 2 },
        { id: 7, subject_name: 'التاريخ والجغرافيا', category: 'المواد الاجتماعية', weekly_hours: 2, coefficient: 2 },
        { id: 8, subject_name: 'التربية المدنية', category: 'المواد الاجتماعية', weekly_hours: 1, coefficient: 1 },
        { id: 9, subject_name: 'التربية الإسلامية', category: 'المواد الاجتماعية', weekly_hours: 1, coefficient: 2 },
        { id: 10, subject_name: 'التربية الفنية', category: 'مواد الإيقاظ', weekly_hours: 1, coefficient: 1 },
        { id: 11, subject_name: 'التربية البدنية', category: 'مواد الإيقاظ', weekly_hours: 2, coefficient: 1 },
        { id: 12, subject_name: 'الإعلام الآلي', category: 'مواد الإيقاظ', weekly_hours: 1, coefficient: 1 },
    ],
    '3AM': [
        { id: 1, subject_name: 'اللغة العربية', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 5 },
        { id: 2, subject_name: 'الرياضيات', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 4 },
        { id: 3, subject_name: 'اللغة الفرنسية', category: 'المواد الأساسية', weekly_hours: 4, coefficient: 3 },
        { id: 4, subject_name: 'اللغة الإنجليزية', category: 'المواد الأساسية', weekly_hours: 3, coefficient: 2 },
        { id: 5, subject_name: 'العلوم الطبيعية', category: 'المواد العلمية', weekly_hours: 2, coefficient: 2 },
        { id: 6, subject_name: 'العلوم الفيزيائية', category: 'المواد العلمية', weekly_hours: 2, coefficient: 2 },
        { id: 7, subject_name: 'التاريخ والجغرافيا', category: 'المواد الاجتماعية', weekly_hours: 2, coefficient: 2 },
        { id: 8, subject_name: 'التربية المدنية', category: 'المواد الاجتماعية', weekly_hours: 1, coefficient: 1 },
        { id: 9, subject_name: 'التربية الإسلامية', category: 'المواد الاجتماعية', weekly_hours: 1, coefficient: 2 },
        { id: 10, subject_name: 'التربية البدنية', category: 'مواد الإيقاظ', weekly_hours: 2, coefficient: 1 },
    ],
    '2AM': [
        { id: 1, subject_name: 'اللغة العربية', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 5 },
        { id: 2, subject_name: 'الرياضيات', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 4 },
        { id: 3, subject_name: 'اللغة الفرنسية', category: 'المواد الأساسية', weekly_hours: 4, coefficient: 3 },
        { id: 4, subject_name: 'اللغة الإنجليزية', category: 'المواد الأساسية', weekly_hours: 3, coefficient: 2 },
        { id: 5, subject_name: 'العلوم الطبيعية', category: 'المواد العلمية', weekly_hours: 1.5, coefficient: 2 },
        { id: 6, subject_name: 'العلوم الفيزيائية', category: 'المواد العلمية', weekly_hours: 1.5, coefficient: 2 },
        { id: 7, subject_name: 'التاريخ والجغرافيا', category: 'المواد الاجتماعية', weekly_hours: 2, coefficient: 2 },
        { id: 8, subject_name: 'التربية الإسلامية', category: 'المواد الاجتماعية', weekly_hours: 1, coefficient: 2 },
        { id: 9, subject_name: 'التربية البدنية', category: 'مواد الإيقاظ', weekly_hours: 2, coefficient: 1 },
    ],
    '1AM': [
        { id: 1, subject_name: 'اللغة العربية', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 5 },
        { id: 2, subject_name: 'الرياضيات', category: 'المواد الأساسية', weekly_hours: 5, coefficient: 4 },
        { id: 3, subject_name: 'اللغة الفرنسية', category: 'المواد الأساسية', weekly_hours: 4, coefficient: 3 },
        { id: 4, subject_name: 'اللغة الإنجليزية', category: 'المواد الأساسية', weekly_hours: 3, coefficient: 2 },
        { id: 5, subject_name: 'العلوم الطبيعية', category: 'المواد العلمية', weekly_hours: 1.5, coefficient: 2 },
        { id: 6, subject_name: 'التاريخ والجغرافيا', category: 'المواد الاجتماعية', weekly_hours: 2, coefficient: 2 },
        { id: 7, subject_name: 'التربية الإسلامية', category: 'المواد الاجتماعية', weekly_hours: 1, coefficient: 2 },
        { id: 8, subject_name: 'التربية البدنية', category: 'مواد الإيقاظ', weekly_hours: 2, coefficient: 1 },
    ],
};

// For years not explicitly listed, show an empty array
const getCurriculum = (year: string) => CURRICULUM[year] || [];

export const RepositoryConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState<RepoTab>('overview');
    const [selectedYear, setSelectedYear] = useState('4AM');

    const curriculum = getCurriculum(selectedYear);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <BookOpen className="text-emerald-600" size={32} />
                        المستودع التربوي الرقمي
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        قاعدة بيانات المناهج، التدرجات، والمعايير البيداغوجية الوطنية
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'overview', label: 'نظرة عامة', icon: Layout },
                    { id: 'wilayas', label: 'الولايات', icon: Map },
                    { id: 'subjects', label: 'المواد', icon: BookOpen },
                    { id: 'curriculum', label: 'المناهج', icon: Layers },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as RepoTab)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={Map} label="الولايات" value={`${WILAYAS.length} ولاية`} color="bg-blue-500" />
                        <StatCard icon={Layers} label="الأطوار والمستويات" value="3 أطوار" color="bg-purple-500" />
                        <StatCard icon={BookOpen} label="المواد التعليمية" value="23 مادة" color="bg-emerald-500" />
                        <StatCard icon={Server} label="وحدات المناهج" value={`${curriculum.length} وحدة`} color="bg-amber-500" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                                <Database size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">حالة البيانات</h3>
                        </div>
                        <div className="space-y-4">
                            <RepoStatusItem label="الولايات (58 ولاية)" status="active" />
                            <RepoStatusItem label="المواد (العربية، الفرنسية...)" status="active" />
                            <RepoStatusItem label="المعاملات والتوقيت (2024-2025)" status="active" />
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'wilayas' && (
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold text-sm">
                            <tr>
                                <th className="p-4">الرمز</th>
                                <th className="p-4">الولاية (عربي)</th>
                                <th className="p-4">الولاية (لاتيني)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {WILAYAS.map((w) => (
                                <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-emerald-600">{w.code}</td>
                                    <td className="p-4 font-bold">{w.name_ar}</td>
                                    <td className="p-4 text-slate-500">{w.name_en}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'curriculum' && (
                <div className="space-y-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['1AP', '2AP', '3AP', '4AP', '5AP', '1AM', '2AM', '3AM', '4AM', '1AS', '2AS', '3AS'].map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedYear === year
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold text-sm">
                                <tr>
                                    <th className="p-4">المادة</th>
                                    <th className="p-4">الفئة</th>
                                    <th className="p-4">الحجم الساعي</th>
                                    <th className="p-4">المعامل</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {curriculum.length > 0 ? (
                                    curriculum.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="p-4 font-bold flex items-center gap-2">
                                                <Bookmark size={16} className="text-emerald-500" />
                                                {c.subject_name}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    {c.category}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono font-bold">{c.weekly_hours} سا</td>
                                            <td className="p-4 font-mono font-bold text-emerald-600">{c.coefficient}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400 font-bold">
                                            لا توجد بيانات لهذه السنة الدراسية
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'subjects' && (
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 text-center">
                    <p className="text-slate-500 font-bold">يتم عرض المواد ضمن تبويب "المناهج" حسب السنة.</p>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-[4rem] transition-all group-hover:scale-110`}></div>
        <div className="relative z-10">
            <div className={`w-12 h-12 ${color} bg-opacity-10 text-white rounded-2xl flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-gray-800 dark:text-white" />
            </div>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-1 font-mono">{value}</h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const RepoStatusItem = ({ label, status }: { label: string; status: 'active' | 'pending' }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
        <span className="font-bold text-slate-700 dark:text-slate-300">{label}</span>
        <div className={`px-3 py-1 rounded-full text-xs font-black ${status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'}`}>
            {status === 'active' ? 'تم التحميل' : 'قيد الإنجاز'}
        </div>
    </div>
);

export default RepositoryConfig;
