
import React, { useState } from 'react';
import { Search, UserPlus, FileUp, FileText, MoreHorizontal, Download, Trash2, Edit } from 'lucide-react';
import { Employee } from '../types';

const EmployeesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'أحمد بن علي', position: 'أستاذ رياضيات', nationalId: '2001010101', joinDate: '2010-09-01', status: 'ACTIVE' },
    { id: '2', name: 'سارة لعماري', position: 'أستاذة فيزياء', nationalId: '2001020202', joinDate: '2015-09-01', status: 'ACTIVE' },
    { id: '3', name: 'كمال حماني', position: 'مستشار تربية', nationalId: '2001030303', joinDate: '2008-10-15', status: 'ACTIVE' },
    { id: '4', name: 'ليلى خلوف', position: 'مستخلف (عربية)', nationalId: '2001040404', joinDate: '2023-11-01', status: 'SUBSTITUTE' },
  ]);

  const filtered = employees.filter(e => e.name.includes(searchTerm) || e.position.includes(searchTerm));

  const exportData = (format: 'excel' | 'word' | 'txt') => {
    alert(`تصدير البيانات بصيغة ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <UserPlus size={18} className="ml-2" />
            <span>إضافة موظف</span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <FileUp size={18} className="ml-2" />
            <span>استيراد Excel</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث عن موظف..." 
            className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-64 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الاسم واللقب</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الوظيفة</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الرقم الوطني</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">تاريخ التعيين</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-800">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.position}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-sm">{emp.nationalId}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      emp.status === 'SUBSTITUTE' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {emp.status === 'ACTIVE' ? 'نشط' : emp.status === 'SUBSTITUTE' ? 'مستخلف' : 'في عطلة'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="تعديل" className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"><Edit size={16}/></button>
                      <button title="وثائق" className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"><FileText size={16}/></button>
                      <button title="حذف" className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            لا توجد نتائج مطابقة لبحثك
          </div>
        )}

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">عرض {filtered.length} موظف من أصل {employees.length}</span>
          <div className="flex items-center space-x-2 space-x-reverse">
             <span className="text-sm font-bold text-gray-700 ml-4">تصدير القائمة:</span>
             <button onClick={() => exportData('excel')} className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-green-50 hover:border-green-300 transition-all flex items-center"><Download size={14} className="ml-1"/> Excel</button>
             <button onClick={() => exportData('word')} className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center"><Download size={14} className="ml-1"/> Word</button>
             <button onClick={() => exportData('txt')} className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-all flex items-center"><Download size={14} className="ml-1"/> TXT</button>
          </div>
        </div>
      </div>

      {/* Docs Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'عقد استخلاف جديد', desc: 'توليد تلقائي لعقود الاستخلاف للموظفين الجدد', icon: FileText, color: 'indigo' },
          { title: 'شهادات العمل', desc: 'استخراج شهادة عمل جماعية أو فردية للموظفين', icon: FileText, color: 'green' },
          { title: 'خانة الإشهاد', desc: 'إدارة وتوثيق خانات الإشهاد الرسمية', icon: FileText, color: 'amber' },
        ].map((doc, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
               doc.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
               doc.color === 'green' ? 'bg-green-100 text-green-600' :
               'bg-amber-100 text-amber-600'
             }`}>
               <doc.icon size={24} />
             </div>
             <h4 className="font-bold text-gray-800 mb-2">{doc.title}</h4>
             <p className="text-xs text-gray-500 leading-relaxed">{doc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesView;
