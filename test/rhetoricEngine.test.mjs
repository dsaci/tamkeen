/**
 * ============================================================================
 * 🧪 مجموعة الاختبارات الآلية الشاملة لـ «المختبر البلاغي الذكي»
 * تغطي المعايير اللغوية والبلاغية والتقنية (Section 12 من البرومبت الهندسي)
 * ============================================================================
 */

import { analyzeRhetoricLocally } from '../src/lib/utils/rhetoricEngine.ts';

const tests = [
  {
    name: '1. الاستعارة المكنية الكلاسيكية',
    text: 'وَاشْتَعَلَ الرَّأْسُ شَيْبًا',
    expectedFamily: 'istiara',
    shouldFind: true
  },
  {
    name: '2. أسلوب القصر بـ (إنما)',
    text: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
    expectedFamily: 'qasr',
    shouldFind: true
  },
  {
    name: '3. أسلوب القصر بـ النفي والاستثناء',
    text: 'مَا الْحَيَاةُ إِلَّا جِهَادٌ وَكِفَاحٌ',
    expectedFamily: 'qasr',
    shouldFind: true
  },
  {
    name: '4. التصريع في مطلع الشعر',
    text: 'عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ ... وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ',
    expectedFamily: 'tasree',
    shouldFind: true
  },
  {
    name: '5. المقابلة البلاغية التامة',
    text: 'فَأَمَّا مَنْ أَعْطَى وَاتَّقَى * وَصَدَّقَ بِالْحُسْنَى * فَسَنُيَسِّرُهُ لِلْيُسْرَى * وَأَمَّا مَنْ بَخِلَ وَاسْتَغْنَى * وَكَذَّبَ بِالْحُسْنَى * فَسَنُيَسِّرُهُ لِلْعُسْرَى',
    expectedFamily: 'muqabala',
    shouldFind: true
  },
  {
    name: '6. طباق إيجاب صريح',
    text: 'يَعْلَمُ مَا فِي السِّرِّ وَالْعَلَنِ',
    expectedFamily: 'tibaaq',
    shouldFind: true
  },
  {
    name: '7. إنشاء طلبي (استفهام مجازي)',
    text: 'هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ؟',
    expectedFamily: 'insha_talabi',
    shouldFind: true
  },
  {
    name: '8. إنشاء طلبي (تمنٍّ)',
    text: 'أَلَا لَيْتَ الشَّبَابَ يَعُودُ يَوْمًا',
    expectedFamily: 'insha_talabi',
    shouldFind: true
  },
  {
    name: '9. تشبيه مرسل بوجود الأداة',
    text: 'الْعِلْمُ كَالنُّورِ يَهْدِي كُلَّ مَنْ طَلَبَهُ',
    expectedFamily: 'tashbeeh',
    shouldFind: true
  },
  {
    name: '10. شاهد أبي ذؤيب الهذلي (المنية أنشبت أظفارها - استعارة مكنية + كناية)',
    text: 'وإذا المنية أنشبت أظفارها ألفيت كل تميمة لا تنفع',
    expectedFamily: 'istiara',
    shouldFind: true
  },
  {
    name: '11. شاهد أبي ذؤيب الهذلي المشكول بالكامل',
    text: 'وَإِذَا المَنِيَّةُ أَنْشَبَتْ أَظْفَارَهَا أَلْفَيْتَ كُلَّ تَمِيمَةٍ لَا تَنْفَعُ',
    expectedFamily: 'kinayah',
    shouldFind: true
  },
  {
    name: '12. كناية عن صفة متعددة (شاهد الخنساء في صخر)',
    text: 'طويل النجاد رفيع العماد كثير الرماد إذا ما شتا',
    expectedFamily: 'kinayah',
    shouldFind: true
  },
  {
    name: '13. استعارة تصريحية (شاهد المتنبي)',
    text: 'أقبل يمشي في البساط فما درى إلى البحر يسعى أم إلى البدر يرتقي',
    expectedFamily: 'istiara',
    shouldFind: true
  },
  {
    name: '14. نص تقريري عادي خالٍ تماماً (فحص الامتناع عن الهلوسة)',
    text: 'قَرَأْتُ الْكِتَابَ أَمْسِ كَامِلاً وَكَتَبْتُ مُلَخَّصَهُ عَلَى الدَّفْتَرِ.',
    expectedFamily: 'none',
    shouldFind: false
  },
  {
    name: '15. نص فارغ أو مسافات',
    text: '   ',
    expectedFamily: 'none',
    shouldFind: false
  }
];

console.log('═══════════════════════════════════════════════════════════════════');
console.log('🧪 بدء تشغيل الاختبارات الآلية لـ «المختبر البلاغي الذكي»');
console.log('═══════════════════════════════════════════════════════════════════\n');

let passedCount = 0;

for (const t of tests) {
  const result = analyzeRhetoricLocally(t.text, 'all', 'secondary', 'detailed');
  let passed = false;

  if (t.shouldFind) {
    const hasFamily = result.findings.some(f => f.family === t.expectedFamily);
    passed = hasFamily && result.findings.length > 0;
  } else {
    passed = result.findings.length === 0;
  }

  if (passed) {
    passedCount++;
    console.log(`✅ [نجاح]: ${t.name}`);
    if (result.findings.length > 0) {
      console.log(`   └─ رُصد: ${result.findings.map(f => `${f.label} [${f.span.quote}]`).join(' ، ')}`);
    } else {
      console.log(`   └─ اعتراف سليم بالخلو من الصور دون هلوسة (0 نتائج).`);
    }
  } else {
    console.error(`❌ [فشل]: ${t.name}`);
    console.error(`   └─ المتوقع: ${t.expectedFamily} | الفعلي: ${result.findings.map(f => f.family).join(', ')}`);
  }
}

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log(`📊 النتيجة النهائية: تم اجتياز ${passedCount} من أصل ${tests.length} اختبار بنجاح! (${Math.round((passedCount / tests.length) * 100)}%)`);
console.log('═══════════════════════════════════════════════════════════════════');

if (passedCount === tests.length) {
  process.exit(0);
} else {
  process.exit(1);
}
