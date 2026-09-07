import React, { useState } from 'react';
import {
  X, Sparkles, BookOpen, Clock, Users, ArrowRight,
  CheckCircle2, Play, Layers, Compass, HelpCircle, Flame
} from 'lucide-react';

export interface PrebuiltLessonKit {
  id: string;
  stage: 'primary' | 'middle' | 'secondary';
  stageLabel: string;
  grade: string;
  subject: string;
  title: string;
  durationMinutes: number;
  groupWork: boolean;
  description: string;
  elements: any[];
}

export const PREBUILT_LESSON_KITS: PrebuiltLessonKit[] = [
  // ===================== PRIMARY (الابتدائي) =====================
  {
    id: 'digestive-system-5ap',
    stage: 'primary',
    stageLabel: 'ابتدائي',
    grade: 'السنة الخامسة ابتدائي',
    subject: 'التربية العلمية والتكنولوجية',
    title: 'نشاط تفاعلي: الجهاز الهضمي ورحلة اللقمة',
    durationMinutes: 10,
    groupWork: true,
    description: 'وضعية استكشافية مع رسم تشريحي عالي الدقة للجهاز الهضمي، وبطاقات سحب وإفلات لأسماء الأعضاء ومؤقت 10 دقائق.',
    elements: [
      // 1. Header Banner
      {
        type: 'text',
        x: 60,
        y: 40,
        text: '📌 نشاط تفاعلي (أفواج): الجهاز الهضمي ورحلة اللقمة | س5 ابتدائي | ⏱️ 10 دقائق',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f59e0b',
        hasBackground: true
      },
      // 2. Context Problem
      {
        type: 'text',
        x: 60,
        y: 110,
        text: '📖 وضعية الانطلاق:\nتناول سمير وجبة غداء مغذية. تتبع مسار اللقمة داخل الأنبوب الهضمي مع تحديد الأعضاء ودورها في الهضم.',
        fontSize: 18,
        color: '#ffffff',
        hasBackground: true
      },
      // 3. Central Diagram (Digestive System SVG)
      {
        type: 'image',
        x: 60,
        y: 210,
        width: 300,
        height: 380,
        src: '/educational/digestive_system.svg',
        title: 'رسم تخطيطي للجهاز الهضمي'
      },
      // 4. Interactive Drag & Drop Word Cards
      {
        type: 'text',
        x: 400,
        y: 210,
        text: '🔹 الفم والأسنان',
        fontSize: 20,
        color: '#38bdf8',
        hasBackground: true
      },
      {
        type: 'text',
        x: 400,
        y: 270,
        text: '🔹 المريء',
        fontSize: 20,
        color: '#38bdf8',
        hasBackground: true
      },
      {
        type: 'text',
        x: 400,
        y: 330,
        text: '🔹 المعدة',
        fontSize: 20,
        color: '#22c55e',
        hasBackground: true
      },
      {
        type: 'text',
        x: 400,
        y: 390,
        text: '🔹 المعي الدقيق',
        fontSize: 20,
        color: '#eab308',
        hasBackground: true
      },
      {
        type: 'text',
        x: 400,
        y: 450,
        text: '🔹 المعي الغليظ',
        fontSize: 20,
        color: '#ec4899',
        hasBackground: true
      },
      // 5. Group Tasks
      {
        type: 'text',
        x: 600,
        y: 210,
        text: '🎯 المهام المطلوبة من الفوج:\n1. اسحب كل بطاقة وضعها في مكانها المناسب على الرسم.\n2. أين يتم امتصاص المغذيات ونقلها للدم؟\n3. اكتب نصيحة واحدة للحفاظ على صحة الهضم.',
        fontSize: 18,
        color: '#a855f7',
        hasBackground: true
      }
    ]
  },
  {
    id: 'fractions-pizza-5ap',
    stage: 'primary',
    stageLabel: 'ابتدائي',
    grade: 'السنة الخامسة ابتدائي',
    subject: 'الرياضيات',
    title: 'نشاط تفاعلي: مفهوم الكسور العشرية وقسمة الحصص',
    durationMinutes: 10,
    groupWork: true,
    description: 'مسألة بيداغوجية لقسمة فصائل الطعام مع تمثيل كسور دائري، وأسئلة المقارنة والتحويل العشري.',
    elements: [
      {
        type: 'text',
        x: 60,
        y: 40,
        text: '🍕 نشاط تفاعلي: الكسور العشرية والتمثيل الهندسي | س5 ابتدائي',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#22c55e',
        hasBackground: true
      },
      {
        type: 'text',
        x: 60,
        y: 110,
        text: 'السياق: اشترت عائلة فطيرة بيتزا دائرية، قسّموها إلى 8 قطع متساوية.\nأكل الأب 3 قطع، وأكلت الأم قطعتين، وأكل الابن قطعة واحدة.',
        fontSize: 18,
        color: '#ffffff',
        hasBackground: true
      },
      {
        type: 'circle',
        x: 100,
        y: 220,
        width: 220,
        height: 220,
        color: '#f59e0b',
        strokeWidth: 4,
        fill: '#f59e0b33'
      },
      {
        type: 'text',
        x: 400,
        y: 220,
        text: 'المهام:\n• عبر بكسر عن حصة كل فرد (3/8 ، 2/8 ، 1/8)\n• احسب الكسر الذي يمثل ما أكلته العائلة مجتمعة.\n• كم بقي من الفطيرة؟',
        fontSize: 19,
        color: '#38bdf8',
        hasBackground: true
      }
    ]
  },

  // ===================== MIDDLE (المتوسط) =====================
  {
    id: 'circuit-series-parallel-1am',
    stage: 'middle',
    stageLabel: 'متوسط',
    grade: '1 متوسط / 2 متوسط',
    subject: 'العلوم الفيزيائية والتكنولوجيا',
    title: 'مختبر افتراضي: مقارنة الربط على التسلسل وعلى التفرع',
    durationMinutes: 15,
    groupWork: true,
    description: 'عناصر دارة كهربائية تفاعلية (بطارية، مصباح، قاطعة، مقاومة) مع جدول الاستنتاج والملاحظة الصفي.',
    elements: [
      {
        type: 'text',
        x: 60,
        y: 40,
        text: '⚡ مختبر الفيزياء: المقارنة بين الربط على التسلسل والربط على التفرع | 1 متوسط',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#38bdf8',
        hasBackground: true
      },
      // Circuit components on board
      {
        type: 'battery',
        x: 80,
        y: 140,
        width: 140,
        height: 90,
        color: '#ef4444',
        strokeWidth: 3
      },
      {
        type: 'bulb',
        x: 270,
        y: 140,
        width: 120,
        height: 90,
        color: '#eab308',
        strokeWidth: 3
      },
      {
        type: 'bulb',
        x: 430,
        y: 140,
        width: 120,
        height: 90,
        color: '#eab308',
        strokeWidth: 3
      },
      {
        type: 'switch',
        x: 590,
        y: 140,
        width: 130,
        height: 90,
        color: '#22c55e',
        strokeWidth: 3
      },
      // Table & Questions
      {
        type: 'text',
        x: 80,
        y: 280,
        text: '📋 جدول الملاحظة والمقارنة:\n• عند نزع مصباح واحد في دارة التسلسل: ماذا يحدث للمصباح الآخر؟\n• عند نزع مصباح واحد في دارة التفرع: هل ينطفئ الثاني؟\n• علّل لماذا تفضل التمديدات المنزلية على التفرع.',
        fontSize: 18,
        color: '#ffffff',
        hasBackground: true
      }
    ]
  },
  {
    id: 'revolution-timeline-4am',
    stage: 'middle',
    stageLabel: 'متوسط',
    grade: 'السنة الرابعة متوسط (BEM)',
    subject: 'التاريخ الوطني',
    title: 'خط زمني: المحطات الحاسمة لثورة أول نوفمبر الخالدة',
    durationMinutes: 12,
    groupWork: true,
    description: 'خط زمني لتاريخ الجزائر ببطاقات المحطات الكبرى (1954 - 1962) وأسئلة الكفاءة الختامية للشهادة.',
    elements: [
      {
        type: 'text',
        x: 60,
        y: 40,
        text: '📜 تاريخ الجزائر: المحطات الكبرى لثورة التحرير الوطني 1954 - 1962 | 4 متوسط',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#22c55e',
        hasBackground: true
      },
      {
        type: 'timeline',
        x: 60,
        y: 130,
        width: 700,
        height: 90,
        color: '#22c55e',
        strokeWidth: 3
      },
      {
        type: 'text',
        x: 60,
        y: 250,
        text: '📍 1 نوفمبر 1954: تفجير الثورة وإعلان نداء التاريخ',
        fontSize: 18,
        color: '#ef4444',
        hasBackground: true
      },
      {
        type: 'text',
        x: 60,
        y: 310,
        text: '📍 20 أوت 1955: هجومات الشمال القسنطيني التاريخية',
        fontSize: 18,
        color: '#f97316',
        hasBackground: true
      },
      {
        type: 'text',
        x: 60,
        y: 370,
        text: '📍 20 أوت 1956: مؤتمر الصومام وهيكلة الثورة',
        fontSize: 18,
        color: '#eab308',
        hasBackground: true
      },
      {
        type: 'text',
        x: 60,
        y: 430,
        text: '📍 5 جويلية 1962: استرجاع السيادة الوطنية والاستقلال',
        fontSize: 18,
        color: '#22c55e',
        hasBackground: true
      },
      {
        type: 'text',
        x: 480,
        y: 250,
        text: '🎯 مؤشرات الكفاءة:\n1. ما هي الدوافع الاستراتيجية لهجومات 20 أوت 1955؟\n2. اذكر أهم وثيقتين أفرزهما مؤتمر الصومام.\n3. بيّن أثر تدويل القضية الجزائرية في الأمم المتحدة.',
        fontSize: 18,
        color: '#38bdf8',
        hasBackground: true
      }
    ]
  },

  // ===================== SECONDARY (الثانوي) =====================
  {
    id: 'function-study-secondary',
    stage: 'secondary',
    stageLabel: 'ثانوي',
    grade: '1 ثانوي / 2 ثانوي علمي',
    subject: 'الرياضيات',
    title: 'دراسة الدوال: إشارة المشتقة وجدول التغيرات والمنحنى',
    durationMinutes: 15,
    groupWork: true,
    description: 'معلم إحداثيات متعامد ومتجانس، دالة عددية، جدول تغيرات، وتمثيل هندسي متكامل.',
    elements: [
      {
        type: 'text',
        x: 60,
        y: 40,
        text: '📈 دراسة الدوال العددية: f(x) = -x² + 4x - 3 | 2 ثانوي علمي',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#38bdf8',
        hasBackground: true
      },
      {
        type: 'axes',
        x: 60,
        y: 120,
        width: 360,
        height: 280,
        color: '#38bdf8',
        strokeWidth: 2
      },
      {
        type: 'text',
        x: 460,
        y: 120,
        text: 'الخطوات المنهجية للحل:\n1. عين مجموعة تعريف الدالة Df.\n2. احسب النهايات عند الأطراف.\n3. احسب الدالة المشتقة f\'(x) وادرس إشارتها.\n4. شكل جدول التغيرات كاملاً.\n5. عين إحداثيات ذروة المنحنى Cf ونقاط التقاطع مع المحاور.',
        fontSize: 18,
        color: '#ffffff',
        hasBackground: true
      }
    ]
  },
  {
    id: 'algeria-resources-secondary',
    stage: 'secondary',
    stageLabel: 'ثانوي',
    grade: 'السنة الأولى / الثانية ثانوي',
    subject: 'الجغرافيا',
    title: 'خريطة الجزائر: التوزيع الجغرافي للموارد الطاقوية والمعدنية',
    durationMinutes: 12,
    groupWork: true,
    description: 'الخريطة الصماء الرسمية للجمهورية الجزائرية مع مفتاح الخريطة لحقول النفط والغاز والمعادن.',
    elements: [
      {
        type: 'text',
        x: 60,
        y: 40,
        text: '🌍 جغرافيا الجزائر: الموارد الطبيعية وحقول الطاقة | الطور الثانوي',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f59e0b',
        hasBackground: true
      },
      {
        type: 'image',
        x: 60,
        y: 110,
        width: 380,
        height: 380,
        src: '/educational/algeria_blank.svg',
        title: 'خريطة الجزائر الصماء'
      },
      {
        type: 'text',
        x: 480,
        y: 120,
        text: 'مفتاح الخريطة والرموز:\n🔴 حاسي مسعود (حوض النفط الرئيسي)\n🔵 حاسي الرمل (حوض الغاز الطبيعي)\n⚫ الونزة وتيندوف (الحديد الخام)\n🟡 عين قزام وتمنراست (المعادن النفيسة)',
        fontSize: 18,
        color: '#eab308',
        hasBackground: true
      },
      {
        type: 'text',
        x: 480,
        y: 300,
        text: 'المهام الإدماجية:\n1. وقع المواقع أعلاه بدقة على الخريطة الصماء.\n2. فسر تركز الثروات الطاقوية في النطاق الصحراوي.\n3. اقترح حلين لتنويع الاقتصاد الجزائري خارج المحروقات.',
        fontSize: 18,
        color: '#ffffff',
        hasBackground: true
      }
    ]
  }
];

