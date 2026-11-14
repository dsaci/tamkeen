import { convertToArudWriting, extractProsodySymbols, analyzePoeticVerse, scoreMeterFit, POETIC_METERS } from '../src/lib/utils/prosodyEngine.ts';

const verses = [
  {
    a: 'إِذَا الشَّعْبُ يَوْمًا أَرَادَ الْحَيَاةَ',
    b: 'فَلَا بُدَّ أَنْ يَسْتَجِيبَ الْقَدَرْ',
    expected: 'المتقارب'
  },
  {
    a: 'عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ',
    b: 'وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ',
    expected: 'الطويل'
  },
  {
    a: 'أَلَا كُلُّ شَيْءٍ مَا خَلَا اللَّهَ بَاطِلُ',
    b: 'وَكُلُّ نَعِيمٍ لَا مَحَالَةَ زَائِلُ',
    expected: 'الطويل'
  },
  {
    a: 'هَلْ غَادَرَ الشُّعَرَاءُ مِنْ مُتَرَدَّمِ',
    b: 'أَمْ هَلْ عَرَفْتَ الدَّارَ بَعْدَ تَوَهُّمِ',
    expected: 'الكامل'
  }
];

for (const v of verses) {
  const res = analyzePoeticVerse(v.a, v.b);
  console.log(`\n========================================`);
  console.log(`البيت: ${v.a} // ${v.b}`);
  console.log(`البحر المكتشف: ${res.meter.name} (المتوقع: ${v.expected}) | الثقة: ${res.confidenceScore}%`);
  console.log(`رموز الصدر: ${res.firstHemistich.symbols}`);
  console.log(`تفاعيل الصدر: ${res.firstHemistich.feet.map(f => f.actual + (f.zihafOrIlla && !f.zihafOrIlla.includes('سالمة') ? ` [${f.zihafOrIlla.split(':')[1]?.split('(')[0]?.trim() || f.kind}]` : '')).join(' - ')}`);
  console.log(`رموز العجز: ${res.secondHemistich.symbols}`);
  console.log(`تفاعيل العجز: ${res.secondHemistich.feet.map(f => f.actual + (f.zihafOrIlla && !f.zihafOrIlla.includes('سالمة') ? ` [${f.zihafOrIlla.split(':')[1]?.split('(')[0]?.trim() || f.kind}]` : '')).join(' - ')}`);
  console.log(`ملاحظة: ${res.pedagogicalNotes[0] || ''}`);
}
