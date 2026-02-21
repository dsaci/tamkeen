
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLoadingMessage } from '../lib/utils/loadingMessages';

interface LoadingScreenProps {
  fullScreen?: boolean;
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullScreen = true, className = "" }) => {
  const message = useLoadingMessage(2500);

  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-[200] bg-[#f8fafc] dark:bg-slate-950' : 'w-full h-full min-h-[300px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10'} flex items-center justify-center transition-colors duration-300 ${className}`} dir="rtl">
      <div className="flex flex-col items-center gap-8 max-w-lg px-6 text-center">
        <div className="relative">
           <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
           <div className="relative bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg border border-emerald-100 dark:border-emerald-900/30">
             <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-500" size={48} />
           </div>
        </div>
        
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500" key={message}>
           <p className="text-slate-800 dark:text-white font-black text-xl md:text-2xl leading-relaxed tracking-tight">
             {message}
           </p>
           <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-200 mx-auto rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
