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

const MandalaBackground = memo(() => {
  const isMobile = useIsMobile();
  
  // Slower rotation on mobile for performance
  const rotationDuration = isMobile ? 180 : 120;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Breathing glow behind mandala */}
      <motion.div
        animate={{
          opacity: [0.08, 0.15, 0.08],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, hsla(43, 74%, 49%, 0.3) 0%, hsla(43, 74%, 49%, 0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main lotus mandala - very faint with breathing animation */}
      <motion.div
        animate={{
          opacity: [0.08, 0.12, 0.08],
          rotate: 360,
        }}
        transition={{
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: rotationDuration, repeat: Infinity, ease: "linear" },
        }}
        className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] will-change-transform"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <linearGradient id="mandalaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(43, 74%, 55%)" />
              <stop offset="50%" stopColor="hsl(43, 80%, 70%)" />
              <stop offset="100%" stopColor="hsl(43, 74%, 55%)" />
            </linearGradient>
            <filter id="mandalaGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer lotus petals */}
          {[...Array(16)].map((_, i) => (
            <g key={`outer-${i}`} transform={`rotate(${i * 22.5} 200 200)`} filter="url(#mandalaGlow)">
              <path
                d="M200 60 Q230 130 200 200 Q170 130 200 60"
                fill="none"
                stroke="url(#mandalaGradient)"
                strokeWidth="0.8"
              />
            </g>
          ))}
          
          {/* Inner lotus petals */}
          {[...Array(12)].map((_, i) => (
            <g key={`inner-${i}`} transform={`rotate(${i * 30} 200 200)`} filter="url(#mandalaGlow)">
              <path
                d="M200 100 Q220 150 200 200 Q180 150 200 100"
                fill="none"
                stroke="url(#mandalaGradient)"
                strokeWidth="0.6"
              />
              <ellipse
                cx="200"
                cy="95"
                rx="4"
                ry="6"
                fill="none"
                stroke="url(#mandalaGradient)"
                strokeWidth="0.4"
              />
            </g>
          ))}
          
          {/* Decorative circles */}
          <circle cx="200" cy="200" r="50" fill="none" stroke="url(#mandalaGradient)" strokeWidth="0.4" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="url(#mandalaGradient)" strokeWidth="0.3" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="url(#mandalaGradient)" strokeWidth="0.3" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="url(#mandalaGradient)" strokeWidth="0.2" />
          
          {/* Center bloom */}
          <circle cx="200" cy="200" r="20" fill="none" stroke="url(#mandalaGradient)" strokeWidth="0.5" />
          {[...Array(8)].map((_, i) => (
            <circle
              key={`center-${i}`}
              cx={200 + Math.cos((i * 45 * Math.PI) / 180) * 30}
              cy={200 + Math.sin((i * 45 * Math.PI) / 180) * 30}
              r="3"
              fill="none"
              stroke="url(#mandalaGradient)"
              strokeWidth="0.3"
            />
          ))}
        </svg>
      </motion.div>

      {/* Secondary counter-rotating mandala - hidden on mobile for performance */}
      {!isMobile && (
        <motion.div
          animate={{
            opacity: [0.04, 0.07, 0.04],
            rotate: -360,
          }}
          transition={{
            opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 180, repeat: Infinity, ease: "linear" },
          }}
          className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] will-change-transform"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {[...Array(8)].map((_, i) => (
              <g key={i} transform={`rotate(${i * 45} 200 200)`}>
                <path
                  d="M200 70 L215 200 L200 330 L185 200 Z"
                  fill="none"
                  stroke="hsl(43, 74%, 60%)"
                  strokeWidth="0.4"
                />
              </g>
            ))}
          </svg>
        </motion.div>
      )}
    </div>
  );
});

MandalaBackground.displayName = "MandalaBackground";

export default MandalaBackground;
