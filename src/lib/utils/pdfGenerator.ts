
import * as jspdfModule from 'jspdf';
const jsPDF = (jspdfModule as any).jsPDF || (jspdfModule as any).default || jspdfModule;
import { Session, TeacherProfile } from '../../types';

export const exportDailyJournalToPDF = async (
    profile: TeacherProfile,
    date: string,
    dayName: string,
    sessions: Session[]
) => {
    // التحقق من وجود مكتبة html2canvas
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) {
        alert("يرجى التأكد من الاتصال بالإنترنت لتحميل مكتبة الطباعة (html2canvas).");
        return;
    }

    // وقت الاستخراج
    const exportTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    // إنشاء حاوية مخفية لبناء التقرير
    const container = document.createElement('div');

    // إعدادات النمط لإجبار الظهور الصحيح (تجاوز الوضع الليلي)
    container.style.position = 'fixed';
    container.style.left = '-10000px'; // إزاحة لليسار بدلاً من الأعلى لضمان الرسم
    container.style.top = '0';
    container.style.width = '1123px'; // A4 Landscape width in px (approx)
    container.style.minHeight = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000'; // فرض اللون الأسود
    container.style.padding = '30px';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Cairo', sans-serif";
    container.style.zIndex = '-1000';

    // ترتيب الحصص
    const sortedSessions = [...sessions].sort((a, b) => {
        if (a.timing.period === b.timing.period) return (a.timing.startTime || '').localeCompare(b.timing.startTime || '');
        return a.timing.period === 'MORNING' ? -1 : 1;
    });

    // بناء صفوف الجدول
    let rowsHtml = '';
    sortedSessions.forEach((s) => {
        const isHoliday = s.timing.category === 'HOLIDAY';
        const isBreak = s.timing.category === 'BREAK';

        // التأكد من وجود البيانات وتجهيزها
        const subject = s.subject || '';
        const activity = s.activity || '';
        const title = s.title || '';
        const objective = s.objective || '';
        const content = s.content || '';
        const tools = s.tools || '';
        const notes = s.notes || '';

        // تنسيق بيانات المقطع والوحدة
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
              <td colspan="9" style="padding: 12px; text-align: center; color: #15803d !important; font-weight: bold; font-size: 14px;">
                  *** عطلة بيداغوجية: ${s.timing.holidayName || 'مناسبة رسمية'} ***
              </td>
          </tr>`;
        } else if (isBreak) {
            rowsHtml += `
          <tr style="background-color: #fff7ed !important; -webkit-print-color-adjust: exact; border-bottom: 1px solid #000;">
              <td colspan="9" style="padding: 8px; text-align: center; color: #c2410c !important; font-weight: bold; font-size: 14px;">
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
          </tr>
         `;
        }
    });

    // HTML Structure with Force-Light Mode Styles
    container.innerHTML = `
      <style>
        * { color: #000 !important; border-color: #000 !important; }
        .bg-gray-header { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; }
      </style>
      <div style="display: flex; flex-direction: column; height: 100%; text-align: right; color: #000; background: #fff;">
          
          <!-- Header (Districts) -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px;">
              <div style="text-align: right;">
                  <p style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">المقاطعة الإدارية: ${profile.administrativeDistrict || '...................'}</p>
                  <p style="font-weight: bold; font-size: 14px;">المؤسسة: ${profile.institution}</p>
              </div>
              <div style="text-align: center;">
                  <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 5px; text-decoration: underline;">الكراس اليومي</h1>
                  <p style="font-size: 14px; font-weight: bold;">بتاريخ: ${dayName} ${date}</p>
              </div>
              <div style="text-align: left;">
                  <p style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">المقاطعة البيداغوجية: ${profile.pedagogicalDistrict || '...................'}</p>
                  <p style="font-weight: bold; font-size: 14px;">الأستاذ(ة): ${profile.name}</p>
              </div>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; background: #fff;">
              <thead class="bg-gray-header" style="background-color: #e5e7eb; color: #000;">
                  <tr>
                      <th style="padding: 8px; border: 1px solid #000; width: 85px; text-align: center; font-size: 12px; font-weight: bold;">التوقيت</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 12px; font-weight: bold;">المادة</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 80px; font-size: 12px; font-weight: bold;">النشاط</th>
                      <th style="padding: 8px; border: 1px solid #000; width: 90px; font-size: 12px; font-weight: bold;">المقطع</th>
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
          
          <!-- Footer (Signatures) -->
          <div style="margin-top: auto; padding-top: 40px; display: flex; justify-content: space-between; padding-left: 40px; padding-right: 40px;">
              <div style="text-align: center;">
                  <p style="font-weight: bold; font-size: 14px; margin-bottom: 60px;">توقيع المدير</p>
                  <p style="font-size: 12px;">.........................................</p>
              </div>
              <div style="text-align: center;">
                  <p style="font-weight: bold; font-size: 14px; margin-bottom: 60px;">توقيع السيد المفتش البيداغوجي</p>
                  <p style="font-size: 12px;">.........................................</p>
              </div>
          </div>

          <div style="margin-top: 20px; text-align: center; border-top: 1px solid #ccc; padding-top: 5px; display: flex; justify-content: space-between; font-size: 10px; color: #555;">
             <span>منصة تمكين الرقمية</span>
             <span>وقت الاستخراج: ${exportTime}</span>
          </div>
      </div>
  `;

    document.body.appendChild(container);

    try {
        // انتظار قصير جداً لضمان رسم المتصفح للعناصر قبل التصوير
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(container, {
            scale: 2, // جودة عالية
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff' // خلفية بيضاء للصورة
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        pdf.save(`Journal_${date}.pdf`);

    } catch (err: any) {
        console.error(err);
        alert(`حدث خطأ أثناء إنشاء الملف: ${err.message}`);
    } finally {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }
};
