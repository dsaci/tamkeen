import * as jspdfModule from 'jspdf';
const jsPDF = (jspdfModule as any).jsPDF || (jspdfModule as any).default || jspdfModule;
import html2canvas from 'html2canvas';
import { Session, TeacherProfile } from '../../types';
import { getTimetableTimingConfig } from './timetableConfig';

// ============================================================================
// 🏛️ Official Algerian Ministry Header Builder (ترويسة وزارة التربية الوطنية)
// ============================================================================
export const getOfficialAlgerianHeaderHTML = (
    profile: TeacherProfile,
    documentTitle: string,
    documentSubtitle: string,
    additionalMetaLeft: string = ''
): string => {
    const levelLabel =
        profile.level === 'PRIMARY' ? 'التعليم الابتدائي' :
        profile.level === 'MIDDLE' ? 'التعليم المتوسط' :
        profile.level === 'HIGH' ? 'التعليم الثانوي' : 'التعليم العام';

    const wilaya = profile.province
        ? (profile.province.includes('-') ? profile.province.split('-')[1] : profile.province)
        : (profile.wilaya || '...................');

    return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; border-bottom: 2px solid #000; padding-bottom: 12px; font-family: 'Cairo', sans-serif;">
        <!-- Right: Ministry & State Administration -->
        <div style="text-align: right; width: 33%;">
            <p style="font-weight: 800; font-size: 12px; margin: 0 0 3px 0; color: #000;">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p style="font-weight: 800; font-size: 12px; margin: 0 0 3px 0; color: #000;">وزارة التربية الوطنية</p>
            <p style="font-weight: bold; font-size: 11px; margin: 0 0 2px 0; color: #000;">المقاطعة الإدارية: ${profile.administrativeDistrict || '...................'}</p>
            <p style="font-weight: bold; font-size: 11px; margin: 0; color: #000;">المؤسسة التعليمية: ${profile.institution || '...................'}</p>
        </div>

        <!-- Center: Document Title & Academic Session -->
        <div style="text-align: center; width: 34%;">
            <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 4px 0; text-decoration: underline; color: #000;">${documentTitle}</h1>
            <p style="font-size: 12px; font-weight: bold; margin: 0 0 2px 0; color: #000;">${documentSubtitle}</p>
            <p style="font-size: 10px; font-weight: bold; margin: 0; color: #333;">الموسم الدراسي: ${profile.academicYear || '2025 / 2026'}</p>
        </div>

        <!-- Left: Pedagogy & Teacher Profile -->
        <div style="text-align: left; width: 33%;">
            <p style="font-weight: bold; font-size: 11px; margin: 0 0 2px 0; color: #000;">مديرية التربية لولاية: ${wilaya}</p>
            <p style="font-weight: bold; font-size: 11px; margin: 0 0 2px 0; color: #000;">المقاطعة البيداغوجية: ${profile.pedagogicalDistrict || '...................'}</p>
            <p style="font-weight: 800; font-size: 11px; margin: 0 0 2px 0; color: #000;">الأستاذ(ة): ${profile.name || '...................'}</p>
            <p style="font-weight: bold; font-size: 10px; margin: 0; color: #444;">${levelLabel} ${profile.teachingSubject ? `• ${profile.teachingSubject}` : ''} ${additionalMetaLeft ? `• ${additionalMetaLeft}` : ''}</p>
        </div>
    </div>
    `;
};

// ============================================================================
// ✍️ Official Signatures & Approval Footer (توقيعات الاعتماد والتفتيش الرسمي)
// ============================================================================
export const getOfficialAlgerianFooterHTML = (
    profile: TeacherProfile,
    options: {
        showTeacher?: boolean;
        showDirector?: boolean;
        showInspector?: boolean;
        showAdvisor?: boolean;
        exportTime?: string;
    } = {}
): string => {
    const {
        showTeacher = true,
        showDirector = true,
        showInspector = true,
        showAdvisor = false,
        exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    } = options;

    return `
    <!-- Signatures Grid -->
    <div style="margin-top: 30px; padding-top: 18px; display: flex; justify-content: space-around; padding-left: 20px; padding-right: 20px; font-family: 'Cairo', sans-serif;">
        ${showTeacher ? `
        <div style="text-align: center; min-width: 140px;">
            <p style="font-weight: 800; font-size: 12px; margin-bottom: 55px; color: #000;">توقيع وختم الأستاذ(ة)</p>
            <p style="font-size: 11px; color: #555;">.........................................</p>
        </div>` : ''}

        ${showAdvisor ? `
        <div style="text-align: center; min-width: 140px;">
            <p style="font-weight: 800; font-size: 12px; margin-bottom: 55px; color: #000;">مستشار التربية / الناظر</p>
            <p style="font-size: 11px; color: #555;">.........................................</p>
        </div>` : ''}

        ${showDirector ? `
        <div style="text-align: center; min-width: 140px;">
            <p style="font-weight: 800; font-size: 12px; margin-bottom: 55px; color: #000;">توقيع وختم السيد المدير</p>
            <p style="font-size: 11px; color: #555;">.........................................</p>
        </div>` : ''}

        ${showInspector ? `
        <div style="text-align: center; min-width: 140px;">
            <p style="font-weight: 800; font-size: 12px; margin-bottom: 55px; color: #000;">تأشيرة وتوقيع مفتش المادة</p>
            <p style="font-size: 11px; color: #555;">.........................................</p>
        </div>` : ''}
    </div>

    <!-- Official Security & Timestamp Bar -->
    <div style="margin-top: 20px; text-align: center; border-top: 1px solid #999; padding-top: 6px; display: flex; justify-content: space-between; font-size: 9px; color: #444; font-family: 'Cairo', sans-serif;">
        <span>منصة تمكين الرقمية للأستاذ الجزائري • وثيقة بيداغوجية رسمية صادرة آلياً</span>
        <span>المعرف الرقمي الموحد: ${profile.tamkeenId || 'TAMKEEN-PRO'}</span>
        <span>تاريخ وتوقيت الاستخراج: ${new Date().toLocaleDateString('ar-DZ')} — ${exportTime}</span>
    </div>
    `;
};

// ============================================================================
// ⚙️ Core Render & Download Engine (المحرك البرمجي الموحد لتوليد PDF)
// ============================================================================
const renderAndDownloadPDF = async (
    container: HTMLElement,
    filename: string,
    orientation: 'p' | 'l' = 'p'
): Promise<void> => {
    document.body.appendChild(container);

    try {
        // الانتظار القصير لضمان اكتمال تحميل خط القاهرة ورسم الجداول
        await new Promise(resolve => setTimeout(resolve, 150));

        const canvas = await html2canvas(container, {
            scale: 2, // جودة عالية حادة
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF(orientation, 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // دعم تقسيم الصفحات المتعددة تلقائياً إذا تجاوز المحتوى صفحة واحدة
        while (heightLeft > 3) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        pdf.save(safeFilename);

        // إطلاق إشعار نجاح التصدير
        try {
            const { triggerExportDonation } = await import('../../components/ExportDonationToast');
            triggerExportDonation();
        } catch {
            // Toast fallback
        }
    } catch (err: any) {
        console.error('PDF Generation Error:', err);
        alert(`حدث خطأ أثناء تصدير ملف PDF: ${err.message || 'يرجى المحاولة مجدداً'}`);
    } finally {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }
};

// ============================================================================
// 1️⃣ تصدير الكراس اليومي الرسمي (Daily Journal Export)
// ============================================================================
export const exportDailyJournalToPDF = async (
    profile: TeacherProfile,
    date: string,
    dayName: string,
    sessions: Session[]
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
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    const sortedSessions = [...sessions].sort((a, b) => {
        if (a.timing.period === b.timing.period) return (a.timing.startTime || '').localeCompare(b.timing.startTime || '');
        return a.timing.period === 'MORNING' ? -1 : 1;
    });

    let rowsHtml = '';
    sortedSessions.forEach((s) => {
        const isHoliday = s.timing.category === 'HOLIDAY';
        const isBreak = s.timing.category === 'BREAK';

        const subject = s.subject || '';
        const activity = s.activity || '';
        const title = s.title || '';
        const objective = s.objective || '';
        const content = s.content || '';
        const tools = s.tools || '';
        const notes = s.notes || '';

        let sectionDisplay = '';
        if (s.sectionNumber || s.sectionName) {
            sectionDisplay = `المقطع ${s.sectionNumber || ''}: ${s.sectionName || ''}`;
        }
        if (s.unityNumber) {
            sectionDisplay += `<br/><span style="color: #4b5563;">(الوحدة ${s.unityNumber})</span>`;
        }

        if (isHoliday) {
            rowsHtml += `
            <tr style="background-color: #f0fdf4 !important; -webkit-print-color-adjust: exact; border-bottom: 1px solid #000;">
                <td colspan="9" style="padding: 12px; text-align: center; color: #15803d !important; font-weight: bold; font-size: 13px;">
                    *** عطلة بيداغوجية: ${s.timing.holidayName || 'مناسبة رسمية'} ***
                </td>
            </tr>`;
        } else if (isBreak) {
            rowsHtml += `
            <tr style="background-color: #fff7ed !important; -webkit-print-color-adjust: exact; border-bottom: 1px solid #000;">
                <td colspan="9" style="padding: 8px; text-align: center; color: #c2410c !important; font-weight: bold; font-size: 13px;">
                    --- استراحة بيداغوجية (${s.timing.breakDuration || 15} دقيقة) ---
                </td>
            </tr>`;
        } else {
            const time = `${s.timing.startTime || '00:00'} - ${s.timing.endTime || '00:00'}`;
            rowsHtml += `
            <tr style="border-bottom: 1px solid #000;">
                <td style="padding: 6px; border-left: 1px solid #000; text-align: center; font-weight: bold; font-size: 11px; color: #000;">${time}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-weight: bold; font-size: 11px; color: #000;">${subject}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-size: 11px; color: #000;">${activity}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-size: 9px; color: #000;">${sectionDisplay}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-weight: bold; font-size: 11px; color: #000;">${title}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-size: 10px; color: #000;">${objective}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-size: 10px; line-height: 1.4; color: #000;">${content}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-size: 10px; color: #000;">${tools}</td>
                <td style="padding: 6px; border-left: 1px solid #000; font-size: 10px; color: #000;">${notes}</td>
            </tr>`;
        }
    });

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, 'الكراس اليومي', `بتاريخ: ${dayName} ${date}`)}

          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; background: #fff;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb; color: #000;">
                  <tr>
                      <th style="padding: 8px; border: 1px solid #000; width: 85px; text-align: center; font-size: 12px; font-weight: bold;">التوقيت</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 12px; font-weight: bold;">المادة</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 12px; font-weight: bold;">النشاط</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 95px; font-size: 12px; font-weight: bold;">المقطع</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 140px; font-size: 12px; font-weight: bold;">عنوان الحصة</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 120px; font-size: 12px; font-weight: bold;">الهدف / المؤشر</th>
                      <th style="padding: 8px; border: 1px solid #000; font-size: 12px; font-weight: bold;">سير الحصة / المحتوى</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 12px; font-weight: bold;">الوسائل</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 12px; font-weight: bold;">الملاحظات</th>
                  </tr>
              </thead>
              <tbody style="background-color: #fff;">
                  ${rowsHtml}
              </tbody>
          </table>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, `الكراس_اليومي_${date}.pdf`, 'l');
};

// ============================================================================
// 1.5️⃣ تصدير الكراس اليومي الأسبوعي الشامل (Weekly Cahier de texte Export)
// ============================================================================
export const exportWeeklyJournalToPDF = async (
    profile: TeacherProfile,
    weekDates: { dateStr: string; dayNameAr: string }[],
    sessions: Session[],
    weekTitle: string = 'الكراس اليومي الأسبوعي'
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
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    const firstDate = weekDates[0]?.dateStr || '';
    const lastDate = weekDates[weekDates.length - 1]?.dateStr || '';

    let rowsHtml = '';
    weekDates.forEach((day) => {
        const daySessions = sessions.filter(s => s.timing.date === day.dateStr).sort((a, b) => {
            if (a.timing.period === b.timing.period) return (a.timing.startTime || '').localeCompare(b.timing.startTime || '');
            return a.timing.period === 'MORNING' ? -1 : 1;
        });

        // Day Section Header Row
        rowsHtml += `
        <tr style="background-color: #1e293b !important; color: #ffffff !important; -webkit-print-color-adjust: exact;">
            <td colspan="9" style="padding: 8px 12px; font-weight: 900; font-size: 13px; color: #fff !important; text-align: right;">
                ✦ يوم ${day.dayNameAr} (${day.dateStr}) — [عدد الحصص: ${daySessions.length}]
            </td>
        </tr>`;

        if (daySessions.length === 0) {
            rowsHtml += `
            <tr style="border-bottom: 1px solid #000;">
                <td colspan="9" style="padding: 8px; text-align: center; color: #64748b; font-style: italic; font-size: 11px;">
                    لا توجد حصص مسجلة في هذا اليوم
                </td>
            </tr>`;
        } else {
            daySessions.forEach((s) => {
                const isHoliday = s.timing.category === 'HOLIDAY';
                const isBreak = s.timing.category === 'BREAK';

                const subject = s.subject || '';
                const activity = s.activity || '';
                const title = s.title || '';
                const objective = s.objective || '';
                const content = (s.content || '').replace(/\n/g, '<br/>');
                const tools = s.tools || '';
                const notes = s.notes || '';

                let sectionDisplay = '';
                if (s.sectionNumber || s.sectionName) {
                    sectionDisplay = `مقطع ${s.sectionNumber || ''}: ${s.sectionName || ''}`;
                }

                if (isHoliday) {
                    rowsHtml += `
                    <tr style="background-color: #f0fdf4 !important; -webkit-print-color-adjust: exact; border-bottom: 1px solid #000;">
                        <td colspan="9" style="padding: 10px; text-align: center; color: #15803d !important; font-weight: bold; font-size: 12px;">
                            *** عطلة رسمية / مناسبة: ${s.timing.holidayName || ''} ***
                        </td>
                    </tr>`;
                } else if (isBreak) {
                    rowsHtml += `
                    <tr style="background-color: #fff7ed !important; -webkit-print-color-adjust: exact; border-bottom: 1px solid #000;">
                        <td colspan="9" style="padding: 6px; text-align: center; color: #c2410c !important; font-weight: bold; font-size: 12px;">
                            --- استراحة بيداغوجية (${s.timing.breakDuration || 15} د) ---
                        </td>
                    </tr>`;
                } else {
                    const time = `${s.timing.startTime || ''} - ${s.timing.endTime || ''}`;
                    rowsHtml += `
                    <tr style="border-bottom: 1px solid #000; font-size: 10.5px;">
                        <td style="padding: 6px; border-left: 1px solid #000; text-align: center; font-weight: 800; width: 85px;">${time}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; font-weight: bold; width: 80px;">${subject}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; font-weight: bold; width: 80px; color: #047857;">${activity}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; width: 90px; font-size: 9.5px;">${sectionDisplay}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; font-weight: 800; width: 130px;">${title}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; font-size: 9.5px; width: 130px;">${objective}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; font-size: 9.5px; line-height: 1.35;">${content}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; font-size: 9px; width: 80px;">${tools}</td>
                        <td style="padding: 6px; border-left: 1px solid #000; font-size: 9px; width: 75px;">${notes}</td>
                    </tr>`;
                }
            });
        }
    });

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, 'الكراس اليومي الأسبوعي الموحد (دفتر النصوص)', `للأسبوع من الأحد ${firstDate} إلى الخميس ${lastDate}`)}

          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; background: #fff;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb; color: #000;">
                  <tr>
                      <th style="padding: 8px; border: 1px solid #000; width: 85px; text-align: center; font-size: 11px; font-weight: bold;">التوقيت</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 11px; font-weight: bold;">المادة</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 11px; font-weight: bold;">النشاط</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 90px; font-size: 11px; font-weight: bold;">المقطع</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 130px; font-size: 11px; font-weight: bold;">عنوان الحصة</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 130px; font-size: 11px; font-weight: bold;">الهدف / المؤشر</th>
                      <th style="padding: 8px; border: 1px solid #000; font-size: 11px; font-weight: bold;">سير الحصة / المحتوى</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 11px; font-weight: bold;">الوسائل</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 75px; font-size: 11px; font-weight: bold;">الملاحظات</th>
                  </tr>
              </thead>
              <tbody style="background-color: #fff;">
                  ${rowsHtml}
              </tbody>
          </table>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, `الكراس_اليومي_الأسبوعي_${firstDate}_إلى_${lastDate}.pdf`, 'l');
};

// ============================================================================
// 2️⃣ تصدير المذكرة البيداغوجية الذكية (Smart Memo Export)
// ============================================================================
export const exportSmartMemoToPDF = async (
    profile: TeacherProfile,
    memo: any,
    meta: {
        subject: string;
        grade: string;
        unit: string;
        activity: string;
        topic: string;
        memoNumber: string;
        duration: string;
        date: string;
    }
): Promise<void> => {
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 Portrait
    container.style.minHeight = '1123px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    let stepsHtml = '';
    if (memo.steps && Array.isArray(memo.steps)) {
        memo.steps.forEach((st: any) => {
            stepsHtml += `
            <tr>
                <td style="padding: 6px; border: 1px solid #000; font-weight: bold; text-align: center; background: #f9fafb; width: 14%; font-size: 9px;">${st.stage || ''}</td>
                <td style="padding: 6px; border: 1px solid #000; text-align: center; width: 10%; font-size: 9px; font-weight: bold;">${st.objectiveDomain || 'معرفيّ'}</td>
                <td style="padding: 6px; border: 1px solid #000; font-size: 9.5px; line-height: 1.4; width: 34%;">${(st.teacherActivity || '').replace(/\n/g, '<br/>')}</td>
                <td style="padding: 6px; border: 1px solid #000; font-size: 9.5px; line-height: 1.4; width: 22%;">${(st.studentActivity || '').replace(/\n/g, '<br/>')}</td>
                <td style="padding: 6px; border: 1px solid #000; text-align: center; font-size: 9px; width: 10%; font-weight: bold;">${st.evaluationType || st.method || 'تكوينيّ'}</td>
                <td style="padding: 6px; border: 1px solid #000; text-align: center; font-size: 9px; width: 10%;">${st.indicatorsAndTiming || ''}</td>
            </tr>`;
        });
    }

    let integrationHtml = '';
    if (memo.isIntegration) {
        let taskRows = '';
        if (memo.integrationTasks && Array.isArray(memo.integrationTasks)) {
            memo.integrationTasks.forEach((t: any) => {
                taskRows += `
                <tr>
                    <td style="padding: 5px; border: 1px solid #000; font-weight: bold; width: 15%; text-align: center; background: #f9fafb;">${t.section}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 45%;">${t.resources}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 20%; text-align: center;">${t.pattern}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 20%; text-align: center;">${t.indicators}</td>
                </tr>`;
            });
        }

        let rubricRows = '';
        if (memo.rubricCriteria && Array.isArray(memo.rubricCriteria)) {
            memo.rubricCriteria.forEach((r: any) => {
                rubricRows += `
                <tr>
                    <td style="padding: 5px; border: 1px solid #000; font-weight: bold; width: 25%; background: #f9fafb;">${r.criterion}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 45%;">${r.checkMethod}</td>
                    <td style="padding: 5px; border: 1px solid #000; width: 8%; text-align: center;"></td>
                    <td style="padding: 5px; border: 1px solid #000; width: 8%; text-align: center;"></td>
                    <td style="padding: 5px; border: 1px solid #000; width: 14%; font-size: 9px;">${r.remediation || ''}</td>
                </tr>`;
            });
        }

        integrationHtml = `
        <!-- Integration Tasks Table -->
        <div style="font-weight: 900; font-size: 11px; margin: 12px 0 4px 0;">جدول المهام والمقاطع لإنتاج الوضعية الإدماجية:</div>
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 10px; font-size: 10px;">
            <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                <tr>
                    <th style="padding: 5px; border: 1px solid #000;">المقاطع</th>
                    <th style="padding: 5px; border: 1px solid #000;">الموارد المستهدفة</th>
                    <th style="padding: 5px; border: 1px solid #000;">النّمط</th>
                    <th style="padding: 5px; border: 1px solid #000;">المؤشّر</th>
                </tr>
            </thead>
            <tbody>
                ${taskRows}
            </tbody>
        </table>

        <!-- Rubric Grid -->
        <div style="font-weight: 900; font-size: 11px; margin: 10px 0 4px 0;">شبكة التّقييم الذاتي والجماعي للإنتاج:</div>
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 10px; font-size: 9.5px;">
            <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                <tr>
                    <th style="padding: 5px; border: 1px solid #000;">المعيار</th>
                    <th style="padding: 5px; border: 1px solid #000;">طريقة التّحقّق</th>
                    <th style="padding: 5px; border: 1px solid #000; width: 8%;">نعم</th>
                    <th style="padding: 5px; border: 1px solid #000; width: 8%;">لا</th>
                    <th style="padding: 5px; border: 1px solid #000;">المعالجة</th>
                </tr>
            </thead>
            <tbody>
                ${rubricRows}
            </tbody>
        </table>`;
    }

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, `مذكرة بيداغوجية رقم: ${meta.memoNumber || '01'}`, `الموضوع: ${meta.topic}`, meta.grade)}

          <!-- Memo Meta Grid Matching Official Inspection Standard -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; font-size: 11px;">
              <div style="border: 1px solid #000; padding: 8px; background: #f9fafb; line-height: 1.5;">
                  <p style="margin: 0 0 3px 0;"><strong>المؤسسة / الثانوية:</strong> ${profile.institution || memo.institution || 'مدرسة أشبال الأمّة وعواع المدني ن ع 1 –المسيلة-'}</p>
                  <p style="margin: 0 0 3px 0;"><strong>الفئة المستهدفة:</strong> ${meta.grade}</p>
                  <p style="margin: 0 0 3px 0;"><strong>الوحدة التّعلُّمية:</strong> ${memo.unitNumberAndTitle || meta.unit}</p>
                  <p style="margin: 0;"><strong>المدَّة الزّمنية للوحدة:</strong> ${memo.unitDuration || '06 ساعات'}</p>
              </div>
              <div style="border: 1px solid #000; padding: 8px; background: #f9fafb; line-height: 1.5;">
                  <p style="margin: 0 0 3px 0;"><strong>النّشاط:</strong> ${meta.activity}</p>
                  <p style="margin: 0 0 3px 0;"><strong>الموضوع:</strong> ${meta.topic}</p>
                  <p style="margin: 0 0 3px 0;"><strong>السّندات التّربوية:</strong> ${memo.support || meta.unit}</p>
                  <p style="margin: 0;"><strong>الحصة والمدة:</strong> ${meta.memoNumber} (${meta.duration}) • <strong>التاريخ:</strong> ${meta.date}</p>
              </div>
          </div>

          <!-- Competency -->
          <div style="border: 1px solid #000; padding: 8px; margin-bottom: 6px; font-size: 11px; background: #fff;">
              <strong style="text-decoration: underline;">الكفاءة:</strong>
              <span> ${memo.competencyFinal || ''}</span>
          </div>

          <!-- Objectives List -->
          ${memo.objectivesList && memo.objectivesList.length > 0 ? `
          <div style="border: 1px solid #000; padding: 8px; margin-bottom: 6px; font-size: 10.5px;">
              <strong style="text-decoration: underline; margin-bottom: 4px; display: block;">الأهداف التّعلُّميّة:</strong>
              <ul style="margin: 0; padding-right: 20px; line-height: 1.4;">
                  ${memo.objectivesList.map((obj: string) => `<li>${obj}</li>`).join('')}
              </ul>
          </div>` : ''}

          <!-- Tools Note -->
          <div style="border: 1px dashed #666; padding: 6px 8px; margin-bottom: 8px; font-size: 10px; color: #333; background: #fafafa;">
              ${memo.toolsNote || 'ملاحظة: تحدد الوسائل الكتاب المدرسي - الكتب: المصادر والمراجع – الأسناد المكتوبة (المطبوعات و الصور) والمرئية ( فيديو) والمسموعة (تسجيل صوتي).'}
          </div>

          <!-- Steps Table (Official 6 Columns) -->
          <div style="font-weight: 900; font-size: 12px; margin: 8px 0 4px 0;">النُّص الأدبيّ وروافده (سير الحصة والأنشطة البانية للتعلمات):</div>
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 10px;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                  <tr>
                      <th style="padding: 6px; border: 1px solid #000; width: 14%; font-size: 10px; font-weight: 900;">وضعيّات التَّعلُّم</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 10%; font-size: 10px; font-weight: 900;">الهدف التعلُّمي</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 34%; font-size: 10px; font-weight: 900;">نشاطُ الأُستاذ</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 22%; font-size: 10px; font-weight: 900;">نشاطُ المُتعلِّم</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 10%; font-size: 10px; font-weight: 900;">التّقويم</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 10%; font-size: 10px; font-weight: 900;">معايير ومؤشّرات الإنجاز</th>
                  </tr>
              </thead>
              <tbody>
                  ${stepsHtml}
              </tbody>
          </table>

          ${integrationHtml}

          <!-- Pedagogical Notes & Remediation -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; font-size: 10px;">
              <div style="border: 1px solid #000; padding: 6px;">
                  <strong style="text-decoration: underline;">الدعم والمعالجة البيداغوجية:</strong>
                  <p style="margin: 2px 0 0 0;">${memo.remediation || 'متابعة فردية للمتعثرين وتثبيت القواعد الأساسية'}</p>
              </div>
              <div style="border: 1px solid #000; padding: 6px;">
                  <strong style="text-decoration: underline;">القيم والتوجهات الوطنية:</strong>
                  <p style="margin: 2px 0 0 0;">${memo.values || 'الاعتزاز باللغة العربية والهوية الوطنية والأخلاق الفاضلة'}</p>
              </div>
          </div>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    `;

    const cleanTitle = (meta.topic || 'مذكرة').replace(/[\s/\\:]+/g, '_');
    await renderAndDownloadPDF(container, `مذكرة_${cleanTitle}.pdf`, 'p');
};

