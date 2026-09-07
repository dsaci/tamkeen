import React, { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, BrainCircuit } from 'lucide-react';
import { cn } from '../utils';

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً أستاذ! أنا مساعدك الذكي المبرمج حصرياً لفهم المقاربة بالكفاءات الجزائرية. كيف يمكنني مساعدتك في بناء وضعية الانطلاق، أو صياغة كفاءة ختامية اليوم؟' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    // Mock response for now
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'هذا اقتراح ممتاز. بناءً على المنهج الجزائري، يمكننا دمج هذه الفكرة ضمن "بناء التعلمات" واستثمارها في وضعية إدماجية تعكس مركبات الكفاءة المطلوبة.' }]);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex items-center gap-4 text-white">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/30">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">
            تمكين <span className="text-yellow-300">Copilot</span>
          </h2>
          <p className="text-emerald-100 text-sm font-bold">المساعد التربوي المعتمد على الذكاء الاصطناعي</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex gap-4 max-w-[85%]",
            msg.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1",
              msg.role === 'user' ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
            )}>
              {msg.role === 'user' ? <span className="font-black">أنت</span> : <Sparkles size={20} />}
            </div>
            
            <div className={cn(
              "p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed font-medium",
              msg.role === 'user' 
                ? "bg-emerald-600 text-white rounded-tl-sm" 
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tr-sm border border-slate-100 dark:border-slate-700"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto custom-scrollbar border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        {[
          "صغ لي وضعية انطلاق لدرس الرياضيات",
          "اقتراح تقويم تشخيصي",
          "كيف أتعامل مع الفروق الفردية في قسمي؟"
        ].map((prompt, idx) => (
          <button 
            key={idx}
            onClick={() => setInput(prompt)}
            className="whitespace-nowrap px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-transparent hover:border-emerald-200"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل المساعد التربوي (مثال: صغ لي وضعية إدماجية...)"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white px-4 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
          >
            <Send size={20} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
