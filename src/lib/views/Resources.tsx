import React from 'react';
import { BookOpenCheck } from 'lucide-react';
export default function ResourcesView({ profile }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
        <BookOpenCheck size={48} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">بنك الموارد</h2>
      <p className="text-slate-500">قريباً..</p>
    </div>
  );
}