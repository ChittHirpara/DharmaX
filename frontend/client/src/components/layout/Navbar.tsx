import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Settings, Flame, LogIn, Sparkles, ArrowRight, User as UserIcon } from "lucide-react";
import { useCart } from "../../lib/CartContext";
import { useStreak } from "../../lib/StreakContext";
import { SettingsModal } from "./SettingsModal";
import { StreakModal } from "../ui/StreakModal";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { items } = useCart();
  const { streak, hasCheckedInToday, checkIn } = useStreak();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (path === '/') {
      e.preventDefault();
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/', { state: { scrollToTop: true } });
      }
      return;
    }

    if (path.startsWith('/#')) {
      e.preventDefault();
      const sectionId = path.replace('/#', '');
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/', { state: { scrollTo: sectionId } });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'py-6 md:py-7 px-6 md:px-16 backdrop-blur-2xl bg-dharma-ink/95 border-b border-dharma-line-dark shadow-2xl shadow-black/80'
            : 'py-8 md:py-9 px-6 md:px-16 bg-dharma-ink/70 backdrop-blur-md border-b border-dharma-line-dark/40'
        }`}
      >
        {/* Brand Logo */}
        <a href="/" onClick={(e) => handleNavClick('/', e)}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3 text-2xl md:text-3xl font-serif text-dharma-ivory tracking-wide cursor-pointer group"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-dharma-flame text-4xl md:text-5xl leading-none drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]"
            >
              ☼
            </motion.span>
            <span className="font-bold text-2xl md:text-3xl">Noera<span className="gradient-text font-black">X</span></span>
          </motion.div>
        </a>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-10 text-base font-semibold text-dharma-ivory-dim">
          {[
            { label: 'Home', path: '/' },
            { label: 'Guides', path: '/#guides' },
            { label: 'Scriptures', path: '/#library' },
            { label: 'Books', path: '/reading-room' },
            { label: 'Journal', path: '/#journal' },
            { label: 'Mixtape', path: '/#mixtape' }
          ].map((item) => (
            <a
              key={item.label}
              href={item.path}
              onClick={(e) => handleNavClick(item.path, e)}
              className="relative group hover:text-dharma-ivory transition-colors duration-200 py-1.5 cursor-pointer"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2.5px] bg-gradient-to-r from-dharma-flame to-dharma-saffron rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          
          {/* Streak Counter Badge */}
          <motion.div 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={checkIn}
            className={`hidden md:flex items-center gap-2 px-4.5 py-2.5 rounded-full border cursor-pointer transition-all duration-300 ${
              hasCheckedInToday 
                ? 'bg-dharma-flame/15 border-dharma-flame/40 text-dharma-flame shadow-[0_0_15px_rgba(249,115,22,0.25)]' 
                : 'bg-dharma-ink-3/80 border-dharma-line-dark text-dharma-ivory-dim hover:border-dharma-flame/40 hover:text-dharma-ivory'
            }`}
            title={hasCheckedInToday ? "Checked in today!" : "Click to check in for today"}
          >
            <motion.div
              animate={hasCheckedInToday ? {} : { scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Flame className={`w-4 h-4 ${hasCheckedInToday ? 'text-dharma-flame' : 'text-dharma-ivory-dim'}`} />
            </motion.div>
            <span className="text-xs font-bold">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </span>
          </motion.div>

          {/* Settings Icon */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 30 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 text-dharma-ivory-dim hover:text-dharma-flame transition-colors rounded-full hover:bg-dharma-flame/10"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Cart Icon */}
          <Link to="/cart">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 text-dharma-ivory-dim hover:text-dharma-flame transition-colors rounded-full hover:bg-dharma-flame/10 block"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-dharma-flame text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>
          </Link>

          {/* Production Level Auth CTAs */}
          {user ? (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/profile')}
                className="relative px-5 py-2.5 rounded-full bg-dharma-ink-3/90 hover:bg-dharma-ink-3 text-dharma-ivory text-xs font-semibold border border-dharma-line-dark hover:border-dharma-flame/40 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-dharma-flame/20 text-dharma-flame flex items-center justify-center text-[10px] font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>Profile</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/chat')}
                className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-dharma-flame via-dharma-saffron to-amber-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Workspace
              </motion.button>
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1.5 px-4 py-2.5 border border-dharma-line-dark rounded-full text-xs font-semibold text-dharma-ivory-dim hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Premium Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login', { state: { isRegister: false } })}
                className="relative px-6 py-3 rounded-full bg-dharma-ink-3/80 hover:bg-dharma-ink-3 text-dharma-ivory text-xs font-semibold border border-dharma-line-dark hover:border-dharma-flame/40 transition-all duration-300 flex items-center gap-2 backdrop-blur-md hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                <LogIn className="w-4 h-4 text-dharma-flame" />
                Sign In
              </motion.button>

              {/* Ultra High-End Sign Up CTA Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/login', { state: { isRegister: true } })}
                className="relative group overflow-hidden px-7 py-3 rounded-full bg-gradient-to-r from-dharma-flame via-dharma-saffron to-amber-500 text-white text-xs font-bold shadow-[0_0_22px_rgba(249,115,22,0.4)] hover:shadow-[0_0_32px_rgba(249,115,22,0.65)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                {/* Shimmer overlay animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </motion.button>
            </div>
          )}
        </div>
      </motion.nav>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <StreakModal />
    </>
  );
}
