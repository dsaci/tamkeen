const fs = require('fs');

const scriptContent = `
const fs = require('fs');

function makeWeek(weekNumber, monthNameAr, unitNumber, unitTitle, theme, literaryText, grammar, rhetoric, reading, writing, hours, isExam, isHoliday, holidayName, notes) {
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
    hours: hours || 3,
    isExamPeriod: !!isExam,
    isHoliday: !!isHoliday,
    holidayName: holidayName || '',
    notes: notes || ''
  };
}

// -------------------------------------------------------------
// 1. 3AS SCIENTIFIC (Already complete, let's keep it perfect)
// -------------------------------------------------------------
// ...

console.log("Generating full distributions...");
`;

fs.writeFileSync('scratch/test_gen.js', scriptContent);
console.log('Test file written');
