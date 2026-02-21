
/**
 * نظام معالجة النصوص العربية الاحترافي لملفات PDF
 * يحل مشاكل التقطع، التداخل، وانعكاس الأرقام
 */

// خريطة الحروف العربية الكاملة (أولي، وسطي، نهائي، معزول)
const ARABIC_MAP: Record<string, string[]> = {
  '\u0621': ['\uFE80', '\uFE80', '\uFE80', '\uFE80'], // ء
  '\u0622': ['\uFE81', '\uFE82', '\uFE82', '\uFE81'], // آ
  '\u0623': ['\uFE83', '\uFE84', '\uFE84', '\uFE83'], // أ
  '\u0624': ['\uFE85', '\uFE86', '\uFE86', '\uFE85'], // ؤ
  '\u0625': ['\uFE87', '\uFE88', '\uFE88', '\uFE87'], // إ
  '\u0626': ['\uFE89', '\uFE8A', '\uFE8B', '\uFE8C'], // ئ
  '\u0627': ['\uFE8D', '\uFE8E', '\uFE8E', '\uFE8D'], // ا
  '\u0628': ['\uFE8F', '\uFE90', '\uFE91', '\uFE92'], // ب
  '\u0629': ['\uFE93', '\uFE94', '\uFE93', '\uFE93'], // ة
  '\u062A': ['\uFE95', '\uFE96', '\uFE97', '\uFE98'], // ت
  '\u062B': ['\uFE99', '\uFE9A', '\uFE9B', '\uFE9C'], // ث
  '\u062C': ['\uFE9D', '\uFE9E', '\uFE9F', '\uFEA0'], // ج
  '\u062D': ['\uFEA1', '\uFEA2', '\uFEA3', '\uFEA4'], // ح
  '\u062E': ['\uFEA5', '\uFEA6', '\uFEA7', '\uFEA8'], // خ
  '\u062F': ['\uFEA9', '\uFEAA', '\uFEAA', '\uFEA9'], // د
  '\u0630': ['\uFEAB', '\uFEAC', '\uFEAC', '\uFEAB'], // ذ
  '\u0631': ['\uFEAD', '\uFEAE', '\uFEAE', '\uFEAD'], // ر
  '\u0632': ['\uFEAF', '\uFEB0', '\uFEB0', '\uFEAF'], // ز
  '\u0633': ['\uFEB1', '\uFEB2', '\uFEB3', '\uFEB4'], // س
  '\u0634': ['\uFEB5', '\uFEB6', '\uFEB7', '\uFEB8'], // ش
  '\u0635': ['\uFEB9', '\uFEBA', '\uFEBB', '\uFEBC'], // ص
  '\u0636': ['\uFEBD', '\uFEBE', '\uFEBF', '\uFEC0'], // ض
  '\u0637': ['\uFEC1', '\uFEC2', '\uFEC3', '\uFEC4'], // ط
  '\u0638': ['\uFEC5', '\uFEC6', '\uFEC7', '\uFEC8'], // ظ
  '\u0639': ['\uFEC9', '\uFECA', '\uFECB', '\uFECC'], // ع
  '\u063A': ['\uFECD', '\uFECE', '\uFECF', '\uFED0'], // غ
  '\u0641': ['\uFED1', '\uFED2', '\uFED3', '\uFED4'], // ف
  '\u0642': ['\uFED5', '\uFED6', '\uFED7', '\uFED8'], // ق
  '\u0643': ['\uFED9', '\uFEDA', '\uFEDB', '\uFEDC'], // ك
  '\u0644': ['\uFEDD', '\uFEDE', '\uFEDF', '\uFEE0'], // ل
  '\u0645': ['\uFEE1', '\uFEE2', '\uFEE3', '\uFEE4'], // م
  '\u0646': ['\uFEE5', '\uFEE6', '\uFEE7', '\uFEE8'], // ن
  '\u0647': ['\uFEE9', '\uFEEA', '\uFEEB', '\uFEEC'], // ه
  '\u0648': ['\uFEED', '\uFEEE', '\uFEEE', '\uFEED'], // و
  '\u0649': ['\uFEEF', '\uFEF0', '\uFEEF', '\uFEF0'], // ى
  '\u064A': ['\uFEF1', '\uFEF2', '\uFEF3', '\uFEF4'], // ي
  '\u0640': ['\u0640', '\u0640', '\u0640', '\u0640'], // تطويل
};

