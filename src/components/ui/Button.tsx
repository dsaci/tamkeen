import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme, themeStyles } from '../../utils/theme';
import { cn } from '../../lib/utils'; // Assuming cn exists or I will create it

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
        const { theme } = useTheme();
        const styles = themeStyles[theme];

        const baseStyles = "inline-flex items-center justify-center font-bold focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

        const sizeStyles = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
            icon: "h-10 w-10",
        };

        const variantStyles = {
            primary: styles.primary,
            secondary: styles.secondary,
            accent: styles.accent,
            ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
            danger: "bg-rose-600 text-white hover:bg-rose-700",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    styles.font,
                    styles.rounded,
                    styles.button,
                    sizeStyles[size],
                    variantStyles[variant],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";
