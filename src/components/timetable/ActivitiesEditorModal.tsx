import React, { useState } from 'react';
import { X, Trash2, Plus, Save } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Activity {
  id: string;
  name: string;
  periods: number;
  timeVolume: string;
  isTotal: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onSave: (activities: Activity[]) => void;
  label?: string;
}

export function ActivitiesEditorModal({ isOpen, onClose, activities: initialActivities, onSave, label = 'النشاط' }: Props) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  if (!isOpen) return null;

  const handleAdd = () => {
    setActivities([
      ...activities,
      { id: Date.now().toString(), name: 'جديد', periods: 1, timeVolume: '1', isTotal: false }
    ]);
  };

  const handleDelete = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleChange = (id: string, field: keyof Activity, value: any) => {
    setActivities(activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-900/20">
          <div>
            <h2 className="text-xl font-black text-emerald-800 dark:text-emerald-400">تعديل النموذج — {label} والحصص والأزمنة</h2>
            <p className="text-xs font-bold text-emerald-600/70 mt-1">
              أجرِ التعديلات هنا واضغط حفظ لتطبيقها على الجدول. الصفوف التي تحمل علامة المجموع تُعتبر تلقائياً صفوف إجمالية.
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="p-3 font-black text-emerald-700 border-b-2 border-emerald-200">{label}</th>
                <th className="p-3 font-black text-emerald-700 border-b-2 border-emerald-200 w-24">عدد الحصص</th>
                <th className="p-3 font-black text-emerald-700 border-b-2 border-emerald-200 w-24">الحجم الساعي</th>
                <th className="p-3 font-black text-emerald-700 border-b-2 border-emerald-200 w-20">مجموع؟</th>
                <th className="p-3 border-b-2 border-emerald-200 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id} className={cn("border-b border-slate-200 dark:border-slate-800 transition-colors", act.isTotal ? "bg-amber-50 dark:bg-amber-900/10" : "bg-white dark:bg-slate-900")}>
                  <td className="p-2">
                    <input 
                      type="text" 
                      value={act.name} 
                      onChange={e => handleChange(act.id, 'name', e.target.value)}
                      className={cn(
                        "w-full text-center font-bold p-2 rounded-lg border focus:outline-none transition-all",
                        act.isTotal 
                          ? "bg-transparent border-transparent text-amber-700 font-black" 
                          : "bg-slate-50 border-slate-200 focus:border-emerald-400"
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={act.periods} 
                      onChange={e => handleChange(act.id, 'periods', parseInt(e.target.value) || 0)}
                      className="w-full text-center font-bold p-2 rounded-lg border border-slate-200 bg-slate-50 focus:border-emerald-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="text" 
                      value={act.timeVolume} 
                      onChange={e => handleChange(act.id, 'timeVolume', e.target.value)}
                      className="w-full text-center font-bold p-2 rounded-lg border border-slate-200 bg-slate-50 focus:border-emerald-400 focus:outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox" 
                        checked={act.isTotal} 
                        onChange={e => handleChange(act.id, 'isTotal', e.target.checked)}
                        className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleDelete(act.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleAdd} className="w-full mt-4 py-4 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-600 font-black flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
            <Plus size={20} /> إضافة صف جديد
          </button>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-4">
          <button onClick={() => onSave(activities)} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all">
            <Save size={20} /> حفظ التعديلات
          </button>
          <button onClick={onClose} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 transition-all">
            إلغاء
          </button>
        </div>

      </div>
    </div>
  );
}
