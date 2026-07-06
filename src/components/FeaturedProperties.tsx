import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, Bed, ShowerHead, Grid, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';
import { useOnScreen } from '../hooks/useOnScreen';

interface FeaturedPropertiesProps {
  onSelectProperty: (property: Property) => void;
}
export default function FeaturedProperties({ onSelectProperty }: FeaturedPropertiesProps) {
  // Initialize synchronously from window to avoid layout flash
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // CSS animation hooks (used on mobile only — compositor thread, zero JS cost)
  const [headerRef, headerVisible] = useOnScreen('0px 0px -30px 0px');
  const [cardsRef, cardsVisible] = useOnScreen('0px 0px -20px 0px');

  // Show 3 properties on mobile, 6 on desktop
  const displayList = isMobile ? properties.slice(0, 3) : properties.slice(0, 6);

  // ── Desktop animation variants (Framer Motion, powerful CPU available) ─────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  // ── Shared card inner content (no wrapper — used by both paths) ───────────
  const CardInner = ({ property }: { property: Property }) => (
    <>
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/15 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="text-[10px] px-3 py-1 bg-white/95 rounded-full border border-neutral-200 text-neutral-600 uppercase font-mono tracking-wider shadow-xs font-semibold">
            ✦ {property.category}
          </span>
        </div>
        {property.status && (
          <div className="absolute top-12 left-4">
            <span className={`text-[10px] px-3 py-1 rounded-full border uppercase font-mono tracking-wider shadow-xs font-semibold ${
              property.status === 'alquilada' ? 'bg-red-500/95 text-white border-red-600/50' : 'bg-white/95 text-neutral-900 border-neutral-200'
            }`}>
              {property.status}
            </span>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <span className="text-xs px-3 py-1.5 bg-white border border-neutral-200 text-neutral-900 rounded-lg font-mono font-semibold shadow-md">
            {property.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-transparent">
        <div>
          <div className="flex items-center gap-1 text-neutral-500 mb-2">
            <MapPin size={12} className="text-neutral-500" />
            <span className="text-[11px] font-mono tracking-wide uppercase">{property.location}</span>
          </div>
          <h3 className="text-xl font-display font-medium text-neutral-900 mb-2 leading-snug">
            {property.title}
          </h3>
          <p className="text-neutral-600 text-xs leading-relaxed line-clamp-2 font-light">
            {property.description}
          </p>
        </div>
        <div className="border-t border-neutral-100 pt-4 mt-4 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            {property.beds > 0 && (
              <div className="flex items-center gap-1">
                <Bed size={14} className="text-neutral-500" />
                <span className="text-[11px] font-mono text-neutral-500">{property.beds} Dorm</span>
              </div>
            )}
            {property.baths > 0 && (
              <div className="flex items-center gap-1">
                <ShowerHead size={14} className="text-neutral-500" />
                <span className="text-[11px] font-mono text-neutral-500">{property.baths} Baños</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Grid size={13} className="text-neutral-500" />
              <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">{property.area}</span>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </>
  );

  return (
    <section
      id="propiedades-destacadas"
      className={`py-24 px-6 md:px-12 border-y border-neutral-200/50 relative overflow-hidden ${!isMobile ? 'dynamic-light-lilac-gradient' : ''}`}
      style={{
        backgroundColor: isMobile ? '#ffffff' : undefined,
        backgroundImage: isMobile ? 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%)' : undefined
      }}
    >
      {/* Background lighting */}
      <div className="absolute right-[-10%] top-[10%] w-[500px] h-[500px] rounded-full bg-neutral-200/20 blur-[130px] pointer-events-none" />
      <div className="absolute left-[5%] bottom-[5%] w-[400px] h-[400px] rounded-full bg-neutral-200/15 blur-[120px] pointer-events-none" />

      {/* ── MOBILE HEADER: plain HTML + CSS animation ─────────────────────── */}
      {isMobile ? (
        <div
          ref={headerRef}
          className={`max-w-7xl mx-auto mb-12 flex flex-col gap-4 m-reveal${headerVisible ? ' in-view' : ''}`}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <span className="text-xs font-mono tracking-[0.3em] text-neutral-500 uppercase font-semibold">Colección Exclusiva</span>
            </div>
            <h2 className="text-3xl font-display font-light text-neutral-900 tracking-tight">
              Propiedades <strong className="font-semibold">Destacadas</strong>
            </h2>
          </div>
          <p className="text-sm text-neutral-600 font-sans leading-relaxed">
            Una cuidada selección de residencias que combinan un diseño excepcional y los más altos estándares de calidad.
          </p>
        </div>
      ) : (
        /* ── DESKTOP HEADER: Framer Motion ────────────────────────────────── */
        <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-2 mb-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <span className="text-xs font-mono tracking-[0.3em] text-neutral-500 uppercase font-semibold">Colección Exclusiva</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight"
            >
              Propiedades <strong className="font-semibold">Destacadas</strong>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-sm text-neutral-600 max-w-md font-sans leading-relaxed"
          >
            Una cuidada selección de residencias que combinan un diseño excepcional y los más altos estándares de calidad.
          </motion.p>
        </div>
      )}

      {/* ── MOBILE CARDS: plain divs + single CSS fade ─────────────────────── */}
      {isMobile ? (
        <div
          ref={cardsRef}
          className={`max-w-7xl mx-auto grid grid-cols-1 gap-6 m-reveal-cards${cardsVisible ? ' in-view' : ''}`}
        >
          {displayList.map((property) => (
            <div
              key={property.id}
              className="group rounded-3xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow flex flex-col justify-between h-[520px] cursor-pointer"
              onClick={() => onSelectProperty(property)}
            >
              <CardInner property={property} />
            </div>
          ))}
        </div>
      ) : (
        /* ── DESKTOP CARDS: Framer Motion stagger ─────────────────────────── */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayList.map((property) => (
            <motion.div
              key={property.id}
              variants={cardVariants}
              className="group rounded-3xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow flex flex-col justify-between h-[520px] cursor-pointer hover:border-neutral-400/40 hover:-translate-y-1 transition-[border-color,transform] duration-300"
              onClick={() => onSelectProperty(property)}
            >
              <CardInner property={property} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
