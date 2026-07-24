import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Scroll, Sun, Feather } from "lucide-react";

interface ScriptureCardProps {
  title: string;
  description: string;
  icon: "vedas" | "mahabharata" | "puranas" | "ramayana";
  index: number;
  isActive?: boolean;
  onClick?: () => void;
}

const iconMap = {
  vedas: Sun,
  mahabharata: Scroll,
  puranas: BookOpen,
  ramayana: Feather,
};

const ScriptureCard = ({ title, description, icon, index, isActive = false, onClick }: ScriptureCardProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [showShine, setShowShine] = useState(false);
  const IconComponent = iconMap[icon];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotateX((y - centerY) / 10);
    setRotateY((centerX - x) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleClick = () => {
    setShowShine(true);
    onClick?.();
    setTimeout(() => setShowShine(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="perspective-1000"
      onClick={handleClick}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
        className={`
          relative overflow-hidden rounded-xl p-6 md:p-8 h-full cursor-pointer
          transition-all duration-500 ease-out group
          bg-card/80 backdrop-blur-sm
          ${isActive 
            ? "ring-1 ring-primary/60 shadow-[0_0_30px_-5px_hsla(43,85%,55%,0.35)]" 
            : "ring-1 ring-border/40 hover:ring-primary/40 hover:shadow-[0_0_25px_-5px_hsla(43,85%,55%,0.25)]"
          }
          ${showShine ? "card-active-shine" : ""}
        `}
      >
        {/* Icon */}
        <motion.div
          className={`
            w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-5 md:mb-6 
            transition-all duration-300
            ${isActive ? "bg-gradient-gold shadow-lg" : "bg-gradient-gold/90"}
          `}
          style={{ transform: "translateZ(30px)" }}
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
        </motion.div>

        {/* Title */}
        {title && (
          <h3 
            className={`
              font-display text-xl md:text-2xl font-bold mb-2 md:mb-3 transition-colors duration-300
              ${isActive ? "text-primary" : "text-foreground group-hover:text-primary/90"}
            `}
            style={{ transform: "translateZ(20px)" }}
          >
            {title}
          </h3>
        )}

        {/* Description */}
        <p 
          className="text-muted-foreground text-sm md:text-base leading-relaxed"
          style={{ transform: "translateZ(10px)" }}
        >
          {description}
        </p>

        {/* Decorative corner */}
        <div className={`
          absolute top-3 right-3 md:top-4 md:right-4 transition-opacity duration-300
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}
        `}>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/80" />
        </div>

        {/* Active indicator bar */}
        {isActive && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold rounded-b-xl"
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default ScriptureCard;
