import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Bed, ShowerHead, Grid, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';

interface AllPropertiesProps {
  onSelectProperty: (property: Property) => void;
}

type CategoryType = 'todas' | 'casas' | 'departamentos' | 'oficinas' | 'terrenos' | 'premium';

export default function AllProperties({ onSelectProperty }: AllPropertiesProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('todas');
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories: { label: string; value: CategoryType }[] = [
    { label: 'Todas', value: 'todas' },
    { label: 'Casas', value: 'casas' },
    { label: 'Departamentos', value: 'departamentos' },
    { label: 'Oficinas', value: 'oficinas' },
    { label: 'Terrenos', value: 'terrenos' },
    { label: 'Colección Premium', value: 'premium' },
  ];

  // Filtering based on standard selections
  const filteredList = properties.filter((p) => {
    if (activeCategory === 'todas') return true;
    return p.category === activeCategory;
  });

  // Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    if (priceSort === 'asc') return a.priceNumeric - b.priceNumeric;
    if (priceSort === 'desc') return b.priceNumeric - a.priceNumeric;
    return 0; // standard index order
  });

  return (
    <section
      id="todas-propiedades"
      className="py-24 px-6 md:px-12 dynamic-light-lilac-gradient border-y border-neutral-200/50 relative overflow-hidden"
    >
      {/* Background radial spotlight lights (varying jade & teal theme) */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-teal-500/[0.03] blur-[130px] pointer-events-none" />

      {/* Title block */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-emerald-700 font-semibold animate-pulse-slow">Catálogo Completo</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight mb-4"
        >
          Propiedades <strong className="font-semibold">Disponibles</strong>
        </motion.h2>
        <p className="text-neutral-600 text-sm max-w-lg mx-auto font-sans font-light">
          Filtre la búsqueda por tipo de propiedad y encuentre su próximo destino de inversión.
        </p>
      </div>

      {/* Tabs Menu Glass Navigation */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-200/60">
        
        {/* Horizontal scrollable glass bar on tabs */}
        <div className="flex overflow-x-auto w-full md:w-auto p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 backdrop-blur-md no-scrollbar">
          <div className="flex gap-1.5 w-max">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`text-xs px-5 py-2.5 rounded-xl font-medium tracking-wide transition-all uppercase cursor-pointer select-none relative ${
                    isActive
                      ? 'text-emerald-950 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-200/50'
                  }`}
                  id={`tab-${cat.value}`}
                >
                  {/* Under active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnder"
                      className="absolute inset-0 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter / Sort controller */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <SlidersHorizontal size={14} className="text-emerald-600" />
            <span>Ordenar por:</span>
          </div>
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="bg-white border border-neutral-200/80 text-xs rounded-xl py-2 px-3 text-neutral-800 focus:outline-none focus:border-emerald-500/50 [&_option]:bg-white [&_option]:text-neutral-800"
          >
            <option value="default">Relevancia</option>
            <option value="asc">Menor a Mayor Precio</option>
            <option value="desc">Mayor a Menor Precio</option>
          </select>
        </div>
      </div>

      {/* Catalog Render Panel */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          layout={!isMobile}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode={isMobile ? "wait" : "popLayout"}>
            {sortedList.map((property) => (
              <motion.div
                layout={!isMobile ? "position" : false}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                key={property.id}
                className="group rounded-2xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow flex flex-col justify-between h-[450px] cursor-pointer transition-all hover:border-emerald-500/30 hover:-translate-y-1"
                onClick={() => onSelectProperty(property)}
              >
                {/* Photo frame */}
                <div className="relative h-48 overflow-hidden bg-neutral-900">
                  <img
                    src={property.image}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105 filter brightness-[0.85] saturate-[0.95]"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-white/90 border border-neutral-200/80 px-2 py-1 rounded text-emerald-700 font-semibold shadow-xs">
                    {property.category}
                  </span>
                  {/* Price overlay */}
                  <span className="absolute bottom-3 right-3 text-xs font-mono px-2.5 py-1.5 bg-white border border-neutral-200/80 rounded text-neutral-900 font-semibold shadow-sm">
                    {property.price}
                  </span>
                </div>

                {/* Info and specs */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-transparent animate-sm transition-all">
                  <div>
                    <div className="flex items-center gap-1 text-neutral-500 text-[10px] mb-1 font-mono uppercase tracking-wide">
                      <MapPin size={10} className="text-emerald-600" />
                      <span>{property.location.split(',')[0]}</span>
                    </div>
                    <h3 className="text-base font-display font-semibold text-neutral-900 tracking-tight leading-snug group-hover:text-emerald-650 transition-colors mb-2">
                      {property.title}
                    </h3>
                    <p className="text-neutral-600 text-xs font-sans leading-relaxed line-clamp-2 font-light">
                      {property.description}
                    </p>
                  </div>

                  {/* Icon Specs Row */}
                  <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                    <div className="flex gap-3 items-center text-[10px] font-mono text-neutral-500">
                      {property.beds > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed size={12} className="text-emerald-600" />
                          <span>{property.beds} Dorm</span>
                        </div>
                      )}
                      {property.baths > 0 && (
                        <div className="flex items-center gap-1">
                          <ShowerHead size={12} className="text-emerald-600" />
                          <span>{property.baths} B</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Grid size={11} className="text-emerald-600" />
                        <span>{property.area}</span>
                      </div>
                    </div>

                    {/* Miniature arrow trigger */}
                    <span className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-950 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty fallback state */}
          {sortedList.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-500 font-sans">
              <p>No se encontraron propiedades disponibles en esta categoría.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
