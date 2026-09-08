import React, { useState, useEffect, useMemo } from 'react';
import { ProjectSetupStepper } from '../../components/timetable/ProjectSetupStepper';
import { PrintableTimetable } from '../../components/timetable/PrintableTimetable';
import { TimetableGrid } from '../../components/timetable/TimetableGrid';
import { ActivitiesEditorModal } from '../../components/timetable/ActivitiesEditorModal';
import { EducationalOrgDashboard } from '../../components/timetable/EducationalOrgDashboard';
import { Save, Edit, FileDown, RefreshCw, LayoutGrid, Users, Network, FileText } from 'lucide-react';
import { cn } from '../utils';
import { TeacherProfile } from '../../types';

export interface ScheduleItem {
  dayIdx: number;
  timeIdx: number;
  period: 'morning' | 'afternoon';
  subject: string;
}

const DEFAULT_ACTIVITIES = [
  { id: '1', name: 'اللغة العربية', periods: 9, timeVolume: '7:30', isTotal: false },
  { id: '2', name: 'الرياضيات', periods: 6, timeVolume: '5:00', isTotal: false },
  { id: '3', name: 'تربية إسلامية', periods: 3, timeVolume: '1:30', isTotal: false },
  { id: '4', name: 'تربية علمية', periods: 2, timeVolume: '1:00', isTotal: false },
  { id: '5', name: 'تاريخ', periods: 1, timeVolume: '0:30', isTotal: false },
  { id: '6', name: 'تربية فنية (ت/م)', periods: 3, timeVolume: '1:30', isTotal: false },
  { id: '7', name: 'المجموع', periods: 24, timeVolume: '16:30', isTotal: true },
  { id: '8', name: 'لغة إنجليزية', periods: 2, timeVolume: '2:00', isTotal: false },
  { id: '9', name: 'التربية البدنية', periods: 2, timeVolume: '2:00', isTotal: false },
  { id: '10', name: 'المجموع الكلي', periods: 28, timeVolume: '20:30', isTotal: true },
];

interface Props {
  profile?: TeacherProfile;
}

