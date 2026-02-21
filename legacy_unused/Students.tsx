
import React, { useState } from 'react';
import { Search, GraduationCap, FileUp, Filter, MoreVertical, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { Student, SchoolLevel } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StudentsView: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<SchoolLevel | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [students] = useState<Student[]>([
    // Added firstName and lastName to match Student interface
    { id: '1', firstName: 'محمد الأمين', lastName: 'بوحفص', name: 'محمد الأمين بوحفص', birthDate: '2012-05-12', level: 'PRIMARY', grade: '5 ابتدائي', group: 'أ', registrationNumber: 'ST-1001' },
    { id: '2', firstName: 'مريم', lastName: 'شريف', name: 'مريم شريف', birthDate: '2010-02-18', level: 'MIDDLE', grade: '2 متوسط', group: 'ب', registrationNumber: 'ST-1002' },
    { id: '3', firstName: 'ياسين', lastName: 'بن عيسى', name: 'ياسين بن عيسى', birthDate: '2008-11-30', level: 'HIGH', grade: '1 ثانوي', group: 'ج', registrationNumber: 'ST-1003' },
    { id: '4', firstName: 'نور الهدى', lastName: 'قاسي', name: 'نور الهدى قاسي', birthDate: '2012-08-25', level: 'PRIMARY', grade: '5 ابتدائي', group: 'أ', registrationNumber: 'ST-1004' },
  ]);

  const ageDistribution = [
    { age: '6 سنوات', count: 85 },
    { age: '7 سنوات', count: 120 },
    { age: '8 سنوات', count: 110 },
    { age: '9 سنوات', count: 135 },
    { age: '10 سنوات', count: 125 },
    { age: '11 سنة', count: 95 },
  ];

  const filtered = students.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || s.registrationNumber.includes(searchTerm);
    const matchesLevel = activeLevel === 'ALL' || s.level === activeLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-2 lg:pb-0">
              <button 
                onClick={() => setActiveLevel('ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeLevel === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >كل الأطوار</button>
              <button 
                onClick={() => setActiveLevel('PRIMARY')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeLevel === 'PRIMARY' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >ابتدائي</button>
              <button 
                onClick={() => setActiveLevel('MIDDLE')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeLevel === 'MIDDLE' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >متوسط</button>
              <button 
                onClick={() => setActiveLevel('HIGH')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeLevel === 'HIGH' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >ثانوي</button>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="بحث سريع..." 
                  className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 shadow-sm"><FileUp size={20}/></button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">رقم التسجيل</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">الاسم واللقب</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">المستوى</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">الفوج</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((std) => (
                  <tr key={std.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-indigo-600">{std.registrationNumber}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{std.name}</td>
                    <td className="px-6 py-4 text-gray-600">{std.grade}</td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{std.group}</td>
                    <td className="px-6 py-4 flex justify-center space-x-2 space-x-reverse">
                       <button className="text-gray-400 hover:text-indigo-600"><GraduationCap size={18}/></button>
                       <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="p-8 text-center text-gray-400">لا يوجد تلاميذ في هذا القسم</div>}
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-lg font-bold mb-2">إحصائيات فورية</h3>
               <p className="text-indigo-200 text-sm mb-6 font-light leading-relaxed">تحديث البيانات مباشرة من نظام الرقمنة لوزارة التربية.</p>
               <div className="space-y-4">
                 <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
                   <span className="text-xs">المسجلين اليوم</span>
                   <span className="font-bold">+12</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
                   <span className="text-xs">المنسحبين</span>
                   <span className="font-bold">2</span>
                 </div>
                 <div className="flex items-center justify-between pb-2">
                   <span className="text-xs">نسبة الحضور</span>
                   <span className="font-bold text-green-400">98.5%</span>
                 </div>
               </div>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10">
               <GraduationCap size={140} />
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
              <BarChart2 size={18} className="ml-2 text-indigo-600" />
              هرم الأعمار (تقديري)
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDistribution} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="age" type="category" tick={{fontSize: 10}} width={60} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsView;
