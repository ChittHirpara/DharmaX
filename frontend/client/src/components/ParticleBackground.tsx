import { useMemo, memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

const ParticleBackground = memo(() => {
  const isMobile = useIsMobile();
  
  // Reduce particle count on mobile for performance
  const particleCount = isMobile ? 15 : 50;
  
  const particles = useMemo(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 10,
        size: 2 + Math.random() * 4,
      });
    }
    return newParticles;
  }, [particleCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 will-change-transform">
      {/* Cosmic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-navy-deep" />
      
      {/* Radial glow from center top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, hsla(43, 74%, 49%, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Floating golden particles - GPU accelerated */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsla(43, 74%, 60%, 0.8) 0%, hsla(43, 74%, 49%, 0.3) 100%)`,
            boxShadow: `0 0 ${particle.size * 2}px hsla(43, 74%, 49%, 0.5)`,
          }}
          initial={{ y: "100vh", opacity: 0, scale: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
});

ParticleBackground.displayName = "ParticleBackground";

export default ParticleBackground;
