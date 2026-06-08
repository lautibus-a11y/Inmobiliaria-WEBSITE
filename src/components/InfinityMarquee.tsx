import { Sparkles, Compass, Star, Anchor } from 'lucide-react';

export default function InfinityMarquee() {
  const luxuryKeywords = [
    { label: "MIAMI", icon: Sparkles },
    { label: "MONACO", icon: Anchor },
    { label: "IBIZA", icon: Compass },
    { label: "DUBAI", icon: Star },
    { label: "PARIS", icon: Sparkles },
    { label: "TOKYO", icon: Compass },
    { label: "NEW YORK", icon: Star },
    { label: "ASPEN", icon: Sparkles },
    { label: "CAP D'ANTIBES", icon: Anchor },
    { label: "ST. MORITZ", icon: Star },
    { label: "SINGAPORE", icon: Compass },
    { label: "LONDON", icon: Sparkles }
  ];

  // Double the list to make seamless scrolling
  const marqueeItems = [...luxuryKeywords, ...luxuryKeywords, ...luxuryKeywords];

  return (
    <div id="marquee-luxury" className="relative w-full overflow-hidden py-4 z-30 select-none bg-black/40 border-y border-white/5 glass-blur-lg">
      
      {/* Soft edge ambient light blockers */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Scrolling Inner Track */}
      <div className="flex w-max relative overflow-hidden animate-marquee-scroll">
        {marqueeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={`${item.label}-${index}`} 
              className="flex items-center gap-2.5 mx-8 sm:mx-12 font-mono text-[10px] sm:text-xs text-white/80 tracking-[0.2em] font-light hover:text-emerald-400 transition-colors duration-300"
            >
              <Icon size={12} className="text-emerald-400 animate-pulse" />
              <span className="font-semibold">{item.label}</span>
              <span className="text-white/20 select-none">•</span>
              <span className="text-white/40">RESIDENCIAS DE AUTOR</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
