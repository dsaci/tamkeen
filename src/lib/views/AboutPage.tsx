import React from 'react';
import { Shield, Target, Heart } from 'lucide-react';
import { cn } from '../utils';

export default function AboutPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
          من نحن
        </h1>
        <p className="text-lg font-bold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          تعرف على رؤية ورسالة منصة تمكين، والمؤسس الأستاذ ساسي عبدالنور.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-12 items-center">
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-500"></div>
          <img
            src="/images/logo_abdo.jpg"
            alt="الأستاذ ساسي عبدالنور — مؤسس ومطور منصة تمكين"
            className="relative w-44 h-44 md:w-48 md:h-48 rounded-full object-cover shadow-2xl border-4 border-yellow-400 bg-white"
          />
        </div>
        <div className="space-y-6 text-center md:text-right">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">الأستاذ ساسي عبدالنور</h2>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm">مؤسس المنصة ومطور تربوي</p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            أستاذ جزائري شغوف بتطوير التعليم ورقمنة القطاع التربوي. أؤمن بأن المعلم هو محور العملية التعليمية، وتزويده بأدوات تكنولوجية حديثة ومجانية هو خطوة أساسية نحو بناء مدرسة جزائرية رائدة تعتمد المقاربة بالكفاءات بفاعلية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: 'رؤيتنا', desc: 'ريادة رقمنة التعليم في الجزائر وتقديم حلول ذكية تواكب المناهج الرسمية.' },
          { icon: Heart, title: 'رسالتنا', desc: 'تمكين الأستاذ الجزائري من أداء مهامه التربوية والإدارية بيسر وإبداع.' },
          { icon: Shield, title: 'قيمنا', desc: 'المجانية، الأمان، احترام الهوية التربوية الجزائرية، والتطوير المستمر.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <item.icon size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{item.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
