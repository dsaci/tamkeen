import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormData } from '../schema';
import { useTheme, themeStyles } from '../../../utils/theme';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SearchableSelect } from '../../../components/ui/SearchableSelect';
import { wildayas } from '../../../data/wilayas';
import { cn } from '../../../lib/utils';
import {
    Eye, EyeOff, User, Mail, Lock, Building, Phone
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface RegistrationFormProps {
    onSuccess: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
    const { theme } = useTheme();
    const styles = themeStyles[theme];
    const [showPassword, setShowPassword] = React.useState(false);
    const auth = useAuth();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            countryCode: "+213",
            phone: "",
            agreeToTerms: false,
        }
    });

    const countryOptions = [
        { value: '+213', label: 'الجزائر (+213)', flag: '🇩🇿' },
    ];

    const selectedLevel = watch("level");

    // Dynamic subjects based on Level
    const getSubjectOptions = () => {
        if (selectedLevel === 'PRIMARY') {
            return [
                { value: 'ARABIC', label: 'اللغة العربية (معلم فصل)' },
                { value: 'FRENCH', label: 'اللغة الفرنسية' },
                { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
                { value: 'PE', label: 'التربية البدنية' },
            ];
        }
        if (selectedLevel === 'MIDDLE') {
            return [
                { value: 'ARABIC', label: 'اللغة العربية' },
                { value: 'MATH', label: 'الرياضيات' },
                { value: 'FRENCH', label: 'اللغة الفرنسية' },
                { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
                { value: 'ISLAMIC', label: 'التربية الإسلامية' },
                { value: 'HISTORY', label: 'التاريخ والجغرافيا' },
                { value: 'CIVICS', label: 'التربية المدنية' },
                { value: 'PHYSICS', label: 'العلوم الفيزيائية' },
                { value: 'SCIENCE', label: 'علوم الطبيعة والحياة' },
                { value: 'TECH', label: 'التكنولوجيا' },
                { value: 'IT', label: 'الإعلام الآلي' },
                { value: 'PE', label: 'التربية البدنية' },
                { value: 'AMAZIGH', label: 'اللغة الأمازيغية' },
            ];
        }
        if (selectedLevel === 'SECONDARY') {
            return [
                { value: 'ARABIC', label: 'اللغة العربية' },
                { value: 'MATH', label: 'الرياضيات' },
                { value: 'PHYSICS', label: 'الفيزياء' },
                { value: 'SCIENCE', label: 'العلوم الطبيعية' },
                { value: 'PHILOSOPHY', label: 'الفلسفة' },
                { value: 'ENGLISH', label: 'الإنجليزية' },
                { value: 'FRENCH', label: 'الفرنسية' },
                { value: 'HISTORY', label: 'التاريخ والجغرافيا' },
                { value: 'ISLAMIC', label: 'العلوم الإسلامية' },
                { value: 'ECONOMY', label: 'التسيير والاقتصاد' },
                { value: 'LAW', label: 'القانون' },
                { value: 'MECH_ENG', label: 'الهندسة الميكانيكية' },
                { value: 'ELEC_ENG', label: 'الهندسة الكهربائية' },
                { value: 'CIVIL_ENG', label: 'الهندسة المدنية' },
                { value: 'PROCESS_ENG', label: 'هندسة الطرائق' },
                { value: 'IT', label: 'الإعلام الآلي' },
                { value: 'PE', label: 'التربية البدنية' },
                { value: 'AMAZIGH', label: 'الأمازيغية' },
            ];
        }
        return [];
    };

    const onSubmit = async (data: RegistrationFormData) => {
        try {
            const profile = {
                name: data.fullName,
                institution: data.institution,
                level: data.level,
                wilaya: data.wilaya,
                teachingSubject: data.subject,
                phone: data.phone,
                email: data.email,
                academicYear: '2025/2026',
                province: data.wilaya,
                tamkeenId: '',
                teachingLanguage: 'ar',
                preferredShift: 'PARTIAL',
                grades: [],
            };
            await auth.register(data.email, data.password, profile);
            onSuccess();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "فشل التسجيل");
        }
    };

    const wilayaOptions = wildayas.map(w => ({
        value: w.id,
        label: `${w.code} - ${w.ar_name}`
    }));

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in slide-in-from-bottom-5 duration-500">
            <Input
                label="الاسم الكامل"
                placeholder="أدخل اسمك الكامل"
                leftIcon={<User size={18} />}
                error={errors.fullName?.message}
                {...register("fullName")}
            />

            <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register("email")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Input
                    label="تأكيد كلمة المرور"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    leftIcon={<Lock size={18} />}
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="wilaya"
                    control={control}
                    render={({ field }) => (
                        <SearchableSelect
                            label="الولاية"
                            options={wilayaOptions}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.wilaya?.message}
                            placeholder="اختر الولاية..."
                        />
                    )}
                />

                <div className="space-y-1">
                    <label className={cn("block text-sm font-medium", theme === 'v3' ? "text-slate-300" : "text-slate-700")}>رقم الهاتف</label>
                    <div className="flex gap-2" dir="ltr">
                        <select
                            className={cn(
                                "w-[100px] px-3 py-2 text-sm border rounded outline-none appearance-none cursor-pointer text-center font-bold",
                                styles.input
                            )}
                            {...register('countryCode')}
                        >
                            <option value="+213">🇩🇿 +213</option>
                        </select>
                        <input
                            type="text"
                            placeholder="05 XX XX XX XX"
                            className={cn(
                                "flex-1 px-3 py-2 text-sm border rounded outline-none appearance-none font-bold tracking-wider",
                                styles.input,
                                errors.phone ? "border-rose-500" : ""
                            )}
                            {...register('phone')}
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 text-right">{errors.phone.message}</p>}
                </div>
            </div>

            <Input
                label="اسم المؤسسة"
                placeholder="أدخل اسم مؤسستك"
                leftIcon={<Building size={18} />}
                error={errors.institution?.message}
                {...register("institution")}
            />

            {/* Phase 5: Education Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <label className={cn("block text-sm font-medium", theme === 'v3' ? "text-slate-300" : "text-slate-700")}>المرحلة التعليمية</label>
                            <div className="flex gap-2">
                                {['PRIMARY', 'MIDDLE', 'SECONDARY'].map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => field.onChange(l)}
                                        className={cn(
                                            "flex-1 py-2 px-1 text-xs font-bold rounded border transition-colors",
                                            field.value === l
                                                ? "bg-emerald-600 text-white border-emerald-600"
                                                : (theme === 'v3' ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-600")
                                        )}
                                    >
                                        {l === 'PRIMARY' ? 'ابتدائي' : l === 'MIDDLE' ? 'متوسط' : 'ثانوي'}
                                    </button>
                                ))}
                            </div>
                            {errors.level && <p className="text-xs text-rose-500">{errors.level.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <label className={cn("block text-sm font-medium", theme === 'v3' ? "text-slate-300" : "text-slate-700")}>المادة / التخصص</label>
                            <select
                                className={cn(
                                    "w-full px-3 py-2 text-sm border rounded outline-none appearance-none cursor-pointer",
                                    styles.input,
                                    errors.subject ? "border-rose-500" : ""
                                )}
                                {...field}
                                disabled={!selectedLevel}
                            >
                                <option value="">اختر المادة...</option>
                                {getSubjectOptions().map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {errors.subject && <p className="text-xs text-rose-500">{errors.subject.message}</p>}
                        </div>
                    )}
                />
            </div>

            <div className="flex items-center gap-2 mt-2">
                <input
                    type="checkbox"
                    id="terms"
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                    {...register("agreeToTerms")}
                />
                <label htmlFor="terms" className={cn("text-sm", theme === 'v3' ? "text-slate-300" : "text-slate-600")}>
                    أوافق على الشروط والأحكام
                </label>
            </div>
            {errors.agreeToTerms && <p className="text-xs text-rose-500">{errors.agreeToTerms.message}</p>}

            <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                isLoading={isSubmitting}
            >
                إنشاء حساب جديد
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className={cn("w-full border-t", theme === 'v3' ? "border-slate-700" : "border-slate-300")} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className={cn(
                        "px-2 relative z-10",
                        theme === 'v3'
                            ? "bg-slate-950 text-slate-400"
                            : "bg-[#f8fafc] dark:bg-[#020617] text-slate-500"
                    )}>
                        أو التسجيل عبر
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className={cn(
                    "w-full flex items-center justify-center gap-3 py-6 rounded-2xl group transition-all duration-300 active:scale-95 shadow-sm",
                    theme === 'v3'
                        ? "border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                )}
                onClick={async () => {
                    try {
                        const result = await auth.signInWithGoogle();
                        if (!result.success && result.error) {
                            alert(result.error);
                        }
                    } catch (err: any) {
                        alert(err.message || 'فشل الاتصال بـ Google');
                    }
                }}
            >
                <div className="bg-white p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                </div>
                <span className="font-bold">البدء سريعاً عبر Google</span>
            </Button>
        </form >
    );
};
