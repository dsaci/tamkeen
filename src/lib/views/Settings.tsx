import React, { useState, useEffect, useRef } from 'react';
import { TeacherProfile, SchoolLevel, ShiftType, TeachingLanguage } from '../../types';
import {
   Settings, Moon, Sun, Save, Check, Download, Upload, Key, Eye, EyeOff,
   GraduationCap, Building, Phone, Mail, User, MapPin, School, BookOpen,
   Sparkles, Copy, FileText, CheckCircle2, AlertTriangle, Layers, ShieldCheck,
   RotateCcw, Plus, X, HelpCircle, CheckCheck, Compass, Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useJournalStore } from '../../features/journal/store/journalStore';
import { wildayas } from '../../data/wilayas';
import { SmartSectionProvider } from '../../contexts/SmartSectionContext';
import SmartSection from '../../components/ui/SmartSection';
import GlobalCollapseControl from '../../components/ui/GlobalCollapseControl';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

interface Props {
   profile: TeacherProfile;
   onUpdate: (profile: TeacherProfile) => void;
   darkMode: boolean;
   setDarkMode: (val: boolean) => void;
}

export default function SettingsView({ profile, onUpdate, darkMode, setDarkMode }: Props) {
   const auth = useAuth();
   const [isSaving, setIsSaving] = useState(false);
   const [saved, setSaved] = useState(false);
   const [copiedId, setCopiedId] = useState(false);

   // 1. Personal & Identity
   const [name, setName] = useState(profile.name || '');
   const [email, setEmail] = useState(profile.email || '');
   const [phone, setPhone] = useState(profile.phone || '');
   const [nationalId, setNationalId] = useState(profile.nationalId || '');
   const [tamkeenId, setTamkeenId] = useState(profile.tamkeenId || '');

   // 2. Education Level & Subject
   const normalizeLevel = (lvl?: string): SchoolLevel => {
      if (!lvl) return 'SECONDARY';
      if (lvl === 'HIGH') return 'SECONDARY';
      return lvl as SchoolLevel;
   };

   const [level, setLevel] = useState<SchoolLevel>(normalizeLevel(profile.level));
   const [teachingSubject, setTeachingSubject] = useState(profile.teachingSubject || 'ARABIC');
   const [customSubject, setCustomSubject] = useState('');

   // 3. Institution & Administration
   const [institution, setInstitution] = useState(profile.institution || '');
   const [wilaya, setWilaya] = useState(profile.wilaya || profile.province || '16');
   const [province, setProvince] = useState(profile.province || '');
   const [pedagogicalDistrict, setPedagogicalDistrict] = useState(profile.pedagogicalDistrict || '');
   const [administrativeDistrict, setAdministrativeDistrict] = useState(profile.administrativeDistrict || '');
   const [academicYear, setAcademicYear] = useState(profile.academicYear || '2024/2025');

   // 4. Pedagogical & Work Preferences
   const [preferredShift, setPreferredShift] = useState<ShiftType>(profile.preferredShift || 'FULL');
   const [teachingLanguage, setTeachingLanguage] = useState<TeachingLanguage>(profile.teachingLanguage || 'ar');
   const [showMinistryLogo, setShowMinistryLogo] = useState<boolean>(profile.showMinistryLogo !== false);
   const [grades, setGrades] = useState<string[]>(Array.isArray(profile.grades) ? profile.grades : []);
   const [newGradeInput, setNewGradeInput] = useState('');

   // 5. AI Key
   const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('tamkeen_gemini_key') || '');
   const [showKey, setShowKey] = useState(false);
   const [keySaved, setKeySaved] = useState(false);

   // Sync state if profile prop changes
   useEffect(() => {
      if (profile) {
         setName(profile.name || '');
         setEmail(profile.email || '');
         setPhone(profile.phone || '');
         setNationalId(profile.nationalId || '');
         setTamkeenId(profile.tamkeenId || '');
         setLevel(normalizeLevel(profile.level));
         setTeachingSubject(profile.teachingSubject || 'ARABIC');
         setInstitution(profile.institution || '');
         setWilaya(profile.wilaya || profile.province || '16');
         setProvince(profile.province || '');
         setPedagogicalDistrict(profile.pedagogicalDistrict || '');
         setAdministrativeDistrict(profile.administrativeDistrict || '');
         setAcademicYear(profile.academicYear || '2024/2025');
         setPreferredShift(profile.preferredShift || 'FULL');
         setTeachingLanguage(profile.teachingLanguage || 'ar');
         setShowMinistryLogo(profile.showMinistryLogo !== false);
         setGrades(Array.isArray(profile.grades) ? profile.grades : []);
      }
   }, [profile]);

   // Dynamic Subjects based on selected Level
   const getSubjectListForLevel = (lvl: SchoolLevel) => {
      if (lvl === 'PRIMARY') {
         return [
            { value: 'ARABIC', label: 'اللغة العربية (معلم فصل)' },
            { value: 'FRENCH', label: 'اللغة الفرنسية' },
            { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
            { value: 'PE', label: 'التربية البدنية والرياضية' },
            { value: 'AMAZIGH', label: 'اللغة الأمازيغية' },
            { value: 'CUSTOM', label: 'تخصص آخر...' },
         ];
      }
      if (lvl === 'MIDDLE') {
         return [
            { value: 'ARABIC', label: 'اللغة العربية' },
            { value: 'MATH', label: 'الرياضيات' },
            { value: 'PHYSICS', label: 'العلوم الفيزيائية والتكنولوجيا' },
            { value: 'SCIENCE', label: 'علوم الطبيعة والحياة' },
            { value: 'ISLAMIC', label: 'التربية الإسلامية' },
            { value: 'HISTORY', label: 'التاريخ والجغرافيا' },
            { value: 'CIVICS', label: 'التربية المدنية' },
            { value: 'FRENCH', label: 'اللغة الفرنسية' },
            { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
            { value: 'TECH', label: 'التكنولوجيا' },
            { value: 'IT', label: 'الإعلام الآلي' },
            { value: 'PE', label: 'التربية البدنية والرياضية' },
            { value: 'AMAZIGH', label: 'اللغة الأمازيغية' },
            { value: 'CUSTOM', label: 'تخصص آخر...' },
         ];
      }
      // SECONDARY
      return [
         { value: 'ARABIC', label: 'اللغة العربية وآدابها' },
         { value: 'MATH', label: 'الرياضيات' },
         { value: 'PHYSICS', label: 'العلوم الفيزيائية' },
         { value: 'SCIENCE', label: 'علوم الطبيعة والحياة' },
         { value: 'PHILOSOPHY', label: 'الفلسفة' },
         { value: 'HISTORY', label: 'التاريخ والجغرافيا' },
         { value: 'ISLAMIC', label: 'العلوم الإسلامية' },
         { value: 'FRENCH', label: 'اللغة الفرنسية' },
         { value: 'ENGLISH', label: 'اللغة الإنجليزية' },
         { value: 'ECONOMY', label: 'التسيير المحاسبي والمالي / الاقتصاد' },
         { value: 'LAW', label: 'القانون' },
         { value: 'CIVIL_ENG', label: 'الهندسة المدنية' },
         { value: 'MECH_ENG', label: 'الهندسة الميكانيكية' },
         { value: 'ELEC_ENG', label: 'الهندسة الكهربائية' },
         { value: 'PROCESS_ENG', label: 'هندسة الطرائق' },
         { value: 'IT', label: 'الإعلام الآلي' },
         { value: 'PE', label: 'التربية البدنية والرياضية' },
         { value: 'AMAZIGH', label: 'اللغة الأمازيغية' },
         { value: 'ITALIAN', label: 'اللغة الإيطالية' },
         { value: 'SPANISH', label: 'اللغة الإسبانية' },
         { value: 'GERMAN', label: 'اللغة الألمانية' },
         { value: 'CUSTOM', label: 'تخصص آخر...' },
      ];
   };

   // Suggested Grades presets based on Level
   const getPresetGrades = (lvl: SchoolLevel) => {
      if (lvl === 'PRIMARY') return ['1AP1', '2AP1', '3AP1', '4AP1', '5AP1'];
      if (lvl === 'MIDDLE') return ['1AM1', '1AM2', '2AM1', '3AM1', '4AM1'];
      return ['1AS1 (علمي)', '1AS2 (أدبي)', '2AS1 (علمي)', '2AS2 (أدبي)', '3AS1 (ع ت)', '3AS2 (آ ف)'];
   };

   const togglePresetGrade = (g: string) => {
      if (grades.includes(g)) {
         setGrades(grades.filter(x => x !== g));
      } else {
         setGrades([...grades, g]);
      }
   };

   const handleAddCustomGrade = () => {
      const trimmed = newGradeInput.trim();
      if (trimmed && !grades.includes(trimmed)) {
         setGrades([...grades, trimmed]);
         setNewGradeInput('');
      }
   };

   const handleRemoveGrade = (g: string) => {
      setGrades(grades.filter(x => x !== g));
   };

   const saveGeminiKey = () => {
      localStorage.setItem('tamkeen_gemini_key', geminiKey.trim());
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2000);
   };

   const copyTamkeenId = () => {
      if (tamkeenId) {
         navigator.clipboard.writeText(tamkeenId);
         setCopiedId(true);
         setTimeout(() => setCopiedId(false), 2000);
      }
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         const finalSubject = teachingSubject === 'CUSTOM' && customSubject.trim()
            ? customSubject.trim()
            : teachingSubject;

         const updatedProfile: TeacherProfile = {
            ...profile,
            name: name.trim() || profile.name,
            email: email.trim() || profile.email,
            phone: phone.trim(),
            nationalId: nationalId.trim(),
            tamkeenId: tamkeenId.trim() || profile.tamkeenId,
            level: level,
            teachingSubject: finalSubject,
            institution: institution.trim(),
            wilaya: wilaya,
            province: province.trim() || wilaya,
            pedagogicalDistrict: pedagogicalDistrict.trim(),
            administrativeDistrict: administrativeDistrict.trim(),
            academicYear: academicYear.trim(),
            preferredShift: preferredShift,
            teachingLanguage: teachingLanguage,
            showMinistryLogo: showMinistryLogo,
            grades: grades,
         };

         // 1. Update in AuthContext (local DB + cloud)
         await auth.updateProfile(updatedProfile);

         // 2. Update in App state
         onUpdate(updatedProfile);

         // 3. Update Journal Store so the daily journal immediately reflects the level change
         useJournalStore.getState().setSelectedLevel(level);

         setSaved(true);
         setTimeout(() => setSaved(false), 3000);
      } catch (e: any) {
         console.error("[Settings] Save error:", e);
         alert(e?.message || "حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة ثانية.");
      } finally {
         setIsSaving(false);
      }
   };

   // Backup Export
   const handleExportData = async () => {
      try {
         const today = new Date().toISOString().split('T')[0];
         const dataToExport = {
            profile: {
               ...profile,
               name, email, phone, nationalId, tamkeenId, level,
               teachingSubject, institution, wilaya, pedagogicalDistrict,
               administrativeDistrict, academicYear, preferredShift,
               teachingLanguage, showMinistryLogo, grades
            },
            exportDate: new Date().toISOString(),
            version: "2.5.0",
            platform: "تمكين للتعليم الجزائري"
         };

         const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `tamkeen_backup_${name || 'teacher'}_${today}.json`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
      } catch (error) {
         console.error("Export failed", error);
         alert("فشل تصدير البيانات.");
      }
   };

   // Backup Import
   const fileInputRef = useRef<HTMLInputElement>(null);
   const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
         try {
            const content = event.target?.result as string;
            const parsed = JSON.parse(content);
            const importedProfile = parsed.profile || parsed;

            if (importedProfile && typeof importedProfile === 'object') {
               if (importedProfile.name) setName(importedProfile.name);
               if (importedProfile.email) setEmail(importedProfile.email);
               if (importedProfile.phone) setPhone(importedProfile.phone);
               if (importedProfile.nationalId) setNationalId(importedProfile.nationalId);
               if (importedProfile.level) setLevel(normalizeLevel(importedProfile.level));
               if (importedProfile.teachingSubject) setTeachingSubject(importedProfile.teachingSubject);
               if (importedProfile.institution) setInstitution(importedProfile.institution);
               if (importedProfile.wilaya) setWilaya(importedProfile.wilaya);
               if (importedProfile.grades) setGrades(importedProfile.grades);
               if (importedProfile.academicYear) setAcademicYear(importedProfile.academicYear);
               if (importedProfile.pedagogicalDistrict) setPedagogicalDistrict(importedProfile.pedagogicalDistrict);
               if (importedProfile.administrativeDistrict) setAdministrativeDistrict(importedProfile.administrativeDistrict);

               alert("تم استيراد البيانات من النسخة الاحتياطية بنجاح! يرجى النقر على زر 'حفظ التغييرات' لتثبيتها.");
            } else {
               alert("صيغة الملف غير متوافقة مع منصة تمكين.");
            }
         } catch (err) {
            console.error("Import error:", err);
            alert("فشل استيراد الملف. تأكد من أنه ملف JSON صحيح.");
         }
      };
      reader.readAsText(file);
   };

   return (
      <SmartSectionProvider>
         <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in" dir="rtl">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-inner">
                        <Settings size={32} className="text-white animate-spin-slow" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h1 className="text-2xl md:text-3xl font-black">إعدادات الحساب والملف البيداغوجي</h1>
                           <span className="bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                              تعديل شامل
                           </span>
                        </div>
                        <p className="text-emerald-100 text-xs md:text-sm font-bold mt-1">
                           تعديل بياناتك المهنية من الألف إلى الياء، وتغيير الطور والمادة والمؤسسة والولاية
                        </p>
                     </div>
                  </div>

                  {/* Tamkeen ID Badge */}
                  {tamkeenId && (
                     <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 self-start md:self-auto">
                        <div className="text-right">
                           <span className="text-[10px] text-emerald-200 block font-bold">معرف تمكين الرقمي</span>
                           <span className="font-mono text-xs font-black tracking-wider text-white">{tamkeenId}</span>
                        </div>
                        <button
                           onClick={copyTamkeenId}
                           className="p-2 hover:bg-white/20 rounded-xl transition-all"
                           title="نسخ المعرف"
                        >
                           {copiedId ? <CheckCheck size={16} className="text-emerald-300" /> : <Copy size={16} />}
                        </button>
                     </div>
                  )}
               </div>
            </div>

            {/* Quick Global Collapse */}
            <div className="flex justify-between items-center px-2">
               <GlobalCollapseControl />
               <span className="text-xs font-bold text-slate-400">جميع الحقول قابلة للتعديل والحفظ الفوري</span>
            </div>

            {/* Main Settings Body */}
            <div className="space-y-6">

               {/* ======================================================== */}
               {/* 1. SCHOOL LEVEL (الطور التعليمي - من الألف إلى الياء)     */}
               {/* ======================================================== */}
               <SmartSection title="1. الطور والمرحلة التعليمية (تصحيح وتغيير الطور)" sectionKey="settings-level" defaultOpen={true}>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 space-y-5">
                     <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                           <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">
                              هل أخطأت في اختيار الطور التعليمي أثناء التسجيل؟
                           </h4>
                           <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                              يمكنك هنا التبديل بين الطور الابتدائي، المتوسط، والثانوي بحرية تامة. سيتم تلقائياً تحيين التدرجات السنوية والشهرية، وبنك الدروس، والمواد في الكراس اليومي وباقي أركان المنصة.
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Primary Card */}
                        <button
                           type="button"
                           onClick={() => setLevel('PRIMARY')}
                           className={cn(
                              "p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 group text-center relative overflow-hidden",
                              level === 'PRIMARY'
                                 ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20 scale-[1.02]"
                                 : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-700 dark:text-slate-200"
                           )}
                        >
                           <div className={cn(
                              "p-3 rounded-2xl transition-transform group-hover:scale-110",
                              level === 'PRIMARY' ? "bg-white/20 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                           )}>
                              <School size={28} />
                           </div>
                           <div>
                              <h4 className="font-black text-base">الطور الابتدائي</h4>
                              <p className={cn("text-[11px] mt-1 font-bold", level === 'PRIMARY' ? "text-emerald-100" : "text-slate-400")}>
                                 السنوات: 1AP إلى 5AP (معلم فصل / تخصص)
                              </p>
                           </div>
                           {level === 'PRIMARY' && (
                              <span className="absolute top-3 left-3 bg-white text-emerald-700 p-1 rounded-full shadow">
                                 <Check size={14} />
                              </span>
                           )}
                        </button>

                        {/* Middle Card */}
                        <button
                           type="button"
                           onClick={() => setLevel('MIDDLE')}
                           className={cn(
                              "p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 group text-center relative overflow-hidden",
                              level === 'MIDDLE'
                                 ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20 scale-[1.02]"
                                 : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-200"
                           )}
                        >
                           <div className={cn(
                              "p-3 rounded-2xl transition-transform group-hover:scale-110",
                              level === 'MIDDLE' ? "bg-white/20 text-white" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                           )}>
                              <Building size={28} />
                           </div>
                           <div>
                              <h4 className="font-black text-base">الطور المتوسط</h4>
                              <p className={cn("text-[11px] mt-1 font-bold", level === 'MIDDLE' ? "text-indigo-100" : "text-slate-400")}>
                                 السنوات: 1AM إلى 4AM (شهادة BEM)
                              </p>
                           </div>
                           {level === 'MIDDLE' && (
                              <span className="absolute top-3 left-3 bg-white text-indigo-700 p-1 rounded-full shadow">
                                 <Check size={14} />
                              </span>
                           )}
                        </button>

                        {/* Secondary Card */}
                        <button
                           type="button"
                           onClick={() => setLevel('SECONDARY')}
                           className={cn(
                              "p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 group text-center relative overflow-hidden",
                              level === 'SECONDARY' || level === 'HIGH'
                                 ? "bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20 scale-[1.02]"
                                 : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-300 text-slate-700 dark:text-slate-200"
                           )}
                        >
                           <div className={cn(
                              "p-3 rounded-2xl transition-transform group-hover:scale-110",
                              level === 'SECONDARY' || level === 'HIGH' ? "bg-white/20 text-white" : "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                           )}>
                              <GraduationCap size={28} />
                           </div>
                           <div>
                              <h4 className="font-black text-base">الطور الثانوي</h4>
                              <p className={cn("text-[11px] mt-1 font-bold", level === 'SECONDARY' || level === 'HIGH' ? "text-teal-100" : "text-slate-400")}>
                                 السنوات: 1AS، 2AS، 3AS (شهادة البكالوريا)
                              </p>
                           </div>
                           {(level === 'SECONDARY' || level === 'HIGH') && (
                              <span className="absolute top-3 left-3 bg-white text-teal-700 p-1 rounded-full shadow">
                                 <Check size={14} />
                              </span>
                           )}
                        </button>
                     </div>
                  </div>
               </SmartSection>

               {/* ======================================================== */}
               {/* 2. TEACHING SUBJECT (مادة التدريس والتخصص)               */}
               {/* ======================================================== */}
               <SmartSection title="2. مادة التخصص والتدريس" sectionKey="settings-subject" defaultOpen={true}>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 space-y-4">
                     <div>
                        <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                           اختر مادة التدريس المناسبة لـ ({level === 'PRIMARY' ? 'الطور الابتدائي' : level === 'MIDDLE' ? 'الطور المتوسط' : 'الطور الثانوي'}):
                        </label>
                        <select
                           value={teachingSubject}
                           onChange={e => setTeachingSubject(e.target.value)}
                           className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                        >
                           {getSubjectListForLevel(level).map(sub => (
                              <option key={sub.value} value={sub.value}>
                                 {sub.label}
                              </option>
                           ))}
                        </select>
                     </div>

                     {teachingSubject === 'CUSTOM' && (
                        <div className="animate-in fade-in space-y-2">
                           <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                              اكتب اسم مادة التخصص بدقة:
                           </label>
                           <input
                              type="text"
                              value={customSubject}
                              onChange={e => setCustomSubject(e.target.value)}
                              placeholder="مثال: الفلسفة، الهندسة الطبية، الاقتصاد الجزئي..."
                              className="w-full p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-indigo-200 dark:border-indigo-800 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                        </div>
                     )}
                  </div>
               </SmartSection>

               {/* ======================================================== */}
               {/* 3. PERSONAL & PROFESSIONAL INFO (البيانات الشخصية)       */}
               {/* ======================================================== */}
               <SmartSection title="3. البيانات الشخصية والهوية المهنية" sectionKey="settings-personal" defaultOpen={true}>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              الاسم واللقب الكامل للأستاذ(ة)
                           </label>
                           <div className="relative">
                              <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                 type="text"
                                 value={name}
                                 onChange={e => setName(e.target.value)}
                                 placeholder="مثال: ذ. عبد الرحمن بوزيان"
                                 className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              البريد الإلكتروني
                           </label>
                           <div className="relative">
                              <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                 type="email"
                                 value={email}
                                 onChange={e => setEmail(e.target.value)}
                                 placeholder="prof@tamkeen.dz"
                                 className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm dir-ltr text-right"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              رقم الهاتف المحمول
                           </label>
                           <div className="relative">
                              <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                 type="tel"
                                 value={phone}
                                 onChange={e => setPhone(e.target.value)}
                                 placeholder="05XXXXXXXX أو 06XXXXXXXX"
                                 className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              رقم التعريف الوطني (NIN) / رقم التسجيل المهني
                           </label>
                           <div className="relative">
                              <ShieldCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                 type="text"
                                 value={nationalId}
                                 onChange={e => setNationalId(e.target.value)}
                                 placeholder="18 رقماً أو رقم بطاقة المهنة"
                                 className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </SmartSection>

               {/* ======================================================== */}
               {/* 4. INSTITUTION & WILAYA (المؤسسة والإدارة)                */}
               {/* ======================================================== */}
               <SmartSection title="4. المؤسسة التربوية والولاية والإدارة" sectionKey="settings-institution" defaultOpen={true}>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              اسم المؤسسة التعليمية
                           </label>
                           <div className="relative">
                              <Building size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                 type="text"
                                 value={institution}
                                 onChange={e => setInstitution(e.target.value)}
                                 placeholder="مثال: ثانوية الأمير عبد القادر / متوسطة الشهداء"
                                 className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              الولاية (58 ولاية جزائرية)
                           </label>
                           <div className="relative">
                              <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <select
                                 value={wilaya}
                                 onChange={e => {
                                    setWilaya(e.target.value);
                                    const match = wildayas.find(w => w.id === e.target.value || w.code === e.target.value);
                                    if (match) setProvince(match.ar_name);
                                 }}
                                 className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                              >
                                 {wildayas.map(w => (
                                    <option key={w.id} value={w.id}>
                                       {w.code} - ولاية {w.ar_name} ({w.name})
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              المقاطعة التفتيشية البيداغوجية
                           </label>
                           <input
                              type="text"
                              value={pedagogicalDistrict}
                              onChange={e => setPedagogicalDistrict(e.target.value)}
                              placeholder="مثال: مفتشية اللغة العربية للتعليم الثانوي - المقاطعة 02"
                              className="w-full p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                           />
                        </div>

                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              الدائرة الإدارية / مديرية التربية
                           </label>
                           <input
                              type="text"
                              value={administrativeDistrict}
                              onChange={e => setAdministrativeDistrict(e.target.value)}
                              placeholder="مثال: مديرية التربية لولاية سطيف"
                              className="w-full p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                           />
                        </div>

                        <div className="md:col-span-2">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">
                              السنة الدراسية
                           </label>
                           <input
                              type="text"
                              value={academicYear}
                              onChange={e => setAcademicYear(e.target.value)}
                              placeholder="مثال: 2024/2025"
                              className="w-full p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-center"
                           />
                        </div>
                     </div>
                  </div>
               </SmartSection>

               {/* ======================================================== */}
               {/* 5. WORK PREFERENCES & GRADES (نظام العمل والأفواج)       */}
               {/* ======================================================== */}
               <SmartSection title="5. نظام العمل، الأفواج المسندة، والطباعة" sectionKey="settings-preferences" defaultOpen={true}>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">نظام الدوام بالمؤسسة</label>
                           <select
                              value={preferredShift}
                              onChange={e => setPreferredShift(e.target.value as ShiftType)}
                              className="w-full p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                           >
                              <option value="FULL">دوام كامل (صباح + مساء)</option>
                              <option value="PARTIAL">نظام الدوامين</option>
                              <option value="SINGLE">دوام واحد</option>
                           </select>
                        </div>

                        <div>
                           <label className="text-xs font-black text-slate-500 dark:text-slate-300 block mb-2">لغة التدريس الأساسية</label>
                           <select
                              value={teachingLanguage}
                              onChange={e => setTeachingLanguage(e.target.value as TeachingLanguage)}
                              className="w-full p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                           >
                              <option value="ar">اللغة العربية (رسمية)</option>
                              <option value="fr">اللغة الفرنسية</option>
                              <option value="en">اللغة الإنجليزية</option>
                           </select>
                        </div>
                     </div>

                     {/* Ministry Logo Toggle */}
                     <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                              <FileText size={20} />
                           </div>
                           <div>
                              <h4 className="font-black text-sm text-slate-900 dark:text-white">إظهار شعار وترويسة وزارة التربية الوطنية</h4>
                              <p className="text-xs text-slate-400">طباعة الترويسة الرسمية للجمهورية الجزائرية على الكراس اليومي والتوزيعات</p>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={() => setShowMinistryLogo(!showMinistryLogo)}
                           className={cn(
                              "w-12 h-7 rounded-full transition-colors relative",
                              showMinistryLogo ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
                           )}
                        >
                           <div className={cn(
                              "absolute top-1 w-5 h-5 bg-white rounded-full transition-all",
                              showMinistryLogo ? "left-1" : "left-6"
                           )}></div>
                        </button>
                     </div>

                     {/* Assigned Grades/Classes */}
                     <div className="space-y-3 pt-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-300 block">
                           الأقسام والأفواج التربوية المسندة إليك:
                        </label>

                        {/* Preset quick buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                           <span className="text-[10px] text-slate-400 font-bold">اقتراحات سريعة لطورك:</span>
                           {getPresetGrades(level).map(pg => (
                              <button
                                 key={pg}
                                 type="button"
                                 onClick={() => togglePresetGrade(pg)}
                                 className={cn(
                                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                                    grades.includes(pg)
                                       ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                       : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                                 )}
                              >
                                 {grades.includes(pg) ? `✓ ${pg}` : `+ ${pg}`}
                              </button>
                           ))}
                        </div>

                        {/* Active Grades Chips */}
                        <div className="flex flex-wrap items-center gap-2 min-h-[44px] p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                           {grades.length > 0 ? (
                              grades.map(g => (
                                 <span
                                    key={g}
                                    className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-2"
                                 >
                                    <span>{g}</span>
                                    <button
                                       type="button"
                                       onClick={() => handleRemoveGrade(g)}
                                       className="hover:text-rose-500 transition-colors"
                                       title="حذف الفوج"
                                    >
                                       <X size={14} />
                                    </button>
                                 </span>
                              ))
                           ) : (
                              <span className="text-xs text-slate-400 font-bold">لم تقم بإضافة أقسام بعد، يمكنك اختيار أحد الاقتراحات أعلاه أو كتابة قسم جديد.</span>
                           )}
                        </div>

                        {/* Custom Grade Input */}
                        <div className="flex gap-2">
                           <input
                              type="text"
                              value={newGradeInput}
                              onChange={e => setNewGradeInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomGrade(); } }}
                              placeholder="أدخل اسماً مخصصاً لقسم أو فوج (مثال: 3 ع ت 1)..."
                              className="flex-1 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                           />
                           <Button
                              type="button"
                              onClick={handleAddCustomGrade}
                              variant="secondary"
                              size="sm"
                              className="rounded-xl px-4 font-black"
                              leftIcon={<Plus size={16} />}
                           >
                              إضافة قسم
                           </Button>
                        </div>
                     </div>
                  </div>
               </SmartSection>

               {/* ======================================================== */}
               {/* 6. APPEARANCE & AI KEY (المظهر والذكاء الاصطناعي)         */}
               {/* ======================================================== */}
               <SmartSection title="6. المظهر والوضع الليلي ومفتاح الذكاء الاصطناعي" sectionKey="settings-appearance" defaultOpen={true}>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 space-y-4">
                     {/* Dark Mode Toggle */}
                     <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                           <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                              {darkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500" />}
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 dark:text-white">الوضع الليلي (المظهر الداكن)</h3>
                              <p className="text-xs text-slate-400">توفير إضاءة مريحة للعينين أثناء التحضير الليلي</p>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={() => setDarkMode(!darkMode)}
                           className={cn(
                              "w-12 h-7 rounded-full transition-colors relative",
                              darkMode ? "bg-indigo-600" : "bg-slate-300"
                           )}
                        >
                           <div className={cn(
                              "absolute top-1 w-5 h-5 bg-white rounded-full transition-all",
                              darkMode ? "left-1" : "left-6"
                           )}></div>
                        </button>
                     </div>

                     {/* Gemini Key */}
                     <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                           <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                              <Key size={18} className="text-amber-500" />
                              مفتاح Gemini API (اختياري للسحاب، المحرك المحلي يعمل بدونه مجاناً)
                           </h3>
                           <a
                              href="https://aistudio.google.com"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-black text-indigo-600 hover:underline"
                           >
                              الحصول على مفتاح مجاني من Google
                           </a>
                        </div>
                        <div className="flex gap-2">
                           <div className="relative flex-1">
                              <input
                                 type={showKey ? 'text' : 'password'}
                                 placeholder="AIza..."
                                 className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white font-mono text-sm"
                                 value={geminiKey}
                                 onChange={e => setGeminiKey(e.target.value)}
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowKey(!showKey)}
                                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                              >
                                 {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                           </div>
                           <button
                              type="button"
                              onClick={saveGeminiKey}
                              className={cn(
                                 "px-5 py-3 rounded-xl font-bold text-sm transition-all text-white",
                                 keySaved ? "bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
                              )}
                           >
                              {keySaved ? <Check size={18} /> : 'حفظ المفتاح'}
                           </button>
                        </div>
                     </div>
                  </div>
               </SmartSection>

               {/* ======================================================== */}
               {/* 7. BACKUP & EXPORT/IMPORT (النسخ الاحتياطي والاستيراد)   */}
               {/* ======================================================== */}
               <SmartSection title="7. إدارة النسخ الاحتياطي للبيانات (تصدير واسترجاع)" sectionKey="settings-backup" defaultOpen={false}>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 space-y-4">
                     <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        يمكنك حفظ نسخة احتياطية كاملة من ملفك الشخصي وإعداداتك، أو استيرادها على جهاز حاسوب آخر بكل سهولة وأمان دون فقدان أي معلومة.
                     </p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                           type="button"
                           onClick={handleExportData}
                           className="p-4 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-blue-700 dark:text-blue-400 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm"
                        >
                           <Download size={18} />
                           <span>تصدير نسخة احتياطية (ملف JSON)</span>
                        </button>

                        <button
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                           className="p-4 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm"
                        >
                           <Upload size={18} />
                           <span>استيراد واسترجاع من ملف احتياطي</span>
                        </button>
                        <input
                           type="file"
                           ref={fileInputRef}
                           onChange={handleImportData}
                           accept=".json"
                           className="hidden"
                        />
                     </div>
                  </div>
               </SmartSection>

               {/* ======================================================== */}
               {/* STICKY SAVE BUTTON (حفظ التعديلات الشاملة)                */}
               {/* ======================================================== */}
               <div className="sticky bottom-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-[2.2rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                     <Info size={16} className="text-emerald-600 flex-shrink-0" />
                     <span>عند الحفظ يتم تطبيق كافة التغييرات على السجل السحابي والمحلي فوراً.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                     {saved && (
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                           <CheckCircle2 size={16} />
                           تم حفظ التعديلات والطور بنجاح!
                        </span>
                     )}
                     <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        className="w-full sm:w-auto px-10 py-3.5 rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 text-white text-base shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
                        leftIcon={<Save size={20} />}
                     >
                        حفظ كافة التغييرات والبيانات
                     </Button>
                  </div>
               </div>

            </div>
         </div>
      </SmartSectionProvider>
   );
}
