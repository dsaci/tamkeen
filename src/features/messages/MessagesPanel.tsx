/**
 * MessagesPanel
 * Messaging system for admin-to-teacher communication.
 * - Admin: compose messages to individual or all users (broadcast)
 * - Teachers: inbox with read/unread messages
 * - Both: view message thread
 * 
 * Uses Supabase client directly (RLS enforced).
 * Only usable in hybrid/cloud modes.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getSupabaseClient } from '../../config/supabaseClient';
import {
    Mail, Send, Inbox, Trash2, X, Check, ChevronLeft, Users,
    Loader2, AlertTriangle, MessageSquare, Eye, EyeOff, RefreshCw, Radio
} from 'lucide-react';

interface Message {
    id: string;
    sender_id: string;
    recipient_id: string;
    subject: string;
    body: string;
    read: boolean;
    created_at: string;
    sender_name?: string;
}

interface UserTarget {
    id: string;
    email: string;
    full_name: string | null;
}

type View = 'inbox' | 'compose' | 'read';

export const MessagesPanel: React.FC = () => {
    const { user, isAdmin, mode } = useAuth();
    const { refresh: refreshNotifs } = useNotifications();
    const [view, setView] = useState<View>('inbox');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Compose state
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [composeRecipient, setComposeRecipient] = useState('');
    const [isBroadcast, setIsBroadcast] = useState(false);
    const [sending, setSending] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<UserTarget[]>([]);

    const client = getSupabaseClient();

    const fetchMessages = useCallback(async () => {
        if (!client || !user) return;
        setLoading(true);
        try {
            // Get received messages
            const { data: received, error: recvErr } = await client
                .from('messages')
                .select('*')
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false });

            if (recvErr) throw recvErr;

            // Enrich with sender names
            const senderIds = [...new Set((received || []).map(m => m.sender_id))];
            let senderMap: Record<string, string> = {};

            if (senderIds.length > 0 && isAdmin) {
                // Admins can see sender profiles via is_admin() policy
                const { data: profiles } = await client
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', senderIds);
                if (profiles) {
                    senderMap = Object.fromEntries(profiles.map(p => [p.id, p.full_name || 'مجهول']));
                }
            }

            const enriched = (received || []).map(m => ({
                ...m,
                sender_name: senderMap[m.sender_id] || 'المسؤول',
            }));

            setMessages(enriched);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [client, user, isAdmin]);

    const fetchUsers = useCallback(async () => {
        if (!client || !isAdmin) return;
        try {
            const { data } = await client
                .from('profiles')
                .select('id, email, full_name')
                .order('full_name');
            setAvailableUsers(data || []);
        } catch { /* ignore */ }
    }, [client, isAdmin]);

    useEffect(() => {
        if (mode !== 'offline') {
            fetchMessages();
            if (isAdmin) fetchUsers();
        }
    }, [mode, fetchMessages, fetchUsers, isAdmin]);

    const markAsRead = async (msg: Message) => {
        if (!client || msg.read) return;
        try {
            await client.from('messages').update({ read: true }).eq('id', msg.id);
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
            // Update the global bell count
            refreshNotifs();
        } catch { /* ignore */ }
    };

    const openMessage = (msg: Message) => {
        setSelectedMessage(msg);
        setView('read');
        markAsRead(msg);
    };

    const sendMessage = async () => {
        if (!client || !user) return;
        if (!composeSubject.trim() || !composeBody.trim()) {
            setError('يرجى ملء الموضوع والرسالة');
            return;
        }

        setSending(true);
        setError('');

        try {
            if (isBroadcast) {
                // Send to all users
                const targets = availableUsers.filter(u => u.id !== user.id);
                const rows = targets.map(t => ({
                    sender_id: user.id,
                    recipient_id: t.id,
                    subject: composeSubject,
                    body: composeBody,
                }));

                if (rows.length === 0) {
                    setError('لا يوجد مستخدمين لإرسال الرسالة إليهم');
                    setSending(false);
                    return;
                }

                const { error } = await client.from('messages').insert(rows);
                if (error) throw error;
            } else {
                // Send to single recipient
                if (!composeRecipient) {
                    setError('يرجى اختيار المستلم');
                    setSending(false);
                    return;
                }

                const { error } = await client.from('messages').insert({
                    sender_id: user.id,
                    recipient_id: composeRecipient,
                    subject: composeSubject,
                    body: composeBody,
                });
                if (error) throw error;
            }

            setSuccess('تم إرسال الرسالة بنجاح');
            setComposeSubject('');
            setComposeBody('');
            setComposeRecipient('');
            setIsBroadcast(false);
            setView('inbox');
            fetchMessages();
            refreshNotifs(); // Update bell for sender if needed
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSending(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const formatDate = (d: string) => {
        return new Date(d).toLocaleDateString('ar-DZ', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const unreadCount = messages.filter(m => !m.read).length;

    if (mode === 'offline') {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 text-center border border-slate-100 dark:border-slate-700">
                <Mail size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-600 dark:text-slate-300 mb-2">الرسائل غير متاحة</h3>
                <p className="text-sm text-slate-400">يتطلب الوضع السحابي (hybrid أو cloud) لاستخدام نظام الرسائل.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-2xl">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">الرسائل</h2>
                            <p className="text-xs text-slate-500">
                                {unreadCount > 0 ? `${unreadCount} رسالة جديدة` : 'لا توجد رسائل جديدة'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <button
                                onClick={() => { setView('compose'); setError(''); }}
                                className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-2xl font-black text-sm hover:bg-violet-700 active:scale-95 transition-all"
                            >
                                <Send size={14} /> إنشاء رسالة
                            </button>
                        )}
                        <button onClick={fetchMessages} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                            <RefreshCw size={18} className={`text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
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

            {/* Compose View */}
            {view === 'compose' && isAdmin && (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">رسالة جديدة</h3>
                        <button onClick={() => setView('inbox')} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 transition-all">
                            <ChevronLeft size={18} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Broadcast toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsBroadcast(!isBroadcast)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black transition-all ${isBroadcast
                                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                }`}
                        >
                            <Radio size={14} />
                            {isBroadcast ? 'بث جماعي (جميع المستخدمين)' : 'رسالة فردية'}
                        </button>
                    </div>

                    {!isBroadcast && (
                        <div>
                            <label className="block text-xs font-black text-slate-500 mb-2">المستلم</label>
                            <select
                                value={composeRecipient}
                                onChange={(e) => setComposeRecipient(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                            >
                                <option value="">اختر المستلم...</option>
                                {availableUsers.filter(u => u.id !== user?.id).map(u => (
                                    <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-2">الموضوع</label>
                        <input
                            value={composeSubject}
                            onChange={(e) => setComposeSubject(e.target.value)}
                            placeholder="موضوع الرسالة..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-2">نص الرسالة</label>
                        <textarea
                            value={composeBody}
                            onChange={(e) => setComposeBody(e.target.value)}
                            placeholder="اكتب رسالتك هنا..."
                            rows={6}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={sendMessage}
                        disabled={sending}
                        className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-violet-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {isBroadcast ? 'إرسال للجميع' : 'إرسال'}
                    </button>
                </div>
            )}

            {/* Read Message View */}
            {view === 'read' && selectedMessage && (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => { setView('inbox'); setSelectedMessage(null); }}
                            className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            <ChevronLeft size={16} /> العودة للبريد
                        </button>
                    </div>
                    <div className="border-b border-slate-100 dark:border-slate-700 pb-5">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{selectedMessage.subject}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>من: <strong className="text-slate-700 dark:text-slate-300">{selectedMessage.sender_name || 'المسؤول'}</strong></span>
                            <span>•</span>
                            <span>{formatDate(selectedMessage.created_at)}</span>
                        </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                            {selectedMessage.body}
                        </p>
                    </div>
                </div>
            )}

            {/* Inbox View */}
            {view === 'inbox' && (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 size={32} className="animate-spin text-violet-500 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-400">جاري التحميل...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="p-12 text-center">
                            <Inbox size={32} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-400">صندوق البريد فارغ</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {messages.map(msg => (
                                <button
                                    key={msg.id}
                                    onClick={() => openMessage(msg)}
                                    className={`w-full text-right px-8 py-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-start gap-4 ${!msg.read ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}
                                >
                                    <div className={`mt-1 p-2 rounded-xl ${!msg.read ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                        {!msg.read ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-3 mb-1">
                                            <h4 className={`text-sm truncate ${!msg.read ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-600 dark:text-slate-300'}`}>
                                                {msg.subject}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatDate(msg.created_at)}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{msg.body}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">من: {msg.sender_name || 'المسؤول'}</p>
                                    </div>
                                    {!msg.read && <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
