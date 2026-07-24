 import { motion } from "framer-motion";
 
 interface DharmaLogoProps {
   size?: number;
   className?: string;
 }
 
 const DharmaLogo = ({ size = 40, className = "" }: DharmaLogoProps) => {
   return (
     <motion.div
       className={`relative flex items-center justify-center ${className}`}
       style={{ width: size, height: size }}
       whileHover={{ scale: 1.05 }}
     >
       {/* Outer ring with sacred geometry */}
       <svg
         viewBox="0 0 100 100"
         className="absolute inset-0 w-full h-full"
         style={{ filter: "drop-shadow(0 0 8px hsla(43, 85%, 55%, 0.5))" }}
       >
         {/* Outer circle */}
         <circle
           cx="50"
           cy="50"
           r="46"
           fill="none"
           stroke="url(#goldGradient)"
           strokeWidth="2"
         />
         
         {/* Inner sacred geometry - Dharma wheel spokes */}
         {[...Array(8)].map((_, i) => (
           <motion.line
             key={i}
             x1="50"
             y1="15"
             x2="50"
             y2="35"
             stroke="url(#goldGradient)"
             strokeWidth="1.5"
             strokeLinecap="round"
             transform={`rotate(${i * 45} 50 50)`}
             initial={{ opacity: 0.5 }}
             animate={{ opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
           />
         ))}
         
         {/* Neural network dots - AI element */}
         {[...Array(8)].map((_, i) => (
           <motion.circle
             key={`dot-${i}`}
             cx={50 + 32 * Math.cos((i * 45 * Math.PI) / 180)}
             cy={50 + 32 * Math.sin((i * 45 * Math.PI) / 180)}
             r="3"
             fill="url(#goldGradient)"
             initial={{ scale: 0.8 }}
             animate={{ scale: [0.8, 1.2, 0.8] }}
             transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
           />
         ))}
         
         {/* Inner circle */}
         <circle
           cx="50"
           cy="50"
           r="20"
           fill="none"
           stroke="url(#goldGradient)"
           strokeWidth="1.5"
         />
         
         {/* Center Dharma symbol */}
         <motion.circle
           cx="50"
           cy="50"
           r="8"
           fill="url(#goldGradient)"
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ duration: 4, repeat: Infinity }}
         />
         
         {/* Connecting neural lines */}
         {[...Array(8)].map((_, i) => (
           <motion.line
             key={`neural-${i}`}
             x1={50 + 20 * Math.cos((i * 45 * Math.PI) / 180)}
             y1={50 + 20 * Math.sin((i * 45 * Math.PI) / 180)}
             x2={50 + 32 * Math.cos((i * 45 * Math.PI) / 180)}
             y2={50 + 32 * Math.sin((i * 45 * Math.PI) / 180)}
             stroke="url(#goldGradient)"
             strokeWidth="1"
             strokeOpacity="0.6"
             strokeDasharray="2,2"
           />
         ))}
         
         <defs>
           <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="hsl(43, 85%, 55%)" />
             <stop offset="50%" stopColor="hsl(43, 90%, 70%)" />
             <stop offset="100%" stopColor="hsl(43, 85%, 55%)" />
           </linearGradient>
         </defs>
       </svg>
     </motion.div>
   );
 };
 
 export default DharmaLogo;