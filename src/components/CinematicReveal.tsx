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
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: isMobileRef ? 0.7 : 1.1, ease: [0.32, 0, 0.67, 0] }}
      className="fixed top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center select-none overflow-hidden"
    >
      <motion.img 
        initial={{ scale: 1, opacity: 0, filter: 'blur(15px)' }}
        animate={isExiting ? { 
          scale: shouldReduceMotion ? 1 : 1.1,
          opacity: 0,
          filter: 'blur(10px)'
        } : { 
          scale: shouldReduceMotion ? 1 : 1.08, 
          opacity: 1,
          filter: 'blur(0px)'
        }}
        transition={{ 
          scale: { duration: isMobileRef ? 2.7 : 4.1, ease: 'linear' },
          opacity: { duration: isExiting ? 0.6 : 1.5, ease: isExiting ? 'easeIn' : 'easeOut' },
          filter: { duration: isExiting ? 0.6 : 1.5, ease: isExiting ? 'easeIn' : 'easeOut' }
        }}
        src="/cinematic-reveal-logo-convertido-de-jpeg.webp" 
        alt="Ivana Molina Propiedades" 
        className="w-[85vw] sm:w-[60vw] md:w-[45vw] max-w-[500px] h-auto object-contain"
      />
    </motion.div>
  );
}
