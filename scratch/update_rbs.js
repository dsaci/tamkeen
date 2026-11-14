const fs = require('fs');
let content = fs.readFileSync('src/services/resourceBankService.ts', 'utf8');

const importStmt = "import { OFFICIAL_CURRICULUM_GUIDES, searchOfficialCurriculumGuides, getGuidesCategoriesSummary, CurriculumGuideItem } from '../data/officialCurriculumGuidesDB';\n";
if (!content.includes('officialCurriculumGuidesDB')) {
  content = content.replace("import { generateLocalMemo } from '../lib/ai/localCurriculumEngine';", "import { generateLocalMemo } from '../lib/ai/localCurriculumEngine';\n" + importStmt);
}

const helperCode = `
// ── Official Algerian Curriculum Guides & Legislation ──

export { OFFICIAL_CURRICULUM_GUIDES, searchOfficialCurriculumGuides, getGuidesCategoriesSummary };
export type { CurriculumGuideItem };
`;

if (!content.includes('Official Algerian Curriculum Guides & Legislation')) {
  content += helperCode;
}

fs.writeFileSync('src/services/resourceBankService.ts', content, 'utf8');
console.log('Updated resourceBankService.ts successfully');
