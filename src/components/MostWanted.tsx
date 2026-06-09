import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';

interface MostWantedProps {
  onSelectProperty: (property: Property) => void;
}

export default function MostWanted({ onSelectProperty }: MostWantedProps) {
  // Filter most coveted properties (isMostWanted: true)
  const mostWantedList = properties.filter((p) => p.isMostWanted);

  return (
    <div
      id="mas-cotizadas"
      className="relative w-full py-16 lg:py-24 dynamic-light-lilac-gradient border-y border-neutral-200/50"
    >
      <div className="relative w-full flex flex-col justify-center">
        {/* Background neon soft blur */}
        <div className="absolute top-[30%] right-[15%] w-[550px] h-[550px] rounded-full bg-emerald-300/[0.04] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-emerald-500/[0.05] blur-[130px] pointer-events-none" />

        {/* Title Header with lightweight left-to-right animation */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 z-10 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono tracking-[0.25em] text-emerald-700 font-semibold uppercase">Las Más Codiciadas</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight">
              Propiedades <strong className="font-semibold text-emerald-600 font-sans">Exclusivas</strong>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col items-start sm:items-end gap-1.5 font-mono text-[10px] text-neutral-500 font-light"
          >
            <span className="tracking-widest uppercase">Desliza para explorar</span>
          </motion.div>
        </div>

        {/* Horizontal track carrying items - native horizontal swipe everywhere */}
        <div 
          className="relative w-full overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 md:px-12 pb-8 pt-4 flex gap-6"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          {mostWantedList.map((property) => (
            <div
              key={property.id}
              className="shrink-0 w-[85vw] sm:w-[58vw] lg:w-[41vw] max-w-[600px] h-[480px] rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md border border-neutral-200/80 premium-card-shadow relative group cursor-pointer hover:border-emerald-500/30 transition-all snap-center hover:-translate-y-1"
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

              {/* Bottom floating details card inside. */}
              <div className="absolute bottom-6 left-6 right-6 z-20 p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200/85 premium-card-shadow text-neutral-900 hover:bg-white transition-colors">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl md:text-2xl font-display font-medium tracking-tight group-hover:text-emerald-600 transition-colors">
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
        </div>
      </div>
    </div>
  );
}
