import React, { HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { useTheme, themeStyles } from '../../utils/theme';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal = ({ isOpen, onClose, title, size = 'md', children, className, ...props }: ModalProps) => {
    const { theme } = useTheme();
    const styles = themeStyles[theme];

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full m-4",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={cn(
                    "w-full relative flex flex-col max-h-[90vh]",
                    styles.rounded,
                    styles.card,
                    sizeClasses[size],
                    "animate-in zoom-in-95 duration-200",
                    theme === 'v2' && "backdrop-blur-xl bg-white/90 border-white/50 shadow-2xl",
                    className
                )}
                {...props}
            >
                <div className="flex items-center justify-between p-4 border-b border-inherit">
                    {title && (
                        <h3 className={cn(
                            "text-lg font-bold leading-none tracking-tight",
                            theme === 'v3' ? "text-emerald-400" : "text-slate-900"
                        )}>
                            {title}
                        </h3>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};
