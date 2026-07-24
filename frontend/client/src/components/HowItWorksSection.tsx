import { motion } from "framer-motion";
import { Compass, MessageCircle, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Meet Companion",
    description: "Connect with your empathetic AI listener anytime, anywhere.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Share Freely",
    description: "Express your concerns, doubts, or queries without judgment.",
    icon: MessageCircle,
  },
  {
    number: "03",
    title: "Find Support",
    description: "Experience a compassionate space where your thoughts are validated and understood.",
    icon: Sparkles,
  },
];

const HowItWorksSection = ({ onStartJourney }: { onStartJourney?: () => void }) => {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary/60 font-medium tracking-[0.2em] uppercase text-[10px] sm:text-xs"
          >
            Simple Process
          </motion.span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-3 md:mt-4">
            <span className="text-foreground">How It </span>
            <span className="text-gradient-gold">Works</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line - with teal gradient */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(180,65%,35%)] to-transparent -translate-y-1/2 opacity-40" />

          {/* Glowing orb on line - teal accent */}
          <motion.div
            className="hidden lg:block absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2"
            style={{
              background: "hsl(180, 65%, 45%)",
              boxShadow: "0 0 20px hsla(180, 65%, 45%, 0.8), 0 0 40px hsla(180, 65%, 45%, 0.4)",
            }}
            animate={{
              left: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative text-center group"
                >
                  {/* Circle with icon - premium outer glow */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative inline-flex items-center justify-center mb-5 md:mb-8"
                  >
                    {/* Outer teal glow ring */}
                    <div 
                      className="absolute w-20 h-20 sm:w-24 md:w-28 sm:h-24 md:h-28 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                      style={{
                        background: "radial-gradient(circle, hsla(180, 65%, 45%, 0.4) 0%, transparent 70%)",
                      }}
                    />
                    
                    {/* Main circle - minimal with outer glow */}
                    <div 
                      className="relative w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        background: "linear-gradient(135deg, hsla(225, 50%, 10%, 0.9), hsla(225, 50%, 8%, 0.95))",
                        border: "1px solid hsla(43, 80%, 52%, 0.3)",
                        boxShadow: `
                          0 0 20px hsla(180, 65%, 45%, 0.2),
                          0 0 40px hsla(180, 65%, 45%, 0.1),
                          inset 0 1px 0 hsla(43, 80%, 52%, 0.1)
                        `,
                      }}
                    >
                      <Icon 
                        className="w-7 h-7 sm:w-8 md:w-10 sm:h-8 md:h-10 transition-all duration-300"
                        style={{
                          color: "hsl(43, 80%, 58%)",
                          filter: "drop-shadow(0 0 8px hsla(43, 80%, 52%, 0.5))",
                        }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Number badge - with teal accent glow */}
                    <div 
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-9 md:w-10 sm:h-9 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, hsla(225, 50%, 12%, 0.95), hsla(225, 50%, 8%, 0.98))",
                        border: "1px solid hsla(180, 65%, 45%, 0.4)",
                        boxShadow: "0 0 15px hsla(180, 65%, 45%, 0.3), 0 0 30px hsla(180, 65%, 45%, 0.15)",
                      }}
                    >
                      <span 
                        className="font-bold text-xs sm:text-sm"
                        style={{
                          background: "linear-gradient(135deg, hsl(43, 80%, 58%), hsl(180, 65%, 55%))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-24 text-center"
          >
            <button
              onClick={onStartJourney}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[hsl(43,80%,52%)] to-[hsl(43,80%,42%)] hover:from-[hsl(43,80%,58%)] hover:to-[hsl(43,80%,48%)] text-[#050505] text-base md:text-lg font-bold transition-all duration-300 shadow-[0_0_20px_hsla(43,80%,52%,0.4)] hover:shadow-[0_0_30px_hsla(43,80%,52%,0.6)] hover:scale-105"
            >
              Login and chat here
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;