
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
     * Get integrated suggestions for a session based on subject and activity
     */
    public async getSuggestions(subject: string, activity: string, level: string): Promise<CurriculumData> {
        // In a real app, this would query a local SQLite or remote Supabase DB
        // For now, we provide core suggestions based on the Algerian curriculum patterns

        const data: CurriculumData = {
            objectives: [],
            tools: [],
            activities: []
        };

        // Example logic for automated tools
        if (subject.includes('عربية')) {
            data.tools = ['الكتاب المدرسي', 'السبورة', 'لوحات القراءة', 'دفتر الأنشطة', 'جهاز العرض الرقمي'];
            data.activities = ['قراءة', 'تعبير شفوي', 'تراكيب نحوية', 'إملاء', 'خط'];
        } else if (subject.includes('رياضيات')) {
            data.tools = ['المعداد', 'الأشكال الهندسية', 'المسطرة والمنقلة', 'لوحة الأعداد', 'دفتر الأنشطة'];
            data.activities = ['أعداد وحساب', 'هندسة', 'قياس', 'تنظيم معطيات'];
        } else if (subject.includes('فرنسية') || subject.includes('Français')) {
            data.tools = ['Livre scolaire', 'Tableau', 'Flashcards', 'Cahier d\'activités', 'Projecteur'];
            data.activities = ['Compréhension orale', 'Production écrite', 'Grammaire', 'Conjugaison'];
        } else {
            data.tools = ['الكتاب المدرسي', 'السبورة', 'المجهر (علوم)', 'خرائط (جغرافيا)', 'وسائل إيضاح'];
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

        // Lunar holidays (Hijri) - In a production app, we'd use a library like 'hijri-converter'
        // For this prototype, we return null unless solar matches. 
        // We expect the user to confirm/adjust as per official announcement.

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
