import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { stats, team } from '../data';

// Helper component for counting numbers smoothly
function CountingNum({ value, suffix, prefix }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out circle / quadratic easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeProgress * (end - start) + start;
      
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  // Handle floats vs integers, e.g., 99.4%
  const formattedCount = Number.isInteger(value) ? Math.floor(count) : count.toFixed(1);

  return (
    <span ref={ref} className="font-mono font-bold text-3xl md:text-5xl tracking-tight text-emerald-650 block mb-1">
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}

export default function AboutUs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  
  // Custom scroll listener on title viewport to trigger cool letter reveals
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax effects for the double-stacked images
  const imgY1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const imgY1Value = isMobile ? 0 : imgY1;
  const imgY2Value = isMobile ? 0 : imgY2;

  // Let's create an Animated Title: "SOBRE NOSOTROS"
  const titleText = "SOBRE NOSOTROS";
  const titleWords = titleText.split(' ');

  // Description copy split by words
  const descParagraph = "Somos una inmobiliaria boutique orientada a la confidencialidad y la excelencia. Seleccionamos propiedades únicas que representan verdaderas joyas de diseño y estilo de vida.";
  const descWords = descParagraph.split(' ');

  // Team carousel slider controls
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
    
    // Auto-update on window resize
    const handleResize = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [dragOffset, setDragOffset] = useState(0);

  return (
    <motion.section
      ref={scrollRef}
      id="nosotros"
      className="py-24 relative overflow-hidden text-white border-y border-white/5"
      style={{
        backgroundColor: "#030303",
        backgroundImage: "linear-gradient(135deg, #030303 0%, #030303 25%, #120921 50%, #030303 75%, #030303 100%)"
      }}
    >
      {/* 1. LIGHTWEIGHT FADE-IN TITLE */}
      <div ref={titleRef} className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center">
        <div className="flex justify-center items-center gap-4 md:gap-6 py-4 flex-wrap">
          {titleWords.map((word, idx) => {
            return (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.15,
                  ease: 'easeOut'
                }}
                className="inline-block text-4xl md:text-7xl font-display font-light text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400 tracking-tight select-none"
              >
                {word}
              </motion.span>
            );
          })}
        </div>
        <div className="w-16 h-0.5 bg-emerald-500/50 mx-auto mt-2 rounded-full" />
      </div>

      {/* 2. DOUBLE-STACKED IMAGES SCROLL REVEAL & DESCRIPTIVE TEXT */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
        
        {/* Left Side: Layout with Two stacked images */}
        <div className="lg:col-span-6 relative h-[320px] sm:h-[450px] md:h-[550px] flex items-center justify-center">
          
          {/* Glassmorphic lilac semi-frame for Back image */}
          <motion.div
            style={{ y: imgY1Value }}
            className="absolute left-4 top-4 w-[75%] h-[85%] rounded-3xl bg-emerald-500/10 border-t-2 border-l-2 border-emerald-400/40 backdrop-blur-md -translate-x-3 -translate-y-3 pointer-events-none z-0"
          />

          {/* Back main overlapping image with glass borders */}
          <motion.div
            style={{ y: imgY1Value }}
            className="absolute left-4 top-4 w-[75%] h-[85%] rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-neutral-900 z-10"
          >
            <div className="absolute inset-0 bg-black/10 z-10" />
            <img
              src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=700&q=80"
              alt="Luxury Interior Luxury Living"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-[0.7] saturate-[0.85]"
            />
          </motion.div>

          {/* Glassmorphic lilac semi-frame for Front image */}
          <motion.div
            style={{ y: imgY2Value }}
            className="absolute right-4 bottom-4 w-[55%] h-[60%] rounded-3xl bg-emerald-500/10 border-b-2 border-r-2 border-emerald-400/40 backdrop-blur-md translate-x-3 translate-y-3 pointer-events-none z-20"
          />

          {/* Front overlapping secondary image with larger glass borders and shadow */}
          <motion.div
            style={{ y: imgY2Value }}
            className="absolute right-4 bottom-4 w-[55%] h-[60%] rounded-3xl overflow-hidden bg-neutral-900/60 border border-white/10 shadow-2xl z-30 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80"
              alt="Mansion Design Architecture Close-up"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-[0.85]"
            />
          </motion.div>
        </div>

        {/* Right Side: Elegant Word by Word Descriptives */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono tracking-[0.25em] text-emerald-400 font-semibold">NUESTRO LEGADO</span>
            <div className="w-12 h-px bg-emerald-500/30" />
          </div>

          <h3 className="text-2xl sm:text-4xl font-display font-light text-white tracking-tight leading-tight mb-6">
            Buscamos la <strong className="font-semibold text-emerald-600">distinción</strong>, ofrecemos la <strong className="font-semibold">excelencia</strong>.
          </h3>

          {/* Elegant paragraph reveal */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-sm md:text-base text-neutral-300 font-sans tracking-wide leading-relaxed font-light mb-8"
          >
            {descParagraph}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-4 text-xs font-mono text-neutral-300 border-l border-emerald-500/60 pl-5"
          >
            <p>✦ Privacidad absoluta y confidencialidad en cada etapa.</p>
            <p>✦ Asesoramiento integral en transacciones internacionales.</p>
          </motion.div>
        </div>
      </div>

      {/* 3. PERFORMANCE STATS COUNTERS */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((st) => (
            <motion.div
              key={st.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg text-center relative hover:bg-white/10 transition-colors"
            >
              {/* Top active hover circle badge */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500/40" />

              <CountingNum value={st.value} suffix={st.suffix} prefix={st.prefix} />
              
              <span className="text-[10px] md:text-xs font-sans tracking-widest text-neutral-400 uppercase font-medium">
                {st.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. TEAM SLIDER CAROUSEL */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-600 block mb-2">NUESTROS CONSULTORES</span>
            <h3 className="text-2xl md:text-4xl font-display font-light text-white tracking-tight">
              Nuestro <strong className="font-semibold">Equipo de Categoría</strong>
            </h3>
          </div>
          <p className="text-xs text-neutral-300 max-w-sm font-sans">
            Profesionales dedicados al asesoramiento personalizado y a la gestión discreta de propiedades exclusivas.
          </p>
        </div>

        {/* Carousel Slider: Infinite Autoplay Loop with hover pause */}
        <div className="relative overflow-hidden py-4 w-screen -mx-6 md:w-full md:mx-0 cursor-default select-none">
          <div className="flex gap-6 w-max animate-[teamMarquee_45s_linear_infinite] hover:[animation-play-state:paused]">
            {[...team, ...team, ...team].map((member, idx) => (
              <div
                key={`${member.id}-${idx}`}
                className="w-72 h-[420px] rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex flex-col justify-between p-4 group hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
              >
                {/* Profile Photo */}
                <div className="relative h-[280px] rounded-2xl overflow-hidden bg-neutral-900 mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.8] group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                {/* Info and action */}
                <div className="px-2">
                  <h4 className="text-lg font-display font-semibold tracking-tight text-white group-hover:text-emerald-600 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Autoplay indicator helper */}
          <div className="flex justify-end gap-2 mt-4 text-[11px] font-mono text-neutral-400">
            <span>✦ Desplazamiento automático (Pase el cursor para pausar) ✦</span>
          </div>
        </div>
      </div>

      {/* Styled Keyframes block */}
      <style>{`
        @keyframes teamMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33333%);
          }
        }
      `}</style>
    </motion.section>
  );
}
