const fs = require('fs');
let code = fs.readFileSync('src/services/resourceBankService.ts', 'utf8');

// Replace imports
code = code.replace(
  /import { Resource, ResourceFile } from '\.\.\/types';/,
  `import { Resource, ResourceFile } from '../types';\nimport { findCurriculumLesson, SECONDARY_ARABIC_CURRICULUM } from '../lib/ai/secondaryArabicCurriculumData';\nimport { generateLocalMemo } from '../lib/ai/localCurriculumEngine';`
);

// In listResources, augment with local curriculum
const listNeedle = `    const { data, error } = await query;\n    if (error) {\n        console.error('[ResourceBank] List error:', error);\n        return [];\n    }\n    return (data || []) as Resource[];`;

const listReplacement = `    const { data, error } = await query;
    let results: Resource[] = [];
    if (!error && data) {
        results = data as Resource[];
    }

    // الدمج الفوري مع بنك المنهاج الثانوي المحلي المفتوح والمجاني
    const searchLower = (filters?.search || '').toLowerCase();
    const actFilter = filters?.activity;
    const localMatches = SECONDARY_ARABIC_CURRICULUM.filter(item => {
        const matchesSearch = !searchLower || item.topic.toLowerCase().includes(searchLower) || item.unitTitle.toLowerCase().includes(searchLower);
        const matchesAct = !actFilter || item.activity === actFilter;
        return matchesSearch && matchesAct;
    }).map(item => ({
        id: item.id,
        subject: 'اللغة العربية وآدابها',
        level: 'SECONDARY' as const,
        grade: item.grade,
        unit: item.unitTitle,
        activity: item.activity,
        title: item.topic,
        objective: item.competencyTarget,
        content: \`الكفاءة الختامية: \${item.competencyFinal}\\nالوضعية المشكلة: \${item.problemSituation}\\nنشاط الأستاذ: \${item.teacherActivity}\\nنشاط المتعلم: \${item.studentActivity}\\nالتقويم: \${item.evaluationFinal}\`,
        tools: item.tools,
        method: item.method,
        source: 'admin' as const,
        usage_count: 50,
        created_at: new Date().toISOString()
    }));

    // دمج النتائج وتفادي التكرار
    const seenTitles = new Set(results.map(r => r.title.toLowerCase()));
    for (const lm of localMatches) {
        if (!seenTitles.has(lm.title.toLowerCase()) && results.length < 25) {
            results.push(lm);
            seenTitles.add(lm.title.toLowerCase());
        }
    }

    return results;`;

code = code.replace(listNeedle, listReplacement);

// In smartFetchResource, add local deterministic fallback
const smartFetchNeedle = `    // Step 2: AI fallback\n    const generated = await generateAndSaveResource(params);\n    if (generated) {\n        return { resource: generated, source: 'ai' };\n    }\n\n    return { resource: null, source: 'none' };`;

const smartFetchReplacement = `    // Step 2: AI fallback (Cloud if key exists)
    const generated = await generateAndSaveResource(params);
    if (generated) {
        return { resource: generated, source: 'ai' };
    }

    // Step 3: Local Guaranteed Curriculum AI Engine (برصيد غير منتهي وبدون انقطاع)
    try {
        const localMemo = await generateLocalMemo({
            grade: params.grade,
            subject: params.subject,
            activity: params.activity,
            topic: params.title,
            unit: params.unit
        });

        const fallbackResource: Resource = {
            id: 'local-' + Date.now(),
            subject: params.subject,
            level: params.level as any,
            grade: params.grade,
            unit: params.unit,
            activity: params.activity,
            title: params.title,
            objective: localMemo.competencyTarget,
            content: \`الكفاءة: \${localMemo.competencyFinal}\\nالمؤشرات: \${localMemo.indicators.join('، ')}\\nسير التعلمات:\\n\${localMemo.steps.map(s => \`- \${s.stage}: \${s.teacherActivity}\`).join('\\n')}\`,
            tools: localMemo.tools,
            method: localMemo.steps[1]?.method || 'حوار استقرائي',
            source: 'admin',
            usage_count: 1,
            created_at: new Date().toISOString()
        };
        return { resource: fallbackResource, source: 'database' };
    } catch (e) {
        console.warn('[ResourceBank] Local engine fallback failed:', e);
    }

    return { resource: null, source: 'none' };`;

code = code.replace(smartFetchNeedle, smartFetchReplacement);

fs.writeFileSync('src/services/resourceBankService.ts', code, 'utf8');
console.log('Successfully updated src/services/resourceBankService.ts');
