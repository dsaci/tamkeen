import React, { useState, useEffect, useRef } from 'react';
import { FileSpreadsheet, Download, FileUp, Search, Layers, ShieldCheck, Rocket, Zap, ListChecks, ClipboardList, PenTool, TrendingUp, X, CheckCircle2, Check, ChevronDown, Info, AlertTriangle, Scale, BookOpen, Users } from 'lucide-react';
import { TeacherProfile, Student, StudentScore } from '../../types';
import * as XLSX from 'xlsx';
import { TamkeenLogo } from '../../legacy_components/TamkeenLogo';

interface Props {
  profile: TeacherProfile;
}

interface ContinuousEval {
  studentId: string;
  term: 1 | 2 | 3;
  criteria: {
    behavior: number;
    attendance: number;
    tools: number;
    notebook: number;
    participation: number;
    focus: number;
    writing: number;
    homework: number;
    teamwork: number;
    initiative: number;
  }
}

const GradingView: React.FC<Props> = ({ profile }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [contEval, setContEval] = useState<ContinuousEval[]>([]);
  const [activeTerm, setActiveTerm] = useState<1 | 2 | 3>(1);
  const [showEvalModal, setShowEvalModal] = useState<string | null>(null);

  const isPrimary = profile.level === 'PRIMARY';
  const isMiddle = profile.level === 'MIDDLE';
  const isHigh = profile.level === 'HIGH';

  const isPrimaryArabic = isPrimary && profile.teachingSubject.includes('عربية');
  const isPrimaryForeign = isPrimary && (profile.teachingSubject.includes('فرنسية') || profile.teachingSubject.includes('إنجليزية'));
  const isPrimaryPE = isPrimary && profile.teachingSubject.includes('بدنية');

  const canHaveDualSubject = isMiddle && (profile.teachingSubject === 'اللغة العربية' || profile.teachingSubject === 'التاريخ والجغرافيا');
  const [activeSubject, setActiveSubject] = useState(profile.teachingSubject);

  const [activeMode, setActiveMode] = useState<'CONTINUOUS' | 'TEST' | 'EXAM' | 'ACQUISITION'>(
    isPrimary ? (isPrimaryPE ? 'CONTINUOUS' : 'EXAM') : 'TEST'
  );

  const getAvailableGrades = () => {
    if (isPrimaryArabic) return profile.grades;
    if (isPrimaryForeign) return ['3 ابتدائي', '4 ابتدائي', '5 ابتدائي'];
    if (isPrimaryPE) return ['1 ابتدائي', '2 ابتدائي', '3 ابتدائي', '4 ابتدائي', '5 ابتدائي'];
    return profile.grades;
  };

  const availableGrades = getAvailableGrades();
  const [activeGrade, setActiveGrade] = useState<string>(availableGrades[0] || '');
  const [selectedGroup, setSelectedGroup] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getRegistryKey = () => {
    const groupKey = isPrimaryArabic ? 'fixed' : selectedGroup;
    return `students_registry_${profile.tamkeenId}_${activeGrade}_${groupKey}`;
  };

  useEffect(() => {
    const storageKey = getRegistryKey();
    const savedStudents = localStorage.getItem(storageKey);
    const savedScores = localStorage.getItem(`grading_scores_${profile.tamkeenId}`);
    const savedCont = localStorage.getItem(`cont_eval_${profile.tamkeenId}`);

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    else setStudents([]);

    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedCont) setContEval(JSON.parse(savedCont));
  }, [profile.tamkeenId, activeGrade, selectedGroup, isPrimaryArabic]);

  const saveToLocal = (updatedStudents: Student[], updatedScores: StudentScore[], updatedCont?: ContinuousEval[]) => {
    localStorage.setItem(getRegistryKey(), JSON.stringify(updatedStudents));
    localStorage.setItem(`grading_scores_${profile.tamkeenId}`, JSON.stringify(updatedScores));
    if (updatedCont) localStorage.setItem(`cont_eval_${profile.tamkeenId}`, JSON.stringify(updatedCont));
  };

  const updateScore = (studentId: string, field: string, value: string | number) => {
    const existingIndex = scores.findIndex(s => s.studentId === studentId && s.term === activeTerm && s.type === activeMode);
    let newScores = [...scores];

    if (existingIndex > -1) {
      // @ts-ignore
      if (!newScores[existingIndex].scoresBySubject) newScores[existingIndex].scoresBySubject = {};
      // @ts-ignore
      newScores[existingIndex].scoresBySubject[activeSubject] = { ...newScores[existingIndex].scoresBySubject[activeSubject], [field]: value };
    } else {
      newScores.push({
        studentId,
        term: activeTerm,
        type: activeMode,
        scores: {},
        // @ts-ignore
        scoresBySubject: { [activeSubject]: { [field]: value } },
        status: 'PRESENT'
      });
    }

    setScores(newScores);
    saveToLocal(students, newScores, contEval);
  };

  const getScoreValue = (studentId: string, field: string) => {
    const scoreObj = scores.find(s => s.studentId === studentId && s.term === activeTerm && s.type === activeMode);
    // @ts-ignore
    return scoreObj?.scoresBySubject?.[activeSubject]?.[field] || '';
  };

  const getFieldsByMode = () => {
    if (isPrimary) {
      if (isPrimaryArabic) {
        if (activeMode === 'EXAM') {
          return [
            { key: 'ar_oral', label: 'تعبير وشفهي /10' },
            { key: 'ar_read', label: 'قراءة ومحفوظات /10' },
            { key: 'ar_write', label: 'إنتاج كتابي /10' },
            { key: 'ar_final', label: 'اختبار العربية /10' },
            { key: 'mt_num', label: 'أعداد وحساب /10' },
            { key: 'mt_meas', label: 'مقادير وقياس /10' },
            { key: 'mt_data', label: 'تنظيم معطيات /10' },
            { key: 'mt_geom', label: 'هندسة وفضاء /10' },
            { key: 'mt_final', label: 'اختبار الرياضيات /10' },
            { key: 'isl', label: 'إسلامية /10' },
            { key: 'sci', label: 'علمية /10' },
            { key: 'civ', label: 'مدنية /10' },
            { key: 'hg', label: 'تاريخ وجغرافيا /10' }
          ];
        } else {
          return [
            { key: 'art', label: 'ت. تشكيلية /10' },
            { key: 'music', label: 'ت. موسيقية /10' }
          ];
        }
      }
      if (isPrimaryForeign) {
        return [
          { key: 'fl_oral', label: 'تعبير وشفهي /10' },
          { key: 'fl_read', label: 'قراءة ومحفوظات /10' },
          { key: 'fl_write', label: 'إنتاج كتابي /10' },
          { key: 'fl_final', label: 'علامة الاختبار /10' }
        ];
      }
      if (isPrimaryPE) {
        return [{ key: 'pe_cont', label: 'التقويم المستمر /10' }];
      }
    }

    return [
      { key: 'cont_calculated', label: `التقويم المستمر ف${activeTerm}` },
      { key: `test${activeTerm}`, label: `الفرض ف${activeTerm}` },
      { key: `exam${activeTerm}`, label: `الاختبار ف${activeTerm}` }
    ];
  };

  const exportToExcel = () => {
    if (students.length === 0) return alert('⚠️ القائمة فارغة.');

    const fields = getFieldsByMode();
    const headers = ['الرقم', 'اللقب', 'الاسم', ...fields.map(f => f.label)];
    const dataRows = students.map((s, i) => [
      (i + 1).toString(),
      s.lastName,
      s.firstName,
      ...fields.map(f => getScoreValue(s.id, f.key) || '0')
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['الجمهورية الجزائرية الديمقراطية الشعبية'],
      ['وزارة التربية الوطنية'],
      [''],
      [`المؤسسة: ${profile.institution}`, '', '', `السنة الدراسية: ${profile.academicYear}`],
      [`الأستاذ: ${profile.name}`, '', '', `المادة: ${activeSubject}`],
      [`المستوى: ${activeGrade}`, '', '', `الفصل: ${activeTerm}`],
      [''],
      headers,
      ...dataRows
    ]);

    ws['!rtl'] = true;
    ws['!dir'] = 'rtl';
    ws['!cols'] = [{ wch: 6 }, { wch: 22 }, { wch: 22 }, ...fields.map(() => ({ wch: 18 }))];

    if (!wb.Workbook) wb.Workbook = {};
    if (!wb.Workbook.Views) wb.Workbook.Views = [];
    wb.Workbook.Views[0] = { RTL: true };

    XLSX.utils.book_append_sheet(wb, ws, 'دفتر النتائج');
    XLSX.writeFile(wb, `دفتر_تنقيط_${activeSubject}_ف${activeTerm}.xlsx`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const importedStudents: Student[] = jsonData.map((row, index) => {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              const foundKey = Object.keys(row).find(rk => rk.trim() === k);
              if (foundKey) return row[foundKey];
            }
            return '';
          };

          const ln = getVal(['اللقب', 'Nom']).toString().trim();
          const fn = getVal(['الاسم', 'Prénom']).toString().trim();

          return {
            id: `std_${activeGrade}_${isPrimaryArabic ? 'f' : selectedGroup}_${index}_${Date.now()}`,
            registrationNumber: (index + 1).toString(),
            lastName: ln,
            firstName: fn,
            name: `${ln} ${fn}`,
            level: profile.level,
            grade: activeGrade,
            group: isPrimaryArabic ? '1' : selectedGroup,
            isAbsent: false
          };
        });

        setStudents(importedStudents);
        saveToLocal(importedStudents, scores, contEval);
        alert(`✅ تم استيراد ${importedStudents.length} تلميذ بنجاح!`);
      } catch (err) {
        alert('خطأ في الاستيراد.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const updateContEval = (studentId: string, criteria: keyof ContinuousEval['criteria'], value: number) => {
    let newCont = [...contEval];
    const idx = newCont.findIndex(c => c.studentId === studentId && c.term === activeTerm);

    if (idx > -1) {
      newCont[idx].criteria[criteria] = value;
    } else {
      const entry = {
        studentId,
        term: activeTerm,
        criteria: {
          behavior: 0,
          attendance: 0,
          tools: 0,
          notebook: 0,
          participation: 0,
          focus: 0,
          writing: 0,
          homework: 0,
          teamwork: 0,
          initiative: 0
        }
      };
      // @ts-ignore
      entry.criteria[criteria] = value;
      newCont.push(entry as any);
    }

    setContEval(newCont);

    const current = newCont.find(c => c.studentId === studentId && c.term === activeTerm);
    if (current) {
      const total = Object.values(current.criteria).reduce((a, b) => a + b, 0);
      updateScore(studentId, 'cont_calculated', total);
    }
    saveToLocal(students, scores, newCont);
  };

  const getCriteriaValue = (studentId: string, key: keyof ContinuousEval['criteria']) => {
    return contEval.find(c => c.studentId === studentId && c.term === activeTerm)?.criteria[key] || 0;
  };

  return (
    <div className="space-y-6 font-['Cairo'] pb-20" dir="rtl">
      {/* دليل الاستيراد الآمن */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-dashed border-emerald-200 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm no-print">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-emerald-600 shadow-sm"><Rocket size={24} /></div>
        <div className="text-xs">
          <h4 className="font-black text-emerald-900 dark:text-emerald-400 mb-1 flex items-center gap-2">توجيه الاستيراد الآمن من الرقمنة <Zap size={14} className="fill-amber-400 text-amber-400" /></h4>
          <p className="text-emerald-800 dark:text-emerald-300 font-bold leading-relaxed italic">لتفادي حماية ملفات الوزارة: 1. افتح ملف الرقمنة الرسمي. 2. انسخ عمود اللقب والاسم. 3. الصقهم في ملف إكسل "جديد وفارغ". 4. احفظ الملف الجديد وارفعه هنا.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-all">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg"><Layers size={28} /></div>
              <div>
                <h3 className="text-2xl font-black dark:text-white">دفتر النتائج والتقويم</h3>
                <p className="text-[10px] text-emerald-600 font-black uppercase italic">{activeSubject}</p>
              </div>
            </div>

            {canHaveDualSubject && (
              <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border gap-2">
                <button onClick={() => setActiveSubject(profile.teachingSubject)} className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${activeSubject === profile.teachingSubject ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>{profile.teachingSubject}</button>
                <button onClick={() => setActiveSubject(profile.teachingSubject === 'اللغة العربية' ? 'التربية الإسلامية' : 'التربية المدنية')} className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${activeSubject !== profile.teachingSubject ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>{profile.teachingSubject === 'اللغة العربية' ? 'التربية الإسلامية' : 'التربية المدنية'}</button>
              </div>
            )}

            <div className="flex bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border gap-2">
              {availableGrades.map(grade => (
                <button key={grade} onClick={() => setActiveGrade(grade)} className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${activeGrade === grade ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-indigo-400'}`}>{grade}</button>
              ))}
            </div>
          </div>

          {!isPrimaryArabic && (
            <div className="flex items-center gap-4 bg-slate-50/50 p-6 rounded-[2.5rem] border border-dashed border-slate-200">
              <span className="text-xs font-black text-slate-500 italic">تحديد الفوج للرصد:</span>
              <div className="flex gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8'].map(num => (
                  <button key={num} onClick={() => setSelectedGroup(num)} className={`w-12 h-12 rounded-2xl font-black transition-all ${selectedGroup === num ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>{num}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0f172a] p-8 rounded-[3rem] shadow-2xl flex flex-wrap justify-between items-center gap-6 no-print">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 gap-2">
            {[1, 2, 3].map(t => (
              <button key={t} onClick={() => setActiveTerm(t as any)} className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${activeTerm === t ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>الفصل {t}</button>
            ))}
          </div>

          {isPrimaryArabic && (
            <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 gap-2">
              <button onClick={() => setActiveMode('EXAM')} className={`px-6 py-2 rounded-xl font-black text-[10px] ${activeMode === 'EXAM' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>الاختبارات</button>
              <button onClick={() => setActiveMode('CONTINUOUS')} className={`px-6 py-2 rounded-xl font-black text-[10px] ${activeMode === 'CONTINUOUS' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>التقويم المستمر</button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx,.xls" />
          <button onClick={() => fileInputRef.current?.click()} className="bg-white/10 text-white px-8 py-5 rounded-2xl font-black text-xs flex items-center gap-3">
            <FileUp size={18} /> استيراد
          </button>
          <button onClick={exportToExcel} className="bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl border-b-4 border-emerald-800 active:translate-y-1">
            <Download size={18} /> تصدير (RTL Excel)
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80">
                <th className="px-8 py-6 text-[11px] font-black text-slate-500">الرقم</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500">اللقب والاسم</th>
                <th className="px-6 py-6 text-[11px] font-black text-emerald-600 text-center">{isPrimary ? '' : 'بناء التقويم'}</th>
                {getFieldsByMode().map(f => (
                  <th key={f.key} className="px-6 py-6 text-[11px] font-black text-slate-500 text-center whitespace-nowrap">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {students.filter(s => s.name.includes(searchTerm)).map((student, idx) => (
                <tr key={student.id} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="px-8 py-5 text-xs font-black font-mono text-slate-400">{idx + 1}</td>
                  <td className="px-8 py-5 font-black text-slate-900 dark:text-white uppercase">{student.lastName} {student.firstName}</td>
                  <td className="px-6 py-5 text-center">
                    {!isPrimary ? (
                      <button onClick={() => setShowEvalModal(student.id)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                        <TrendingUp size={14} />
                      </button>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-50 mx-auto flex items-center justify-center"><Check size={14} className="text-slate-300" /></div>
                    )}
                  </td>
                  {getFieldsByMode().map(f => (
                    <td key={f.key} className="px-3 py-5 text-center">
                      <input
                        type="text"
                        value={getScoreValue(student.id, f.key)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || (/^\d*\.?\d*$/.test(val) && parseFloat(val) <= 20)) {
                            updateScore(student.id, f.key, val);
                          }
                        }}
                        className={`w-24 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-3 text-center font-black text-sm outline-none dark:text-white shadow-inner ${f.key.includes('final') || f.key.includes('exam') ? 'bg-indigo-50/50 text-indigo-700 font-bold' : ''}`}
                        placeholder="0.00"
                        readOnly={f.key === 'cont_calculated'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={20} className="py-20 text-center text-slate-300 font-black italic">يرجى استيراد قائمة التلاميذ للبدء في الرصد...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEvalModal && !isPrimary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-lg">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl"><Scale size={28} /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white italic">بناء التقويم (المراقبة المستمرة)</h3>
                  <p className="text-xs font-bold text-slate-400">تحليل المردود البيداغوجي للتلميذ - الفصل {activeTerm}</p>
                </div>
              </div>
              <button onClick={() => setShowEvalModal(null)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-rose-600 transition-all"><X size={24} /></button>
            </div>

            <div className="space-y-10">
              {/* المجموعة الأولى: الانضباط والمواظبة */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700">
                <h4 className="flex items-center gap-3 text-indigo-600 font-black mb-6 italic"><ShieldCheck size={20} /> 1. الانضباط والمواظبة (0-2 لكل معيار)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { key: 'behavior', label: 'سلوك' },
                    { key: 'attendance', label: 'غيابات وتأخرات' },
                    { key: 'tools', label: 'إحضار الأدوات' },
                    { key: 'notebook', label: 'تنظيم الكراس' }
                  ].map(crit => (
                    <div key={crit.key} className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 pr-2">{crit.label}:</label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="0.5"
                        value={getCriteriaValue(showEvalModal, crit.key as any)}
                        onChange={(e) => updateContEval(showEvalModal, crit.key as any, parseFloat(e.target.value))}
                        className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl outline-none border border-slate-100 focus:border-indigo-500 font-black text-center shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* المجموعة الثانية: المردود داخل القسم */}
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-8 rounded-[3rem] border border-emerald-100 dark:border-emerald-900/30">
                <h4 className="flex items-center gap-3 text-emerald-600 font-black mb-6 italic"><BookOpen size={20} /> 2. المردود داخل القسم (0-2 لكل معيار)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'participation', label: 'مشاركة' },
                    { key: 'focus', label: 'فعالية وحضور ذهني' },
                    { key: 'writing', label: 'إنجاز أثر كتابي' }
                  ].map(crit => (
                    <div key={crit.key} className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 pr-2">{crit.label}:</label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="0.5"
                        value={getCriteriaValue(showEvalModal, crit.key as any)}
                        onChange={(e) => updateContEval(showEvalModal, crit.key as any, parseFloat(e.target.value))}
                        className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl outline-none border border-slate-100 focus:border-emerald-500 font-black text-center shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* المجموعة الثالثة: المردود خارج القسم */}
              <div className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-[3rem] border border-amber-100 dark:border-amber-900/30">
                <h4 className="flex items-center gap-3 text-amber-600 font-black mb-6 italic"><Users size={20} /> 3. المردود خارج القسم (0-2 لكل معيار)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'homework', label: 'تحضير واجبات منزلية' },
                    { key: 'teamwork', label: 'العمل ضمن فريق' },
                    { key: 'initiative', label: 'مبادرة ومساهمة' }
                  ].map(crit => (
                    <div key={crit.key} className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 pr-2">{crit.label}:</label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="0.5"
                        value={getCriteriaValue(showEvalModal, crit.key as any)}
                        onChange={(e) => updateContEval(showEvalModal, crit.key as any, parseFloat(e.target.value))}
                        className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl outline-none border border-slate-100 focus:border-amber-500 font-black text-center shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl">
              <div className="text-white">
                <p className="text-xs font-black text-slate-400 uppercase italic">العلامة الإجمالية للتقويم المستمر:</p>
                <p className="text-4xl font-black text-emerald-400 mt-1">
                  {(Object.values(contEval.find(c => c.studentId === showEvalModal && c.term === activeTerm)?.criteria || {}).reduce((a, b) => a + b, 0)).toFixed(2)}
                  <span className="text-sm text-white">/ 20</span>
                </p>
              </div>
              <button onClick={() => setShowEvalModal(null)} className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-4 text-xl border-b-8 border-emerald-800">
                <CheckCircle2 size={24} /> اعتماد النتيجة النهائية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradingView;