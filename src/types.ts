
export type SchoolLevel = 'PRIMARY' | 'MIDDLE' | 'HIGH';
export type ShiftType = 'SINGLE' | 'PARTIAL' | 'FULL';
export type AppLanguage = 'ar' | 'en' | 'fr';
export type TeachingLanguage = 'ar' | 'en' | 'fr';
export type TabType = 'hub' | 'dashboard' | 'journal' | 'grading' | 'absence' | 'resources' | 'annual' | 'settings' | 'memo' | 'database' | 'admin' | 'messages';

export interface TeacherProfile {
  tamkeenId: string;
  name: string;
  email: string;
  password?: string;
  institution: string;
  level: SchoolLevel;
  grades: string[];
  selectedGroup?: string;
  academicYear: string;
  province: string;
  wilaya?: string;
  preferredShift: ShiftType;
  nationalId?: string;
  language?: AppLanguage;
  teachingLanguage: TeachingLanguage;
  teachingSubject: string;
  showMinistryLogo?: boolean;
  pedagogicalDistrict?: string;
  administrativeDistrict?: string;
  deletedSubjects?: string[];
}

// --- UNIFIED JOURNAL MODEL (Strict Structure) ---

export type DayPeriod = 'MORNING' | 'AFTERNOON';

export type SessionCategory =
  | 'LESSON'       // حصة عادية
  | 'BREAK'        // استراحة
  | 'EXAM'         // اختبار / فرض
  | 'SUPPORT'      // معالجة
  | 'TRAINING'     // تدريبات
  | 'INTEGRATION'  // إدماج
  | 'HOLIDAY';     // عطلة

export type ExamType =
  | 'TERM_EXAM'      // اختبار فصلي
  | 'QUIZ'           // فرض محروس
  | 'PEDAGOGICAL'    // تقويم بيداغوجي
  | 'DIAGNOSTIC'     // تقويم تشخيصي
  | 'MAKTASABAT';    // تقييم المكتسبات

export type SupportType =
  | 'IMMEDIATE'      // معالجة آنية
  | 'PEDAGOGICAL';   // معالجة بيداغوجية

export type TrainingType =
  | 'EXERCISES'      // تمارين
  | 'CLASSWORK'      // تمارين كراس القسم
  | 'REVIEW'         // مراجعة عامة
  | 'OFFICIAL_EXAM'  // تحضير للامتحانات الرسمية
  | 'WORKBOOK';      // تمارين دفتر الأنشطة

export type IntegrationType =
  | 'FULL_WEEK'      // إدماج أسبوع كامل
  | 'HALF_WEEK';     // نصف أسبوع

export interface SmartTiming {
  date: string;            // YYYY-MM-DD
  startTime: string;       // HH:mm (Mandatory)
  endTime: string;         // HH:mm (Mandatory)
  period: DayPeriod;       // صبيحة / أمسية
  category: SessionCategory;

  // Specific Sub-types
  examType?: ExamType;
  supportType?: SupportType;
  trainingType?: TrainingType;
  integrationType?: IntegrationType;
  holidayName?: string;    // المناسبة
  breakDuration?: number;  // 5 to 20 mins
}

export interface Session {
  id: string;

  // 1. Timing (Strict)
  timing: SmartTiming;

  // 2. Mandatory Core Fields
  subject: string;         // المادة (User input)
  activity: string;        // النشاط (New)
  title: string;           // عنوان / اسم الحصة (User input)
  content: string;         // المحتوى (User input)

  // 3. Section & Unity (Strict)
  sectionNumber: number;   // رقم المقطع (Integer)
  sectionName: string;    // اسم المقطع (Text)
  unityNumber: number;     // رقم الوحدة (Integer)

  // 4. Pedagogical Details (Mandatory)
  objective: string;       // الهدف التعلمي / مؤشر الكفاءة
  notes: string;           // الملاحظة البيداغوجية
  tools: string;           // الوسائل البيداغوجية
}

export interface DailyJournal {
  id: string; // teacherId_YYYY-MM-DD
  teacherId: string;
  date: string;
  dayName: string;
  sessions: Session[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RepositoryItem {
  id: string;
  subject: string;
  defaultContent: string;
  defaultNotes?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  birthDate?: string;
  level: SchoolLevel;
  grade: string;
  group: string;
  registrationNumber: string;
  isAbsent?: boolean;
}

// Backward compatibility alias
export type JournalEntry = Session;

export interface StudentScore {
  studentId: string;
  term: 1 | 2 | 3;
  type: 'CONTINUOUS' | 'TEST' | 'EXAM' | 'ACQUISITION';
  scores: Record<string, any>;
  scoresBySubject?: Record<string, Record<string, any>>;
  status?: string;
}

// --- RESOURCE BANK ---

export interface Resource {
  id: string;
  subject: string;
  level: string;
  grade: string;
  unit?: string;
  activity: string;
  title: string;
  normalized_title: string;
  objective?: string;
  content?: string;
  tools?: string;
  method?: string;
  source: 'admin' | 'ai' | 'user';
  usage_count: number;
  created_at?: string;
  updated_at?: string;
  files?: ResourceFile[];
}

export interface ResourceFile {
  id: string;
  resource_id: string;
  file_name: string;
  file_type: string;
  media_type: 'document' | 'video';
  file_url: string;
  file_size?: number;
  duration_seconds?: number;
  uploaded_by?: string;
  uploaded_at?: string;
}