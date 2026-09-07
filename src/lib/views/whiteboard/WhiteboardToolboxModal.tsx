import React, { useState } from 'react';
import {
  X, Calculator, Compass, PieChart, Box, Zap,
  Activity, Globe, Milestone, BookOpen, Eye, Gamepad2,
  CheckCircle2, Sparkles, Hash, Plus, Minus, Divide,
  MoveRight, ArrowDownRight, Layers, HelpCircle, Flame,
  Atom, Microscope, Backpack, Landmark
} from 'lucide-react';
import { EDUCATIONAL_ASSETS, EducationalAsset } from './educationalAssets';

interface WhiteboardToolboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertElement: (element: any) => void;
  onOpenCurtain: () => void;
  onOpenSpotlight: () => void;
  onOpenTimer: () => void;
  onOpenPicker: () => void;
}

type TabKey =
  | 'math'
  | 'science'
  | 'physics'
  | 'geography'
  | 'history'
  | 'primary'
  | 'languages'
  | 'presentation'
  | 'games';

export default function WhiteboardToolboxModal({
  isOpen,
  onClose,
  onInsertElement,
  onOpenCurtain,
  onOpenSpotlight,
  onOpenTimer,
  onOpenPicker,
}: WhiteboardToolboxModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('math');

  // ===================== SCIENTIFIC CALCULATOR STATE =====================
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState('');

  const handleCalcBtn = (char: string) => {
    if (char === 'C') {
      setCalcDisplay('0');
      setCalcPrev('');
    } else if (char === 'DEL') {
      setCalcDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (char === '=') {
      try {
        const sanitized = calcDisplay
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/sqrt\(/g, 'Math.sqrt(');
        // eslint-disable-next-line no-new-func
        const res = Function(`'use strict'; return (${sanitized})`)();
        const formatted = Number.isFinite(res) ? (Math.round(res * 10000) / 10000).toString() : 'خطأ';
        setCalcPrev(`${calcDisplay} =`);
        setCalcDisplay(formatted);
      } catch {
        setCalcDisplay('خطأ بالحساب');
      }
    } else if (['sin', 'cos', 'tan', 'sqrt'].includes(char)) {
      setCalcDisplay(prev => prev === '0' ? `${char}(` : `${prev}${char}(`);
    } else {
      setCalcDisplay(prev => prev === '0' && !['.', '+', '-', '×', '÷'].includes(char) ? char : prev + char);
    }
  };

  const insertCalcResult = () => {
    onInsertElement({
      type: 'text',
      text: calcPrev ? `${calcPrev} ${calcDisplay}` : `النتيجة: ${calcDisplay}`,
      fontSize: 32,
      fontWeight: 'bold',
      color: '#f59e0b',
      hasBackground: true
    });
    onClose();
  };

  // Helper to insert an Educational Asset
  const insertAsset = (asset: EducationalAsset) => {
    onInsertElement({
      type: 'asset',
      src: asset.filePath,
      width: asset.width,
      height: asset.height,
      title: asset.title
    });
    onClose();
  };

  // ===================== TASHKEEL QUICK HELPER =====================
  const [tashkeelText, setTashkeelText] = useState('الْعِلْمُ نُورٌ وَالْجَهْلُ ظَلَامٌ');

  const insertTashkeel = (mark: string) => {
    setTashkeelText(prev => prev + mark);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-['Cairo'] select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>صندوق الأدوات البيداغوجي الشامل</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30">
                  المستوى 2 — تمكين
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                أدوات ورسوم فيكتور متخصصة لخدمة الأطوار التعليمية الثلاثة (ابتدائي، متوسط، ثانوي)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            title="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto text-xs font-black scrollbar-none">
          {[
            { id: 'math', label: '📐 رياضيات وهندسة', icon: Calculator },
            { id: 'science', label: '🔬 علوم الطبيعة والحياة', icon: Microscope },
            { id: 'physics', label: '⚡ فيزياء وكيمياء', icon: Atom },
            { id: 'geography', label: '🗺️ جغرافيا وخرائط الجزائر', icon: Globe },
            { id: 'history', label: '🏛️ تاريخ وآثار نوميديا', icon: Landmark },
            { id: 'primary', label: '🎒 الطور الابتدائي', icon: Backpack },
            { id: 'languages', label: '🗣️ لغات وتشكيل', icon: BookOpen },
            { id: 'presentation', label: '🧑‍🏫 أدوات العرض الصفي', icon: Eye },
            { id: 'games', label: '🎮 ألعاب وتنافس', icon: Gamepad2 },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 font-bold'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* ══════════════════ 1. MATH & GEOMETRY ══════════════════ */}
          {activeTab === 'math' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Scientific Calculator (Left / 5 cols) */}
                <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-black text-amber-400">
                    <span>آلة حاسبة علمية بيداغوجية</span>
                    <Calculator size={16} />
                  </div>
                  {/* Calc Screen */}
                  <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-right">
                    <div className="text-[11px] text-slate-400 font-mono h-4">{calcPrev}</div>
                    <div className="text-2xl font-black font-mono text-white tracking-wider truncate">{calcDisplay}</div>
                  </div>
                  {/* Calc Keypad */}
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-black">
                    {['C', 'DEL', '(', ')', 'sin', 'cos', 'tan', 'sqrt', '7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', 'π', '+'].map(k => (
                      <button
                        key={k}
                        onClick={() => handleCalcBtn(k)}
                        className={`p-2 rounded-xl transition-all ${
                          ['C', 'DEL'].includes(k)
                            ? 'bg-rose-900/40 text-rose-300 hover:bg-rose-900/60'
                            : ['÷', '×', '-', '+', '='].includes(k)
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                            : ['sin', 'cos', 'tan', 'sqrt', 'π'].includes(k)
                            ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900/80'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                    <button
                      onClick={() => handleCalcBtn('=')}
                      className="col-span-4 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm hover:scale-[1.01] transition-all shadow-md"
                    >
                      = إنجاز الحساب
                    </button>
                  </div>
                  <button
                    onClick={insertCalcResult}
                    className="w-full py-2 bg-amber-500/20 border border-amber-400/40 text-amber-400 rounded-xl text-xs font-black hover:bg-amber-500 hover:text-slate-950 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>إدراج العملية والنتيجة في السبورة</span>
                  </button>
                </div>

                {/* Geometry Tools & 3D Solids (Right / 7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  {/* Geometric Instruments */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                      <Compass size={14} className="text-indigo-400" />
                      <span>الأدوات الهندسية والقياس (قابلة للتحريك والتكبير)</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {EDUCATIONAL_ASSETS.filter(a => a.category === 'math').map(asset => (
                        <button
                          key={asset.id}
                          onClick={() => insertAsset(asset)}
                          className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-right flex flex-col gap-2"
                        >
                          <div className="h-20 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800">
                            <img src={asset.filePath} alt={asset.title} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="font-black text-xs text-white leading-snug">{asset.title}</div>
                          <div className="text-[10px] text-slate-400 leading-relaxed">{asset.description}</div>
                        </button>
                      ))}

                      <button
                        onClick={() => {
                          const graphAsset = EDUCATIONAL_ASSETS.find(a => a.id === 'graph-chart');
                          if (graphAsset) insertAsset(graphAsset);
                        }}
                        className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-right flex flex-col gap-2"
                      >
                        <div className="h-20 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800">
                          <img src="/educational/graph_chart.svg" alt="منحنى بياني" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="font-black text-xs text-white leading-snug">منحنى بياني إحصائي وتجريبي</div>
                        <div className="text-[10px] text-slate-400 leading-relaxed">تحليل التجارب والظواهر العلمية مع الزمن</div>
                      </button>
                    </div>
                  </div>

                  {/* Mathematical representations */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 mb-2">تمثيلات رياضية سريعة</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          onInsertElement({
                            type: 'axes',
                            width: 320,
                            height: 240,
                            color: '#38bdf8',
                            strokeWidth: 2
                          });
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-slate-800 hover:border-amber-400 border border-slate-700 text-center"
                      >
                        <div className="text-lg">📈</div>
                        <div className="font-black text-[11px] text-white">معلم متعامد</div>
                      </button>

                      <button
                        onClick={() => {
                          onInsertElement({
                            type: 'timeline',
                            width: 380,
                            height: 80,
                            color: '#22c55e',
                            strokeWidth: 2
                          });
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-slate-800 hover:border-amber-400 border border-slate-700 text-center"
                      >
                        <div className="text-lg">📏</div>
                        <div className="font-black text-[11px] text-white">مستقيم مدرج</div>
                      </button>

                      <button
                        onClick={() => {
                          onInsertElement({
                            type: 'venn',
                            width: 280,
                            height: 160,
                            color: '#ec4899',
                            strokeWidth: 2,
                            fill: '#ec489933'
                          });
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-slate-800 hover:border-amber-400 border border-slate-700 text-center"
                      >
                        <div className="text-lg">⭕</div>
                        <div className="font-black text-[11px] text-white">مخطط ڤين</div>
                      </button>
                    </div>
                  </div>

                  {/* 3D Solids */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 mb-2 flex items-center gap-1.5">
                      <Box size={14} className="text-amber-400" />
                      <span>المجسمات ثلاثية الأبعاد (3D Solids)</span>
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { type: 'cube', label: 'المكعب', icon: '🧊' },
                        { type: 'cylinder', label: 'الأسطوانة', icon: '🥫' },
                        { type: 'cone', label: 'المخروط', icon: '🍦' },
                        { type: 'parallelogram', label: 'متوازي أضلاع', icon: '▱' },
                      ].map(solid => (
                        <button
                          key={solid.type}
                          onClick={() => {
                            onInsertElement({
                              type: solid.type,
                              width: 140,
                              height: 140,
                              color: '#eab308',
                              strokeWidth: 2,
                              fill: '#eab30822'
                            });
                            onClose();
                          }}
                          className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 transition-all text-center flex flex-col items-center gap-1"
                        >
                          <span className="text-xl">{solid.icon}</span>
                          <span className="text-[11px] font-black text-white">{solid.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ 2. SCIENCE & BIOLOGY ══════════════════ */}
          {activeTab === 'science' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-2">
                  <Microscope size={16} className="text-emerald-400" />
                  <span>رسومات وتجارب علوم الطبيعة والحياة (أجهزة مخبرية، تغذية، نبات، نمو)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {EDUCATIONAL_ASSETS.filter(a => a.category === 'science').map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => insertAsset(asset)}
                      className="group p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 hover:scale-[1.02] transition-all text-right flex flex-col gap-2.5"
                    >
                      <div className="h-32 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800 group-hover:border-emerald-500/50">
                        <img src={asset.filePath} alt={asset.title} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                          {asset.badge}
                        </span>
                        <h4 className="font-black text-xs text-white mt-1.5 leading-snug">{asset.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Anatomy & Body Systems */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3">🫀 تشريح جسم الإنسان والأعضاء الحيوية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {EDUCATIONAL_ASSETS.filter(a => a.category === 'anatomy').map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => insertAsset(asset)}
                      className="group p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-rose-400 hover:scale-[1.02] transition-all text-right flex flex-col gap-2.5"
                    >
                      <div className="h-32 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800">
                        <img src={asset.filePath} alt={asset.title} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-rose-400 px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30">
                          {asset.badge}
                        </span>
                        <h4 className="font-black text-xs text-white mt-1.5 leading-snug">{asset.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ 3. PHYSICS & CHEMISTRY ══════════════════ */}
          {activeTab === 'physics' && (
            <div className="space-y-6">
              {/* Physics & Chem Educational Assets */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-2">
                  <Atom size={16} className="text-amber-400" />
                  <span>نماذج المادة، التيارات، الذرة، والمغناطيسية والاهتزازات (رسم متجه دقيق)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {EDUCATIONAL_ASSETS.filter(a => a.category === 'physics').map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => insertAsset(asset)}
                      className="group p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-[1.02] transition-all text-right flex flex-col gap-2.5"
                    >
                      <div className="h-32 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800 group-hover:border-amber-500/50">
                        <img src={asset.filePath} alt={asset.title} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-amber-400 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                          {asset.badge}
                        </span>
                        <h4 className="font-black text-xs text-white mt-1.5 leading-snug">{asset.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Circuit Elements */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400" />
                  <span>عناصر الدارات السريعة التفاعلية (+ -)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { type: 'battery', title: 'مولد / عمود (+ -)', color: '#ef4444' },
                    { type: 'bulb', title: 'مصباح التوهج (L)', color: '#eab308' },
                    { type: 'switch', title: 'قاطعة دارة (K)', color: '#3b82f6' },
                    { type: 'resistor', title: 'مقاومة ناقل أومي (R)', color: '#10b981' },
                    { type: 'flask', title: 'حوجلة تجارب كيميائية', color: '#06b6d4' },
                    { type: 'testtube', title: 'أنبوب اختبار مدرج', color: '#8b5cf6' },
                  ].map(c => (
                    <button
                      key={c.type}
                      onClick={() => {
                        onInsertElement({
                          type: c.type,
                          width: 150,
                          height: 100,
                          color: c.color,
                          strokeWidth: 2
                        });
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-center flex flex-col items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-black text-amber-400">
                        ⚡
                      </div>
                      <span className="text-xs font-black text-white">{c.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Periodic Table Snippets */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-400" />
                  <span>الجدول الدوري — العناصر الكيميائية الشائعة للدروس</span>
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
                  {[
                    { sym: 'H', name: 'هيدروجين', z: 1, a: 1, c: '#38bdf8' },
                    { sym: 'He', name: 'هيليوم', z: 2, a: 4, c: '#c084fc' },
                    { sym: 'C', name: 'كربون', z: 6, a: 12, c: '#94a3b8' },
                    { sym: 'N', name: 'أزوت', z: 7, a: 14, c: '#60a5fa' },
                    { sym: 'O', name: 'أكسجين', z: 8, a: 16, c: '#f87171' },
                    { sym: 'Na', name: 'صوديوم', z: 11, a: 23, c: '#fbbf24' },
                    { sym: 'Cl', name: 'كلور', z: 17, a: 35.5, c: '#4ade80' },
                    { sym: 'Fe', name: 'حديد', z: 26, a: 56, c: '#f97316' },
                    { sym: 'Cu', name: 'نحاس', z: 29, a: 63.5, c: '#fb923c' },
                  ].map(el => (
                    <button
                      key={el.sym}
                      onClick={() => {
                        onInsertElement({
                          type: 'text',
                          text: `[${el.sym}]\n${el.name}\nZ=${el.z} | A=${el.a}`,
                          fontSize: 22,
                          textAlign: 'center',
                          color: el.c,
                          hasBackground: true
                        });
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center transition-all hover:scale-105"
                    >
                      <div className="text-[10px] text-slate-400">{el.z}</div>
                      <div className="text-base font-black" style={{ color: el.c }}>{el.sym}</div>
                      <div className="text-[9px] text-slate-300 font-bold truncate">{el.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ 4. GEOGRAPHY & MAPS ══════════════════ */}
          {activeTab === 'geography' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                <Globe size={14} className="text-cyan-400" />
                <span>الخرائط الصماء والتضاريس والغطاء النباتي والبترول والمياه (دقة فيكتور عالية)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {EDUCATIONAL_ASSETS.filter(a => a.category === 'geography').map(mapAsset => (
                  <button
                    key={mapAsset.id}
                    onClick={() => insertAsset(mapAsset)}
                    className="group p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-cyan-400 hover:scale-[1.02] transition-all text-right flex flex-col gap-3"
                  >
                    <div className="h-36 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800 group-hover:border-cyan-500/50">
                      <img src={mapAsset.filePath} alt={mapAsset.title} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                        {mapAsset.badge}
                      </span>
                      <div className="text-xs font-black text-white mt-1.5 mb-0.5">{mapAsset.title}</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed">{mapAsset.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════ 5. HISTORY & NUMIDIA ══════════════════ */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Numidian Heritage Asset */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-2">
                  <Landmark size={16} className="text-amber-400" />
                  <span>معالم وآثار الدولة النوميدية القديمة (ماسينيسا، إيمدغاسن، يوغرطة)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {EDUCATIONAL_ASSETS.filter(a => a.category === 'history').map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => insertAsset(asset)}
                      className="group p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-[1.02] transition-all text-right flex flex-col gap-3"
                    >
                      <div className="h-36 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800 group-hover:border-amber-500/50">
                        <img src={asset.filePath} alt={asset.title} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-amber-400 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                          {asset.badge}
                        </span>
                        <h4 className="font-black text-xs text-white mt-1.5 leading-snug">{asset.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Liberation Revolution Key Dates */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                  <Milestone size={14} className="text-emerald-400" />
                  <span>المحطات التاريخية الكبرى لثورة التحرير الجزائرية (1954 - 1962)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { date: '1 نوفمبر 1954', title: 'اندلاع الثورة التحريرية', desc: 'انطلاق العمليات العسكرية ونداء أول نوفمبر' },
                    { date: '20 أوت 1955', title: 'هجومات الشمال القسنطيني', desc: 'فك الحصار عن الأوراس بقيادة زيغود يوسف' },
                    { date: '20 أوت 1956', title: 'مؤتمر الصومام التاريخي', desc: 'هيكلة وتنظيم جيش وجبهة التحرير الوطني' },
                    { date: '5 جويلية 1962', title: 'استقلال الجزائر الخالد', desc: 'تتويج تضحيات مليون ونصف مليون شهيد' },
                  ].map((event, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onInsertElement({
                          type: 'text',
                          text: `📌 ${event.date}\n${event.title}\n(${event.desc})`,
                          fontSize: 22,
                          textAlign: 'right',
                          color: '#22c55e',
                          hasBackground: true
                        });
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 text-right transition-all flex flex-col gap-1.5"
                    >
                      <span className="text-xs font-black text-emerald-400">{event.date}</span>
                      <span className="text-xs font-black text-white">{event.title}</span>
                      <span className="text-[10px] text-slate-400">{event.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Historical Figures */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3">قادة وشخصيات وطنية جزائرية</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    'الشيخ عبد الحميد بن باديس',
                    'الشهيد العربي بن مهيدي',
                    'الشهيد مصطفى بن بولعيد',
                    'الأمير عبد القادر الجزائري',
                  ].map((name, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onInsertElement({
                          type: 'text',
                          text: `⭐ الشخصية التاريخية: ${name}`,
                          fontSize: 24,
                          fontWeight: 'bold',
                          color: '#f59e0b',
                          hasBackground: true
                        });
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-black text-white text-center"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ 6. PRIMARY EDUCATION ══════════════════ */}
          {activeTab === 'primary' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-2">
                  <Backpack size={16} className="text-indigo-400" />
                  <span>رسومات الطور الابتدائي (تلميذ، تلميذة، محفظة، معداد، مكعبات ألعاب، حيوانات)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {EDUCATIONAL_ASSETS.filter(a => a.category === 'primary').map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => insertAsset(asset)}
                      className="group p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-indigo-400 hover:scale-[1.02] transition-all text-right flex flex-col gap-2.5"
                    >
                      <div className="h-32 w-full bg-slate-950 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-slate-800 group-hover:border-indigo-500/50">
                        <img src={asset.filePath} alt={asset.title} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30">
                          {asset.badge}
                        </span>
                        <h4 className="font-black text-xs text-white mt-1.5 leading-snug">{asset.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Interactive Cards */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3">بطاقات وأنشطة تفاعلية للقسم الابتدائي</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      onInsertElement({
                        type: 'stickynote',
                        width: 420,
                        height: 180,
                        color: '#f59e0b',
                        strokeWidth: 2,
                        fill: '#fef3c7',
                        fillOpacity: 0.95,
                        text: '🏷️ شبكة المفردات (الكلمة، المرادف، الضد):\n• الكلمة: الشَّجَاعَةُ\n• المرادف: الإقدام، البسالة، الجرأة\n• الضد: الجُبْنُ، الخَوْفُ\n• التوظيف: يتحلى المجاهد بالشجاعة.',
                        fontSize: 14,
                        textAlign: 'right',
                        fontWeight: 'bold',
                      });
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-slate-800 hover:border-amber-400 border border-slate-700 text-right"
                  >
                    <div className="text-xl mb-1">🏷️</div>
                    <div className="font-black text-xs text-white">شبكة المفردات والتراكيب</div>
                    <div className="text-[10px] text-slate-400">إدراج بطاقة المرادف والضد والتوظيف في جملة</div>
                  </button>

                  <button
                    onClick={() => {
                      onInsertElement({
                        type: 'stickynote',
                        width: 430,
                        height: 200,
                        color: '#8b5cf6',
                        strokeWidth: 2,
                        fill: '#ede9fe',
                        fillOpacity: 0.95,
                        text: '🗣️ جدول تصريف الفعل في الماضي والمضارع:\n• أنا: كَتَبْتُ / أَكْتُبُ\n• نحنُ: كَتَبْنَا / نَكْتُبُ\n• أنتَ: كَتَبْتَ / تَكْتُبُ\n• هو: كَتَبَ / يَكْتُبُ\n• هُم: كَتَبُوا / يَكْتُبُونَ',
                        fontSize: 14,
                        textAlign: 'right',
                        fontWeight: 'bold',
                      });
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-slate-800 hover:border-indigo-400 border border-slate-700 text-right"
                  >
                    <div className="text-xl mb-1">🗣️</div>
                    <div className="font-black text-xs text-white">تصريف الأفعال للابتدائي</div>
                    <div className="text-[10px] text-slate-400">جدول الضمائر وتصريف الأفعال الشائعة</div>
                  </button>

                  <button
                    onClick={() => {
                      onInsertElement({
                        type: 'rect',
                        width: 460,
                        height: 50,
                        color: '#3b82f6',
                        strokeWidth: 2.5,
                        fill: '#dbeafe',
                        fillOpacity: 0.8,
                      });
                      onInsertElement({
                        type: 'text',
                        width: 440,
                        height: 40,
                        color: '#1e293b',
                        strokeWidth: 2,
                        text: '1/5   |   2/5   |   3/5   |   4/5   |   5/5 (الوحدة الكاملة)',
                        fontSize: 18,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      });
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-slate-800 hover:border-blue-400 border border-slate-700 text-right"
                  >
                    <div className="text-xl mb-1">📊</div>
                    <div className="font-black text-xs text-white">شريط الكسور الملون</div>
                    <div className="text-[10px] text-slate-400">تمثيل الأجزاء من الوحدة لدروس الكسور</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ 7. LANGUAGES & GRAMMAR ══════════════════ */}
          {activeTab === 'languages' && (
            <div className="space-y-6">
              {/* Arabic Tashkeel quick bar */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-xs font-black text-amber-400">لوحة التشكيل السريع للنص العربي:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { mark: 'َ', name: 'فَتْحَة' },
                    { mark: 'ُ', name: 'ضَمَّة' },
                    { mark: 'ِ', name: 'كَسْرَة' },
                    { mark: 'ْ', name: 'سُكُون' },
                    { mark: 'ّ', name: 'شَدَّة' },
                    { mark: 'ً', name: 'تَنْوِين فَتْح' },
                    { mark: 'ٌ', name: 'تَنْوِين ضَمّ' },
                    { mark: 'ٍ', name: 'تَنْوِين كَسْر' },
                  ].map(item => (
                    <button
                      key={item.mark}
                      onClick={() => insertTashkeel(item.mark)}
                      className="px-3 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 rounded-xl text-base font-black transition-all flex items-center gap-1.5"
                    >
                      <span className="text-lg text-amber-400">{`ب${item.mark}`}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={tashkeelText}
                    onChange={e => setTashkeelText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  />
                  <button
                    onClick={() => {
                      onInsertElement({
                        type: 'text',
                        text: tashkeelText,
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: '#ffffff'
                      });
                      onClose();
                    }}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black"
                  >
                    إدراج في السبورة
                  </button>
                </div>
              </div>

              {/* Grammar Cards */}
              <div>
                <h3 className="text-xs font-black text-slate-400 mb-3">بطاقات الإعراب وعناصر الجملة (للسحب والمطابقة)</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'فعل ماضٍ', color: '#ef4444' },
                    { label: 'فعل مضارع', color: '#f97316' },
                    { label: 'فاعل مرفوع', color: '#22c55e' },
                    { label: 'مفعول به منصوب', color: '#3b82f6' },
                    { label: 'صفة / نعت', color: '#8b5cf6' },
                    { label: 'مبتدأ مرفوع', color: '#06b6d4' },
                    { label: 'خبر مرفوع', color: '#ec4899' },
                    { label: 'جار ومجرور', color: '#eab308' },
                  ].map(badge => (
                    <button
                      key={badge.label}
                      onClick={() => {
                        onInsertElement({
                          type: 'text',
                          text: badge.label,
                          fontSize: 24,
                          fontWeight: 'bold',
                          color: '#ffffff',
                          fill: badge.color,
                          hasBackground: true
                        });
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-black text-white hover:scale-105 transition-all shadow-md"
                      style={{ backgroundColor: badge.color }}
                    >
                      {badge.label} +
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ 8. CLASSROOM PRESENTATION ══════════════════ */}
          {activeTab === 'presentation' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  onClose();
                  onOpenCurtain();
                }}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-right flex flex-col gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-900/60 text-indigo-400 flex items-center justify-center text-2xl shadow-inner">
                  🎭
                </div>
                <div>
                  <div className="font-black text-sm text-white mb-1">ستارة إخفاء الإجابة</div>
                  <div className="text-[11px] text-slate-400">حجب جزء من السبورة وكشفه تدريجياً للتلاميذ مع مقبض سحب سلس.</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSpotlight();
                }}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-right flex flex-col gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-900/60 text-amber-400 flex items-center justify-center text-2xl shadow-inner">
                  💡
                </div>
                <div>
                  <div className="font-black text-sm text-white mb-1">كشاف الضوء (Spotlight)</div>
                  <div className="text-[11px] text-slate-400">تعتيم السبورة وتركيز انتباه القسم على نقطة أو تمرين محدد.</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTimer();
                }}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-right flex flex-col gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center text-2xl shadow-inner">
                  ⏱️
                </div>
                <div>
                  <div className="font-black text-sm text-white mb-1">مؤقت الحصة والأنشطة</div>
                  <div className="text-[11px] text-slate-400">عداد رقمي عائم لضبط أوقات العمل في أفواج مع إنذار صوتي ومرئي.</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenPicker();
                }}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-right flex flex-col gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-900/60 text-rose-400 flex items-center justify-center text-2xl shadow-inner">
                  🎡
                </div>
                <div>
                  <div className="font-black text-sm text-white mb-1">عجلة وقرعة الأسماء</div>
                  <div className="text-[11px] text-slate-400">سحب عشوائي عادل لتحفيز مشاركة كافة التلاميذ في الصف.</div>
                </div>
              </button>
            </div>
          )}

          {/* ══════════════════ 9. INTERACTIVE GAMES ══════════════════ */}
          {activeTab === 'games' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  onInsertElement({
                    type: 'text',
                    text: '✅ صَحِيح',
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#22c55e',
                    hasBackground: true
                  });
                  onInsertElement({
                    type: 'text',
                    text: '❌ خَطَأ',
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#ef4444',
                    hasBackground: true
                  });
                  onClose();
                }}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 text-right flex flex-col gap-2 transition-all hover:scale-105"
              >
                <div className="text-3xl">✔️ ❌</div>
                <div className="font-black text-sm text-white">بطاقتي (صح أم خطأ)</div>
                <div className="text-[11px] text-slate-400">إدراج بطاقتين تفاعليتين للتصويت السريع على العبارات.</div>
              </button>

              <button
                onClick={() => {
                  onInsertElement({
                    type: 'text',
                    text: '⭐ تحدي الدقيقة ⭐\nأجب عن أكبر عدد من الأسئلة في 60 ثانية!',
                    fontSize: 26,
                    fontWeight: 'bold',
                    color: '#f59e0b',
                    hasBackground: true
                  });
                  onClose();
                  onOpenTimer();
                }}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 text-right flex flex-col gap-2 transition-all hover:scale-105"
              >
                <div className="text-3xl">🏆</div>
                <div className="font-black text-sm text-white">مسابقة تحدي الدقيقة</div>
                <div className="text-[11px] text-slate-400">إدراج شارة التحدي وتشغيل المؤقت التنازلي لدقيقة واحدة.</div>
              </button>

              <button
                onClick={() => {
                  onInsertElement({
                    type: 'text',
                    text: 'الفريق (أ): 00 نقطة\nالفريق (ب): 00 نقطة',
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#38bdf8',
                    hasBackground: true
                  });
                  onClose();
                }}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-cyan-400 text-right flex flex-col gap-2 transition-all hover:scale-105"
              >
                <div className="text-3xl">🎯</div>
                <div className="font-black text-sm text-white">لوحة نقاط المجموعات</div>
                <div className="text-[11px] text-slate-400">رصد النقاط أثناء التنافس الصفي بين الأفواج.</div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
