import { motion } from "framer-motion";
import { useState } from "react";
import ScriptureCard from "./ScriptureCard";

const scriptures = [
  {
    title: "",
    description: "Deep thoughts and absolute facts to help you find your center when life gets too loud. Basically, the ultimate vibe check for your mind.",
    icon: "vedas" as const,
  },
  {
    title: "",
    description: "Your go-to guide for navigating main character energy, beating burnout, and figuring out what actually matters right now.",
    icon: "vedas" as const,
  },
  {
    title: "",
    description: "Epic life lessons on handling drama, toxic situations, and making tough choices. Because protecting your peace is top tier.",
    icon: "mahabharata" as const,
  },
  {
    title: "",
    description: "Cosmic perspectives to help you zoom out when you're overthinking. Total grounding energy for those late-night existential thoughts.",
    icon: "puranas" as const,
  },
];

const ScripturesSection = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardClick = (title: string) => {
    setActiveCard(activeCard === title ? null : title);
  };

  return (
    <section id="learnings" className="relative py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary/60 font-medium tracking-[0.2em] uppercase text-xs"
          >
            Learnings
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 md:mt-4">
            <span className="text-foreground">Explore </span>
            <span className="text-gradient-gold">Wisdom</span>
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {scriptures.map((scripture, index) => (
            <ScriptureCard
              key={scripture.title}
              title={scripture.title}
              description={scripture.description}
              icon={scripture.icon}
              index={index}
              isActive={activeCard === scripture.title}
              onClick={() => handleCardClick(scripture.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScripturesSection;
