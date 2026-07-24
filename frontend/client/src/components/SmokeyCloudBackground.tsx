import { motion } from "framer-motion";
import { memo, useState, useEffect } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const SmokeyCloudBackground = memo(() => {
  const isMobile = useIsMobile();
  
  // Simplified animations on mobile
  const cloudDuration = isMobile ? 30 : 20;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
      {/* Left smokey cloud */}
      <motion.div
        initial={{ x: "-30%", opacity: 0 }}
        animate={{ 
          x: ["-30%", "-10%", "-30%"],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: cloudDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-1/4 w-[400px] md:w-[600px] h-[350px] md:h-[500px] will-change-transform"
        style={{
          background: "radial-gradient(ellipse at center, hsla(43, 60%, 50%, 0.3) 0%, hsla(43, 50%, 40%, 0.15) 40%, transparent 70%)",
          filter: "blur(80px)",
          transform: "rotate(-15deg) translateZ(0)",
        }}
      />
      
      {/* Right smokey cloud */}
      <motion.div
        initial={{ x: "30%", opacity: 0 }}
        animate={{ 
          x: ["30%", "10%", "30%"],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: cloudDuration + 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute right-0 top-1/3 w-[350px] md:w-[550px] h-[300px] md:h-[450px] will-change-transform"
        style={{
          background: "radial-gradient(ellipse at center, hsla(43, 55%, 45%, 0.25) 0%, hsla(38, 50%, 35%, 0.1) 40%, transparent 70%)",
          filter: "blur(70px)",
          transform: "rotate(10deg) translateZ(0)",
        }}
      />
      
      {/* Top center subtle glow */}
      <motion.div
        animate={{
          opacity: [0.1, 0.18, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[500px] md:w-[800px] h-[300px] md:h-[400px] will-change-transform"
        style={{
          background: "radial-gradient(ellipse at center bottom, hsla(43, 70%, 50%, 0.2) 0%, transparent 60%)",
          filter: "blur(60px)",
          transform: "translateZ(0)",
        }}
      />
      
      {/* Bottom ambient glow */}
      <motion.div
        animate={{
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[1000px] h-[200px] md:h-[300px]"
        style={{
          background: "radial-gradient(ellipse at center top, hsla(43, 60%, 45%, 0.15) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />
      
      {/* Floating wisps - hidden on mobile for performance */}
      {!isMobile && (
        <>
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/4 top-1/2 w-[300px] h-[200px] will-change-transform"
            style={{
              background: "radial-gradient(ellipse at center, hsla(43, 65%, 55%, 0.2) 0%, transparent 60%)",
              filter: "blur(50px)",
            }}
          />
          
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 20, 0],
              opacity: [0.08, 0.16, 0.08],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute right-1/4 top-1/3 w-[250px] h-[180px] will-change-transform"
            style={{
              background: "radial-gradient(ellipse at center, hsla(43, 60%, 50%, 0.18) 0%, transparent 60%)",
              filter: "blur(45px)",
            }}
          />
        </>
      )}
    </div>
  );
});

SmokeyCloudBackground.displayName = "SmokeyCloudBackground";

export default SmokeyCloudBackground;