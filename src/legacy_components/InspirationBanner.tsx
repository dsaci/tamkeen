
import React, { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

const quotes = [
  "التعليم ليس ملء دلو، ولكنه إيقاد شعلة. — ويليام بتلر يتس",
  "يا نشءُ أنتَ رجاؤنا وبكَ الصباحُ قد اقترب.. خذ للحياةِ سلاحَها وخذِ الخطابةَ والأدب. — الإمام عبد الحميد بن باديس",
  "المعلم الجيد هو الذي يجعل من نفسه جسراً يعبر عليه طلابه. — نيكوس كازانتزاكيس",
  "أستاذي الفاضل/أستاذتي الفاضلة: بصمتك في أرواح تلاميذك تبقى أبد الدهر، فازرع(ي) خيراً.",
  "التربية قبل التعليم، والقدوة قبل الموعظة.",
  "تلميذك اليوم هو قائد الغد، فاصنع(ي) منه إنساناً.",
  "النجاح في القسم يبدأ من ابتسامة الأستاذ(ة) عند العتبة.",
  "أنت لست مجرد مدرس، أنت صانع الأجيال ومهندس العقول.",
  "قوة الأمة تكمن في فصول مدارسها، وأنت قائد هذه الفصول.",
  "رسالتك العظيمة تتجاوز الجدران، لتصنع مستقبلاً مشرقاً للوطن.",
  "كل كلمة طيبة تغرسها اليوم، ستزهر إبداعاً وقيادة في الغد.",
  "مهنة التعليم هي أم المهن، وبك ترتقي الأمم وتسمو.",
  "أنت النور الذي يبدد ظلام الجهل، فدمت مشعلاً للهدى والمعرفة."
];

const InspirationBanner: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/50 dark:bg-slate-800/80 backdrop-blur-sm border-y border-indigo-50 dark:border-slate-700 px-10 py-3 overflow-hidden shrink-0 hidden md:block transition-colors duration-300">
      <div className={`flex items-center justify-center gap-4 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <Sparkles size={16} className="text-amber-500 animate-pulse" />
        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-200 italic text-center leading-relaxed">
          {quotes[index]}
        </p>
        <Quote size={16} className="text-indigo-400 dark:text-indigo-300 rotate-180" />
      </div>
    </div>
  );
};

export default InspirationBanner;
