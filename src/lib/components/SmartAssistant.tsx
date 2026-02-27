
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, BrainCircuit, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { TeacherProfile } from '../../types';
import { addResource } from '../../services/resourceBankService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  profile: TeacherProfile;
}

const SmartAssistant: React.FC<Props> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `مرحباً بك أستاذ ${profile.name}. أنا مساعد تمكين الذكي. يمكنني الآن ملء "الحقول الستة" لحصصك البيداغوجية وفق مناهج الجيل الثاني. ماذا نحضر اليوم؟` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `أنت "مساعد تمكين الذكي"، خبير تربوي في المنهج الجزائري. 
          مهمتك حصراً: توليد محتوى الحصة البيداغوجية. ردك يجب أن يتضمن دائماً العناوين التالية:
          1. المادة
          2. النشاط
          3. عنوان الحصة
          4. المحتوى البيداغوجي (في نقاط)
          5. الهدف التعلمي / مؤشر الكفاءة (أن يكون التلميذ قادراً على...)
          6. الملاحظة البيداغوجية (توجيه لسير الحصة)
          تحدث بلغة تربوية رصينة وتناسب مستوى ${profile.grades?.[0] || 'المعني'} طور ${profile.level || 'المدرسة'}.`,
          temperature: 0.7,
        }
      });
      const text = response.text || "أعتذر، تعذر التوليد حالياً.";
      setMessages(prev => [...prev, { role: 'model', text }]);

      if (response.text) {
        addResource({
          subject: profile.teachingSubject || 'مادة عامة',
          level: profile.level,
          grade: profile.grades?.[0] || '',
          activity: 'مساعدة ذكية / توليد حصة',
          title: userMessage.length > 60 ? userMessage.substring(0, 60) + '...' : userMessage,
          content: text,
          source: 'ai'
        }).catch(err => console.error('Failed to auto-save to resource bank:', err));
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "حدث خطأ في الاتصال بالذكاء الاصطناعي." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-8 left-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-[100] animate-bounce">
        <Zap size={28} className="fill-white" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 left-8 w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col transition-all z-[100] overflow-hidden ${isMinimized ? 'h-20' : 'h-[600px]'}`}>
      <div className="p-5 bg-[#0f172a] text-white flex items-center justify-between">
        <div className="flex items-center gap-3"><BrainCircuit size={20} /><h4 className="text-sm font-black">مساعد تمكين الذكي</h4></div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)}><Minimize2 size={16} /></button>
          <button onClick={() => setIsOpen(false)}><X size={16} /></button>
        </div>
      </div>
      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 text-[10px] font-bold leading-relaxed">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-700 shadow-sm whitespace-pre-wrap'}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-white border-t border-slate-100 flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="اطلب تحضير حصة بيداغوجية..." className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" />
            <button onClick={handleSendMessage} className="bg-[#0f172a] text-white p-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all"><Send size={18} /></button>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartAssistant;
