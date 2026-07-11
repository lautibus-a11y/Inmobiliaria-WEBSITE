import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, PawPrint } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';

interface MostWantedProps {
  onSelectProperty: (property: Property) => void;
}

export default function MostWanted({ onSelectProperty }: MostWantedProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const mostWantedList = properties.filter((p) => p.isMostWanted);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Calculate scroll progress percentage (0 to 100)
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);

    // Update navigation button states
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Run an initial check to set arrow states
    handleScroll();

    // Check again on window resize
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { clientWidth } = container;
    // Scroll by ~75% of container width for a smooth step
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section
      id="mas-cotizadas"
      className="py-24 px-6 md:px-12 border-y border-neutral-200/50 relative overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%)'
      }}
    >
      {/* Background radial spotlight lights */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-neutral-200/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neutral-200/15 blur-[120px] pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono tracking-[0.25em] text-neutral-500 font-semibold uppercase">Las Más Codiciadas</span>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight">
            Propiedades <strong className="font-semibold text-neutral-900 font-sans">Exclusivas</strong>
          </h2>
          <p className="text-[10px] font-mono text-neutral-450 tracking-widest uppercase mt-3">
            Deslizá para explorar la colección
          </p>
        </div>

        {/* Desktop Controls (Arrow buttons, hidden on small screens) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-350 cursor-pointer ${
              canScrollLeft
                ? 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300'
                : 'border-neutral-100 bg-neutral-50/50 text-neutral-300 cursor-not-allowed'
            }`}
            aria-label="Anterior"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-350 cursor-pointer ${
              canScrollRight
                ? 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300'
                : 'border-neutral-100 bg-neutral-50/50 text-neutral-300 cursor-not-allowed'
            }`}
            aria-label="Siguiente"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div className="relative max-w-7xl mx-auto z-10">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto flex gap-6 snap-x snap-mandatory no-scrollbar pb-8 pt-4 scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {mostWantedList.map((property) => (
            <div
              key={property.id}
              className="shrink-0 w-[82vw] sm:w-[50vw] md:w-[42vw] lg:w-[31vw] xl:w-[23vw] max-w-[420px] h-[460px] md:h-[480px] rounded-3xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow relative cursor-pointer snap-center sm:snap-start group hover:border-neutral-300/60 transition-all duration-300"
              onClick={() => onSelectProperty(property)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={property.image}
          alt={`${property.title} - ${property.category === 'casas-quinta' ? 'Casa Quinta' : property.category} en ${property.location}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/45 via-transparent to-transparent z-10" />
              </div>

              {/* Exclusivo Badge */}
              <div className="absolute top-5 left-5 z-20">
                <span className="text-[10px] px-3 py-1.5 bg-white/95 rounded-lg border border-neutral-200/60 text-neutral-600 uppercase font-mono tracking-wider font-semibold shadow-xs">
                  Exclusivo
                </span>
              </div>

              {/* Price Tag */}
              <div className="absolute top-5 right-5 z-20">
                <span className="text-xs px-3.5 py-1.5 bg-white/95 border border-neutral-200/60 font-mono text-neutral-900 rounded-xl shadow-md font-medium">
                  {property.price}
                </span>
              </div>

              {/* Bottom Info Panel */}
              <div className="absolute bottom-5 left-5 right-5 z-20 p-5 rounded-2xl bg-white border border-neutral-200/80 premium-card-shadow text-neutral-900 hover:bg-neutral-50/98 transition-colors duration-300">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="text-lg font-display font-medium tracking-tight leading-tight group-hover:text-neutral-600 transition-colors">
                    {property.title}
                  </h3>
                  <span className="shrink-0 w-8 h-8 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-950 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500 tracking-wider mb-2">
                  📍 {property.location}
                </p>
                <div className="border-t border-neutral-100 pt-3 flex gap-5 items-center text-xs font-mono">
                  <div>
                    <span className="text-neutral-400 uppercase text-[9px] block">Dorm.</span>
                    <span className="text-neutral-800 font-semibold">{property.beds}</span>
                  </div>
                  <div className="border-l border-neutral-100 pl-5">
                    <span className="text-neutral-400 uppercase text-[9px] block">Baños</span>
                    <span className="text-neutral-800 font-semibold">{property.baths}</span>
                  </div>
                  <div className="border-l border-neutral-100 pl-5">
                    <span className="text-neutral-400 uppercase text-[9px] block">Sup.</span>
                    <span className="text-neutral-800 font-semibold">{property.area}</span>
                  </div>
                  {property.category !== 'locales' && (
                    <div className="border-l border-neutral-100 pl-5 flex items-center justify-center h-full" title="Pet Friendly">
                      <PawPrint size={16} className="text-neutral-800" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Scroll Progress Bar Indicator */}
      <div className="max-w-xs mx-auto mt-6 flex justify-center items-center z-10 relative">
        <div className="w-full h-[3px] bg-neutral-200/50 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-neutral-600 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
