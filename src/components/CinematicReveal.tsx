import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CinematicRevealProps {
  onComplete: () => void;
}

export default function CinematicReveal({ onComplete }: CinematicRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      // Create charging animation timeline
      const tl = gsap.timeline();

      // Initial branding reveal stagger
      tl.fromTo(
        logoRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.3, ease: 'power3.out' }
      );

      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.7'
      );

      tl.fromTo(
        progressContainerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.8'
      );

      tl.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 1, ease: 'power1.out' },
        '-=0.9'
      );

      // Loading progress animation from 0 to 100
      const progressObj = { value: 0 };
      tl.to(
        progressObj,
        {
          value: 100,
          duration: 2.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            setCount(Math.floor(progressObj.value));
            if (barRef.current) {
              barRef.current.style.width = `${progressObj.value}%`;
            }
          },
          onComplete: () => {
            // Smooth exit with blur, scale and fade out
            gsap.to(containerRef.current, {
              opacity: 0,
              filter: 'blur(35px)',
              scale: 1.05,
              duration: 1.1,
              ease: 'power3.inOut',
              onComplete: () => {
                // Restore normal scroll
                document.body.style.overflow = '';
                onComplete();
              }
            });
          }
        },
        '-=0.4'
      );
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // Format count to 2-digit format, e.g. "05" or "99"
  const formattedCount = count < 10 ? `0${count}` : `${count}`;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full bg-[#030303] z-50 flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ willChange: 'opacity, filter, transform' }}
    >
      {/* Soft ambient lila light under the logo to keep theme premium */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] max-w-[600px] max-h-[600px] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      {/* Main Container - Responsive layout */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center max-w-2xl mx-auto">
        
        {/* Large Logo Image */}
        <div 
          ref={logoRef} 
          className="w-[72vw] sm:w-[60vw] md:w-[50vw] max-w-[380px] lg:max-w-[440px] h-auto mx-auto overflow-hidden"
        >
          <img 
            src="/logo.png" 
            alt="Aurelia Propiedades Logo" 
            className="w-full h-auto object-contain mx-auto filter drop-shadow-[0_0_25px_rgba(185,142,235,0.2)]"
          />
        </div>

        {/* Branding Title */}
        <div 
          ref={textRef} 
          className="text-white text-lg sm:text-2xl font-display font-light tracking-[0.2em] mt-6 sm:mt-8 mb-10 sm:mb-12 text-center mx-auto select-none"
        >
          Aurelia <strong className="font-semibold text-purple-300">Propiedades</strong>
        </div>

        {/* Slider & Progress bar container */}
        <div 
          ref={progressContainerRef} 
          className="w-full max-w-[280px] sm:max-w-[340px] space-y-4 mx-auto"
        >
          {/* Progress bar line */}
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div
              ref={barRef}
              className="absolute left-0 top-0 bottom-0 w-0 bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500 rounded-full"
            />
          </div>

          {/* Details & Percent counter */}
          <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-gray-500 tracking-wider">
            <span>CARGANDO SISTEMA</span>
            <span className="text-purple-300 font-bold">{formattedCount}%</span>
          </div>
        </div>
      </div>

      {/* Footer Branding credits - Responsive position and size */}
      <div 
        ref={footerRef}
        className="absolute bottom-6 sm:bottom-8 text-center text-[9px] sm:text-xs font-mono text-gray-600 tracking-wider px-4 z-10"
      >
        Desarrollado por <span className="text-purple-400 font-semibold">Broadcastweb</span> • Todos los derechos reservados
      </div>
    </div>
  );
}
