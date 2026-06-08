import { useState } from 'react';
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
      className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden"
    >
      {/* Background radial spotlight lights (varying jade & teal theme) */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/[0.08] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-teal-500/[0.06] blur-[130px] pointer-events-none" />

      {/* Title block */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-emerald-400 font-medium">Catálogo Completo</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight mb-4">
          Propiedades <strong className="font-semibold">Disponibles</strong>
        </h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto font-sans font-light">
          Filtre la búsqueda por tipo de propiedad y encuentre su próximo destino de inversión.
        </p>
      </div>

      {/* Tabs Menu Glass Navigation */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
        
        {/* Horizontal scrollable glass bar on tabs */}
        <div className="flex overflow-x-auto w-full md:w-auto p-1.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md no-scrollbar">
          <div className="flex gap-1.5 w-max">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`text-xs px-5 py-2.5 rounded-xl font-medium tracking-wide transition-all uppercase cursor-pointer select-none relative ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  id={`tab-${cat.value}`}
                >
                  {/* Under active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnder"
                      className="absolute inset-0 bg-emerald-500/15 rounded-xl border border-emerald-500/30 shadow-lg"
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
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <SlidersHorizontal size={14} className="text-emerald-400" />
            <span>Ordenar por:</span>
          </div>
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="bg-white/5 border border-white/10 text-xs rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500/50 [&_option]:bg-[#0c0c0c] [&_option]:text-white"
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
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {sortedList.map((property) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                key={property.id}
                className="group rounded-2xl overflow-hidden glass-panel glass-blur-md smooth-shadow-lg motion-blur-hover glass-card-reflection flex flex-col justify-between h-[450px] cursor-pointer hover:border-white/15"
                onClick={() => onSelectProperty(property)}
              >
                {/* Photo frame */}
                <div className="relative h-48 overflow-hidden bg-neutral-900">
                  <img
                    src={property.image}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105 filter brightness-[0.75]"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-black/60 border border-white/10 px-2 py-1 rounded text-emerald-450 font-medium shadow-xs font-mono">
                    {property.category}
                  </span>
                  {/* Price overlay */}
                  <span className="absolute bottom-3 right-3 text-xs font-mono px-2.5 py-1.5 bg-neutral-950/85 border border-white/10 rounded text-white font-medium shadow-sm">
                    {property.price}
                  </span>
                </div>

                {/* Info and specs */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-transparent animate-sm transition-all">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-1 font-mono uppercase tracking-wide">
                      <MapPin size={10} className="text-emerald-400" />
                      <span>{property.location.split(',')[0]}</span>
                    </div>
                    <h3 className="text-base font-display font-semibold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors mb-2">
                      {property.title}
                    </h3>
                    <p className="text-gray-400 text-xs font-sans leading-relaxed line-clamp-2 font-light">
                      {property.description}
                    </p>
                  </div>

                  {/* Icon Specs Row */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <div className="flex gap-3 items-center text-[10px] font-mono text-gray-400">
                      {property.beds > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed size={12} className="text-emerald-400" />
                          <span>{property.beds} Dorm</span>
                        </div>
                      )}
                      {property.baths > 0 && (
                        <div className="flex items-center gap-1">
                          <ShowerHead size={12} className="text-emerald-400" />
                          <span>{property.baths} B</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Grid size={11} className="text-emerald-400" />
                        <span>{property.area}</span>
                      </div>
                    </div>

                    {/* Miniature arrow trigger */}
                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300">
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty fallback state */}
          {sortedList.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 font-sans">
              <p>No se encontraron propiedades disponibles en esta categoría.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
