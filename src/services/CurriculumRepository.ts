import { SessionCategory, ExamType, SupportType, TrainingType, IntegrationType } from '../types';

export interface CurriculumData {
    objectives: string[];
    tools: string[];
    activities: string[];
}

export const ALGERIAN_HOLIDAYS = [
    { name: 'رأس السنة الهجرية', month: 1, day: 1, isLunar: true },
    { name: 'عاشوراء', month: 1, day: 10, isLunar: true },
    { name: 'المولد النبوي الشريف', month: 3, day: 12, isLunar: true },
    { name: 'رأس السنة الميلادية', month: 1, day: 1, isLunar: false },
    { name: 'عيد يناير (رأس السنة الأمازيغية)', month: 1, day: 12, isLunar: false },
    { name: 'عيد الفطر', month: 10, day: 1, isLunar: true, duration: 3 },
    { name: 'عيد الأضحى', month: 12, day: 10, isLunar: true, duration: 3 },
    { name: 'عيد العمال', month: 5, day: 1, isLunar: false },
    { name: 'عيد الاستقلال', month: 7, day: 5, isLunar: false },
    { name: 'ذكرى الثورة التحريرية', month: 11, day: 1, isLunar: false },
];

class CurriculumRepository {
    private static instance: CurriculumRepository;

    private constructor() { }

    public static getInstance(): CurriculumRepository {
        if (!CurriculumRepository.instance) {
            CurriculumRepository.instance = new CurriculumRepository();
        }
        return CurriculumRepository.instance;
    }

    /**
     * Get integrated suggestions for a session based on subject, activity, and education level
     */
    public async getSuggestions(subject: string, activity: string, level: string): Promise<CurriculumData> {
        const data: CurriculumData = {
            objectives: [],
            tools: [],
            activities: []
        };

        const isSecondary = level === 'SECONDARY' || level === 'HIGH' || level?.includes('AS');
        const isMiddle = level === 'MIDDLE' || level?.includes('AM');

        if (subject.includes('عربية')) {
            if (isSecondary) {
                data.tools = ['الكتاب المدرسي المقرر', 'السبورة', 'مسلاط رقمي (Data Show)', 'بطاقات الشواهد النحوية', 'مطبوعات السند الشعري والنثري'];
                data.activities = ['أدب ونصوص', 'قواعد اللغة', 'بلاغة ونقد', 'عروض وموسيقى الشعر', 'مطالعة موجهة', 'نص تواصلي', 'وضعية إدماجية / تعبير كتابي', 'مشروع بيداغوجي'];
            } else if (isMiddle) {
                data.tools = ['الكتاب المدرسي', 'السبورة', 'مسجل صوتي', 'كراس الأنشطة', 'أسناد بصرية ومطبوعات'];
                data.activities = ['فهم المنطوق وإنتاجه', 'فهم المكتوب (قراءة ودراسة نص)', 'الظاهرة اللغوية (قواعد)', 'إنتاج المكتوب (تعبير كتابي)', 'مطالعة موجهة'];
            } else {
                data.tools = ['الكتاب المدرسي', 'السبورة', 'الألواح', 'دفتر الأنشطة', 'لوحات القراءة', 'مشاهد مصورة'];
                data.activities = ['فهم المنطوق والتعبير الشفوي', 'قراءة وفهم نص', 'تراكيب نحوية', 'صيغ صرفية', 'إملاء ورسم كتابي', 'إنتاج كتابي'];
            }
        } else if (subject.includes('رياضيات')) {
            data.tools = isSecondary 
                ? ['الكتاب المدرسي', 'السبورة', 'الحاسبة العلمية والبيانية', 'برمجية جيوكيبرا / GeoGebra', 'أوراق مليمترية']
                : ['المعداد', 'الأشكال الهندسية', 'المسطرة والمنقلة', 'لوحة الأعداد', 'دفتر الأنشطة'];
            data.activities = isSecondary
                ? ['دوال وعدد حقيقي', 'هندسة في الفضاء', 'احتمالات وإحصاء', 'متتاليات عددية', 'أعداد مركبة']
                : ['أعداد وحساب', 'هندسة', 'قياس', 'تنظيم معطيات'];
        } else if (subject.includes('فرنسية') || subject.includes('Français')) {
            data.tools = ['Livre scolaire', 'Tableau', 'Flashcards', 'Cahier d\'activités', 'Projecteur'];
            data.activities = ['Compréhension orale', 'Production écrite', 'Grammaire', 'Conjugaison'];
        } else {
            data.tools = ['الكتاب المدرسي', 'السبورة', 'المجهر (علوم)', 'خرائط (جغرافيا)', 'وسائل إيضاح'];
            data.activities = ['درس نظري', 'أشغال تطبيقية', 'تقويم تشخيصي', 'معالجة'];
        }

        return data;
    }

    /**
     * Get official Algerian holidays for a specific date
     */
    public getHolidayForDate(dateStr: string): string | null {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Solar holidays (Gregorian)
        const solarHoliday = ALGERIAN_HOLIDAYS.find(h => !h.isLunar && h.month === month && h.day === day);
        if (solarHoliday) return solarHoliday.name;

        return null;
    }

    /**
     * Get suggested support/remediation strategies
     */
    public getSupportStrategies(): string[] {
        return [
            'تخصيص وقت إضافي للفئة المتعثرة.',
            'استخدام استراتيجية التعلم بالأقران.',
            'تبسيط المفاهيم عبر الوسائط السمعية البصرية.',
            'تكثيف التمارين التطبيقية المنزلية.',
            'إعادة شرح النقاط الغامضة في الحصة السابقة.'
        ];
    }
}

export const curriculumRepository = CurriculumRepository.getInstance();
