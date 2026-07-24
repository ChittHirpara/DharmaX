import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface StreakContextType {
  streak: number;
  history: string[];
  hasCheckedInToday: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  checkIn: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('dharma_streak_data');
    if (savedData) {
      try {
        const { currentStreak, lastCheckIn, history: savedHistory } = JSON.parse(savedData);
        
        const lastDate = new Date(lastCheckIn);
        const today = new Date();
        
        // Reset time part for accurate date difference calculation
        lastDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        const loadedHistory = savedHistory || [];
        setHistory(loadedHistory);

        if (diffDays === 0) {
          // Already checked in today
          setStreak(currentStreak);
          setHasCheckedInToday(true);
        } else if (diffDays === 1) {
          // Checked in yesterday, streak continues
          setStreak(currentStreak);
          setHasCheckedInToday(false);
        } else {
          // Missed a day or more, reset streak
          setStreak(0);
          setHasCheckedInToday(false);
        }
      } catch (e) {
        console.error("Failed to parse streak data", e);
      }
    }
  }, []);

  const checkIn = () => {
    if (hasCheckedInToday) {
      setIsModalOpen(true);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newHistory = [...history, todayStr];
    const newStreak = streak + 1;
    
    setStreak(newStreak);
    setHistory(newHistory);
    setHasCheckedInToday(true);
    setIsModalOpen(true);

    localStorage.setItem('dharma_streak_data', JSON.stringify({
      currentStreak: newStreak,
      lastCheckIn: new Date().toISOString(),
      history: newHistory
    }));
  };

  return (
    <StreakContext.Provider value={{ streak, history, hasCheckedInToday, isModalOpen, setIsModalOpen, checkIn }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
}
