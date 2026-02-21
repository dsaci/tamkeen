import React, { InputHTMLAttributes } from 'react';
import { useTheme, themeStyles } from '../../utils/theme';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
        const { theme } = useTheme();
        const styles = themeStyles[theme];

        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className={cn(
                        "block text-sm font-medium",
                        theme === 'v3' ? "text-slate-300" : "text-slate-700"
                    )}>
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
                            styles.rounded,
                            styles.input,
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-rose-500 animate-in slide-in-from-top-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
