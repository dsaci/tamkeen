
import { useState, useEffect } from 'react';

const MESSAGES = {
  reassurance: [
    "نُعالج بياناتك بدقة وعناية",
    "لحظات قليلة تفصلك عن الدخول",
    "كل شيء يسير على ما يرام",
    "بياناتك تُحفظ في بيئة آمنة",
    "نمهّد لك طريق الإبداع الآن",
    "نتحقق من معلوماتك لضمان جودتها"
  ],
  appreciation: [
    "نُقدّر وقتك الثمين يا أستاذ",
    "شكرًا لسعة صدرك ورقيّك",
    "نتشرف بخدمة صنّاع الأجيال",
    "خدمتكم وسام نعتز به",
    "نعتز بانضمام قامة تربوية مثلك",
    "صبرك الجميل محل تقديرنا"
  ],
  progress: [
    "نضع اللمسات الأخيرة الآن",
    "نُرتّب لك مكتبك الرقمي",
    "خطوات بسيطة ونبدأ الرحلة",
    "نُعدّ لك واجهة تليق بك",
    "ملفك الشخصي قيد التجهيز",
    "النظام يستعد لاستقبال إبداعك"
  ],
  educational: [
    "عطاؤك يبني مستقبل هذا الوطن",
    "أنت المنارة التي تضيء العقول",
    "كل جهد تبذله يُحدث أثرًا",
    "مهنتك أنبل المهن وأسماها",
    "بصمتك في القسم لا تُنسى",
    "التعليم رسالة خالدة ومستمرة"
  ],
  identity: [
    "تمكين: رفيقك في رحلة التميز",
    "مساحتك الخاصة في تمكين تتجهز",
    "نُسخّر التقنية لخدمة رسالتك",
    "عالم تمكين الرقمي يرحب بك",
    "أدواتك البيداغوجية بانتظارك",
    "منصة صُممت لتليق بمقامك"
  ]
};

// Flatten all messages for random rotation after the first one
const ALL_MESSAGES = [
  ...MESSAGES.reassurance,
  ...MESSAGES.appreciation,
  ...MESSAGES.progress,
  ...MESSAGES.educational,
  ...MESSAGES.identity
];

export function useLoadingMessage(intervalMs = 3000) {
  // Always start with a Reassurance or Progress message to reduce immediate anxiety
  const [message, setMessage] = useState(() => {
    const startPool = [...MESSAGES.reassurance, ...MESSAGES.progress];
    return startPool[Math.floor(Math.random() * startPool.length)];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prev => {
        let next;
        // Ensure we don't repeat the immediate previous message
        do {
          next = ALL_MESSAGES[Math.floor(Math.random() * ALL_MESSAGES.length)];
        } while (next === prev);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return message;
}
