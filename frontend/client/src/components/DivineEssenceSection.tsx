import { motion } from "framer-motion";
import { memo, useMemo, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

// Soft ambient particles — gold only, very gentle
const AmbientParticles = memo(({ count = 12 }: { count?: number }) => {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 6,
    duration: 14 + Math.random() * 10,
    size: 1.5 + Math.random() * 1.5,
    opacity: 0.15 + Math.random() * 0.2,
  })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-3%",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsla(43, 70%, 60%, ${p.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -500],
            opacity: [0, p.opacity, p.opacity * 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
});
AmbientParticles.displayName = "AmbientParticles";

// Minimal center radial glow
const CenterGlow = memo(() => (
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] md:w-[900px] md:h-[550px]"
      style={{
        background: "radial-gradient(ellipse at center, hsla(43, 60%, 50%, 0.045) 0%, hsla(200, 50%, 40%, 0.02) 45%, transparent 70%)",
        filter: "blur(60px)",
      }}
    />
  </div>
));
CenterGlow.displayName = "CenterGlow";

// Clean tech underline — single pulse
const TechUnderline = memo(() => (
  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-full flex items-center justify-center">
    <div className="w-[70%] h-px bg-gradient-to-r from-transparent via-[hsla(190,65%,50%,0.25)] to-transparent" />
    <motion.div
      className="absolute w-16 h-[1.5px] rounded-full"
      style={{
        background: "linear-gradient(90deg, transparent, hsla(190, 70%, 58%, 0.6), transparent)",
      }}
      animate={{ x: [-120, 120] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
));
TechUnderline.displayName = "TechUnderline";

const DivineEssenceSection = () => {
  const isMobile = useIsMobile();
  const { isGenZMode } = useTheme();

  return (
    <section className={`relative w-full py-28 sm:py-32 md:py-40 lg:py-48 overflow-hidden ${isGenZMode ? 'bg-black text-white' : ''}`}>
      <CenterGlow />
      <AmbientParticles count={isMobile ? 8 : 14} />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-10 sm:mb-12"
        >
          <span className="inline-flex items-center gap-3">
            <span className="w-8 sm:w-10 h-px bg-gradient-to-r from-transparent to-primary/30" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-medium text-muted-foreground">
              Ancient Wisdom × Modern Intelligence
            </span>
            <span className="w-8 sm:w-10 h-px bg-gradient-to-l from-transparent to-primary/30" />
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-14 sm:mb-16"
        >
          <h2 className={`font-display text-[1.9rem] sm:text-[2.2rem] md:text-[2.8rem] lg:text-[3.4rem] font-semibold leading-[1.25] tracking-tight ${isGenZMode ? 'font-black uppercase tracking-tighter' : ''}`}>
            <motion.span
              className={`block mb-1.5 ${isGenZMode ? 'text-fuchsia-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'essence-gold'}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              {isGenZMode ? 'Zero BS Wisdom' : 'Where Timeless Wisdom'}
            </motion.span>
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <span className={isGenZMode ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'essence-cyan'}>
                {isGenZMode ? 'Absolute Clarity' : 'Meets Modern Clarity'}
              </span>
              <TechUnderline />
            </motion.span>
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="max-w-md mx-auto"
        >
          <p className={`font-body text-[13px] sm:text-sm md:text-[15px] font-light leading-[2.2] tracking-wide text-center ${isGenZMode ? 'text-gray-400' : 'text-secondary-foreground/80'}`}>
            {isGenZMode ? (
              <>
                When the feed is too loud, Noerax is your mute button.
                <br />
                <span className="text-gray-500">
                  Ancient algorithms for modern minds — stay grounded, stay based.
                </span>
              </>
            ) : (
              <>
                When paths feel unclear, Noerax becomes a quiet compass.
                <br />
                <span className="text-secondary-foreground/60">
                  Ancient wisdom, shaped for modern minds — clarity, balance, direction.
                </span>
              </>
            )}
          </p>
        </motion.div>

        {/* Minimal divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-16 sm:mt-20 flex items-center justify-center gap-3"
        >
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-primary/25" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <div className="w-1 h-1 rounded-full bg-[hsla(190,60%,50%,0.35)]" />
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[hsla(190,60%,50%,0.2)]" />
        </motion.div>
      </div>
    </section>
  );
};

export default DivineEssenceSection;
