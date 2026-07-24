import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Bell, Shield, Sliders, Upload, Trash2, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'sanctuary' | 'notifications'>('profile');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('UTC +05:30 - Asia / Kolkata');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setAvatarUrl(user.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email || 'seeker'}`);
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      picture: avatarUrl,
      phone,
      language,
      timezone
    };

    localStorage.setItem('noerax_user_settings', JSON.stringify(updatedProfile));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dharma-ink-2 border border-dharma-line-dark rounded-[32px] w-full max-w-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Header */}
              <div className="flex justify-between items-center border-b border-dharma-line-dark pb-4">
                <div>
                  <span className="text-xs text-dharma-flame font-mono uppercase tracking-widest block">Setting</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-dharma-ivory">Account Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-dharma-ivory-dim hover:text-dharma-ivory hover:bg-dharma-ivory/5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-dharma-line-dark pb-3">
                {[
                  { id: 'profile', icon: <User className="w-4 h-4" />, label: 'Personal Information' },
                  { id: 'sanctuary', icon: <Sliders className="w-4 h-4" />, label: 'Sanctuary Preferences' },
                  { id: 'notifications', icon: <Bell className="w-4 h-4" />, label: 'Notifications' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-dharma-flame text-white shadow-md'
                        : 'text-dharma-ivory-dim hover:text-dharma-ivory'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* 1. Personal Information (Matching Reference Screenshot) */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-dharma-ivory">Personal Information</h3>
                    <p className="text-xs text-dharma-ivory-dim">Edit your personal details.</p>
                  </div>

                  {/* Avatar Upload Box */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-dharma-ink/60 border border-dharma-line-dark">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full border-2 border-dharma-flame/50 object-cover"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2 bg-dharma-flame text-white text-xs font-semibold rounded-xl hover:bg-dharma-saffron transition-all cursor-pointer flex items-center gap-1.5 shadow-md">
                        <Upload className="w-3.5 h-3.5" /> Upload An Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(`https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`)}
                        className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Grid Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-dharma-ivory-dim mb-1.5">First name *</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-dharma-ink border border-dharma-line-dark text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dharma-ivory-dim mb-1.5">Last name *</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-dharma-ink border border-dharma-line-dark text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dharma-ivory-dim mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-dharma-ink border border-dharma-line-dark text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dharma-ivory-dim mb-1.5">Phone number *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-dharma-ink border border-dharma-line-dark text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dharma-ivory-dim mb-1.5">Language *</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-dharma-ink border border-dharma-line-dark text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame transition-colors cursor-pointer"
                      >
                        <option value="English">🌐 English</option>
                        <option value="Hindi">🌐 Hindi (हिन्दी)</option>
                        <option value="Sanskrit">🌐 Sanskrit (संस्कृतम्)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dharma-ivory-dim mb-1.5">Time zone *</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-dharma-ink border border-dharma-line-dark text-dharma-ivory text-xs focus:outline-none focus:border-dharma-flame transition-colors cursor-pointer"
                      >
                        <option value="UTC +05:30 - Asia / Kolkata">🌐 UTC +05:30 - Asia / India</option>
                        <option value="UTC +07:00 - Asia / US">🌐 UTC +07:00 - Asia / US</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Footer */}
              <div className="pt-4 border-t border-dharma-line-dark flex justify-between items-center">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Preferences Saved!
                  </span>
                ) : <span />}

                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-dharma-flame text-white text-xs font-semibold rounded-xl hover:bg-dharma-saffron transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