// ============================================================================
// 2️⃣ ب تصدير التوزيع السنوي والشهري للمنهاج (Official Syllabus Distribution)
// ============================================================================
export const exportSyllabusDistributionToPDF = async (
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
            rowsHtml += `
            <tr style="${w.isExamPeriod ? 'background-color: #fef3c7; font-weight: bold;' : ''}">
                <td style="padding: 8px 5px; border: 1px solid #000; text-align: center; font-weight: 900; width: 6%; font-size: 10px;">${w.weekNumber}</td>
                <td style="padding: 8px 5px; border: 1px solid #000; text-align: center; font-weight: bold; width: 8%; font-size: 10px;">${w.monthNameAr}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 18%; font-size: 10px; font-weight: bold;">${w.unitTitle}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 22%; font-size: 10px;">${w.literaryText}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 16%; font-size: 10px;">${w.grammar}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 14%; font-size: 10px;">${w.rhetoricOrProsody || '—'}</td>
                <td style="padding: 8px 6px; border: 1px solid #000; width: 16%; font-size: 10px;">${w.writingOrIntegration}</td>
            </tr>`;
        });
    } else {
        // Full annual progression
        const trimesters = activeTrimester === 'all'
            ? dist.trimesters
            : dist.trimesters.filter((t: any) => t.trimester === activeTrimester);

        trimesters.forEach((trim: any) => {
            trim.months.forEach((m: any) => {
                m.weeks.forEach((w: any) => {
                    rowsHtml += `
                    <tr style="${w.isExamPeriod ? 'background-color: #fef3c7; font-weight: bold;' : ''}">
                        <td style="padding: 5px; border: 1px solid #000; text-align: center; font-weight: 900; width: 4%; font-size: 9.5px;">${w.weekNumber}</td>
                        <td style="padding: 5px; border: 1px solid #000; text-align: center; font-weight: bold; width: 7%; font-size: 9.5px;">${w.monthNameAr}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 17%; font-size: 9.5px; font-weight: bold;">${w.unitTitle}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 22%; font-size: 9.5px;">${w.literaryText}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 17%; font-size: 9.5px;">${w.grammar}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 15%; font-size: 9.5px;">${w.rhetoricOrProsody || '—'}</td>
                        <td style="padding: 5px; border: 1px solid #000; width: 18%; font-size: 9.5px;">${w.writingOrIntegration}</td>
                    </tr>`;
                });
            });
        });
    }

    const docMainTitle = scope === 'monthly'
        ? `التوزيع الشهري الرسمي لمنهاج اللغة العربية — شهر ${targetMonthName}`
        : 'التوزيع السنوي الرسمي لمنهاج اللغة العربية وآدابها (الجيل الثاني)';

    const docSubTitle = scope === 'monthly'
        ? `المستوى: ${dist.grade} (${dist.stream}) — الفصل: ${targetSemester} — الحجم الساعي: ${dist.weeklyHours} سا/أسبوعياً`
        : `المستوى: ${dist.grade} (${dist.stream}) — العام الدراسي: ${dist.academicYear} — الحجم الساعي: ${dist.weeklyHours} سا/أسبوعياً`;

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, docMainTitle, docSubTitle, `الموسم: ${dist.academicYear}`)}

          <!-- Meta Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid #000; padding: 6px 12px; margin-bottom: 10px; font-size: 11px; background: #f9fafb;">
              <span><strong>المؤسسة:</strong> ${profile.institution || 'ثانوية معتمدة'}</span>
              <span><strong>الأستاذ(ة):</strong> ${profile.name || 'أستاذ التعليم الثانوي'}</span>
              <span><strong>المادة:</strong> ${dist.subject}</span>
              <span><strong>نوع الوثيقة:</strong> ${scope === 'monthly' ? `توزيع شهري رسمي (شهر ${targetMonthName})` : (activeTrimester === 'all' ? 'توزيع سنوي شامل (3 فصول)' : `توزيع الفصل ${activeTrimester}`)}</span>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 12px; font-size: ${scope === 'monthly' ? '10px' : '9.5px'};">
              <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                <tr>
                  <th style="padding: 6px; border: 1px solid #000; width: ${scope === 'monthly' ? '6%' : '4%'}; text-align: center;">الأسبوع</th>
                  <th style="padding: 6px; border: 1px solid #000; width: ${scope === 'monthly' ? '8%' : '7%'}; text-align: center;">الشهر</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 17%;">الوحدة والمحور الأدبي</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 22%;">النص الأدبي والقراءة</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 17%;">قواعد اللغة والإعراب</th>
                  <th style="padding: 6px; border: 1px solid #000; width: 15%;">البلاغة والعروض</th>
                  <th style="padding: 6px; border: 1px solid #000; width: ${scope === 'monthly' ? '16%' : '18%'};">الوضعية الإدماجية والإنتاج</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
          </table>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    `;

    const cleanTitle = `${dist.grade}_${dist.stream}`.replace(/[\s/\\:]+/g, '_');
    const finalFilename = scope === 'monthly'
        ? `التوزيع_الشهري_${targetMonthName}_${cleanTitle}.pdf`
        : `التوزيع_السنوي_الشامل_${cleanTitle}.pdf`;

    await renderAndDownloadPDF(container, finalFilename, 'l');
};

// 3️⃣ تصدير محضر النقاط الرسمي (Official Grading Sheet Export)
// ============================================================================
export const exportGradingSheetToPDF = async (
    profile: TeacherProfile,
    options: {
        grade: string;
        group: string;
        termLabel: string;
        students: any[];
        scores: Record<string, Record<string, string>>;
        fields: { key: string; label: string }[];
    }
): Promise<void> => {
    const { grade, group, termLabel, students, scores, fields } = options;
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '1123px'; // A4 Landscape
    container.style.minHeight = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    let rowsHtml = '';
    students.forEach((s, idx) => {
        const studentScores = scores[s.id] || {};
        let scoreCells = '';
        fields.forEach(f => {
            const val = studentScores[f.key] || '-';
            scoreCells += `<td style="padding: 6px; border: 1px solid #000; text-align: center; font-weight: bold; font-size: 11px;">${val}</td>`;
        });

        rowsHtml += `
        <tr>
            <td style="padding: 6px; border: 1px solid #000; text-align: center; font-size: 11px; width: 40px;">${idx + 1}</td>
            <td style="padding: 6px; border: 1px solid #000; font-size: 10px; width: 100px; text-align: center;">${s.registrationNumber || '-'}</td>
            <td style="padding: 6px; border: 1px solid #000; font-weight: bold; font-size: 11px;">${s.lastName} ${s.firstName}</td>
            ${scoreCells}
            <td style="padding: 6px; border: 1px solid #000; font-size: 10px; width: 120px; text-align: center;">${studentScores.remarks || 'عمل مستمر'}</td>
        </tr>`;
    });

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, 'محضر النقاط والتقويم البيداغوجي', `${grade} — الفوج: ${group} (${termLabel})`)}

          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 12px;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                  <tr>
                      <th style="padding: 8px; border: 1px solid #000; width: 40px; font-size: 11px;">الرقم</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 100px; font-size: 11px;">رقم التسجيل</th>
                      <th style="padding: 8px; border: 1px solid #000; font-size: 11px;">اللقب والاسم</th>
                      ${fields.map(f => `<th style="padding: 8px; border: 1px solid #000; font-size: 11px; text-align: center;">${f.label}</th>`).join('')}
                      <th style="padding: 8px; border: 1px solid #000; width: 120px; font-size: 11px;">التقدير والملاحظة</th>
                  </tr>
              </thead>
              <tbody>
                  ${rowsHtml}
              </tbody>
          </table>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, `محضر_نقاط_${grade}_الفوج_${group}.pdf`, 'l');
};

// ============================================================================
// 4️⃣ تصدير سجل متابعة الغياب والمواظبة (Attendance / Absence Report Export)
// ============================================================================
export const exportAbsenceReportToPDF = async (
    profile: TeacherProfile,
    options: {
        grade: string;
        group: string;
        date: string;
        students: any[];
        attendanceMap: Record<string, string>;
    }
): Promise<void> => {
    const { grade, group, date, students, attendanceMap } = options;
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 Portrait
    container.style.minHeight = '1123px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    const presentCount = Object.values(attendanceMap).filter(s => s === 'PRESENT').length;
    const absentCount = Object.values(attendanceMap).filter(s => s === 'ABSENT').length;
    const lateCount = Object.values(attendanceMap).filter(s => s === 'LATE').length;
    const excusedCount = Object.values(attendanceMap).filter(s => s === 'EXCUSED').length;

    let rowsHtml = '';
    students.forEach((s, idx) => {
        const status = attendanceMap[s.id] || 'PRESENT';
        let statusBadge = '<span style="color: #15803d; font-weight: bold;">حاضر</span>';
        if (status === 'ABSENT') statusBadge = '<span style="color: #b91c1c; font-weight: bold;">غائب</span>';
        if (status === 'LATE') statusBadge = '<span style="color: #c2410c; font-weight: bold;">متأخر</span>';
        if (status === 'EXCUSED') statusBadge = '<span style="color: #2563eb; font-weight: bold;">مبرر</span>';

        rowsHtml += `
        <tr>
            <td style="padding: 6px; border: 1px solid #000; text-align: center; font-size: 11px; width: 40px;">${idx + 1}</td>
            <td style="padding: 6px; border: 1px solid #000; font-size: 10px; width: 110px; text-align: center;">${s.registrationNumber || '-'}</td>
            <td style="padding: 6px; border: 1px solid #000; font-weight: bold; font-size: 11px;">${s.lastName} ${s.firstName}</td>
            <td style="padding: 6px; border: 1px solid #000; text-align: center; font-size: 11px; width: 100px;">${statusBadge}</td>
            <td style="padding: 6px; border: 1px solid #000; font-size: 10px; width: 130px; text-align: center;">...........................</td>
        </tr>`;
    });

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, 'سجل متابعة الغياب والمواظبة', `${grade} — الفوج: ${group} (بتاريخ: ${date})`)}

          <!-- Stats Bar -->
          <div style="display: flex; justify-content: space-around; background: #f3f4f6; border: 1px solid #000; padding: 8px; margin-bottom: 12px; font-size: 11px; font-weight: bold;">
              <span>إجمالي الفوج: ${students.length}</span>
              <span style="color: #15803d;">الحضور: ${presentCount}</span>
              <span style="color: #b91c1c;">الغياب: ${absentCount}</span>
              <span style="color: #c2410c;">التأخر: ${lateCount}</span>
              <span style="color: #2563eb;">المبرر: ${excusedCount}</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 12px;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                  <tr>
                      <th style="padding: 6px; border: 1px solid #000; width: 40px; font-size: 11px;">الرقم</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 110px; font-size: 11px;">رقم التسجيل</th>
                      <th style="padding: 6px; border: 1px solid #000; font-size: 11px;">اللقب والاسم</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 100px; font-size: 11px;">الحالة</th>
                      <th style="padding: 6px; border: 1px solid #000; width: 130px; font-size: 11px;">الملاحظة والإجراء</th>
                  </tr>
              </thead>
              <tbody>
                  ${rowsHtml}
              </tbody>
          </table>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showAdvisor: true, showDirector: true, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, `غياب_${grade}_${date}.pdf`, 'p');
};

// ============================================================================
// 5️⃣ تصدير موضوع الاختبار والتقويم الرسمي (Exam & Test Paper Export)
// ============================================================================
export const exportExamToPDF = async (
    profile: TeacherProfile,
    options: {
        subject: string;
        level: string;
        examType: string;
        duration?: string;
        coefficient?: string;
        content: string;
    }
): Promise<void> => {
    const { subject, level, examType, duration = 'ساعة ونصف', coefficient = '2', content } = options;
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 Portrait
    container.style.minHeight = '1123px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, examType || 'اختبار تقويمي', `المادة: ${subject} — ${level}`)}

          <!-- Exam Specific Header Banner -->
          <div style="display: flex; justify-content: space-between; background: #f3f4f6; border: 1px solid #000; padding: 8px 12px; margin-bottom: 16px; font-size: 11px; font-weight: bold;">
              <span>المستوى: ${level}</span>
              <span>المادة: ${subject}</span>
              <span>المدة الزمنية: ${duration}</span>
              <span>المعامل: ${coefficient}</span>
          </div>

          <!-- Exam Content -->
          <div style="border: 1px solid #000; padding: 16px; flex: 1; min-height: 400px; font-size: 12px; line-height: 1.8; white-space: pre-wrap; font-family: 'Cairo', sans-serif;">
${content}
          </div>

          <div style="text-align: center; margin-top: 15px; font-size: 11px; font-weight: 900;">
              *** انتهى الموضوع • بالتوفيق والنجاح للجميع ***
          </div>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, `اختبار_${subject}_${level}.pdf`, 'p');
};

// ============================================================================
// 6️⃣ تصدير ورقة العمل والوضعية الإدماجية (Worksheet Export)
// ============================================================================
export const exportWorksheetToPDF = async (
    profile: TeacherProfile,
    options: {
        title: string;
        subject: string;
        level: string;
        content: string;
    }
): Promise<void> => {
    const { title, subject, level, content } = options;
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 Portrait
    container.style.minHeight = '1123px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, 'ورقة عمل بيداغوجية', title, level)}

          <!-- Student Name Strip -->
          <div style="display: flex; justify-content: space-between; border: 1px solid #000; padding: 6px 12px; margin-bottom: 15px; font-size: 11px; background: #f9fafb;">
              <span>اللقب والاسم: .................................................</span>
              <span>القسم: .....................</span>
              <span>الفوج: ........</span>
              <span>العلامة: ..... / 20</span>
          </div>

          <!-- Worksheet Body -->
          <div style="border: 1px solid #000; padding: 16px; flex: 1; font-size: 12px; line-height: 1.7; white-space: pre-wrap; font-family: 'Cairo', sans-serif;">
${content}
          </div>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: false, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, `ورقة_عمل_${title.replace(/[\s/\\:]+/g, '_')}.pdf`, 'p');
};

// ============================================================================
// 7️⃣ تصدير وثيقة رسمية مخصصة (Custom Official Document Export)
// ============================================================================
export const exportCustomOfficialDocumentToPDF = async (
    profile: TeacherProfile,
    options: {
        documentTitle: string;
        documentSubtitle: string;
        contentHtml: string;
        orientation?: 'p' | 'l';
        filename: string;
        showInspector?: boolean;
    }
): Promise<void> => {
    const {
        documentTitle,
        documentSubtitle,
        contentHtml,
        orientation = 'p',
        filename,
        showInspector = true
    } = options;

    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = orientation === 'l' ? '1123px' : '794px';
    container.style.minHeight = orientation === 'l' ? '794px' : '1123px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, documentTitle, documentSubtitle)}

          <div style="flex: 1; min-height: 400px; font-size: 11px;">
              ${contentHtml}
          </div>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, filename, orientation);
};

// ============================================================================
// 8️⃣ تصدير جدول التوقيت الأسبوعي الرسمي (Official Timetable PDF Export)
// ============================================================================
export const exportTimetableToPDF = async (
    profile: TeacherProfile,
    options: {
        metadata: any;
        schedule: { dayIdx: number; timeIdx: number; period: 'morning' | 'afternoon'; subject: string }[];
        activities?: { name: string; periods: number; timeVolume: string }[];
        type?: 'teacher' | 'class';
        template?: 'classic' | 'flowers' | 'standard';
    }
): Promise<void> => {
    const { metadata, schedule, activities = [], type = 'class' } = options;
    const targetTemplate = options.template || metadata?.template || 'classic';
    const isFlowers = targetTemplate === 'flowers';
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    const isPrimary = metadata?.stage === 'primary' || !metadata?.stage;
    const isMiddle = metadata?.stage === 'middle';
    const isSecondary = metadata?.stage === 'secondary';

    const getStageTitle = () => {
        if (isMiddle) return 'التعليم المتوسط';
        if (isSecondary) return 'التعليم الثانوي';
        return 'التعليم الابتدائي';
    };

    const getSystem = () => {
        if (metadata?.system === 'one-shift') return 'الدوام الواحد';
        if (metadata?.system === 'two-shifts') return 'نظام الدوامين';
        if (metadata?.system === 'full-shift') return 'الدوام الكلي';
        if (metadata?.system === 'partial-shift') return 'الدوام الجزئي';
        return metadata?.system || 'الدوام العادي';
    };

    const getSubTitle = () => {
        if (!metadata?.level) return 'جدول التوقيت';
        if (metadata.level === 'prep') return 'القسم التحضيري';
        const lvlNum = String(metadata.level).replace(/[^0-9]/g, '');
        const text = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'][parseInt(lvlNum) - 1] || metadata.level;
        return `للسنة ${text}`;
    };

    const targetTitle = type === 'teacher'
        ? `جدول توقيت الأستاذ(ة): ${metadata?.teacherName || profile.name}`
        : `التوقيت الأسبوعي ${getSubTitle()}`;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '1123px'; // A4 Landscape
    container.style.minHeight = '794px';
    container.style.backgroundColor = isFlowers ? '#fffefb' : '#ffffff';
    container.style.color = '#000000';
    container.style.padding = isFlowers ? '20px 26px' : '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';
    if (isFlowers) {
        container.style.border = '4px double #b45309';
        container.style.outline = '1.5px solid #047857';
        container.style.outlineOffset = '-6px';
    }

    const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const getSubject = (dayIdx: number, timeIdx: number, period: 'morning' | 'afternoon') => {
        const item = schedule.find(s => s.dayIdx === dayIdx && s.timeIdx === timeIdx && s.period === period);
        return item ? item.subject : '';
    };

    // Build Activities Header & Rows
    let actHeadersHtml = '';
    let actPeriodsHtml = '';
    let actVolumesHtml = '';
    if (activities.length > 0) {
        activities.forEach(act => {
            actHeadersHtml += `<th style="border: 1px solid #000; padding: 4px; font-size: 10px; font-weight: bold; background-color: #f3f4f6;">${act.name}</th>`;
            actPeriodsHtml += `<td style="border: 1px solid #000; padding: 4px; font-size: 10px; text-align: center; font-weight: bold;">${String(act.periods).padStart(2, '0')}</td>`;
            actVolumesHtml += `<td style="border: 1px solid #000; padding: 4px; font-size: 9px; text-align: center;">${act.timeVolume} سا</td>`;
        });
    }

    const timingConfig = getTimetableTimingConfig(metadata?.stage, metadata?.system);
    const hasAfternoonBreak = Boolean(timingConfig.afternoonRecessTime);

    // Build Timetable Schedule Rows
    let scheduleRowsHtml = '';
    DAYS.forEach((day, dIdx) => {
        const m0 = getSubject(dIdx, 0, 'morning');
        const m1 = getSubject(dIdx, 1, 'morning');
        const m2 = getSubject(dIdx, 2, 'morning');
        const m3 = getSubject(dIdx, 3, 'morning');

        const a0 = getSubject(dIdx, 0, 'afternoon');
        const a1 = getSubject(dIdx, 1, 'afternoon');
        const a2 = getSubject(dIdx, 2, 'afternoon');
        const a3 = getSubject(dIdx, 3, 'afternoon');

        scheduleRowsHtml += `
        <tr style="height: 38px; border-bottom: 1px solid #000;">
            <th style="border: 1px solid #000; padding: 4px; font-weight: 900; font-size: 11px; background-color: #f3f4f6; width: 68px; text-align: center;">${day}</th>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px;">${m0}</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px;">${m1}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 8.5px; font-weight: bold; background-color: #f8fafc; color: #64748b; width: 34px;">${timingConfig.morningRecessDuration}</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px;">${m2}</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px;">${m3}</td>
            <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 8px; font-weight: bold; background-color: #f1f5f9; color: #475569; width: 34px;">زوال</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px; background-color: #fafafa;">${a0}</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px; background-color: #fafafa;">${a1}</td>
            ${hasAfternoonBreak ? `
            <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 8.5px; font-weight: bold; background-color: #f8fafc; color: #64748b; width: 34px;">${timingConfig.afternoonRecessDuration}</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px; background-color: #fafafa;">${a2}</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px; background-color: #fafafa;">${a3}</td>
            ` : `
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px; background-color: #fafafa;">${a2}</td>
            <td style="border: 1px solid #000; padding: 3px; text-align: center; font-weight: bold; font-size: 10px; background-color: #fafafa;">${a3}</td>
            `}
        </tr>`;
    });

    const timeHeaders = `
        <tr class="bg-gray-header" style="background-color: #e5e7eb; font-size: 10px; font-weight: bold;">
            <th style="border: 1px solid #000; padding: 4px; width: 68px;" rowspan="2">اليوم</th>
            <th style="border: 1px solid #000; padding: 4px;" colspan="2">الفترة الصباحية (أولى)</th>
            <th style="border: 1px solid #000; padding: 2px; width: 34px; background: #fff;" rowspan="2">
                <div style="font-size: 8px; font-weight: 900; line-height: 1.1;">استراحة<br/>${timingConfig.morningRecessDuration}</div>
                <div style="font-size: 7px; color: #555; margin-top: 2px;">${timingConfig.morningRecessTime}</div>
            </th>
            <th style="border: 1px solid #000; padding: 4px;" colspan="2">الفترة الصباحية (ثانية)</th>
            <th style="border: 1px solid #000; padding: 2px; width: 34px; background: #f3f4f6;" rowspan="2">
                <div style="font-size: 8px; font-weight: 900; line-height: 1.1;">استراحة<br/>الزوال</div>
                <div style="font-size: 7px; color: #555; margin-top: 2px;">${timingConfig.middayTime}</div>
            </th>
            <th style="border: 1px solid #000; padding: 4px;" colspan="${hasAfternoonBreak ? 2 : 4}">
                ${hasAfternoonBreak ? 'الفترة المسائية (أولى)' : timingConfig.afternoonTitle}
            </th>
            ${hasAfternoonBreak ? `
            <th style="border: 1px solid #000; padding: 2px; width: 34px; background: #fff;" rowspan="2">
                <div style="font-size: 8px; font-weight: 900; line-height: 1.1;">استراحة<br/>${timingConfig.afternoonRecessDuration}</div>
                <div style="font-size: 7px; color: #555; margin-top: 2px;">${timingConfig.afternoonRecessTime}</div>
            </th>
            <th style="border: 1px solid #000; padding: 4px;" colspan="2">
                الفترة المسائية (ثانية - حتى ${timingConfig.endTime})
            </th>
            ` : ''}
        </tr>
        <tr style="background-color: #f9fafb; font-size: 8.5px; font-weight: 900;">
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.morningHours[0]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.morningDurations[0]})</span></th>
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.morningHours[1]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.morningDurations[1]})</span></th>
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.morningHours[2]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.morningDurations[2]})</span></th>
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.morningHours[3]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.morningDurations[3]})</span></th>

            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.afternoonHours[0]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.afternoonDurations[0]})</span></th>
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.afternoonHours[1]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.afternoonDurations[1]})</span></th>
            ${hasAfternoonBreak ? `
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.afternoonHours[2]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.afternoonDurations[2]})</span></th>
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.afternoonHours[3]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.afternoonDurations[3]})</span></th>
            ` : `
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.afternoonHours[2]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.afternoonDurations[2]})</span></th>
            <th style="border: 1px solid #000; padding: 2px;">${timingConfig.afternoonHours[3]}<br/><span style="font-size: 7.5px; font-weight: normal; color: #555;">(${timingConfig.afternoonDurations[3]})</span></th>
            `}
        </tr>
    `;

    const isStandard = targetTemplate === 'standard';
    const floralCornersHTML = isFlowers ? `
      <!-- Top-Right Floral Ornament -->
      <div style="position: absolute; top: 6px; right: 6px; width: 66px; height: 66px; pointer-events: none; z-index: 10;">
        <svg width="66" height="66" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,90 Q15,30 90,10" stroke="#b45309" stroke-width="2.5" fill="none"/>
          <path d="M15,85 Q25,35 85,25" stroke="#047857" stroke-width="1.8" fill="none"/>
          <circle cx="85" cy="15" r="5" fill="#d97706"/>
          <circle cx="85" cy="15" r="2.2" fill="#fef3c7"/>
          <circle cx="70" cy="18" r="4" fill="#059669"/>
          <circle cx="82" cy="32" r="4" fill="#059669"/>
          <path d="M35,60 Q55,40 65,58 Q48,50 35,60 Z" fill="#047857" opacity="0.85"/>
          <path d="M52,42 Q72,22 82,40 Q64,32 52,42 Z" fill="#b45309" opacity="0.75"/>
          <circle cx="15" cy="85" r="3.5" fill="#b45309"/>
        </svg>
      </div>
      <!-- Top-Left Floral Ornament -->
      <div style="position: absolute; top: 6px; left: 6px; width: 66px; height: 66px; pointer-events: none; z-index: 10; transform: scaleX(-1);">
        <svg width="66" height="66" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,90 Q15,30 90,10" stroke="#b45309" stroke-width="2.5" fill="none"/>
          <path d="M15,85 Q25,35 85,25" stroke="#047857" stroke-width="1.8" fill="none"/>
          <circle cx="85" cy="15" r="5" fill="#d97706"/>
          <circle cx="85" cy="15" r="2.2" fill="#fef3c7"/>
          <circle cx="70" cy="18" r="4" fill="#059669"/>
          <circle cx="82" cy="32" r="4" fill="#059669"/>
          <path d="M35,60 Q55,40 65,58 Q48,50 35,60 Z" fill="#047857" opacity="0.85"/>
          <path d="M52,42 Q72,22 82,40 Q64,32 52,42 Z" fill="#b45309" opacity="0.75"/>
          <circle cx="15" cy="85" r="3.5" fill="#b45309"/>
        </svg>
      </div>
      <!-- Bottom-Right Floral Ornament -->
      <div style="position: absolute; bottom: 6px; right: 6px; width: 66px; height: 66px; pointer-events: none; z-index: 10; transform: scaleY(-1);">
        <svg width="66" height="66" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,90 Q15,30 90,10" stroke="#b45309" stroke-width="2.5" fill="none"/>
          <path d="M15,85 Q25,35 85,25" stroke="#047857" stroke-width="1.8" fill="none"/>
          <circle cx="85" cy="15" r="5" fill="#d97706"/>
          <circle cx="85" cy="15" r="2.2" fill="#fef3c7"/>
          <circle cx="70" cy="18" r="4" fill="#059669"/>
          <circle cx="82" cy="32" r="4" fill="#059669"/>
          <path d="M35,60 Q55,40 65,58 Q48,50 35,60 Z" fill="#047857" opacity="0.85"/>
          <path d="M52,42 Q72,22 82,40 Q64,32 52,42 Z" fill="#b45309" opacity="0.75"/>
          <circle cx="15" cy="85" r="3.5" fill="#b45309"/>
        </svg>
      </div>
      <!-- Bottom-Left Floral Ornament -->
      <div style="position: absolute; bottom: 6px; left: 6px; width: 66px; height: 66px; pointer-events: none; z-index: 10; transform: scale(-1, -1);">
        <svg width="66" height="66" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,90 Q15,30 90,10" stroke="#b45309" stroke-width="2.5" fill="none"/>
          <path d="M15,85 Q25,35 85,25" stroke="#047857" stroke-width="1.8" fill="none"/>
          <circle cx="85" cy="15" r="5" fill="#d97706"/>
          <circle cx="85" cy="15" r="2.2" fill="#fef3c7"/>
          <circle cx="70" cy="18" r="4" fill="#059669"/>
          <circle cx="82" cy="32" r="4" fill="#059669"/>
          <path d="M35,60 Q55,40 65,58 Q48,50 35,60 Z" fill="#047857" opacity="0.85"/>
          <path d="M52,42 Q72,22 82,40 Q64,32 52,42 Z" fill="#b45309" opacity="0.75"/>
          <circle cx="15" cy="85" r="3.5" fill="#b45309"/>
        </svg>
      </div>
    ` : '';

    const specialtyMap: Record<string, string> = {
      'arabic': 'لغة عربية', 'french': 'لغة فرنسية', 'english': 'لغة إنجليزية', 'pe': 'تربية بدنية ورياضية',
      'math': 'رياضيات', 'physics': 'العلوم الفيزيائية والتكنولوجيا', 'science': 'علوم الطبيعة والحياة',
      'history_geo': 'تاريخ وجغرافيا', 'islamic': 'تربية إسلامية', 'civics': 'تربية مدنية', 'informatics': 'إعلام آلي',
      'philosophy': 'فلسفة', 'accounting': 'تسيير محاسبي ومالي', 'engineering': 'هندسة'
    };
    const translatedSpecialty = metadata?.specialty ? specialtyMap[metadata.specialty] || metadata.specialty : '';
    const titleExt = isStandard ? ' • النموذج القياسي الموحد' : (isFlowers ? ' • نموذج رياحين والبطاقات الزخرفي' : '');

    const formatLevels = (lvlStr: string, stage: string) => {
        if (!lvlStr) return '';
        const levels = lvlStr.split(',');
        const formatted = levels.map(l => {
            if (l === 'm1') return '1م';
            if (l === 'm2') return '2م';
            if (l === 'm3') return '3م';
            if (l === 'm4') return '4م';
            if (l === 's1') return '1ثا';
            if (l === 's2') return '2ثا';
            if (l === 's3') return '3ثا';
            return l;
        });
        return formatted.join('، ');
    };
    const teacherLevels = type === 'teacher' && metadata?.stage && metadata.stage !== 'primary' ? formatLevels(metadata?.level, metadata.stage) : '';
    const leftMeta = type === 'teacher' && metadata?.stage && metadata.stage !== 'primary' 
        ? `التخصص: ${translatedSpecialty} ${teacherLevels ? `• الأقسام المسندة: ${teacherLevels}` : ''}` 
        : metadata?.level || '';

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: ${isFlowers ? '#fef3c7' : (isStandard ? '#f8fafc' : '#e5e7eb')} !important; -webkit-print-color-adjust: exact; }
      </style>
      ${floralCornersHTML}
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: ${isFlowers ? '#fffefb' : '#fff'}; position: relative; z-index: 2;">
          ${getOfficialAlgerianHeaderHTML(profile, isFlowers ? `🌸 ${targetTitle} 🌸` : targetTitle, `${timingConfig.stageTitle} — ${timingConfig.systemTitle}${titleExt}`, leftMeta)}

          <!-- Metadata Strip -->
          <div style="display: flex; justify-content: space-between; border: 1px solid #000; padding: 5px 12px; margin-bottom: 6px; font-size: 9.5px; background: ${isFlowers ? '#fefce8' : (isStandard ? '#f8fafc' : '#f9fafb')};">
              <span><strong>المؤسسة:</strong> ${metadata?.schoolName || profile.institution}</span>
              ${metadata?.stage && metadata.stage !== 'primary' ? `<span><strong>التخصص:</strong> ${translatedSpecialty}</span>` : `<span><strong>المقاطعة البيداغوجية:</strong> ${metadata?.inspectorate || profile.pedagogicalDistrict || 'المقاطعة الأولى'}</span>`}
              <span><strong>الأستاذ(ة):</strong> ${metadata?.teacherName || profile.name}</span>
              <span><strong>نظام التمدرس:</strong> ${timingConfig.systemTitle} (ينتهي ${timingConfig.endTime})</span>
              <span><strong>رقم الحجرة:</strong> ${metadata?.room || '....'}</span>
              <span><strong>السنة الدراسية:</strong> ${metadata?.year || profile.academicYear}</span>
          </div>

          <!-- Upper Activities Table -->
          ${activities.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000; margin-bottom: 6px; text-align: center;">
              <thead>
                  <tr>
                      <th style="border: 1px solid #000; padding: 3px; font-size: 9.5px; font-weight: 900; background: #e5e7eb; width: 78px;">${type === 'teacher' && metadata?.stage !== 'primary' ? 'الأفواج المسندة' : 'الأنشطة'}</th>
                      ${actHeadersHtml}
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <th style="border: 1px solid #000; padding: 3px; font-size: 9.5px; font-weight: 900; background: #f3f4f6;">ع. الحصص</th>
                      ${actPeriodsHtml}
                  </tr>
                  <tr>
                      <th style="border: 1px solid #000; padding: 3px; font-size: 9px; font-weight: 900; background: #f3f4f6;">الحجم الساعي</th>
                      ${actVolumesHtml}
                  </tr>
              </tbody>
          </table>` : ''}

          <!-- Main Weekly Timetable Grid -->
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 6px; text-align: center;">
              <thead>
                  ${timeHeaders}
              </thead>
              <tbody>
                  ${scheduleRowsHtml}
              </tbody>
          </table>

          <!-- Official Guidelines Reference (الجملتان الأخيرتان في إطار مستقل بدون أي تداخل) -->
          <div style="border-top: 1.5px solid #000; margin-top: 6px; padding-top: 4px; margin-bottom: 10px; font-size: 8.5px; line-height: 1.4; color: #222; display: flex; justify-content: space-between; align-items: center;">
              <div>
                  <p style="margin: 0; font-weight: bold;">• منجز وفق الدليل التطبيقي لشبكة مواقيت التعليم ${timingConfig.stageTitle} الصادر عن المفتشية العامة للبيداغوجيا بوزارة التربية الوطنية.</p>
                  <p style="margin: 0; font-weight: bold;">• التوقيت الأسبوعي المعتمد للسنة الدراسية ${metadata?.year || profile.academicYear} — ${timingConfig.systemTitle} (ينتهي التوقيت عند الساعة ${timingConfig.endTime}).</p>
              </div>
              <div style="font-size: 8px; color: #666; font-weight: bold;">
                  وثيقة رسمية معتمدة
              </div>
          </div>

          <!-- Signatures Section (مساحة التوقيعات والأختام الثلاثية مع مسافة كافية للختم وبدون أي تداخل) -->
          <div style="margin-top: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; padding: 0 40px; font-family: 'Cairo', sans-serif;">
              <div style="text-align: center; width: 220px;">
                  <p style="font-weight: 900; font-size: 11px; margin-bottom: 40px; color: #000;">توقيع وختم الأستاذ(ة)</p>
                  <p style="font-size: 10px; color: #888;">.........................................</p>
              </div>
              <div style="text-align: center; width: 220px;">
                  <p style="font-weight: 900; font-size: 11px; margin-bottom: 40px; color: #000;">تأشيرة وختم السيد المدير</p>
                  <p style="font-size: 10px; color: #888;">.........................................</p>
              </div>
              <div style="text-align: center; width: 220px;">
                  <p style="font-weight: 900; font-size: 11px; margin-bottom: 40px; color: #000;">تأشيرة وتوقيع السيد المفتش</p>
                  <p style="font-size: 10px; color: #888;">.........................................</p>
              </div>
          </div>

          <!-- Official Security & Timestamp Bar -->
          <div style="border-top: 1px solid #aaa; padding-top: 4px; display: flex; justify-content: space-between; font-size: 8px; color: #555; font-family: 'Cairo', sans-serif;">
              <span>منصة تمكين الرقمية للأستاذ الجزائري • وثيقة بيداغوجية رسمية صادرة آلياً</span>
              <span>المعرف الرقمي: ${profile.tamkeenId || 'TAMKEEN-PRO'}</span>
              <span>تاريخ وتوقيت الاستخراج: ${new Date().toLocaleDateString('ar-DZ')} — ${exportTime}</span>
          </div>
      </div>
    `;

    const cleanFilename = `جدول_التوقيت_الرسمي_${(metadata?.teacherName || profile.name || 'الأستاذ').replace(/[\s/\\:]+/g, '_')}.pdf`;
    await renderAndDownloadPDF(container, cleanFilename, 'l');
};

// ============================================================================
// 9️⃣ تصدير جدول التوقيت بصيغة Word (.doc) القابلة للتحرير
// ============================================================================
export const exportTimetableToWord = async (
    profile: TeacherProfile,
    options: {
        metadata: any;
        schedule: { dayIdx: number; timeIdx: number; period: 'morning' | 'afternoon'; subject: string }[];
        activities?: { name: string; periods: number; timeVolume: string }[];
        type?: 'teacher' | 'class';
        template?: 'classic' | 'flowers' | 'standard';
    }
): Promise<void> => {
    const { metadata, schedule, activities = [], type = 'class' } = options;
    const targetTemplate = options.template || metadata?.template || 'classic';
    const isFlowers = targetTemplate === 'flowers';
    const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const timingConfig = getTimetableTimingConfig(metadata?.stage, metadata?.system);
    const hasAfternoonBreak = Boolean(timingConfig.afternoonRecessTime);

    const getSubject = (dayIdx: number, timeIdx: number, period: 'morning' | 'afternoon') => {
        const item = schedule.find(s => s.dayIdx === dayIdx && s.timeIdx === timeIdx && s.period === period);
        return item ? item.subject : '';
    };

    let scheduleRowsHtml = '';
    DAYS.forEach((day, dIdx) => {
        scheduleRowsHtml += `
        <tr>
            <th style="border: 1px solid black; padding: 6px; background-color: #f3f4f6;">${day}</th>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 0, 'morning')}</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 1, 'morning')}</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center; background-color: #f9fafb; font-size: 9pt;">استراحة (${timingConfig.morningRecessDuration})</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 2, 'morning')}</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 3, 'morning')}</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center; background-color: #e5e7eb; font-weight: bold;">استراحة الزوال</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 0, 'afternoon')}</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 1, 'afternoon')}</td>
            ${hasAfternoonBreak ? `
            <td style="border: 1px solid black; padding: 6px; text-align: center; background-color: #f9fafb; font-size: 9pt;">استراحة (${timingConfig.afternoonRecessDuration})</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 2, 'afternoon')}</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 3, 'afternoon')}</td>
            ` : `
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 2, 'afternoon')}</td>
            <td style="border: 1px solid black; padding: 6px; text-align: center;">${getSubject(dIdx, 3, 'afternoon')}</td>
            `}
        </tr>`;
    });

    const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <meta charset='utf-8'>
        <title>جدول التوقيت الأسبوعي الرسمي</title>
        <style>
            body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th, td { border: 1px solid #000; padding: 6px; font-size: 10pt; }
        </style>
    </head>
    <body dir='rtl'>
        <div style='text-align: center; margin-bottom: 16px;'>
            <p style='margin: 0; font-size: 11pt;'><strong>الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية</strong></p>
            <p style='margin: 4px 0;'>مديرية التربية لولاية: ${metadata?.directorate || profile.province || ''} • المؤسسة: ${metadata?.schoolName || profile.institution || ''}</p>
            <h2 style='margin: 8px 0;'>التوقيت الأسبوعي الرسمي (${timingConfig.stageTitle} — ${timingConfig.systemTitle})</h2>
            <p style='margin: 4px 0;'>الأستاذ(ة): ${metadata?.teacherName || profile.name || ''} | ${type === 'teacher' && metadata?.stage && metadata.stage !== 'primary' ? `التخصص: ${metadata?.specialty ? {'arabic':'لغة عربية','french':'لغة فرنسية','english':'لغة إنجليزية','pe':'تربية بدنية ورياضية','math':'رياضيات','physics':'العلوم الفيزيائية والتكنولوجيا','science':'علوم الطبيعة والحياة','history_geo':'تاريخ وجغرافيا','islamic':'تربية إسلامية','civics':'تربية مدنية','informatics':'إعلام آلي','philosophy':'فلسفة','accounting':'تسيير محاسبي ومالي','engineering':'هندسة'}[metadata.specialty] || metadata.specialty : ''} | الأقسام المسندة: ${metadata?.level ? metadata.level.split(',').map((l: string) => l === 'm1' ? '1م' : l === 'm2' ? '2م' : l === 'm3' ? '3م' : l === 'm4' ? '4م' : l === 's1' ? '1ثا' : l === 's2' ? '2ثا' : l === 's3' ? '3ثا' : l).join('، ') : ''} | ` : `القسم: ${metadata?.level || ''} | `}الحجرة: ${metadata?.room || ''} | ينتهي التوقيت عند الساعة ${timingConfig.endTime}</p>
        </div>
        <table>
            <thead>
                <tr style='background-color: #e5e7eb;'>
                    <th>اليوم</th>
                    <th colspan='2'>الفترة الصباحية (أولى)</th>
                    <th>استراحة (${timingConfig.morningRecessDuration})</th>
                    <th colspan='2'>الفترة الصباحية (ثانية)</th>
                    <th>استراحة الزوال</th>
                    <th colspan='2'>الفترة المسائية (أولى)</th>
                    ${hasAfternoonBreak ? `
                    <th>استراحة (${timingConfig.afternoonRecessDuration})</th>
                    <th colspan='2'>الفترة المسائية (حتى ${timingConfig.endTime})</th>
                    ` : `
                    <th colspan='2'>الفترة المسائية (حتى ${timingConfig.endTime})</th>
                    `}
                </tr>
            </thead>
            <tbody>
                ${scheduleRowsHtml}
            </tbody>
        </table>

        <!-- Guidelines notes -->
        <div style='border-top: 1px solid #000; padding-top: 8px; margin-top: 16px; font-size: 9pt; color: #333;'>
            <p style='margin: 2px 0;'>• منجز وفق الدليل التطبيقي لشبكة مواقيت التعليم الصادر عن المفتشية العامة للبيداغوجيا بوزارة التربية الوطنية.</p>
            <p style='margin: 2px 0;'>• التوقيت الأسبوعي المعتمد للسنة الدراسية ${metadata?.year || profile.academicYear} — ${timingConfig.systemTitle} (ينتهي عند ${timingConfig.endTime}).</p>
        </div>

        <div style='margin-top: 40px; display: flex; justify-content: space-between;'>
            <div style='text-align: center; width: 30%;'>
                <p><strong>توقيع وختم الأستاذ(ة)</strong></p>
                <p style='margin-top: 40px;'>.........................................</p>
            </div>
            <div style='text-align: center; width: 30%;'>
                <p><strong>تأشيرة وختم السيد المدير</strong></p>
                <p style='margin-top: 40px;'>.........................................</p>
            </div>
            <div style='text-align: center; width: 30%;'>
                <p><strong>تأشيرة وتوقيع السيد المفتش</strong></p>
                <p style='margin-top: 40px;'>.........................................</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `جدول_التوقيت_${(metadata?.teacherName || profile.name || 'الأستاذ').replace(/[\s/\\:]+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    try {
        const { triggerExportDonation } = await import('../../components/ExportDonationToast');
        triggerExportDonation();
    } catch {}
};

// ============================================================================
// 🔟 تصدير خريطة التنظيم التربوي الرسمي (Educational Map PDF Export)
// ============================================================================
export const exportEducationalMapToPDF = async (
    profile: TeacherProfile,
    metadata: any
): Promise<void> => {
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
    const totalClasses = metadata?.classes ? Object.values(metadata.classes).reduce((a: any, b: any) => a + b, 0) : 1;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '1123px'; // A4 Landscape
    container.style.minHeight = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '25px 30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; box-sizing: border-box; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; min-height: 100%; text-align: right; color: #000; background: #fff;">
          ${getOfficialAlgerianHeaderHTML(profile, 'خريطة التنظيم التربوي وهيكلة الأفواج', `المؤسسة: ${metadata?.schoolName || profile.institution}`, metadata?.year || profile.academicYear)}

          <!-- Stats summary -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;">
              <div style="border: 1px solid #000; padding: 8px; text-align: center; background: #f9fafb;">
                  <span style="font-size: 10px; color: #555;">إجمالي الأفواج التربوية</span>
                  <div style="font-size: 18px; font-weight: 900;">${totalClasses} فوج</div>
              </div>
              <div style="border: 1px solid #000; padding: 8px; text-align: center; background: #f9fafb;">
                  <span style="font-size: 10px; color: #555;">نظام التدريس المعتمد</span>
                  <div style="font-size: 14px; font-weight: 900;">${metadata?.system === 'two-shifts' ? 'نظام الدوامين' : 'الدوام الواحد'}</div>
              </div>
              <div style="border: 1px solid #000; padding: 8px; text-align: center; background: #f9fafb;">
                  <span style="font-size: 10px; color: #555;">المقاطعة البيداغوجية</span>
                  <div style="font-size: 14px; font-weight: 900;">${metadata?.inspectorate || profile.pedagogicalDistrict || 'المقاطعة 01'}</div>
              </div>
              <div style="border: 1px solid #000; padding: 8px; text-align: center; background: #f9fafb;">
                  <span style="font-size: 10px; color: #555;">السنة الدراسية</span>
                  <div style="font-size: 14px; font-weight: 900;">${metadata?.year || profile.academicYear}</div>
              </div>
          </div>

          <!-- Classes Structure Table -->
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin-bottom: 16px; text-align: center;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb;">
                  <tr>
                      <th style="border: 1px solid #000; padding: 8px; font-size: 11px;">المستوى التعليمي</th>
                      <th style="border: 1px solid #000; padding: 8px; font-size: 11px;">عدد الأفواج</th>
                      <th style="border: 1px solid #000; padding: 8px; font-size: 11px;">الحجرات المسندة</th>
                      <th style="border: 1px solid #000; padding: 8px; font-size: 11px;">تعداد التلاميذ التقديري</th>
                      <th style="border: 1px solid #000; padding: 8px; font-size: 11px;">الأساتذة المسؤولون</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">السنة الأولى</td>
                      <td style="border: 1px solid #000; padding: 8px;">فوجان (02)</td>
                      <td style="border: 1px solid #000; padding: 8px;">حجرة 01 ، حجرة 02</td>
                      <td style="border: 1px solid #000; padding: 8px;">64 تلميذ</td>
                      <td style="border: 1px solid #000; padding: 8px;">أساتذة الطور الأول</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">السنة الثانية</td>
                      <td style="border: 1px solid #000; padding: 8px;">فوجان (02)</td>
                      <td style="border: 1px solid #000; padding: 8px;">حجرة 03 ، حجرة 04</td>
                      <td style="border: 1px solid #000; padding: 8px;">60 تلميذ</td>
                      <td style="border: 1px solid #000; padding: 8px;">أساتذة الطور الأول</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">السنة الثالثة</td>
                      <td style="border: 1px solid #000; padding: 8px;">فوجان (02)</td>
                      <td style="border: 1px solid #000; padding: 8px;">حجرة 05 ، حجرة 06</td>
                      <td style="border: 1px solid #000; padding: 8px;">68 تلميذ</td>
                      <td style="border: 1px solid #000; padding: 8px;">أساتذة الطور الثاني</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">السنة الرابعة</td>
                      <td style="border: 1px solid #000; padding: 8px;">فوجان (02)</td>
                      <td style="border: 1px solid #000; padding: 8px;">حجرة 07 ، حجرة 08</td>
                      <td style="border: 1px solid #000; padding: 8px;">62 تلميذ</td>
                      <td style="border: 1px solid #000; padding: 8px;">أساتذة الطور الثاني</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">السنة الخامسة</td>
                      <td style="border: 1px solid #000; padding: 8px;">فوجان (02)</td>
                      <td style="border: 1px solid #000; padding: 8px;">حجرة 09 ، حجرة 10</td>
                      <td style="border: 1px solid #000; padding: 8px;">66 تلميذ</td>
                      <td style="border: 1px solid #000; padding: 8px;">أساتذة الطور الثالث</td>
                  </tr>
              </tbody>
          </table>

          ${getOfficialAlgerianFooterHTML(profile, { showTeacher: true, showDirector: true, showInspector: true, exportTime })}
      </div>
    `;

    await renderAndDownloadPDF(container, `خريطة_التنظيم_التربوي_${(metadata?.schoolName || 'المؤسسة').replace(/[\s/\\:]+/g, '_')}.pdf`, 'l');
};
