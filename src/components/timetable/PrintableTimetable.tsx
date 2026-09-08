import React from 'react';
import { ScheduleItem } from '../../lib/views/TimetableDashboard';
import { getTimetableTimingConfig } from '../../lib/utils/timetableConfig';
import { cn } from '../../lib/utils';

interface Props {
  type: 'teacher' | 'class';
  schedule: ScheduleItem[];
  metadata: any;
  activities?: any[];
  template?: 'classic' | 'flowers' | 'standard';
}

const CornerFloralOrnament = ({ position }: { position: 'tr' | 'tl' | 'br' | 'bl' }) => {
  const transform =
    position === 'tl' ? 'scaleX(-1)' :
    position === 'br' ? 'scaleY(-1)' :
    position === 'bl' ? 'scale(-1, -1)' : undefined;

  const style: React.CSSProperties = {
    position: 'absolute',
    top: position.includes('t') ? '8px' : undefined,
    bottom: position.includes('b') ? '8px' : undefined,
    right: position.includes('r') ? '8px' : undefined,
    left: position.includes('l') ? '8px' : undefined,
    width: '64px',
    height: '64px',
    pointerEvents: 'none',
    zIndex: 10,
    transform,
  };

  return (
    <div style={style}>
      <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,90 Q15,30 90,10" stroke="#b45309" strokeWidth="2.5" fill="none"/>
        <path d="M15,85 Q25,35 85,25" stroke="#047857" strokeWidth="1.8" fill="none"/>
        <circle cx="85" cy="15" r="5" fill="#d97706"/>
        <circle cx="85" cy="15" r="2.2" fill="#fef3c7"/>
        <circle cx="70" cy="18" r="4" fill="#059669"/>
        <circle cx="82" cy="32" r="4" fill="#059669"/>
        <path d="M35,60 Q55,40 65,58 Q48,50 35,60 Z" fill="#047857" opacity="0.8"/>
        <path d="M52,42 Q72,22 82,40 Q64,32 52,42 Z" fill="#b45309" opacity="0.75"/>
        <circle cx="15" cy="85" r="3.5" fill="#b45309"/>
      </svg>
    </div>
  );
};

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export function PrintableTimetable({ type, schedule, metadata, activities = [], template }: Props) {
  const timingConfig = getTimetableTimingConfig(metadata?.stage, metadata?.system);
  const hasAfternoonBreak = Boolean(timingConfig.afternoonRecessTime);
  const activeTemplate = template || metadata?.template || 'classic';
  const isFlowers = activeTemplate === 'flowers';

  const getSubject = (dayIdx: number, timeIdx: number, period: 'morning' | 'afternoon') => {
    const item = schedule.find(s => s.dayIdx === dayIdx && s.timeIdx === timeIdx && s.period === period);
    return item ? item.subject : '';
  };

  const getSubTitle = () => {
    if (metadata?.level === 'prep') return 'القسم التحضيري';
    const lvlNum = String(metadata?.level || '').replace(/[^0-9]/g, '');
    const text = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'][parseInt(lvlNum) - 1] || metadata?.level;
    return `للسنة ${text}`;
  };

  return (
    <>
      <style>
        {`
          @page { size: A4 landscape; margin: 6mm; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
        `}
      </style>
      <div 
        className={cn(
          "p-4 mx-auto print:m-0 print:p-1 flex flex-col justify-between relative transition-all",
          isFlowers 
            ? "bg-[#fffdf9] text-black border-4 border-double border-amber-600/70 shadow-md" 
            : "bg-white text-black"
        )}
        style={{ 
          width: '285mm', 
          minHeight: '195mm', 
          maxHeight: '200mm', 
          boxSizing: 'border-box',
          outline: isFlowers ? '1.5px solid #047857' : undefined,
          outlineOffset: isFlowers ? '-6px' : undefined
        }}
        dir="rtl"
      >
        {/* 4 Standard Corner Floral Ornaments for Rayaheen model (صالحة للذكور والإناث) */}
        {isFlowers && (
          <>
            <CornerFloralOrnament position="tr" />
            <CornerFloralOrnament position="tl" />
            <CornerFloralOrnament position="br" />
            <CornerFloralOrnament position="bl" />
          </>
        )}

        <div>
          {/* Header */}
          <div className="text-center font-bold mb-3">
            <p className="text-xs font-black mb-0.5 text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية</p>
            <h1 className={cn(
              "text-lg font-black leading-snug",
              isFlowers ? "text-emerald-950 flex items-center justify-center gap-2" : "text-blue-900"
            )}>
              {isFlowers && <span className="text-amber-600">🌸</span>}
              {type === 'teacher' ? `جدول توقيت الأستاذ(ة): ${metadata?.teacherName || ''}` : `التوقيت الأسبوعي ${getSubTitle()}`}
              {isFlowers && <span className="text-amber-600">🌸</span>}
            </h1>
            <p className="text-xs font-bold text-slate-700">
              {timingConfig.stageTitle} — {timingConfig.systemTitle}
              {isFlowers && <span className="text-emerald-800 mr-2 font-black">🌱 (نموذج رياحين الزخرفي)</span>}
            </p>
          </div>

          {/* Metadata Details */}
          <div className="flex justify-between items-start mb-2 px-3 text-[11px] font-bold border-b border-slate-300 pb-1.5">
            <div className="space-y-0.5">
              <p>مديرية التربية لولاية : <span className="border-b border-black inline-block min-w-[140px] px-1">{metadata?.directorate}</span></p>
              {timingConfig.isPrimary ? (
                <p>مفتشية التربية والتعليم الابتدائي : <span className="border-b border-black inline-block min-w-[140px] px-1">{metadata?.inspectorate || 'المقاطعة الأولى'}</span></p>
              ) : (
                <p>التخصص المعتمد : <span className="border-b border-black inline-block min-w-[140px] px-1 font-black text-rose-800">
                  {{
                    'arabic': 'لغة عربية', 'french': 'لغة فرنسية', 'english': 'لغة إنجليزية', 'pe': 'تربية بدنية ورياضية',
                    'math': 'رياضيات', 'physics': 'العلوم الفيزيائية والتكنولوجيا', 'science': 'علوم الطبيعة والحياة',
                    'history_geo': 'تاريخ وجغرافيا', 'islamic': 'تربية إسلامية', 'civics': 'تربية مدنية', 'informatics': 'إعلام آلي',
                    'philosophy': 'فلسفة', 'accounting': 'تسيير محاسبي ومالي', 'engineering': 'هندسة'
                  }[metadata?.specialty as string] || metadata?.specialty}
                </span></p>
              )}
              <p>المؤسسة : <span className="border-b border-black inline-block min-w-[140px] px-1">{metadata?.schoolName}</span></p>
            </div>
            <div className="space-y-0.5 text-left">
              <p className="text-rose-800 font-black">السنة الدراسية : <span className="text-black font-bold">{metadata?.year || '2025/2026'}</span></p>
              <p className="text-rose-800 font-black">الأستاذ (ة) : <span className="text-black font-bold">{metadata?.teacherName}</span></p>
              <p className="text-slate-600 font-bold">نظام التمدرس : <span className="text-black font-bold">{timingConfig.systemTitle} (ينتهي {timingConfig.endTime})</span></p>
            </div>
          </div>

          {/* Activities Table (Upper) */}
          {activities.length > 0 && (
            <table className="w-full border-collapse border-2 border-slate-900 text-center text-[9.5px] font-bold mb-2">
              <thead>
                <tr>
                  <th className="border border-slate-900 p-1 text-rose-800 bg-rose-50" colSpan={2}>نظام التدريس: {timingConfig.systemTitle}</th>
                  <th className="border border-slate-900 p-1" colSpan={2}>القسم: {getSubTitle()}</th>
                  <th className="border border-slate-900 p-1" colSpan={4}>
                    عدد التلاميذ: .... الذكور: .... - الإناث: ....
                  </th>
                  <th className="border border-slate-900 p-1 text-left" colSpan={activities.length > 8 ? activities.length - 8 + 2 : 2}>
                    رقم الحجرة الدراسية: {metadata?.room || '....'}
                  </th>
                </tr>
                <tr className="bg-slate-100">
                  <th className="border border-slate-900 p-0.5 w-20">{type === 'teacher' && metadata?.stage !== 'primary' ? 'الأفواج المسندة' : 'الأنشطة'}</th>
                  {activities.map((act, i) => (
                    <th key={i} className="border border-slate-900 p-0.5">{act.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-slate-900 p-0.5 bg-slate-100">ع.الحصص</th>
                  {activities.map((act, i) => (
                    <td key={i} className="border border-slate-900 p-0.5">{act.periods.toString().padStart(2, '0')}</td>
                  ))}
                </tr>
                <tr>
                  <th className="border border-slate-900 p-0.5 bg-slate-100">الزمن</th>
                  {activities.map((act, i) => (
                    <td key={i} className="border border-slate-900 p-0.5">{act.timeVolume} {timingConfig.isPrimary ? 'سا' : ''}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}

          {/* Schedule Grid (Lower) */}
          <table className="w-full border-collapse border-2 border-slate-900 text-center text-[10px] font-bold table-fixed">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-900 w-16" rowSpan={2}>الأيام</th>
                <th className="border border-slate-900 bg-blue-50 text-blue-900 p-1" colSpan={2}>الفترة الصباحية (أولى)</th>
                <th className="border border-slate-900 w-9 p-0.5 bg-white text-[8.5px] font-black text-slate-700" rowSpan={2}>
                  استراحة<br/><span className="text-[7.5px] font-normal">{timingConfig.morningRecessTime}</span>
                </th>
                <th className="border border-slate-900 bg-blue-50 text-blue-900 p-1" colSpan={2}>الفترة الصباحية (ثانية)</th>
                <th className="border border-slate-900 w-9 p-0.5 bg-slate-100 text-[8.5px] font-black text-slate-700" rowSpan={2}>
                  استراحة<br/>الزوال
                </th>
                <th className="border border-slate-900 bg-indigo-50 text-indigo-900 p-1" colSpan={hasAfternoonBreak ? 2 : 4}>
                  {hasAfternoonBreak ? 'الفترة المسائية (أولى)' : timingConfig.afternoonTitle}
                </th>
                {hasAfternoonBreak && (
                  <>
                    <th className="border border-slate-900 w-9 p-0.5 bg-white text-[8.5px] font-black text-slate-700" rowSpan={2}>
                      استراحة<br/><span className="text-[7.5px] font-normal">{timingConfig.afternoonRecessTime}</span>
                    </th>
                    <th className="border border-slate-900 bg-indigo-50 text-indigo-900 p-1" colSpan={2}>
                      الفترة المسائية (حتى {timingConfig.endTime})
                    </th>
                  </>
                )}
              </tr>
              <tr className="bg-slate-50 text-[9px]">
                <th className="border border-slate-900 p-0.5">{timingConfig.morningHours[0]}</th>
                <th className="border border-slate-900 p-0.5">{timingConfig.morningHours[1]}</th>
                <th className="border border-slate-900 p-0.5">{timingConfig.morningHours[2]}</th>
                <th className="border border-slate-900 p-0.5">{timingConfig.morningHours[3]}</th>
                <th className="border border-slate-900 p-0.5">{timingConfig.afternoonHours[0]}</th>
                <th className="border border-slate-900 p-0.5">{timingConfig.afternoonHours[1]}</th>
                {hasAfternoonBreak ? (
                  <>
                    <th className="border border-slate-900 p-0.5">{timingConfig.afternoonHours[2]}</th>
                    <th className="border border-slate-900 p-0.5">{timingConfig.afternoonHours[3]}</th>
                  </>
                ) : (
                  <>
                    <th className="border border-slate-900 p-0.5">{timingConfig.afternoonHours[2]}</th>
                    <th className="border border-slate-900 p-0.5">{timingConfig.afternoonHours[3]}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, dIdx) => (
                <tr key={dIdx} className="h-9">
                  <th className="border border-slate-900 bg-slate-100 font-black">{day}</th>
                  
                  {/* Morning Slot 0 & 1 */}
                  <td className="border border-slate-900 p-0.5">{getSubject(dIdx, 0, 'morning')}</td>
                  <td className="border border-slate-900 p-0.5">{getSubject(dIdx, 1, 'morning')}</td>

                  {/* Morning Recess */}
                  <td className="border border-slate-900 p-0.5 bg-slate-50 text-[8px] font-bold text-slate-500">{timingConfig.morningRecessDuration}</td>

                  {/* Morning Slot 2 & 3 */}
                  <td className="border border-slate-900 p-0.5">{getSubject(dIdx, 2, 'morning')}</td>
                  <td className="border border-slate-900 p-0.5">{getSubject(dIdx, 3, 'morning')}</td>

                  {/* Midday Break */}
                  <td className="border border-slate-900 p-0.5 bg-slate-100 text-[8px] font-bold text-slate-600">زوال</td>
                  
                  {/* Afternoon Slots */}
                  <td className="border border-slate-900 p-0.5 bg-slate-50/50">{getSubject(dIdx, 0, 'afternoon')}</td>
                  <td className="border border-slate-900 p-0.5 bg-slate-50/50">{getSubject(dIdx, 1, 'afternoon')}</td>
                  
                  {hasAfternoonBreak ? (
                    <>
                      {/* Afternoon Recess */}
                      <td className="border border-slate-900 p-0.5 bg-slate-50 text-[8px] font-bold text-slate-500">{timingConfig.afternoonRecessDuration}</td>
                      <td className="border border-slate-900 p-0.5 bg-slate-50/50">{getSubject(dIdx, 2, 'afternoon')}</td>
                      <td className="border border-slate-900 p-0.5 bg-slate-50/50">{getSubject(dIdx, 3, 'afternoon')}</td>
                    </>
                  ) : (
                    <>
                      <td className="border border-slate-900 p-0.5 bg-slate-50/50">{getSubject(dIdx, 2, 'afternoon')}</td>
                      <td className="border border-slate-900 p-0.5 bg-slate-50/50">{getSubject(dIdx, 3, 'afternoon')}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Area: Guidelines Reference + Signatures (Zero overlap guaranteed) */}
        <div className="mt-3">
          {/* Footer Remarks (الجملتان الأخيرتان في إطار كامل وواضح) */}
          <div className="pt-2 border-t-2 border-slate-900 text-[8.5px] text-right text-slate-800 leading-relaxed flex justify-between items-center mb-4">
            <div>
              <p className="font-bold">• منجز وفق الدليل التطبيقي لشبكة مواقيت التعليم {timingConfig.stageTitle} الصادر عن المفتشية العامة للبيداغوجيا بوزارة التربية الوطنية.</p>
              <p className="font-bold">• البيان الوزاري المتعلق بإعادة هيكلة مواد ومواقيت التعليم للسنة الدراسية {metadata?.year || '2025/2026'} — {timingConfig.systemTitle} (ينتهي عند الساعة {timingConfig.endTime}).</p>
            </div>
            <div className="text-[8px] font-bold text-slate-500 shrink-0 mr-4">منصة تمكين الرقمية للأستاذ الجزائري</div>
          </div>

          {/* Signatures (مساحة التوقيعات الثلاثية بدون أي تداخل مع النصوص أو الأختام) */}
          <div className="flex justify-between px-10 text-xs font-bold">
            <div className="text-center min-w-[160px]">
              <p className="font-black text-slate-900 mb-8">توقيع الأستاذ(ة):</p>
              <p className="text-slate-400 font-normal">........................................</p>
            </div>
            <div className="text-center min-w-[160px]">
              <p className="font-black text-slate-900 mb-8">تأشيرة وختم السيد المدير:</p>
              <p className="text-slate-400 font-normal">........................................</p>
            </div>
            <div className="text-center min-w-[160px]">
              <p className="font-black text-slate-900 mb-8">تأشيرة وتوقيع السيد المفتش:</p>
              <p className="text-slate-400 font-normal">........................................</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
