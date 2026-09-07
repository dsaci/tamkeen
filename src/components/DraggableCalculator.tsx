import React, { useState, useRef } from 'react';
import { X, Calculator, GripHorizontal } from 'lucide-react';

export function DraggableCalculator({ onClose }: { onClose: () => void }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('');
  const [mode, setMode] = useState<'simple' | 'scientific'>('simple');

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleInput = (val: string) => {
    setDisplay(prev => prev + val);
  };

  const clear = () => setDisplay('');
  
  const backspace = () => setDisplay(prev => prev.slice(0, -1));

  const calculate = () => {
    try {
      // Safe eval equivalent
      const result = new Function('return ' + display.replace(/×/g, '*').replace(/÷/g, '/'))();
      if (Number.isFinite(result)) {
        setDisplay(String(result));
      } else {
        setDisplay('Error');
      }
    } catch (err) {
      setDisplay('Error');
    }
  };

  const calculateScientific = (func: string) => {
    try {
      const val = parseFloat(display);
      if (isNaN(val)) return;
      let res = 0;
      if (func === 'sin') res = Math.sin((val * Math.PI) / 180);
      else if (func === 'cos') res = Math.cos((val * Math.PI) / 180);
      else if (func === 'tan') res = Math.tan((val * Math.PI) / 180);
      else if (func === 'sqrt') res = Math.sqrt(val);
      else if (func === 'sq') res = val * val;
      else if (func === 'log') res = Math.log10(val);
      
      setDisplay(String(Number(res.toFixed(8))));
    } catch (e) {
      setDisplay('Error');
    }
  };

  return (
    <div 
      ref={widgetRef}
      className="fixed z-[999] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-['Cairo']"
      style={{ 
        left: position.x, 
        top: position.y,
        width: mode === 'simple' ? '260px' : '360px',
        touchAction: 'none'
      }}
    >
      {/* Header / Drag Handle */}
      <div 
        className="h-10 bg-slate-800 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="flex items-center gap-2 text-slate-300 pointer-events-none">
          <GripHorizontal size={14} />
          <span className="text-xs font-bold">آلة حاسبة</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setMode(m => m === 'simple' ? 'scientific' : 'simple')}
            className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white"
          >
            {mode === 'simple' ? 'علمية' : 'بسيطة'}
          </button>
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose} 
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Screen */}
      <div className="p-4 bg-slate-900 border-b border-slate-800">
        <div className="bg-slate-950 rounded-xl p-3 text-left font-mono text-2xl text-amber-400 overflow-x-auto whitespace-nowrap min-h-[56px] flex items-center justify-end shadow-inner" dir="ltr">
          {display || '0'}
        </div>
      </div>

      {/* Keypad */}
      <div className="p-4 bg-slate-800/50 flex gap-2" dir="ltr">
        {mode === 'scientific' && (
          <div className="grid grid-cols-2 gap-2 pr-2 border-r border-slate-700 mr-2">
            <button onClick={() => calculateScientific('sin')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">sin</button>
            <button onClick={() => calculateScientific('cos')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">cos</button>
            <button onClick={() => calculateScientific('tan')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">tan</button>
            <button onClick={() => calculateScientific('log')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">log</button>
            <button onClick={() => calculateScientific('sqrt')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">√</button>
            <button onClick={() => calculateScientific('sq')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">x²</button>
            <button onClick={() => handleInput('(')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">(</button>
            <button onClick={() => handleInput(')')} className="h-10 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white">)</button>
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-2 flex-1">
          <button onClick={clear} className="h-10 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-sm font-bold">C</button>
          <button onClick={backspace} className="h-10 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-bold">⌫</button>
          <button onClick={() => handleInput('%')} className="h-10 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-bold">%</button>
          <button onClick={() => handleInput('÷')} className="h-10 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-lg font-bold">÷</button>

          <button onClick={() => handleInput('7')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">7</button>
          <button onClick={() => handleInput('8')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">8</button>
          <button onClick={() => handleInput('9')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">9</button>
          <button onClick={() => handleInput('×')} className="h-10 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-lg font-bold">×</button>

          <button onClick={() => handleInput('4')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">4</button>
          <button onClick={() => handleInput('5')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">5</button>
          <button onClick={() => handleInput('6')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">6</button>
          <button onClick={() => handleInput('-')} className="h-10 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-lg font-bold">-</button>

          <button onClick={() => handleInput('1')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">1</button>
          <button onClick={() => handleInput('2')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">2</button>
          <button onClick={() => handleInput('3')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">3</button>
          <button onClick={() => handleInput('+')} className="h-10 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-lg font-bold">+</button>

          <button onClick={() => handleInput('0')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold col-span-2">0</button>
          <button onClick={() => handleInput('.')} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold">.</button>
          <button onClick={calculate} className="h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-lg font-bold">=</button>
        </div>
      </div>
    </div>
  );
}
