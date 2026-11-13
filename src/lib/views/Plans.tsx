import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Layers, 
  Download, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap, 
  FileText, 
  Filter,
  Bookmark,
  CalendarDays,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { TeacherProfile } from '../../types';
import { useNavigate } from 'react-router-dom';
import { 
  OFFICIAL_SYLLABUS_DISTRIBUTIONS, 
  SyllabusDistribution, 
  MonthDistributionItem, 
  WeekDistributionItem 
} from '../../data/secondaryCurriculumDistributions';

export default function PlansView({ profile, lang, type }: { profile: TeacherProfile; lang?: string; type?: string }) {
  const navigate = useNavigate();

  // Selected distribution
  const [selectedDistId, setSelectedDistId] = useState<string>(OFFICIAL_SYLLABUS_DISTRIBUTIONS[0].id);
  const [activeTrimester, setActiveTrimester] = useState<1 | 2 | 3 | 'all'>('all');
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Active distribution object
  const currentDist: SyllabusDistribution = useMemo(() => {
    return OFFICIAL_SYLLABUS_DISTRIBUTIONS.find(d => d.id === selectedDistId) || OFFICIAL_SYLLABUS_DISTRIBUTIONS[0];
  }, [selectedDistId]);

  // Filtered trimesters
  const displayedTrimesters = useMemo(() => {
    if (activeTrimester === 'all') return currentDist.trimesters;
    return currentDist.trimesters.filter(t => t.trimester === activeTrimester);
  }, [currentDist, activeTrimester]);

  // Fast redirect to SmartMemo with pre-filled lesson data
  const handleGenerateMemoForWeek = (week: WeekDistributionItem) => {
    const params = new URLSearchParams({
      grade: currentDist.grade,
      stream: currentDist.stream,
      unit: week.unitTitle,
      topic: week.literaryText,
      activity: 'أدب ونصوص'
    });
    navigate(`/mothakira-thakiya?${params.toString()}`);
  };

  // Export PDF (Annual or Monthly)
  const handleExportPDF = async (scope: 'annual' | 'monthly' = 'annual', monthId?: string) => {
    setIsExporting(true);
    try {
      const { exportSyllabusDistributionToPDF } = await import('../utils/pdfGenerator');
      await exportSyllabusDistributionToPDF(profile, currentDist, activeTrimester, scope, monthId);
    } catch (err: any) {
      console.error(err);
      alert('حدث خطأ أثناء إعداد وتصدير ملف التوزيع: ' + (err.message || 'يرجى المحاولة مجدداً'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 font-['Cairo'] pb-32 animate-in" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#1b4332] text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b-8 border-emerald-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
              <CalendarDays size={32} className="text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black italic tracking-tighter">التوزيع السنوي والشهري للمنهاج</h1>
                <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow">
                  تدرجات 2024/2025 الرسمية
                </span>
              </div>
              <p className="text-emerald-200/70 font-bold text-xs mt-1">
                الخطة البيداغوجية السنوية والشهرية المعتمدة لوزارة التربية الوطنية (الجيل الثاني — المقاربة بالكفاءات)
              </p>
            </div>
          </div>

          {/* Branch Badges (Baaqoon Style) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[11px] text-emerald-200 font-black ml-1 flex items-center gap-1">
              <Layers size={13} /> فروع المنهاج المعتمدة:
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-emerald-900/60 text-emerald-200 font-black border border-emerald-700/60">
              📖 الأدب والنصوص
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-emerald-900/60 text-emerald-200 font-black border border-emerald-700/60">
              📌 قواعد اللغة والإعراب
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-emerald-900/60 text-emerald-200 font-black border border-emerald-700/60">
              ⚖️ البلاغة والعروض
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-emerald-900/60 text-emerald-200 font-black border border-emerald-700/60">
              🔍 المطالعة والنص التواصلي
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-emerald-900/60 text-emerald-200 font-black border border-emerald-700/60">
              ✍️ الوضعية الإدماجية النقدية
            </span>
          </div>
        </div>

        {/* View Mode & Export Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-emerald-950/70 p-1.5 rounded-2xl border border-emerald-800/60">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                viewMode === 'monthly' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Calendar size={14} /> التوزيع الشهري
            </button>
            <button
              onClick={() => setViewMode('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                viewMode === 'annual' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Layers size={14} /> التوزيع السنوي الشامل
            </button>
          </div>

          <button
            onClick={() => navigate('/resources?tab=guides')}
            className="bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 hover:text-white px-4 py-3 rounded-2xl font-black text-xs border border-emerald-700/60 transition-all flex items-center gap-2 shadow-md"
            title="الانتقال إلى بنك الأدلة والمناهج والتشريع المدرسي"
          >
            <BookOpen size={16} className="text-amber-300" />
            الأدلة والمناهج الرسمية
          </button>

          <button
            onClick={() => handleExportPDF('annual')}
            disabled={isExporting}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
            title="تصدير وثيقة التوزيع السنوي الشامل لجميع الفصول الثلاثة (PDF)"
          >
            <Download size={15} />
            {isExporting ? 'جاري التحضير...' : 'تصدير سنوي شامل (PDF)'}
          </button>

          <button
            onClick={() => handleExportPDF('monthly')}
            disabled={isExporting}
            className="bg-white hover:bg-emerald-50 text-slate-900 px-4 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 border border-emerald-200"
            title="تصدير التوزيع الشهري الرسمي (PDF)"
          >
            <Download size={15} className="text-emerald-700" />
            {isExporting ? 'جاري التحضير...' : 'تصدير شهري (PDF)'}
          </button>
        </div>
      </div>

      {/* Filter and Selection Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Stream Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
            <GraduationCap size={16} className="text-emerald-600" />
            المستوى والشعبة المعتمدة:
          </label>
          <select
            value={selectedDistId}
            onChange={(e) => setSelectedDistId(e.target.value)}
            className="w-full sm:w-auto min-w-[320px] p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white cursor-pointer"
          >
            {OFFICIAL_SYLLABUS_DISTRIBUTIONS.map(dist => (
              <option key={dist.id} value={dist.id}>
                {dist.grade} — {dist.stream} ({dist.weeklyHours} سا/أسبوعياً)
              </option>
            ))}
          </select>
        </div>

        {/* Trimester Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTrimester('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
              activeTrimester === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            كامل السنة (3 فصول)
          </button>
          <button
            onClick={() => setActiveTrimester(1)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
              activeTrimester === 1
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            الفصل 1 (سبتمبر — ديسمبر)
          </button>
          <button
            onClick={() => setActiveTrimester(2)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
              activeTrimester === 2
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            الفصل 2 (جانفي — مارس)
          </button>
          <button
            onClick={() => setActiveTrimester(3)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
              activeTrimester === 3
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            الفصل 3 (أفريل — جوان)
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="بحث في الدروس والمحاور..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
          />
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'monthly' ? (
        /* Monthly Card Flow (Baaqoon Style) */
        <div className="space-y-8">
          {displayedTrimesters.map(trim => (
            <div key={trim.trimester} className="space-y-4">
              {/* Trimester Header */}
              <div className="flex items-center justify-between border-b-2 border-emerald-600/40 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse"></div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {trim.title} ({trim.monthsRange})
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  الحجم الساعي: {trim.hoursCount} ساعة • {trim.weeksCount} أسبوعاً
                </span>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {trim.months.map(month => {
                  const filteredWeeks = month.weeks.filter(w => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      w.unitTitle.toLowerCase().includes(q) ||
                      w.literaryText.toLowerCase().includes(q) ||
                      w.grammar.toLowerCase().includes(q) ||
                      (w.rhetoricOrProsody && w.rhetoricOrProsody.toLowerCase().includes(q))
                    );
                  });

                  if (searchQuery && filteredWeeks.length === 0) return null;

                  return (
                    <div 
                      key={month.id}
                      className={`p-6 rounded-[2.5rem] border shadow-sm space-y-4 transition-all ${
                        month.isExamPeriod
                          ? 'bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200 dark:border-amber-800/60'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {/* Month Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${month.isExamPeriod ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                            <Calendar size={18} />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                              شهر {month.monthNameAr}
                            </h3>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {month.weeksCount} أسابيع تدريسية
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleExportPDF('monthly', month.id)}
                            disabled={isExporting}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1.5 rounded-xl font-black text-[11px] border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-1.5 shadow-sm"
                            title={`تصدير وثيقة شهر ${month.monthNameAr} بصيغة PDF`}
                          >
                            <Download size={13} />
                            تصدير شهر {month.monthNameAr} (PDF)
                          </button>

                          {month.isExamPeriod && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-black px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                              <Sparkles size={11} /> {month.examTitle || 'فترة تقويم واختبارات'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Branch Summary Pills */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
                          <p className="font-black text-emerald-700 dark:text-emerald-400 text-[10px] flex items-center gap-1">
                            📖 النصوص والأدب:
                          </p>
                          <ul className="list-disc list-inside text-[10px] text-slate-600 dark:text-slate-300 space-y-0.5">
                            {month.branchSummary.literature.slice(0, 2).map((l, i) => (
                              <li key={i} className="truncate">{l}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
                          <p className="font-black text-indigo-700 dark:text-indigo-400 text-[10px] flex items-center gap-1">
                            📌 قواعد اللغة:
                          </p>
                          <ul className="list-disc list-inside text-[10px] text-slate-600 dark:text-slate-300 space-y-0.5">
                            {month.branchSummary.grammar.slice(0, 2).map((g, i) => (
                              <li key={i} className="truncate">{g}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Detailed Weeks Accordion/List */}
                      <div className="space-y-3 pt-1">
                        {filteredWeeks.map(week => (
                          <div 
                            key={week.weekNumber}
                            className={`p-4 rounded-2xl border transition-all ${
                              week.isExamPeriod
                                ? 'bg-amber-100/40 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
                                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                              <div className="flex items-center gap-2">
                                <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                                  الأسبوع {week.weekNumber}
                                </span>
                                <h4 className="font-black text-xs text-slate-800 dark:text-white">
                                  {week.unitTitle}
                                </h4>
                              </div>

                              <button
                                onClick={() => handleGenerateMemoForWeek(week)}
                                className="bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white px-2.5 py-1 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 border border-emerald-300 dark:border-emerald-700 shrink-0"
                                title="توليد المذكرة البيداغوجية الرسمية لهذا الدرس"
                              >
                                <Zap size={12} /> توليد المذكرة
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[11px] leading-relaxed">
                              <div>
                                <p className="text-slate-500 font-bold text-[10px]">النص الأدبي / المحور:</p>
                                <p className="font-black text-slate-800 dark:text-slate-100">{week.literaryText}</p>
                              </div>

                              <div>
                                <p className="text-slate-500 font-bold text-[10px]">قواعد اللغة والإعراب:</p>
                                <p className="font-bold text-indigo-700 dark:text-indigo-300">{week.grammar}</p>
                              </div>

                              {week.rhetoricOrProsody && (
                                <div>
                                  <p className="text-slate-500 font-bold text-[10px]">البلاغة والعروض:</p>
                                  <p className="font-bold text-violet-700 dark:text-violet-300">{week.rhetoricOrProsody}</p>
                                </div>
                              )}

                              <div>
                                <p className="text-slate-500 font-bold text-[10px]">التعبير والوضعية الإدماجية:</p>
                                <p className="font-bold text-amber-700 dark:text-amber-300">{week.writingOrIntegration}</p>
                              </div>
                            </div>

                            {week.notes && (
                              <p className="mt-2 text-[10px] bg-white dark:bg-slate-900 p-2 rounded-xl text-slate-500 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-800">
                                💡 {week.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Annual Grid Table View (Official Ministry Inspection Standard) */
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">
                جدول التوزيع السنوي الرسمي — {currentDist.grade} ({currentDist.stream})
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                العام الدراسي: {currentDist.academicYear} • الحجم الساعي الأسبوعي: {currentDist.weeklyHours} ساعات • الإجمالي السنوي: {currentDist.totalAnnualHours} ساعة
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-slate-300 text-xs">
              <thead className="bg-[#1b4332] text-white text-[11px] font-black">
                <tr>
                  <th className="border border-slate-300 p-2.5 w-[5%] text-center">الأسبوع</th>
                  <th className="border border-slate-300 p-2.5 w-[8%] text-center">الشهر</th>
                  <th className="border border-slate-300 p-2.5 w-[18%]">الوحدة والمحور الأدبي</th>
                  <th className="border border-slate-300 p-2.5 w-[20%]">النص الأدبي والقراءة</th>
                  <th className="border border-slate-300 p-2.5 w-[16%]">قواعد اللغة والإعراب</th>
                  <th className="border border-slate-300 p-2.5 w-[15%]">البلاغة والعروض</th>
                  <th className="border border-slate-300 p-2.5 w-[18%]">الوضعية الإدماجية والإنتاج</th>
                </tr>
              </thead>
              <tbody>
                {displayedTrimesters.flatMap(trim => 
                  trim.months.flatMap(month => 
                    month.weeks.map(week => (
                      <tr 
                        key={week.weekNumber}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          week.isExamPeriod ? 'bg-amber-50/80 dark:bg-amber-950/20 font-bold' : ''
                        }`}
                      >
                        <td className="border border-slate-300 p-2 text-center font-black bg-slate-50 dark:bg-slate-800">
                          {week.weekNumber}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-bold">
                          {week.monthNameAr}
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900 dark:text-slate-100">
                          {week.unitTitle}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-800 dark:text-slate-200">
                          {week.literaryText}
                        </td>
                        <td className="border border-slate-300 p-2 text-indigo-800 dark:text-indigo-300 font-bold">
                          {week.grammar}
                        </td>
                        <td className="border border-slate-300 p-2 text-violet-800 dark:text-violet-300">
                          {week.rhetoricOrProsody || '—'}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700 dark:text-slate-300">
                          {week.writingOrIntegration}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Official Footer Signatures for Inspection */}
          <div className="mt-8 flex justify-between px-8 pt-6 border-t-2 border-dashed border-slate-300 text-xs font-black">
            <div className="text-center space-y-8">
              <p>توقيع وختم الأستاذ(ة)</p>
              <p className="text-slate-400 font-normal">........................</p>
            </div>
            <div className="text-center space-y-8">
              <p>تأشيرة وختم السيد مدير المؤسسة</p>
              <p className="text-slate-400 font-normal">........................</p>
            </div>
            <div className="text-center space-y-8">
              <p>تأشيرة مفتش التربية الوطنية لمقاطعة اللغة العربية</p>
              <p className="text-slate-400 font-normal">........................</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
