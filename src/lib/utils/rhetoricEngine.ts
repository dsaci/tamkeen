/**
 * ============================================================================
 * 🧠 المحرك البلاغي الذكي (Smart Rhetoric Analysis Engine)
 * الإصدار 1.0 - منصة تمكين
 * محرك هجين يجمع بين القواعد المعجمية والتحليل الأسلوبي الدقيق
 * متوافق مع مناهج التعليم الجزائري (متوسط، ثانوي، بكالوريا)
 * ============================================================================
 */

import type {
  RhetoricCategory,
  RhetoricLevel,
  RhetoricScope,
  RhetoricDetail,
  RhetoricFinding,
  RhetoricAnalysisResult
} from '../../data/rhetoricRulesDB.ts';
import { RHETORIC_CONCEPTS_MAP } from '../../data/rhetoricRulesDB.ts';

// ─── بنك المتضادات الشائعة لكشف الطباق والمقابلة ───
const ANTONYMS_PAIRS: Array<[string, string]> = [
  ['الليل', 'النهار'],
  ['ليل', 'نهار'],
  ['الموت', 'الحياة'],
  ['موت', 'حياة'],
  ['يموت', 'يحيا'],
  ['مات', 'عاش'],
  ['الحق', 'الباطل'],
  ['حق', 'باطل'],
  ['الظلمات', 'النور'],
  ['ظلمات', 'نور'],
  ['الظلام', 'الضياء'],
  ['ظلام', 'نور'],
  ['العلم', 'الجهل'],
  ['علم', 'جهل'],
  ['يعلم', 'يجهل'],
  ['يعلمون', 'لا يعلمون'],
  ['الخير', 'الشر'],
  ['خير', 'شر'],
  ['الصدق', 'الكذب'],
  ['صدق', 'كذب'],
  ['أضحك', 'أبكى'],
  ['يضحك', 'يبكي'],
  ['قليلاً', 'كثيراً'],
  ['قليل', 'كثير'],
  ['أول', 'آخر'],
  ['الأول', 'الآخر'],
  ['الظاهر', 'الباطن'],
  ['سراً', 'جهراً'],
  ['السر', 'العلن'],
  ['الهدى', 'الضلال'],
  ['هدى', 'ضلالة'],
  ['يحل', 'يحرم'],
  ['الطيبات', 'الخبائث'],
  ['أعطى', 'بخل'],
  ['اتقى', 'استغنى'],
  ['اليسرى', 'العسرى'],
  ['طاب', 'خبث'],
  ['حلو', 'مر'],
  ['العدل', 'الظلم'],
  ['عز', 'ذل'],
  ['العز', 'الذل'],
  ['قريب', 'بعيد'],
  ['القريب', 'البعيد']
];

// ─── أدوات التشبيه الصريحة ───
const TASHBEEH_PARTICLES = ['كَأَنَّ', 'كَأَنَّمَا', 'مِثْلَ', 'مِثْلُ', 'مِثْلِ', 'شَبِيهُ', 'يُشْبِهُ', 'تُشْبِهُ', 'كَمَا'];

