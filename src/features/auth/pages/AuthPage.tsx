import React, { useState } from 'react';
import { useTheme, themeStyles } from '../../../utils/theme';
import { LoginForm } from '../components/LoginForm';
import { RegistrationForm } from '../components/RegistrationForm';
import { TamkeenLogo } from '../../../components/ui/TamkeenLogo';
import { Sun, Moon, ToggleLeft, ToggleRight, Palette } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { UITheme } from '../../../utils/theme';

export const AuthPage = () => {
    const { theme, setTheme } = useTheme();
    const styles = themeStyles[theme];
    const [isLogin, setIsLogin] = useState(true);
    const [darkMode, setDarkMode] = useState(false); // Local toggle for now, should use ThemeProvider's mechanism if global

    // Toggle logic for V1, V2, V3
    const cycleTheme = () => {
        const themes: UITheme[] = ['v1', 'v2', 'v3'];
        const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    return (
        <div className={cn(
            "min-h-screen flex items-center justify-center p-4 transition-colors duration-500",
            theme === 'v3' ? "bg-slate-950" : (theme === 'v2' ? "bg-gradient-to-br from-indigo-50 to-purple-50" : "bg-slate-50")
        )} dir="rtl">

            <div className="absolute top-6 left-6 flex items-center gap-3">
                <button
                    onClick={cycleTheme}
                    className="p-3 bg-white/50 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-transform"
                    title="Change Theme UI"
                >
                    <Palette size={20} className={theme === 'v3' ? "text-white" : "text-slate-900"} />
                </button>
            </div>

            <div className={cn(
                "w-full max-w-2xl overflow-hidden relative transition-all duration-300",
                styles.rounded,
                styles.card,
                theme === 'v3' && "border-slate-800 bg-slate-900/50 backdrop-blur-xl"
            )}>
                <div className="p-8 md:p-12">
                    <div className="flex flex-col items-center mb-8">
                        <TamkeenLogo size={60} className="mb-4" />
                        <h2 className={cn(
                            "text-3xl font-black mb-2",
                            theme === 'v3' ? "text-white" : "text-slate-800"
                        )}>
                            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                        </h2>
                        <p className={cn(
                            "text-sm font-medium",
                            theme === 'v3' ? "text-slate-400" : "text-slate-500"
                        )}>
                            منصة التمكين الرقمي للأستاذ الجزائري
                        </p>
                    </div>

                    {isLogin ? <LoginForm /> : <RegistrationForm onSuccess={() => alert("Welcome!")} />}

                    <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className={cn("text-sm mb-2", theme === 'v3' ? "text-slate-400" : "text-slate-500")}>
                            {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className={cn(
                                "font-bold hover:underline transition-colors",
                                theme === 'v3' ? "text-emerald-400" : "text-emerald-600"
                            )}
                        >
                            {isLogin ? "سجل الآن مجاناً" : "تسجيل الدخول"}
                        </button>
                    </div>
                </div>

                {/* Visual Flair for V2 */}
                {theme === 'v2' && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
                )}
                {theme === 'v2' && (
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-2000"></div>
                )}
            </div>
        </div>
    );
};
