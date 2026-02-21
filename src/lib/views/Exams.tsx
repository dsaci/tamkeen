
import React from 'react';
import { ClipboardCheck, FileText, Download, UserCheck, Calendar } from 'lucide-react';

const ExamsView: React.FC = () => {
  const upcomingExams = [
    { id: '1', title: 'البكالوريا التجريبية 2025', date: '2025-05-15', level: 'ثانوي', grade: '3 ثانوي' },
    { id: '2', title: 'امتحان شهادة التعليم المتوسط (BEM)', date: '2025-06-02', level: 'متوسط', grade: '4 متوسط' },
    { id: '3', title: 'امتحان تقييم المكتسبات (الابتدائي)', date: '2025-05-10', level: 'ابتدائي', grade: '5 ابتدائي' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">قائمة الامتحانات الرسمية القادمة</h3>
                <button className="text-sm text-indigo-600 font-bold hover:underline">إضافة امتحان جديد</button>
             </div>
             <div className="divide-y divide-gray-50">
               {upcomingExams.map((exam) => (
                 <div key={exam.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                   <div className="flex items-center space-x-4 space-x-reverse">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                       <ClipboardCheck size={24} />
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-800">{exam.title}</h4>
                       <div className="flex items-center text-xs text-gray-500 mt-1">
                         <Calendar size={12} className="ml-1" />
                         <span>{exam.date}</span>
                         <span className="mx-2">•</span>
                         <span>{exam.grade}</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2 space-x-reverse">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Download size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><UserCheck size={18} /></button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">إعداد الجداول الزمنية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl text-right hover:bg-indigo-50 transition-all group">
                 <h5 className="font-bold text-indigo-900 group-hover:text-indigo-600">جدول الحراسة الرسمي</h5>
                 <p className="text-xs text-indigo-700 mt-1">توزيع الأساتذة على القاعات تلقائياً</p>
               </button>
               <button className="p-4 border border-amber-100 bg-amber-50/50 rounded-xl text-right hover:bg-amber-50 transition-all group">
                 <h5 className="font-bold text-amber-900 group-hover:text-amber-600">جدول سير الامتحانات</h5>
                 <p className="text-xs text-amber-700 mt-1">توقيت المواد والمستويات للامتحانات</p>
               </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center">
               <FileText size={20} className="ml-2" />
               تقارير الرقمنة (Excel)
            </h3>
            <p className="text-sm text-indigo-100 mb-6 font-light">توليد ملفات متوافقة مع نظام وزارة التربية الوطنية للرفع الفوري.</p>
            <div className="space-y-3">
               <button className="w-full bg-white/10 hover:bg-white/20 py-2.5 rounded-lg text-sm font-bold transition-all text-center">كشوف النقاط الفصلية</button>
               <button className="w-full bg-white/10 hover:bg-white/20 py-2.5 rounded-lg text-sm font-bold transition-all text-center">إحصائيات النتائج العامة</button>
               <button className="w-full bg-indigo-500/50 hover:bg-indigo-400 py-2.5 rounded-lg text-sm font-bold transition-all text-center border border-indigo-400">تصدير بيانات الممتحنين</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <h4 className="font-bold text-gray-800 mb-2">طباعة بخط القاهرة</h4>
            <p className="text-xs text-gray-500 mb-4">كافة الشهادات المستخرجة تدعم المعايير الرسمية الجزائرية.</p>
            <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
               <span className="text-sm text-gray-400 font-bold italic tracking-widest">نموذج معاينة الخط</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsView;
