import React from 'react';
import { TeacherProfile } from '../../types';
import { BarChart3, Clock, Calendar, TrendingUp } from 'lucide-react';

export default function DashboardView({ profile }: { profile: TeacherProfile }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                   <Clock size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">ساعات العمل هذا الشهر</h3>
                   <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">24 <span className="text-sm font-bold text-slate-400">ساعة</span></p>
                </div>
             </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                   <Calendar size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">الحصص المنجزة</h3>
                   <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">12 <span className="text-sm font-bold text-slate-400">حصة</span></p>
                </div>
             </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">نسبة التقدم السنوي</h3>
                   <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">15%</p>
                </div>
             </div>
          </div>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-emerald-500"/>
              إحصائيات الأداء البيداغوجي
            </h3>
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-bold bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
               <p>بيانات بيانية قريباً</p>
            </div>
         </div>
         <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">مرحباً، أ. {profile.name}</h3>
              <p className="opacity-90 mb-8 font-medium">نتمنى لك يوماً دراسياً موفقاً ومليئاً بالإنجاز.</p>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <p className="text-sm font-bold">تذكير سريع:</p>
                <p className="text-xs mt-1 opacity-80">لا تنس ملء الكراس اليومي لحصص اليوم.</p>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
         </div>
       </div>
    </div>
  );
}