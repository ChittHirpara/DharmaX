import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Headphones, Pause, Play, Search, X, Moon, Sun,
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, List,
  Type, Minus, Plus, AlignLeft
} from "lucide-react";
import { books, genres, type Book } from "../../lib/books";
import { FloatingParticles } from "../ui/FloatingParticles";

const FONT_SIZES = [16, 18, 20, 22];
const LINE_HEIGHTS = [1.6, 1.8, 2.0];
const TILT_MAX = 8;

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const duration = 900;
    const startTime = performance.now() + delay;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) { requestAnimationFrame(tick); return; }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, delay]);
  return <>{display}</>;
}

export function ReadingRoom() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isDarkReader, setIsDarkReader] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [scrollProgress, setScrollProgress] = useState(0);

  const readerScrollRef = useRef<HTMLDivElement>(null);

  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try { const s = localStorage.getItem("dharma_readingBookmarks"); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>(() => {
    try { const s = localStorage.getItem("dharma_readingProgress"); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });

  // Persist
  useEffect(() => { localStorage.setItem("dharma_readingBookmarks", JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem("dharma_readingProgress", JSON.stringify(readingProgress)); }, [readingProgress]);

  // Speech
  useEffect(() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }, [selectedBook, selectedChapterIndex]);
  useEffect(() => { return () => { window.speechSynthesis.cancel(); }; }, []);

  // Restore last-read chapter
  useEffect(() => {
    const idx = readingProgress[selectedBook.id] || 0;
    setSelectedChapterIndex(Math.min(idx, selectedBook.chapters.length - 1));
  }, [selectedBook]);

  // Reader scroll progress
  useEffect(() => {
    const el = readerScrollRef.current;
    if (!el) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setScrollProgress(scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [isReadingMode]);

  // Keyboard navigation
  useEffect(() => {
    if (!isReadingMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsReadingMode(false); }
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); handleNextChapter(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); handlePrevChapter(); }
      else if (e.key === " ") { e.preventDefault(); handleSpeak(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isReadingMode, selectedChapterIndex, isSpeaking, selectedBook]);

  const currentChapter = selectedBook.chapters[selectedChapterIndex];

  const handleSpeak = useCallback(() => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(currentChapter.content);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, currentChapter]);

  const handlePrevChapter = () => {
    if (selectedChapterIndex > 0) {
      window.speechSynthesis.cancel(); setIsSpeaking(false);
      setSelectedChapterIndex(i => i - 1);
      setReadingProgress(p => ({ ...p, [selectedBook.id]: selectedChapterIndex - 1 }));
      readerScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextChapter = () => {
    if (selectedChapterIndex < selectedBook.chapters.length - 1) {
      window.speechSynthesis.cancel(); setIsSpeaking(false);
      setSelectedChapterIndex(i => i + 1);
      setReadingProgress(p => ({ ...p, [selectedBook.id]: selectedChapterIndex + 1 }));
      readerScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const jumpToChapter = (index: number) => {
    window.speechSynthesis.cancel(); setIsSpeaking(false);
    setSelectedChapterIndex(index);
    setReadingProgress(p => ({ ...p, [selectedBook.id]: index }));
    setShowChapterList(false);
    readerScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleBookmark = () => setBookmarks(p => ({ ...p, [selectedBook.id]: !p[selectedBook.id] }));

  const cycleFontSize = () => setFontSize(s => FONT_SIZES[(FONT_SIZES.indexOf(s) + 1) % FONT_SIZES.length]);
  const cycleLineHeight = () => setLineHeight(l => LINE_HEIGHTS[(LINE_HEIGHTS.indexOf(l) + 1) % LINE_HEIGHTS.length]);

  // 3D Bookshelf tilt
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement | null) => {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    card.style.transform = `perspective(600px) rotateY(${((x - cx) / cx) * TILT_MAX}deg) rotateX(${(-(y - cy) / cy) * TILT_MAX}deg) scale3d(1.03,1.03,1.03)`;
  };
  const resetTilt = (card: HTMLDivElement | null) => {
    if (!card) return;
    card.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  };

  const filteredBooks = books.filter(b =>
    (selectedGenre === "All" || b.genre === selectedGenre) &&
    (b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Stats
  const booksReadCount = Object.keys(readingProgress).filter(id => {
    const book = books.find(b => b.id === id);
    return book && (readingProgress[id] ?? 0) >= book.chapters.length - 1;
  }).length;
  const chaptersReadCount = Object.values(readingProgress).reduce((sum, v) => sum + ((v ?? 0) + 1), 0);
  const bookmarkCount = Object.values(bookmarks).filter(Boolean).length;

  const hasUnreadChapters = selectedBook.chapters.length > 1 && (readingProgress[selectedBook.id] ?? 0) < selectedBook.chapters.length - 1;
  const lastReadChapter = readingProgress[selectedBook.id];

  // Reader theme tokens
  const rBg = isDarkReader ? "bg-[#0f0f0f]" : "bg-[#faf8f2]";
  const rText = isDarkReader ? "text-[#e0ddd5]" : "text-[#2a2520]";
  const rMuted = isDarkReader ? "text-[#6b6560]" : "text-[#8a8078]";
  const rToolbarBg = isDarkReader ? "bg-[#1a1917] border-[#2a2724]" : "bg-[#f0ece2] border-[#ddd7c8]";
  const rPaperBg = isDarkReader ? "bg-[#181714] border-[#2a2724]" : "bg-[#fffcf7] border-[#e8e2d2]";
  const rHover = isDarkReader ? "hover:bg-white/5" : "hover:bg-black/5";

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="reading-room"
      className="py-32 bg-dharma-ink relative overflow-hidden"
    >
      {/* Ambient background */}
      <FloatingParticles count={18} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/5 w-[450px] h-[450px] bg-dharma-flame/6 blur-[130px] rounded-full animate-breathe" />
        <div className="absolute bottom-1/4 right-1/5 w-[350px] h-[350px] bg-dharma-gold/5 blur-[110px] rounded-full" style={{ animation: "breathe 7s ease-in-out 2s infinite" }} />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* -- HEADER ------------------------------------ */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-dharma-flame/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-dharma-flame/20"
          >
            <BookOpen className="w-8 h-8 text-dharma-flame" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl mb-4"
          >
            <span className="gradient-text">The Reading Room</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-dharma-ivory-dim text-lg max-w-xl mx-auto"
          >
            Immerse yourself in the original texts. Read, listen, and track your journey through ancient wisdom.
          </motion.p>
        </div>

        {/* -- STATS DASHBOARD --------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { icon: <BookOpen className="w-4 h-4" />, value: booksReadCount, label: "Books Read", color: "text-dharma-flame" },
            { icon: <AlignLeft className="w-4 h-4" />, value: chaptersReadCount, label: "Chapters", color: "text-dharma-gold" },
            { icon: <BookmarkCheck className="w-4 h-4" />, value: bookmarkCount, label: "Bookmarks", color: "text-dharma-saffron" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-dharma-ink-2/60 backdrop-blur-sm border border-dharma-line-dark rounded-full"
            >
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-dharma-ivory font-semibold text-sm">
                <AnimatedNumber value={stat.value} delay={i * 120} />
              </span>
              <span className="text-dharma-ivory-dim text-xs">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* -- SEARCH & FILTERS -------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-14"
        >
          <div className="relative mb-5">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-dharma-ivory-dim" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search books and authors"
              className="w-full pl-13 pr-5 py-3.5 bg-dharma-ink-2 border border-dharma-line-dark rounded-full text-dharma-ivory placeholder-dharma-ivory-dim/40 focus:outline-none focus:border-dharma-flame focus:shadow-[0_0_24px_rgba(56,189,248,0.15)] transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by genre">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                aria-pressed={selectedGenre === genre}
                className={`glow-border px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedGenre === genre
                    ? "bg-dharma-ivory text-dharma-ink shadow-lg shadow-dharma-flame/10"
                    : "bg-dharma-ink-2 text-dharma-ivory-dim hover:text-dharma-ivory hover:bg-dharma-ink-3 border border-dharma-line-dark"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </motion.div>

        {/* -- BOOKSHELF GRID ---------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-16">
          {filteredBooks.length > 0 ? filteredBooks.map((book, idx) => {
            const isCurrent = selectedBook.id === book.id;
            const progressPct = readingProgress[book.id] !== undefined
              ? Math.round(((readingProgress[book.id]! + 1) / book.chapters.length) * 100)
              : 0;
            const isBookmarked = !!bookmarks[book.id];
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.45 }}
                ref={null}
                onMouseMove={(e) => handleTilt(e, e.currentTarget)}
                onMouseLeave={(e) => resetTilt(e.currentTarget)}
                onClick={() => { setSelectedBook(book); setIsReadingMode(true); }}
                className={`bookshelf-card group relative rounded-2xl border cursor-pointer transition-shadow duration-300 overflow-hidden ${
                  isCurrent
                    ? "border-dharma-flame/40 shadow-lg shadow-dharma-flame/10"
                    : "border-dharma-line-dark hover:border-dharma-flame/25 hover:shadow-md hover:shadow-dharma-flame/5"
                } bg-dharma-ink-2`}
                style={{ transition: "transform 0.15s ease-out, box-shadow 0.3s ease" }}
                aria-current={isCurrent ? "true" : undefined}
              >
                {/* Bookmark flag */}
                {isBookmarked && (
                  <div className="absolute top-2 right-2 z-10">
                    <BookmarkCheck className="w-4 h-4 text-dharma-gold drop-shadow-lg" />
                  </div>
                )}

                {/* Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dharma-ink-2 via-transparent to-transparent opacity-80" />

                  {/* Genre badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-dharma-ink/70 backdrop-blur-sm text-dharma-ivory-dim border border-white/10">
                      {book.genre}
                    </span>
                  </div>
                </div>

                {/* Card info */}
                <div className="card-info p-3.5">
                  <h3 className="font-serif text-sm text-dharma-ivory leading-tight truncate mb-0.5">{book.title}</h3>
                  <p className="text-[11px] text-dharma-ivory-dim mb-2">{book.author}</p>

                  {/* Progress bar */}
                  {progressPct > 0 && (
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-dharma-flame rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-dharma-ivory-dim flex items-center gap-1">
                      <Headphones className="w-3 h-3" /> Listen
                    </span>
                    {progressPct > 0 && (
                      <span className="text-[10px] text-dharma-flame font-medium">{progressPct}%</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full text-center py-16 text-dharma-ivory-dim border border-dashed border-dharma-line-dark rounded-2xl">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-20" aria-hidden="true" />
              <p>No books found</p>
            </div>
          )}
        </div>

        {/* -- DETAIL PANE -- BOOK HERO ------------------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBook.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
            className="relative rounded-3xl border border-dharma-line-dark overflow-hidden bg-dharma-ink-2 shadow-2xl"
          >
            {/* Blurred background */}
            <div
              className="absolute inset-0 opacity-[0.08] blur-3xl pointer-events-none"
              style={{ backgroundImage: `url(${selectedBook.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
              {/* Cover with shadow */}
              <motion.div
                initial={{ opacity: 0, rotate: -3, scale: 0.9 }}
                animate={{ opacity: 1, rotate: -2, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <img
                  src={selectedBook.cover}
                  alt={`${selectedBook.title} cover`}
                  className="w-44 h-64 md:w-52 md:h-76 object-cover rounded-xl shadow-2xl shadow-black/40 border border-white/5"
                />
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-3xl md:text-4xl text-dharma-ivory mb-1">{selectedBook.title}</h2>
                <p className="text-dharma-ivory-dim mb-1">{selectedBook.author}</p>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-dharma-flame/10 text-dharma-flame rounded-full mb-5">
                  {selectedBook.genre}
                </span>
                <p className="text-dharma-ivory-dim/70 text-sm leading-relaxed mb-6 max-w-lg">{selectedBook.description}</p>

                {/* Chapter progress dots */}
                <div className="flex items-center gap-1.5 mb-6 flex-wrap justify-center md:justify-start" aria-label={`Chapter progress: ${selectedChapterIndex + 1} of ${selectedBook.chapters.length}`}>
                  {selectedBook.chapters.map((_, i) => {
                    const read = i < selectedChapterIndex;
                    const current = i === selectedChapterIndex;
                    return (
                      <div
                        key={i}
                        className={`progress-dot ${read ? "progress-dot-read" : current ? "progress-dot-current" : "progress-dot-unread"}`}
                      />
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {lastReadChapter !== undefined && hasUnreadChapters && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsReadingMode(true)}
                      className="relative px-6 py-3 bg-dharma-flame text-white rounded-full font-semibold flex items-center gap-2 shadow-lg shadow-dharma-flame/25 hover:shadow-dharma-flame/40 transition-shadow"
                    >
                      <span className="absolute inset-0 rounded-full bg-dharma-flame/30 animate-pulse-ring" />
                      <BookOpen className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Continue Reading</span>
                    </motion.button>
                  )}
                  {(!lastReadChapter || !hasUnreadChapters) && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedChapterIndex(0); setIsReadingMode(true); }}
                      className="px-6 py-3 bg-dharma-ivory text-dharma-ink rounded-full font-semibold flex items-center gap-2 hover:bg-dharma-flame hover:text-white transition-colors"
                    >
                      <BookOpen className="w-4 h-4" /> Start Reading
                    </motion.button>
                  )}
                  <button
                    onClick={handleSpeak}
                    className="px-6 py-3 bg-white/5 border border-dharma-line-dark text-dharma-ivory rounded-full font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isSpeaking ? "Stop Audio" : "Listen"}
                  </button>
                  <button
                    onClick={toggleBookmark}
                    aria-label={bookmarks[selectedBook.id] ? "Remove bookmark" : "Add bookmark"}
                    className="p-3 rounded-full border border-dharma-line-dark text-dharma-ivory-dim hover:text-dharma-gold hover:border-dharma-gold/40 transition-colors"
                  >
                    {bookmarks[selectedBook.id]
                      ? <BookmarkCheck className="w-4 h-4 text-dharma-gold" />
                      : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Chapter preview strip */}
            <div className="border-t border-dharma-line-dark px-8 md:px-12 py-6 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-base text-dharma-ivory">{currentChapter.title}</h3>
                <span className="text-xs text-dharma-ivory-dim font-mono">
                  {selectedChapterIndex + 1}/{selectedBook.chapters.length}
                </span>
              </div>
              <p className="text-dharma-ivory-dim/60 text-sm leading-relaxed line-clamp-3 whitespace-pre-line">{currentChapter.content}</p>
              <button
                onClick={() => setIsReadingMode(true)}
                className="mt-3 text-sm text-dharma-flame hover:text-dharma-gold transition-colors font-medium"
              >
                Continue reading &rarr;
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ----------------------------------------------------
          FULL-SCREEN READER MODAL
          ---------------------------------------------------- */}
      <AnimatePresence>
        {isReadingMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
          >
            {/* Reader scroll progress bar (very top) */}
            <div className="h-0.5 bg-white/5 w-full flex-shrink-0 relative z-20">
              <motion.div
                className="h-full bg-dharma-flame"
                style={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Toolbar */}
            <div className={`flex items-center justify-between px-3 sm:px-5 py-2.5 border-b flex-shrink-0 transition-colors ${rToolbarBg} ${isDarkReader ? "text-[#a09888]" : "text-[#5a5048]"}`}>
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsReadingMode(false); }}
                  aria-label="Close reader"
                  className={`p-2 rounded-full ${rHover} transition-colors flex-shrink-0`}
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="font-serif font-medium truncate text-sm hidden sm:block">{selectedBook.title}</span>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1">
                {/* Font size */}
                <button
                  onClick={cycleFontSize}
                  aria-label={`Font size: ${fontSize}px`}
                  className={`px-2 py-1.5 rounded-full text-[11px] font-bold ${rHover} transition-colors flex items-center gap-1`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{fontSize}</span>
                </button>

                {/* Line height */}
                <button
                  onClick={cycleLineHeight}
                  aria-label={`Line height: ${lineHeight}`}
                  className={`px-2 py-1.5 rounded-full text-[11px] font-bold ${rHover} transition-colors flex items-center gap-1`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lineHeight}</span>
                </button>

                <div className={`h-4 w-px mx-1 ${isDarkReader ? "bg-white/10" : "bg-black/10"}`} />

                {/* Chapter nav */}
                <button onClick={handlePrevChapter} disabled={selectedChapterIndex === 0} aria-label="Previous chapter" className={`p-1.5 rounded-full ${rHover} transition-colors disabled:opacity-25`}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowChapterList(!showChapterList)}
                  aria-label="Table of contents"
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${rHover} transition-colors flex items-center gap-1`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{selectedChapterIndex + 1}/{selectedBook.chapters.length}</span>
                </button>
                <button onClick={handleNextChapter} disabled={selectedChapterIndex === selectedBook.chapters.length - 1} aria-label="Next chapter" className={`p-1.5 rounded-full ${rHover} transition-colors disabled:opacity-25`}>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className={`h-4 w-px mx-1 ${isDarkReader ? "bg-white/10" : "bg-black/10"}`} />

                {/* Bookmark */}
                <button onClick={toggleBookmark} aria-label={bookmarks[selectedBook.id] ? "Remove bookmark" : "Add bookmark"} className={`p-1.5 rounded-full ${rHover} transition-colors`}>
                  {bookmarks[selectedBook.id] ? <BookmarkCheck className="w-4 h-4 text-dharma-flame" /> : <Bookmark className="w-4 h-4" />}
                </button>

                {/* Audio */}
                <button onClick={handleSpeak} aria-label={isSpeaking ? "Stop narration" : "Listen to chapter"} className={`p-1.5 rounded-full ${isSpeaking ? "text-dharma-flame" : ""} ${rHover} transition-colors`}>
                  {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                {/* Theme toggle */}
                <button onClick={() => setIsDarkReader(!isDarkReader)} aria-label="Toggle reader theme" className={`p-1.5 rounded-full ${rHover} transition-colors`}>
                  {isDarkReader ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Chapter list dropdown */}
            <AnimatePresence>
              {showChapterList && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`border-b max-h-60 overflow-y-auto flex-shrink-0 ${rToolbarBg} relative z-20`}
                >
                  {selectedBook.chapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => jumpToChapter(i)}
                      className={`w-full text-left px-6 py-3 text-sm flex items-center gap-3 transition-colors ${
                        i === selectedChapterIndex
                          ? "bg-dharma-flame/10 text-dharma-flame"
                          : `${rText} ${rHover}`
                      }`}
                    >
                      <span className="w-5 text-right font-mono text-[11px] opacity-40">{i + 1}</span>
                      <span>{ch.title}</span>
                      {i <= (readingProgress[selectedBook.id] ?? -1) && (
                        <span className="ml-auto text-[10px] text-dharma-flame/60">[done]</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reading area */}
            <div ref={readerScrollRef} className={`flex-1 overflow-y-auto ${rBg} reader-fade-top reader-fade-bottom`}>
              <div className={`mx-auto px-5 sm:px-8 py-14 sm:py-20 max-w-2xl`}>
                <motion.div
                  key={`${selectedBook.id}-${selectedChapterIndex}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Title block */}
                  <h1 className={`text-2xl sm:text-3xl font-serif mb-1 text-center ${rText}`}>{selectedBook.title}</h1>
                  <p className={`text-center text-xs mb-2 ${rMuted}`}>{selectedBook.author}</p>
                  <div className="flex items-center justify-center gap-3 my-6">
                    <span className={`h-px flex-1 max-w-[40px] ${isDarkReader ? "bg-white/10" : "bg-black/10"}`} />
                    <span className="text-dharma-flame/40 text-xs">*</span>
                    <span className={`h-px flex-1 max-w-[40px] ${isDarkReader ? "bg-white/10" : "bg-black/10"}`} />
                  </div>
                  <h2 className={`text-base font-serif mb-10 text-center ${rMuted}`}>{currentChapter.title}</h2>

                  {/* Chapter content */}
                  <div
                    className={`font-serif leading-[1.9] whitespace-pre-line paper-texture relative rounded-xl p-6 sm:p-10 ${rPaperBg} shadow-inner`}
                    style={{ fontSize: `${fontSize}px`, lineHeight }}
                  >
                    {currentChapter.content.split("\n\n").map((para, i) => (
                      <p key={i} className={i === 0 ? "mb-6" : "mb-6"}>
                        {i === 0 && (
                          <span className={`float-left text-5xl sm:text-6xl font-bold leading-none mr-3 mt-1 font-serif ${isDarkReader ? "text-dharma-flame/60" : "text-dharma-flame/80"}`}>
                            {para.charAt(0)}
                          </span>
                        )}
                        {i === 0 ? para.slice(1) : para}
                      </p>
                    ))}
                  </div>

                  {/* Chapter nav footer */}
                  <div className={`flex justify-between items-center mt-12 pt-5 border-t ${isDarkReader ? "border-white/5" : "border-black/5"}`}>
                    <button
                      onClick={handlePrevChapter}
                      disabled={selectedChapterIndex === 0}
                      className={`flex items-center gap-1.5 text-sm ${rMuted} hover:${rText} transition-colors disabled:opacity-25`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-[11px] font-mono text-dharma-flame/50">{selectedChapterIndex + 1} / {selectedBook.chapters.length}</span>
                    <button
                      onClick={handleNextChapter}
                      disabled={selectedChapterIndex === selectedBook.chapters.length - 1}
                      className={`flex items-center gap-1.5 text-sm ${rMuted} hover:${rText} transition-colors disabled:opacity-25`}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}




