import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowLeft, Search, Tag, X, Clock, Share2, Printer, Sparkles, Bookmark } from 'lucide-react';
import { BLOG_ARTICLES, BLOG_CATEGORIES, BlogArticle } from '../../data/blogArticles';

export default function BlogPage() {
  const [selected, setSelected] = useState<BlogArticle | null>(null);
  const [cat, setCat] = useState<string>('الكل');
  const [search, setSearch] = useState<string>('');

  const filtered = BLOG_ARTICLES.filter(a =>
    (cat === 'الكل' || a.category === cat) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || 
     a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
     a.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  const handlePrint = () => {
    window.print();
  };

  if (selected) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-24 font-sans" dir="rtl">
        {/* Top Back Navigation & Actions */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setSelected(null)} 
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black hover:gap-3 transition-all text-sm group"
          >
            <ArrowLeft size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>العودة لقائمة المقالات البيداغوجية</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-all"
            title="طباعة المقال"
          >
            <Printer size={15} />
            <span>طباعة المقال</span>
          </button>
        </div>

        {/* Hero Image */}
        <div className="h-72 sm:h-96 rounded-[2.5rem] overflow-hidden mb-8 shadow-xl relative border border-slate-200/60 dark:border-slate-800">
          <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 right-6 left-6 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black px-3.5 py-1 bg-emerald-500 text-white rounded-full shadow-md">
                {selected.category}
              </span>
              <span className="text-xs text-slate-200 font-bold flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                <Calendar size={13} /> {selected.date}
              </span>
              <span className="text-xs text-slate-200 font-bold flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                <Clock size={13} /> {selected.readTime}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-[1.4] text-white drop-shadow-md">
              {selected.title}
            </h1>
          </div>
        </div>

        {/* Tags */}
        {selected.tags && selected.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <span className="text-xs font-black text-slate-400 flex items-center gap-1">
              <Tag size={13} /> الكلمات المفتاحية:
            </span>
            {selected.tags.map(t => (
              <span key={t} className="text-xs font-bold px-2.5 py-1 bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 font-sans leading-[1.8] text-base">
            <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200 leading-[1.9] text-base md:text-lg">
              {selected.content}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto space-y-8 font-sans pb-24" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1b4332] via-emerald-800 to-teal-900 text-white p-8 sm:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-8 border-emerald-950">
        <div className="space-y-3 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-700/60 rounded-full border border-emerald-500/40 text-emerald-200 text-xs font-black">
            <Sparkles size={14} className="text-yellow-300" />
            <span>مستودع المعرفة البيداغوجية والديداكتيكية والتشريع المدرسي</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.4]">
            المدونة التربوية الشاملة
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base font-bold leading-relaxed">
            مقالات ودراسات تأصيلية مستخلصة ومفككة من المناهج الرسمية لوزارة التربية، أدلة التفتيش، ومراجع التعليمية وطرائق التدريس الحديثة.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative z-10 w-full md:w-80">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث في المقالات والمراجع..."
            className="w-full pr-11 pl-4 py-3 bg-white/10 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-2xl font-bold text-sm text-white placeholder:text-slate-300 outline-none focus:border-yellow-300 focus:bg-white/20 transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-black text-slate-400 px-3">التصنيفات:</span>
        {BLOG_CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${
              cat === c
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-500 font-black text-base">لا توجد مقالات مطابقة لبحثك في هذا القسم</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(article => (
            <article
              key={article.id}
              onClick={() => setSelected(article)}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col hover:-translate-y-2 relative"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div className="absolute top-3.5 right-3.5">
                  <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-emerald-800 dark:text-emerald-300 text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-emerald-100 dark:border-slate-700">
                    <Tag size={11} /> {article.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-4 left-4 flex items-center justify-between text-[11px] text-slate-200 font-bold">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full"><Clock size={11} /> {article.readTime}</span>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 leading-[1.5] group-hover:text-emerald-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {article.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-black text-xs">
                  <span>قراءة المقال الشامل</span>
                  <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
