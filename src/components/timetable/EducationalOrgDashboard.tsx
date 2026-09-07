import React from 'react';
import { Users, School, BookOpen, Clock, Activity, FileSpreadsheet } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  metadata: any;
}

export function EducationalOrgDashboard({ metadata }: Props) {
  const isPrimary = metadata.stage === 'primary' || !metadata.stage;

  const getTotalClasses = () => {
    if (!metadata.classes) return 1;
    return Object.values(metadata.classes).reduce((a: any, b: any) => a + b, 0) as number;
  };

  const totalClasses = getTotalClasses();
  
  // Calculate mock teachers data based on classes
  const arabicTeachers = metadata.teachers?.arabic || totalClasses;
  const frenchTeachers = metadata.teachers?.french || (isPrimary ? Math.ceil(totalClasses * 0.4) : 0);
  const englishTeachers = metadata.teachers?.english || (isPrimary ? Math.ceil(totalClasses * 0.4) : 0);
  const totalTeachers = arabicTeachers + frenchTeachers + englishTeachers + (metadata.teachers?.pe || 0) + (metadata.teachers?.amazigh || 0);

  const getSystemLabel = () => {
    switch(metadata.system) {
      case 'one-shift': return 'دوام واحد';
      case 'two-shifts': return 'نظام الدوامين';
      case 'one-shift-amazigh': return 'دوام واحد (أمازيغية)';
      case 'two-shifts-amazigh': return 'دوامين (أمازيغية)';
      case 'partial': return 'دوام جزئي (تفويج)';
      case 'full-shift': return 'دوام كلي';
      default: return 'نظام عادي';
    }
  };

  const handleExportMap = async () => {
    try {
      const saved = localStorage.getItem('tamkeen_profile');
      const profile = saved ? JSON.parse(saved) : {
        name: 'الأستاذ(ة)',
        institution: metadata?.schoolName || 'المؤسسة التربوية',
        province: metadata?.directorate || 'الجزائر',
        academicYear: metadata?.year || '2025/2026',
        teachingSubject: 'التعليم العام'
      };
      const { exportEducationalMapToPDF } = await import('../../lib/utils/pdfGenerator');
      await exportEducationalMapToPDF(profile, metadata);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير خريطة التنظيم التربوي.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-white/70 font-black text-sm mb-1">إجمالي الأفواج</p>
              <h3 className="text-4xl font-black">{totalClasses} <span className="text-lg font-bold">فوج</span></h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-teal-500/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-white/70 font-black text-sm mb-1">التعداد البشري</p>
              <h3 className="text-4xl font-black">{totalTeachers} <span className="text-lg font-bold">أستاذ</span></h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <School size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-white/70 font-black text-sm mb-1">نظام التمدرس</p>
              <h3 className="text-2xl font-black mt-2 leading-tight">{getSystemLabel()}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div onClick={handleExportMap} className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center hover:border-blue-400 active:scale-95 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileSpreadsheet size={24} />
          </div>
          <h4 className="font-black text-slate-800 dark:text-white text-sm">تصدير الخريطة</h4>
          <p className="text-[10px] text-slate-400 font-bold mt-1">Excel / PDF</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Classes Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="text-indigo-500" />
                هيكلة الأفواج والحجرات
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-1">توزيع الأفواج التربوية على الحجرات الدراسية</p>
            </div>
            <button className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl font-black text-xs hover:bg-indigo-100">
              تعديل الهيكلة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-2">
              <thead>
                <tr>
                  <th className="p-2 text-slate-400 font-black text-sm w-24">المستوى</th>
                  {[1, 2, 3, 4, 5].map(i => (
                    <th key={i} className="p-2 text-slate-600 dark:text-slate-300 font-black text-sm bg-slate-50 dark:bg-slate-800 rounded-xl">
                      الفوج {i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['تحضيري', 'السنة 1', 'السنة 2', 'السنة 3', 'السنة 4', 'السنة 5'].map((level, idx) => {
                  // Mock data based on classes count
                  const key = idx === 0 ? 'prep' : idx.toString();
                  const count = metadata.classes ? (metadata.classes[key] || 0) : (idx === 3 ? 1 : 0);
                  
                  if (count === 0 && metadata.classes) return null;

                  return (
                    <tr key={idx}>
                      <td className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-black text-sm rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                        {level}
                      </td>
                      {[1, 2, 3, 4, 5].map(i => (
                        <td key={i} className="p-1">
                          {i <= count ? (
                            <div className="h-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl p-3 hover:border-indigo-400 transition-colors cursor-pointer group relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400"></div>
                              <div className="font-black text-slate-700 dark:text-slate-200 text-sm mb-1">{level}م{i}</div>
                              <div className="text-[10px] font-bold text-slate-400">حجرة {Math.floor(Math.random() * 12) + 1}</div>
                            </div>
                          ) : (
                            <div className="h-full border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl p-3 flex items-center justify-center opacity-50">
                              <span className="text-slate-300 text-xl font-black">+</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Specialized Teachers Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="text-rose-500" />
              الأساتذة المتخصصون
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-1">تغطية المواد المتخصصة للأفواج</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-slate-700 dark:text-slate-300">اللغة الفرنسية</span>
                <span className="bg-white dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-black shadow-sm">{frenchTeachers} أساتذة</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-bold text-left">تغطية 100% للأفواج المعنية (3، 4، 5)</p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-slate-700 dark:text-slate-300">اللغة الإنجليزية</span>
                <span className="bg-white dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-black shadow-sm">{englishTeachers} أساتذة</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-bold text-left">تغطية 100% للأفواج المعنية</p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-slate-700 dark:text-slate-300">الأمازيغية</span>
                <span className="bg-white dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-black shadow-sm">{metadata.teachers?.amazigh || 0} أساتذة</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: metadata.teachers?.amazigh > 0 ? '100%' : '0%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-bold text-left">حسب الاحتياج</p>
            </div>
            
            <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-slate-700 dark:text-slate-300">التربية البدنية</span>
                <span className="bg-white dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-black shadow-sm">{metadata.teachers?.pe || 0} أساتذة</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: metadata.teachers?.pe > 0 ? '100%' : '0%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-bold text-left">تأطير الملاعب</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
