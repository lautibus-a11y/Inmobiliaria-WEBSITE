import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';

interface MostWantedProps {
  onSelectProperty: (property: Property) => void;
}

export default function MostWanted({ onSelectProperty }: MostWantedProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  // Filter most coveted properties (isMostWanted: true)
  const mostWantedList = properties.filter((p) => p.isMostWanted);

  useEffect(() => {
    const calculateRange = () => {
      if (!trackRef.current) return;
      const track = trackRef.current;
      const parent = track.parentElement;
      if (!parent) return;

      const trackWidth = track.scrollWidth;
      const parentWidth = parent.clientWidth;
      
      const parentStyle = window.getComputedStyle(parent);
      const paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(parentStyle.paddingRight) || 0;

      // Calculate the scroll range so the last item stops perfectly aligned with padding
      const range = trackWidth - parentWidth + paddingLeft + paddingRight;
      setScrollRange(range > 0 ? range : 0);
    };

    calculateRange();

    const resizeObserver = new ResizeObserver(() => {
      calculateRange();
    });

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }
    const parent = trackRef.current?.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    }

    window.addEventListener('resize', calculateRange);

    const images = trackRef.current?.querySelectorAll('img');
    images?.forEach((img) => {
      img.addEventListener('load', calculateRange);
    });

    const timer = setTimeout(calculateRange, 100);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateRange);
      images?.forEach((img) => {
        img.removeEventListener('load', calculateRange);
      });
      clearTimeout(timer);
    };
  }, [mostWantedList]);

  // Scroll progress targeting the lock wrapper
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Calculate horizontal gliding translation dynamically to reach the end across all devices smoothly
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const desktopProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll <= 0) return;
    setMobileScrollProgress(target.scrollLeft / maxScroll);
  };

  return (
    <div
      ref={sectionRef}
      id="mas-cotizadas"
      className={`relative bg-transparent ${isMobile ? 'h-auto pb-16' : 'h-[250vh]'}`}
    >
      {/* Sticky Top viewport container lock */}
      <div className={isMobile ? "relative h-auto py-8 flex flex-col justify-start" : "sticky top-0 h-screen overflow-hidden flex flex-col justify-center py-10"}>
        {/* Background neon soft blur (varying lilac pastel & aurora theme for premium coveted list) */}
        <div className="absolute top-[30%] right-[15%] w-[550px] h-[550px] rounded-full bg-emerald-300/[0.05] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-emerald-500/[0.08] blur-[130px] pointer-events-none" />

        {/* Title Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono tracking-[0.25em] text-emerald-400 font-medium uppercase">Las Más Codiciadas</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight">
              Propiedades <strong className="font-semibold text-emerald-400 font-sans">Exclusivas</strong>
            </h2>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5 font-mono text-[10px] text-gray-400 font-light">
            <span className="tracking-widest">DESLICE PARA EXPLORAR</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-50" 
                  style={{ width: isMobile ? `${mobileScrollProgress * 100}%` : desktopProgress }}
                />
              </div>
              <span className="text-emerald-400 font-medium font-bold">EXPLORANDO</span>
            </div>
          </div>
        </div>

        {/* Horizontal track carrying items */}
        <div 
          className={`relative overflow-visible ${isMobile ? 'overflow-x-auto pb-6 px-6 snap-x snap-mandatory scroll-smooth w-full no-scrollbar' : 'px-6 md:px-12'}`}
          onScroll={handleMobileScroll}
        >
          <motion.div
            ref={trackRef}
            style={{ x: isMobile ? 0 : x }}
            className="flex gap-6 w-max"
          >
            {mostWantedList.map((property) => (
              <div
                key={property.id}
                className="shrink-0 w-[85vw] sm:w-[58vw] lg:w-[41vw] h-[480px] rounded-3xl overflow-hidden glass-panel glass-blur-md smooth-shadow-lg motion-blur-hover relative group cursor-pointer border border-white/5 hover:border-white/15 transition-all snap-align-start"
                onClick={() => onSelectProperty(property)}
              >
                {/* Background image carrying fine parallax scale on hover */}
                <div className="absolute inset-0">
                  <img
                    src={property.image}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.75]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/15 via-transparent to-transparent z-10" />
                </div>

                {/* Over picture details glass panel */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="text-[10px] px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-emerald-400 uppercase font-mono tracking-wider font-semibold">
                    Exclusivo
                  </span>
                </div>

                {/* Price badge over image top right */}
                <div className="absolute top-6 right-6 z-20">
                  <span className="text-xs px-3.5 py-2 bg-neutral-950/85 backdrop-blur-md border border-white/10 font-mono text-white rounded-xl shadow-lg font-medium">
                    {property.price}
                  </span>
                </div>

                {/* Bottom floating details card inside. Fully styled glassmorphic box */}
                <div className="absolute bottom-6 left-6 right-6 z-20 p-6 rounded-2xl glass-panel glass-blur-md smooth-shadow-md text-white hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-xl md:text-2xl font-display font-medium tracking-tight group-hover:text-emerald-400 transition-colors">
                      {property.title}
                    </h3>
                    {/* Floating link indicator */}
                    <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  {/* Subtitle address */}
                  <p className="text-xs font-mono text-gray-300 tracking-wider mb-3 leading-normal">
                    📍 {property.location}
                  </p>

                  <p className="text-gray-400 text-xs font-sans font-light leading-relaxed mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  {/* Specifications row */}
                  <div className="border-t border-white/5 pt-4 flex gap-6 items-center text-xs font-mono">
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] block">Dormitorios</span>
                      <span className="text-white font-semibold">{property.beds}</span>
                    </div>
                    <div className="border-l border-white/5 pl-6">
                      <span className="text-gray-500 uppercase text-[9px] block">Baños</span>
                      <span className="text-white font-semibold">{property.baths}</span>
                    </div>
                    <div className="border-l border-white/5 pl-6">
                      <span className="text-gray-500 uppercase text-[9px] block">Superficie</span>
                      <span className="text-white font-semibold">{property.area}</span>
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
