import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // High performance hardware accelerated position tracking via framer motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring configurations for custom heavy/lagged/sleek glass motion trail
  const springConfig = { damping: 45, stiffness: 400, mass: 0.4 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect mobile/touch device to avoid redundant cursor overlay
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.classList.contains('interactive-hover') ||
        target.closest('.interactive-hover');
        
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer blurred glass follower ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-500/30 pointer-events-none z-50 mix-blend-screen bg-emerald-500/5 backdrop-blur-[2px]"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isActive ? 0.75 : isHovered ? 2.2 : 1,
          borderColor: isHovered ? 'rgba(16, 185, 129, 0.7)' : 'rgba(16, 185, 129, 0.3)',
          backgroundColor: isHovered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.05)',
          boxShadow: isHovered 
            ? '0 0 20px rgba(16, 185, 129, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.1)' 
            : '0 0 0px rgba(16, 185, 129, 0), inset 0 0 0px rgba(255, 255, 255, 0)',
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      />
      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[51]"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
      />
    </>
  );
}
