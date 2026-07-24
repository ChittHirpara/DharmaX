import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Lock, Mail, User, Eye, EyeOff, Sparkles, 
  ShieldCheck, ArrowRight, BookOpen, PenTool, Music, Flame, Check, Heart, Sun
} from 'lucide-react';

export const AuthPage = () => {
  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialIsRegister = location.state?.isRegister ?? false;
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Feature Card Index for interactive preview
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'scripture',
      icon: BookOpen,
      badge: 'AI Scripture Explainer',
      title: 'Decipher Ancient Wisdom',
      desc: 'Instant, highly relatable breakdowns of Bhagavad Gita, Upanishads & Stoic texts tailored for modern mental clarity.',
      previewTag: 'Bhagavad Gita 2.47',
      previewText: '"You have a right to action, but never to its fruits." → Learn to perform duty without anxiety.'
    },
    {
      id: 'journal',
      icon: PenTool,
      badge: 'Guided Reflection Journal',
      title: 'Analyze Your Thoughts',
      desc: 'Write down your stress or anxiety, and receive AI-backed psychological insights & practical next steps.',
      previewTag: 'Journal Insight',
      previewText: 'Emotional tone: Anxious but hopeful. Actionable step: Practice 5 minutes of focused breathing.'
    },
    {
      id: 'mixtape',
      icon: Music,
      badge: 'Mindful Soundscapes',
      title: 'Calm Your Nervous System',
      desc: 'Immerse yourself in 432Hz ambient soundscapes, meditation bowls, and soothing focus audio.',
      previewTag: 'Now Playing',
      previewText: 'Deep Meditation · 432Hz Binaural Beats & Temple Flute (Playing)'
    }
  ];

  // Auto-cycle through feature showcase cards every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [features.length]);

  // Password validation checklist
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isRegister && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await registerUser(username, email, password);
      } else {
        await loginUser(email, password);
      }
      navigate('/chat');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const currentFeature = features[activeFeature] || features[0];
  const CurrentIcon = currentFeature.icon;

  return (
    <div className="relative min-h-screen bg-dharma-ink flex items-center justify-center p-4 md:p-8 overflow-hidden text-dharma-ivory font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-dharma-flame/10 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-dharma-saffron/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Layout Card */}
      <main className="relative z-10 w-full max-w-5xl my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-dharma-ink-2/95 backdrop-blur-2xl border border-dharma-line-dark rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-12 min-h-[640px]"
        >
          
          {/* ================= LEFT SIDE: AUTH FORM ================= */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between relative bg-dharma-ink-2/40">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2 text-dharma-ivory font-serif text-xl font-bold tracking-wide">
                <span className="text-dharma-flame text-2xl leading-none drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]">☼</span>
                Noera<span className="gradient-text">X</span>
              </Link>
              
              <div className="flex items-center gap-2 text-xs">
                <span className="text-dharma-ivory-dim">
                  {isRegister ? 'Already a member?' : 'New to Noerax?'}
                </span>
                <button
                  type="button"
                  onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
                  className="font-bold text-dharma-flame hover:text-dharma-saffron transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {isRegister ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="my-auto max-w-md w-full mx-auto space-y-6">
              
              {/* Form Title */}
              <div>
                <motion.h2 
                  key={isRegister ? 'reg-title' : 'login-title'}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-serif text-3xl md:text-4xl text-dharma-ivory font-bold mb-2"
                >
                  {isRegister ? 'Sign Up' : 'Sign In'}
                </motion.h2>
                <p className="text-dharma-ivory-dim text-xs md:text-sm">
                  {isRegister 
                    ? 'Unlock your personal sanctuary of wisdom & mental clarity.' 
                    : 'Welcome back to your private AI companion.'}
                </p>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* Username Input (Register Only) */}
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-[11px] font-semibold text-dharma-ivory-dim mb-1 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-dharma-ivory-dim/50 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Arjun Sharma"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-dharma-ink-3 border border-dharma-line-dark text-dharma-ivory text-sm placeholder:text-dharma-ivory-dim/40 focus:outline-none focus:border-dharma-flame/60 transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-dharma-ivory-dim mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-dharma-ivory-dim/50 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-dharma-ink-3 border border-dharma-line-dark text-dharma-ivory text-sm placeholder:text-dharma-ivory-dim/40 focus:outline-none focus:border-dharma-flame/60 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-dharma-ivory-dim mb-1 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-dharma-ivory-dim/50 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-2xl bg-dharma-ink-3 border border-dharma-line-dark text-dharma-ivory text-sm placeholder:text-dharma-ivory-dim/40 focus:outline-none focus:border-dharma-flame/60 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dharma-ivory-dim/60 hover:text-dharma-ivory transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Checklist (Register Only) */}
                {isRegister && (
                  <div className="py-1 space-y-1 text-xs text-dharma-ivory-dim/70">
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-500/20 text-emerald-400' : 'bg-dharma-ink-3 text-dharma-ivory-dim/40'}`}>
                        {hasMinLength ? '✓' : '•'}
                      </span>
                      <span className={hasMinLength ? 'text-emerald-400 font-medium' : ''}>At least 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-500/20 text-emerald-400' : 'bg-dharma-ink-3 text-dharma-ivory-dim/40'}`}>
                        {hasNumber ? '✓' : '•'}
                      </span>
                      <span className={hasNumber ? 'text-emerald-400 font-medium' : ''}>At least one number</span>
                    </div>
                  </div>
                )}

                {/* Confirm Password (Register Only) */}
                {isRegister && (
                  <div>
                    <label className="block text-[11px] font-semibold text-dharma-ivory-dim mb-1 uppercase tracking-wider">
                      Re-type Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-dharma-ivory-dim/50 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-dharma-ink-3 border border-dharma-line-dark text-dharma-ivory text-sm placeholder:text-dharma-ivory-dim/40 focus:outline-none focus:border-dharma-flame/60 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
                  >
                    {authError}
                  </motion.div>
                )}

                {/* Production CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 rounded-full bg-gradient-to-r from-dharma-flame via-dharma-saffron to-amber-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(249,115,22,0.35)] hover:shadow-[0_0_35px_rgba(249,115,22,0.55)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Bottom Footer Link */}
            <div className="pt-6 border-t border-dharma-line-dark/40 flex items-center justify-between text-xs text-dharma-ivory-dim/60">
              <Link to="/" className="hover:text-dharma-ivory transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
              </Link>
              <span>100% Confidential Guarantee</span>
            </div>
          </div>

          {/* ================= RIGHT SIDE: SLEEK FEATURE SHOWCASE CARDS ================= */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-dharma-flame/20 via-dharma-ink-3 to-dharma-ink p-8 md:p-10 flex flex-col justify-between overflow-hidden border-t lg:border-t-0 lg:border-l border-dharma-line-dark">
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-dharma-flame/30 blur-[120px] rounded-full animate-pulse" />
            </div>

            {/* Floating Physics Micro-Badges */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-dharma-ink-2/90 border border-dharma-flame/30 text-dharma-flame text-xs font-bold flex items-center gap-1.5 shadow-xl backdrop-blur-md z-20"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Powered</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 left-6 px-3 py-1.5 rounded-full bg-dharma-ink-2/90 border border-dharma-line-dark text-dharma-saffron text-xs font-bold flex items-center gap-1.5 shadow-xl backdrop-blur-md z-20"
            >
              <Flame className="w-3.5 h-3.5 text-dharma-flame" />
              <span>Ancient Wisdom</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-36 right-6 p-2.5 rounded-2xl bg-dharma-ink-2/90 border border-dharma-line-dark text-rose-400 shadow-xl backdrop-blur-md z-20 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-400" />
              <span>Mindful Space</span>
            </motion.div>

            {/* Header */}
            <div className="relative z-10 space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dharma-flame/10 border border-dharma-flame/30 text-dharma-flame text-[10px] font-bold tracking-widest uppercase">
                <Sun className="w-3 h-3" /> Discover Noerax
              </span>
              <h3 className="font-serif text-2xl text-dharma-ivory font-bold">
                Everything for your peace.
              </h3>
            </div>

            {/* Feature Tabs Buttons */}
            <div className="relative z-10 flex gap-2 my-4">
              {features.map((f, idx) => {
                const Icon = f.icon;
                const isActive = activeFeature === idx;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFeature(idx)}
                    className={`relative flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                      isActive 
                        ? 'bg-dharma-flame text-white border-dharma-flame shadow-lg shadow-dharma-flame/20' 
                        : 'bg-dharma-ink-3/80 border-dharma-line-dark text-dharma-ivory-dim hover:text-dharma-ivory hover:bg-dharma-ink-3'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{f.badge.split(' ')[1] || f.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* Animated 4-Second Auto Progress Bar */}
            <div className="relative z-10 w-full h-1 rounded-full bg-dharma-ink-3 overflow-hidden -mt-2 mb-4">
              <motion.div
                key={activeFeature}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-dharma-flame to-amber-400"
              />
            </div>

            {/* Main Interactive Feature Card Showcase (Guaranteed Visible Block) */}
            <div className="relative z-10 my-auto min-h-[220px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="p-6 rounded-3xl bg-dharma-ink-2/95 border border-dharma-line-dark shadow-2xl backdrop-blur-2xl space-y-4 relative overflow-hidden group hover:border-dharma-flame/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-dharma-flame tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      {currentFeature.badge}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      Live Feature
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-dharma-ivory mb-1">
                      {currentFeature.title}
                    </h4>
                    <p className="text-xs text-dharma-ivory-dim leading-relaxed">
                      {currentFeature.desc}
                    </p>
                  </div>

                  {/* Feature Interactive Live Preview Banner */}
                  <div className="p-3.5 rounded-2xl bg-dharma-ink-3/80 border border-dharma-line-dark text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-dharma-saffron">
                      <span>{currentFeature.previewTag}</span>
                      
                      {/* Animated Equalizer Bars when on Mixtape/Soundscapes */}
                      {currentFeature.id === 'mixtape' ? (
                        <div className="flex items-center gap-1 h-3">
                          {[0, 0.2, 0.4, 0.6].map((delay, i) => (
                            <motion.span
                              key={i}
                              animate={{ height: ['4px', '12px', '4px'] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay }}
                              className="w-1 rounded-full bg-dharma-flame inline-block"
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-400">● Active</span>
                      )}
                    </div>
                    <p className="text-xs text-dharma-ivory italic leading-normal">
                      {currentFeature.previewText}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Footer Status */}
            <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] text-dharma-ivory-dim/60 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Confidential Guarantee
              </span>
              <span>Noerax v2.0</span>
            </div>

          </div>

        </motion.div>
      </main>
    </div>
  );
};
