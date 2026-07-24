import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HeartHandshake, ArrowLeft, Trash2, LogOut, ShieldCheck, User, ShieldAlert, Bookmark, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useStreak } from '../lib/StreakContext';

export const Settings = () => {
  const { user, logout } = useAuth();
  const { streak } = useStreak();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auth Guard
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleClearConversations = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all your conversations? This cannot be undone.")) {
      return;
    }
    
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      await api.deleteAllConversations();
      setSuccessMsg('All conversations have been successfully deleted.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to clear conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-dharma-ink min-h-screen text-dharma-ivory font-sans flex flex-col justify-between">
      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-24 flex-grow flex justify-center px-4 relative">
        {/* Ambient background blur */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-dharma-flame/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-2xl space-y-8 relative z-10">

          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-dharma-ink-2/80 hover:bg-dharma-ink-3 text-dharma-ivory text-xs font-semibold border border-dharma-line-dark hover:border-dharma-flame/40 transition-all duration-300 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-dharma-flame" />
              <span>Back to Chat</span>
            </button>

            <h1 className="font-serif text-2xl font-bold text-dharma-ivory">Account Settings</h1>
          </div>
          
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-3 shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl flex items-center gap-3 shadow-sm"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </motion.div>
          )}

          {/* User Profile Overview */}
          <section className="bg-dharma-ink-2/90 rounded-3xl p-6 md:p-8 border border-dharma-line-dark shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-dharma-line-dark pb-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-dharma-flame" />
                <h3 className="text-lg font-bold text-dharma-ivory">User Profile</h3>
              </div>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-full bg-dharma-flame text-white text-xs font-bold shadow-md hover:bg-dharma-saffron transition-all flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>View Full Profile</span>
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dharma-ivory-dim mb-2 tracking-wide uppercase">Username</label>
                <div className="px-4 py-3 bg-dharma-ink-3 rounded-xl border border-dharma-line-dark text-dharma-ivory font-semibold text-sm">
                  {user.username || 'Mindful Seeker'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-dharma-ivory-dim mb-2 tracking-wide uppercase">Email Address</label>
                <div className="px-4 py-3 bg-dharma-ink-3 rounded-xl border border-dharma-line-dark text-dharma-ivory font-semibold text-sm">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-dharma-flame/10 border border-dharma-flame/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-dharma-flame" />
                <div>
                  <h4 className="text-xs font-bold text-dharma-flame uppercase tracking-wider">Mindful Streak Status</h4>
                  <p className="text-sm font-semibold text-dharma-ivory">{streak} Days Active</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="text-xs text-dharma-flame underline hover:text-white transition-colors"
              >
                Check Saved Bookmarks
              </button>
            </div>
          </section>

          {/* Data & Privacy */}
          <section className="bg-dharma-ink-2/90 rounded-3xl p-6 md:p-8 border border-dharma-line-dark shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-dharma-line-dark pb-4">
              <ShieldCheck className="w-6 h-6 text-dharma-saffron" />
              <h3 className="text-lg font-bold text-dharma-ivory">Data & Privacy</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-dharma-ivory text-sm">Clear all conversations</h4>
                <p className="text-xs text-dharma-ivory-dim mt-1">Permanently delete all your chat history with Noerax.</p>
              </div>
              <button
                onClick={handleClearConversations}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold border border-red-500/30 transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 text-xs cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> 
                {loading ? 'Clearing...' : 'Clear All History'}
              </button>
            </div>
          </section>

          {/* Logout */}
          <section className="pt-4 flex justify-center">
             <button
                onClick={handleLogout}
                className="px-8 py-3 rounded-full bg-dharma-ink-2 border border-dharma-line-dark hover:border-red-500/40 text-dharma-ivory-dim hover:text-red-400 font-semibold shadow-md transition-all flex items-center gap-2 text-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-dharma-ivory-dim" /> Sign Out of Noerax
             </button>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};
