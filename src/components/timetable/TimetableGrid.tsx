import React, { useState } from 'react';
import { Plus, X, Coffee, Clock } from 'lucide-react';
import { ScheduleItem } from '../../lib/views/TimetableDashboard';
import { getTimetableTimingConfig } from '../../lib/utils/timetableConfig';

interface Props {
  type: 'teacher' | 'class';
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  metadata?: any;
}

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export function TimetableGrid({ type, schedule, setSchedule, metadata }: Props) {
  const [editingSlot, setEditingSlot] = useState<{dayIdx: number, timeIdx: number, period: 'morning' | 'afternoon'} | null>(null);
  const [inputValue, setInputValue] = useState('');

  const timingConfig = getTimetableTimingConfig(metadata?.stage, metadata?.system);
  const hasAfternoonBreak = Boolean(timingConfig.afternoonRecessTime);

  const handleCellClick = (dayIdx: number, timeIdx: number, period: 'morning' | 'afternoon') => {
    const existing = schedule.find(s => s.dayIdx === dayIdx && s.timeIdx === timeIdx && s.period === period);
    setInputValue(existing ? existing.subject : '');
    setEditingSlot({ dayIdx, timeIdx, period });
  };

  const handleSave = () => {
    if (!editingSlot) return;
    
    setSchedule(prev => {
      const filtered = prev.filter(s => !(s.dayIdx === editingSlot.dayIdx && s.timeIdx === editingSlot.timeIdx && s.period === editingSlot.period));
      if (inputValue.trim() === '') return filtered;
      return [...filtered, { ...editingSlot, subject: inputValue }];
    });
    setEditingSlot(null);
  };

  const handleDelete = (dayIdx: number, timeIdx: number, period: 'morning' | 'afternoon', e: React.MouseEvent) => {
    e.stopPropagation();
    setSchedule(prev => prev.filter(s => !(s.dayIdx === dayIdx && s.timeIdx === timeIdx && s.period === period)));
  };

  const renderCell = (dayIdx: number, timeIdx: number, period: 'morning' | 'afternoon') => {
    const item = schedule.find(s => s.dayIdx === dayIdx && s.timeIdx === timeIdx && s.period === period);
    const isEditing = editingSlot?.dayIdx === dayIdx && editingSlot?.timeIdx === timeIdx && editingSlot?.period === period;

    if (isEditing) {
      return (
        <div className="flex-1 min-w-[90px] h-20 bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-xl p-2 relative z-10 shadow-lg">
          <input 
            type="text"
            autoFocus
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            onBlur={handleSave}
            placeholder={type === 'teacher' ? 'القسم (مثال: 3م2)' : 'المادة (مثال: رياضيات)'}
            className="w-full h-full bg-transparent text-center text-xs font-bold outline-none"
          />
        </div>
      );
    }

    if (item) {
      return (
        <button 
          onClick={() => handleCellClick(dayIdx, timeIdx, period)}
          className="flex-1 min-w-[90px] h-20 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800/80 rounded-xl relative group hover:border-emerald-400 transition-colors flex items-center justify-center p-1.5"
        >
          <span className="font-black text-emerald-800 dark:text-emerald-300 text-xs text-center line-clamp-3 leading-tight">{item.subject}</span>
          <div 
            onClick={(e) => handleDelete(dayIdx, timeIdx, period, e)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
          >
            <X size={12} />
          </div>
        </button>
      );
    }

    return (
      <button 
        onClick={() => handleCellClick(dayIdx, timeIdx, period)}
        className="flex-1 min-w-[90px] h-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center justify-center text-slate-300 group-hover:border-slate-300"
      >
        <Plus size={16} />
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
      <div className="min-w-[1000px]">
        
        {/* Banner with timing configuration notice */}
        <div className="mb-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
            <Clock size={16} className="text-emerald-500" />
            <span>نظام التمدرس: <strong>{timingConfig.systemTitle}</strong> ({timingConfig.stageTitle})</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">ينتهي التوقيت اليومي عند الساعة {timingConfig.endTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-black bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <Coffee size={14} />
            <span>استراحة بيداغوجية 15 دقيقة مدرجة في الجدول</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex border-b-2 border-slate-800 dark:border-slate-100 mb-4 pb-2">
          <div className="w-24 shrink-0 font-black text-center text-slate-800 dark:text-white flex items-end justify-center pb-2">الأيام</div>
          
          <div className="flex-1 flex gap-2">
            {/* Morning Section */}
            <div className="flex-[4] flex flex-col text-center border-r-2 border-slate-200 dark:border-slate-700 pr-2">
              <span className="font-black text-emerald-600 dark:text-emerald-400 mb-2 text-xs">الفترة الصباحية (تبدأ 08:00)</span>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.morningHours[0]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.morningDurations[0]}</div>
                </div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.morningHours[1]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.morningDurations[1]}</div>
                </div>

                {/* Morning 15-min Break Column */}
                <div className="w-14 shrink-0 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-lg flex flex-col items-center justify-center p-1 text-center">
                  <span className="text-[9px] font-black text-amber-700 dark:text-amber-400">استراحة</span>
                  <span className="text-[8px] font-bold text-amber-600 dark:text-amber-500">15 د</span>
                  <span className="text-[7px] text-slate-400 leading-none mt-0.5">{timingConfig.morningRecessTime}</span>
                </div>

                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.morningHours[2]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.morningDurations[2]}</div>
                </div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.morningHours[3]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.morningDurations[3]}</div>
                </div>
              </div>
            </div>

            {/* Midday Break Column */}
            <div className="w-14 shrink-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-center border border-slate-200 dark:border-slate-700">
              <span className="text-[9px] font-black text-slate-600 dark:text-slate-300">استراحة</span>
              <span className="text-[8px] font-bold text-slate-500">الزوال</span>
              <span className="text-[7px] text-slate-400 leading-none mt-0.5">{timingConfig.middayTime}</span>
            </div>

            {/* Afternoon Section */}
            <div className="flex-[4] flex flex-col text-center border-l-2 border-slate-200 dark:border-slate-700 pl-2">
              <span className="font-black text-indigo-600 dark:text-indigo-400 mb-2 text-xs">
                {timingConfig.afternoonTitle} (حتى {timingConfig.endTime})
              </span>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.afternoonHours[0]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.afternoonDurations[0]}</div>
                </div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.afternoonHours[1]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.afternoonDurations[1]}</div>
                </div>

                {hasAfternoonBreak && (
                  <div className="w-14 shrink-0 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-lg flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-[9px] font-black text-amber-700 dark:text-amber-400">استراحة</span>
                    <span className="text-[8px] font-bold text-amber-600 dark:text-amber-500">15 د</span>
                    <span className="text-[7px] text-slate-400 leading-none mt-0.5">{timingConfig.afternoonRecessTime}</span>
                  </div>
                )}

                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.afternoonHours[2]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.afternoonDurations[2]}</div>
                </div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div>{timingConfig.afternoonHours[3]}</div>
                  <div className="text-[8px] text-slate-400">{timingConfig.afternoonDurations[3]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-3">
          {DAYS.map((day, dIdx) => (
            <div key={dIdx} className="flex items-center group">
              <div className="w-24 shrink-0 font-black text-slate-800 dark:text-white text-center bg-slate-50 dark:bg-slate-800 py-4 rounded-xl border border-slate-100 dark:border-slate-700 h-20 flex items-center justify-center text-sm">
                {day}
              </div>
              
              <div className="flex-1 flex gap-2 mr-2">
                {/* Morning Slots */}
                <div className="flex-[4] flex gap-2 pr-2 border-r-2 border-slate-200 dark:border-slate-700">
                  {renderCell(dIdx, 0, 'morning')}
                  {renderCell(dIdx, 1, 'morning')}

                  {/* Morning 15-min Break Slot Indicator */}
                  <div className="w-14 shrink-0 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl h-20 border border-dashed border-amber-200 dark:border-amber-800/40 flex flex-col items-center justify-center text-[10px] font-black text-amber-600 dark:text-amber-500">
                    <span>15 د</span>
                    <span className="text-[8px] font-normal text-amber-500">راحة</span>
                  </div>

                  {renderCell(dIdx, 2, 'morning')}
                  {renderCell(dIdx, 3, 'morning')}
                </div>
                
                {/* Midday Break Spacer */}
                <div className="w-14 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl h-20 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-[10px] font-black text-slate-400">
                  <span>زوال</span>
                </div>
                
                {/* Afternoon Slots */}
                <div className="flex-[4] flex gap-2 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                  {renderCell(dIdx, 0, 'afternoon')}
                  {renderCell(dIdx, 1, 'afternoon')}

                  {hasAfternoonBreak && (
                    <div className="w-14 shrink-0 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl h-20 border border-dashed border-amber-200 dark:border-amber-800/40 flex flex-col items-center justify-center text-[10px] font-black text-amber-600 dark:text-amber-500">
                      <span>15 د</span>
                      <span className="text-[8px] font-normal text-amber-500">راحة</span>
                    </div>
                  )}

                  {renderCell(dIdx, 2, 'afternoon')}
                  {renderCell(dIdx, 3, 'afternoon')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
