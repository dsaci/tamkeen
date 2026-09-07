import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ArrowLeft, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  onComplete: (data: any) => void;
}

export function ProjectSetupStepper({ onComplete }: Props) {
  const [currentView, setCurrentView] = useState<'selection' | 'step1' | 'step2' | 'step3'>('selection');
  const [projectType, setProjectType] = useState<'school' | 'teacher' | null>(null);

  const [data, setData] = useState<any>({
    stage: 'primary',
    teacherName: '',
    schoolName: '',
    directorate: '',
    district: '',
    inspectorate: '',
    year: '2026/2027',
    room: '',
    level: '3',
    classes: {},
    system: 'one-shift',
    template: 'classic',
    // Teachers specific data
    teachers: { arabic: 5, french: 1, pe: 1, english: 1, amazigh: 0 },
    specializedAssignmentEnabled: false
  });

  const getSteps = () => {
    if (projectType === 'school') return [
      { id: 1, label: 'بيانات المؤسسة', view: 'step1' },
      { id: 2, label: 'النظام والأفواج', view: 'step2' },
      { id: 3, label: 'الأساتذة', view: 'step3' }
    ];
    return [
      { id: 1, label: 'اختيار المسار', view: 'selection' },
      { id: 2, label: 'تعبئة البيانات', view: 'step1' },
      { id: 3, label: 'توليد الجداول', view: 'step2' }
    ];
  };

  const stepsList = getSteps();
  const currentStepNum = currentView === 'selection' ? 1 : 
                         currentView === 'step1' ? (projectType === 'school' ? 1 : 2) : 
                         currentView === 'step2' ? (projectType === 'school' ? 2 : 3) : 3;

  const getLevelOptions = () => {
    if (data.stage === 'middle') return [
      { id: 'm1', label: '1 متوسط' }, { id: 'm2', label: '2 متوسط' }, { id: 'm3', label: '3 متوسط' }, { id: 'm4', label: '4 متوسط' }
    ];
    if (data.stage === 'secondary') return [
      { id: 's1', label: '1 ثانوي' }, { id: 's2', label: '2 ثانوي' }, { id: 's3', label: '3 ثانوي' }
    ];
    return [
      { id: 'prep', label: 'تحضيري' }, { id: '1', label: '1 سنة' }, { id: '2', label: '2 سنة' }, { id: '3', label: '3 سنة' }, { id: '4', label: '4 سنة' }, { id: '5', label: '5 سنة' }
    ];
  };

  const getInstitutionLabel = () => {
    if (data.stage === 'middle') return 'اسم المتوسطة *';
    if (data.stage === 'secondary') return 'اسم الثانوية *';
    return 'اسم المدرسة الابتدائية *';
  };

  const getTotalClasses = () => Object.values(data.classes).reduce((a: any, b: any) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto pb-24 w-full px-4 mt-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Navigation Steps */}
      <div className="flex items-center justify-center mb-12 relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -z-10 rounded-full"></div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 h-1 bg-gradient-to-l from-emerald-500 to-teal-400 -z-10 rounded-full transition-all duration-500" style={{ width: currentStepNum === 1 ? '33%' : currentStepNum === 2 ? '66%' : '100%' }}></div>
        
        <div className="flex justify-between w-full max-w-2xl">
          {stepsList.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-[#f8fafc] dark:bg-slate-950 px-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 shadow-md",
                currentStepNum >= s.id ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white scale-110" : "bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700"
              )}>
                {s.id}
              </div>
              <span className={cn("text-xs font-black", currentStepNum >= s.id ? "text-teal-600 dark:text-teal-400" : "text-slate-400")}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">إنشاء مشروع جديد</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
          {currentView === 'selection' ? 'اختر الطور التعليمي والمسار المناسب لك.' : 'أدخل بياناتك لتوليد الجدول بدقة.'}
        </p>
      </div>

      {currentView === 'selection' && (
        <div className="space-y-12 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h3 className="font-black text-slate-800 dark:text-white text-center text-xl">الطور التعليمي</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'primary', label: 'ابتدائي', color: 'emerald' },
                { id: 'middle', label: 'متوسط', color: 'blue' },
                { id: 'secondary', label: 'ثانوي', color: 'indigo' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setData({...data, stage: st.id})}
                  className={cn(
                    "py-4 rounded-2xl border-2 font-black transition-all",
                    data.stage === st.id ? `border-transparent bg-${st.color}-500 text-white shadow-lg scale-105` : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-slate-300"
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => { setProjectType('school'); setCurrentView('step1'); }}
              className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 border-transparent hover:border-teal-400 shadow-xl transition-all hover:-translate-y-2 overflow-hidden text-right"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="inline-flex px-3 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-full text-[10px] font-black mb-6">مؤسسة • جداول متعددة</div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-teal-600 transition-colors">مشروع المؤسسة</h3>
                <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8">ولّد جداول جميع الأقسام دفعة واحدة وفق المواقيت الرسمية: بيانات المؤسسة، نظام التمدرس، الأفواج.</p>
                <div className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-center group-hover:bg-teal-700 transition-colors">متابعة كمؤسسة ←</div>
              </div>
            </button>
            <button 
              onClick={() => { setProjectType('teacher'); setCurrentView('step1'); }}
              className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 border-transparent hover:border-purple-400 shadow-xl transition-all hover:-translate-y-2 overflow-hidden text-right"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="inline-flex px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-black mb-6">جدول أستاذ واحد</div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-purple-600 transition-colors">جدول الأستاذ</h3>
                <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8">أنشئ جدولك الأسبوعي الشخصي كأستاذ خلال دقائق: مستوى واحد، نظام دوام، ونموذج رسمي.</p>
                <div className="w-full py-4 bg-gradient-to-r from-orange-400 via-rose-500 to-purple-600 text-white rounded-2xl font-black text-center shadow-lg group-hover:shadow-xl transition-all">ابدأ جدولك الآن ←</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {currentView === 'step1' && (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-right-8">
          <div className="p-8 space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
            {projectType === 'teacher' && (
              <div className="space-y-4 relative">
                <div className="absolute -right-4 top-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-l-xl text-white flex items-center justify-center font-black text-xs shadow-md">أ</div>
                <h3 className="font-black text-slate-800 dark:text-white text-lg mr-6">هوية الأستاذ</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">اسم ولقب الأستاذ(ة) *</label>
                  <input type="text" placeholder="مثال: ساسي عبدالنور" value={data.teacherName} onChange={e => setData({...data, teacherName: e.target.value})} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-rose-400 transition-all text-center" />
                </div>
              </div>
            )}

            <div className="space-y-4 relative">
              <div className="absolute -right-4 top-0 w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-l-xl text-white flex items-center justify-center font-black text-xs shadow-md">م</div>
              <h3 className="font-black text-slate-800 dark:text-white text-lg mr-6">بيانات المؤسسة التربوية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">{getInstitutionLabel()}</label>
                  <input type="text" placeholder="أدخل اسم المؤسسة" value={data.schoolName} onChange={e => setData({...data, schoolName: e.target.value})} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-teal-400 transition-all text-center" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">مديرية التربية لولاية *</label>
                  <input type="text" placeholder="أدخل اسم الولاية" value={data.directorate} onChange={e => setData({...data, directorate: e.target.value})} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-teal-400 transition-all text-center" />
                </div>
                {data.stage === 'primary' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">مفتشية التربية والتعليم الابتدائي</label>
                    <input type="text" placeholder="أدخل اسم المفتشية" value={data.inspectorate} onChange={e => setData({...data, inspectorate: e.target.value})} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-teal-400 transition-all text-center" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">المقاطعة الإدارية</label>
                  <input type="text" placeholder="أدخل المقاطعة" value={data.district} onChange={e => setData({...data, district: e.target.value})} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-teal-400 transition-all text-center" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">السنة الدراسية *</label>
                  <div className="relative">
                    <select value={data.year} onChange={e => setData({...data, year: e.target.value})} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-teal-400 transition-all text-center appearance-none">
                      <option>2026/2027</option>
                      <option>2025/2026</option>
                    </select>
                    <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {projectType === 'teacher' && (
              <div className="space-y-4 relative">
                <div className="absolute -right-4 top-0 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-l-xl text-white flex items-center justify-center font-black text-xs shadow-md">س</div>
                <h3 className="font-black text-slate-800 dark:text-white text-lg mr-6">المستوى الدراسي</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {getLevelOptions().map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setData({...data, level: lvl.id})}
                      className={cn(
                        "py-4 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-1",
                        data.level === lvl.id ? "border-transparent bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-purple-300"
                      )}
                    >
                      <span className={cn("text-xl", data.level === lvl.id ? "text-white" : "text-indigo-900")}>{lvl.label.split(' ')[0]}</span>
                      <span className="text-[10px] opacity-80">{lvl.label.split(' ')[1] || lvl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
            <button onClick={() => setCurrentView('selection')} className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2">
              <ArrowRight size={18} /> رجوع
            </button>
            <button onClick={() => setCurrentView('step2')} disabled={!data.schoolName || !data.directorate} className="px-8 py-3 rounded-xl font-black text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-2 disabled:opacity-50">
              التالي <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      )}

      {currentView === 'step2' && (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-right-8">
          <div className="p-8 space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
            
            <div className="space-y-4 relative">
              <div className="absolute -right-4 top-0 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-600 rounded-l-xl text-white flex items-center justify-center font-black text-xs shadow-md">ن</div>
              <h3 className="font-black text-slate-800 dark:text-white text-lg mr-6">نظام التمدرس والأفواج التربوية</h3>
              <p className="text-xs font-bold text-slate-400 mr-6">نوع النظام</p>
              
              <div className="space-y-3">
                {data.stage === 'primary' ? (
                  <>
                    <button onClick={() => setData({...data, system: 'one-shift'})} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all", data.system === 'one-shift' ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800")}>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">☼</div>
                      <div className="text-right">
                        <div className={cn("font-black text-sm", data.system === 'one-shift' ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300")}>دوام واحد</div>
                        <div className="text-xs text-slate-400 font-bold">صباحية + مسائية للجميع</div>
                      </div>
                    </button>
                    <button onClick={() => setData({...data, system: 'two-shifts'})} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all", data.system === 'two-shifts' ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800")}>
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black">◓</div>
                      <div className="text-right">
                        <div className={cn("font-black text-sm", data.system === 'two-shifts' ? "text-orange-700 dark:text-orange-400" : "text-slate-700 dark:text-slate-300")}>نظام الدوامين</div>
                        <div className="text-xs text-slate-400 font-bold">تناوب الأفواج صباحاً ومساءً</div>
                      </div>
                    </button>
                    {projectType === 'school' && (
                      <>
                        <button onClick={() => setData({...data, system: 'one-shift-amazigh'})} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all", data.system === 'one-shift-amazigh' ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800")}>
                          <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-black">あ</div>
                          <div className="text-right">
                            <div className={cn("font-black text-sm", data.system === 'one-shift-amazigh' ? "text-teal-700 dark:text-teal-400" : "text-slate-700 dark:text-slate-300")}>دوام واحد بمادة الأمازيغية</div>
                            <div className="text-xs text-slate-400 font-bold">الأمازيغية للسنتين 4 و 5 فقط - موازنة على أيام مختلفة</div>
                          </div>
                        </button>
                        <button onClick={() => setData({...data, system: 'two-shifts-amazigh'})} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all", data.system === 'two-shifts-amazigh' ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800")}>
                          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">あ</div>
                          <div className="text-right">
                            <div className={cn("font-black text-sm", data.system === 'two-shifts-amazigh' ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300")}>نظام الدوامين بمادة الأمازيغية</div>
                            <div className="text-xs text-slate-400 font-bold">حصة واحدة يومياً كحد أقصى وموازنة تامة</div>
                          </div>
                        </button>
                        <button onClick={() => setData({...data, system: 'partial'})} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all", data.system === 'partial' ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800")}>
                          <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black">ج</div>
                          <div className="text-right">
                            <div className={cn("font-black text-sm", data.system === 'partial' ? "text-purple-700 dark:text-purple-400" : "text-slate-700 dark:text-slate-300")}>الدوام الجزئي</div>
                            <div className="text-xs text-slate-400 font-bold">نظام مستقل كلياً - لتطبيقات التفويج بدقة، نظام لكل فوج</div>
                          </div>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={() => setData({...data, system: 'full-shift'})} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all", data.system === 'full-shift' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800")}>
                      <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black">ك</div>
                      <div className="text-right">
                        <div className={cn("font-black text-sm", data.system === 'full-shift' ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300")}>الدوام الكلي</div>
                        <div className="text-xs text-slate-400 font-bold">نظام عادي (صباحي + مسائي)</div>
                      </div>
                    </button>
                    <button onClick={() => setData({...data, system: 'partial-shift'})} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all", data.system === 'partial-shift' ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800")}>
                      <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black">ج</div>
                      <div className="text-right">
                        <div className={cn("font-black text-sm", data.system === 'partial-shift' ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300")}>الدوام الجزئي</div>
                        <div className="text-xs text-slate-400 font-bold">نظام التفويج</div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 relative">
              <p className="text-xs font-black text-slate-500 dark:text-slate-400 mr-6">نموذج وتصميم الجدول والبطاقات</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { 
                    id: 'classic', 
                    title: 'النموذج المعتمد (الأصيل)', 
                    badge: 'رسمي معتمد',
                    desc: 'النموذج البيداغوجي المعتمد حالياً في المنصة (عالي التباين)', 
                    icon: '🏛️',
                    color: 'emerald' 
                  },
                  { 
                    id: 'flowers', 
                    title: 'نموذج رياحين والبطاقات', 
                    badge: 'زخرفي بالزهور',
                    desc: 'خلفية زهور راقية صالحة للذكور والإناث مع زخارف ستوندار', 
                    icon: '🌸',
                    color: 'amber' 
                  },
                ].map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setData({...data, template: tpl.id})}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-right relative overflow-hidden group",
                      data.template === tpl.id 
                        ? (tpl.id === 'classic' 
                            ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-md ring-2 ring-emerald-400/20"
                            : "border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-400/20")
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{tpl.icon}</span>
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full border",
                        data.template === tpl.id 
                          ? (tpl.id === 'classic' ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-300" : "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300")
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>{tpl.badge}</span>
                    </div>
                    <div className={cn(
                      "font-black text-sm mb-1", 
                      data.template === tpl.id 
                        ? (tpl.id === 'classic' ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300")
                        : "text-slate-800 dark:text-white"
                    )}>
                      {tpl.title}
                    </div>
                    <div className={cn(
                      "text-[11px] font-bold leading-relaxed", 
                      data.template === tpl.id 
                        ? (tpl.id === 'classic' ? "text-emerald-700/80 dark:text-emerald-400/80" : "text-amber-700/80 dark:text-amber-400/80")
                        : "text-slate-400"
                    )}>
                      {tpl.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {projectType === 'school' && (
              <div className="space-y-4 relative pt-4 border-t border-slate-100">
                <div className="absolute -right-4 top-4 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-l-xl text-white flex items-center justify-center font-black text-xs shadow-md">ف</div>
                <h3 className="font-black text-slate-800 dark:text-white text-lg mr-6">عدد الأفواج التربوية (الأقسام)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getLevelOptions().map(lvl => (
                    <div key={lvl.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl">
                      <div className="font-black text-slate-700 dark:text-slate-300">{lvl.label}</div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => { const c = data.classes[lvl.id] || 0; if (c > 0) setData({...data, classes: {...data.classes, [lvl.id]: c - 1}}); }} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black hover:bg-slate-200">-</button>
                        <span className="font-black text-xl w-6 text-center">{data.classes[lvl.id] || 0}</span>
                        <button onClick={() => { const c = data.classes[lvl.id] || 0; setData({...data, classes: {...data.classes, [lvl.id]: c + 1}}); }} className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black hover:bg-emerald-200">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-500 text-white p-4 rounded-2xl flex justify-between items-center font-black">
                  <span>المجموع الكلي للأفواج</span>
                  <span>{getTotalClasses()} أفواج</span>
                </div>
              </div>
            )}

          </div>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
            <button onClick={() => setCurrentView('step1')} className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2">
              <ArrowRight size={18} /> السابق
            </button>
            <button 
              onClick={() => projectType === 'school' ? setCurrentView('step3') : onComplete({...data, projectType})}
              className={cn("px-8 py-3 rounded-xl font-black text-white transition-all flex items-center gap-2", projectType === 'school' ? "bg-teal-600 hover:bg-teal-700" : "bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full hover:shadow-lg")}
            >
              {projectType === 'school' ? <>التالي <ArrowLeft size={18} /></> : <><span className="text-xl">✦</span> توليد الجداول الآن</>}
            </button>
          </div>
        </div>
      )}

      {currentView === 'step3' && projectType === 'school' && (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-right-8">
          <div className="p-8 space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
            
            <div className="space-y-4 relative">
              <div className="absolute -right-4 top-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-l-xl text-white flex items-center justify-center font-black text-xs shadow-md"><Users size={14}/></div>
              <h3 className="font-black text-slate-800 dark:text-white text-lg mr-6">عدد الأساتذة لكل مادة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">أساتذة اللغة العربية</label>
                  <input type="number" value={data.teachers.arabic} onChange={e => setData({...data, teachers: {...data.teachers, arabic: parseInt(e.target.value)||0}})} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-center font-black" />
                  <p className="text-[10px] text-slate-400">أساتذة الأقسام (معلم لكل فوج)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">أساتذة اللغة الفرنسية</label>
                  <input type="number" value={data.teachers.french} onChange={e => setData({...data, teachers: {...data.teachers, french: parseInt(e.target.value)||0}})} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-center font-black" />
                  <p className="text-[10px] text-slate-400">للمستويات 3-5 - توزيع متساو</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">أساتذة اللغة الإنجليزية</label>
                  <input type="number" value={data.teachers.english} onChange={e => setData({...data, teachers: {...data.teachers, english: parseInt(e.target.value)||0}})} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-center font-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">أساتذة التربية البدنية</label>
                  <input type="number" value={data.teachers.pe} onChange={e => setData({...data, teachers: {...data.teachers, pe: parseInt(e.target.value)||0}})} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-center font-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">أساتذة اللغة الأمازيغية</label>
                  <input type="number" value={data.teachers.amazigh} onChange={e => setData({...data, teachers: {...data.teachers, amazigh: parseInt(e.target.value)||0}})} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-center font-black" />
                </div>
              </div>
            </div>

            {/* Specialized assignment accordion */}
            <div className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-900 rounded-2xl overflow-hidden shadow-sm">
              <div 
                className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/30 cursor-pointer"
                onClick={() => setData({...data, specializedAssignmentEnabled: !data.specializedAssignmentEnabled})}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center"><Users size={16}/></div>
                  <div>
                    <h4 className="font-black text-purple-900 dark:text-purple-300 text-sm">إسناد الأفواج للأساتذة المتخصصين <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mr-2">خطوة اختيارية</span></h4>
                    <p className="text-xs text-purple-700/70 font-bold mt-1">حدّد لكل أستاذ عدد أفواجه في المستويات الخمس، لإسناد أدق عند توليد الجداول.</p>
                  </div>
                </div>
                <div className={cn("w-12 h-6 rounded-full transition-colors relative", data.specializedAssignmentEnabled ? "bg-purple-500" : "bg-slate-300")}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", data.specializedAssignmentEnabled ? "left-1" : "right-1")}></div>
                </div>
              </div>
              
              {data.specializedAssignmentEnabled && (
                <div className="p-4 space-y-4 border-t border-purple-100 dark:border-purple-900 animate-in slide-in-from-top-2">
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-xl font-black text-sm whitespace-nowrap">الفرنسية - {data.teachers.french}</button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-sm whitespace-nowrap">الإنجليزية - {data.teachers.english}</button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-sm whitespace-nowrap">الأمازيغية - {data.teachers.amazigh}</button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-sm whitespace-nowrap">التربية البدنية - {data.teachers.pe}</button>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>إسناد الفرنسية: <span className="text-purple-600">المُسند 0 من {getTotalClasses()} فوج</span></span>
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:underline">توزيع تلقائي متوازن</button>
                        <button className="text-rose-500 hover:underline">تصفير المادة</button>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <div className="bg-slate-100 p-2 font-black text-sm text-center">أستاذ اللغة الفرنسية</div>
                      <div className="grid grid-cols-6 divide-x divide-x-reverse divide-slate-100 text-center text-[10px] md:text-xs font-bold">
                        <div className="p-2 bg-slate-50">السنة الأولى</div>
                        <div className="p-2 bg-slate-50">السنة الثانية</div>
                        <div className="p-2 bg-slate-50">السنة الثالثة</div>
                        <div className="p-2 bg-slate-50">السنة الرابعة</div>
                        <div className="p-2 bg-slate-50">السنة الخامسة</div>
                        <div className="p-2 bg-slate-50">الاسم</div>
                      </div>
                      <div className="grid grid-cols-6 divide-x divide-x-reverse divide-slate-100 text-center p-2 items-center">
                        <input type="number" defaultValue="0" className="w-8 text-center bg-transparent outline-none mx-auto font-black text-slate-700" readOnly/>
                        <input type="number" defaultValue="0" className="w-8 text-center bg-transparent outline-none mx-auto font-black text-slate-700" readOnly/>
                        <input type="number" defaultValue="0" className="w-8 text-center bg-transparent outline-none mx-auto font-black text-slate-700" readOnly/>
                        <input type="number" defaultValue="0" className="w-8 text-center bg-transparent outline-none mx-auto font-black text-slate-700" readOnly/>
                        <input type="number" defaultValue="0" className="w-8 text-center bg-transparent outline-none mx-auto font-black text-slate-700" readOnly/>
                        <span className="font-black text-purple-600 text-sm">ف 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
            <button onClick={() => setCurrentView('step2')} className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2">
              <ArrowRight size={18} /> السابق
            </button>
            <button 
              onClick={() => onComplete({...data, projectType})}
              className="px-8 py-3 rounded-full font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span className="text-xl">✦</span> توليد الجداول
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
