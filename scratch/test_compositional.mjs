const ABSTRACT_INANIMATE_NOUNS = new Set([
  'الدهر', 'الزمان', 'الايام', 'الايام', 'الليل', 'النهار', 'الصباح', 'الفجر', 'المساء',
  'الشمس', 'القمر', 'النجوم', 'الرياح', 'السحاب', 'الغيم', 'المطر', 'البحر', 'النهر',
  'الجبل', 'الأرض', 'السماء', 'الديار', 'الأطلال', 'الوطن', 'التاريخ', 'المستقبل',
  'الحلم', 'الأمل', 'اليأس', 'الحزن', 'الفرح', 'الشوق', 'الحب', 'الموت', 'المنية',
  'الحرب', 'السلم', 'السلام', 'العدل', 'الظلم', 'الحق', 'الباطل',
  'الصمت', 'الكلام', 'الضمير', 'الفكر', 'العلم', 'الجهل', 'الفقر', 'الغنى', 'القلم', 'السيف'
]);

const HUMAN_VERB_ROOTS = [
  'ابتسم', 'تبسم', 'يبتسم', 'ضحك', 'يضحك', 'بكى', 'يبكي', 'دمع', 'تدمع', 'ناح', 'ينوح',
  'شكى', 'يشكو', 'اشتكى', 'تألم', 'يتألم', 'صرخ', 'يصرخ', 'هتف', 'يهتف', 'همس', 'يهمس',
  'نطق', 'ينطق', 'خاطب', 'يخاطب', 'حدث', 'يحدث', 'استغاث', 'يستغيث', 'رقص', 'يرقص',
  'انتشى', 'نام', 'ينام', 'غفا', 'يغفو', 'استيقظ', 'يستيقظ', 'صحا', 'يصحو',
  'مشى', 'يمشي'
];

const PREDATOR_VERB_ROOTS = [
  'افترس', 'يفترس', 'عض', 'يعض', 'نهش', 'ينهش', 'أنشب', 'ينشب', 'كشر', 'يكشر',
  'يفتك', 'فتك', 'طار', 'يطير', 'حلق', 'يحلق', 'زأر', 'يزأر', 'عوى', 'يعوي'
];

const testSentences = [
  'رقصت النجوم في كبد السماء',
  'همس الليل بأسراره للأشجار',
  'افترست الحرب أماني الشباب',
  'مشى الصمت بين الأزقة',
  'استيقظ الأمل في قلوب البائسين',
  'ناحت الرياح حزناً على ما فات',
  'تحدث التاريخ عن بطولات أجدادنا'
];

for (const sent of testSentences) {
  const words = sent.split(/[\s,،؛;.؟!\\-]+/).filter(Boolean);
  let detected = false;
  
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    // check if w is one of the abstract nouns
    if (ABSTRACT_INANIMATE_NOUNS.has(w)) {
      // check previous or next word (or within distance 2)
      for (let j = Math.max(0, i - 2); j <= Math.min(words.length - 1, i + 2); j++) {
        if (i === j) continue;
        const targetWord = words[j];
        
        // Check Human Verb
        const hv = HUMAN_VERB_ROOTS.find(v => targetWord.startsWith(v) || targetWord.endsWith(v) || targetWord.includes(v));
        if (hv) {
          console.log(`✅ [تشخيص توليدي]: "${sent}" -> المشبه: ${w} | الفعل الإنساني: ${targetWord} (${hv})`);
          detected = true;
          break;
        }
        
        // Check Predator Verb
        const pv = PREDATOR_VERB_ROOTS.find(v => targetWord.startsWith(v) || targetWord.endsWith(v) || targetWord.includes(v));
        if (pv) {
          console.log(`✅ [تجسيم توليدي]: "${sent}" -> المشبه: ${w} | الفعل الحيواني: ${targetWord} (${pv})`);
          detected = true;
          break;
        }
      }
    }
    if (detected) break;
  }
}
