const fs = require('fs');

let content = fs.readFileSync('src/lib/views/Plans.tsx', 'utf8');

// 1. Update handleExportPDF definition
const oldExportDef = `  // Export PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { exportSyllabusDistributionToPDF } = await import('../utils/pdfGenerator');
      await exportSyllabusDistributionToPDF(profile, currentDist, activeTrimester);
    } catch (err: any) {
      console.error(err);
      alert('حدث خطأ أثناء إعداد وتصدير ملف التوزيع: ' + (err.message || 'يرجى المحاولة مجدداً'));
    } finally {
      setIsExporting(false);
    }
  };`;

const newExportDef = `  // Export PDF (Annual or Monthly)
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
  };`;

// 2. Update Header Buttons
const oldButtons = `          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-white hover:bg-emerald-50 text-slate-900 px-5 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 border border-emerald-200"
          >
            <Download size={16} className="text-emerald-700" />
            {isExporting ? 'جاري تجهيز PDF...' : 'تصدير وثيقة التوزيع (PDF)'}
          </button>`;

const newButtons = `          <button
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
          </button>`;

// 3. Add month export button inside month header
const oldMonthHeader = `                      {/* Month Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className={\`p-2 rounded-xl \${month.isExamPeriod ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}\`}>
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

                        {month.isExamPeriod && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-black px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                            <Sparkles size={11} /> {month.examTitle || 'فترة تقويم واختبارات'}
                          </span>
                        )}
                      </div>`;

const newMonthHeader = `                      {/* Month Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={\`p-2 rounded-xl \${month.isExamPeriod ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}\`}>
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
                            title={\`تصدير وثيقة شهر \${month.monthNameAr} بصيغة PDF\`}
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
                      </div>`;

// Normalize CRLF
let normContent = content.replace(/\r\n/g, '\n');
normContent = normContent.replace(oldExportDef.replace(/\r\n/g, '\n'), newExportDef.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldButtons.replace(/\r\n/g, '\n'), newButtons.replace(/\r\n/g, '\n'));
normContent = normContent.replace(oldMonthHeader.replace(/\r\n/g, '\n'), newMonthHeader.replace(/\r\n/g, '\n'));

fs.writeFileSync('src/lib/views/Plans.tsx', normContent, 'utf8');
console.log('Plans.tsx updated successfully with monthly and annual export!');
