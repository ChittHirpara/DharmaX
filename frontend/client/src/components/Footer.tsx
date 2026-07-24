import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer id="about" className="relative py-10 sm:py-12 md:py-16 px-4 sm:px-6 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="font-display text-primary-foreground text-base sm:text-lg font-bold">ॐ</span>
            </div>
            <span className="font-display text-xl sm:text-2xl font-bold text-gradient-gold">
              Noerax
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center text-sm sm:text-base order-3 md:order-2"
          >
            Ancient Wisdom, Modern Intelligence
          </motion.p>

          {/* Made with love */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm order-2 md:order-3"
          >
            Made with
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary fill-primary" />
            for seekers of wisdom
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/30 text-center text-muted-foreground text-xs sm:text-sm"
        >
          © {new Date().getFullYear()} Noerax. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
