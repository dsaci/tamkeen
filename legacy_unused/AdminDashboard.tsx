import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.client';
import {
  Users, Search, LogOut, Send, MessageSquare,
  CheckCircle2, X, Loader2, Calendar, Shield, Mail, Database
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  created_at: string;
  metadata?: any;
}

export default function AdminDashboard({ session }: { session: any }) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Messaging State
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch users error:', error);
        throw error;
      }

      setUsers(data || []);
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !msgTitle || !msgContent) return;

    setSending(true);
    try {
      const { error } = await supabase.from('admin_messages').insert({
        from_admin: session.user.id,
        to_user: selectedUser.id,
        title: msgTitle,
        content: msgContent,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedUser(null);
        setMsgTitle('');
        setMsgContent('');
      }, 2000);
    } catch (err) {
      alert('Failed to send message');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter(u =>
    (u.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.role?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-['Cairo']">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sticky top-0 z-30 shadow-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl">Tamkeen Admin</h1>
              <p className="text-xs text-slate-300 font-medium">لوحة التحكم الإدارية</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-2.5 rounded-xl transition-all text-sm font-bold shadow-lg hover:shadow-xl"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">

        {/* Stats / Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md">
              <Users size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">إجمالي المستخدمين</p>
              <h3 className="text-3xl font-black text-slate-800">{users.length}</h3>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-slate-700 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">المستخدم</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">الدور</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">تاريخ الانضمام</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400">
                      <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                      <p className="font-bold">جاري تحميل البيانات...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400">
                      <Database className="mx-auto mb-3 text-slate-300" size={48} />
                      <p className="font-bold text-lg">لا يوجد مستخدمون</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-white text-lg shadow-md">
                            {(user.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{user.full_name || 'بدون اسم'}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {user.email || 'لا يوجد بريد'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase ${user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                            : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                          }`}>
                          {user.role || 'teacher'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400" />
                          {new Date(user.created_at).toLocaleDateString('ar-DZ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          إرسال رسالة
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Message Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <MessageSquare className="text-indigo-600" />
                إرسال رسالة
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {success ? (
              <div className="py-12 flex flex-col items-center text-center text-emerald-600">
                <CheckCircle2 size={56} className="mb-4" />
                <h4 className="text-2xl font-bold">تم الإرسال بنجاح!</h4>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">إلى:</span>
                  <p className="font-bold text-slate-800 mt-1">{selectedUser.full_name} <span className="text-slate-400 font-normal text-sm">({selectedUser.email})</span></p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">الموضوع</label>
                  <input
                    type="text"
                    required
                    value={msgTitle}
                    onChange={e => setMsgTitle(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-slate-800"
                    placeholder="تحديث مهم..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">الرسالة</label>
                  <textarea
                    required
                    value={msgContent}
                    onChange={e => setMsgContent(e.target.value)}
                    rows={5}
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 resize-none font-medium"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    إرسال
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
