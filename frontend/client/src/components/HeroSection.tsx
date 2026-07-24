import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import MandalaBackground from "./MandalaBackground";
import SmokeyCloudBackground from "./SmokeyCloudBackground";
import { useTheme } from "../context/ThemeContext";
const HeroSection = ({ onStartJourney }: { onStartJourney?: () => void }) => {
  const { isGenZMode } = useTheme();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToExplore = () => {
    document.querySelector("#scriptures")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  // Staggered text variants for GenZ mode
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
  };

  const genZHeadline = "Unlock the Eternal Knowledge";

  return <section className={`relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0 ${isGenZMode ? 'bg-black' : ''}`}>
      {/* Backgrounds with Parallax */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full h-full">
        {!isGenZMode ? (
          <>
            <SmokeyCloudBackground />
            <MandalaBackground />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* GenZ Cyberpunk grid/glow background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-black to-black" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>
        )}
      </motion.div>
      
      <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Tagline */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.3
      }} className="mb-6 md:mb-10">
          <span className="text-primary/60 font-medium tracking-[0.25em] uppercase text-[10px] sm:text-xs md:text-sm">
            Ancient Wisdom, Modern Intelligence
          </span>
        </motion.div>

        {/* Main headline */}
        {isGenZMode ? (
          <motion.h1 
            variants={sentence}
            initial="hidden"
            animate="visible"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-6 md:mb-10 px-2 tracking-tighter"
          >
            {genZHeadline.split(" ").map((word, index) => (
              <span key={word + "-" + index} className="inline-block mr-2 sm:mr-4 last:mr-0">
                {word.split("").map((char, index) => (
                  <motion.span 
                    key={char + "-" + index} 
                    variants={letter}
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-br from-white via-fuchsia-200 to-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>
        ) : (
          <motion.h1 initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 1.2,
          delay: 0.5
        }} className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-6 md:mb-10 hero-headline px-2">
          <span className="hero-shimmer-text whitespace-normal sm:whitespace-nowrap text-destructive bg-destructive">
            Unlock the Eternal Knowledge
          </span>
        </motion.h1>
        )}

        {/* Sub-headline */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.8
      }} className={`text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-lg md:max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed font-body px-4 ${isGenZMode ? 'text-gray-300 font-medium' : 'text-foreground/60'}`}>
          Journey through timeless wisdom of Vedas, Upanishads, Bhagavad Gita 
          and ancient scriptures enhanced with modern AI.
        </motion.p>

        {/* CTA Button */}
        <motion.button initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 1
      }} whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.98
      }} onClick={onStartJourney || scrollToExplore} 
         className={`text-sm sm:text-base md:text-lg mx-auto group w-full sm:w-auto max-w-xs sm:max-w-none relative overflow-hidden flex items-center justify-center gap-2 ${
           isGenZMode 
            ? 'px-8 py-4 rounded-full font-bold bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow duration-300' 
            : 'hero-cta-button'
         }`}>
          {isGenZMode && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            />
          )}
          <span className="relative z-10">Start Exploring</span>
          <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            {isGenZMode ? <Sparkles size={18} /> : '✦'}
          </span>
        </motion.button>

        {/* Scroll indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.8
      }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{
          y: [0, 8, 0]
        }} transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="cursor-pointer text-primary/40 hover:text-primary/70 transition-colors" onClick={scrollToExplore}>
            <ChevronDown size={28} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>;
};
export default HeroSection;