// ─── أفعال واستعارات شائعة للتشخيص والتجسيم ───
const METAPHOR_COLLOCATIONS: Array<{
  actionRegex: RegExp;
  label: string;
  mushabbahBih: string;
  type: string;
  effect: string;
}> = [
  {
    actionRegex: /(ابتسم|تبسم|ضحك|استبشر)\s+(الصباح|الفجر|الأمل|المستقبل|الدهر|الزمان|الربيع)/i,
    label: 'استعارة مكنية (تشخيص)',
    mushabbahBih: 'إنسان يبتسم أو يضحك',
    type: 'makniya',
    effect: 'التشخيص وإضفاء الحيوية والمشاعر الإنسانية على المعاني المجردة ومظاهر الطبيعة.'
  },
  {
    actionRegex: /(بكى|دمعت|ناحت|اشتكت|صرخت)\s+(السماء|الأرض|الديار|الأطلال|الأيام|الرياح)/i,
    label: 'استعارة مكنية (تشخيص)',
    mushabbahBih: 'إنسان يبكي ويتألم',
    type: 'makniya',
    effect: 'تشخيص الطبيعة والجماد ومشاركتها الوجدانية لأحزان الإنسان.'
  },
  {
    actionRegex: /(طار|يحلق|أجنحة)\s+(الخبر|الشوق|الفرح|الخوف|الكلام)/i,
    label: 'استعارة مكنية (تجسيم)',
    mushabbahBih: 'طائر له أجنحة يطير بها',
    type: 'makniya',
    effect: 'تجسيم المعنى المعنوي في صورة طائر سريع الحركة لبيان شدة الانتشار أو التأثر.'
  },
  {
    actionRegex: /(اشْتَعَلَ|يشتعل|تشتعل)\s+(الرَّأْسُ|الرأس|الشيب|الغضب|الحرب|القلب)/i,
    label: 'استعارة مكنية بليغة',
    mushabbahBih: 'وقود أو نار سريعة الاشتعال والانتشار',
    type: 'makniya',
    effect: 'تصوير سرعة الشيب أو الغضب وشموله للمكان كالنار المتأججة.'
  },
  {
    actionRegex: /(نطق|صرخ|هتف|أفصح)\s+(الحق|التاريخ|الواقع|الضمير|الواجب)/i,
    label: 'استعارة مكنية (تشخيص)',
    mushabbahBih: 'شخص ناطق يشهد ويفصح عن الحقيقة',
    type: 'makniya',
    effect: 'إبراز قوة الحق وسلطانه المعنوي كشاهد حي لا يمكن إنكاره.'
  },
  {
    actionRegex: /(نام|غفا|استيقظ|صحا)\s+(التاريخ|الدهر|العدل|الضمير)/i,
    label: 'استعارة مكنية (تشخيص)',
    mushabbahBih: 'كائن حي ينام ويصحو',
    type: 'makniya',
    effect: 'إبراز حالة الغفلة أو اليقظة الوجدانية بأسلوب تشخيصي مؤثر.'
  }
];

/**
 * تنظيف النص مع الاحتفاظ بمواقع الرموز
 */
export const stripTashkeel = (text: string): string => {
  return text.replace(/[\u064B-\u0652\u0670]/g, '');
};

/**
 * حساب مواضع الـ Span داخل النص الأصلي بدقة
 */
export const findTextSpan = (fullText: string, subStr: string): { start: number; end: number; quote: string } => {
  const normFull = stripTashkeel(fullText);
  const normSub = stripTashkeel(subStr.trim());

  let idx = fullText.indexOf(subStr.trim());
  if (idx !== -1) {
    return {
      start: idx,
      end: idx + subStr.trim().length,
      quote: subStr.trim()
    };
  }

  // البحث بالنسخة المجردة من التشكيل
  idx = normFull.indexOf(normSub);
  if (idx !== -1) {
    // التقريب على النص الأصلي
    const start = Math.min(idx, fullText.length - 1);
    const end = Math.min(idx + normSub.length + 3, fullText.length);
    return {
      start,
      end,
      quote: fullText.slice(start, end).trim() || subStr.trim()
    };
  }

  return {
    start: 0,
    end: Math.min(fullText.length, subStr.length),
    quote: subStr.trim()
  };
};

/**
 * محرك القواعد والاستدلال البلاغي المحلي (Deterministic Rule Engine)
 */
