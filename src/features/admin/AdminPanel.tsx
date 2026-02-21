/**
 * AdminPanel
 * Admin-only dashboard for managing users.
 * - List all users with search + role filter
 * - Edit user (email, phone, role, name)
 * - Disable/Enable user (soft delete)
 * - Trigger password reset
 * 
 * Communicates with the admin-users Edge Function via authenticated fetch.
 * Only accessible when profile.role === 'admin' and MODE !== 'offline'.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getSupabaseClient } from '../../config/supabaseClient';
import {
    Users, Search, Filter, Edit3, Ban, RefreshCw, Shield, ShieldCheck,
    Mail, Phone, Calendar, X, Check, AlertTriangle, UserX, UserCheck, Loader2,
    Bell, Megaphone
} from 'lucide-react';

interface AdminUser {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: string;
    created_at: string;
    updated_at: string | null;
    last_sign_in_at: string | null;
    disabled: boolean;
}

export const AdminPanel: React.FC = () => {
    const auth = useAuth();
    const { isAdmin, mode } = auth;
    const { refresh } = useNotifications();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({ email: '', phone: '', role: '', full_name: '' });
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getEdgeFunctionUrl = () => {
        const url = import.meta.env.VITE_SUPABASE_URL;
        return `${url}/functions/v1/admin-users`;
    };

    const getAuthHeaders = async () => {
        const client = getSupabaseClient();
        if (!client) return {};
        const { data: { session } } = await client.auth.getSession();
        return {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        };
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const headers = await getAuthHeaders();
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (roleFilter) params.set('role', roleFilter);

            const res = await fetch(`${getEdgeFunctionUrl()}?${params}`, { headers });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
            setUsers(data.users || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter]);

    useEffect(() => {
        if (isAdmin && mode !== 'offline') {
            fetchUsers();
        }
    }, [isAdmin, mode, fetchUsers]);

    const handleEdit = (user: AdminUser) => {
        setEditingUser(user);
        setEditForm({
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'teacher',
            full_name: user.full_name || '',
        });
    };

    const saveEdit = async () => {
        if (!editingUser) return;
        setActionLoading(editingUser.id);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch(`${getEdgeFunctionUrl()}/${editingUser.id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess('تم تحديث المستخدم بنجاح');
            setEditingUser(null);
            fetchUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const toggleDisable = async (user: AdminUser) => {
        setActionLoading(user.id);
        const action = user.disabled ? 'enable' : 'disable';
        try {
            const headers = await getAuthHeaders();
            const res = await fetch(`${getEdgeFunctionUrl()}/${user.id}/${action}`, {
                method: 'POST',
                headers,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess(user.disabled ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب');
            fetchUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const resetPassword = async (user: AdminUser) => {
        setActionLoading(user.id);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch(`${getEdgeFunctionUrl()}/${user.id}/reset-password`, {
                method: 'POST',
                headers,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    // Guard: offline mode or not admin
    if (mode === 'offline') {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 text-center border border-slate-100 dark:border-slate-700">
                <Shield size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-600 dark:text-slate-300 mb-2">لوحة الإدارة غير متاحة</h3>
                <p className="text-sm text-slate-400">يتطلب الوضع السحابي (hybrid أو cloud) لاستخدام لوحة الإدارة.</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 text-center border border-slate-100 dark:border-slate-700">
                <Ban size={48} className="text-rose-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-rose-600 mb-2">غير مصرح</h3>
                <p className="text-sm text-slate-400">هذه اللوحة مخصصة للمسؤولين فقط.</p>
            </div>
        );
    }

    const formatDate = (d: string | null) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">لوحة إدارة المستخدمين</h2>
                            <p className="text-xs text-slate-500">{users.length} مستخدم مسجل</p>
                        </div>
                    </div>
                    <button onClick={fetchUsers} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                        <RefreshCw size={18} className={`text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="بحث بالبريد أو الاسم..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">جميع الأدوار</option>
                        <option value="teacher">أستاذ</option>
                        <option value="admin">مسؤول</option>
                    </select>
                </div>
            </div>

            {/* Broadcast Notification Section */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">إرسال تنبيه عام</h3>
                        <p className="text-xs text-slate-500">سيظهر هذا التنبيه لجميع المستخدمين في أعلى الشاشة بشكل جذاب</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="عنوان التنبيه (اختياري)..."
                            id="notif_title"
                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                        <textarea
                            placeholder="نص الرسالة... (كن مقتضباً وجذاباً)"
                            id="notif_message"
                            rows={3}
                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                        ></textarea>
                    </div>
                    <div className="flex flex-col justify-end gap-3">
                        <button
                            onClick={async () => {
                                const title = (document.getElementById('notif_title') as HTMLInputElement).value;
                                const message = (document.getElementById('notif_message') as HTMLTextAreaElement).value;
                                if (!message) return alert('يرجى كتابة نص الرسالة أولاً');

                                setActionLoading('sending_notif');
                                try {
                                    const client = getSupabaseClient();
                                    if (!client) throw new Error('Supabase client not initialized');

                                    const { error } = await client
                                        .from('admin_notifications')
                                        .insert({
                                            title,
                                            message,
                                            is_active: true,
                                            sent_by: auth.user?.id
                                        });

                                    if (error) throw error;
                                    setSuccess('تم إرسال التنبيه لجميع المستخدمين بنجاح 🚀');
                                    // Refresh local notifications count
                                    refresh();
                                    // Clear fields
                                    (document.getElementById('notif_title') as HTMLInputElement).value = '';
                                    (document.getElementById('notif_message') as HTMLTextAreaElement).value = '';
                                } catch (err: any) {
                                    setError('فشل إرسال التنبيه: ' + err.message);
                                } finally {
                                    setActionLoading(null);
                                    setTimeout(() => setSuccess(''), 5000);
                                }
                            }}
                            disabled={actionLoading === 'sending_notif'}
                            className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black hover:bg-rose-700 active:scale-95 transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20 flex items-center justify-center gap-3"
                        >
                            {actionLoading === 'sending_notif' ? <Loader2 size={20} className="animate-spin" /> : <Megaphone size={20} />}
                            بث التنبيه الآن
                        </button>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-rose-600" />
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-400">{error}</p>
                    <button onClick={() => setError('')} className="mr-auto"><X size={16} className="text-rose-400" /></button>
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
                    <Check size={18} className="text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{success}</p>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 size={32} className="animate-spin text-indigo-500 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-400">جاري التحميل...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users size={32} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-400">لا يوجد مستخدمين</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                    <th className="text-right px-6 py-4 font-black text-slate-600 dark:text-slate-300">المستخدم</th>
                                    <th className="text-right px-6 py-4 font-black text-slate-600 dark:text-slate-300">الهاتف</th>
                                    <th className="text-right px-6 py-4 font-black text-slate-600 dark:text-slate-300">الدور</th>
                                    <th className="text-right px-6 py-4 font-black text-slate-600 dark:text-slate-300">التسجيل</th>
                                    <th className="text-right px-6 py-4 font-black text-slate-600 dark:text-slate-300">آخر دخول</th>
                                    <th className="text-right px-6 py-4 font-black text-slate-600 dark:text-slate-300">الحالة</th>
                                    <th className="text-center px-6 py-4 font-black text-slate-600 dark:text-slate-300">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-black text-slate-900 dark:text-white">{u.full_name || '—'}</p>
                                            <p className="text-xs text-slate-400 mt-1">{u.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs">{u.phone || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${u.role === 'admin'
                                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                }`}>
                                                {u.role === 'admin' ? <ShieldCheck size={12} /> : null}
                                                {u.role === 'admin' ? 'مسؤول' : 'أستاذ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(u.created_at)}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(u.last_sign_in_at)}</td>
                                        <td className="px-6 py-4">
                                            {u.disabled ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                                                    <UserX size={12} /> معطل
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-green-100 dark:bg-green-900/30 text-green-600">
                                                    <UserCheck size={12} /> نشط
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(u)}
                                                    className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all"
                                                    title="تعديل"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => toggleDisable(u)}
                                                    disabled={actionLoading === u.id}
                                                    className={`p-2 rounded-xl transition-all ${u.disabled
                                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100'
                                                        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100'}`}
                                                    title={u.disabled ? 'تفعيل' : 'تعطيل'}
                                                >
                                                    {actionLoading === u.id ? <Loader2 size={14} className="animate-spin" /> : (u.disabled ? <UserCheck size={14} /> : <Ban size={14} />)}
                                                </button>
                                                <button
                                                    onClick={() => resetPassword(u)}
                                                    disabled={actionLoading === u.id}
                                                    className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
                                                    title="إعادة تعيين كلمة المرور"
                                                >
                                                    <RefreshCw size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">تعديل المستخدم</h3>
                            <button onClick={() => setEditingUser(null)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 transition-all">
                                <X size={18} className="text-slate-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2">الاسم الكامل</label>
                                <input
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm(p => ({ ...p, full_name: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={editForm.email}
                                        onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))}
                                        className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2">الهاتف</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))}
                                        className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2">الدور</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm(p => ({ ...p, role: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="teacher">أستاذ</option>
                                    <option value="admin">مسؤول</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={saveEdit}
                                disabled={actionLoading === editingUser.id}
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-black hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {actionLoading === editingUser.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                حفظ التغييرات
                            </button>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
