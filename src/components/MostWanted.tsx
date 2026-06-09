import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
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

  // Use useSpring to smooth out scroll coordinates and eliminate mobile/desktop stutter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001
  });

  // Calculate horizontal gliding translation dynamically to reach the end across all devices smoothly
  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);
  const progressPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      ref={sectionRef}
      id="mas-cotizadas"
      className={`relative w-full ${isMobile ? 'h-auto py-16' : 'h-[250vh]'} dynamic-light-lilac-gradient border-y border-neutral-200/50`}
    >
      {/* Sticky Top viewport container lock (disabled on mobile to avoid vertical empty space) */}
      <div className={isMobile ? 'relative w-full flex flex-col justify-center' : 'sticky top-0 h-[100dvh] overflow-hidden flex flex-col justify-center py-10 w-full'}>
        {/* Background neon soft blur (varying lilac pastel & aurora theme for premium coveted list) */}
        <div className="absolute top-[30%] right-[15%] w-[550px] h-[550px] rounded-full bg-emerald-300/[0.04] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-emerald-500/[0.05] blur-[130px] pointer-events-none" />

        {/* Title Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono tracking-[0.25em] text-emerald-700 font-semibold uppercase">Las Más Codiciadas</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight">
              Propiedades <strong className="font-semibold text-emerald-600 font-sans">Exclusivas</strong>
            </h2>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5 font-mono text-[10px] text-neutral-500 font-light">
            <span className="tracking-widest">{isMobile ? "DESLIZÁ PARA EXPLORAR" : "DESLICE PARA EXPLORAR"}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500" 
                  style={{ width: isMobile ? "100%" : progressPercent }}
                />
              </div>
              <span className="text-emerald-600 font-bold">{isMobile ? "COMPLETO" : "EXPLORANDO"}</span>
            </div>
          </div>
        </div>

        {/* Horizontal track carrying items - native horizontal swipe on mobile, animated on desktop */}
        <div className={isMobile ? "relative w-full overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 pb-4" : "relative px-6 md:px-12 w-full overflow-hidden"}>
          <motion.div
            ref={trackRef}
            style={isMobile ? undefined : { x, willChange: 'transform' }}
            className="flex gap-6 w-max"
          >
            {mostWantedList.map((property) => (
              <div
                key={property.id}
                className="shrink-0 w-[82vw] sm:w-[58vw] lg:w-[41vw] h-[480px] rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md border border-neutral-200/80 premium-card-shadow motion-blur-hover relative group cursor-pointer hover:border-emerald-500/20 transition-all snap-center"
                onClick={() => onSelectProperty(property)}
              >
                {/* Background image carrying fine parallax scale on hover */}
                <div className="absolute inset-0">
                  <img
                    src={property.image}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent z-10" />
                </div>

                {/* Over picture details glass panel */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="text-[10px] px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg border border-neutral-200/60 text-emerald-700 uppercase font-mono tracking-wider font-semibold">
                    Exclusivo
                  </span>
                </div>

                {/* Price badge over image top right */}
                <div className="absolute top-6 right-6 z-20">
                  <span className="text-xs px-3.5 py-2 bg-white/90 backdrop-blur-md border border-neutral-200/60 font-mono text-neutral-900 rounded-xl shadow-md font-medium">
                    {property.price}
                  </span>
                </div>

                {/* Bottom floating details card inside. Fully styled glassmorphic box */}
                <div className="absolute bottom-6 left-6 right-6 z-20 p-6 rounded-2xl bg-white/85 backdrop-blur-xl border border-neutral-200/85 premium-card-shadow text-neutral-900 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-xl md:text-2xl font-display font-medium tracking-tight group-hover:text-emerald-650 transition-colors">
                      {property.title}
                    </h3>
                    {/* Floating link indicator */}
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
