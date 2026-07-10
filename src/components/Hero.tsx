import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Sparkles, Home } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const videoSrc = "/videos-hero/Video-Hero-Nuevo.mp4";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const isParallaxDisabled = isMobile || shouldReduceMotion;

  const textYValue = isParallaxDisabled ? 0 : textY;
  const bgYValue = isParallaxDisabled ? 0 : bgY;
  const bgScaleValue = isParallaxDisabled ? 1 : bgScale;
  const opacityFadeValue = isParallaxDisabled ? 1 : opacityFade;


  // Split lines for majestic cinematic entry animation
  const subtitleLine = "Propiedades exclusivas en 20 de Junio y Zona Oeste";
  const titleLine1 = "Inversión segura";
  const titleLine2 = "con un valor atemporal.";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#030303]"
    >
      {/* 1. Fluid Aurora Gradient Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-white/[0.04] blur-[130px] animate-aurora mix-blend-multiply" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-white/[0.02] blur-[120px] animate-aurora mix-blend-multiply [animation-delay:4s]" />
      </div>


      {/* 3. Parallax Background Canvas with Local Video */}
      <motion.div
        style={{ 
          y: bgYValue, 
          willChange: isParallaxDisabled ? 'auto' : 'transform',
          transform: isParallaxDisabled ? 'none' : 'translateZ(0)'
        }}
        className={`absolute inset-0 w-full ${isParallaxDisabled ? 'h-full' : 'h-[128%]'} pointer-events-none bg-black`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/90 z-10 pointer-events-none" />
        
        <motion.div
          style={{ 
            scale: bgScaleValue, 
            willChange: isParallaxDisabled ? 'auto' : 'transform',
            transform: isParallaxDisabled ? 'none' : 'translateZ(0)'
          }}
          className="relative w-full h-full"
        >
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] saturate-[0.85] contrast-[0.95]"
          />
        </motion.div>
      </motion.div>

      {/* 5. Lightweight Animated Text Content */}
      <motion.div
        style={{ 
          y: textYValue, 
          opacity: opacityFadeValue,
          willChange: isParallaxDisabled ? 'auto' : 'transform, opacity',
          transform: isParallaxDisabled ? 'none' : 'translateZ(0)'
        }}
        className="absolute inset-0 z-20 flex flex-col justify-end text-left px-6 md:px-12 pb-24 md:pb-32 max-w-7xl mx-auto"
      >
        {/* Simple Label Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center justify-start gap-2 mb-6"
        >
          <Sparkles size={14} className="text-white/60" />
          <span className="text-xs md:text-sm font-mono text-white/60 font-semibold pl-2 inline-block tracking-[0.45em]">
            {subtitleLine}
          </span>
        </motion.div>

        {/* Lightweight Animated Title */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight text-white select-none whitespace-pre-line leading-tight">
          <div className="block pb-1">
            {titleLine1.split(' ').map((word, idx) => (
              <motion.span
                key={`tl1-${idx}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.15 + idx * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-300">
            {titleLine2.split(' ').map((word, idx) => (
              <motion.span
                key={`tl2-${idx}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.3 + idx * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-start gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <a
            href="#todas-propiedades"
            className="group flex items-center justify-center gap-3 w-full sm:w-[240px] h-[54px] rounded-xl border border-white bg-white text-neutral-950 font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 hover:border-neutral-200 transition-colors cursor-pointer shadow-lg interactive-hover"
          >
            <span>Ver Catálogo</span>
            <span className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Home size={16} strokeWidth={2.5} className="text-white" />
            </span>
          </a>
          <a
            href="#contacto"
            className="flex items-center justify-center w-full sm:w-[240px] h-[54px] rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold text-xs tracking-widest uppercase hover:bg-white hover:text-neutral-950 hover:border-white transition-colors cursor-pointer interactive-hover"
          >
            Agendar Reunión
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
