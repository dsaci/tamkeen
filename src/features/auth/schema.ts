import { z } from 'zod';

// Phase 3: Validation Patterns
const PHONE_REGEX = /^(0)(5|6|7)[0-9]{8}$/; // Matches 05, 06, 07 followed by 8 digits

export const registrationSchema = z.object({
    fullName: z.string().min(3, { message: "الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل" }),
    email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
    password: z.string().min(8, { message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" })
        .regex(/[A-Z]/, { message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل" })
        .regex(/[a-z]/, { message: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل" })
        .regex(/[0-9]/, { message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل" })
        .regex(/[^A-Za-z0-9]/, { message: "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل" }),
    confirmPassword: z.string(),
    wilaya: z.string().min(1, { message: "يرجى اختيار الولاية" }),
    countryCode: z.string(),
    phone: z.string()
        .regex(PHONE_REGEX, { message: "رقم الهاتف غير صالح (يجب أن يبدأ بـ 05, 06, أو 07 ويتكون من 10 أرقام)" }),
    institution: z.string().min(3, { message: "اسم المؤسسة مطلوب" }),
    agreeToTerms: z.boolean().refine(val => val === true, { message: "يجب الموافقة على الشروط" }),

    // Phase 5: Education Logic
    level: z.enum(['PRIMARY', 'MIDDLE', 'SECONDARY'] as const),
    subject: z.string().min(1, { message: "يرجى تحديد المادة / التخصص" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Post-Google OAuth Profile Completion Schema
export const completionSchema = z.object({
    fullName: z.string().min(3, { message: "الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل" }),
    wilaya: z.string().min(1, { message: "يرجى اختيار الولاية" }),
    phone: z.string().regex(PHONE_REGEX, { message: "رقم الهاتف غير صالح" }),
    institution: z.string().min(3, { message: "اسم المؤسسة مطلوب" }),
    level: z.enum(['PRIMARY', 'MIDDLE', 'SECONDARY'] as const),
    subject: z.string().min(1, { message: "يرجى تحديد المادة / التخصص" }),
});

export type CompletionFormData = z.infer<typeof completionSchema>;

export const loginSchema = z.object({
    email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
    password: z.string().min(1, { message: "كلمة المرور مطلوبة" }),
    rememberMe: z.boolean().optional(),
});
