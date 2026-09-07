/**
 * ExportDonationToast
 * Shown automatically after any file export/download.
 * Auto-dismisses after 5 seconds with a countdown ring.
 * Uses glassmorphism + vibrant gradients.
 *
 * Usage:
 *   import { triggerExportDonation } from './ExportDonationToast';
 *   triggerExportDonation();   // call after any export
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, X, Copy, Check, Sparkles, Download, Zap, Star } from 'lucide-react';

// Global event bus — simple pub/sub
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function triggerExportDonation() {
  listeners.forEach(fn => fn());
}

// ── Themes rotate on each trigger ──────────────────────────────────────────
const THEMES = [
  {
    bg: 'from-violet-600 via-purple-600 to-indigo-700',
    glow: 'from-violet-500 via-purple-500 to-indigo-600',
    accent: 'bg-violet-300/20',
    ring: '#a78bfa',
    icon: '💜',
  },
  {
    bg: 'from-rose-500 via-pink-500 to-fuchsia-600',
    glow: 'from-rose-400 via-pink-400 to-fuchsia-500',
    accent: 'bg-pink-300/20',
    ring: '#f9a8d4',
    icon: '❤️',
  },
  {
    bg: 'from-amber-500 via-orange-500 to-rose-500',
    glow: 'from-amber-400 via-orange-400 to-rose-400',
    accent: 'bg-amber-300/20',
    ring: '#fcd34d',
    icon: '🌟',
  },
  {
    bg: 'from-emerald-500 via-teal-500 to-cyan-600',
    glow: 'from-emerald-400 via-teal-400 to-cyan-500',
    accent: 'bg-emerald-300/20',
    ring: '#6ee7b7',
    icon: '💚',
  },
  {
    bg: 'from-blue-500 via-indigo-500 to-violet-600',
    glow: 'from-blue-400 via-indigo-400 to-violet-500',
    accent: 'bg-blue-300/20',
    ring: '#93c5fd',
    icon: '💙',
  },
];

const RIB = '00799999001114900455';
const DURATION = 5; // seconds

let themeIndex = 0;

export function ExportDonationToast() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(DURATION);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(THEMES[0]);

  const dismiss = useCallback(() => {
    setVisible(false);
    setProgress(DURATION);
  }, []);

  // Subscribe to trigger event
  useEffect(() => {
    const handler = () => {
      themeIndex = (themeIndex + 1) % THEMES.length;
      setTheme(THEMES[themeIndex]);
      setProgress(DURATION);
      setVisible(true);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!visible) return;
    if (progress <= 0) { dismiss(); return; }
    const t = setTimeout(() => setProgress(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [visible, progress, dismiss]);

  const handleCopy = () => {
    navigator.clipboard.writeText(RIB);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  // SVG countdown ring
  const r = 14;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (circ * progress) / DURATION;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-8 fade-in duration-500 no-print"
      style={{ width: 'min(96vw, 480px)' }}
    >
      {/* Outer animated glow */}
      <div
        className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r ${theme.glow} blur-lg opacity-60 animate-pulse pointer-events-none`}
        style={{ animationDuration: '2s' }}
      />

      {/* Glass card */}
      <div className={`relative rounded-[1.75rem] overflow-hidden bg-gradient-to-br ${theme.bg} shadow-2xl border border-white/20`}>

        {/* Glassmorphism inner layer */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none" />

        {/* Decorative sparkles */}
        <div className="absolute top-3 left-8 w-2 h-2 bg-white/50 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '1.5s' }} />
        <div className="absolute bottom-4 right-10 w-1.5 h-1.5 bg-yellow-300/70 rounded-full animate-bounce pointer-events-none" />
        <div className="absolute top-6 right-20 w-1 h-1 bg-white/40 rounded-full animate-pulse pointer-events-none" />

        {/* Close + countdown ring */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          {/* Countdown SVG ring */}
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" className="absolute inset-0 -rotate-90">
              <circle cx="16" cy="16" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle
                cx="16" cy="16" r={r}
                fill="none"
                stroke={theme.ring}
                strokeWidth="3"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{progress}</span>
          </div>

          <button
            onClick={dismiss}
            className="p-1.5 bg-white/20 hover:bg-white/35 rounded-full transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
          >
            <X size={12} className="text-white" />
          </button>
        </div>

        {/* Main content */}
        <div className="relative z-10 px-5 pt-4 pb-4">

          {/* Header row */}
          <div className="flex items-start gap-3 mb-3">
            {/* Icon */}
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner border border-white/25 text-xl">
              {theme.icon}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Download size={12} className="text-white/70 shrink-0" />
                <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">تم التصدير بنجاح!</span>
              </div>
              <h3 className="font-black text-white text-sm leading-snug flex items-center gap-1.5 flex-wrap">
                أعجبك التطبيق؟ ادعم المنصة! 
                <Sparkles size={13} className="text-yellow-300 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
              </h3>
              <p className="text-white/75 text-[11px] font-bold mt-0.5">
                تمكين مجانية للجميع — دعمك يحافظ عليها 💪
              </p>
            </div>
          </div>

          {/* Amounts row */}
          <div className="flex items-center gap-1.5 mb-3">
            {[
              { label: '☕ 200 دج', sub: 'قهوة' },
              { label: '⭐ 500 دج', sub: 'شهري' },
              { label: '🚀 1000 دج', sub: 'بطل' },
            ].map(a => (
              <div key={a.label} className="flex-1 text-center bg-white/15 backdrop-blur-sm rounded-xl py-1.5 border border-white/20 hover:bg-white/25 transition-all cursor-default">
                <p className="text-white font-black text-[11px]">{a.label}</p>
                <p className="text-white/60 text-[9px] font-bold">{a.sub}</p>
              </div>
            ))}
          </div>

          {/* RIB row */}
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/15">
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-[8px] font-black uppercase tracking-widest mb-0.5">RIB — باسم ساسي عبدالنور</p>
              <p className="font-mono text-[12px] font-black text-yellow-300 tracking-wider leading-none" dir="ltr">{RIB}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-black text-[11px] flex items-center gap-1.5 transition-all border ${
                copied
                  ? 'bg-emerald-400 text-white border-emerald-300 shadow-lg shadow-emerald-500/40'
                  : 'bg-white/20 text-white border-white/20 hover:bg-white/35 hover:border-white/40'
              }`}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'تم ✓' : 'نسخ'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
