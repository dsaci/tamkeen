import { analyzeRhetoricLocally } from '../src/lib/utils/rhetoricEngine.ts';

const verses = [
  'وإذا المنية أنشبت أظفارها ألفيت كل تميمة لا تنفع',
  'وَإِذَا المَنِيَّةُ أَنْشَبَتْ أَظْفَارَهَا أَلْفَيْتَ كُلَّ تَمِيمَةٍ لَا تَنْفَعُ',
  'طويل النجاد رفيع العماد كثير الرماد إذا ما شتا',
  'أقبل يمشي في البساط فما درى إلى البحر يسعى أم إلى البدر يرتقي',
  'أمطرت لؤلؤاً من نرجس وسقت ورداً وعضت على العناب بالبرد',
  'شاكٍ إلى البحر اضطراب خواطري فيجيبني برياحه الهوجاء',
  'عضنا الدهر بنابه'
];

for (const v of verses) {
  console.log('----------------------------------------------------');
  console.log('INPUT:', v);
  const res = analyzeRhetoricLocally(v);
  console.log('TOTAL FINDINGS:', res.findings.length);
  for (const f of res.findings) {
    console.log(`  * [${f.categoryLabel}] ${f.label}`);
    console.log(`    العبارة: "${f.span.quote}" [${f.span.start}..${f.span.end}]`);
    console.log(`    الشرح: ${f.explanation}`);
    console.log(`    الأثر: ${f.effect}`);
  }
}
