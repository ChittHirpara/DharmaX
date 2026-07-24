import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon, Flame, Bookmark, BookOpen, Sparkles,
  ArrowLeft, CheckCircle2, Shield, Calendar, Quote, MessageSquare,
  LogOut, ArrowRight, Award, Settings, Edit3, Heart, Zap,
  TrendingUp, Headphones, RefreshCw, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStreak } from "../lib/StreakContext";
import { books } from "../lib/books";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { FloatingParticles } from "../components/ui/FloatingParticles";

interface SavedJournal {
  id: string;
  entry: string;
  insights: string;
  quote?: string;
  action_steps?: string[];
  tone?: string;
  created_at: string;
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { streak, hasCheckedInToday, checkIn } = useStreak();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"bookmarks" | "reflections" | "badges" | "settings">("bookmarks");
  const [savedJournals, setSavedJournals] = useState<SavedJournal[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.username || "Mindful Seeker");
  const [spiritualGoal, setSpiritualGoal] = useState("Seeking daily peace, clarity, and ancient wisdom");
  const [selectedPersona, setSelectedPersona] = useState("Noerax Guide");
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    // Load local storage fallback
    try {
      const storedBookmarks = localStorage.getItem("dharma_readingBookmarks");
      if (storedBookmarks) {
        const parsed = JSON.parse(storedBookmarks);
        const activeIds = Object.keys(parsed).filter(id => parsed[id]);
        setUserBookmarks(activeIds);
      }
    } catch {
      setUserBookmarks(["gita", "dhammapada"]);
    }

