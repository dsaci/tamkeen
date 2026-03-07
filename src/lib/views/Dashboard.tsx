import React from 'react';
import { TeacherProfile } from '../../types';
import { BarChart3, Clock, Calendar, TrendingUp, Lightbulb, CheckCircle2, BookOpen, Landmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useJournalEntries } from '../../features/journal/hooks/useJournalEntries';
import { AdminPanel } from '../../features/admin/AdminPanel';

export default function DashboardView({ profile }: { profile: TeacherProfile }) {
   const { isAdmin } = useAuth();
   const { entries } = useJournalEntries();

   // Admin View
   if (isAdmin) {
      return (
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden mb-8 shadow-xl">
               <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-2">مرحباً حضرة المسؤول، {profile.name}</h3>
                  <p className="opacity-90 max-w-2xl font-medium leading-relaxed mb-6">
                     هذه اللوحة مخصصة لمتابعة ومراقبة حسابات الأساتذة، حيث يمكنك رؤية كافة المدخلات، وتعديل الصلاحيات، ومتابعة آخر النشاطات على مستوى المنصة.
                  </p>
               </div>
               <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Embed the Admin Panel entirely within the Dashboard for Admins */}
            <AdminPanel />
         </div>
      );
   }

   // Teacher View Statistics (Based on the current date entries)
   const completedSessions = entries.filter(e => e.title || e.content).length;
   const totalHours = entries.length;
   const progressPercent = entries.length > 0 ? Math.round((completedSessions / entries.length) * 100) : 0;

   return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
         {/* Welcome Banner */}
         <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
               <h3 className="text-3xl font-black mb-2">مرحباً بك، أ. {profile.name}</h3>
               <p className="opacity-90 mb-8 font-medium">نرجو لك يوماً دراسياً موفقاً وحافلاً بالإنجازات والتميز البيداغوجي.</p>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 inline-block">
                  <p className="text-sm font-bold flex items-center gap-2">
                     <CheckCircle2 size={18} className="text-emerald-300" />
                     حالتك لليوم: إنجاز {completedSessions} من أصل {entries.length} حصص مخططة.
                  </p>
               </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                     <Clock size={24} />
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">ساعات العمل اليوم</h3>
                     <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalHours} <span className="text-sm font-bold text-slate-400">ساعة</span></p>
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
                     <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{completedSessions} <span className="text-sm font-bold text-slate-400">حصة</span></p>
                  </div>
               </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
                     <TrendingUp size={24} />
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">نسبة تقدم اليوم</h3>
                     <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{progressPercent}%</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Tips & Guidance Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pedagogical Tips */}
            <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/40 shadow-sm relative overflow-hidden group">
               <div className="absolute top-4 left-4 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
               </div>
               <h3 className="text-xl font-black text-blue-800 dark:text-blue-300 mb-4 mt-2">توجيهات بيداغوجية</h3>
               <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                     <p>احرص على تنويع طرائق التدريس بما يتماشى مع الفروق الفردية للمتعلمين.</p>
                  </li>
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                     <p>التقويم التكويني المستمر هو مفتاح لتعديل مسار التعلم وتجاوز الصعوبات فور ظهورها.</p>
                  </li>
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                     <p>عزز التعلم الذاتي بتكليف التلاميذ بمهام بحثية بسيطة.</p>
                  </li>
               </ul>
            </div>

            {/* Administrative Tips */}
            <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/40 shadow-sm relative overflow-hidden group">
               <div className="absolute top-4 left-4 p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                  <Lightbulb size={24} />
               </div>
               <h3 className="text-xl font-black text-amber-800 dark:text-amber-300 mb-4 mt-2">نصائح إدارية</h3>
               <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                     <p>تأكد من تدوين غيابات التلاميذ في وقت الإدارة لتفادي التراكم.</p>
                  </li>
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                     <p>المزامنة السحابية الاحتياطية كل أسبوع ضرورية للحفاظ على بياناتك.</p>
                  </li>
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                     <p>التزامك بتحديث الكراس اليومي بانتظام يسهل عملية المتابعة من قبل المفتش.</p>
                  </li>
               </ul>
            </div>

            {/* Ministry Updates */}
            <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-900/20 dark:to-slate-800 p-8 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/40 shadow-sm relative overflow-hidden group">
               <div className="absolute top-4 left-4 p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-500 group-hover:scale-110 transition-transform">
                  <Landmark size={24} />
               </div>
               <h3 className="text-xl font-black text-rose-800 dark:text-rose-300 mb-4 mt-2">مستجدات الوصاية</h3>
               <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                     <p><strong>منشور جديد:</strong> تعديل رزنامة العطل المدرسية للسنة الجارية.</p>
                  </li>
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                     <p><strong>توجيه وزاري:</strong> الاعتماد على الرقمنة في حجز النقط وتخفيف المحفظة.</p>
                  </li>
                  <li className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                     <p>ترقبوا قريباً: إدماج منصة التوجيه المدرسي في الفضاء الرقمي.</p>
                  </li>
               </ul>
            </div>
         </div>

         {/* Extended Chart/Progress Bar */}
         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
               <BarChart3 className="text-emerald-500" />
               مجمل الإحصائيات الشهرية
            </h3>
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 font-bold bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 overflow-hidden relative">
               <p className="z-10 bg-white/50 dark:bg-slate-800/50 px-6 py-2 rounded-full backdrop-blur-md">سيتم تفعيل الرسوم البيانية التفاعلية قريباً</p>
               {/* Decorative chart lines */}
               <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end justify-between px-8 pb-4 opacity-30">
                  <div className="w-16 bg-blue-400 rounded-t-lg h-[40%]"></div>
                  <div className="w-16 bg-emerald-400 rounded-t-lg h-[80%]"></div>
                  <div className="w-16 bg-blue-400 rounded-t-lg h-[60%]"></div>
                  <div className="w-16 bg-amber-400 rounded-t-lg h-[30%]"></div>
                  <div className="w-16 bg-emerald-400 rounded-t-lg h-[90%]"></div>
               </div>
            </div>
         </div>
      </div>
   );
}