// الحروف التي تقطع الاتصال بما بعدها
const NON_CONNECTORS = new Set([
  '\u0621', '\u0622', '\u0623', '\u0624', '\u0625', '\u0627', 
  '\u062F', '\u0630', '\u0631', '\u0632', '\u0648', '\u0649', '\u0629'
]);

// اللامات الألف (Ligatures) - [Isolated, Final]
const LAM_ALEF_MAP: Record<string, [string, string]> = {
  '\u0622': ['\uFEF5', '\uFEF6'], // لآ
  '\u0623': ['\uFEF7', '\uFEF8'], // لأ
  '\u0625': ['\uFEF9', '\uFEFA'], // لإ
  '\u0627': ['\uFEFB', '\uFEFC'], // لا
};

// regex للأحرف اللاتينية والأرقام والرموز المشتركة
const LTR_REGEX = /[a-zA-Z0-9\u0660-\u0669\-\+\/\:\.\,\(\)\[\]\{\}]+(\s+[a-zA-Z0-9\u0660-\u0669\-\+\/\:\.\,\(\)\[\]\{\}]+)*/g;
const TASHKEEL = /[\u064B-\u065F\u0670]/g;

/**
 * هل الحرف عربي؟
 */
function isArabicChar(char: string) {
  return ARABIC_MAP.hasOwnProperty(char);
}

/**
 * معالجة النصوص العربية (الوصل والتشكيل)
 */
function reshapeArabic(str: string): string {
  if (!str) return '';
  
  let res = '';
  const len = str.length;

  for (let i = 0; i < len; i++) {
    const current = str[i];
    
    // تخطي التشكيل إذا وجد (لتفادي التداخل)
    if (TASHKEEL.test(current)) continue;

    if (!isArabicChar(current)) {
      res += current;
      continue;
    }

    const prev = i > 0 ? str[i - 1] : null;
    let next = i < len - 1 ? str[i + 1] : null;

    // معالجة اللام ألف (حالة خاصة)
    if (current === '\u0644' && next && LAM_ALEF_MAP[next]) {
      // هل اللام تتصل بما قبلها؟
      const prevConnects = prev && isArabicChar(prev) && !NON_CONNECTORS.has(prev);
      const ligature = LAM_ALEF_MAP[next];
      
      res += prevConnects ? ligature[1] : ligature[0];
      i++; // تخطي الألف
      continue;
    }

    const forms = ARABIC_MAP[current];
    if (!forms) { res += current; continue; }

    const prevConnects = prev && isArabicChar(prev) && !NON_CONNECTORS.has(prev);
    const nextConnects = next && isArabicChar(next);

    if (prevConnects && nextConnects) {
      res += forms[2]; // Medial
    } else if (prevConnects) {
      res += forms[3]; // Final
    } else if (nextConnects) {
      res += forms[1]; // Initial
    } else {
      res += forms[0]; // Isolated
    }
  }
  return res;
}

/**
 * الوظيفة الرئيسية المصدرة
 */
export function fixArabic(text: string | null | undefined): string {
  if (!text) return '';
  
  // 1. تنظيف النص من التشكيل فوراً
  let cleanText = String(text).replace(TASHKEEL, "");

  // 2. تطبيق الوصل بين الحروف (Reshaping)
  let reshaped = reshapeArabic(cleanText);

  // 3. قلب الأقواس (لأننا سنعكس النص)
  reshaped = reshaped.replace(/[\(\)\[\]\{\}\<\>]/g, (m) => {
    if (m === '(') return ')';
    if (m === ')') return '(';
    if (m === '[') return ']';
    if (m === ']') return '[';
    return m;
  });

  // 4. العكس البصري (Reversing) للنص كاملاً
  // هذا يجعل العربي يظهر صحيحاً في بيئة LTR
  let reversed = reshaped.split('').reverse().join('');

  // 5. تصحيح الأرقام والكلمات الإنجليزية التي انقلبت خطأً
  // نعيد عكسها لترجع لطبيعتها
  reversed = reversed.replace(LTR_REGEX, (match) => {
    return match.split('').reverse().join('');
  });

  return reversed;
}
