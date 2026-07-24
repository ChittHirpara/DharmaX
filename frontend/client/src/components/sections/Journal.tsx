import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenLine, Sparkles, BookHeart, Compass, Activity, Loader2 } from 'lucide-react';

export function Journal() {
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    insights: string;
    wisdom: string;
    actions: string;
    tone: string;
  } | null>(null);

  const [isSaved, setIsSaved] = useState(false);

  const handleAnalyze = async () => {
    if (!entry.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysis(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/analyze-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry })
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      setAnalysis(data);

      // Auto save to user profile if logged in
      const token = localStorage.getItem("auth_token");
      if (token) {
        fetch("/api/user/journals", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            entry,
            insights: data.insights,
            quote: data.wisdom,
            tone: data.tone
          })
        }).then(() => setIsSaved(true)).catch(err => console.error("Error saving journal:", err));
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-100px" }} 
      transition={{ duration: 0.8, ease: "easeOut" }} 
      id="journal" 
      className="py-32 bg-dharma-ink relative"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-dharma-ivory/5 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <PenLine className="w-8 h-8 text-dharma-ivory" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-dharma-ivory mb-6"
          >
            Journal + AI Reflection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-dharma-ivory-dim text-lg max-w-2xl mx-auto"
          >
            Write freely. Pour your thoughts onto the page. When you're ready, let our AI guide offer deep insights, timeless wisdom, and actionable steps tailored to your entry.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Writing Area */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[400px]">
            <div className="bg-dharma-ink-2 border border-dharma-line-dark rounded-3xl p-6 shadow-sm flex flex-col h-full relative group transition-shadow hover:shadow-md">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="What's on your mind today? Write freely..."
                className="w-full flex-1 min-h-[300px] resize-none bg-transparent border-none focus:outline-none text-dharma-ivory placeholder-dharma-ivory-dim/40 text-lg leading-relaxed font-serif"
              />
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-dharma-line-dark">
                <span className="text-xs text-dharma-ivory-dim font-medium uppercase tracking-widest">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={!entry.trim() || isAnalyzing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-dharma-ivory text-dharma-ink rounded-full text-sm font-medium hover:bg-dharma-flame transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reflecting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Entry
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Analysis Output */}
          <div className="lg:col-span-5 h-full">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {isSaved && (
                    <div className="px-4 py-2 bg-dharma-flame/15 border border-dharma-flame/40 rounded-xl text-dharma-flame text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">✓ Saved Reflection to Your Profile</span>
                      <a href="/profile" className="underline hover:text-white transition-colors">View Profile</a>
                    </div>
                  )}

                  {/* Tone */}
                  <div className="bg-dharma-ink-2 border border-dharma-line-dark p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                        <Activity className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-dharma-ivory">Emotional Tone</h4>
                    </div>
                    <p className="text-dharma-ivory-dim font-serif italic">"{analysis.tone}"</p>
                  </div>

                  {/* Insights */}
                  <div className="bg-dharma-ink-2 border border-dharma-line-dark p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-dharma-ivory">Deep Insight</h4>
                    </div>
                    <p className="text-dharma-ivory-dim leading-relaxed">{analysis.insights}</p>
                  </div>

                  {/* Wisdom */}
                  <div className="bg-dharma-ink-2 border border-dharma-line-dark p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                        <BookHeart className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-dharma-ivory">Timeless Wisdom</h4>
                    </div>
                    <p className="text-dharma-ivory-dim leading-relaxed">{analysis.wisdom}</p>
                  </div>

                  {/* Actions */}
                  <div className="bg-dharma-ink-2 border border-dharma-line-dark p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-700">
                        <Compass className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-dharma-ivory">Next Steps</h4>
                    </div>
                    <p className="text-dharma-ivory-dim leading-relaxed">{analysis.actions}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-dharma-line-dark rounded-3xl bg-dharma-ink-2/50"
                >
                  <Sparkles className="w-12 h-12 text-dharma-ivory/20 mb-4" />
                  <h3 className="font-serif text-xl text-dharma-ivory mb-2">Awaiting Your Words</h3>
                  <p className="text-dharma-ivory-dim">
                    Write your entry and tap "Analyze Entry" to receive personalized insights, wisdom, and guidance.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
