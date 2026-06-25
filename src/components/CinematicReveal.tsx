import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface CinematicRevealProps {
  onComplete: () => void;
}

export default function CinematicReveal({ onComplete }: CinematicRevealProps) {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  // Use ref to check mobile inside the rAF loop without causing re-renders
  const isMobileRef = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  useEffect(() => {
    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';

    // On mobile: shorter total duration to avoid user frustration
    const duration = isMobileRef ? 1600 : 2600;
    const exitDuration = isMobileRef ? 700 : 1100;
    const startDelay = isMobileRef ? 300 : 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing (power2.inOut approximation)
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setCount(Math.floor(easeProgress * 100));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsExiting(true);
        setTimeout(() => {
          document.body.style.overflow = '';
          onComplete();
        }, exitDuration);
      }
    };

    // Delay start slightly to allow initial stagger to appear
    const delayTimer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(delayTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete, isMobileRef]);

  // Format count to 2-digit format, e.g. "05" or "99"
  const formattedCount = count < 10 ? `0${count}` : `${count}`;

  return (
    <motion.div
      initial={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      animate={isExiting ? { 
        opacity: 0, 
        // blur(35px) on mobile is extremely expensive — skip it entirely
        filter: (shouldReduceMotion || isMobileRef) ? 'none' : 'blur(35px)', 
        scale: shouldReduceMotion ? 1 : (isMobileRef ? 1.02 : 1.05)
      } : {}}
      transition={{ duration: isMobileRef ? 0.7 : 1.1, ease: [0.32, 0, 0.67, 0] }}
      className="fixed top-0 left-0 w-full h-full bg-[#030303] z-50 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Soft ambient lila light under the logo to keep theme premium */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] max-w-[600px] max-h-[600px] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      {/* Main Container - Responsive layout */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center max-w-2xl mx-auto">
        
        {/* Large Logo Image */}
        <motion.div 
          initial={{ scale: shouldReduceMotion ? 1 : 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          className="w-[72vw] sm:w-[60vw] md:w-[50vw] max-w-[380px] lg:max-w-[440px] h-auto mx-auto overflow-hidden"
        >
          <img 
            src="/logo.png" 
            alt="Aurelia Propiedades Logo" 
            className="w-full h-auto object-contain mx-auto"
          />
        </motion.div>

        {/* Branding Title */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
          className="text-white text-lg sm:text-2xl font-display font-light tracking-[0.2em] mt-6 sm:mt-8 mb-10 sm:mb-12 text-center mx-auto select-none"
        >
          Aurelia <strong className="font-semibold text-purple-300">Propiedades</strong>
        </motion.div>

        {/* Slider & Progress bar container */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.7 }}
          className="w-full max-w-[280px] sm:max-w-[340px] space-y-4 mx-auto"
        >
          {/* Progress bar line */}
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500 rounded-full"
              style={{ width: `${count}%`, transition: 'width 0.1s linear' }}
            />
          </div>

          {/* Details & Percent counter */}
          <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-gray-500 tracking-wider">
            <span>CARGANDO SISTEMA</span>
            <span className="text-purple-300 font-bold">{formattedCount}%</span>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding credits - Responsive position and size */}
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.9 }}
        className="absolute bottom-6 sm:bottom-8 text-center px-4 z-10 flex flex-col items-center gap-1"
      >
        <span className="font-mono text-[11px] sm:text-sm tracking-[0.18em] text-violet-400 uppercase">
          Desarrollado por
        </span>
        <span className="font-display font-bold text-base sm:text-lg tracking-[0.25em] text-violet-300 uppercase drop-shadow-[0_0_10px_rgba(167,139,250,0.7)]">
          Broadcastweb
        </span>
        <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-violet-500/70 mt-0.5">
          Todos los derechos reservados
        </span>
      </motion.div>
    </motion.div>
  );
}
