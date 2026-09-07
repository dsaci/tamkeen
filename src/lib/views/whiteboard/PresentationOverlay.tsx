import React, { useState, useEffect, useRef } from 'react';
import {
  X, Play, Pause, RotateCcw, Volume2,
  EyeOff, MoveVertical, Users, Trophy, Shuffle
} from 'lucide-react';

interface PresentationOverlayProps {
  // Curtain
  showCurtain: boolean;
  onCloseCurtain: () => void;
  // Spotlight
  showSpotlight: boolean;
  onCloseSpotlight: () => void;
  // Timer
  showTimer: boolean;
  onCloseTimer: () => void;
  // Student Picker Wheel
  showPicker: boolean;
  onClosePicker: () => void;
}

export default function PresentationOverlay({
  showCurtain,
  onCloseCurtain,
  showSpotlight,
  onCloseSpotlight,
  showTimer,
  onCloseTimer,
  showPicker,
  onClosePicker,
}: PresentationOverlayProps) {
  // ===================== CURTAIN STATE =====================
  // Height in percentage (0 to 100)
  const [curtainHeight, setCurtainHeight] = useState(55);
  const isDraggingCurtain = useRef(false);

  const handleCurtainPointerDown = (e: React.PointerEvent) => {
    isDraggingCurtain.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCurtainPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingCurtain.current) return;
    const windowH = window.innerHeight;
    const newH = Math.min(95, Math.max(5, (e.clientY / windowH) * 100));
    setCurtainHeight(newH);
  };

  const handleCurtainPointerUp = (e: React.PointerEvent) => {
    isDraggingCurtain.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // ===================== SPOTLIGHT STATE =====================
  const [spotlightPos, setSpotlightPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [spotlightRadius, setSpotlightRadius] = useState(140);

  useEffect(() => {
    if (!showSpotlight) return;
    const handleMove = (e: MouseEvent) => {
      setSpotlightPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [showSpotlight]);

  // ===================== TIMER STATE =====================
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [timerInitial, setTimerInitial] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerAlert(true);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ===================== WHEEL / STUDENT PICKER =====================
  const [studentNames, setStudentNames] = useState<string[]>([
    'أحمد', 'مريم', 'إلياس', 'خديجة', 'ياسين', 'فاطمة', 'أيمن', 'سارة', 'عبد الرحمن', 'أميرة'
  ]);
  const [inputName, setInputName] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [pickedWinner, setPickedWinner] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  const spinWheel = () => {
    if (studentNames.length < 2 || spinning) return;
    setSpinning(true);
    setPickedWinner(null);

    const randomRot = 1440 + Math.floor(Math.random() * 360);
    const finalRot = wheelRotation + randomRot;
    setWheelRotation(finalRot);

    setTimeout(() => {
      setSpinning(false);
      const chosenIdx = Math.floor(Math.random() * studentNames.length);
      setPickedWinner(studentNames[chosenIdx]);
    }, 3200);
  };

  return (
    <>
      {/* ══════════════════ 1. CURTAIN (الستارة) ══════════════════ */}
      {showCurtain && (
        <div className="fixed inset-0 z-[120] pointer-events-none select-none font-['Cairo']">
          {/* Covered Curtain Area */}
          <div
            className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/95 border-b-4 border-amber-400 shadow-2xl relative pointer-events-auto transition-[height] duration-75 flex flex-col justify-end"
            style={{ height: `${curtainHeight}vh` }}
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Top Toolbar */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-white/80">
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-amber-400">
                <EyeOff size={14} />
                <span>ستارة إخفاء الإجابة والسند (اسحب للأسفل أو الأعلى)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurtainHeight(curtainHeight > 50 ? 15 : 85)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-white flex items-center gap-1"
                >
                  <MoveVertical size={13} />
                  <span>{curtainHeight > 50 ? 'كشف أكثر' : 'إخفاء أكثر'}</span>
                </button>
                <button
                  onClick={onCloseCurtain}
                  className="p-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white"
                  title="إغلاق الستارة"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message in Curtain Center */}
            <div className="text-center p-6 mb-4 text-slate-400 text-sm font-bold flex flex-col items-center gap-2">
              <div className="w-12 h-1 bg-amber-400/60 rounded-full mb-1"></div>
              <span>محتوى مخفي مؤقتاً للتفكير والمناقشة الجماعية</span>
            </div>

            {/* Draggable Bottom Grip Bar */}
            <div
              onPointerDown={handleCurtainPointerDown}
              onPointerMove={handleCurtainPointerMove}
              onPointerUp={handleCurtainPointerUp}
              className="w-full h-8 bg-amber-500 hover:bg-amber-400 cursor-row-resize flex items-center justify-center gap-3 text-slate-950 font-black shadow-lg shadow-amber-500/30"
              title="اسحب هنا لتعديل ارتفاع الستارة"
            >
              <div className="w-10 h-1.5 bg-slate-950/40 rounded-full"></div>
              <span className="text-xs tracking-wider">▲ اسحب الستارة لكشف أو إخفاء الحل ▼</span>
              <div className="w-10 h-1.5 bg-slate-950/40 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ 2. SPOTLIGHT (كشاف الضوء) ══════════════════ */}
      {showSpotlight && (
        <div className="fixed inset-0 z-[115] pointer-events-none select-none font-['Cairo']">
          <svg className="w-full h-full block">
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <circle cx={spotlightPos.x} cy={spotlightPos.y} r={spotlightRadius} fill="black" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(2, 6, 23, 0.88)"
              mask="url(#spotlight-mask)"
            />
            {/* Glowing Border around Spotlight */}
            <circle
              cx={spotlightPos.x}
              cy={spotlightPos.y}
              r={spotlightRadius}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeDasharray="6,4"
              opacity="0.8"
            />
          </svg>

          {/* Floating Control Bar for Spotlight */}
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[130] pointer-events-auto bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 text-white text-xs">
            <span className="font-black text-amber-400">💡 كشاف الضوء (Spotlight)</span>
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-slate-400 font-bold">الحجم:</span>
            {[90, 140, 220].map(sz => (
              <button
                key={sz}
                onClick={() => setSpotlightRadius(sz)}
                className={`px-2 py-0.5 rounded-lg font-black transition-all ${
                  spotlightRadius === sz ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {sz === 90 ? 'صغير' : sz === 140 ? 'متوسط' : 'كبير'}
              </button>
            ))}
            <button
              onClick={onCloseSpotlight}
              className="p-1 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white mr-2"
              title="إغلاق الكشاف"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════ 3. CLASSROOM TIMER (المؤقت) ══════════════════ */}
      {showTimer && (
        <div className="fixed bottom-6 left-6 z-[125] font-['Cairo'] select-none animate-in slide-in-from-bottom-5">
          <div className={`p-4 rounded-3xl border-2 shadow-2xl backdrop-blur-md flex flex-col gap-3 transition-all ${
            timerAlert
              ? 'bg-rose-950/95 border-rose-500 ring-4 ring-rose-500/40 animate-bounce'
              : 'bg-slate-900/95 border-slate-700 text-white min-w-[260px]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-black text-slate-300">⏱️ مؤقت النشاط الصفي</span>
              </div>
              <button onClick={onCloseTimer} className="text-slate-400 hover:text-rose-400 p-1">
                <X size={14} />
              </button>
            </div>

            {/* Time Display */}
            <div className="text-center py-2">
              <span className={`font-mono text-4xl font-black tracking-widest ${
                timerAlert ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}>
                {formatTime(timerSeconds)}
              </span>
              {timerAlert && (
                <div className="text-xs font-black text-rose-300 mt-1 flex items-center justify-center gap-1">
                  <Volume2 size={13} className="animate-spin" />
                  <span>انتهى وقت النشاط!</span>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="flex items-center justify-center gap-1">
              {[60, 180, 300, 600].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setTimerInitial(s);
                    setTimerSeconds(s);
                    setTimerAlert(false);
                    setTimerRunning(false);
                  }}
                  className={`px-2 py-1 rounded-xl text-[11px] font-black transition-all ${
                    timerInitial === s ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s === 60 ? '1 د' : s === 180 ? '3 د' : s === 300 ? '5 د' : '10 د'}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-2 mt-1">
              <button
                onClick={() => {
                  setTimerRunning(!timerRunning);
                  if (timerAlert) setTimerAlert(false);
                }}
                className={`flex-1 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all ${
                  timerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {timerRunning ? <><Pause size={14} /> إيقاف مؤقت</> : <><Play size={14} /> ابدأ المؤقت</>}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(timerInitial);
                  setTimerAlert(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="إعادة ضبط"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ 4. WHEEL / RANDOM PICKER (عجلة الأسماء) ══════════════════ */}
      {showPicker && (
        <div className="fixed inset-0 z-[135] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 font-['Cairo'] select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl relative flex flex-col items-center gap-5 text-white">
            <button
              onClick={onClosePicker}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-black text-lg">
              <Users size={22} />
              <span>قرعة اختيار تلميذ عشوائياً 🎡</span>
            </div>

            {/* Spinner Wheel Graphic */}
            <div className="relative w-56 h-56 flex items-center justify-center my-2">
              <div
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl relative overflow-hidden flex items-center justify-center transition-all duration-[3000ms] ease-out"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  background: 'conic-gradient(#ef4444 0% 10%, #f97316 10% 20%, #eab308 20% 30%, #22c55e 30% 40%, #06b6d4 40% 50%, #3b82f6 50% 60%, #8b5cf6 60% 70%, #ec4899 70% 80%, #f43f5e 80% 90%, #10b981 90% 100%)'
                }}
              >
                <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-xs font-black shadow-inner">
                  🎯 تمكين
                </div>
              </div>
              {/* Pointer Marker */}
              <div className="absolute -top-3 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-300 drop-shadow-md z-10"></div>
            </div>

            {/* Winner Announcement */}
            {pickedWinner && (
              <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-400/60 rounded-2xl p-4 w-full text-center animate-in zoom-in-95">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-black text-xs mb-1">
                  <Trophy size={16} className="text-amber-400 animate-bounce" />
                  <span>التلميذ المختار للإجابة:</span>
                </div>
                <div className="text-2xl font-black text-white">{pickedWinner} ⭐</div>
              </div>
            )}

            {/* Action button */}
            <button
              onClick={spinWheel}
              disabled={spinning}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Shuffle size={18} className={spinning ? 'animate-spin' : ''} />
              <span>{spinning ? 'جاري السحب العشوائي...' : 'تدوير العجلة واختيار تلميذ'}</span>
            </button>

            {/* Manage Names Toggle / Pill preview */}
            <div className="w-full bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60 flex flex-col gap-2">
              <span className="text-[11px] font-black text-slate-400">قائمة تلاميذ الفوج ({studentNames.length}):</span>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {studentNames.map((n, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-200 text-xs font-bold">
                    {n}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && inputName.trim()) {
                      setStudentNames(prev => [...prev, inputName.trim()]);
                      setInputName('');
                    }
                  }}
                  placeholder="أضف تلميذاً..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    if (inputName.trim()) {
                      setStudentNames(prev => [...prev, inputName.trim()]);
                      setInputName('');
                    }
                  }}
                  className="px-3 py-1 bg-amber-500 text-slate-950 rounded-xl text-xs font-black"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
