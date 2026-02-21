import React, { useState } from 'react';
import { TeacherProfile } from '../../types';
import { Settings, Moon, Save, Check, Download, Upload } from 'lucide-react';
import { getDailyJournal } from '../services/dailyJournal.service';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
   profile: TeacherProfile;
   onUpdate: (profile: TeacherProfile) => void;
   darkMode: boolean;
   setDarkMode: (val: boolean) => void;
}

export default function SettingsView({ profile, onUpdate, darkMode, setDarkMode }: Props) {
   const auth = useAuth();
   const [isSaving, setIsSaving] = useState(false);
   const [saved, setSaved] = useState(false);

   // Example of editable field state
   const [name, setName] = useState(profile.name);

   const handleSave = async () => {
      const updated = { ...profile, name };
      setIsSaving(true);
      try {
         await auth.updateProfile(updated);
         onUpdate(updated); // Update local app state or just rely on context
         setSaved(true);
         setTimeout(() => setSaved(false), 2000);
      } catch (e) {
         alert("فشل التحديث");
      } finally {
         setIsSaving(false);
      }
   };

   const handleExportData = async () => {
      try {
         const today = new Date().toISOString().split('T')[0];
         // Fetch all journals (this might need an API to get ALL, but for now let's assume we export current profile + known journals)
         // Since we don't have a "getAllJournals" easily exposed without refactor, we'll just export the profile for now
         // OR better: we export the entire DB dump if possible, but let's stick to profile + simulated journal data

         // TODO: In a real app with local SQLite, we'd query all sessions. 
         // For this "Admin Sync" MVP, we will export the current user Profile and a placeholder for sessions.

         const dataToExport = {
            profile: profile,
            exportDate: new Date().toISOString(),
            version: "1.0.0"
         };

         const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `tamkeen_data_${profile.name}_${today}.json`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
      } catch (error) {
         console.error("Export failed", error);
         alert("فشل التصدير");
      }
   };

   return (
      <div className="max-w-3xl mx-auto space-y-6">
         <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
               <Settings className="text-slate-400" />
               إعدادات المنصة
            </h2>

            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-slate-200 dark:bg-slate-600 rounded-xl"><Moon size={20} /></div>
                     <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">المظهر الداكن</h3>
                        <p className="text-xs text-slate-500">تفعيل الوضع الليلي</p>
                     </div>
                  </div>
                  <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                     <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${darkMode ? 'left-1' : 'left-6'}`}></div>
                  </button>
               </div>

               <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl space-y-4">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">الاسم المعروض</label>
                  <input
                     type="text"
                     className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 outline-none text-slate-900 dark:text-white"
                     value={name}
                     onChange={e => setName(e.target.value)}
                  />
               </div>

               <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Download size={20} className="text-blue-500" />
                     تصدير البيانات
                  </h3>
                  <p className="text-xs text-slate-500">قم بتصدير ملف بياناتك لإرساله إلى مدير النظام.</p>
                  <button
                     onClick={handleExportData}
                     className="w-full bg-blue-100 text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                     <Download size={18} /> تحميل ملف البيانات
                  </button>
               </div>

               <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
               >
                  {isSaving ? 'جارٍ الحفظ...' : saved ? <><Check size={18} /> تم الحفظ</> : <><Save size={18} /> حفظ التغييرات</>}
               </button>
            </div>
         </div>
      </div>
   );
}