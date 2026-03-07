import React from 'react';
import { UserCog } from 'lucide-react';

export const TeachersManagement: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
                    <UserCog size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">إدارة الأساتذة</h2>
                    <p className="text-xs text-slate-500">منصة إدارة شؤون هيئة التدريس</p>
                </div>
            </div>
            <div className="text-center py-12">
                <p className="text-slate-500 font-bold">قريباً: ميزات إدارة الأساتذة وجداولهم</p>
            </div>
        </div>
    );
};
export default TeachersManagement;
