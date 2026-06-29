import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function CinematicCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[65vh] sm:h-[80vh] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src="/video-ctl/video-ctl.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay blending with adjacent sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/60 via-black/75 to-[#030303] z-10" />

      {/* Centered Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6 py-12 flex flex-col items-center justify-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <Sparkles size={11} className="text-white/70 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase font-semibold">
            Atención Privada
          </span>
        </motion.div>

        {/* Animated Heading - no blur filter animation (expensive on mobile) */}
        <motion.h2
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-3xl sm:text-5xl md:text-6xl font-display font-light text-white tracking-tight leading-tight mb-6 max-w-3xl"
        >
          Tu próxima inversión <strong className="font-semibold text-white font-sans">de colección</strong>
        </motion.h2>

        {/* Animated Description */}
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.32, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto font-sans font-light leading-relaxed mb-10"
        >
          Asesoramiento discreto y acceso exclusivo a las propiedades más cotizadas del mercado.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.3, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <a
            href="#contacto"
            className="w-full sm:w-auto text-center px-8 py-4 bg-white text-neutral-950 font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-lg hover:shadow-black/20 cursor-pointer interactive-hover"
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
