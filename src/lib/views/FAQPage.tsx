import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '../utils';

const FAQS = [
  {
    question: 'هل منصة تمكين مجانية بالكامل؟',
    answer: 'نعم، منصة تمكين مجانية بالكامل وتطمح للبقاء كذلك إيماناً منا بضرورة دعم الأستاذ الجزائري. نعتمد على التبرعات والدعم الطوعي لتغطية تكاليف الاستضافة والتطوير.'
  },
  {
    question: 'هل تتوافق المنصة مع المناهج الجزائرية الرسمية؟',
    answer: 'بالتأكيد. تم تصميم كل ميزة في المنصة (مثل المذكرات، الكراس اليومي، وتوليد الاختبارات) لتتوافق بدقة مع المقاربة بالكفاءات، التدرجات السنوية، والمصطلحات الرسمية لوزارة التربية الوطنية.'
  },
  {
    question: 'أين يتم حفظ بياناتي (الكراس اليومي، العلامات...)؟',
    answer: 'لضمان الخصوصية والسرعة، يتم حفظ بياناتك محلياً على متصفحك وقاعدة بيانات جهازك (SQLite / IndexedDB). لا يتم رفع تقييمات تلاميذك إلى خوادمنا إلا إذا اخترت ميزة المزامنة السحابية الاحتياطية.'
  },
  {
    question: 'هل يمكنني طباعة الوثائق الرسمية من المنصة؟',
    answer: 'نعم، المنصة توفر خيارات تصدير وطباعة للوثائق (الكراس اليومي، قوائم التلاميذ، جداول التوقيت) بتنسيقات (A4) تتضمن الترويسة الرسمية للجمهورية الجزائرية جاهزة للتقديم للمفتش أو الإدارة.'
  },
  {
    question: 'كيف يمكنني المساهمة في تطوير المنصة؟',
    answer: 'يمكنك المساهمة من خلال تقديم ملاحظاتك التربوية عبر صفحة (اتصل بنا)، مشاركة المنصة مع زملائك الأساتذة، أو عبر الدعم المادي التطوعي للمساعدة في تكاليف الخوادم.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto space-y-10 pb-20">
      <div className="text-center space-y-4 pb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle size={40} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
          الأسئلة الشائعة
        </h1>
        <p className="text-lg font-bold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          كل ما تحتاج معرفته حول منصة تمكين وآلية عملها.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={cn(
                "bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300",
                isOpen 
                  ? "border-emerald-500 shadow-md" 
                  : "border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-200"
              )}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-right"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className={cn(
                  "font-black text-lg",
                  isOpen ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"
                )}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={cn(
                    "text-slate-400 transition-transform duration-300 shrink-0",
                    isOpen ? "rotate-180 text-emerald-500" : ""
                  )} 
                  size={20} 
                />
              </button>
              
              <div 
                className={cn(
                  "px-6 overflow-hidden transition-all duration-300",
                  isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
