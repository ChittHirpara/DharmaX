import { motion } from "framer-motion";

const WisdomBridgeSection = () => {
  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Golden Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-primary/70 font-medium tracking-[0.2em] uppercase text-[10px] sm:text-xs md:text-sm mb-6"
        >
          From Ancient Scrolls to the Intelligence of the 21st Century
        </motion.p>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold mb-8 md:mb-10"
        >
          Where Timeless Wisdom Meets Modern Clarity
        </motion.h2>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 text-foreground/60 text-sm sm:text-base md:text-lg leading-relaxed font-body max-w-3xl mx-auto"
        >
          <p>
            Noerax is a bridge between sacred knowledge and evolving technology.
          </p>
          <p>
            It transforms ancient teachings into AI-powered guidance, making the valuable wisdom 
            of the Mahabharata, Gita, and other sacred texts easily accessible for today's world.
          </p>
          <p className="text-foreground/50">
            A calm digital sanctuary where tradition and intelligence move together.
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12 md:mt-16 flex items-center justify-center gap-4"
        >
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-primary/30" />
        </motion.div>
      </div>
    </section>
  );
};

export default WisdomBridgeSection;
