import { motion, AnimatePresence } from 'motion/react';
import { Flame, X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useStreak } from '../../lib/StreakContext';
import { useState, useEffect } from 'react';

export function StreakModal() {
  const { streak, history, isModalOpen, setIsModalOpen } = useStreak();
  const [timeLeft, setTimeLeft] = useState('');
  
  // Current month state (could add navigation later if desired)
  const today = new Date();
  const [currentDate] = useState(today); 
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  const monthName = currentDate.toLocaleString('default', { month: 'short' });

  // Countdown timer logic
  useEffect(() => {
    if (!isModalOpen) return;

    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isModalOpen]);

  const renderCalendarDays = () => {
    const blanks = Array.from({ length: firstDayOfMonth }).map((_, i) => (
      <div key={`blank-${i}`} className="w-10 h-10"></div>
    ));

    const days = Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isCheckedIn = history.includes(dateStr);
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

      return (
        <div key={`day-${day}`} className="w-10 h-10 flex items-center justify-center">
          {isCheckedIn ? (
            <motion.div
              initial={isToday ? { scale: 0 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <CheckCircle2 className="w-7 h-7 text-[#0088ff]" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <span className={`text-sm font-medium ${isToday ? 'text-dharma-flame' : 'text-dharma-ivory-dim/60'}`}>
              {day}
            </span>
          )}
        </div>
      );
    });

    return [...blanks, ...days];
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1e1e] w-full max-w-sm rounded-[32px] p-8 relative shadow-2xl border border-white/5 overflow-hidden"
          >
            {/* Header / Title */}
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-[28px] font-sans font-medium text-white/90 tracking-tight leading-none mb-2">
                  Day {streak}
                </h3>
                <div className="text-[#a1a1aa] text-sm flex items-center gap-1.5 font-medium">
                  {timeLeft} left
                </div>
              </div>
              
              <div className="relative pt-2">
                <div className="absolute -top-4 -right-2 transform rotate-12 bg-gradient-to-br from-red-600 to-red-900 rounded-xl border border-red-500/30 p-2 shadow-lg flex flex-col items-center justify-center w-14 h-16 opacity-80 pointer-events-none">
                  <span className="text-white/90 font-bold text-lg leading-none">{today.getDate()}</span>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{monthName}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white/80 transition-colors z-20 bg-black/20 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-6 px-1">
              <ChevronLeft className="w-5 h-5 text-white/30 cursor-pointer hover:text-white/70 transition-colors" />
              <ChevronRight className="w-5 h-5 text-white/30 cursor-pointer hover:text-white/70 transition-colors" />
            </div>

            {/* Calendar Grid */}
            <div className="relative z-10">
              <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-4 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-[#a1a1aa] text-xs font-semibold uppercase">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-y-4 gap-x-1 justify-items-center">
                {renderCalendarDays()}
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
