import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  symbol: string;
  opacity: number;
}

const SYMBOLS = ['✦', '·', '◆', '✧', '⬡', '·', '✦', '◇'];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 6,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 10,
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    opacity: Math.random() * 0.3 + 0.1,
  }));
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 20, className = '' }: FloatingParticlesProps) {
  const particles = useRef<Particle[]>(generateParticles(count));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles.current.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            color: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#fbbf24' : '#a1a1aa',
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
