import React, { useState, useEffect } from 'react';
import {
  FolderOpen, Save, Trash2, Plus, Download, Upload, Check,
  Clock, Calendar, BookOpen, Layers, X, Sparkles, FileText,
  Copy, ArrowRight, Share2, Tag
} from 'lucide-react';
import { BoardElement } from '../WhiteboardView';

export interface SavedBoard {
  id: string;
  title: string;
  subject: string;
  cycle: 'primary' | 'middle' | 'secondary' | 'general';
  level?: string;
  createdAt: string;
  updatedAt: string;
  pages: BoardElement[][];
  thumbnailCount: number;
  notes?: string;
}

const STORAGE_KEY = 'tamkeen_saved_whiteboards';

// Preloaded Algerian Lesson Templates
const DEFAULT_PRELOADED_BOARDS: SavedBoard[] = [
  {
    id: 'sample-math-primary',
    title: 'درس الكسور والأعداد العشرية (5 ابتدائي)',
    subject: 'الرياضيات',
    cycle: 'primary',
    level: 'السنة الخامسة ابتدائي',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z',
    thumbnailCount: 6,
    notes: 'تحضير لحصة تفكيك الكسور ومقارنتها بالشريط الوضعي',
    pages: [
      [
        {
          id: 'card-launch-1',
          type: 'stickynote',
          x: 100,
          y: 60,
          width: 320,
          height: 180,
          color: '#f59e0b',
          strokeWidth: 2,
          fill: '#fef3c7',
          fillOpacity: 0.95,
          text: '🏁 وضعية الانطلاق:\nقسّم أب لوح شوكولاطة يحتوي 10 قطع متساوية بين طفليه أحمد ومريم.\nنصيب أحمد: 4/10\nنصيب مريم: 0.6\nمن أخذ النصيب الأكبر؟',
          fontSize: 16,
          textAlign: 'right',
          fontWeight: 'bold',
        },
        {
          id: 'rect-fraction-bar',
          type: 'rect',
          x: 460,
          y: 80,
          width: 480,
          height: 60,
          color: '#3b82f6',
          strokeWidth: 3,
          fill: '#dbeafe',
          fillOpacity: 0.7,
        },
        {
          id: 'text-label-frac',
          type: 'text',
          x: 480,
          y: 160,
          width: 440,
          height: 40,
          color: '#1e293b',
          strokeWidth: 2,
          text: '0.1  |  0.2  |  0.3  |  0.4  |  0.5  |  0.6  |  0.7  |  0.8  |  0.9  |  1.0',
          fontSize: 18,
          textAlign: 'center',
          fontWeight: 'bold',
        }
      ]
    ]
  },
  {
    id: 'sample-physics-middle',
    title: 'الدارة الكهربائية البسيطة والرموز النظامية (1 متوسط)',
    subject: 'العلوم الفيزيائية',
    cycle: 'middle',
    level: 'السنة الأولى متوسط',
    createdAt: '2026-09-02T10:30:00.000Z',
    updatedAt: '2026-09-02T10:30:00.000Z',
    thumbnailCount: 5,
    notes: 'مخطط دارة مغلقة ومفتوحة مع تمثيل جهة التيار الاصطلاحية',
    pages: [
      [
        {
          id: 'title-elec',
          type: 'text',
          x: 200,
          y: 40,
          width: 500,
          height: 50,
          color: '#2563eb',
          strokeWidth: 2,
          text: '⚡ المخطط النظامي للدارة الكهربائية المغلقة',
          fontSize: 24,
          textAlign: 'center',
          fontWeight: 'bold',
          hasBackground: true
        },
        {
          id: 'battery-1',
          type: 'battery',
          x: 180,
          y: 160,
          width: 140,
          height: 90,
          color: '#10b981',
          strokeWidth: 3,
          fill: '#10b981',
          fillOpacity: 0.15
        },
        {
          id: 'bulb-1',
          type: 'bulb',
          x: 520,
          y: 160,
          width: 120,
          height: 120,
          color: '#f59e0b',
          strokeWidth: 3,
          fill: '#fef3c7',
          fillOpacity: 0.4
        },
        {
          id: 'switch-1',
          type: 'switch',
          x: 350,
          y: 330,
          width: 130,
          height: 70,
          color: '#6366f1',
          strokeWidth: 3
        }
      ]
    ]
  },
  {
    id: 'sample-history-middle',
    title: 'كرونولوجيا الثورة التحريرية الكبرى (4 متوسط)',
    subject: 'التاريخ والجغرافيا',
    cycle: 'middle',
    level: 'السنة الرابعة متوسط',
    createdAt: '2026-09-03T11:00:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z',
    thumbnailCount: 4,
    notes: 'خط زمني لمحطات الثورة التحريرية: الانطلاق، هجومات الشمال، الصومام، الاستقلال',
    pages: [
      [
        {
          id: 'hist-timeline',
          type: 'timeline',
          x: 120,
          y: 120,
          width: 720,
          height: 140,
          color: '#10b981',
          strokeWidth: 3
        },
        {
          id: 'note-1954',
          type: 'stickynote',
          x: 120,
          y: 280,
          width: 170,
          height: 130,
          color: '#ef4444',
          strokeWidth: 2,
          fill: '#fee2e2',
          fillOpacity: 0.9,
          text: '🇩🇿 1 نوفمبر 1954\nاندلاع الثورة التحريرية المباركة وبيان أول نوفمبر',
          fontSize: 14,
          textAlign: 'right',
          fontWeight: 'bold'
        },
        {
          id: 'note-1956',
          type: 'stickynote',
          x: 380,
          y: 280,
          width: 170,
          height: 130,
          color: '#3b82f6',
          strokeWidth: 2,
          fill: '#dbeafe',
          fillOpacity: 0.9,
          text: '📜 20 أوت 1956\nمؤتمر الصومام وإعادة هيكلة جيش التحرير الوطني',
          fontSize: 14,
          textAlign: 'right',
          fontWeight: 'bold'
        },
        {
          id: 'note-1962',
          type: 'stickynote',
          x: 640,
          y: 280,
          width: 170,
          height: 130,
          color: '#10b981',
          strokeWidth: 2,
          fill: '#d1fae5',
          fillOpacity: 0.9,
          text: '🎉 5 جويلية 1962\nاسترجاع السيادة الوطنية وعيد الاستقلال الوطني',
          fontSize: 14,
          textAlign: 'right',
          fontWeight: 'bold'
        }
      ]
    ]
  }
];

