import React from 'react';
import { TeacherProfile } from '../../types';
import { FileStack } from 'lucide-react';

export default function PlansView({ profile }: { profile: TeacherProfile, lang?: string, type?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
        <FileStack size={48} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">المخططات السنوية</h2>
      <p className="text-slate-500 max-w-md">هذه الخاصية قيد التطوير حالياً. ستتمكن قريباً من إدارة وتوليد المخططات السنوية تلقائياً.</p>
    </div>
  );
}