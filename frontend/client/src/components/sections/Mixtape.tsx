import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Share2, Plus, Minus, Headphones, ListMusic, Check, Copy, BookOpen } from 'lucide-react';

const availableVerses = [
  { id: 'v1', title: 'Letting Go', source: 'Bhagavad Gita 2:47', text: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.' },
  { id: 'v2', title: 'Mental Stillness', source: 'Yoga Sutras 1.2', text: 'Yoga is the cessation of the fluctuations of the mind.' },
  { id: 'v3', title: 'Interconnectedness', source: 'Isha Upanishad', text: 'All this, whatever moves in this moving world, is enveloped by God.' },
  { id: 'v4', title: 'The Way', source: 'Tao Te Ching', text: 'A journey of a thousand miles begins with a single step.' },
  { id: 'v5', title: 'Inner Power', source: 'Meditations', text: 'You have power over your mind - not outside events. Realize this, and you will find strength.' },
  { id: 'v6', title: 'Impermanence', source: 'Dhammapada', text: 'All conditioned things are impermanent. When one sees this with wisdom, one turns away from suffering.' }
];

export function Mixtape() {
  const [mixtape, setMixtape] = useState<typeof availableVerses>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addToMixtape = (verse: typeof availableVerses[0]) => {
    if (!mixtape.find(v => v.id === verse.id)) {
      setMixtape([...mixtape, verse]);
    }
  };

  const removeFromMixtape = (id: string) => {
    setMixtape(mixtape.filter(v => v.id !== id));
    if (currentPlayingId === id) {
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const togglePlay = () => {
    if (mixtape.length === 0) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentPlayingId(null);
    } else {
      setIsPlaying(true);
      setCurrentPlayingId(mixtape[0].id);
    }
  };

  const shareMixtape = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // In a real app, this would generate a shareable link based on the mixtape IDs
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-100px" }} 
      transition={{ duration: 0.8, ease: "easeOut" }} 
      id="mixtape" 
      className="py-32 bg-dharma-ink-2 relative border-t border-dharma-line-dark"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-dharma-ivory/5 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ListMusic className="w-8 h-8 text-dharma-ivory" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-dharma-ivory mb-6"
          >
            Wisdom Mixtape
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-dharma-ivory-dim text-lg max-w-2xl mx-auto"
          >
            Curate your own personal collection of favorite verses. Create a playlist of wisdom to listen to during your meditation, commute, or whenever you need centering.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Available Verses */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-dharma-ivory border-b border-dharma-line-dark pb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-dharma-ivory-dim" />
              Discover Verses
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin">
              {availableVerses.map(verse => {
                const isAdded = mixtape.some(v => v.id === verse.id);
                return (
                  <div key={verse.id} className="bg-dharma-ink p-5 rounded-2xl border border-dharma-line-dark shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-dharma-ivory">{verse.title}</h4>
                        <p className="text-xs text-dharma-ivory-dim uppercase tracking-wider">{verse.source}</p>
                      </div>
                      <button
                        onClick={() => isAdded ? removeFromMixtape(verse.id) : addToMixtape(verse)}
                        className={`p-2 rounded-full transition-colors ${
                          isAdded 
                            ? 'bg-dharma-ivory/10 text-dharma-ivory hover:bg-dharma-ivory/20' 
                            : 'bg-dharma-ivory text-dharma-ink hover:bg-dharma-flame'
                        }`}
                      >
                        {isAdded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-dharma-ivory-dim font-serif italic text-sm">"{verse.text}"</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Your Mixtape */}
          <div className="bg-dharma-ink border border-dharma-line-dark rounded-3xl p-8 shadow-lg flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-8 border-b border-dharma-line-dark pb-6">
              <h3 className="font-serif text-2xl text-dharma-ivory flex items-center gap-2">
                <Headphones className="w-6 h-6 text-dharma-flame" />
                Your Mixtape
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={shareMixtape}
                  className="p-2.5 bg-dharma-ivory/5 hover:bg-dharma-ivory/10 rounded-full text-dharma-ivory transition-colors relative"
                  title="Share Mixtape"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dharma-ivory text-dharma-ink text-xs py-1 px-2 rounded font-medium">
                      Copied!
                    </span>
                  )}
                </button>
                <button 
                  onClick={togglePlay}
                  disabled={mixtape.length === 0}
                  className="w-12 h-12 flex items-center justify-center bg-dharma-ivory text-dharma-ink rounded-full hover:bg-dharma-flame transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <AnimatePresence>
                {mixtape.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60"
                  >
                    <ListMusic className="w-12 h-12 text-dharma-ivory-dim mb-4" />
                    <p className="text-dharma-ivory-dim max-w-[200px]">
                      Add verses from the left to build your wisdom mixtape.
                    </p>
                  </motion.div>
                ) : (
                  mixtape.map((verse, index) => (
                    <motion.div
                      key={verse.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
                        currentPlayingId === verse.id 
                          ? 'bg-dharma-ivory/5 border-dharma-gold/50' 
                          : 'bg-dharma-ink-2 border-transparent hover:border-dharma-line-dark'
                      }`}
                    >
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-dharma-ivory/10 text-dharma-ivory rounded-full font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-dharma-ivory leading-snug">{verse.title}</h4>
                        <p className="text-xs text-dharma-ivory-dim">{verse.source}</p>
                      </div>
                      {currentPlayingId === verse.id && isPlaying && (
                        <div className="flex gap-1 items-center px-2">
                          <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-dharma-flame rounded-full" />
                          <motion.div animate={{ height: [12, 20, 12] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-dharma-flame rounded-full" />
                          <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-dharma-flame rounded-full" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFromMixtape(verse.id)}
                        className="p-1.5 text-dharma-ivory-dim hover:text-dharma-flame transition-colors rounded-full hover:bg-dharma-ivory/5"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            
            {mixtape.length > 0 && (
              <div className="mt-6 pt-4 border-t border-dharma-line-dark text-center text-sm text-dharma-ivory-dim font-medium">
                {mixtape.length} track{mixtape.length > 1 ? 's' : ''} • {mixtape.length * 2} mins
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
