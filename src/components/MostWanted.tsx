import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';

interface MostWantedProps {
  onSelectProperty: (property: Property) => void;
}

export default function MostWanted({ onSelectProperty }: MostWantedProps) {
  // Filter most coveted properties (isMostWanted: true)
  const mostWantedList = properties.filter((p) => p.isMostWanted);

  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Track scroll exactly while the target is sticky (from start to end of container)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const [xTranslation, setXTranslation] = useState(0);

  useEffect(() => {
    const calculateScroll = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Calculate the translate value. We leave some padding at the end (e.g. 96px)
        const translateVal = trackWidth - viewportWidth + 96;
        setXTranslation(translateVal > 0 ? -translateVal : 0);
      }
    };

    // Run after a short delay to ensure browser layout and images are loaded
    const timer = setTimeout(calculateScroll, 100);
    window.addEventListener('resize', calculateScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateScroll);
    };
  }, [mostWantedList.length]);

  const xTransform = useTransform(scrollYProgress, [0, 1], [0, xTranslation]);
  
  // Smooth out horizontal translation with a premium spring animation
  const x = useSpring(xTransform, { stiffness: 85, damping: 24, mass: 0.6 });

  return (
    <div
      ref={targetRef}
      id="mas-cotizadas"
      className="relative h-[250vh] dynamic-light-lilac-gradient border-y border-neutral-200/50"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Background neon soft blurs */}
        <div className="absolute top-[30%] right-[15%] w-[550px] h-[550px] rounded-full bg-emerald-300/[0.04] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-emerald-500/[0.05] blur-[130px] pointer-events-none" />

        {/* Title Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 w-full flex items-end justify-between gap-6 z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono tracking-[0.25em] text-emerald-700 font-semibold uppercase">Las Más Codiciadas</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight">
              Propiedades <strong className="font-semibold text-emerald-600 font-sans">Exclusivas</strong>
            </h2>
          </div>

          <div className="flex flex-col items-end gap-1.5 font-mono text-[10px] text-neutral-500 font-light">
            <span className="tracking-widest uppercase">Desliza hacia abajo para explorar</span>
          </div>
        </div>

        {/* Horizontal track carrying items */}
        <div className="relative w-full overflow-hidden px-6 md:px-12 pb-8 pt-4">
          <motion.div
            ref={trackRef}
            style={{ x, willChange: 'transform' }}
            className="flex gap-6 w-max"
          >
            {mostWantedList.map((property) => (
              <div
                key={property.id}
                className="shrink-0 w-[75vw] md:w-[45vw] lg:w-[41vw] max-w-[600px] h-[480px] rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md border border-neutral-200/80 premium-card-shadow relative group cursor-pointer hover:border-emerald-500/30 transition-all hover:-translate-y-1"
                onClick={() => onSelectProperty(property)}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={property.image}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent z-10" />
                </div>

                {/* Over picture details glass panel */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="text-[10px] px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg border border-neutral-200/60 text-emerald-700 uppercase font-mono tracking-wider font-semibold shadow-sm">
                    Exclusivo
                  </span>
                </div>

                {/* Price badge over image top right */}
                <div className="absolute top-6 right-6 z-20">
                  <span className="text-xs px-3.5 py-2 bg-white/95 backdrop-blur-md border border-neutral-200/60 font-mono text-neutral-900 rounded-xl shadow-md font-medium">
                    {property.price}
                  </span>
                </div>

                {/* Bottom floating details card */}
                <div className="absolute bottom-6 left-6 right-6 z-20 p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200/85 premium-card-shadow text-neutral-900 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-xl md:text-2xl font-display font-medium tracking-tight group-hover:text-emerald-650 transition-colors">
                      {property.title}
                    </h3>
                    <span className="w-8 h-8 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-950 group-hover:text-white transition-all">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  {/* Subtitle address */}
                  <p className="text-xs font-mono text-neutral-500 tracking-wider mb-3 leading-normal">
                    📍 {property.location}
                  </p>

                  <p className="text-neutral-600 text-xs font-sans font-light leading-relaxed mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  {/* Specifications row */}
                  <div className="border-t border-neutral-100 pt-4 flex gap-6 items-center text-xs font-mono">
                    <div>
                      <span className="text-neutral-400 uppercase text-[9px] block">Dormitorios</span>
                      <span className="text-neutral-800 font-semibold">{property.beds}</span>
                    </div>
                    <div className="border-l border-neutral-100 pl-6">
                      <span className="text-neutral-400 uppercase text-[9px] block">Baños</span>
                      <span className="text-neutral-800 font-semibold">{property.baths}</span>
                    </div>
                    <div className="border-l border-neutral-100 pl-6">
                      <span className="text-neutral-400 uppercase text-[9px] block">Superficie</span>
                      <span className="text-neutral-800 font-semibold">{property.area}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
