import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface CinematicRevealProps {
  onComplete: () => void;
}

export default function CinematicReveal({ onComplete }: CinematicRevealProps) {
  const [isExiting, setIsExiting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  // Use ref to check mobile inside the effect without causing re-renders
  const isMobileRef = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  useEffect(() => {
    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';

    // On mobile: shorter total duration
    const duration = isMobileRef ? 2000 : 3000;
    const exitDuration = isMobileRef ? 700 : 1100;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        document.body.style.overflow = '';
        onComplete();
      }, exitDuration);
    }, duration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete, isMobileRef]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={isExiting ? { 
        opacity: 0, 
        scale: shouldReduceMotion ? 1 : (isMobileRef ? 1.02 : 1.05)
      } : {}}
      transition={{ duration: isMobileRef ? 0.7 : 1.1, ease: [0.32, 0, 0.67, 0] }}
      className="fixed top-0 left-0 w-full h-full bg-[#030303] z-50 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center max-w-2xl mx-auto h-full">
        
        {/* Large Logo Image + Brand Text — Ken Burns Effect (Zoom out & Pan side) */}
        <motion.div 
          initial={{ scale: shouldReduceMotion ? 1 : 1.25, x: shouldReduceMotion ? 0 : '4%', opacity: 0 }}
          animate={{ scale: 1, x: shouldReduceMotion ? 0 : '-2%', opacity: 1 }}
          transition={{ duration: isMobileRef ? 2.7 : 4.1, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center"
        >
          <img 
            src="/logocabecera.webp" 
            alt="Ivana Molina Propiedades Logo" 
            className="w-[70vw] sm:w-[50vw] md:w-[40vw] max-w-[340px] lg:max-w-[400px] h-auto object-contain mx-auto"
          />
          {/* Brand text */}
          <div className="mt-5 flex flex-col items-center gap-1 select-none">
            <span className="font-display font-light text-white text-base sm:text-xl tracking-[0.25em] uppercase">
              Ivana Molina y Asociados
            </span>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.4em] text-emerald-400 uppercase">
              Bienes Raíces
            </span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
