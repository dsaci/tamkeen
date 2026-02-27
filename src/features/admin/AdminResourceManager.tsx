import React, { useState, useEffect, useRef } from 'react';
import {
    Database, Plus, Trash2, Edit3, Upload, Search, X, Save,
    FileText, Film, Loader2, BarChart3, BookOpen, Check, AlertTriangle
} from 'lucide-react';
import { TeacherProfile, Resource, ResourceFile } from '../../types';
import {
    listResources, addResource, updateResource, deleteResource,
    uploadFile, deleteFile
} from '../../services/resourceBankService';

interface Props {
    profile: TeacherProfile;
}

const AdminResourceManager: React.FC<Props> = ({ profile }) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [uploadingFor, setUploadingFor] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        subject: profile.teachingSubject || '',
        level: profile.level,
        grade: profile.grades?.[0] || '',
        unit: '',
        activity: '',
        title: '',
        objective: '',
        content: '',
        tools: '',
        method: '',
        source: 'admin' as const,
    });

    useEffect(() => {
        loadResources();
    }, [filterSubject, filterGrade]);

    const loadResources = async () => {
        setIsLoading(true);
        const results = await listResources({
            subject: filterSubject || undefined,
            level: profile.level,
            grade: filterGrade || undefined,
            search: searchTerm || undefined,
        });
        setResources(results);
        setIsLoading(false);
    };

    const resetForm = () => {
        setForm({
            subject: profile.teachingSubject || '',
            level: profile.level,
            grade: profile.grades?.[0] || '',
            unit: '',
            activity: '',
            title: '',
            objective: '',
            content: '',
            tools: '',
            method: '',
            source: 'admin',
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSave = async () => {
        if (!form.title || !form.subject || !form.activity) {
            alert('يرجى ملء الحقول الإجبارية: المادة، النشاط، العنوان');
            return;
        }

        setIsSaving(true);

        if (editingId) {
            const success = await updateResource(editingId, form);
            if (success) {
                await loadResources();
                resetForm();
            } else {
                alert('فشل التعديل');
            }
        } else {
            const result = await addResource(form);
            if (result) {
                await loadResources();
                resetForm();
            } else {
                alert('فشل الإضافة');
            }
        }

        setIsSaving(false);
    };

    const handleEdit = (resource: Resource) => {
        setForm({
            subject: resource.subject,
            level: resource.level,
            grade: resource.grade,
            unit: resource.unit || '',
            activity: resource.activity,
            title: resource.title,
            objective: resource.objective || '',
            content: resource.content || '',
            tools: resource.tools || '',
            method: resource.method || '',
            source: resource.source,
        });
        setEditingId(resource.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المورد؟ سيتم حذف جميع ملفاته أيضاً.')) return;
        const success = await deleteResource(id);
        if (success) {
            setResources(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingFor) return;

        // Validate size (50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('حجم الملف يتجاوز 50MB');
            return;
        }

        const result = await uploadFile(uploadingFor, file);
        if (result) {
            await loadResources();
            alert(`✅ تم رفع ${file.name} بنجاح`);
        } else {
            alert('فشل رفع الملف. تأكد من تفعيل Storage في Supabase.');
        }

        setUploadingFor(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDeleteFile = async (fileId: string) => {
        if (!confirm('حذف هذا الملف؟')) return;
        await deleteFile(fileId);
        await loadResources();
    };

    const stats = {
        total: resources.length,
        admin: resources.filter(r => r.source === 'admin').length,
        ai: resources.filter(r => r.source === 'ai').length,
        totalUsage: resources.reduce((sum, r) => sum + r.usage_count, 0),
    };

    return (
        <div className="space-y-6 font-['Cairo']" dir="rtl">
            {/* Header + Stats */}
            <div className="bg-[#0f172a] p-6 rounded-[2.5rem] text-white">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <Database size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">إدارة بنك الموارد</h3>
                            <p className="text-xs text-slate-400 font-bold">لوحة تحكم الأدمن</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg border-b-4 border-emerald-800"
                    >
                        <Plus size={18} /> إضافة مورد
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                        <p className="text-2xl font-black text-white">{stats.total}</p>
                        <p className="text-[10px] text-slate-400 font-bold">مورد إجمالي</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                        <p className="text-2xl font-black text-emerald-400">{stats.admin}</p>
                        <p className="text-[10px] text-slate-400 font-bold">مصدر رسمي</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                        <p className="text-2xl font-black text-amber-400">{stats.ai}</p>
                        <p className="text-[10px] text-slate-400 font-bold">توليد آلي</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                        <p className="text-2xl font-black text-violet-400">{stats.totalUsage}</p>
                        <p className="text-[10px] text-slate-400 font-bold">استخدام إجمالي</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap gap-3">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="بحث في الموارد..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && loadResources()}
                        className="w-full pr-12 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none dark:text-white"
                    />
                </div>
                <select
                    value={filterGrade}
                    onChange={e => setFilterGrade(e.target.value)}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none dark:text-white"
                >
                    <option value="">كل المستويات</option>
                    {profile.grades?.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.mp4,.webm"
            />

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-2 border-emerald-200 dark:border-emerald-800 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                            {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
                            {editingId ? 'تعديل مورد' : 'إضافة مورد جديد'}
                        </h3>
                        <button onClick={resetForm} className="p-2 text-slate-400 hover:text-rose-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400">المادة *</label>
                            <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400">المستوى *</label>
                            <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white">
                                {profile.grades?.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400">النشاط *</label>
                            <input type="text" value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white" placeholder="فهم المنطوق، قراءة..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400">المقطع / الوحدة</label>
                            <input type="text" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white" placeholder="المقطع الأول: القيم..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400">عنوان الحصة *</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white" placeholder="عنوان الدرس بدقة" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400">الهدف التعلمي</label>
                        <input type="text" value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400">سير الحصة / المحتوى</label>
                        <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white resize-y" placeholder="وضعية الانطلاق... بناء التعلمات... استثمار المكتسبات..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400">الوسائل</label>
                            <input type="text" value={form.tools} onChange={e => setForm({ ...form, tools: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white" placeholder="الكتاب المدرسي، السبورة..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400">الطريقة البيداغوجية</label>
                            <input type="text" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm outline-none dark:text-white" placeholder="حوار، عمل فردي..." />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition disabled:opacity-50 border-b-4 border-emerald-800"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {editingId ? 'حفظ التعديلات' : 'إضافة المورد'}
                    </button>
                </div>
            )}

            {/* Resources Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80">
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">#</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">العنوان</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">النشاط</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">المستوى</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">المصدر</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">استخدام</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">ملفات</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-500">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan={8} className="py-16 text-center"><Loader2 className="animate-spin text-slate-300 mx-auto" size={32} /></td></tr>
                            ) : resources.length === 0 ? (
                                <tr><td colSpan={8} className="py-16 text-center text-slate-400 font-bold italic">لا توجد موارد</td></tr>
                            ) : resources.map((r, idx) => (
                                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{idx + 1}</td>
                                    <td className="px-6 py-4 font-bold text-sm text-slate-900 dark:text-white max-w-[200px] truncate">{r.title}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{r.activity}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{r.grade}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black ${r.source === 'admin' ? 'bg-emerald-100 text-emerald-700' :
                                            r.source === 'ai' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {r.source === 'admin' ? 'رسمي' : r.source === 'ai' ? 'آلي' : 'مستخدم'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-500">{r.usage_count}×</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            {r.files && r.files.map(f => (
                                                <div key={f.id} className="group relative">
                                                    <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex">
                                                        {f.media_type === 'video' ? <Film size={12} className="text-rose-500" /> : <FileText size={12} className="text-blue-500" />}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteFile(f.id)}
                                                        className="absolute -top-1 -left-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[8px] hidden group-hover:flex items-center justify-center"
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(r)}
                                                className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl hover:bg-indigo-100 transition"
                                                title="تعديل"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => { setUploadingFor(r.id); fileInputRef.current?.click(); }}
                                                className="p-2 bg-violet-50 dark:bg-violet-900/30 text-violet-600 rounded-xl hover:bg-violet-100 transition"
                                                title="رفع ملف"
                                            >
                                                <Upload size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(r.id)}
                                                className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl hover:bg-rose-100 transition"
                                                title="حذف"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminResourceManager;
