import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Play, Sparkles, Layers, ShieldCheck } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic Expand and Reveal viewport inset on scroll (ultra-smooth starting from opacity 0)
      gsap.fromTo(
        containerRef.current,
        {
          clipPath: 'inset(15% 12% 15% 12% rounded 60px)',
          scale: 0.82,
          opacity: 0,
          backgroundColor: '#030303',
        },
        {
          clipPath: 'inset(0% 0% 0% 0% rounded 0px)',
          scale: 1,
          opacity: 1,
          backgroundColor: '#090412',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top 12%',
            scrub: 1.8,
          },
        }
      );

      // 1b. Smooth entrance fade-in and scale-up for lilac glows
      gsap.fromTo(
        ['.aurora-floating-cta-1', '.aurora-floating-cta-2'],
        {
          opacity: 0,
          scale: 0.6,
        },
        {
          opacity: 1,
          scale: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: 1.2,
          },
        }
      );

      // 2. Parallax background elements
      gsap.fromTo(
        '.aurora-floating-cta-1',
        { y: -60, x: -30, rotate: 0 },
        {
          y: 80,
          x: 40,
          rotate: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        '.aurora-floating-cta-2',
        { y: 80, x: 50 },
        {
          y: -80,
          x: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // 3. Sequential stagger animation content-trigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 45%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        '.word-span',
        { y: 40, opacity: 0, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.04,
          duration: 0.75,
          ease: 'power3.out',
        }
      )
        .fromTo(
          textRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.45'
        )
        .fromTo(
          '.cta-card-btn',
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: 'easeOut' },
          '-=0.3'
        )
        .fromTo(
          '.floating-badge-cta',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
          '-=0.4'
        );

      // 4. Scrubbing horizontal timeline linear indicator
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const headline = 'Encontrá el lugar donde tu historia cobra vida';
  const words = headline.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center bg-[#090412] text-white overflow-hidden py-24 px-6 md:px-12 border-y border-white/5"
      style={{ willChange: 'clip-path' }}
    >
      {/* Dynamic Animated Underlay Ambient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft Lilac Gradients */}
        <div className="aurora-floating-cta-1 absolute top-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-r from-[#b98eeb]/[0.25] to-[#8b56cc]/[0.18] blur-[110px]" />
        <div className="aurora-floating-cta-2 absolute bottom-[15%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#743dbb]/[0.2] to-[#cca8f0]/[0.15] blur-[120px]" />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(ellipse at center, rgba(185, 142, 235, 0.15) 0%, transparent 80%), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />
      </div>

      {/* Cinematic Linear Horizontal Progress Scrub */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 z-20 origin-left">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-[#cca8f0] via-[#b98eeb] to-[#8b56cc] origin-left"
          style={{ transformOrigin: 'left' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto z-10 text-center flex flex-col items-center">
        {/* Floating Category Badge */}
        <div className="floating-badge-cta mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Sparkles size={11} className="text-[#cca8f0] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#cca8f0] uppercase font-semibold">
            REUNIONES PERSONALIZADAS
          </span>
        </div>

        {/* Cinematic headline with split text spans */}
        <h2
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7.5xl font-display font-bold tracking-tight leading-[1.05] mb-8 text-white flex flex-wrap justify-center gap-x-4 gap-y-1 sm:gap-y-3 px-4 max-w-4xl"
          style={{ perspective: '800px' }}
        >
          {words.map((word, index) => (
            <span key={index} className="inline-block overflow-hidden py-1">
              <span className="word-span inline-block origin-bottom will-change-transform text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                {word}
              </span>
            </span>
          ))}
        </h2>

        {/* Description body */}
        <p
          ref={textRef}
          className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans font-light leading-relaxed mb-12 px-6"
        >
          Te acompañamos en cada etapa de la búsqueda de tu próximo hogar o inversión, garantizando transparencia, confidencialidad y el asesoramiento que merecés.
        </p>

        {/* Button Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md px-6">
          <a
            href="#contacto"
            className="cta-card-btn group relative w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#b98eeb] text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#8b56cc]/10 interactive-hover"
          >
            <span>Agendar Asesoría</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#todas-propiedades"
            className="cta-card-btn group relative w-full sm:w-auto px-8 py-4 border border-white/10 bg-white/5 backdrop-blur-md text-white font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer interactive-hover"
          >
            <Play size={10} className="fill-current text-white group-hover:text-black transition-colors" />
            <span>Ver Propiedades</span>
          </a>
        </div>

        {/* Small Trust Metrics */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-40 hover:opacity-60 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest">
            <ShieldCheck size={12} className="text-[#cca8f0]" />
            <span>RESERVA Y SEGURIDAD GARANTIZADA</span>
          </div>
          <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest">
            <Layers size={11} className="text-[#cca8f0]" />
            <span>VALORIZACIÓN PATRIMONIAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
