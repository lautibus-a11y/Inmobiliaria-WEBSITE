import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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


      {/* 3. Parallax Background Canvas with Local Video */}
      <motion.div
        style={{ 
          y: bgYValue, 
          willChange: isParallaxDisabled ? 'auto' : 'transform',
          transform: isParallaxDisabled ? 'none' : 'translateZ(0)'
        }}
        className={`absolute inset-0 w-full ${isParallaxDisabled ? 'h-full' : 'h-[128%]'} pointer-events-none`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/85 z-10" />
        <motion.video
          style={{ 
            scale: bgScaleValue, 
            willChange: isParallaxDisabled ? 'auto' : 'transform',
            transform: isParallaxDisabled ? 'none' : 'translateZ(0)'
          }}
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

      {/* 5. Lightweight Animated Text Content */}
      <motion.div
        style={{ 
          y: textYValue, 
          opacity: opacityFadeValue,
          willChange: isParallaxDisabled ? 'auto' : 'transform, opacity',
          transform: isParallaxDisabled ? 'none' : 'translateZ(0)'
        }}
        className="relative z-20 text-center px-6 max-w-4xl"
      >
        {/* Simple Label Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles size={14} className="text-emerald-300" />
          <span className="text-xs md:text-sm font-mono text-emerald-300 font-semibold pl-2 inline-block tracking-[0.45em]">
            {subtitleLine}
          </span>
        </motion.div>

        {/* Lightweight Animated Title */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tight text-white select-none whitespace-pre-line leading-tight">
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
          <div className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-emerald-300">
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
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0"
        >
          <a
            href="#propiedades-destacadas"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl border border-emerald-500 bg-emerald-500 text-white font-semibold text-xs tracking-widest uppercase hover:bg-emerald-600 hover:border-emerald-600 transition-colors cursor-pointer shadow-lg interactive-hover"
          >
            Ver Catálogo
          </a>
          <a
            href="#contacto"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold text-xs tracking-widest uppercase hover:bg-white hover:text-neutral-950 hover:border-white transition-colors cursor-pointer interactive-hover"
          >
            Agendar Reunión
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
