import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WisdomCardDraw } from '../sections/WisdomCardDraw';

export function DailyCardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dharma-ink pt-24 font-sans relative">
      <div className="container mx-auto px-6 max-w-5xl pt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dharma-line-dark text-xs font-semibold text-dharma-ivory-dim hover:text-dharma-ivory hover:border-dharma-flame/40 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home Page
        </button>
      </div>

      <WisdomCardDraw />
    </div>
  );
}
