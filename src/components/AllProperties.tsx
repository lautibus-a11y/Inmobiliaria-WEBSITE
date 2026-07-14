import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MapPin, Bed, ShowerHead, Grid, SlidersHorizontal, ArrowUpRight, ArrowDown, ArrowUp, PawPrint } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';
import { useOnScreen } from '../hooks/useOnScreen';

interface AllPropertiesProps {
  onSelectProperty: (property: Property) => void;
}

type CategoryType = 'todas' | 'casas' | 'departamentos' | 'terrenos' | 'casas-quinta' | 'locales';
type TransactionType = 'todas' | 'venta' | 'alquiler';

export default function AllProperties({ onSelectProperty }: AllPropertiesProps) {
  const [activeTransaction, setActiveTransaction] = useState<TransactionType>('todas');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('todas');
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isExpanded, setIsExpanded] = useState(false);
  // Initialize synchronously to avoid layout flash
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const shouldReduceMotion = useReducedMotion();

  // CSS animation hooks for mobile (compositor thread)
  const [titleRef, titleVisible] = useOnScreen('0px 0px -30px 0px');
  const [gridRef, gridVisible] = useOnScreen('0px 0px -20px 0px');

  const lastCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset pagination when filters change — eslint rule suppressed intentionally
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setVisibleCount(8);
    setIsExpanded(false);
  }, [activeTransaction, activeCategory, priceSort]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const transactions: { label: string; value: TransactionType }[] = [
    { label: 'Todas', value: 'todas' },
    { label: 'Venta', value: 'venta' },
    { label: 'Alquiler', value: 'alquiler' },
  ];

  const categories: { label: string; value: CategoryType }[] = [
    { label: 'Todas', value: 'todas' },
    { label: 'Casas', value: 'casas' },
    { label: 'Departamentos', value: 'departamentos' },
    { label: 'Terrenos', value: 'terrenos' },
    { label: 'Casas Quinta', value: 'casas-quinta' },
    { label: 'Locales', value: 'locales' },
  ];

  // Filtering based on standard selections
  const filteredList = properties.filter((p) => {
    const matchesTransaction = activeTransaction === 'todas' || p.transactionType === activeTransaction;
    const matchesCategory = activeCategory === 'todas' || p.category === activeCategory;
    return matchesTransaction && matchesCategory;
  });

  // Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    if (priceSort === 'asc') return a.priceNumeric - b.priceNumeric;
    if (priceSort === 'desc') return b.priceNumeric - a.priceNumeric;
    return 0; // standard index order
  });

  const firstBatch = sortedList.slice(0, 8);
  const extraBatch = sortedList.slice(8, visibleCount);
  const hasMore = visibleCount < sortedList.length;
  const hasExtra = sortedList.length > 8;

  return (
    <section
      id="todas-propiedades"
      className={`py-24 px-6 md:px-12 border-y border-neutral-200/50 relative overflow-hidden ${!isMobile ? 'dynamic-light-lilac-gradient' : ''}`}
      style={{
        backgroundColor: isMobile ? '#ffffff' : undefined,
        backgroundImage: isMobile ? 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%)' : undefined
      }}
    >
      {/* Background radial spotlight lights (varying jade & teal theme) */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-neutral-200/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neutral-200/15 blur-[130px] pointer-events-none" />

      {/* Title block */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        {isMobile ? (
          /* Mobile: single CSS animation for title block */
          <div
            ref={titleRef}
            className={`m-reveal${titleVisible ? ' in-view' : ''}`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-500 font-semibold">Catálogo Completo</span>
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            </div>
            <h2 className="text-3xl font-display font-light text-neutral-900 tracking-tight mb-4">
              Propiedades <strong className="font-semibold">Disponibles</strong>
            </h2>
            <p className="text-neutral-600 text-sm max-w-lg mx-auto font-sans font-light">
              Filtre la búsqueda por tipo de propiedad y encuentre su próximo destino de inversión.
            </p>
          </div>
        ) : (
          /* Desktop: Framer Motion */
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-500 font-semibold">Catálogo Completo</span>
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight mb-4"
            >
              Propiedades <strong className="font-semibold">Disponibles</strong>
            </motion.h2>
            <p className="text-neutral-600 text-sm max-w-lg mx-auto font-sans font-light">
              Filtre la búsqueda por tipo de propiedad y encuentre su próximo destino de inversión.
            </p>
          </>
        )}
      </div>

      {/* Tabs Menu Glass Navigation */}
      <div id="catalog-tabs" className="max-w-7xl mx-auto mb-12 flex flex-col gap-6 pb-6 border-b border-neutral-200/60">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          {/* Main Transaction Types (Todas / Venta / Alquiler) */}
          <div className="flex w-full md:w-auto p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 backdrop-blur-md">
            <div className="flex gap-1.5 w-full md:w-max">
              {transactions.map((trans) => {
                const isActive = activeTransaction === trans.value;
                return (
                  <button
                    key={trans.value}
                    onClick={() => setActiveTransaction(trans.value)}
                    className={`flex-1 md:flex-none text-xs px-8 py-3 rounded-xl font-medium tracking-wide transition-all uppercase cursor-pointer select-none relative ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-200/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTransTabUnder"
                        className="absolute inset-0 bg-neutral-900 rounded-xl shadow-lg"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{trans.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter / Sort controller */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <SlidersHorizontal size={14} className="text-neutral-500" />
              <span>Ordenar por:</span>
            </div>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as 'default' | 'asc' | 'desc')}
              className="bg-white border border-neutral-200/80 text-xs rounded-xl py-2 px-3 text-neutral-800 focus:outline-none focus:border-neutral-400 [&_option]:bg-white [&_option]:text-neutral-800"
            >
              <option value="default">Relevancia</option>
              <option value="asc">Menor a Mayor Precio</option>
              <option value="desc">Mayor a Menor Precio</option>
            </select>
          </div>
        </div>

        {/* Secondary Category Types (Casas / Departamentos / etc) */}
        <div className="flex overflow-x-auto w-full p-1.5 rounded-2xl bg-neutral-100/50 border border-neutral-200/40 backdrop-blur-md no-scrollbar">
          <div className="flex gap-1.5 w-max">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`text-[11px] px-5 py-2.5 rounded-xl font-medium tracking-wide transition-all uppercase cursor-pointer select-none relative ${
                    isActive
                      ? 'text-neutral-900 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-200/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCatTabUnder"
                      className="absolute inset-0 bg-white rounded-xl border border-neutral-200 shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Catalog Render Panel */}
      <div className="max-w-7xl mx-auto">
        {isMobile ? (
          /* Mobile */
          <div
            ref={gridRef}
            className={`grid grid-cols-1 gap-5 m-reveal-cards${gridVisible ? ' in-view' : ''}`}
          >
            {firstBatch.map((property, idx) => (
              <div
                key={property.id}
                ref={idx === firstBatch.length - 1 ? lastCardRef : undefined}
                className="group rounded-2xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow flex flex-col justify-between h-[420px] cursor-pointer"
                onClick={() => onSelectProperty(property)}
              >
                <div className="relative h-44 overflow-hidden bg-neutral-900">
                  <img
                    src={property.image}
                    alt={`${property.title} - ${property.category === 'casas-quinta' ? 'Casa Quinta' : property.category} en ${property.location}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-white/90 border border-neutral-200/80 px-2 py-1 rounded text-neutral-600 font-semibold shadow-xs">
                    {property.category}
                  </span>
                  {property.status && (
                    <span className={`absolute top-3 right-3 text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded font-semibold shadow-xs ${
                      property.status === 'alquilada' ? 'bg-red-500/90 text-white border border-red-600/50' : property.status === 'reservada' ? 'bg-orange-500/90 text-white border border-orange-600/50' : 'bg-white/90 text-neutral-900 border border-neutral-200/80'
                    }`}>
                      {property.status}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 text-xs font-mono px-2.5 py-1.5 bg-white border border-neutral-200/80 rounded text-neutral-900 font-semibold shadow-sm">
                    {property.price}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between bg-transparent">
                  <div>
                    <div className="flex items-center gap-1 text-neutral-500 text-[10px] mb-1 font-mono uppercase tracking-wide">
                      <MapPin size={10} className="text-neutral-500" />
                      <span>{property.location.split(',')[0]}</span>
                    </div>
                    <h3 className="text-base font-display font-semibold text-neutral-900 tracking-tight leading-snug mb-2">
                      {property.title}
                    </h3>
                    <p className="text-neutral-600 text-xs font-sans leading-relaxed line-clamp-2 font-light">
                      {property.description}
                    </p>
                  </div>
                  <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                    <div className="flex gap-3 items-center text-[10px] font-mono text-neutral-500">
                      {property.beds > 0 && (
                        <div className="flex items-center gap-1"><Bed size={12} className="text-neutral-500" /><span>{property.beds} Dorm</span></div>
                      )}
                      {property.baths > 0 && (
                        <div className="flex items-center gap-1"><ShowerHead size={12} className="text-neutral-500" /><span>{property.baths} B</span></div>
                      )}
                      <div className="flex items-center gap-1"><Grid size={11} className="text-neutral-500" /><span>{property.area}</span></div>
                      {property.category !== 'locales' && (
                        <div className="flex items-center gap-1" title="Pet Friendly"><PawPrint size={12} className="text-neutral-500" /></div>
                      )}
                    </div>
                    <span className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500">
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Expandable extra mobile cards — mismo acordeón que desktop */}
            <motion.div
              initial={false}
              animate={isExpanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="flex flex-col gap-5 mt-5">
                {extraBatch.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                    animate={isExpanded ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                    transition={{ duration: 0.32, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="group rounded-2xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow flex flex-col justify-between h-[420px] cursor-pointer"
                    onClick={() => onSelectProperty(property)}
                  >
                    <div className="relative h-44 overflow-hidden bg-neutral-900">
                      <img
                        src={property.image}
                        alt={`${property.title} - ${property.category === 'casas-quinta' ? 'Casa Quinta' : property.category} en ${property.location}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-white/90 border border-neutral-200/80 px-2 py-1 rounded text-neutral-600 font-semibold shadow-xs">
                        {property.category}
                      </span>
                      {property.status && (
                        <span className={`absolute top-3 right-3 text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded font-semibold shadow-xs ${
                          property.status === 'alquilada' ? 'bg-red-500/90 text-white border border-red-600/50' : property.status === 'reservada' ? 'bg-orange-500/90 text-white border border-orange-600/50' : 'bg-white/90 text-neutral-900 border border-neutral-200/80'
                        }`}>
                          {property.status}
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 text-xs font-mono px-2.5 py-1.5 bg-white border border-neutral-200/80 rounded text-neutral-900 font-semibold shadow-sm">
                        {property.price}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between bg-transparent">
                      <div>
                        <div className="flex items-center gap-1 text-neutral-500 text-[10px] mb-1 font-mono uppercase tracking-wide">
                          <MapPin size={10} className="text-neutral-500" />
                          <span>{property.location.split(',')[0]}</span>
                        </div>
                        <h3 className="text-base font-display font-semibold text-neutral-900 tracking-tight leading-snug mb-2">
                          {property.title}
                        </h3>
                        <p className="text-neutral-600 text-xs font-sans leading-relaxed line-clamp-2 font-light">
                          {property.description}
                        </p>
                      </div>
                      <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                        <div className="flex gap-3 items-center text-[10px] font-mono text-neutral-500">
                          {property.beds > 0 && (
                            <div className="flex items-center gap-1"><Bed size={12} className="text-neutral-500" /><span>{property.beds} Dorm</span></div>
                          )}
                          {property.baths > 0 && (
                            <div className="flex items-center gap-1"><ShowerHead size={12} className="text-neutral-500" /><span>{property.baths} B</span></div>
                          )}
                          <div className="flex items-center gap-1"><Grid size={11} className="text-neutral-500" /><span>{property.area}</span></div>
                          {property.category !== 'locales' && (
                            <div className="flex items-center gap-1" title="Pet Friendly"><PawPrint size={12} className="text-neutral-500" /></div>
                          )}
                        </div>
                        <span className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500">
                          <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {sortedList.length === 0 && (
              <div className="py-16 text-center text-neutral-500 font-sans">
                <p>No se encontraron propiedades disponibles en esta categoría.</p>
              </div>
            )}
          </div>
        ) : (
          /* Desktop: first 8 always visible + animated extra block */
          <div>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {firstBatch.map((property, idx) => (
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    key={property.id}
                    ref={idx === firstBatch.length - 1 ? lastCardRef : undefined}
                    className="group rounded-2xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow flex flex-col justify-between h-[450px] cursor-pointer transition-[box-shadow,border-color] duration-300 hover:border-neutral-300/60 hover:-translate-y-1 hover:transition-transform"
                    onClick={() => onSelectProperty(property)}
                  >
                    <div className="relative h-48 overflow-hidden bg-neutral-900">
                      <img
                        src={property.image}
                        alt={`${property.title} - ${property.category === 'casas-quinta' ? 'Casa Quinta' : property.category} en ${property.location}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-white/90 border border-neutral-200/80 px-2 py-1 rounded text-neutral-600 font-semibold shadow-xs">
                        {property.category}
                      </span>
                      {property.status && (
                        <span className={`absolute top-3 right-3 text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded font-semibold shadow-xs ${
                          property.status === 'alquilada' ? 'bg-red-500/90 text-white border border-red-600/50' : property.status === 'reservada' ? 'bg-orange-500/90 text-white border border-orange-600/50' : 'bg-white/90 text-neutral-900 border border-neutral-200/80'
                        }`}>
                          {property.status}
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 text-xs font-mono px-2.5 py-1.5 bg-white border border-neutral-200/80 rounded text-neutral-900 font-semibold shadow-sm">
                        {property.price}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between bg-transparent">
                      <div>
                        <div className="flex items-center gap-1 text-neutral-500 text-[10px] mb-1 font-mono uppercase tracking-wide">
                          <MapPin size={10} className="text-neutral-500" />
                          <span>{property.location.split(',')[0]}</span>
                        </div>
                        <h3 className="text-base font-display font-semibold text-neutral-900 tracking-tight leading-snug group-hover:text-neutral-600 transition-colors mb-2">
                          {property.title}
                        </h3>
                        <p className="text-neutral-600 text-xs font-sans leading-relaxed line-clamp-2 font-light">
                          {property.description}
                        </p>
                      </div>
                      <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                        <div className="flex gap-3 items-center text-[10px] font-mono text-neutral-500">
                          {property.beds > 0 && (
                            <div className="flex items-center gap-1"><Bed size={12} className="text-neutral-500" /><span>{property.beds} Dorm</span></div>
                          )}
                          {property.baths > 0 && (
                            <div className="flex items-center gap-1"><ShowerHead size={12} className="text-neutral-500" /><span>{property.baths} B</span></div>
                          )}
                          <div className="flex items-center gap-1"><Grid size={11} className="text-neutral-500" /><span>{property.area}</span></div>
                          {property.category !== 'locales' && (
                            <div className="flex items-center gap-1" title="Pet Friendly"><PawPrint size={12} className="text-neutral-500" /></div>
                          )}
                        </div>
                        <span className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-950 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Animated accordion extra block */}
            <motion.div
              initial={false}
              animate={isExpanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: 'hidden' }}
            >
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6"
              >
                <AnimatePresence mode="popLayout">
                  {extraBatch.map((property, i) => (
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                      transition={{ duration: 0.35, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                      key={property.id}
                      className="group rounded-2xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow flex flex-col justify-between h-[450px] cursor-pointer transition-[box-shadow,border-color] duration-300 hover:border-neutral-300/60 hover:-translate-y-1 hover:transition-transform"
                      onClick={() => onSelectProperty(property)}
                    >
                      <div className="relative h-48 overflow-hidden bg-neutral-900">
                        <img
                          src={property.image}
                          alt={`${property.title} - ${property.category === 'casas-quinta' ? 'Casa Quinta' : property.category} en ${property.location}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-white/90 border border-neutral-200/80 px-2 py-1 rounded text-neutral-600 font-semibold shadow-xs">
                          {property.category}
                        </span>
                        {property.status && (
                          <span className={`absolute top-3 right-3 text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded font-semibold shadow-xs ${
                            property.status === 'alquilada' ? 'bg-red-500/90 text-white border border-red-600/50' : property.status === 'reservada' ? 'bg-orange-500/90 text-white border border-orange-600/50' : 'bg-white/90 text-neutral-900 border border-neutral-200/80'
                          }`}>
                            {property.status}
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 text-xs font-mono px-2.5 py-1.5 bg-white border border-neutral-200/80 rounded text-neutral-900 font-semibold shadow-sm">
                          {property.price}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between bg-transparent">
                        <div>
                          <div className="flex items-center gap-1 text-neutral-500 text-[10px] mb-1 font-mono uppercase tracking-wide">
                            <MapPin size={10} className="text-neutral-500" />
                            <span>{property.location.split(',')[0]}</span>
                          </div>
                          <h3 className="text-base font-display font-semibold text-neutral-900 tracking-tight leading-snug group-hover:text-neutral-600 transition-colors mb-2">
                            {property.title}
                          </h3>
                          <p className="text-neutral-600 text-xs font-sans leading-relaxed line-clamp-2 font-light">
                            {property.description}
                          </p>
                        </div>
                        <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                          <div className="flex gap-3 items-center text-[10px] font-mono text-neutral-500">
                            {property.beds > 0 && (
                              <div className="flex items-center gap-1"><Bed size={12} className="text-neutral-500" /><span>{property.beds} Dorm</span></div>
                            )}
                            {property.baths > 0 && (
                              <div className="flex items-center gap-1"><ShowerHead size={12} className="text-neutral-500" /><span>{property.baths} B</span></div>
                            )}
                            <div className="flex items-center gap-1"><Grid size={11} className="text-neutral-500" /><span>{property.area}</span></div>
                            {property.category !== 'locales' && (
                              <div className="flex items-center gap-1" title="Pet Friendly"><PawPrint size={12} className="text-neutral-500" /></div>
                            )}
                          </div>
                          <span className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-950 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {sortedList.length === 0 && (
              <div className="col-span-full py-16 text-center text-neutral-500 font-sans">
                <p>No se encontraron propiedades disponibles en esta categoría.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* "Ver más / Ver menos" buttons */}
      {hasExtra && (
        <div className="flex justify-center mt-12">
          {!isExpanded || hasMore ? (
            <button
              onClick={() => {
                setVisibleCount((prev) => prev + 8);
                setIsExpanded(true);
              }}
              className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-white border border-neutral-200/80 text-neutral-900 font-medium text-sm transition-all hover:border-neutral-300 hover:shadow-sm"
            >
              Ver más
              <span className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center transition-transform group-hover:scale-105">
                <ArrowDown size={18} strokeWidth={3} className="text-white transition-transform group-hover:translate-y-0.5" />
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsExpanded(false);
                // After a short delay (accordion starts closing), scroll the last
                // visible card into view — works like a true accordion collapse.
                setTimeout(() => {
                  lastCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 80);
                // Delay pruning the DOM until the 500ms collapse animation finishes
                setTimeout(() => {
                  setVisibleCount(8);
                }, 520);
              }}
              className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-neutral-900 border border-neutral-900 text-white font-medium text-sm transition-all hover:bg-neutral-800 hover:shadow-sm"
            >
              Ver menos
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                <ArrowUp size={18} strokeWidth={3} className="text-neutral-900 transition-transform group-hover:-translate-y-0.5" />
              </span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
