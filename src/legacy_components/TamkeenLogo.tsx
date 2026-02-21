
import React from 'react';
import { BookOpen } from 'lucide-react';

export const TamkeenLogo = ({ size = 48, className = "", variant = "default" }: { size?: number, className?: string, variant?: "default" | "white" }) => (
  <div className={`${className} flex items-center gap-0 transition-all duration-300 hover:scale-105 active:scale-95`} style={{ height: size }}>
    <div className={`flex items-center gap-1 ${variant === 'white' ? 'bg-white text-emerald-900' : 'bg-emerald-600 dark:bg-emerald-500 text-white'} px-4 py-2 rounded-2xl shadow-lg border-b-4 ${variant === 'white' ? 'border-slate-200' : 'border-emerald-800'}`}>
      <span className="text-xl md:text-2xl font-black font-['Cairo']" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>تمكين</span>
      <BookOpen size={size * 0.4} strokeWidth={3} className="ml-1" />
    </div>
  </div>
);

export default TamkeenLogo;
