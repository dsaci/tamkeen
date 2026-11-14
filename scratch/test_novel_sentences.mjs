import { analyzeRhetoricLocally } from '../src/lib/utils/rhetoricEngine.ts';

const unseenSentences = [
  'رقصت النجوم في كبد السماء',
  'همس الليل بأسراره للأشجار',
  'افترست الحرب أماني الشباب',
  'مشى الصمت بين الأزقة',
  'استيقظ الأمل في قلوب البائسين',
  'ناحت الرياح حزناً على ما فات',
  'تحدث التاريخ عن بطولات أجدادنا'
];

console.log('Testing Unseen Novel Metaphors in Local Rule Engine:');
for (const s of unseenSentences) {
  const res = analyzeRhetoricLocally(s);
  console.log('-------------------------------------------');
  console.log('نص جديد:', s);
  console.log('عدد النتائج:', res.findings.length);
  res.findings.forEach(f => {
    console.log(`- ${f.label} [${f.span.quote}]`);
    console.log(`  المشبه: ${f.elements['المشبه (المستعار له)']}`);
    console.log(`  المشبه به المحذوف: ${f.elements['المشبه به المحذوف (المستعار منه)']}`);
    console.log(`  القرينة: ${f.elements['القرينة المانعة واللازمة']}`);
    console.log(`  الأثر: ${f.effect}`);
  });
}
