const fs = require('fs');

const script = `
const fs = require('fs');

function w(weekNumber, monthNameAr, unitNumber, unitTitle, theme, literaryText, grammar, rhetoric, reading, writing, hours, isExam, isHoliday, holidayName, notes) {
  return {
    weekNumber,
    monthNameAr,
    unitNumber,
    unitTitle,
    theme,
    literaryText,
    grammar,
    rhetoricOrProsody: rhetoric || '',
    guidedReadingOrCommunicative: reading || '',
    writingOrIntegration: writing,
    hours: hours,
    isExamPeriod: !!isExam,
    isHoliday: !!isHoliday,
    holidayName: holidayName || '',
    notes: notes || ''
  };
}

// Helper to calculate branchSummary automatically from weeks
function makeMonth(id, monthNameAr, monthIndex, semester, weeks, isExamPeriod, examTitle) {
  const literature = [];
  const grammar = [];
  const rhetoric = [];
  const writing = [];

  weeks.forEach(wk => {
    if (wk.literaryText && !literature.includes(wk.literaryText)) literature.push(wk.literaryText);
    if (wk.grammar && !grammar.includes(wk.grammar)) grammar.push(wk.grammar);
    if (wk.rhetoricOrProsody && !rhetoric.includes(wk.rhetoricOrProsody)) rhetoric.push(wk.rhetoricOrProsody);
    if (wk.writingOrIntegration && !writing.includes(wk.writingOrIntegration)) writing.push(wk.writingOrIntegration);
  });

  return {
    id,
    monthNameAr,
    monthIndex,
    semester,
    weeksCount: weeks.length,
    isExamPeriod: !!isExamPeriod,
    examTitle: examTitle || undefined,
    weeks,
    branchSummary: {
      literature,
      grammar,
      rhetoric,
      writing
    }
  };
}

console.log('Writing builder script...');
`;

fs.writeFileSync('scratch/build_helper.js', script);
console.log('Saved build_helper.js');
