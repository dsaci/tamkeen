
import { GoogleGenAI } from "@google/genai";
import { Session } from '../types';

export async function generateMagicSession(
  subject: string,
  lessonTitle: string
): Promise<Partial<Session>> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك خبير بيداغوجي جزائري، قم بتحضير حصة تعليمية للمادة: "${subject}" والعنوان: "${lessonTitle}".
      أريد المخرجات في شكل كائن JSON يحتوي على الحقول التالية:
      - activity: نوع النشاط (مثلاً: بناء التعلمات، إدماج، إلخ)
      - objective: هدف تعلمي دقيق (أن يكون التلميذ قادراً على...)
      - content: سير الحصة في نقاط مرقمة واضحة
      - tools: الوسائل التعليمية المقترحة
      - notes: ملاحظة بيداغوجية للأستاذ لتسهيل سير الحصة
      اجعل المحتوى متوافقاً تماماً مع مناهج الجيل الثاني.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text);
    return {
      activity: result.activity || 'درس نظري',
      objective: result.objective || '',
      content: result.content || '',
      tools: result.tools || '',
      notes: result.notes || ''
    };
  } catch (e) {
    console.error("Magic Generator Error:", e);
    // Fallback if AI fails
    return {
      activity: 'بناء التعلمات',
      objective: `دراسة وفهم ${lessonTitle}`,
      content: '1. وضعية انطلاق\n2. عرض السندات\n3. استنتاج الخلاصة',
      tools: 'الكتاب المدرسي، السبورة',
      notes: 'التركيز على الفروقات الفردية'
    };
  }
}
