const fs = require('fs');

let content = fs.readFileSync('src/lib/utils/pdfGenerator.ts', 'utf8');

const targetFunction = `export const exportSyllabusDistributionToPDF = async (
    profile: TeacherProfile,
    dist: any,
    activeTrimester: 1 | 2 | 3 | 'all' = 'all'
): Promise<void> => {
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '1123px'; // A4 Landscape
    container.style.minHeight = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '20px 25px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    const trimesters = activeTrimester === 'all'
        ? dist.trimesters
        : dist.trimesters.filter((t: any) => t.trimester === activeTrimester);

    let rowsHtml = '';
    trimesters.forEach((trim: any) => {
        trim.months.forEach((m: any) => {
            m.weeks.forEach((w: any) => {
                rowsHtml += \`
                <tr style="\${w.isExamPeriod ? 'background-color: #fef3c7; font-weight: bold;' : ''}">
                    <td style="padding: 5px; border: 1px solid #000; text-align: center; font-weight: 900; width: 4%; font-size: 9.5px;">\${w.weekNumber}</td>
                    <td style="padding: 5px; border: 1px solid #000; text-align: center; font-weight: bold; width: 7%; font-size: 9.5px;">\${w.monthNameAr}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 17%; font-size: 9.5px; font-weight: bold;">\${w.unitTitle}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 22%; font-size: 9.5px;">\${w.literaryText}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 17%; font-size: 9.5px;">\${w.grammar}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 15%; font-size: 9.5px;">\${w.rhetoricOrProsody || '—'}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 18%; font-size: 9.5px;">\${w.writingOrIntegration}</td>
                </tr>\`;
            });
        });
    });

    container.innerHTML = \`
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          \${getOfficialAlgerianHeaderHTML(profile, 'التوزيع السنوي والشهري لمنهاج اللغة العربية وآدابها', \`المستوى: \${dist.grade} (\${dist.stream}) — العام الدراسي: \${dist.academicYear}\`, \`الحجم الساعي: \${dist.weeklyHours} سا/أسبوعياً\`)}

          <!-- Meta Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid #000; padding: 6px 12px; margin-bottom: 10px; font-size: 11px; background: #f9fafb;">
              <span><strong>المؤسسة:</strong> \${profile.institution || 'مؤسسة تعليمية رسمية'}</span>
              <span><strong>الأستاذ(ة):</strong> \${profile.name || 'أستاذ(ة) التعليم الثانوي'}</span>
              <span><strong>المادة:</strong> \${dist.subject}</span>
              <span><strong>الفترة:</strong> \${activeTrimester === 'all' ? 'كامل السنة الدراسية (3 فصول)' : \`الفصل الدراسي \${activeTrimester}\`}</span>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 12px; font-size: 9.5px;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                <tr>
                  <th style="padding: 6px; border: 1px solid #000; width: 4%; text-align: center;">الأسبوع</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 7%; text-align: center;">الشهر</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 17%;">الوحدة والمحور الأدبي</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 22%;">النص الأدبي والقراءة</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 17%;">قواعد اللغة والإعراب</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 15%;">البلاغة والعروض</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 18%;">الوضعية الإدماجية والإنتاج</th>
                </tr>
              </thead>
              <tbody>
                \${rowsHtml}
              </tbody>
          </table>

          \${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    \`;

    const cleanTitle = \`\${dist.grade}_\${dist.stream}\`.replace(/[\\s/\\\\:]+/g, '_');
    await renderAndDownloadPDF(container, \`توزيع_المنهاج_\${cleanTitle}.pdf\`, 'l');
};`;