interface LessonKitGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyKit: (kit: PrebuiltLessonKit) => void;
}

export default function LessonKitGeneratorModal({
  isOpen,
  onClose,
  onApplyKit
}: LessonKitGeneratorModalProps) {
  const [selectedStage, setSelectedStage] = useState<'all' | 'primary' | 'middle' | 'secondary'>('all');
  const [selectedKit, setSelectedKit] = useState<PrebuiltLessonKit>(PREBUILT_LESSON_KITS[0]);

  if (!isOpen) return null;

  const filteredKits = selectedStage === 'all'
    ? PREBUILT_LESSON_KITS
    : PREBUILT_LESSON_KITS.filter(k => k.stage === selectedStage);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-['Cairo'] select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Sparkles size={22} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>المستوى 3 — «أنشئ لي» (كبسولات الدروس والأنشطة الجاهزة)</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30">
                  معد مسبقاً ⚡
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                حصص وأنشطة تفاعلية متكاملة وفق المنهاج الجزائري تُنزل بنقرة واحدة على السبورة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs font-black">
          <span className="text-slate-400 ml-2">اختر الطور التعليمي:</span>
          {[
            { id: 'all', label: 'كافة الأطوار' },
            { id: 'primary', label: 'الطور الابتدائي (ابتدائي)' },
            { id: 'middle', label: 'الطور المتوسط (متوسط)' },
            { id: 'secondary', label: 'الطور الثانوي (ثانوي)' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id as any)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedStage === st.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Kit List (Right / 5 cols) + Preview (Left / 7 cols) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">

          {/* Kits List */}
          <div className="md:col-span-5 p-4 border-l border-slate-800 overflow-y-auto space-y-2.5">
            {filteredKits.map(kit => {
              const isSelected = selectedKit.id === kit.id;
              return (
                <button
                  key={kit.id}
                  onClick={() => setSelectedKit(kit)}
                  className={`w-full p-3.5 rounded-2xl border text-right transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-700 text-amber-300">
                      {kit.grade}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{kit.durationMinutes} د</span>
                    </span>
                  </div>
                  <div className="text-xs font-black text-white">{kit.title}</div>
                  <div className="text-[11px] text-slate-400 font-bold">{kit.subject}</div>
                </button>
              );
            })}
          </div>

          {/* Kit Details & Preview */}
          <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col justify-between bg-slate-950/30">
            {selectedKit && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black mb-2">
                    <BookOpen size={13} />
                    <span>{selectedKit.stageLabel} • {selectedKit.grade}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedKit.title}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">{selectedKit.subject}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                  <div className="font-black text-amber-400 mb-1 flex items-center gap-1.5">
                    <Compass size={14} />
                    <span>محتوى الكبسولة التعليمية ومواصفاتها:</span>
                  </div>
                  <p>{selectedKit.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-slate-400 text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-amber-400" />
                      <span>المدة المقترحة: {selectedKit.durationMinutes} دقائق</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-emerald-400" />
                      <span>طريقة العمل: {selectedKit.groupWork ? 'عمل في أفواج صغيرة' : 'فردي'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers size={13} className="text-cyan-400" />
                      <span>عناصر السبورة: {selectedKit.elements.length} عناصر</span>
                    </span>
                  </div>
                </div>

                {/* Elements Included Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-slate-400">العناصر التي سيتم إنشاؤها فوراً على السبورة:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span className="truncate">لافتة عنوان النشاط والمدة</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span className="truncate">سند الوضعية والمشكلة</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span className="truncate">رسم ومخطط بياني توضيحي</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span className="truncate">بطاقات سحب وإفلات تفاعلية</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Load Button */}
            <div className="pt-6 border-t border-slate-800 mt-6 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 font-bold">
                💡 سيتم إدراج عناصر النشاط فوراً في منتصف السبورة لتكون جاهزة للشرح.
              </div>
              <button
                onClick={() => {
                  onApplyKit(selectedKit);
                  onClose();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>تطبيق وتنزيل النشاط على السبورة ⚡</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
