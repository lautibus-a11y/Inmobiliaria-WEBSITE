import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax ratios triggered by standard document scrolls
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 800], [0, 160]);
  const bgY = useTransform(scrollY, [0, 800], [0, -120]);
  const bgScale = useTransform(scrollY, [0, 800], [1.05, 1.25]);
  const opacityFade = useTransform(scrollY, [0, 450], [1, 0]);

  // Handle subtle interactive mouse glowing position in the container viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized percentage coordinates or raw px coordinates
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => setIsHovered(false));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', () => setIsHovered(true));
        container.removeEventListener('mouseleave', () => setIsHovered(false));
      }
    };
  }, []);

  // Split lines for majestic cinematic entry animation
  const subtitleLine = "PROPIEDADES DE CATEGORÍA EXCLUSIVA";
  const titleLine1 = "El arte de vivir";
  const titleLine2 = "con distinción.";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-transparent"
    >
      {/* 1. Fluid Aurora Gradient Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-emerald-500/15 blur-[130px] animate-aurora mix-blend-screen" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-teal-500/10 blur-[120px] animate-aurora mix-blend-screen [animation-delay:4s]" />
      </div>

      {/* 2. Intelligent Mouse Reactive Glow Spot */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] mix-blend-screen z-10"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.8 }}
        />
      )}

      {/* 3. Cinematic Parallax Cinematic Background Canvas */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[120%] pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black z-10" />
        <motion.img
          style={{ scale: bgScale }}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Cinematic Real Estate Mansion"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.45] saturate-[0.85] contrast-[1.05]"
        />
      </motion.div>

      {/* 5. Majestic Cinematic Text Reveal Content */}
      <motion.div
        style={{ y: textY, opacity: opacityFade }}
        className="relative z-20 text-center px-6 max-w-4xl"
      >
        {/* Cinematic dynamic label */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.2em', y: 15 }}
          animate={{ opacity: 1, letterSpacing: '0.45em', y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles size={14} className="text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs md:text-sm font-mono text-emerald-400 font-medium pl-2 inline-block">
            {subtitleLine}
          </span>
        </motion.div>

        {/* Dynamic headings reveal */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tight text-white select-none whitespace-pre-line leading-tight">
          <span className="block overflow-hidden relative pb-1">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="inline-block"
            >
              {titleLine1}
            </motion.span>
          </span>
          <span className="block overflow-hidden relative text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-emerald-400/85">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="inline-block"
            >
              {titleLine2}
            </motion.span>
          </span>
        </h1>

        {/* Short introduction copy */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.7 }}
          className="mt-8 text-sm md:text-base text-gray-300 max-w-lg mx-auto font-sans leading-relaxed tracking-wide font-light"
        >
          Diseños icónicos, ubicaciones inigualables y propiedades con valor que trasciende generaciones. Descubrí residencias únicas.
        </motion.p>

        {/* CTA scroll down indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0"
        >
          <a
            href="#propiedades-destacadas"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl border border-white bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-emerald-400 hover:border-emerald-400 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/20 interactive-hover"
          >
            Ver Catálogo
          </a>
          <a
            href="#contacto"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white font-semibold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all cursor-pointer interactive-hover"
          >
            Agendar Reunión
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
