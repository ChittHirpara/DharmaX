import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, ChevronUp, Radio, Waves, CloudRain, Wind } from 'lucide-react';

interface SoundPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const PRESETS: SoundPreset[] = [
  { id: 'singing_bowl', name: '432Hz Singing Bowl', icon: <Radio className="w-4 h-4 text-dharma-flame" />, description: 'Resonant harmonic healing tone' },
  { id: 'rain', name: 'Gentle Sanctuary Rain', icon: <CloudRain className="w-4 h-4 text-cyan-400" />, description: 'Soft raindrops & ambient breeze' },
  { id: 'stream', name: 'Forest River Flow', icon: <Waves className="w-4 h-4 text-emerald-400" />, description: 'Continuous flowing water serenity' },
  { id: 'drone', name: 'Cosmic Deep Drone', icon: <Wind className="w-4 h-4 text-indigo-400" />, description: 'Sub-bass grounding meditation frequency' },
];

export function AmbientSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('singing_bowl');
  const [volume, setVolume] = useState<number>(0.5);
  const [isOpen, setIsOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);

  // Stop current web audio synthesis
  const stopAudio = () => {
    activeNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = [];
  };

  // Start web audio synthesis according to preset
  const startAudio = (presetId: string) => {
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      if (presetId === 'singing_bowl') {
        // 432 Hz Solfeggio fundamental + harmonics
        const freqs = [108, 216, 432, 864];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          // Gentle LFO tremolo
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
          lfoGain.gain.setValueAtTime(0.05, ctx.currentTime);
          lfo.connect(gain.gain);
          lfo.start();

          gain.gain.setValueAtTime(0.15 / (idx + 1), ctx.currentTime);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();

          activeNodesRef.current.push(osc, gain, lfo, lfoGain);
        });
      } else if (presetId === 'rain') {
        // Pink noise generator for rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        activeNodesRef.current.push(whiteNoise, filter);
      } else if (presetId === 'stream') {
        // Resonant filtered noise for river flow
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        activeNodesRef.current.push(whiteNoise, filter);
      } else if (presetId === 'drone') {
        // Deep space sub-bass drone (64Hz + 128Hz)
        [64, 128, 192].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(300, ctx.currentTime);

          gain.gain.setValueAtTime(0.12 / (idx + 1), ctx.currentTime);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          osc.start();

          activeNodesRef.current.push(osc, gain, filter);
        });
      }
    } catch (e) {
      console.error('Audio Synthesis error:', e);
    }
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      startAudio(activePreset);
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isPlaying, activePreset]);

  const currentPresetObj = PRESETS.find(p => p.id === activePreset) || PRESETS[0];

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 w-80 bg-dharma-ink-2/95 backdrop-blur-xl border border-dharma-line-dark rounded-3xl p-5 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 border-b border-dharma-line-dark pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-dharma-flame flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-dharma-flame animate-pulse" />
                Ambient Soundscape
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dharma-ivory-dim hover:text-dharma-ivory text-xs"
              >
                Close
              </button>
            </div>

            {/* Presets List */}
            <div className="space-y-2 mb-5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePreset(preset.id);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    activePreset === preset.id
                      ? 'border-dharma-flame bg-dharma-flame/10 shadow-md shadow-dharma-flame/10'
                      : 'border-dharma-line-dark bg-dharma-ink/50 hover:border-dharma-line-light'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-dharma-ink border border-dharma-line-dark">
                    {preset.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-dharma-ivory truncate">{preset.name}</h4>
                    <p className="text-[11px] text-dharma-ivory-dim truncate">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 bg-dharma-ink/60 p-3 rounded-2xl border border-dharma-line-dark">
              {volume === 0 ? <VolumeX className="w-4 h-4 text-dharma-ivory-dim" /> : <Volume2 className="w-4 h-4 text-dharma-flame" />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-dharma-flame h-1 bg-dharma-ink-3 rounded-lg cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Launcher */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-3 p-2.5 pr-5 bg-dharma-ink-2/90 backdrop-blur-xl border border-dharma-line-dark rounded-full shadow-2xl cursor-pointer hover:border-dharma-flame/40 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="w-10 h-10 rounded-full bg-dharma-flame text-white flex items-center justify-center shadow-lg shadow-dharma-flame/30 hover:bg-dharma-saffron transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="text-left">
            <p className="text-xs font-semibold text-dharma-ivory flex items-center gap-1.5">
              {currentPresetObj.name}
            </p>
            <p className="text-[10px] text-dharma-ivory-dim">
              {isPlaying ? 'Playing Soundscape' : 'Click to Listen'}
            </p>
          </div>
        </div>

        {/* Animated Wave Bars */}
        {isPlaying && (
          <div className="flex gap-1 items-center ml-2">
            <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-dharma-flame rounded-full" />
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-0.5 bg-dharma-flame rounded-full" />
            <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-0.5 bg-dharma-flame rounded-full" />
          </div>
        )}

        <ChevronUp className={`w-4 h-4 text-dharma-ivory-dim transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.div>
    </div>
  );
}
