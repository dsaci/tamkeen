
import React, { useEffect, useState } from 'react';
import {
  Users, Search, LogOut, LayoutDashboard, Shield, Mail, Calendar, Loader2, Upload, FileJson, CheckCircle
} from 'lucide-react';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

export default function AdminDashboard({ session }: { session: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!isElectron) {
      setLoading(false);
      return;
    }

    try {
      const data = await window.electronAPI.auth.getAllUsers();
      setUsers(data || []);
    } catch (e) {
      console.error('Data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isElectron) {
      await window.electronAPI.auth.logout();
      window.location.reload();
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setLoading(true);
          // Call backend import
          const success = await window.electronAPI.admin.importData(json);
          if (success) {
            alert('تم استيراد البيانات بنجاح!');
            fetchData(); // Refresh data
          } else {
            alert('فشل استيراد البيانات. تحقق من صحة الملف.');
          }
        } catch (error) {
          console.error('Import error:', error);
          alert('ملف غير صالح.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filteredUsers = users.filter(u =>
    (u.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.role?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" dir="ltr">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Local Database</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300 hidden md:inline">{session?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-800 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-slate-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold">Total Users</p>
              <h3 className="text-3xl font-black text-slate-800">{users.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold">Admins</p>
              <h3 className="text-3xl font-black text-slate-800">
                {users.filter(u => u.role === 'admin').length}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold">Teachers</p>
              <h3 className="text-3xl font-black text-slate-800">
                {users.filter(u => u.role === 'teacher').length}
              </h3>
            </div>
          </div>
        </div>

        {/* Import Data Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileJson className="text-blue-500" />
              استيراد بيانات الأساتذة
            </h3>
            <p className="text-slate-500 text-sm">قم برفع ملف البيانات (JSON) الخاص بالأستاذ لدمجه في قاعدة البيانات.</p>
          </div>
          <button
            onClick={handleImportData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Upload size={18} />
            استيراد ملف
          </button>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">User Management</h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or role..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">User</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400">
                      <div className="flex justify-center gap-2 items-center">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 italic">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{user.full_name || 'Unnamed User'}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail size={12} /> {user.email || 'No Email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                          {user.role || 'teacher'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
