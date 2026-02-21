
import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

const CalendarView: React.FC = () => {
  const holidays = [
    { id: '1', title: 'عطلة الشتاء', start: '2024-12-19', end: '2025-01-05', color: 'blue' },
    { id: '2', title: 'عطلة الربيع', start: '2025-03-20', end: '2025-04-06', color: 'green' },
    { id: '3', title: 'عيد الاستقلال والشباب', start: '2025-07-05', end: '2025-07-05', color: 'red' },
  ];

  const events = [
    { time: '08:00', title: 'اجتماع تنسيقي للأساتذة', type: 'meeting' },
    { time: '10:30', title: 'توزيع كشوف نقاط الفصل الأول', type: 'event' },
    { time: '14:00', title: 'مجلس التأديب (القسم 2م1)', type: 'danger' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Month Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/30">
             <div className="flex items-center space-x-4 space-x-reverse">
                <h3 className="text-xl font-bold text-indigo-900">نوفمبر 2024</h3>
                <div className="flex space-x-1 space-x-reverse">
                   <button className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors"><ChevronRight size={20}/></button>
                   <button className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors"><ChevronLeft size={20}/></button>
                </div>
             </div>
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">إضافة حدث</button>
          </div>
          
          <div className="p-4">
             <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                  <div key={day} className="text-xs font-bold text-gray-500 py-2 uppercase">{day}</div>
                ))}
             </div>
             <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-24 p-2 border border-gray-50 rounded-lg transition-all cursor-pointer hover:bg-indigo-50 group flex flex-col justify-between ${
                      (i + 1) === 15 ? 'bg-indigo-100 ring-2 ring-indigo-300' : 'bg-white'
                    }`}
                  >
                    <span className={`text-sm font-bold ${(i + 1) === 15 ? 'text-indigo-900' : 'text-gray-700'}`}>{i + 1}</span>
                    {(i + 1) === 10 && <div className="w-full h-1 bg-red-400 rounded-full mt-1"></div>}
                    {(i + 1) === 15 && <div className="w-full h-1 bg-indigo-500 rounded-full mt-1"></div>}
                    {(i + 1) === 22 && <div className="w-full h-1 bg-green-400 rounded-full mt-1"></div>}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h4 className="font-bold text-gray-800 mb-6 flex items-center">
               <Bell size={18} className="ml-2 text-indigo-600" />
               أحداث اليوم
             </h4>
             <div className="space-y-4">
               {events.map((event, i) => (
                 <div key={i} className={`p-4 rounded-xl border-r-4 ${
                   event.type === 'danger' ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-indigo-500'
                 }`}>
                   <span className="text-xs font-bold text-gray-500 block mb-1">{event.time}</span>
                   <h5 className="font-bold text-gray-800 text-sm">{event.title}</h5>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-indigo-900 p-6 rounded-2xl shadow-lg text-white">
             <h4 className="font-bold mb-4 flex items-center">
               <CalendarIcon size={18} className="ml-2" />
               رزنامة العطل الرسمية
             </h4>
             <div className="space-y-4">
               {holidays.map((holiday) => (
                 <div key={holiday.id} className="flex flex-col">
                   <div className="flex items-center justify-between mb-1">
                     <span className="text-sm font-bold">{holiday.title}</span>
                     <span className={`w-2 h-2 rounded-full ${
                       holiday.color === 'blue' ? 'bg-blue-400' : holiday.color === 'green' ? 'bg-green-400' : 'bg-red-400'
                     }`}></span>
                   </div>
                   <span className="text-[10px] text-indigo-300">من {holiday.start} إلى {holiday.end}</span>
                 </div>
               ))}
             </div>
             <button className="w-full mt-6 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-xs font-bold transition-all border border-indigo-700">تحميل الرزنامة السنوية (PDF)</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
