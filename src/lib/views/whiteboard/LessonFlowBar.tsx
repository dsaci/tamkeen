import React, { useState } from 'react';
import {
  GraduationCap, ChevronDown, ChevronUp, Play, CheckCircle2,
  Sparkles, Eye, Clock, Users, Trophy, BookOpen, Layers, Save, Download
} from 'lucide-react';

export interface LessonStage {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  actions: { label: string; icon: string; onClick: () => void }[];
}

interface LessonFlowBarProps {
  currentStage: number;
  onSelectStage: (stageId: number) => void;
  onInsertLaunchSituation: () => void;
  onToggleCurtain: () => void;
  onToggleSpotlight: () => void;
  onStartTimer: (minutes: number) => void;
  onSpinWheel: () => void;
  onInsertInteractiveCards: () => void;
  onInsertAssessment: () => void;
  onInsertExitTicket: () => void;
  onSaveLessonBoard: () => void;
}

export default function LessonFlowBar({
  currentStage,
  onSelectStage,
  onInsertLaunchSituation,
  onToggleCurtain,
  onToggleSpotlight,
  onStartTimer,
  onSpinWheel,
  onInsertInteractiveCards,
  onInsertAssessment,
  onInsertExitTicket,
  onSaveLessonBoard,
}: LessonFlowBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const STAGES: LessonStage[] = [
    {
      id: 1,
      title: 'وضعية الانطلاق',
      subtitle: 'إثارة الدافعية والمشكلة',
      badge: 'الاستكشاف',
      color: 'from-amber-500 to-yellow-400',
      actions: [
        { label: 'إدراج سند المشكلة 📖', icon: '📖', onClick: onInsertLaunchSituation },
        { label: 'تفعيل الستارة 🎭', icon: '🎭', onClick: onToggleCurtain },
        { label: 'كشاف الضوء 💡', icon: '💡', onClick: onToggleSpotlight },
      ]
    },
    {
      id: 2,
      title: 'بناء التعلمات',
      subtitle: 'الشرح والتجريب والنمذجة',
      badge: 'التعلم النشط',
      color: 'from-blue-500 to-cyan-400',
      actions: [
        { label: 'كشاف التركيز 💡', icon: '💡', onClick: onToggleSpotlight },
        { label: 'مؤقت الشرح (15 د) ⏱️', icon: '⏱️', onClick: () => onStartTimer(15) },
      ]
    },
    {
      id: 3,
      title: 'النشاط التفاعلي',
      subtitle: 'العمل في أفواج والمطابقة',
      badge: 'العمل التعاوني',
      color: 'from-emerald-500 to-teal-400',
      actions: [
        { label: 'بطاقات السحب والإفلات 🏷️', icon: '🏷️', onClick: onInsertInteractiveCards },
        { label: 'قرعة اختيار تلميذ 🎡', icon: '🎡', onClick: onSpinWheel },
        { label: 'مؤقت الفوج (10 د) ⏱️', icon: '⏱️', onClick: () => onStartTimer(10) },
      ]
    },
    {
      id: 4,
      title: 'التطبيق والترسيخ',
      subtitle: 'تمارين حل مباشرة',
      badge: 'الممارسة',
      color: 'from-indigo-500 to-purple-400',
      actions: [
        { label: 'مؤقت التمرين (5 د) ⏱️', icon: '⏱️', onClick: () => onStartTimer(5) },
        { label: 'قرعة المجيب 🎡', icon: '🎡', onClick: onSpinWheel },
      ]
    },
    {
      id: 5,
      title: 'التقويم الصفي',
      subtitle: 'التأكد من تحقق الكفاءة',
      badge: 'تقويم تكويني',
      color: 'from-rose-500 to-pink-400',
      actions: [
        { label: 'بطاقات صح أم خطأ ✔️❌', icon: '✔️', onClick: onInsertAssessment },
        { label: 'مؤقت التحدي (1 د) ⏱️', icon: '⏱️', onClick: () => onStartTimer(1) },
      ]
    },
    {
      id: 6,
      title: 'الخلاصة والإغلاق',
      subtitle: 'بطاقة الخروج وحفظ الحصة',
      badge: 'الختام',
      color: 'from-amber-600 to-emerald-500',
      actions: [
        { label: 'بطاقة الخروج والملخص 📝', icon: '📝', onClick: onInsertExitTicket },
        { label: 'حفظ سبورة الدرس 💾', icon: '💾', onClick: onSaveLessonBoard },
      ]
    },
  ];

  const activeStageData = STAGES.find(s => s.id === currentStage) || STAGES[0];

  return (
    <div className="w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white font-['Cairo'] select-none transition-all shadow-md z-30">
      {/* Stepper Bar Header */}
      <div className="px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md">
            <GraduationCap size={16} />
          </div>
          <span className="text-xs font-black text-amber-400 hidden sm:inline">سيرورة الدرس 🎓:</span>
        </div>

        {/* The 6 Pedagogical Stages Steps */}
        <div className="flex items-center gap-1.5 flex-1 justify-center max-w-4xl overflow-x-auto">
          {STAGES.map((st) => {
            const isActive = currentStage === st.id;
            const isCompleted = currentStage > st.id;
            return (
              <button
                key={st.id}
                onClick={() => onSelectStage(st.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-black ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                    : isCompleted
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isActive ? 'bg-slate-950 text-amber-400 font-bold' : isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {isCompleted ? '✓' : st.id}
                </span>
                <span>{st.title}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle Expand / Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all shrink-0"
          title={isExpanded ? 'طي تفاصيل المرحلة' : 'إظهار أدوات المرحلة'}
        >
          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Active Stage Contextual Action Ribbon */}
      {isExpanded && (
        <div className="px-6 py-2.5 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-400">المرحلة {activeStageData.id}:</span>
            <span className="font-black text-white">{activeStageData.title}</span>
            <span className="text-slate-400 text-[11px] font-bold">({activeStageData.subtitle})</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-bold border border-slate-700">
              {activeStageData.badge}
            </span>
          </div>

          {/* Quick Actions for Active Stage */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black text-slate-400">أدوات المرحلة:</span>
            {activeStageData.actions.map((act, idx) => (
              <button
                key={idx}
                onClick={act.onClick}
                className="px-3 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white rounded-xl font-black text-xs transition-all flex items-center gap-1.5 border border-slate-700 hover:border-amber-400 shadow-sm"
              >
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