const replacementFunction = `export const exportSyllabusDistributionToPDF = async (
    profile: TeacherProfile,
    dist: any,
    activeTrimester: 1 | 2 | 3 | 'all' = 'all',
    scope: 'annual' | 'monthly' = 'annual',
    selectedMonthId?: string
): Promise<void> => {
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '1123px'; // A4 Landscape
    container.style.minHeight = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '20px 25px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    let targetMonthName = '';
    let targetSemester = 1;
    let rowsHtml = '';

    if (scope === 'monthly') {
        // Find specific month
        let foundMonth: any = null;
        for (const trim of dist.trimesters) {
            for (const m of trim.months) {
                if (selectedMonthId && (m.id === selectedMonthId || m.monthNameAr === selectedMonthId)) {
                    foundMonth = m;
                    targetSemester = trim.trimester;
                    break;
                }
            }
            if (foundMonth) break;
        }

        // Fallback to first month of active trimester if not found
        if (!foundMonth) {
            const firstTrim = activeTrimester === 'all' ? dist.trimesters[0] : (dist.trimesters.find((t: any) => t.trimester === activeTrimester) || dist.trimesters[0]);
            foundMonth = firstTrim.months[0];
            targetSemester = firstTrim.trimester;
        }

        targetMonthName = foundMonth.monthNameAr;
        foundMonth.weeks.forEach((w: any) => {
            rowsHtml += \`
            <tr style="\${w.isExamPeriod ? 'background-color: #fef3c7; font-weight: bold;' : ''}">
                <td style="padding: 8px 5px; border: 1px solid #000; text-align: center; font-weight: 900; width: 6%; font-size: 10px;">\${w.weekNumber}</td>
                <td style="padding: 8px 5px; border: 1px solid #000; text-align: center; font-weight: bold; width: 8%; font-size: 10px;">\${w.monthNameAr}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 18%; font-size: 10px; font-weight: bold;">\${w.unitTitle}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 22%; font-size: 10px;">\${w.literaryText}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 16%; font-size: 10px;">\${w.grammar}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 14%; font-size: 10px;">\${w.rhetoricOrProsody || '—'}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 16%; font-size: 10px;">\${w.writingOrIntegration}</td>
            </tr>\`;
        });
    } else {
        // Full annual progression
        const trimesters = activeTrimester === 'all'
            ? dist.trimesters
            : dist.trimesters.filter((t: any) => t.trimester === activeTrimester);

        trimesters.forEach((trim: any) => {
            trim.months.forEach((m: any) => {
                m.weeks.forEach((w: any) => {
                    rowsHtml += \`
                    <tr style="\${w.isExamPeriod ? 'background-color: #fef3c7; font-weight: bold;' : ''}">
                        <td style="padding: 5px; border: 1px solid #000; text-align: center; font-weight: 900; width: 4%; font-size: 9.5px;">\${w.weekNumber}</td>
                        <td style="padding: 5px; border: 1px solid #000; text-align: center; font-weight: bold; width: 7%; font-size: 9.5px;">\${w.monthNameAr}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 17%; font-size: 9.5px; font-weight: bold;">\${w.unitTitle}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 22%; font-size: 9.5px;">\${w.literaryText}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 17%; font-size: 9.5px;">\${w.grammar}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 15%; font-size: 9.5px;">\${w.rhetoricOrProsody || '—'}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 18%; font-size: 9.5px;">\${w.writingOrIntegration}</td>
                    </tr>\`;
                });
            });
        });
    }

    const docMainTitle = scope === 'monthly'
        ? \`التوزيع الشهري الرسمي لمنهاج اللغة العربية — شهر \${targetMonthName}\`
        : 'التوزيع السنوي الرسمي لمنهاج اللغة العربية وآدابها (الجيل الثاني)';

    const docSubTitle = scope === 'monthly'
        ? \`المستوى: \${dist.grade} (\${dist.stream}) — الفصل: \${targetSemester} — الحجم الساعي: \${dist.weeklyHours} سا/أسبوعياً\`
        : \`المستوى: \${dist.grade} (\${dist.stream}) — العام الدراسي: \${dist.academicYear} — الحجم الساعي: \${dist.weeklyHours} سا/أسبوعياً\`;

    container.innerHTML = \`
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          \${getOfficialAlgerianHeaderHTML(profile, docMainTitle, docSubTitle, \`الموسم: \${dist.academicYear}\`)}

          <!-- Meta Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid #000; padding: 6px 12px; margin-bottom: 10px; font-size: 11px; background: #f9fafb;">
              <span><strong>المؤسسة:</strong> \${profile.institution || 'ثانوية معتمدة'}</span>
              <span><strong>الأستاذ(ة):</strong> \${profile.name || 'أستاذ التعليم الثانوي'}</span>
              <span><strong>المادة:</strong> \${dist.subject}</span>
              <span><strong>نوع الوثيقة:</strong> \${scope === 'monthly' ? \`توزيع شهري رسمي (شهر \${targetMonthName})\` : (activeTrimester === 'all' ? 'توزيع سنوي شامل (3 فصول)' : \`توزيع الفصل \${activeTrimester}\`)}</span>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 12px; font-size: \${scope === 'monthly' ? '10px' : '9.5px'};">
              <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                <tr>
                  <th style="padding: 6px; border: 1px solid #000; width: \${scope === 'monthly' ? '6%' : '4%'}; text-align: center;">الأسبوع</th>
                  <th style="padding: 6px; border: 1px solid #000; width: \${scope === 'monthly' ? '8%' : '7%'}; text-align: center;">الشهر</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 17%;">الوحدة والمحور الأدبي</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 22%;">النص الأدبي والقراءة</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 17%;">قواعد اللغة والإعراب</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 15%;">البلاغة والعروض</th>
                  <th style="padding: 6px; border: 1px solid #000; width: \${scope === 'monthly' ? '16%' : '18%'};">الوضعية الإدماجية والإنتاج</th>
                </tr>
              </thead>
              <tbody>
                \${rowsHtml}
              </tbody>
          </table>

          \${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    \`;

    const cleanTitle = \`\${dist.grade}_\${dist.stream}\`.replace(/[\\s/\\\\:]+/g, '_');
    const finalFilename = scope === 'monthly'
        ? \`التوزيع_الشهري_\${targetMonthName}_\${cleanTitle}.pdf\`
        : \`التوزيع_السنوي_الشامل_\${cleanTitle}.pdf\`;

    await renderAndDownloadPDF(container, finalFilename, 'l');
};`;

// Replace normalizing CRLF
const normContent = content.replace(/\r\n/g, '\n');
const normTarget = targetFunction.replace(/\r\n/g, '\n');
const normReplacement = replacementFunction.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
    const updated = normContent.replace(normTarget, normReplacement);
    fs.writeFileSync('src/lib/utils/pdfGenerator.ts', updated, 'utf8');
    console.log('pdfGenerator.ts updated successfully with monthly and annual export!');
} else {
    console.error('Target function not found in pdfGenerator.ts');
}