interface SavedBoardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPages: BoardElement[][];
  onLoadBoard: (board: SavedBoard) => void;
}

export default function SavedBoardsModal({
  isOpen,
  onClose,
  currentPages,
  onLoadBoard
}: SavedBoardsModalProps) {
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'save_current'>('list');

  // New board form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('الرياضيات');
  const [newCycle, setNewCycle] = useState<'primary' | 'middle' | 'secondary' | 'general'>('middle');
  const [newLevel, setNewLevel] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load boards from localStorage or initialize with defaults
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBoards(parsed);
          return;
        }
      }
      // Initialize with preloaded Algerian boards
      setBoards(DEFAULT_PRELOADED_BOARDS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRELOADED_BOARDS));
    } catch (e) {
      console.error('Error reading saved whiteboards:', e);
      setBoards(DEFAULT_PRELOADED_BOARDS);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentElementCount = currentPages.reduce((acc, p) => acc + p.length, 0);

  // Save current board handler
  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBoard: SavedBoard = {
      id: 'board-' + Date.now(),
      title: newTitle.trim(),
      subject: newSubject,
      cycle: newCycle,
      level: newLevel.trim() || undefined,
      notes: newNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: currentPages,
      thumbnailCount: currentElementCount
    };

    const updated = [newBoard, ...boards];
    setBoards(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('list');
      setNewTitle('');
      setNewNotes('');
    }, 1200);
  };

  // Delete board handler
  const handleDeleteBoard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('هل تريد بالتأكيد حذف هذه السبورة المحفوظة؟')) return;
    const filtered = boards.filter(b => b.id !== id);
    setBoards(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  };

  // Export board as JSON file
  const handleExportJSON = (board: SavedBoard, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(board, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `سبورة_${board.title.replace(/\s+/g, '_')}.tamkeen`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import board from JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.title && Array.isArray(imported.pages)) {
          const newBoard: SavedBoard = {
            ...imported,
            id: 'imported-' + Date.now(),
            title: imported.title + ' (مستورد)',
            updatedAt: new Date().toISOString()
          };
          const updated = [newBoard, ...boards];
          setBoards(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          alert('تم استيراد السبورة بنجاح!');
        } else {
          alert('ملف السبورة غير صالح.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة الملف.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredBoards = boards.filter(b => {
    const matchesCycle = selectedCycle === 'all' || b.cycle === selectedCycle;
    const matchesSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.level && b.level.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCycle && matchesSearch;
  });

  const getCycleBadge = (cycle: string) => {
    switch (cycle) {
      case 'primary': return { label: 'ابتدائي', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
      case 'middle': return { label: 'متوسط', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' };
      case 'secondary': return { label: 'ثانوي', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' };
      default: return { label: 'عام', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
              <FolderOpen size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">سبوراتي ومكتبة الأستاذ المحفوظة</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                  {boards.length} سبورة
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                حفظ وتحميل الحصص والأنشطة وإعادة استخدامها بنقرة واحدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Import JSON button */}
            <label className="cursor-pointer px-3 py-2 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all">
              <Upload size={14} className="text-amber-500" />
              <span>استيراد ملف</span>
              <input type="file" accept=".json,.tamkeen" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'list'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <BookOpen size={15} />
              <span>السبورات المحفوظة ({filteredBoards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('save_current')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'save_current'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Save size={15} />
              <span>حفظ السبورة الحالية ({currentElementCount} عنصر)</span>
            </button>
          </div>

          {activeTab === 'list' && (
            <div className="flex items-center gap-2">
              {/* Cycle Filter */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'primary', label: 'ابتدائي' },
                  { id: 'middle', label: 'متوسط' },
                  { id: 'secondary', label: 'ثانوي' },
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCycle(c.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedCycle === c.id
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: List Saved Boards */}
        {activeTab === 'list' && (
          <div className="flex-1 p-5 overflow-y-auto">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الدرس، المادة أو الطور..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {filteredBoards.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <FolderOpen size={32} />
                </div>
                <h4 className="font-black text-slate-700 dark:text-slate-300 text-sm">لا توجد سبورات محفوظة مطابقة</h4>
                <p className="text-xs text-slate-400">
                  يمكنك حفظ السبورة الحالية عبر التبويب أعلاه، أو إنشاء محتوى جديد.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBoards.map(board => {
                  const cycleInfo = getCycleBadge(board.cycle);
                  const pageCount = board.pages ? board.pages.length : 1;

                  return (
                    <div
                      key={board.id}
                      onClick={() => onLoadBoard(board)}
                      className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${cycleInfo.color}`}>
                            {cycleInfo.label}
                          </span>
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleExportJSON(board, e)}
                              className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-500 hover:text-amber-500 transition-all"
                              title="تصدير كملف للسبورة"
                            >
                              <Download size={13} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteBoard(board.id, e)}
                              className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-rose-500 hover:bg-rose-50 transition-all"
                              title="حذف من المحفوظات"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors leading-snug">
                          {board.title}
                        </h4>

                        <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <span className="text-amber-600 dark:text-amber-400">{board.subject}</span>
                          {board.level && <span>• {board.level}</span>}
                        </div>

                        {board.notes && (
                          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                            {board.notes}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Layers size={13} />
                            <span>{pageCount} {pageCount === 1 ? 'صفحة' : 'صفحات'}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles size={13} />
                            <span>{board.thumbnailCount || 0} عنصر</span>
                          </span>
                        </div>

                        <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1 font-black">
                          <span>فتح السبورة</span>
                          <ArrowRight size={13} className="rotate-180" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Save Current Board Form */}
        {activeTab === 'save_current' && (
          <form onSubmit={handleSaveCurrent} className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">
                  أنت على وشك حفظ محتويات السبورة الحالية
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                  تحتوي السبورة الحالية على {currentPages.length} صفحة و {currentElementCount} عنصر مرسوم.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                عنوان الدرس أو النشاط *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="مثال: حصة الرياضيات - حل المعادلات من الدرجة الأولى"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  المادة التعليمية
                </label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="الرياضيات">الرياضيات</option>
                  <option value="العلوم الفيزيائية">العلوم الفيزيائية</option>
                  <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة</option>
                  <option value="اللغة العربية">اللغة العربية</option>
                  <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
                  <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                  <option value="التربية الإسلامية">التربية الإسلامية</option>
                  <option value="التربية العلمية والتكنولوجية">التربية العلمية (ابتدائي)</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  الطور التعليمي
                </label>
                <select
                  value={newCycle}
                  onChange={e => setNewCycle(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="primary">التعليم الابتدائي</option>
                  <option value="middle">التعليم المتوسط</option>
                  <option value="secondary">التعليم الثانوي</option>
                  <option value="general">عام / متعدد الأطوار</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  المستوى / القسم
                </label>
                <input
                  type="text"
                  value={newLevel}
                  onChange={e => setNewLevel(e.target.value)}
                  placeholder="مثال: السنة 3 متوسط"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                ملاحظات بيداغوجية أو توجيهات للأستاذ (اختياري)
              </label>
              <textarea
                rows={3}
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                placeholder="أهداف الحصة، الكفاءات المستهدفة، أو تعليمات العمل بالأفواج..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saveSuccess}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {saveSuccess ? (
                  <>
                    <Check size={16} />
                    <span>تم الحفظ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>حفظ في مكتبتي</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
