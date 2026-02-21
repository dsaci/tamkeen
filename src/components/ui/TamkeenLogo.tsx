import React from 'react';
import { cn } from '../../lib/utils';
import { BookOpen } from 'lucide-react';

interface TamkeenLogoProps {
    className?: string;
    size?: number;
    showText?: boolean;
}

export const TamkeenLogoBrand: React.FC<TamkeenLogoProps> = ({ className, size = 40, showText = true }) => {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div
                className="relative flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg border-2 border-white/20"
                style={{ width: size, height: size }}
            >
                <BookOpen size={size * 0.6} className="text-white relative z-10" />
                <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm transform scale-90"></div>
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-800 dark:from-emerald-400 dark:to-teal-200">
                        تمكيــــن
                    </span>
                    <span className="text-[0.6rem] font-bold text-slate-400 tracking-[0.2em] uppercase">
                        Digital Journal
                    </span>
                </div>
            )}
        </div>
    );
};

export const TamkeenLogo = TamkeenLogoBrand;
