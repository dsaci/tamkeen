const fs = require('fs');

let content = fs.readFileSync('src/lib/views/Plans.tsx', 'utf8');

const targetStr = `          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-white hover:bg-emerald-50 text-slate-900 px-5 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 border border-emerald-200"
          >
            <Download size={16} className="text-emerald-700" />
            {isExporting ? 'جاري تجهيز PDF...' : 'تصدير وثيقة التوزيع (PDF)'}
          </button>`;

const replacementStr = `          <button
            onClick={() => navigate('/resources?tab=guides')}
            className="bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 hover:text-white px-4 py-3 rounded-2xl font-black text-xs border border-emerald-700/60 transition-all flex items-center gap-2 shadow-md"
            title="الانتقال إلى بنك الأدلة والمناهج والتشريع المدرسي"
          >
            <BookOpen size={16} className="text-amber-300" />
            الأدلة والمناهج الرسمية
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-white hover:bg-emerald-50 text-slate-900 px-5 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 border border-emerald-200"
          >
            <Download size={16} className="text-emerald-700" />
            {isExporting ? 'جاري تجهيز PDF...' : 'تصدير وثيقة التوزيع (PDF)'}
          </button>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('src/lib/views/Plans.tsx', content, 'utf8');
  console.log('Updated Plans.tsx successfully');
} else {
  // Let's normalize CRLF and try again
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget)) {
    const updated = normalizedContent.replace(normalizedTarget, replacementStr.replace(/\r\n/g, '\n'));
    fs.writeFileSync('src/lib/views/Plans.tsx', updated, 'utf8');
    console.log('Updated Plans.tsx successfully (with CRLF normalization)');
  } else {
    console.error('Target not found in Plans.tsx');
  }
}
