interface MarqueeBarProps {
  items: string[];
  speed?: number; // seconds for one full cycle
  className?: string;
  separator?: string;
}

export function MarqueeBar({
  items,
  speed = 25,
  className = '',
  separator = '✦',
}: MarqueeBarProps) {
  // Duplicate to create seamless loop
  const repeated = [...items, ...items];

  return (
    <div
      className={`overflow-hidden whitespace-nowrap select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="inline-flex gap-0"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6 text-sm font-medium tracking-[0.15em] uppercase">
            <span className="text-dharma-ivory-dim">{item}</span>
            <span className="text-dharma-flame opacity-60 text-xs">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}




