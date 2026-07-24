import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Clock, BookOpen, Quote, User, Bookmark, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStreak } from '../../lib/StreakContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [mantraEnabled, setMantraEnabled] = useState(false);
  const [mantraTime, setMantraTime] = useState('08:00');
  
  const [journalEnabled, setJournalEnabled] = useState(false);
  const [journalTime, setJournalTime] = useState('20:00');

  const { user } = useAuth();
  const { streak } = useStreak();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dharma_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMantraEnabled(parsed.mantraEnabled ?? false);
        setMantraTime(parsed.mantraTime ?? '08:00');
        setJournalEnabled(parsed.journalEnabled ?? false);
        setJournalTime(parsed.journalTime ?? '20:00');
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('dharma_notifications', JSON.stringify({
      mantraEnabled,
      mantraTime,
      journalEnabled,
      journalTime
    }));
  }, [mantraEnabled, mantraTime, journalEnabled, journalTime]);

  const handleOpenProfile = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-dharma-ink w-full max-w-md rounded-3xl shadow-2xl border border-dharma-line-dark overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dharma-line-dark bg-dharma-ink-2">
              <h2 className="text-2xl font-serif text-dharma-ivory flex items-center gap-2">
                <Bell className="w-5 h-5 text-dharma-flame" />
                Settings & Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-dharma-ivory/5 rounded-full transition-colors text-dharma-ivory-dim hover:text-dharma-ivory cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

              {/* Profile Card Banner */}
              <div 
                onClick={handleOpenProfile}
                className="p-4 rounded-2xl bg-gradient-to-r from-dharma-flame/15 to-dharma-saffron/15 border border-dharma-flame/30 hover:border-dharma-flame cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-dharma-flame text-white flex items-center justify-center font-serif font-bold text-lg shadow-md">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'N'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-dharma-ivory group-hover:text-dharma-flame transition-colors flex items-center gap-1.5 text-sm">
                        {user?.username || 'Mindful Seeker'}
                        <ShieldCheck className="w-3.5 h-3.5 text-dharma-flame" />
                      </h4>
                      <p className="text-xs text-dharma-ivory-dim flex items-center gap-2 mt-0.5">
                        <span className="text-dharma-flame font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" /> {streak} Day Streak
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-dharma-flame group-hover:translate-x-1 transition-transform">
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Daily Mantra */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                      <Quote className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dharma-ivory text-sm">Daily Mantra</h3>
                      <p className="text-xs text-dharma-ivory-dim">Receive your chosen mantra</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={mantraEnabled}
                      onChange={(e) => setMantraEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-dharma-ink-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dharma-flame"></div>
                  </label>
                </div>
                
                {mantraEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center justify-between pl-12 pr-2"
                  >
                    <span className="text-xs text-dharma-ivory-dim flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Time
                    </span>
                    <input 
                      type="time" 
                      value={mantraTime}
                      onChange={(e) => setMantraTime(e.target.value)}
                      className="bg-dharma-ink-2 border border-dharma-line-dark rounded-md px-3 py-1 text-xs text-dharma-ivory focus:outline-none focus:border-dharma-flame"
                    />
                  </motion.div>
                )}
              </div>

              {/* Journal Reminder */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dharma-ivory text-sm">Journal Reminder</h3>
                      <p className="text-xs text-dharma-ivory-dim">Time to reflect and write</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={journalEnabled}
                      onChange={(e) => setJournalEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-dharma-ink-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dharma-flame"></div>
                  </label>
                </div>

                {journalEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center justify-between pl-12 pr-2"
                  >
                    <span className="text-xs text-dharma-ivory-dim flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Time
                    </span>
                    <input 
                      type="time" 
                      value={journalTime}
                      onChange={(e) => setJournalTime(e.target.value)}
                      className="bg-dharma-ink-2 border border-dharma-line-dark rounded-md px-3 py-1 text-xs text-dharma-ivory focus:outline-none focus:border-dharma-flame"
                    />
                  </motion.div>
                )}
              </div>

              {/* Full Profile CTA Button */}
              <button
                onClick={handleOpenProfile}
                className="w-full py-3 px-4 rounded-xl bg-dharma-ink-2 hover:bg-dharma-flame text-dharma-ivory hover:text-white font-bold text-xs border border-dharma-line-dark hover:border-dharma-flame transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Bookmark className="w-4 h-4 text-dharma-flame group-hover:text-white" />
                <span>Open Full Profile & Saved Bookmarks</span>
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