export default function TimetableDashboard({ profile }: Props) {
  const [projectData, setProjectData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'classes' | 'teachers' | 'org'>('classes');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'flowers'>('classic');

  const userProfile: TeacherProfile = useMemo(() => {
    if (profile) return profile;
    try {
      const saved = localStorage.getItem('tamkeen_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: projectData?.teacherName || 'الأستاذ(ة)',
      institution: projectData?.schoolName || 'المؤسسة التربوية',
      province: projectData?.directorate || 'الجزائر',
      academicYear: projectData?.year || '2025/2026',
      teachingSubject: 'التعليم العام'
    } as TeacherProfile;
  }, [profile, projectData]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tamkeen_timetable_project');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProjectData(parsed.metadata);
        if (parsed.metadata?.template === 'classic' || parsed.metadata?.template === 'flowers') {
          setSelectedTemplate(parsed.metadata.template);
        }
        if (parsed.schedule && parsed.schedule.length > 0) {
          setSchedule(parsed.schedule);
        }
      } catch (e) {}
    }
  }, []);

  const handleTemplateChange = (tpl: 'classic' | 'flowers') => {
    setSelectedTemplate(tpl);
    if (projectData) {
      const updated = { ...projectData, template: tpl };
      setProjectData(updated);
      try {
        const saved = localStorage.getItem('tamkeen_timetable_project');
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.metadata = updated;
          localStorage.setItem('tamkeen_timetable_project', JSON.stringify(parsed));
        }
      } catch (e) {}
    }
  };

  const handleCompleteSetup = (data: any) => {
    if (data?.template === 'classic' || data?.template === 'flowers') {
      setSelectedTemplate(data.template);
    }
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProjectData(data);
      
      // Update activities and mock schedule
      const isPrimary = data.stage === 'primary' || !data.stage;
      const isTeacherProject = data.projectType === 'teacher';

      if (schedule.length === 0) {
        let newActivities: typeof DEFAULT_ACTIVITIES = [];
        const mockSchedule: ScheduleItem[] = [];

        if (isPrimary || !isTeacherProject) {
          // Primary or Class project: Activities are Subjects
          newActivities = [
            { id: '1', name: 'اللغة العربية', periods: 9, timeVolume: '7:30', isTotal: false },
            { id: '2', name: 'الرياضيات', periods: 6, timeVolume: '5:00', isTotal: false },
            { id: '3', name: 'تربية إسلامية', periods: 3, timeVolume: '1:30', isTotal: false },
            { id: '4', name: 'لغة فرنسية', periods: 3, timeVolume: '2:15', isTotal: false },
            { id: '5', name: 'المجموع', periods: 21, timeVolume: '16:15', isTotal: true },
          ];
          const subjects = ['لغة عربية', 'رياضيات', 'تربية إسلامية', 'تربية علمية', 'لغة فرنسية'];
          for (let d = 0; d < 5; d++) {
            for (let t = 0; t < 4; t++) {
              mockSchedule.push({ dayIdx: d, timeIdx: t, period: 'morning', subject: subjects[Math.floor(Math.random() * 3)] });
              mockSchedule.push({ dayIdx: d, timeIdx: t, period: 'afternoon', subject: subjects[Math.floor(Math.random() * subjects.length)] });
            }
          }
        } else {
          // Middle/High Teacher Project: Activities are Classes (الأفواج)
          const levels = (data.level || '').split(',');
          let classes: string[] = [];
          
          levels.forEach((lvl: string) => {
            const prefix = lvl === 'm1' ? '1م' : lvl === 'm2' ? '2م' : lvl === 'm3' ? '3م' : lvl === 'm4' ? '4م' : lvl === 's1' ? '1ثا' : lvl === 's2' ? '2ثا' : '3ثا';
            if (prefix) {
              classes.push(`${prefix}1`, `${prefix}2`);
            }
          });
          
          if (classes.length === 0) {
            classes = ['1م1', '1م2', '2م1', '2م2'];
          }

          newActivities = classes.map((c, idx) => ({
            id: String(idx + 1),
            name: c,
            periods: 4,
            timeVolume: '4',
            isTotal: false
          }));
          newActivities.push({
            id: '999',
            name: 'المجموع',
            periods: classes.length * 4,
            timeVolume: String(classes.length * 4),
            isTotal: true
          });

          for (let d = 0; d < 5; d++) {
            for (let t = 0; t < 4; t++) {
              mockSchedule.push({ dayIdx: d, timeIdx: t, period: 'morning', subject: classes[Math.floor(Math.random() * classes.length)] });
              mockSchedule.push({ dayIdx: d, timeIdx: t, period: 'afternoon', subject: classes[Math.floor(Math.random() * classes.length)] });
            }
          }
        }

        setActivities(newActivities);
        setSchedule(mockSchedule);
      }
      
      setIsGenerating(false);
    }, 2500);
  };

  if (isGenerating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-teal-200 dark:border-teal-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">جاري التوليد الذكي...</h2>
          <p className="text-slate-500 font-bold mb-8 text-sm">يقوم محرك تمكين بمعالجة المعطيات وإسناد الأفواج للأساتذة لإنشاء الجداول بطريقة متوازنة.</p>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, generationProgress)}%` }}></div>
          </div>
          <div className="text-teal-600 font-black text-sm">{Math.min(100, generationProgress)}%</div>
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    if (!projectData) return;
    setIsExporting(true);
    try {
      const { exportTimetableToPDF } = await import('../utils/pdfGenerator');
      await exportTimetableToPDF(userProfile, {
        metadata: { ...projectData, template: selectedTemplate },
        schedule,
        activities,
        type: activeTab === 'teachers' ? 'teacher' : 'class',
        template: selectedTemplate
      });
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير جدول التوقيت بصيغة PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    if (!projectData) return;
    try {
      const { exportTimetableToWord } = await import('../utils/pdfGenerator');
      await exportTimetableToWord(userProfile, {
        metadata: { ...projectData, template: selectedTemplate },
        schedule,
        activities,
        type: activeTab === 'teachers' ? 'teacher' : 'class',
        template: selectedTemplate
      });
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تصدير ملف Word.');
    }
  };

  // Save to local storage
  const handleSave = () => {
    if (!projectData) return;
    localStorage.setItem('tamkeen_timetable_project', JSON.stringify({
      metadata: { ...projectData, template: selectedTemplate },
      schedule
    }));
    alert('تم حفظ التعديلات بنجاح');
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من تصفير كل الجداول؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setSchedule([]);
      localStorage.removeItem('tamkeen_timetable_project');
      setProjectData(null);
    }
  };

  if (!projectData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
        <ProjectSetupStepper onComplete={handleCompleteSetup} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header controls matching MowaqitDZ */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800">
        
        {/* Top bar: Template selector & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex-1 w-full md:w-auto">
            <div className="text-center font-black text-emerald-600 dark:text-emerald-400 text-2xl mb-2">
              {projectData.schoolName || 'مشروع جديد'}
            </div>
            <div className="text-center text-sm font-bold text-slate-500">
              {projectData.year} • {projectData.directorate}
            </div>
          </div>
        </div>

        {/* اختيار كيفية التصدير والنموذج (النموذج المعتمد في المنصة + نموذج رياحين بالزهور) */}
        <div className="w-full max-w-2xl mx-auto mb-6 bg-slate-50/80 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <p className="text-xs font-black text-slate-700 dark:text-slate-300 mb-2.5 text-center flex items-center justify-center gap-2">
            <span>🎨</span>
            <span>اختيار كيفية تصدير الجداول والبطاقات (الرياحين):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleTemplateChange('classic')}
              className={cn(
                "p-3.5 rounded-xl border-2 transition-all text-right flex items-center gap-3",
                selectedTemplate === 'classic'
                  ? "border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-emerald-400/20"
                  : "border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 text-slate-600"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                selectedTemplate === 'classic' ? "bg-emerald-100 text-emerald-800 font-black shadow-inner" : "bg-slate-100 text-slate-400"
              )}>
                🏛️
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-black text-xs text-slate-800 dark:text-white truncate">النموذج المعتمد (الأصيل)</span>
                  {selectedTemplate === 'classic' && (
                    <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black">المعتمد</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-bold truncate">النموذج الرسمي المعتمد حالياً في المنصة</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTemplateChange('flowers')}
              className={cn(
                "p-3.5 rounded-xl border-2 transition-all text-right flex items-center gap-3",
                selectedTemplate === 'flowers'
                  ? "border-amber-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-amber-400/20"
                  : "border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 text-slate-600"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                selectedTemplate === 'flowers' ? "bg-amber-100 text-amber-800 font-black shadow-inner" : "bg-slate-100 text-slate-400"
              )}>
                🌸
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-black text-xs text-slate-800 dark:text-white truncate">نموذج رياحين والبطاقات</span>
                  {selectedTemplate === 'flowers' && (
                    <span className="text-[8px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-black">مُفعّل</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-bold truncate">خلفية زهور للذكور والإناث مع زخارف ستوندار</p>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:flex justify-center flex-wrap gap-3 mb-8">
          
          <button onClick={handleSave} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-xl font-black transition-all">
            <Save size={18} /> حفظ
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl font-black transition-all">
            <Edit size={18} /> تعديل الأنشطة
          </button>
          <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileText size={18} /> {isExporting ? 'جاري التصدير...' : 'تصدير رسمي (PDF)'}
          </button>
          <button onClick={handleExportWord} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black transition-all shadow-md active:scale-95">
            <FileDown size={18} /> تحميل Word (.doc)
          </button>
          <button onClick={handleReset} className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl font-black transition-all">
            <RefreshCw size={18} /> تصفير الكل
          </button>
        </div>

        {/* Big Tabs */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => setActiveTab('classes')}
            className={cn(
              "flex items-center justify-center gap-3 px-8 py-5 rounded-full font-black text-lg transition-all",
              activeTab === 'classes' 
                ? "bg-gradient-to-r from-teal-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            <LayoutGrid size={24} /> جداول الأقسام
          </button>
          <button 
            onClick={() => setActiveTab('teachers')}
            className={cn(
              "flex items-center justify-center gap-3 px-8 py-5 rounded-full font-black text-lg transition-all",
              activeTab === 'teachers' 
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            <Users size={24} /> جداول الأساتذة
          </button>
          <button 
            onClick={() => setActiveTab('org')}
            className={cn(
              "flex items-center justify-center gap-3 px-8 py-5 rounded-full font-black text-lg transition-all",
              activeTab === 'org' 
                ? "bg-gradient-to-r from-purple-400 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            <Network size={24} /> التنظيم التربوي
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="space-y-8">
        
        {/* Class Details Input (Matches Image 5) */}
        {activeTab === 'classes' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="bg-emerald-500 text-white font-black px-6 py-3 rounded-xl mb-6 text-center shadow-md">
              السنة {projectData.level}
            </div>
            
            <h3 className="font-black text-slate-800 dark:text-white mb-4 mr-2">بيانات الجدول</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-4">
                <label className="text-xs font-bold text-slate-500">اسم الأستاذ(ة)</label>
                <input type="text" value={projectData.teacherName} onChange={e => setProjectData({...projectData, teacherName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-emerald-400 transition-all text-center" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-500">ذكور</label>
                <input type="number" placeholder="مثال: 15" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-emerald-400 transition-all text-center" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-500">إناث</label>
                <input type="number" placeholder="مثال: 15" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-emerald-400 transition-all text-center" />
              </div>
              <div className="space-y-2 col-span-4 md:col-span-2">
                <label className="text-xs font-bold text-slate-500">رقم الحجرة</label>
                <input type="text" value={projectData.room} onChange={e => setProjectData({...projectData, room: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold outline-none focus:border-emerald-400 transition-all text-center" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsModalOpen(true)} className="text-orange-500 hover:text-orange-600 font-black text-sm flex items-center gap-2">
                <Edit size={16} /> تعديل النموذج - حصص، أزمنة
              </button>
            </div>
          </div>
        )}

        {/* Timetable Grid for Web Editing */}
        {activeTab !== 'org' && (
          <div className="no-print">
            <TimetableGrid 
              type={activeTab === 'teachers' ? 'teacher' : 'class'} 
              schedule={schedule} 
              setSchedule={setSchedule} 
              metadata={projectData}
            />
          </div>
        )}

        {/* Educational Org Dashboard */}
        {activeTab === 'org' && (
          <div className="no-print">
            <EducationalOrgDashboard metadata={projectData} />
          </div>
        )}

        {/* Printable View (Hidden on web, visible on print) */}
        {activeTab !== 'org' && (
          <div className="mt-12 overflow-x-auto shadow-2xl rounded-xl border border-slate-200 print:shadow-none print:border-none print:mt-0">
            <PrintableTimetable 
              type={activeTab === 'teachers' ? 'teacher' : 'class'} 
              schedule={schedule} 
              metadata={{ ...projectData, template: selectedTemplate }} 
              activities={activities}
              template={selectedTemplate}
            />
          </div>
        )}
      </div>

      <ActivitiesEditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activities={activities}
        onSave={(newActs) => {
          setActivities(newActs);
          setIsModalOpen(false);
        }}
        label={projectData?.projectType === 'teacher' && projectData?.stage !== 'primary' ? 'الفوج' : 'النشاط'}
      />
    </div>
  );
}
