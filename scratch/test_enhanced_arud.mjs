// الحروف الشمسية والقمرية
const SHAMSIYYAH = 'تثدذرزسشصضطظلن';
const QAMARIYYAH = 'أإآءئؤابجحخعغفقكمهويد';

export function perfectArudWriting(text, isHemistichEnd = false) {
  if (!text) return '';

  let t = text.trim();

  // 1. تنظيف علامات الترقيم
  t = t.replace(/[،,؛;:!؟\?\[\]\(\)\{\}\"«»—\-]/g, ' ').replace(/\s+/g, ' ');

  // 2. توحيد ترتيب الشدة والحركات (في حال كُتبت الحركة قبل الشدة)
  t = t.replace(/([َُِ])ّ/g, 'ّ$1');

  // 3. الكلمات الشائعة ذات الألف المحذوفة رسماً الثابتة نطقاً
  t = t.replace(/\bهَٰذَا\b|\bهَذَا\b/g, 'هَاذَا')
       .replace(/\bهَٰذِهِ\b|\bهَذِهِ\b/g, 'هَاذِهِي')
       .replace(/\bهَٰذَانِ\b|\bهَذَانِ\b/g, 'هَاذَانِ')
       .replace(/\bهَٰؤُلَاءِ\b|\bهَؤُلَاءِ\b/g, 'هَاؤُلَاءِ')
       .replace(/\bذَٰلِكَ\b|\bذَلِكَ\b/g, 'ذَالِكَ')
       .replace(/\bلَٰكِنَّ\b|\bلَكِنَّ\b/g, 'لَاكِنْنَ')
       .replace(/\bلَٰكِنْ\b|\bلَكِنْ\b/g, 'لَاكِنْ')
       .replace(/\bاللَّهِ?\b|\bاللهِ?\b|\bاللَّهَ\b|\bاللهَ\b|\bاللَّهُ\b|\bاللهُ\b/g, 'الْلَاه')
       .replace(/\bالرَّحْمَٰنِ?\b|\bالرَّحْمَنِ?\b/g, 'اَرْ رَحْمَان');

  // 4. فك التنوين إلى نون ساكنة
  t = t.replace(/([^\s])ً/g, '$1َنْ')
       .replace(/([^\s])ٌ/g, '$1ُنْ')
       .replace(/([^\s])ٍ/g, '$1ِنْ');

  // 5. حذف ألف واو الجماعة الفارقة
  t = t.replace(/ُوا\b/g, 'ُو');

  // الحركات
  const H = '[ًٌٍَُِْ]?';
  const L = '[بتثجحخدذرزسشصضطظعغفقكلمنهويءئؤةأإآى]';

  // 6. التقاء الساكنين وهمزة الوصل:
  // أ. مد يليه ال شمسية: تسقط حرف المد وهمزة الوصل ولام التعريف، ويبقى الحرف الشمسي مشدداً
  const sunRegexWithYa = new RegExp(`(${L})${H}([ىي])\\s+ال([${SHAMSIYYAH}])`, 'g');
  t = t.replace(sunRegexWithYa, '$1ِ $3ّ');

  const sunRegexWithAlif = new RegExp(`(${L})${H}([اى])\\s+ال([${SHAMSIYYAH}])`, 'g');
  t = t.replace(sunRegexWithAlif, '$1َ $3ّ');

  const sunRegexWithWaw = new RegExp(`(${L})${H}(و)\\s+ال([${SHAMSIYYAH}])`, 'g');
  t = t.replace(sunRegexWithWaw, '$1ُ $3ّ');

  // ب. مد يليه ال قمرية: يسقط حرف المد وهمزة الوصل وتبقى لام قمرية ساكنة
  const moonRegexWithYa = new RegExp(`(${L})${H}([ىي])\\s+الْ?`, 'g');
  t = t.replace(moonRegexWithYa, '$1ِ لْ');

  const moonRegexWithAlif = new RegExp(`(${L})${H}([اى])\\s+الْ?`, 'g');
  t = t.replace(moonRegexWithAlif, '$1َ لْ');

  const moonRegexWithWaw = new RegExp(`(${L})${H}(و)\\s+الْ?`, 'g');
  t = t.replace(moonRegexWithWaw, '$1ُ لْ');

  // ج. حرف متحرك عادي يليه ال قمرية في درج الكلام
  t = t.replace(/([َُِ])\s+الْ?/g, '$1 لْ');

  // د. حرف متحرك عادي يليه ال شمسية في درج الكلام
  const sunRegexVowel = new RegExp(`([َُِ])\\s+ال([${SHAMSIYYAH}])`, 'g');
  t = t.replace(sunRegexVowel, '$1 $2ّ');

  // هـ. "ال" في أول الكلام:
  const sunStart = new RegExp(`^ال([${SHAMSIYYAH}])`);
  t = t.replace(sunStart, 'اَ$1ّ');
  t = t.replace(/^الْ?/, 'اَلْ');

  // 7. فك الشدة إلى ساكن فمتحرك
  const arabicLettersRegex = /([بتثجحخدذرزسشصضطظعغفقكلمنهويءئؤةأإآى])ّ([َُِ]?)/g;
  t = t.replace(arabicLettersRegex, (_, char, v) => {
    const vowel = v || 'َ';
    return `${char}ْ${char}${vowel}`;
  });

  // 7. إشباع حرف الروي في نهاية الشطر إذا كان متحركاً
  if (isHemistichEnd) {
    // إزالة السكون إن وجد خطأً في الإشباع، أو إشباع الحركة الأخيرة
    if (t.endsWith('َ')) {
      t = t + 'ا';
    } else if (t.endsWith('ُ')) {
      t = t + 'و';
    } else if (t.endsWith('ِ')) {
      t = t + 'ي';
    }
  }

  return t;
}

// تجربة
const s1 = 'عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ';
const s2 = 'وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ';

console.log('الأصل:', s1);
console.log('العروضي المحسن:', perfectArudWriting(s1, false));
console.log('الأصل عجز:', s2);
console.log('العروضي المحسن عجز:', perfectArudWriting(s2, true));
