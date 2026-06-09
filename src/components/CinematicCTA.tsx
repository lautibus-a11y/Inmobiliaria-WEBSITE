import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function CinematicCTA() {
  return (
    <section className="relative w-full h-[65vh] sm:h-[80vh] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none filter brightness-[0.75] contrast-[0.95]"
      >
        <source src="/video-ctl/video-ctl.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay blending with adjacent sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/60 via-black/75 to-[#030303] z-10" />

      {/* Centered Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6 py-12 flex flex-col items-center justify-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <Sparkles size={11} className="text-emerald-300 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase font-semibold">
            Atención Privada
          </span>
        </motion.div>

        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-3xl sm:text-5xl md:text-6xl font-display font-light text-white tracking-tight leading-tight mb-6 max-w-3xl"
        >
          Tu próxima inversión <strong className="font-semibold text-emerald-300 font-sans">de colección</strong>
        </motion.h2>

        {/* Animated Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto font-sans font-light leading-relaxed mb-10"
        >
          Asesoramiento discreto y acceso exclusivo a las propiedades más cotizadas del mercado.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <a
            href="#contacto"
            className="w-full sm:w-auto text-center px-8 py-4 bg-white text-neutral-950 font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer interactive-hover"
          >
            Agendar Asesoría
          </a>
          <a
            href="#todas-propiedades"
            className="w-full sm:w-auto text-center px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-md text-white font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-white hover:text-neutral-950 transition-all cursor-pointer interactive-hover"
          >
            Ver Propiedades
          </a>
        </motion.div>
      </div>
    </section>
  );
}
