import React, { useState } from 'react';
import { Heart, X, Copy, Check, Sparkles, Coffee, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export function DonationBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('tamkeen_hide_donation_banner') !== 'true';
  });
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rib = '00799999001114900455';

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('tamkeen_hide_donation_banner', 'true');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-3xl z-[100] animate-in slide-in-from-bottom-10 duration-500 no-print">
      {/* Outer glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-amber-400 to-orange-500 rounded-3xl blur opacity-70 animate-pulse pointer-events-none"></div>

      <div
        className="relative rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 transition-all duration-500"></div>
        
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-4 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute top-2 left-12 w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-bounce pointer-events-none"></div>
        <div className="absolute bottom-3 right-32 w-2 h-2 bg-white rounded-full opacity-40 animate-ping pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-[90] p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          title="إخفاء النافذة نهائياً"
        >
          <X size={16} className="text-white/80 hover:text-white" />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4">

          {/* Left: message */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner border border-white/20">
              <Heart size={20} className="fill-white text-white drop-shadow-sm" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm md:text-base flex items-center gap-1">
                تمكين مجانية — ادعمنا بمبلغ بسيط!
                <Sparkles size={14} className="text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
              </h3>
              <p className="text-white/80 text-xs font-bold mt-0.5">
                <span className="bg-white/20 rounded-md px-1.5 py-0.5 mr-1">☕ 200دج</span>
                <span className="bg-white/20 rounded-md px-1.5 py-0.5 mr-1">⭐ 500دج</span>
                <span className="bg-white/20 rounded-md px-1.5 py-0.5"><Zap size={10} className="inline" /> 1000دج</span>
              </p>
            </div>
          </div>

          {/* Right: RIB + copy */}
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/15 shrink-0">
            <div className="flex flex-col items-end mr-1">
              <span className="text-[9px] text-white/60 font-black uppercase tracking-widest">RIB — باسم ساسي عبدالنور</span>
              <span className="font-mono text-sm tracking-wider font-black text-yellow-300 select-all" dir="ltr">
                {rib}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "px-3 py-2 rounded-xl transition-all font-black text-xs flex items-center gap-1.5 shrink-0 border",
                copied
                  ? "bg-emerald-400 text-white border-emerald-300 shadow-lg shadow-emerald-500/30"
                  : "bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/40"
              )}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? '✓ تم' : 'نسخ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
