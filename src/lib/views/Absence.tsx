
import React, { useState, useEffect, useRef } from 'react';
import { TeacherProfile, Student } from '../../types';
import {
  UserCheck, Calendar, Save, Download, Search,
  CheckCircle2, XCircle, Clock, AlertCircle, Filter, Loader2, Upload, FileUp
} from 'lucide-react';
import * as XLSX from 'xlsx';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface Props {
  profile: TeacherProfile;
  lang?: string;
}

export default function AbsenceView({ profile }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeGrade = profile?.grades && profile.grades.length > 0 ? profile.grades[0] : 'default';
  const activeGroup = profile?.selectedGroup || 'default';

  // --- Local Storage Keys ---
  const getRegistryKey = () => `students_registry_${profile.tamkeenId}_${activeGrade}_${activeGroup}`;
  const getAttendanceKey = () => `attendance_${profile.tamkeenId}_${selectedDate}`;

  // --- Load Data ---
  useEffect(() => {
    // Load Students
    const savedStudents = localStorage.getItem(getRegistryKey());
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      setStudents([]);
    }

    // Load Attendance for selected date
    const savedAttendance = localStorage.getItem(getAttendanceKey());
    if (savedAttendance) {
      setAttendanceMap(JSON.parse(savedAttendance));
    } else {
      setAttendanceMap({});
    }
  }, [profile.tamkeenId, activeGrade, activeGroup, selectedDate]);

  const toggleStatus = (studentId: string) => {
    const statusOrder: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
    setAttendanceMap(prev => {
      const current = prev[studentId] || 'PRESENT';
      const nextIndex = (statusOrder.indexOf(current) + 1) % statusOrder.length;
      return { ...prev, [studentId]: statusOrder[nextIndex] };
    });
  };

  const getStatusIcon = (status: AttendanceStatus = 'PRESENT') => {
    switch (status) {
      case 'PRESENT': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'ABSENT': return <XCircle className="text-rose-500" size={20} />;
      case 'LATE': return <Clock className="text-amber-500" size={20} />;
      case 'EXCUSED': return <AlertCircle className="text-blue-500" size={20} />;
      default: return <CheckCircle2 className="text-emerald-500" size={20} />;
    }
  };

  const getStatusLabel = (status: AttendanceStatus = 'PRESENT') => {
    switch (status) {
      case 'PRESENT': return 'حاضر';
      case 'ABSENT': return 'غائب';
      case 'LATE': return 'متأخر';
      case 'EXCUSED': return 'مبرر';
      default: return 'حاضر';
    }
  };

  const getStatusColor = (status: AttendanceStatus = 'PRESENT') => {
    switch (status) {
      case 'PRESENT': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'ABSENT': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
      case 'LATE': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'EXCUSED': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(getAttendanceKey(), JSON.stringify(attendanceMap));
      // Simulate network delay
      setTimeout(() => {
        alert('تم حفظ الغياب بنجاح محلياً');
        setIsSaving(false);
      }, 500);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء الحفظ');
      setIsSaving(false);
    }
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
            id: `std_${activeGrade}_${activeGroup}_${index}_${Date.now()}`,
            registrationNumber: (index + 1).toString(),
            lastName: ln,
            firstName: fn,
            name: `${ln} ${fn}`,
            level: profile.level,
            grade: activeGrade,
            group: activeGroup,
            isAbsent: false
          };
        });

        // Save imported students to both state and local storage
        setStudents(importedStudents);
        localStorage.setItem(getRegistryKey(), JSON.stringify(importedStudents));

        alert(`✅ تم استيراد ${importedStudents.length} تلميذ بنجاح!`);
      } catch (err) {
        console.error(err);
        alert('خطأ في الاستيراد.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExportExcel = () => {
    if (students.length === 0) return alert('⚠️ القائمة فارغة.');

    const dataToExport = students.map((s, i) => ({
      'رقم': i + 1,
      'رقم التسجيل': s.registrationNumber,
      'اللقب': s.lastName,
      'الاسم': s.firstName,
      'القسم': s.grade,
      'الفوج': s.group,
      'التاريخ': selectedDate,
      'الحالة': getStatusLabel(attendanceMap[s.id])
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // RTL Setup
    ws['!rtl'] = true;
    ws['!cols'] = [{ wch: 6 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];

    const wb = XLSX.utils.book_new();
    if (!wb.Workbook) wb.Workbook = {};
    if (!wb.Workbook.Views) wb.Workbook.Views = [];
    wb.Workbook.Views[0] = { RTL: true };

    XLSX.utils.book_append_sheet(wb, ws, "الغياب");
    XLSX.writeFile(wb, `غياب_${activeGrade}_${selectedDate}.xlsx`);
  };

  const stats = {
    present: Object.values(attendanceMap).filter(s => s === 'PRESENT').length,
    absent: Object.values(attendanceMap).filter(s => s === 'ABSENT').length,
    late: Object.values(attendanceMap).filter(s => s === 'LATE').length,
    excused: Object.values(attendanceMap).filter(s => s === 'EXCUSED').length,
  };

  const filteredStudents = students.filter(s =>
    (s.name || '').includes(searchTerm) || (s.registrationNumber || '').includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1 flex items-center gap-2">
            <UserCheck className="text-emerald-500" />
            رصد الغياب اليومي
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {activeGrade} - الفوج {activeGroup}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 dark:text-white"
            />
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx,.xls" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {isImporting ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
            <span className="hidden sm:inline">استيراد قائمة</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">تصدير</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>حفظ القائمة</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">الحضور</p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{stats.present}</p>
          </div>
          <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-xl"><CheckCircle2 className="text-emerald-600 dark:text-emerald-300" size={20} /></div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">الغياب</p>
            <p className="text-2xl font-black text-rose-700 dark:text-rose-300">{stats.absent}</p>
          </div>
          <div className="p-2 bg-rose-100 dark:bg-rose-800 rounded-xl"><XCircle className="text-rose-600 dark:text-rose-300" size={20} /></div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">التأخر</p>
            <p className="text-2xl font-black text-amber-700 dark:text-amber-300">{stats.late}</p>
          </div>
          <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-xl"><Clock className="text-amber-600 dark:text-amber-300" size={20} /></div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">مبرر</p>
            <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{stats.excused}</p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-xl"><AlertCircle className="text-blue-600 dark:text-blue-300" size={20} /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 rounded-3xl overflow-hidden flex items-center justify-center bg-white/50 dark:bg-black/50">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
          </div>
        )}

        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="بحث عن تلميذ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-700 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <Filter size={18} />
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <Upload size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">الرقم</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">التلميذ</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">القسم</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase text-center">حالة الحضور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const status = attendanceMap[student.id] || 'PRESENT';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer" onClick={() => toggleStatus(student.id)}>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-400">{student.registrationNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            {(student.firstName || student.name || '?').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">{student.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                          {student.grade} - {student.group}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            className={`min-w-[100px] flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all ${getStatusColor(status)}`}
                          >
                            {getStatusIcon(status)}
                            {getStatusLabel(status)}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold">
                    {students.length === 0 ? 'يرجى استيراد قائمة التلاميذ للبدء' : 'لا يوجد تلاميذ مطابقين للبحث'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
