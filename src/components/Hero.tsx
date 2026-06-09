import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax ratios triggered by standard document scrolls
  const { scrollY } = useScroll();
  
  // Smooth out scrollY to eliminate scroll lagging on all devices
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const textY = useTransform(smoothScrollY, [0, 800], [0, 80]); // Slightly reduced to keep content stable
  const bgY = useTransform(smoothScrollY, [0, 800], [0, -220]); // Deeper parallax for the background image
  const bgScale = useTransform(smoothScrollY, [0, 800], [1.02, 1.18]);
  const opacityFade = useTransform(smoothScrollY, [0, 450], [1, 0]);

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
  const subtitleLine = "PROPIEDADES EXCLUSIVAS";
  const titleLine1 = "Residencias únicas";
  const titleLine2 = "de valor atemporal.";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#030303]"
    >
      {/* 1. Fluid Aurora Gradient Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-emerald-500/10 blur-[130px] animate-aurora mix-blend-multiply" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-teal-500/5 blur-[120px] animate-aurora mix-blend-multiply [animation-delay:4s]" />
      </div>

      {/* 2. Intelligent Mouse Reactive Glow Spot */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] mix-blend-multiply z-10"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.8 }}
        />
      )}
      {/* 3. Cinematic Parallax Cinematic Background Canvas with Local Video */}
      <motion.div
        style={{ y: bgY, willChange: 'transform' }}
        className="absolute inset-0 w-full h-[128%] pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/85 z-10" />
        <motion.video
          style={{ scale: bgScale, willChange: 'transform' }}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover filter brightness-[0.75] saturate-[0.85] contrast-[0.95]"
        >
          <source src="/videos-hero/videohero1.mp4" type="video/mp4" />
          <source src="/videos-hero/videohero2.mp4" type="video/mp4" />
        </motion.video>
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
          <Sparkles size={14} className="text-emerald-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs md:text-sm font-mono text-emerald-300 font-semibold pl-2 inline-block">
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
          <span className="block overflow-hidden relative text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-emerald-300">
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

        {/* CTA scroll down indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0"
        >
          <a
            href="#propiedades-destacadas"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl border border-white bg-white text-neutral-950 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-400 hover:border-emerald-400 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 interactive-hover"
          >
            Ver Catálogo
          </a>
          <a
            href="#contacto"
            className="w-full sm:w-auto text-center px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold text-xs tracking-widest uppercase hover:bg-white hover:text-neutral-950 hover:border-white transition-all cursor-pointer interactive-hover"
          >
            Agendar Reunión
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
