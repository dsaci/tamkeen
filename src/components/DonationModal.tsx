import React, { useState } from 'react';
import { Heart, X, Copy, Check, Coffee, Sparkles, Star, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const rib = '00799999001114900455';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md relative animate-in zoom-in-95 duration-300">

        {/* Outer glow ring */}
        <div className="absolute -inset-1 bg-gradient-to-br from-rose-400 via-amber-400 to-emerald-400 rounded-[3.5rem] blur opacity-60 animate-pulse"></div>

        <div className="relative bg-white dark:bg-slate-950 w-full rounded-[3rem] overflow-hidden shadow-2xl">

          {/* Hero gradient header */}
          <div className="relative bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400 px-8 pt-10 pb-16 text-center overflow-hidden">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-4 left-6 w-6 h-6 bg-yellow-300 rounded-full opacity-70 animate-bounce"></div>
            <div className="absolute top-12 right-8 w-3 h-3 bg-white rounded-full opacity-50 animate-ping"></div>

            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-sm">
              <X size={18} />
            </button>

            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-white/30">
              <Heart size={36} className="fill-white text-white drop-shadow-md" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1 drop-shadow-sm">تمكين تحتاج دعمك! ❤️</h3>
            <p className="text-white/85 text-sm font-bold">ساهم في استمرارية المنصة المجانية</p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 -mt-8 relative z-10">

            {/* Tier badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Coffee, label: 'قهوة واحدة', amount: '200 دج', color: 'from-amber-400 to-orange-500' },
                { icon: Star, label: 'دعم شهري', amount: '500 دج', color: 'from-rose-400 to-pink-600' },
                { icon: Zap, label: 'راعي المنصة', amount: '1000 دج', color: 'from-purple-500 to-indigo-600' },
              ].map(({ icon: Icon, label, amount, color }) => (
                <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-3 text-white text-center shadow-md cursor-pointer hover:scale-105 transition-transform`}>
                  <Icon size={18} className="mx-auto mb-1" />
                  <div className="font-black text-[10px] leading-tight">{label}</div>
                  <div className="font-black text-xs mt-1 bg-white/20 rounded-lg px-1 py-0.5">{amount}</div>
                </div>
              ))}
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-5 leading-relaxed text-center">
              منصة تمكين مجانية كلياً. دعمك ولو بمبلغ بسيط (ثمن قهوة ☕) يساهم في تطوير أدوات جديدة للأستاذ الجزائري.
            </p>

            {/* RIB Box */}
            <div className="relative group mb-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-1">
                  <Sparkles size={12} /> الحساب البريدي الجاري (RIB)
                </p>
                <div className="flex items-center justify-between gap-3 bg-emerald-50 dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
                  <span className="font-mono text-base font-black text-slate-800 dark:text-white select-all tracking-wider" dir="ltr">
                    {rib}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "px-3 py-2 rounded-xl transition-all text-xs font-black flex items-center gap-1.5 shrink-0",
                      copied
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-sm border border-emerald-200 dark:border-emerald-800"
                    )}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '✓ تم النسخ' : 'نسخ'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-2 text-center">
                  باسم: <span className="text-slate-700 dark:text-slate-300 font-black">ساسي عبدالنور</span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 text-white py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Heart size={18} className="fill-white" />
              شكراً ❤️ — مواصلة العمل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
