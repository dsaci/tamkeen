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
  educationalNote?: string;
  customExplanation?: string;
  customElements?: Record<string, string>;
  evidenceWords?: string[];
}> = [
  {
    // استعارة المنية والأظفار (أبو ذؤيب الهذلي)
    actionRegex: /(المنية|الموت|المنون|الدهر|الحرب)\s+(أنشبت|أنشب|عضت|عض)\s*(أظفارها|أظفار|أنيابها|أنياب|مخالبها|مخالب|نابه|نابها)?|(أنشبت|أنشب)\s+(المنية|الموت)?\s*(أظفارها|أظفار|مخالبها|مخالب)/i,
    label: 'استعارة مكنية (تجسيم / استعارة تخييلية)',
    mushabbahBih: 'حيوان مفترس كاسر (سبع ضارٍ)',
    type: 'makniya',
    customExplanation: 'شبّه الشاعر المنية (الموت) بحيوان مفترس كاسر (سبع ضارٍ)، وحذف المشبه به ورَمز إليه بشيء من لوازمه وقرائنه وهو (الأظفار والنشوب) على سبيل الاستعارة المكنية.',
    customElements: {
      'المشبه (المستعار له)': 'المنية (الموت)',
      'المشبه به المحذوف (المستعار منه)': 'حيوان مفترس كاسر (سبع ضارٍ)',
      'القرينة المانعة واللازمة': 'إثبات الأظفار والنشوب للمنية وهي ليست كائناً حياً ذا مخالب'
    },
    evidenceWords: ['أنشبت', 'أظفارها'],
    effect: 'تجسيم الموت وإبرازه في صورة وحش ضارٍ مفزع يفتك بالإنسان ولا يرحمه لبيان سطوته وشراسته واستحالة الإفلات منه.',
    educationalNote: 'هذا البيت لأبي ذؤيب الهذلي وهو الشاهد النموذجي الأشهر في البكالوريا للاستعارة المكنية، حيث حُذف المشبه به (السبع المفترس) ورُمز له بشيء من لوازمه وهو (الأظفار) وقرينتها إثبات النشوب.'
  },
  {
    // استعارة البحر المشتكى إليه (خليل مطران)
    actionRegex: /(شاك|أشكو|شكوت|يشكو)\s+(إلى\s+البحر|للبحر)/i,
    label: 'استعارة مكنية (تشخيص)',
    mushabbahBih: 'إنسان أو صديق حميم يُشتكى إليه ويشعر بالحزن',
    type: 'makniya',
    customExplanation: 'شبّه الشاعر البحر بإنسان وصديق حميم يُشتكى إليه، وحذف المشبه به ورَمز إليه بشيء من لوازمه وهو (الشكوى والاستماع) على سبيل الاستعارة المكنية.',
    customElements: {
      'المشبه (المستعار له)': 'البحر',
      'المشبه به المحذوف (المستعار منه)': 'إنسان وصديق حميم يشارك الشاعر همومه',
      'القرينة المانعة واللازمة': 'إسناد الشكوى إلى البحر، والبحر جماد لا يسمع ولا يشتكى إليه حقيقة'
    },
    evidenceWords: ['شاك إلى البحر'],
    effect: 'تشخيص البحر ومشاركته الوجدانية لآلام الشاعر وهمومه النفسية.',
    educationalNote: 'القرينة المانعة هي إسناد الشكوى والاستجابة للبحر، والبحر جماد لا يسمع ولا يشتكى إليه حقيقة.'
  },
  {
    // استعارة عضنا الدهر بنابه
    actionRegex: /(عضنا|عض|يعض)\s+(الدهر|الزمان|الموت)\s+(بنابه|بأنيابه|بأسنانه)/i,
    label: 'استعارة مكنية (تجسيم)',
    mushabbahBih: 'حيوان مفترس له ناب يفترس به',
    type: 'makniya',
    customExplanation: 'شبّه الدهر بحيوان مفترس كاسر، وحذف المشبه به ورَمز إليه بشيء من لوازمه وهو (العض والناب) على سبيل الاستعارة المكنية.',
    customElements: {
      'المشبه (المستعار له)': 'الدهر (الزمان ومصائبه)',
      'المشبه به المحذوف (المستعار منه)': 'حيوان مفترس كاسر',
      'القرينة المانعة واللازمة': 'إثبات العض والناب للدهر، والدهر ليس جسماً ذا أنياب'
    },
    evidenceWords: ['عضنا', 'بنابه'],
    effect: 'تصوير شدة مصائب الدهر وقسوة الأيام في صورة وحش ينهش ويعض بنابه.',
    educationalNote: 'حذف المشبه به (الحيوان المفترس) ورمز له بشيء من لوازمه وهو (الناب والعض).'
  },
  {
    // فم الزمان وثغره
    actionRegex: /(فم|ثغر|شفتي|لسان)\s+(الزمان|الدهر|التاريخ|المستقبل)/i,
    label: 'استعارة مكنية (تشخيص)',
    mushabbahBih: 'إنسان له فم يبتسم ويتحدث ويثني',
    type: 'makniya',
    customExplanation: 'شبّه الزمان بإنسان ناطق ذي فم وثغر، وحذف المشبه به وأبقى صفة من صفاته (الفم/الثغر) على سبيل الاستعارة المكنية.',
    customElements: {
      'المشبه (المستعار له)': 'الزمان أو التاريخ',
      'المشبه به المحذوف (المستعار منه)': 'إنسان ذو فم وبسمة ناطقة',
      'القرينة المانعة واللازمة': 'إضافة الفم أو الثغر للزمان والزمان معنى تجريدي'
    },
    evidenceWords: ['فم الزمان'],
    effect: 'إضفاء البهجة الحية على الزمان والتاريخ والابتهاج بقدوم الحدث.',
    educationalNote: 'القرينة المانعة هي إضافة الفم للزمان، والزمان ليس جسماً بشرياً.'
  },
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
    actionRegex: /(و?اشتعل|يشتعل|تشتعل)\s+(الرأس|الشيب|الغضب|الحرب|القلب)/i,
    label: 'استعارة مكنية بليغة',
    mushabbahBih: 'وقود أو نار سريعة الاشتعال والانتشار',
    type: 'makniya',
    customExplanation: 'شبّه الشيب وانتشار البياض في الرأس بالوقود والنار المتأججة، وحذف المشبه به ورَمز إليه بشيء من لوازمه وهو (الاشتعال) على سبيل الاستعارة المكنية.',
    customElements: {
      'المشبه (المستعار له)': 'الشيب / الرأس',
      'المشبه به المحذوف (المستعار منه)': 'النار سريعة الاشتعال والانتشار',
      'القرينة المانعة واللازمة': 'إسناد الاشتعال إلى الرأس والشيب'
    },
    evidenceWords: ['اشتعل', 'الرأس'],
    effect: 'تصوير سرعة انتشار الشيب وشموله للمكان كالنار المتأججة لبيان فداحة أثر التقدم في السن وتغير الحال.'
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

// ─── بنك الكنايات الكبرى المعتمدة في المناهج ───
const CURRICULUM_KINAYAH_PATTERNS: Array<{
  regex: RegExp;
  label: string;
  type: string;
  mukannaAnhu: string;
  effect: string;
  note: string;
}> = [
  {
    regex: /(كل\s+تميمة\s+لا\s+تنفع|لا\s+تنفع\s+تميمة|لم\s+تغن\s+تميمة)/i,
    label: 'كناية عن صفة (حتمية الموت)',
    type: 'sifah',
    mukannaAnhu: 'حتمية الموت واستحالة رده ودفع الأجل بالأسباب والرقى والطب',
    effect: 'الإتيان بالمعنى مصحوباً بالدليل عليه في إيجاز وتجسيم وتقرير العقيدة.',
    note: 'شاهد بيت أبي ذؤيب الهذلي: "ألفيت كل تميمة لا تنفع"، كناية عن عجز التمائم أمام القدر المحتوم.'
  },
  {
    regex: /(كثير\s+الرماد|كثيرة\s+الرماد)/i,
    label: 'كناية عن صفة (الكرم والجود)',
    type: 'sifah',
    mukannaAnhu: 'الكرم والجود وعظيم إقراء الضيوف وإطعام الطعام',
    effect: 'الإتيان بصفة الكرم مصحوبة بدليلها الحسي (كثرة إيقاد النار لطبخ الطعام للضيوف).',
    note: 'شاهد الخنساء في رثاء صخر: "طويل النجاد رفيع العماد كثير الرماد إذا ما شتا".'
  },
  {
    regex: /(طويل\s+النجاد|طويل\s+القامة)/i,
    label: 'كناية عن صفة (الشجاعة وطول القامة)',
    type: 'sifah',
    mukannaAnhu: 'طول القامة والشجاعة في حمل السيف',
    effect: 'بيان الهيبة والشجاعة عبر الملازمة بين طول حمائل السيف وطول صاحبه.',
    note: 'النجاد هو حمائل السيف، وطولها يلزم منه طول قامة حاملها وجسارته.'
  },
  {
    regex: /(رفيع\s+العماد)/i,
    label: 'كناية عن صفة (السيادة والشرف)',
    type: 'sifah',
    mukannaAnhu: 'السيادة والرفعة وعلو المنزلة بين أفراد القبيلة',
    effect: 'إبراز الشرف والمكانة الاجتماعية العالية بالأثر المادي الملموس.',
    note: 'عماد البيت هو العمود الذي يرفع الخيمة، ورفعه علامة على كبر الخيمة وقصد الضيوف لها.'
  },
  {
    regex: /(ألقى\s+عصا\s+التسيار|حط\s+رحاله)/i,
    label: 'كناية عن صفة (الاستقرار والراحة)',
    type: 'sifah',
    mukannaAnhu: 'الاستقرار وانتهاء السفر والغربة والتنقل',
    effect: 'تجسيم المعنى النفسي للاستقرار بإنهاء حركة العصا والترحال.',
    note: 'عصا التسيار كان المسافر يتوكأ عليها في رحلاته، وإلقاؤها دليل المكوث.'
  },
  {
    regex: /(يشار\s+إليه\s+بالبنان|طار\s+ذكره)/i,
    label: 'كناية عن صفة (الشهرة والرفعة)',
    type: 'sifah',
    mukannaAnhu: 'الشهرة الواسعة والذيوع والمنزلة المرموقة في المجتمع',
    effect: 'إبراز الشهرة في صورة حسية مرئية تتمثل في إشارة الأصابع إليه بالإعجاب.',
    note: 'البنان هو أطراف الأصابع.'
  },
  {
    regex: /(نقي\s+الثوب|طاهر\s+الذيل|طاهر\s+الثوب)/i,
    label: 'كناية عن صفة (العفة والنزاهة)',
    type: 'sifah',
    mukannaAnhu: 'العفة، النزاهة، الأمانة، والبراءة من الدنايا والعيوب',
    effect: 'تصوير العفة المعنوية بطهارة الثوب الحسي ونقائه من الدنس.',
    note: 'من الاستعمالات العربية الشهيرة لمدح الأخلاق الرفيعة.'
  },
  {
    regex: /(عض\s+على\s+يديه|يقلب\s+كفيه)/i,
    label: 'كناية عن صفة (الندم والحسرة)',
    type: 'sifah',
    mukannaAnhu: 'الندم الشديد والحسرة والأسف على ما فات',
    effect: 'تجسيم حالة الندم النفسي في حركة الجسد الدالة عليه.',
    note: 'شاهد قرآني: "وَيَوْمَ يَعَضُّ الظَّالِمُ عَلَى يَدَيْهِ"، و"فَأَصْبَحَ يُقَلِّبُ كَفَّيْهِ".'
  },
  {
    regex: /(ابنة\s+اليم|بنت\s+اليم)/i,
    label: 'كناية عن موصوف (السفينة)',
    type: 'mawsoof',
    mukannaAnhu: 'السفينة التي تمخر عباب البحر',
    effect: 'إبراز الموصوف بلقب شاعري رقيق يستحضر ملازمته الدائمة للبحر.',
    note: 'شاهد أحمد شوقي: "يا ابنة اليم ما أبوك بخيل ... ماله مولعاً بمنع وحبس".'
  },
  {
    regex: /(لغة\s+الضاد)/i,
    label: 'كناية عن موصوف (اللغة العربية)',
    type: 'mawsoof',
    mukannaAnhu: 'اللغة العربية الشريفة',
    effect: 'الافتخار بخصوصية اللغة العربية لأنها الوحيدة التي تميزت بنطق حرف الضاد دون سائر اللغات.',
    note: 'تسمية بلاغية شائعة جداً في المناهج والمحافل الأدبية.'
  },
  {
    regex: /(أم\s+القرى)/i,
    label: 'كناية عن موصوف (مكة المكرمة)',
    type: 'mawsoof',
    mukannaAnhu: 'مكة المكرمة زادها الله تشريفاً',
    effect: 'تعظيم الموصوف وبيان مركزيته الروحية كأصل القرى وأشرفها.',
    note: 'شاهد قرآني: "لتنذر أم القرى ومن حولها".'
  },
  {
    regex: /(أبناء\s+النيل)/i,
    label: 'كناية عن موصوف (أهل مصر)',
    type: 'mawsoof',
    mukannaAnhu: 'الشعب المصري وسكان وادي النيل',
    effect: 'ربط الهوية بالرافد الحضاري والجغرافي الطبيعي.',
    note: 'كناية موصوف شهيرة في الأدب الحديث.'
  },
  {
    regex: /(مدينة\s+الجسور\s+المعلقة)/i,
    label: 'كناية عن موصوف (قسنطينة)',
    type: 'mawsoof',
    mukannaAnhu: 'مدينة قسنطينة الجزائرية العريقة (سيرتا)',
    effect: 'إبراز الطابع المعماري الفريد والتاريخي للمدينة في أبهى حلة بلاغية.',
    note: 'كناية جزائرية أصيلة ومعتمدة في النصوص المدرسية.'
  },
  {
    regex: /(المجد\s+يمشي\s+في\s+ركابه|اليمن\s+يتبع\s+ظله)/i,
    label: 'كناية عن نسبة',
    type: 'nisbah',
    mukannaAnhu: 'نسبة المجد أو البركة واليمن إلى الممدوح بصحبته في كل مسير',
    effect: 'إثبات الصفة بنسبتها إلى ما يتصل بالموصوف من ركاب وظل وثياب.',
    note: 'الكناية عن نسبة لا تصرح بنسبة الصفة مباشرة للشخص بل لشيء ملازم له كظله أو ركابه.'
  }
];

// ─── بنك الاستعارات التصريحية والمجازات المشهورة ───
const CURRICULUM_TASRIHIYYA_PATTERNS: Array<{
  regex: RegExp;
  label: string;
  category: 'bayaan';
  family: 'istiara' | 'majaz_mursal' | 'majaz_aqli';
  type: string;
  elements: Record<string, string>;
  explanation: string;
  evidence: string[];
  effect: string;
  note: string;
}> = [
  {
    regex: /(إلى\s+البحر\s+يسعى|إلى\s+البدر\s+يرتقي)/i,
    label: 'استعارة تصريحية (في البحر أو البدر)',
    category: 'bayaan',
    family: 'istiara',
    type: 'tasrihiyya',
    elements: {
      'المشبه المحذوف': 'الممدوح (سيف الدولة الحمداني)',
      'المشبه به المصرح به': 'البحر (في الجود) أو البدر (في الرفعة)',
      'القرينة': 'يسعى إليه ويمشي في البساط'
    },
    explanation: 'شبّه الممدوح بالبحر لجوده أو بالبدر لرفعته، وحذف المشبه وصرّح بلفظ المشبه به على سبيل الاستعارة التصريحية.',
    evidence: ['يسعى في البساط'],
    effect: 'تعظيم الممدوح والمبالغة في مدحه بالكرم والرفعة.',
    note: 'بيت المتنبي الشهير: "أقبل يمشي في البساط فما درى ... إلى البحر يسعى أم إلى البدر يرتقي".'
  },
  {
    regex: /يا\s+كوكبا[ً]?\s+ما\s+كان\s+أقصر\s+عمره/i,
    label: 'استعارة تصريحية (في الكوكب)',
    category: 'bayaan',
    family: 'istiara',
    type: 'tasrihiyya',
    elements: {
      'المشبه المحذوف': 'ابن الشاعر المتوفى في مقتبل العمر',
      'المشبه به المصرح به': 'الكوكب الوضاء السريع المغيب',
      'القرينة': 'قصر عمره والنداء'
    },
    explanation: 'شبّه ابنه الصغير المتوفى بكوكب الأسحار الذي يخطف الأبصار سريعاً، وحذف المشبه وصرّح بالمشبه به على سبيل الاستعارة التصريحية.',
    evidence: ['أقصر عمره'],
    effect: 'إبراز رقة الفقيد وجماله وفداحة الفقد وسرعة زواله.',
    note: 'شاهد ابن الرومي في رثاء ابنه الأوسط محمد.'
  },
  {
    regex: /أمطرت\s+لؤلؤا[ً]?/i,
    label: 'استعارة تصريحية بديعة',
    category: 'bayaan',
    family: 'istiara',
    type: 'tasrihiyya',
    elements: {
      'المشبه المحذوف': 'الدموع',
      'المشبه به المصرح به': 'اللؤلؤ النقي',
      'القرينة': 'أمطرت من نرجس وسقت ورداً'
    },
    explanation: 'شبّه دموع الحبيبة بحبات اللؤلؤ الصافية، وحذف المشبه وصرّح بالمشبه به.',
    evidence: ['أمطرت'],
    effect: 'المبالغة في تصوير بهاء الدموع وجمال الحبيبة في مشهد وجداني ساحر.',
    note: 'شاهد الوأواء الدمشقي الجامع لخمس استعارات تصريحية في بيت واحد.'
  },
  {
    regex: /ولد\s+الهدى/i,
    label: 'استعارة تصريحية (في الهدى)',
    category: 'bayaan',
    family: 'istiara',
    type: 'tasrihiyya',
    elements: {
      'المشبه المحذوف': 'سيدنا محمد صلى الله عليه وسلم',
      'المشبه به المصرح به': 'الهدى والنور الرباني',
      'القرينة': 'ولد والضياء'
    },
    explanation: 'شبّه النبي صلى الله عليه وسلم بالهدى المتجسد، وحذف المشبه وصرّح بالمشبه به مبالغةً في دلالة رسالته على الهداية التامة.',
    evidence: ['ولد'],
    effect: 'إبراز عظمة المولد النبوي الشريف وأثره المشرق في إضاءة الكون.',
    note: 'مطلع همزية أمير الشعراء أحمد شوقي.'
  },
  {
    regex: /(من\s+الظلمات\s+إلى\s+النور)/i,
    label: 'استعارة تصريحية مزدوجة (الظلمات والنور)',
    category: 'bayaan',
    family: 'istiara',
    type: 'tasrihiyya',
    elements: {
      'المشبه المحذوف': 'الكفر والضلال (الظلمات) / الإيمان والعلم (النور)',
      'المشبه به المصرح به': 'الظلمات والنور الحسيان',
      'القرينة': 'الإخراج من وإلى في السياق الديني'
    },
    explanation: 'شبّه الكفر والضلال بالظلمات لجامع الحيرة في كل منهما، وشبّه الإيمان بالنور لجامع الاهتداء، وصرّح بالمشبه به في الموضعين.',
    evidence: ['يخرجهم من'],
    effect: 'تجسيم المعاني الروحية في صورتين حسيتين متباينتين تقربان الفارق بين الهداية والضلال.',
    note: 'شاهد قرآني متكرر: "يُخْرِجُهُم مِّنَ الظُّلُمَاتِ إِلَى النُّورِ".'
  },
  {
    regex: /(أرسل\s+عيونه|عيونا[ً]?\s+ترصد)/i,
    label: 'مجاز مرسل (علاقته الجزئية)',
    category: 'bayaan',
    family: 'majaz_mursal',
    type: 'juziyya',
    elements: {
      'اللفظ المذكور': 'العيون',
      'المعنى المقصود': 'الجواسيس أو الرقباء',
      'العلاقة': 'الجزئية (ذكر الجزء وهو العين وأراد الكل وهو الجاسوس)'
    },
    explanation: 'استعمل لفظ "العيون" وأراد الجواسيس لأن العين هي أهم آلة يستخدمها الجاسوس في الرصد والاستطلاع.',
    evidence: ['أرسل وترصد'],
    effect: 'الإيجاز وبلاغة التركيز على الحاسّة المستهدفة في المهمة.',
    note: 'من أشهر أمثلة المجاز المرسل ذي العلاقة الجزئية في المناهج المدرسية.'
  },
  {
    regex: /(شربت\s+ماء\s+النيل|شربت\s+ماء\s+زمزم)/i,
    label: 'مجاز مرسل (علاقته الكلية)',
    category: 'bayaan',
    family: 'majaz_mursal',
    type: 'kulliyya',
    elements: {
      'اللفظ المذكور': 'ماء النيل (الكل)',
      'المعنى المقصود': 'بعض ماء النيل (الجزء)',
      'العلاقة': 'الكلية (أطلق الكل وأراد الجزء)'
    },
    explanation: 'لا يمكن للإنسان أن يشرب كل ماء النهر، فذكر الكل وأراد بعضه لعلاقة الكلية مع قرينة الاستحالة العادية.',
    evidence: ['استحالة شرب ماء النيل كله'],
    effect: 'المبالغة في الارتواء والشرب والارتباط بالمكان.',
    note: 'المجاز المرسل ذو العلاقة الكلية يُذكر فيه الكل ويُراد به الجزء.'
  },
  {
    regex: /(بنى\s+الأمير\s+المدينة|بنى\s+الملك\s+القصر)/i,
    label: 'مجاز عقلي (علاقته السببية)',
    category: 'bayaan',
    family: 'majaz_aqli',
    type: 'sababiyya',
    elements: {
      'الفعل المسند': 'بنى',
      'المسند إليه الظاهر': 'الأمير أو الملك',
      'الفاعل الحقيقي': 'العمال والبناؤون',
      'العلاقة': 'السببية (الأمير كان سبباً في البناء بالأمر والتمويل)'
    },
    explanation: 'إسناد البناء إلى الأمير وهو لم يبنِ بيده بل أمر به وكان سبباً فيه، فهذا مجاز في الإسناد لا في أصل اللفظ.',
    evidence: ['الأمير لا يبني بيده مباشرة'],
    effect: 'إبراز دور الأمر والقيادة في تحقيق الإنجاز وتكثيف العبارة.',
    note: 'المجاز العقلي يقع في الإسناد والنسبة، بينما المجاز المرسل يقع في مفردات الكلمات.'
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
  const trimmedSub = subStr.trim();
  if (!trimmedSub) {
    return { start: 0, end: 0, quote: '' };
  }

  // 1. بحث مباشر أولاً
  const directIdx = fullText.indexOf(trimmedSub);
  if (directIdx !== -1) {
    return {
      start: directIdx,
      end: directIdx + trimmedSub.length,
      quote: trimmedSub
    };
  }

  // 2. خريطة مطابقة موضع الحروف بين النص المشكول وغير المشكول (Exact Diacritic-Aware Mapping)
  const normSub = stripTashkeel(trimmedSub);
  const mapNormToFull: number[] = [];
  let normFull = '';

  for (let i = 0; i < fullText.length; i++) {
    const ch = fullText[i];
    if (!/[\u064B-\u0652\u0670]/.test(ch)) {
      mapNormToFull.push(i);
      normFull += ch;
    }
  }

  const normIdx = normFull.indexOf(normSub);
  if (normIdx !== -1 && mapNormToFull[normIdx] !== undefined) {
    const fullStart = mapNormToFull[normIdx];
    const normEndIdx = normIdx + normSub.length - 1;
    let fullEnd = (mapNormToFull[normEndIdx] !== undefined ? mapNormToFull[normEndIdx] : fullStart + normSub.length - 1) + 1;

    // استيعاب أي علامات تشكيل لاحقة على آخر حرف
    while (fullEnd < fullText.length && /[\u064B-\u0652\u0670]/.test(fullText[fullEnd])) {
      fullEnd++;
    }

    return {
      start: fullStart,
      end: fullEnd,
      quote: fullText.slice(fullStart, fullEnd)
    };
  }

  return {
    start: 0,
    end: Math.min(fullText.length, trimmedSub.length),
    quote: trimmedSub
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

    // د. أسلوب الشرط البلاغي (إذا الشرطية / لو / إن)
    const shartRegex = /(إِذَا|إذا|لَوْ|لو|إِنْ|إن)\s+([^،,.!؟\n]+?)\s+(أَلْفَيْتَ|ألفيت|فَ[^\s]+|وجدت|رأيت|كان|علمت|لم|لا\s+تنفع)/i;
    const shartMatch = stripped.match(shartRegex);
    if (shartMatch) {
      const adat = shartMatch[1];
      const adatMeaning = adat.includes('إذا')
        ? 'ظرف لما يستقبل من الزمان يتضمن معنى الشرط ويفيد التحقق والثبوت واليقين الحتمي'
        : (adat.includes('لو')
          ? 'حرف امتناع لامتناع يفيد استحالة الجواب لامتناع الشرط'
          : 'حرف شرط يفيد الشك والاحتمال');

      const quote = clean.slice(shartMatch.index || 0, Math.min(clean.length, (shartMatch.index || 0) + 70)).trim();
      findings.push({
        id: 'finding-shart-' + findings.length,
        category: 'maani',
        categoryLabel: 'علم المعاني (الأساليب الشرطية والخبرية)',
        family: 'khabar',
        type: 'shart',
        label: `أسلوب شرط بلاغي (${adat})`,
        span: findTextSpan(clean, quote),
        explanation: `الربط بين جملتين برابط سببي حتمي بواسطة أداة الشرط (${adat})، وهي ${adatMeaning}.`,
        evidence: [adat],
        elements: {
          'أداة الشرط': adat,
          'دلالتها البلاغية': adatMeaning,
          'فعل الشرط وجوابه': quote
        },
        effect: 'تأكيد العلاقة السببية الحتمية بين فعل الشرط وجوابه وإلزام المخاطب بالنتيجة المنطقية والوجدانية.',
        educationalNote: 'إذا الشرطية تفيد حتمية وقوع الحدث (التحقق واليقين والقطعية)، بخلاف (إن) التي تفيد الشك، و(لو) التي تفيد الامتناع.',
        confidence: { level: 'high', reason: 'تركيب شرطي متكامل بأداة شرط صريحة وجواب شرط مقترن.' },
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
      const m = stripped.match(meta.actionRegex);
      if (m) {
        const quote = m[0].trim();
        const mushabbah = meta.customElements?.['المشبه (المستعار له)'] || (m[2] ? m[2] : m[1]);
        const lazeem = meta.customElements?.['القرينة المانعة واللازمة'] || (m[1] ? m[1] : 'القرينة السياقية');
        const explanation = meta.customExplanation || `شُبّه (${mushabbah}) بـ (${meta.mushabbahBih})، فحُذف المشبه به ورُمز له بشيء من لوازمه وهو (${lazeem}) على سبيل الاستعارة المكنية.`;
        const elements = meta.customElements || {
          'المشبه (المستعار له)': mushabbah,
          'المشبه به المحذوف (المستعار منه)': meta.mushabbahBih,
          'القرينة المانعة واللازمة': `إسناد فعل (${lazeem}) لغير فاعله الحقيقي`
        };
        const evidence = meta.evidenceWords || [lazeem];

        findings.push({
          id: 'finding-istiara-' + findings.length,
          category: 'bayaan',
          categoryLabel: 'علم البيان (الصور البيانية)',
          family: 'istiara',
          type: meta.type,
          label: meta.label,
          span: findTextSpan(clean, quote),
          explanation,
          evidence,
          elements,
          effect: meta.effect,
          educationalNote: meta.educationalNote || 'في الاستعارة المكنية يُحذف المشبه به دائماً وتبقى قرينة تدل عليه، بينما في الاستعارة التصريحية يُصرّح بلفظ المشبه به ويُحذف المشبه.',
          confidence: { level: 'high', reason: 'تركيب استعاري كلاسيكي معتمد في المنهاج الجزائري مع قرينة مانعة واضحة.' },
          status: 'certain'
        });
      }
    }

    // ج. الكنايات المنهجية الكبرى
    for (const kin of CURRICULUM_KINAYAH_PATTERNS) {
      const km = stripped.match(kin.regex);
      if (km) {
        const quote = km[0].trim();
        findings.push({
          id: 'finding-kinayah-' + findings.length,
          category: 'bayaan',
          categoryLabel: 'علم البيان (الصور البيانية)',
          family: 'kinayah',
          type: kin.type,
          label: kin.label,
          span: findTextSpan(clean, quote),
          explanation: `تعبير بلاغي أُطلق وأُريد به لازم معناه وهو (${kin.mukannaAnhu}) مع صحة إرادة المعنى الأصلي.`,
          evidence: [quote],
          elements: {
            'المكنى به (اللفظ المذكور)': quote,
            'المكنى عنه (المعنى المراد ملازمته)': kin.mukannaAnhu,
            'نوع الكناية': kin.type === 'sifah' ? 'كناية عن صفة' : (kin.type === 'mawsoof' ? 'كناية عن موصوف' : 'كناية عن نسبة')
          },
          effect: kin.effect,
          educationalNote: kin.note || 'سر جمال الكناية: الإتيان بالمعنى مصحوباً بالدليل عليه في إيجاز وتجسيم.',
          confidence: { level: 'high', reason: 'تعبير كنائي معياري معتمد في مقررات اللغة العربية والامتحانات الرسمية.' },
          status: 'certain'
        });
      }
    }

    // د. الاستعارات التصريحية والمجاز المرسل والعقلي المعتمدة
    for (const tas of CURRICULUM_TASRIHIYYA_PATTERNS) {
      const tm = stripped.match(tas.regex);
      if (tm) {
        const quote = tm[0].trim();
        findings.push({
          id: 'finding-curriculum-bayaan-' + findings.length,
          category: tas.category as 'bayaan',
          categoryLabel: tas.family === 'majaz_aqli' ? 'علم البيان (المجاز العقلي)' : (tas.family === 'majaz_mursal' ? 'علم البيان (المجاز المرسل)' : 'علم البيان (الاستعارة التصريحية)'),
          family: tas.family as any,
          type: tas.type,
          label: tas.label,
          span: findTextSpan(clean, quote),
          explanation: tas.explanation,
          evidence: tas.evidence,
          elements: tas.elements,
          effect: tas.effect,
          educationalNote: tas.note,
          confidence: { level: 'high', reason: 'شاهد بلاغي كلاسيكي مقرر في البرامج التعليمية.' },
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
