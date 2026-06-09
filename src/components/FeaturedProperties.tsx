import { motion } from 'motion/react';
import { MapPin, Bed, ShowerHead, Grid, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data';

interface FeaturedPropertiesProps {
  onSelectProperty: (property: Property) => void;
}

export default function FeaturedProperties({ onSelectProperty }: FeaturedPropertiesProps) {
  // Filter core featured list properties
  const featuredList = properties.filter((p) => p.isFeatured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay staggered reveals by 200ms
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 35, 
      scale: 0.97, 
      filter: 'blur(4px)' 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // Custom cinematic bezier curve for smooth entrance
      },
    },
  };

  return (
    <section
      id="propiedades-destacadas"
      className="py-24 px-6 md:px-12 dynamic-light-lilac-gradient border-y border-neutral-200/50 relative overflow-hidden"
    >
      {/* Dynamic background lighting spot (varying section theme) */}
      <div className="absolute right-[-10%] top-[10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute left-[5%] bottom-[5%] w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      {/* Header element */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono tracking-[0.3em] text-emerald-700 uppercase font-semibold">Colección Exclusiva</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight"
          >
            Propiedades <strong className="font-semibold">Destacadas</strong>
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-neutral-600 max-w-md font-sans leading-relaxed"
        >
          Una cuidada selección de residencias que combinan un diseño excepcional y los más altos estándares de calidad.
        </motion.p>
      </div>

      {/* Properties Grid with animated container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {featuredList.map((property) => (
          <motion.div
            key={property.id}
            variants={cardVariants}
            style={{ willChange: 'opacity, transform, filter' }}
            className="group rounded-3xl overflow-hidden bg-white/80 border border-neutral-200/60 premium-card-shadow motion-blur-hover glass-card-reflection flex flex-col justify-between h-[520px] cursor-pointer transition-all hover:border-emerald-500/20"
            onClick={() => onSelectProperty(property)}
          >
            {/* Top Image Section with Internal Parallax Effect */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-[0.85] saturate-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/15 to-transparent" />
              
              {/* Featured Pill */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-neutral-200 text-emerald-700 uppercase font-mono tracking-wider shadow-xs font-semibold">
                  ✦ {property.category}
                </span>
              </div>

              {/* Price overlaid glass */}
              <div className="absolute bottom-4 right-4">
                <span className="text-xs px-3 py-1.5 bg-white border border-neutral-200 text-neutral-900 rounded-lg font-mono font-semibold shadow-md">
                  {property.price}
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-transparent">
              <div>
                <div className="flex items-center gap-1 text-neutral-500 mb-2">
                  <MapPin size={12} className="text-emerald-600" />
                  <span className="text-[11px] font-mono tracking-wide uppercase">{property.location}</span>
                </div>
                
                <h3 className="text-xl font-display font-medium text-neutral-900 mb-2 leading-snug group-hover:text-emerald-650 transition-colors">
                  {property.title}
                </h3>
                
                <p className="text-neutral-600 text-xs leading-relaxed line-clamp-2 font-light">
                  {property.description}
                </p>
              </div>

              {/* Specs & Interactive Trigger Row */}
              <div className="border-t border-neutral-100 pt-4 mt-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  {property.beds > 0 && (
                    <div className="flex items-center gap-1">
                      <Bed size={14} className="text-emerald-600" />
                      <span className="text-[11px] font-mono text-neutral-500">{property.beds} Dorm</span>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div className="flex items-center gap-1">
                      <ShowerHead size={14} className="text-emerald-600" />
                      <span className="text-[11px] font-mono text-neutral-500">{property.baths} Baños</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Grid size={13} className="text-emerald-600" />
                    <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">{property.area}</span>
                  </div>
                </div>

                {/* Micro interactive button */}
                <span className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-950 group-hover:text-white group-hover:scale-105 transition-all duration-300">
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