export const analyzeRhetoricLocally = (
  text: string,
  scope: RhetoricScope = 'all',
  level: RhetoricLevel = 'secondary',
  detail: RhetoricDetail = 'detailed'
): RhetoricAnalysisResult => {
  const findings: RhetoricFinding[] = [];
  const clean = text.trim();
  const stripped = stripTashkeel(clean);

  if (!clean) {
    return {
      analysisId: 'empty-' + Date.now(),
      timestamp: new Date().toISOString(),
      originalText: text,
      scope,
      level,
      detail,
      summary: {
        textTypeEstimate: 'نص فارغ',
        totalFindings: 0,
        bayaanCount: 0,
        badiCount: 0,
        maaniCount: 0,
        usloobiCount: 0,
        ambiguousCount: 0
      },
      findings: [],
      warnings: ['لم يتم إدخال أي نص للتحليل.'],
      pedagogicalAdvice: ['يرجى كتابة أو لصق نص أدبي أو بيت شعري لبدء الفحص البلاغي.'],
      engineUsed: 'local_rule_engine'
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. فحص علم البديع (طباق، مقابلة، جناس، سجع، تصريع)
  // ══════════════════════════════════════════════════════════════════════════
  if (scope === 'all' || scope === 'badi') {
    // أ. كشف المقابلة والطباق
    const words = stripped.split(/[\s,،؛;.؟!\-]+/).filter(Boolean);
    const foundAntonyms: Array<{ w1: string; w2: string; pair: [string, string] }> = [];

    for (const [w1, w2] of ANTONYMS_PAIRS) {
      const idx1 = words.findIndex(w => w === w1 || w === 'و' + w1 || (w.length >= 4 && w.includes(w1)));
      const idx2 = words.findIndex(w => w === w2 || w === 'و' + w2 || (w.length >= 4 && w.includes(w2)));

      // يجب أن يكونا كلمتين منفصلتين في موضعين مختلفين
      if (idx1 !== -1 && idx2 !== -1 && idx1 !== idx2) {
        foundAntonyms.push({ w1, w2, pair: [w1, w2] });
      }
    }

    // إذا وجد زوجان متضادان أو أكثر مرتبين ➔ مقابلة
    if (foundAntonyms.length >= 2) {
      const quote = clean.slice(0, Math.min(clean.length, 120));
      const span = findTextSpan(clean, quote);
      findings.push({
        id: 'finding-muqabala-' + findings.length,
        category: 'badi',
        categoryLabel: 'علم البديع (محسن معنوي)',
        family: 'muqabala',
        type: 'tarkib',
        label: 'مقابلة بلاغية',
        span,
        explanation: `ورد في العبارة التوافق بين أكثر من معنى ثم ما يقابلها على التوالي: (${foundAntonyms.map(a => `${a.w1} ضد ${a.w2}`).join('، ')}).`,
        evidence: foundAntonyms.map(a => `${a.w1} ↔ ${a.w2}`),
        elements: {
          'الطرف الأول': foundAntonyms.map(a => a.w1).join(' و '),
          'الطرف المقابل': foundAntonyms.map(a => a.w2).join(' و ')
        },
        effect: level === 'elementary'
          ? 'توضح المعنى وتبرز الفرق بين الأمرين بشكل جميل.'
          : 'تأكيد المعنى وتعميقه بإبراز التناظر الهندسي بين المعاني المتضادة وإثارة فكر القارئ.',
        educationalNote: 'الفرق بين الطباق والمقابلة: الطباق يقع بين لفظين مفردين فقط، أما المقابلة فتقع بين جملتين أو تركيبين فأكثر على الترتيب.',
        confidence: { level: 'high', reason: 'وجود أزواج تضاد معجمية صريحة متعددة داخل سياق موحد.' },
        status: 'certain'
      });
    } else if (foundAntonyms.length === 1) {
      // طباق إيجاب
      const a = foundAntonyms[0];
      const span = findTextSpan(clean, `${a.w1}`);
      findings.push({
        id: 'finding-tibaaq-' + findings.length,
        category: 'badi',
        categoryLabel: 'علم البديع (محسن معنوي)',
        family: 'tibaaq',
        type: 'ijab',
        label: 'طباق إيجاب',
        span,
        explanation: `الجمع بين لفظين متضادين في سياق واحد: (${a.w1}) و (${a.w2}) وهما مثبتان غير منفيين.`,
        evidence: [`${a.w1} ↔ ${a.w2}`],
        elements: {
          'اللفظ الأول': a.w1,
          'اللفظ المضاد': a.w2,
          'نوع الطباق': 'إيجاب'
        },
        effect: 'تقوية المعنى وتوضيحه؛ فالأشياء بأضدادها تتميز وتتضح.',
        educationalNote: 'الطباق يبرز التضاد المفرد ولا يحتاج إلى أدوات نفي ليظل إيجاباً، وإذا دخل النفي على أحدهما صار طباق سلب.',
        confidence: { level: 'high', reason: 'تطابق معجمي مباشر لعلاقة التضاد المشهورة.' },
        status: 'certain'
      });
    }

    // طباق سلب (فعل مثبت وآخر منفي من نفس الجذر)
    const salbRegex = /(يعلم|تعلم|نحنط|يستوي|يخاف|يرضى|يقول|يفعل)\s+.*?(لا\s+\1|لم\s+\1|ما\s+\1)/i;
    const salbMatch = stripped.match(salbRegex);
    if (salbMatch) {
      const span = findTextSpan(clean, salbMatch[0]);
      findings.push({
        id: 'finding-tibaaq-salb-' + findings.length,
        category: 'badi',
        categoryLabel: 'علم البديع (محسن معنوي)',
        family: 'tibaaq',
        type: 'salb',
        label: 'طباق سلب',
        span,
        explanation: `الجمع بين فعل ومثيله المنفي بأداة نفي: (${salbMatch[0]}).`,
        evidence: [salbMatch[0]],
        elements: {
          'المثبت': salbMatch[1],
          'المنفي': salbMatch[2] || 'النفي المقترن به',
          'نوع الطباق': 'سلب'
        },
        effect: 'إبراز المفارقة الحاسمة بين الفعل ونقيضه وتنبيه الذهن إلى ثبوت الحكم أو انتفائه.',
        confidence: { level: 'high', reason: 'اشتقاق الفعل نفسه في صورة الإثبات ثم النفي الصريح.' },
        status: 'certain'
      });
    }

    // ب. التصريع (في الشعر)
    if (clean.includes('...') || clean.includes('//') || clean.includes('\n')) {
      const parts = clean.split(/\.\.\.|\/\/|\n/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const last1 = stripTashkeel(parts[0]).replace(/[.،!؟\s]+$/, '').slice(-1);
        const last2 = stripTashkeel(parts[1]).replace(/[.،!؟\s]+$/, '').slice(-1);
        if (last1 && last2 && last1 === last2) {
          findings.push({
            id: 'finding-tasree-' + findings.length,
            category: 'badi',
            categoryLabel: 'علم البديع (محسن لفظي)',
            family: 'tasree',
            type: 'matla',
            label: 'تصريع في مطلع البيت',
            span: findTextSpan(clean, `${parts[0].slice(-10)} ... ${parts[1].slice(-10)}`),
            explanation: `اتفاق نهاية الشطر الأول (العروض: ${parts[0].slice(-8)}) مع نهاية الشطر الثاني (الضرب: ${parts[1].slice(-8)}) في الحرف الأخير وهو [حرف الروي: ${last1}].`,
            evidence: [`روي متماثل: [${last1}]`],
            elements: {
              'عروض الشطر الأول': parts[0].slice(-12),
              'ضرب الشطر الثاني': parts[1].slice(-12),
              'حرف الروي': last1
            },
            effect: 'إحداث جرس موسيقي أخّاذ في مطلع القصيدة يشد انتباه المتلقي إلى إيقاع البحر والقافية.',
            educationalNote: 'التصريع خاص بالشعر وفي مطلع القصيدة، أما اتفاق الفواصل في النثر فيسمى سجعاً.',
            confidence: { level: 'high', reason: 'اتفاق حرفي وصوتي صريح في نهايتي الشطرين.' },
            status: 'certain'
          });
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. فحص علم المعاني (القصر، الإنشاء الطلبي، التوكيد)
  // ══════════════════════════════════════════════════════════════════════════
  if (scope === 'all' || scope === 'maani') {
    // أ. أسلوب القصر بـ (إنما)
    const innamaMatch = clean.match(/(إِنَّمَا|انما|إنما)\s+([^.،!؟]+)/);
    if (innamaMatch) {
      const quote = innamaMatch[0].trim();
      findings.push({
        id: 'finding-qasr-innama-' + findings.length,
        category: 'maani',
        categoryLabel: 'علم المعاني (الأساليب والتراكيب)',
        family: 'qasr',
        type: 'innama',
        label: 'أسلوب قصر وتوكيد بـ (إنّما)',
        span: findTextSpan(clean, quote),
        explanation: `تخصيص الحكم وحصره بواسطة أداة القصر المشهورة (إنّما)، حيث يكون المقصور عليه هو المؤخر في الكلام.`,
        evidence: [innamaMatch[1]],
        elements: {
          'أداة القصر': 'إنّما (إنّ المكفوفة بـ ما)',
          'الجملة المحصورة': quote
        },
        effect: 'تأكيد المعنى، تخصيص الحكم ونفي التردد والشك عنه في نفس السامع.',
        educationalNote: 'القصر بـ (إنما) يجعل المقصور عليه دائماً هو الجزء الأخير المتأخر في التركيب.',
        confidence: { level: 'high', reason: 'استعمال حرف الحصر والقصر البلاغي المشهور (إنما).' },
        status: 'certain'
      });
    }

    // ب. القصر بـ النفي والاستثناء (ما ... إلا / لا ... إلا / ليس ... سوى)
    const nafyIstithnaaMatch = clean.match(/(مَا|لا|لَنْ|لَمْ|لَيْسَ|ليس)\s+([^.،!؟]+?)\s+(إِلَّا|إلا|سِوَى|سوى|غَيْرَ|غير)\s+([^.،!؟]+)/);
    if (nafyIstithnaaMatch) {
      const quote = nafyIstithnaaMatch[0].trim();
      findings.push({
        id: 'finding-qasr-nafy-' + findings.length,
        category: 'maani',
        categoryLabel: 'علم المعاني (الأساليب والتراكيب)',
        family: 'qasr',
        type: 'nafy_istithnaa',
        label: 'أسلوب قصر بـ (النفي والاستثناء)',
        span: findTextSpan(clean, quote),
        explanation: `قصر الحكم وتأكيده باجتماع النفي (${nafyIstithnaaMatch[1]}) والاستثناء (${nafyIstithnaaMatch[3]})؛ وهو من أبلغ طرق القصر في العربية.`,
        evidence: [`${nafyIstithnaaMatch[1]} ... ${nafyIstithnaaMatch[3]}`],
        elements: {
          'أداة النفي': nafyIstithnaaMatch[1],
          'أداة الاستثناء': nafyIstithnaaMatch[3],
          'المقصور': nafyIstithnaaMatch[2].trim(),
          'المقصور عليه': nafyIstithnaaMatch[4].trim()
        },
        effect: 'قصر الصفة على الموصوف أو الموصوف على الصفة مع توكيد الحكم ونفي ما عداه بصورة قطعية.',
        confidence: { level: 'high', reason: 'اقتران أداتي النفي والاستثناء المعتمدتين بلاغياً.' },
        status: 'certain'
      });
    }

    // ج. الإنشاء الطلبي (النداء، الاستفهام، الأمر، النهي)
    // النداء
    const nidaaMatch = clean.match(/(يَا|أَيَا|هَيَا|أَيْ)\s+([^\s،,.!؟]+(\s+[^\s،,.!؟]+)?)/);
    if (nidaaMatch) {
      const quote = nidaaMatch[0].trim();
      findings.push({
        id: 'finding-insha-nidaa-' + findings.length,
        category: 'maani',
        categoryLabel: 'علم المعاني (الإنشاء الطلبي)',
        family: 'insha_talabi',
        type: 'nidaa',
        label: 'أسلوب إنشائي طلبي (نداء)',
        span: findTextSpan(clean, quote),
        explanation: `استعمال أداة النداء (${nidaaMatch[1]}) لتوجيه الخطاب واستدعاء إقبال المخاطب، وخروجه لأغراض بلاغية حسب السياق (كالتعظيم، أو التنبيه، أو التحسر).`,
        evidence: [nidaaMatch[1]],
        elements: {
          'أداة النداء': nidaaMatch[1],
          'المنادى': nidaaMatch[2]
        },
        effect: 'توجيه الانتباه، وتحريك ذهن السامع، والتعبير عن الشحنة العاطفية للمتكلم.',
        confidence: { level: 'high', reason: 'صيغة نداء واضحة بأداة النداء الصريحة.' },
        status: 'certain'
      });
    }

    // الاستفهام
    const istifhamMatch = clean.match(/(هَلْ|أَ|مَنْ|مَاذَا|لِمَاذَا|كَيْفَ|أَيْنَ|مَتَى)\s+([^.؟!\n]+[؟?])/);
    if (istifhamMatch) {
      const quote = istifhamMatch[0].trim();
      findings.push({
        id: 'finding-insha-istifham-' + findings.length,
        category: 'maani',
        categoryLabel: 'علم المعاني (الإنشاء الطلبي)',
        family: 'insha_talabi',
        type: 'istifham',
        label: 'أسلوب إنشائي طلبي (استفهام مجازي)',
        span: findTextSpan(clean, quote),
        explanation: `طلب الفهم بأداة الاستفهام (${istifhamMatch[1]})، وقد خرج عن معناه الحقيقي إلى غرض بلاغي سياقي كالتقرير، أو التعجب، أو التوبيخ، أو الإنكار.`,
        evidence: [istifhamMatch[1]],
        elements: {
          'أداة الاستفهام': istifhamMatch[1],
          'جملة الاستفهام': quote
        },
        effect: 'إثارة الفضول، بعث الحيوية في الكلام، وحمل المخاطب على الإقرار أو التأمل.',
        confidence: { level: 'high', reason: 'جملة استفهامية صريحة مختومة بعلامة استفهام.' },
        status: 'certain'
      });
    }

    // النهي
    const nahyMatch = clean.match(/(لَا|لا)\s+(تَ[^\s،,.!؟]+|تُ[^\s،,.!؟]+)\b/);
    if (nahyMatch && !clean.includes('لا بد')) {
      const quote = nahyMatch[0].trim();
      findings.push({
        id: 'finding-insha-nahy-' + findings.length,
        category: 'maani',
        categoryLabel: 'علم المعاني (الإنشاء الطلبي)',
        family: 'insha_talabi',
        type: 'nahy',
        label: 'أسلوب إنشائي طلبي (نهي)',
        span: findTextSpan(clean, quote),
        explanation: `طلب الكف عن الفعل بصيغة المضارع المقرون بلا الناهية الجازمة (${quote})، وله أغراض بلاغية كالنصح والإرشاد، الدعاء، أو التحذير.`,
        evidence: ['لا الناهية + المضارع'],
        elements: {
          'أداة النهي': 'لا الناهية',
          'الفعل المنهي عنه': nahyMatch[2]
        },
        effect: 'الردع والتحذير أو النصح والتوجيه وإبراز حرص المتكلم.',
        confidence: { level: 'medium', reason: 'صيغة نهي صريحة (لا + فعل مضارع مبدوء بتاء المخاطب).' },
        status: 'probable'
      });
    }

    // التمني بـ ليت
    const laytaMatch = clean.match(/(لَيْتَ|ليت|يَا لَيْتَ)\s+([^\s،,.!؟]+)/);
    if (laytaMatch) {
      const quote = laytaMatch[0].trim();
      findings.push({
        id: 'finding-insha-tamanni-' + findings.length,
        category: 'maani',
        categoryLabel: 'علم المعاني (الإنشاء الطلبي)',
        family: 'insha_talabi',
        type: 'tamanni',
        label: 'أسلوب إنشائي طلبي (تمنٍّ)',
        span: findTextSpan(clean, quote),
        explanation: `طلب أمر محبوب لا يُرجى حصوله إما لكونه مستحيلاً أو غير ميسور بأداة التمني الأصلية (${laytaMatch[1]}).`,
        evidence: [laytaMatch[1]],
        elements: {
          'أداة التمني': laytaMatch[1],
          'المتمنى': laytaMatch[2]
        },
        effect: 'إبراز التحسر والشوق العميق للأمر المأمول والتأثير الوجداني في السامع.',
        confidence: { level: 'high', reason: 'استعمال أداة التمني الصريحة (ليت).' },
        status: 'certain'
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. فحص علم البيان (التشبيه والاستعارة والكناية)
  // ══════════════════════════════════════════════════════════════════════════
  if (scope === 'all' || scope === 'bayaan') {
    // أ. التشبيه (بكاف التشبيه المتصلة أو بالأدوات المستقلة)
    let matchedTashbeeh = false;

    // كاف التشبيه المتصلة (مثل: العلم كالـنور، هو كالـبحر)
    const kafRegex = /([^\s،,.!؟]+)\s+(كَ?ال[^\s،,.!؟]+)/;
    const kafMatch = clean.match(kafRegex);
    if (kafMatch && !kafMatch[2].startsWith('كل') && !kafMatch[2].startsWith('كلا')) {
      const quote = kafMatch[0].trim();
      findings.push({
        id: 'finding-tashbeeh-' + findings.length,
        category: 'bayaan',
        categoryLabel: 'علم البيان (الصور البيانية)',
        family: 'tashbeeh',
        type: 'mursal',
        label: 'تشبيه مرسل ومجمل (بكاف التشبيه)',
        span: findTextSpan(clean, quote),
        explanation: `عقد مماثلة بين المشبه (${kafMatch[1]}) والمشبه به (${kafMatch[2].replace(/^كَ?ال?/, '')}) بواسطة كاف التشبيه الجارة.`,
        evidence: ['كاف التشبيه'],
        elements: {
          'المشبه': kafMatch[1],
          'أداة التشبيه': 'الكاف',
          'المشبه به': kafMatch[2]
        },
        effect: 'تقريب المعنى وتوضيحه وتجسيم المشبه بإلحاقه بالمشبه به الأقوى في الصفة.',
        educationalNote: 'إذا ذُكرت أداة التشبيه سُمي التشبيه "مرسلاً"، وإذا حُذف وجه الشبه سُمي "مجملاً".',
        confidence: { level: 'high', reason: 'اتصال كاف التشبيه الصريحة بالمشبه به.' },
        status: 'certain'
      });
      matchedTashbeeh = true;
    }

    if (!matchedTashbeeh) {
      for (const p of TASHBEEH_PARTICLES) {
        const regex = new RegExp(`([^.،!؟]+?\\s+)?(${p})\\s+([^.،!؟]+)`, 'i');
        const m = clean.match(regex);
        if (m) {
          const quote = m[0].trim();
          findings.push({
            id: 'finding-tashbeeh-' + findings.length,
            category: 'bayaan',
            categoryLabel: 'علم البيان (الصور البيانية)',
            family: 'tashbeeh',
            type: 'mursal',
            label: 'تشبيه تمثيلي أو مرسل',
            span: findTextSpan(clean, quote),
            explanation: `عقد مماثلة ومقارنة صريحة بين طرفين بواسطة أداة التشبيه الملفوظة (${p}).`,
            evidence: [p],
            elements: {
              'المشبه': m[1]?.trim() || 'المسند إليه المقدر',
              'أداة التشبيه': p,
              'المشبه به': m[3]?.trim()?.split(/\s+/).slice(0, 3).join(' ') || 'المذكور بعد الأداة'
            },
            effect: 'تقريب المعنى، توضيحه، وإبراز صفة المشبه بجلاء في ذهن المتلقي.',
            educationalNote: 'إذا ذُكرت أداة التشبيه سُمي التشبيه "مرسلاً"، وإذا حُذفت سُمي "مؤكداً"، وإذا حُذفت الأداة ووجه الشبه معاً كان "تشبيهاً بليغاً".',
            confidence: { level: 'high', reason: `وجود أداة التشبيه الصريحة (${p}) وركني التشبيه.` },
            status: 'certain'
          });
          break;
        }
      }
    }

    // ب. الاستعارات المكنية المشهورة
    for (const meta of METAPHOR_COLLOCATIONS) {
      const m = clean.match(meta.actionRegex);
      if (m) {
        const quote = m[0].trim();
        findings.push({
          id: 'finding-istiara-' + findings.length,
          category: 'bayaan',
          categoryLabel: 'علم البيان (الصور البيانية)',
          family: 'istiara',
          type: meta.type,
          label: meta.label,
          span: findTextSpan(clean, quote),
          explanation: `شُبّه (${m[2]}) بـ (${meta.mushabbahBih})، فحُذف المشبه به ورُمز له بشيء من لوازمه وهو (${m[1]}) على سبيل الاستعارة المكنية.`,
          evidence: [m[1]],
          elements: {
            'المشبه (المستعار له)': m[2],
            'المشبه به المحذوف (المستعار منه)': meta.mushabbahBih,
            'القرينة المانعة': `إسناد فعل (${m[1]}) لغير فاعله الحقيقي`
          },
          effect: meta.effect,
          educationalNote: 'في الاستعارة المكنية يُحذف المشبه به دائماً وتبقى قرينة تدل عليه، بينما في الاستعارة التصريحية يُصرّح بلفظ المشبه به ويُحذف المشبه.',
          confidence: { level: 'high', reason: 'تركيب استعاري كلاسيكي معتمد في المنهاج الجزائري مع قرينة مانعة واضحة.' },
          status: 'certain'
        });
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // إحصائيات وتلخيص النتيجة
  // ══════════════════════════════════════════════════════════════════════════
  const bayaanCount = findings.filter(f => f.category === 'bayaan').length;
  const badiCount = findings.filter(f => f.category === 'badi').length;
  const maaniCount = findings.filter(f => f.category === 'maani').length;
  const usloobiCount = findings.filter(f => f.category === 'usloobi').length;

  const warnings: string[] = [];
  if (findings.length === 0) {
    warnings.push('لم تُكتشف ظاهرة بلاغية واضحة ومؤكدة وفق القواعد المحلية المعيارية. يمكن استخدام التحليل السحابي العميق بالذكاء الاصطناعي لفحص الصور المعقدة أو السياقات الخفية.');
  }

  const advice: string[] = [];
  if (level === 'secondary') {
    advice.push('في أسئلة البكالوريا: احرص دائماً على ذكر [نوع الصورة + أركانها + قرينتها المانعة + أثرها البلاغي] للحصول على العلامة الكاملة.');
  } else if (level === 'middle') {
    advice.push('ركّز على تمييز نوع المحسن (لفظي أو معنوي) والفرق بين الطباق والاستعارة.');
  } else if (level === 'academic') {
    advice.push('التحليل الأكاديمي يحتمل وجوهاً متعددة بحسب المدارس البلاغية (السكاكي والجرجاني وشراح التلخيص).');
  }

  return {
    analysisId: 'analysis-' + Date.now(),
    timestamp: new Date().toISOString(),
    originalText: text,
    scope,
    level,
    detail,
    summary: {
      textTypeEstimate: clean.includes('...') || clean.includes('//') ? 'بيت شعري' : 'نص نثري أدبي',
      totalFindings: findings.length,
      bayaanCount,
      badiCount,
      maaniCount,
      usloobiCount,
      ambiguousCount: findings.filter(f => f.status === 'ambiguous').length
    },
    findings,
    warnings,
    pedagogicalAdvice: advice,
    engineUsed: 'local_rule_engine'
  };
};
