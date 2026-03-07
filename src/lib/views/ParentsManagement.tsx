import React from 'react';
import { HeartHandshake } from 'lucide-react';

export const ParentsManagement: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl">
                    <HeartHandshake size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">أولياء الأمور</h2>
                    <p className="text-xs text-slate-500">منصة تواصل ومتابعة مع الأولياء</p>
                </div>
            </div>
            <div className="text-center py-12">
                <p className="text-slate-500 font-bold">قريباً: ميزات خاصة بالتواصل مع أولياء الأمور</p>
            </div>
        </div>
    );
};
export default ParentsManagement;