    // Fetch live backend profile
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.saved_journals) setSavedJournals(data.saved_journals);
          if (data.bookmarks && data.bookmarks.length > 0) setUserBookmarks(data.bookmarks);
          if (data.username) setDisplayName(data.username);
        })
        .catch(err => console.error("Error loading profile:", err));
    }
  }, [user]);

  const bookmarkedBooks = books.filter(b => userBookmarks.includes(b.id));

  const handleSaveProfile = () => {
    setIsEditing(false);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Achievements
  const achievements = [
    { title: "First Step", desc: "Started your journey with Noerax", unlocked: true, icon: "🌱" },
    { title: "Zen Master", desc: "Maintained a 3+ day mindful streak", unlocked: streak >= 3, icon: "🔥" },
    { title: "Scripture Scholar", desc: "Saved 2 or more sacred books", unlocked: bookmarkedBooks.length >= 2, icon: "📜" },
    { title: "Deep Self-Reflection", desc: "Saved an AI-analyzed journal entry", unlocked: savedJournals.length >= 1, icon: "✨" },
    { title: "Sanctuary Guardian", desc: "Reached 7 consecutive days active", unlocked: streak >= 7, icon: "👑" },
  ];

  return (
    <div className="bg-dharma-ink min-h-screen text-dharma-ivory font-sans flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 bg-dharma-ink relative flex-grow overflow-hidden">
        {/* Ambient background particles */}
        <FloatingParticles count={15} />
        
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-dharma-flame/6 blur-[150px] rounded-full pointer-events-none animate-breathe" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-dharma-gold/5 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">

          {/* Top Bar Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-dharma-ink-2/80 hover:bg-dharma-ink-3 text-dharma-ivory text-xs font-semibold border border-dharma-line-dark hover:border-dharma-flame/40 transition-all duration-300 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-dharma-flame" />
              <span>Return to Home</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-dharma-ivory-dim">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Profile Sync Active</span>
            </div>
          </div>

          {/* -- PRODUCTION HERO DASHBOARD COVER BANNER -- */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-3xl bg-dharma-ink-2 border border-dharma-line-dark shadow-2xl overflow-hidden mb-10"
          >
            {/* Top Glowing Mesh Cover Header */}
            <div className="h-44 md:h-52 w-full bg-gradient-to-r from-dharma-ink-3 via-dharma-flame/20 to-amber-600/20 relative overflow-hidden flex items-end px-8 pb-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dharma-flame/30 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-dharma-ivory border border-white/10 flex items-center gap-1.5 shadow-md">
                  <Shield className="w-3.5 h-3.5 text-dharma-flame" /> Verified Seeker
                </span>
              </div>
            </div>

            {/* Main Profile Info Row */}
            <div className="px-6 md:px-10 pb-8 pt-0 relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
                
                {/* Avatar & User Meta */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                  <div className="relative group">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-dharma-flame via-dharma-saffron to-amber-400 p-1.5 shadow-[0_0_30px_rgba(249,115,22,0.45)]">
                      <div className="w-full h-full rounded-full bg-dharma-ink flex items-center justify-center text-4xl md:text-5xl font-serif font-bold text-dharma-ivory">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute bottom-1 right-1 p-2 rounded-full bg-dharma-flame text-white hover:bg-dharma-saffron shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-3xl md:text-4xl font-serif font-bold text-dharma-ivory tracking-wide">
                        {displayName}
                      </h1>
                      <CheckCircle2 className="w-5 h-5 text-dharma-flame" />
                    </div>

                    <p className="text-xs md:text-sm text-dharma-ivory-dim mt-1 max-w-lg">
                      {spiritualGoal}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                      <span className="text-xs text-dharma-ivory-dim flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-dharma-flame" />
                        Member since 2026
                      </span>
                      <span className="text-dharma-line-dark">•</span>
                      <span className="text-xs text-dharma-flame font-bold">
                        Level 5 Practitioner
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => navigate("/chat")}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-dharma-flame via-dharma-saffron to-amber-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    Enter Workspace
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-3 rounded-full bg-dharma-ink-3 hover:bg-dharma-ink text-dharma-ivory text-xs font-semibold border border-dharma-line-dark hover:border-dharma-flame/40 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Settings className="w-4 h-4 text-dharma-flame" />
                    <span>Edit Profile</span>
                  </button>

                  {user && (
                    <button
                      onClick={logout}
                      className="p-3 rounded-full border border-dharma-line-dark text-dharma-ivory-dim hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Logout"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          </motion.div>

          {/* Saved Notification Toast */}
          <AnimatePresence>
            {isSavedNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated successfully!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -- QUICK METRIC CARDS -- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <motion.div
              whileHover={{ y: -3 }}
              onClick={checkIn}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                hasCheckedInToday
                  ? "bg-dharma-ink-2/90 border-dharma-flame/40 shadow-lg shadow-dharma-flame/10"
                  : "bg-dharma-ink-2 border-dharma-line-dark hover:border-dharma-flame/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider">Streak</span>
                <Flame className={`w-5 h-5 ${hasCheckedInToday ? "text-dharma-flame" : "text-dharma-ivory-dim"}`} />
              </div>
              <div className="text-2xl md:text-3xl font-serif font-bold text-dharma-ivory mb-1">
                {streak} Days
              </div>
              <p className="text-[11px] text-dharma-ivory-dim">
                {hasCheckedInToday ? "Checked in today ✓" : "Click to check in today!"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => setActiveTab("bookmarks")}
              className="p-5 rounded-2xl bg-dharma-ink-2 border border-dharma-line-dark hover:border-dharma-flame/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider">Bookmarks</span>
                <Bookmark className="w-5 h-5 text-dharma-saffron" />
              </div>
              <div className="text-2xl md:text-3xl font-serif font-bold text-dharma-ivory mb-1">
                {bookmarkedBooks.length}
              </div>
              <p className="text-[11px] text-dharma-ivory-dim">Saved Books & Scriptures</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => setActiveTab("reflections")}
              className="p-5 rounded-2xl bg-dharma-ink-2 border border-dharma-line-dark hover:border-dharma-flame/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider">Reflections</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl md:text-3xl font-serif font-bold text-dharma-ivory mb-1">
                {savedJournals.length}
              </div>
              <p className="text-[11px] text-dharma-ivory-dim">AI Journal Insights</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => setActiveTab("badges")}
              className="p-5 rounded-2xl bg-dharma-ink-2 border border-dharma-line-dark hover:border-dharma-flame/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider">Milestones</span>
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl md:text-3xl font-serif font-bold text-dharma-ivory mb-1">
                {achievements.filter(a => a.unlocked).length} / {achievements.length}
              </div>
              <p className="text-[11px] text-dharma-ivory-dim">Badges Unlocked</p>
            </motion.div>
          </div>

          {/* -- DASHBOARD NAVIGATION TABS -- */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-dharma-line-dark scrollbar-none">
            {[
              { id: "bookmarks", label: "Bookmarked Wisdom", icon: <Bookmark className="w-4 h-4" />, badge: bookmarkedBooks.length },
              { id: "reflections", label: "AI Reflections", icon: <MessageSquare className="w-4 h-4" />, badge: savedJournals.length },
              { id: "badges", label: "Badges & Milestones", icon: <Award className="w-4 h-4" />, badge: null },
              { id: "settings", label: "Preferences & Persona", icon: <Settings className="w-4 h-4" />, badge: null },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-dharma-ivory text-dharma-ink shadow-lg shadow-dharma-flame/10"
                    : "bg-dharma-ink-2 text-dharma-ivory-dim hover:text-dharma-ivory border border-dharma-line-dark"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? "bg-dharma-ink text-dharma-ivory" : "bg-dharma-ink-3 text-dharma-ivory-dim"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* -- TAB CONTENTS -- */}
          <AnimatePresence mode="wait">

            {/* TAB 1: BOOKMARKS */}
            {activeTab === "bookmarks" && (
              <motion.div
                key="bookmarks"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {bookmarkedBooks.length === 0 ? (
                  <div className="text-center py-20 bg-dharma-ink-2/60 border border-dharma-line-dark rounded-3xl p-12 backdrop-blur-md">
                    <Bookmark className="w-12 h-12 text-dharma-ivory-dim/30 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-dharma-ivory mb-2">No Bookmarks Saved Yet</h3>
                    <p className="text-sm text-dharma-ivory-dim max-w-md mx-auto mb-6">
                      Explore our Digital Sanctuary Library and click the bookmark icon on any scripture or book to save it here.
                    </p>
                    <Link
                      to="/reading-room"
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-dharma-flame text-white font-bold text-xs shadow-lg shadow-dharma-flame/20 hover:scale-105 transition-all"
                    >
                      <BookOpen className="w-4 h-4" /> Explore Reading Room
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedBooks.map(book => (
                      <motion.div
                        key={book.id}
                        whileHover={{ y: -4 }}
                        className="bg-dharma-ink-2 border border-dharma-line-dark rounded-2xl overflow-hidden group hover:border-dharma-flame/40 transition-all shadow-xl flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-dharma-ink-3">
                          <img
                            src={book.cover}
                            alt={book.title}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dharma-ink-2 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-dharma-ivory border border-white/10">
                            {book.genre}
                          </span>
                        </div>

                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="text-lg font-serif font-bold text-dharma-ivory mb-1 group-hover:text-dharma-flame transition-colors">
                              {book.title}
                            </h4>
                            <p className="text-xs text-dharma-ivory-dim mb-3">By {book.author}</p>
                            <p className="text-xs text-dharma-ivory-dim/80 line-clamp-2 mb-5 leading-relaxed">
                              {book.description}
                            </p>
                          </div>

                          <Link
                            to="/reading-room"
                            className="w-full py-3 px-4 rounded-xl bg-dharma-ink-3 hover:bg-dharma-flame text-dharma-ivory hover:text-white font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 border border-dharma-line-dark hover:border-dharma-flame shadow-sm"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Resume Reading</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: SAVED AI REFLECTIONS */}
            {activeTab === "reflections" && (
              <motion.div
                key="reflections"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {savedJournals.length === 0 ? (
                  <div className="text-center py-20 bg-dharma-ink-2/60 border border-dharma-line-dark rounded-3xl p-12 backdrop-blur-md">
                    <Quote className="w-12 h-12 text-dharma-flame/40 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-dharma-ivory mb-2">No Reflections Saved Yet</h3>
                    <p className="text-sm text-dharma-ivory-dim max-w-md mx-auto mb-6">
                      Write your thoughts in the Guided Journal section and let Noerax analyze your reflection to save custom insights here.
                    </p>
                    <a
                      href="/#journal"
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-dharma-flame text-white font-bold text-xs shadow-lg shadow-dharma-flame/20 hover:scale-105 transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Start Journaling
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {savedJournals.map(journal => (
                      <div
                        key={journal.id}
                        className="p-6 md:p-8 rounded-2xl bg-dharma-ink-2 border border-dharma-line-dark hover:border-dharma-flame/30 transition-all shadow-xl"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-dharma-flame/15 text-dharma-flame border border-dharma-flame/25">
                            {journal.tone || "Reflective"}
                          </span>
                          <span className="text-xs text-dharma-ivory-dim flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-dharma-flame" />
                            {new Date(journal.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="mb-4 bg-dharma-ink-3/70 p-4 rounded-xl border border-dharma-line-dark">
                          <p className="text-xs font-semibold text-dharma-ivory-dim uppercase tracking-wider mb-1">Your Reflection Entry</p>
                          <p className="text-sm italic text-dharma-ivory/90">"{journal.entry}"</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-dharma-flame uppercase tracking-wider mb-1">Noerax AI Insights</p>
                          <p className="text-sm text-dharma-ivory leading-relaxed">{journal.insights}</p>
                        </div>

                        {journal.quote && (
                          <div className="border-l-2 border-dharma-flame pl-4 py-2 my-3 bg-dharma-flame/5 rounded-r-xl">
                            <p className="text-xs italic text-dharma-gold font-serif">"{journal.quote}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: BADGES & MILESTONES */}
            {activeTab === "badges" && (
              <motion.div
                key="badges"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {achievements.map((item, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border transition-all ${
                      item.unlocked
                        ? "bg-dharma-ink-2 border-dharma-flame/40 shadow-lg shadow-dharma-flame/10"
                        : "bg-dharma-ink-2/40 border-dharma-line-dark opacity-50"
                    }`}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-serif font-bold text-dharma-ivory text-lg">{item.title}</h4>
                      {item.unlocked ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-dharma-ink-3 text-dharma-ivory-dim">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dharma-ivory-dim leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB 4: PREFERENCES & PERSONA */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="p-8 rounded-3xl bg-dharma-ink-2 border border-dharma-line-dark shadow-xl space-y-6">
                  <h3 className="text-xl font-serif font-bold text-dharma-ivory border-b border-dharma-line-dark pb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-dharma-flame" />
                    AI Guide Preferences
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider mb-2">
                      Preferred Guide Persona
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Noerax Guide", "Vedantic Sage", "Zen Monk", "Stoic Companion"].map(persona => (
                        <button
                          key={persona}
                          onClick={() => setSelectedPersona(persona)}
                          className={`p-4 rounded-xl border text-xs font-bold transition-all text-left ${
                            selectedPersona === persona
                              ? "bg-dharma-flame/15 border-dharma-flame text-dharma-flame shadow-md"
                              : "bg-dharma-ink-3 border-dharma-line-dark text-dharma-ivory-dim hover:text-dharma-ivory"
                          }`}
                        >
                          {persona}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider mb-2">
                      Spiritual Focus Goal
                    </label>
                    <input
                      type="text"
                      value={spiritualGoal}
                      onChange={(e) => setSpiritualGoal(e.target.value)}
                      className="w-full px-4 py-3 bg-dharma-ink-3 border border-dharma-line-dark rounded-xl text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-dharma-flame to-dharma-saffron text-white font-bold text-xs shadow-lg shadow-dharma-flame/25 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-dharma-ink w-full max-w-md rounded-3xl border border-dharma-line-dark shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-dharma-line-dark pb-4 mb-6">
                <h3 className="text-xl font-serif font-bold text-dharma-ivory flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-dharma-flame" />
                  Edit Profile
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-full hover:bg-dharma-ink-2 text-dharma-ivory-dim hover:text-dharma-ivory"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-dharma-ink-2 border border-dharma-line-dark rounded-xl text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dharma-ivory-dim uppercase tracking-wider mb-2">Spiritual Intent / Bio</label>
                  <textarea
                    rows={3}
                    value={spiritualGoal}
                    onChange={(e) => setSpiritualGoal(e.target.value)}
                    className="w-full px-4 py-3 bg-dharma-ink-2 border border-dharma-line-dark rounded-xl text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 py-3 rounded-full bg-dharma-ink-2 text-dharma-ivory text-xs font-bold border border-dharma-line-dark"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="w-1/2 py-3 rounded-full bg-gradient-to-r from-dharma-flame to-dharma-saffron text-white text-xs font-bold shadow-lg shadow-dharma-flame/20"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
