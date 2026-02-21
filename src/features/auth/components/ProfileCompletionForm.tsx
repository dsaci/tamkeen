import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completionSchema, CompletionFormData } from '../schema';
import { useTheme, themeStyles } from '../../../utils/theme';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SearchableSelect } from '../../../components/ui/SearchableSelect';
import { wildayas } from '../../../data/wilayas';
import { cn } from '../../../lib/utils';
import { TeacherProfile } from '../../../types';
import {
    User, Building, Layout, GraduationCap, MapPin, Phone,
    Sparkles, ArrowRight, ShieldCheck
} from 'lucide-react';

interface ProfileCompletionFormProps {
    initialProfile: TeacherProfile;
    onComplete: (profile: TeacherProfile) => Promise<void>;
}

export const ProfileCompletionForm: React.FC<ProfileCompletionFormProps> = ({ initialProfile, onComplete }) => {
    const { theme } = useTheme();
    const styles = themeStyles[theme];

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CompletionFormData>({
        resolver: zodResolver(completionSchema),
        defaultValues: {
            fullName: initialProfile.name || '',
            wilaya: initialProfile.wilaya || '',
            phone: '',
            institution: '',
            level: 'PRIMARY',
            subject: '',
        }
    });

    const selectedLevel = watch("level");

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

    const onSubmit = async (data: CompletionFormData) => {
        try {
            const updatedProfile: TeacherProfile = {
                ...initialProfile,
                name: data.fullName,
                institution: data.institution,
                level: data.level,
                wilaya: data.wilaya,
                province: data.wilaya,
                teachingSubject: data.subject,
                academicYear: '2025/2026',
                preferredShift: 'PARTIAL',
                teachingLanguage: 'ar',
                grades: [],
            };
            await onComplete(updatedProfile);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "فشل حفظ البيانات");
        }
    };

    const wilayaOptions = wildayas.map(w => ({
        value: w.id,
        label: `${w.code} - ${w.ar_name}`
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-[Cairo]" dir="rtl">
            <div className="max-w-xl w-full">
                {/* Header Decoration */}
                <div className="flex flex-col items-center mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-6 group transition-transform hover:rotate-12">
                        <Sparkles className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">خطوة واحدة أخيرة! ✨</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
                        أهلاً بك في تمكين. نحتاج فقط لبعض التفاصيل المهنية لإعداد كراسك الرقمي بشكل صحيح.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none animate-in zoom-in-95 duration-500">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="الاسم الكامل"
                            placeholder="أدخل اسمك الكامل كما سيظهر في الشهادات"
                            leftIcon={<User size={18} />}
                            error={errors.fullName?.message}
                            {...register("fullName")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <Input
                                label="رقم الهاتف"
                                placeholder="05 XX XX XX XX"
                                leftIcon={<Phone size={18} />}
                                error={errors.phone?.message}
                                {...register("phone")}
                            />
                        </div>

                        <Input
                            label="اسم المؤسسة التربوية"
                            placeholder="أدخل اسم مدرستك أو ثانويتك"
                            leftIcon={<Building size={18} />}
                            error={errors.institution?.message}
                            {...register("institution")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="level"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">المرحلة التعليمية</label>
                                        <div className="flex gap-2">
                                            {['PRIMARY', 'MIDDLE', 'SECONDARY'].map((l) => (
                                                <button
                                                    key={l}
                                                    type="button"
                                                    onClick={() => field.onChange(l)}
                                                    className={cn(
                                                        "flex-1 py-3 px-1 text-xs font-black rounded-2xl border transition-all active:scale-95",
                                                        field.value === l
                                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                                                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-emerald-300"
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
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">المادة / التخصص</label>
                                        <div className="relative">
                                            <select
                                                className={cn(
                                                    "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-900 dark:text-white",
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
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <GraduationCap size={18} />
                                            </div>
                                        </div>
                                        {errors.subject && <p className="text-xs text-rose-500">{errors.subject.message}</p>}
                                    </div>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-7 rounded-[2rem] text-lg font-black bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 mt-4 group"
                            isLoading={isSubmitting}
                        >
                            <span className="flex items-center gap-3">
                                حفظ البيانات والبدء الآن
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                            </span>
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">
                            <ShieldCheck size={14} />
                            بياناتك محمية ومشفرة بـ Supabase
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
