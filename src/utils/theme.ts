import { createContext, useContext } from 'react';

export type UITheme = 'v1' | 'v2' | 'v3';

export const ThemeContext = createContext<{
  theme: UITheme;
  setTheme: (theme: UITheme) => void;
}>({
  theme: 'v1',
  setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const themeStyles = {
  v1: {
    // Ministry Professional
    font: "font-['Cairo']",
    rounded: "rounded-md",
    button: "shadow-sm hover:shadow active:shadow-none transition-all",
    card: "bg-white border border-slate-200 shadow-sm",
    input: "bg-white text-slate-900 border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600",
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    accent: "bg-amber-600 text-white hover:bg-amber-700",
  },
  v2: {
    // Modern Soft
    font: "font-['Cairo']",
    rounded: "rounded-2xl",
    button: "shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300",
    card: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl",
    input: "bg-slate-50 text-slate-900 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-400 shadow-inner",
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700",
    secondary: "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100",
    accent: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600",
  },
  v3: {
    // Executive Dark Premium
    font: "font-['Cairo']",
    rounded: "rounded-lg",
    button: "shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] border border-emerald-500/30 transition-all",
    card: "bg-slate-900 border border-slate-800 shadow-2xl",
    input: "bg-slate-950 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500",
    primary: "bg-slate-950 border border-emerald-500 text-emerald-400 hover:bg-emerald-950",
    secondary: "bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800",
    accent: "bg-slate-950 border border-amber-500 text-amber-400 hover:bg-amber-950",
  }
};
