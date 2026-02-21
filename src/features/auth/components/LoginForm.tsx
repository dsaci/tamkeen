import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../schema';
import { useTheme, themeStyles } from '../../../utils/theme';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export const LoginForm = () => {
    const { theme } = useTheme();
    const styles = themeStyles[theme];
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        try {
            await auth.login(data.email, data.password);
        } catch (err: any) {
            setError(err.message || 'فشل تسجيل الدخول. تأكد من صحة البيانات.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in slide-in-from-left-5 duration-500">
            {error && (
                <div className="p-3 bg-rose-100 text-rose-700 rounded-md text-sm text-center">
                    {error}
                </div>
            )}

            <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register("email")}
            />

            <Input
                label="كلمة المرور"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                leftIcon={<Lock size={18} />}
                rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
                error={errors.password?.message}
                {...register("password")}
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                        {...register("rememberMe")}
                    />
                    <label htmlFor="rememberMe" className={cn("text-sm", theme === 'v3' ? "text-slate-400" : "text-slate-600")}>
                        تذكرني
                    </label>
                </div>
                <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">نسيت كلمة المرور؟</a>
            </div>

            <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
                leftIcon={<LogIn size={18} />}
            >
                دخول آمن
            </Button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className={cn("w-full border-t", theme === 'v3' ? "border-slate-800" : "border-slate-200")} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className={cn(
                        "px-2",
                        theme === 'v3' ? "bg-slate-900 text-slate-500" : "bg-white text-slate-400"
                    )}>أو</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className={cn(
                    "w-full flex items-center justify-center gap-3 py-6 rounded-2xl group active:scale-95 transition-all duration-300",
                    theme === 'v3'
                        ? "border-slate-800 text-slate-300 hover:bg-slate-800"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                )}
                onClick={async () => {
                    setError(null);
                    try {
                        const result = await auth.signInWithGoogle();
                        if (!result.success && result.error) {
                            setError(result.error);
                        }
                    } catch (err: any) {
                        setError(err.message || 'فشل الاتصال بـ Google');
                    }
                }}
            >
                <div className="bg-white p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                </div>
                <span className="font-bold">متابعة باستخدام Google</span>
            </Button>
        </form>
    );
};
