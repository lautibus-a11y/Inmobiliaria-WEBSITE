import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'motion/react';
import { stats } from '../data';
import { ArrowRight, Calculator, Key, Building2, Briefcase } from 'lucide-react';
import { useOnScreen } from '../hooks/useOnScreen';

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
    <span ref={ref} className="font-mono font-bold text-3xl md:text-5xl tracking-tight text-white block mb-1">
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}

export default function AboutUs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  // Custom scroll listener on title viewport to trigger cool letter reveals
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  // Initialize synchronously to avoid layout flash on mobile
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // CSS animation hook for mobile title block
  const [mobileTitleRef, mobileTitleVisible] = useOnScreen('0px 0px -30px 0px');

  // Parallax effects for the double-stacked images
  const imgY1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const imgY1Value = isMobile || shouldReduceMotion ? 0 : imgY1;
  const imgY2Value = isMobile || shouldReduceMotion ? 0 : imgY2;

  // Let's create an Animated Title: "SOBRE NOSOTROS"
  const titleText = "SOBRE NOSOTROS";
  const titleWords = titleText.split(' ');

  // Description copy (displayed as full paragraph, not split)
  const descParagraph = "Una inmobiliaria no solo intermedia, también acompaña. Queremos estar al lado tuyo en este camino, trabajando con la honestidad y la confidencialidad que te den total tranquilidad. Nuestro lugar es 20 de Junio; nos mueve un fuerte sentido de pertenencia y un conocimiento experto del mercado local. Nos unimos como equipo para brindarte un respaldo integral y soluciones claras a cada una de tus necesidades.";

  const servicios = [
    { title: "TASACIONES", desc: "Valoración precisa y objetiva de tu propiedad, respaldada por nuestro amplio conocimiento del mercado local.", icon: Calculator },
    { title: "VENTAS", desc: "Gestión integral del proceso de venta, maximizando el valor de tu inmueble con estrategias efectivas.", icon: Key },
    { title: "ALQUILERES", desc: "Selección rigurosa de inquilinos y administración eficiente de contratos para asegurar tu rentabilidad.", icon: Building2 },
    { title: "ADMINISTRACIÓN", desc: "Cuidado minucioso de tu patrimonio, garantizando tranquilidad y transparencia en cada gestión.", icon: Briefcase }
  ];

  return (
    <motion.section
      ref={scrollRef}
      id="nosotros"
      className="py-24 relative overflow-hidden text-white border-y border-white/5"
      style={{
        backgroundColor: "#030303",
        backgroundImage: "linear-gradient(135deg, #030303 0%, #0d0d0d 25%, #1a1a1a 50%, #0d0d0d 75%, #030303 100%)"
      }}
    >
      {/* 1. TITLE — mobile: single CSS fade (zero JS per frame) | desktop: per-word Framer Motion */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center">
        {isMobile ? (
          <div
            ref={mobileTitleRef}
            className={`m-reveal${mobileTitleVisible ? ' in-view' : ''}`}
          >
            <h2 className="text-4xl font-display font-light text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400 tracking-tight select-none py-4">
              SOBRE NOSOTROS
            </h2>
          </div>
        ) : (
          <div ref={titleRef} className="flex justify-center items-center gap-4 md:gap-6 py-4 flex-wrap">
            {titleWords.map((word, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.32, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="inline-block text-4xl md:text-7xl font-display font-light text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400 tracking-tight select-none"
              >
                {word}
              </motion.span>
            ))}
          </div>
        )}
        <div className="w-16 h-0.5 bg-white/20 mx-auto mt-2 rounded-full" />
      </div>

      {/* 2. DOUBLE-STACKED IMAGES SCROLL REVEAL & DESCRIPTIVE TEXT */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
        
        {/* Left Side: Layout with Two stacked images */}
        <div className="lg:col-span-6 relative h-[320px] sm:h-[450px] md:h-[550px] flex items-center justify-center">
          
          <motion.div
            style={{ y: imgY1Value }}
            className="absolute left-4 top-4 w-[75%] h-[85%] rounded-3xl bg-white/5 border-t-2 border-l-2 border-white/15 backdrop-blur-md -translate-x-3 -translate-y-3 pointer-events-none z-0"
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
              loading="lazy"
              className="w-full h-full object-cover filter brightness-[0.7] saturate-[0.85]"
            />
          </motion.div>

          {/* Glassmorphic neutral semi-frame for Front image */}
          <motion.div
            style={{ y: imgY2Value }}
            className="absolute right-4 bottom-4 w-[55%] h-[60%] rounded-3xl bg-white/5 border-b-2 border-r-2 border-white/15 backdrop-blur-md translate-x-3 translate-y-3 pointer-events-none z-20"
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
              loading="lazy"
              className="w-full h-full object-cover filter brightness-[0.85]"
            />
          </motion.div>
        </div>

        {/* Right Side: Elegant Word by Word Descriptives */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono tracking-[0.25em] text-white/50 font-semibold">NUESTRO LEGADO</span>
            <div className="w-12 h-px bg-white/20" />
          </div>

          <h3 className="text-2xl sm:text-4xl font-display font-light text-white tracking-tight leading-tight mb-6">
            Donde tu historia <strong className="font-semibold text-white">echa raíces.</strong>
          </h3>

          {/* Elegant paragraph reveal */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-sm md:text-base text-neutral-300 font-sans tracking-wide leading-relaxed font-light mb-8"
          >
            {descParagraph}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.32, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-4 text-xs font-mono text-neutral-300 border-l border-white/20 pl-5"
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
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.7 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg text-center relative hover:bg-white/10 transition-colors"
            >
              {/* Top active hover circle badge */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20" />

              <CountingNum value={st.value} suffix={st.suffix} prefix={st.prefix} />
              
              <span className="text-[10px] md:text-xs font-sans tracking-widest text-neutral-400 uppercase font-medium">
                {st.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. SERVICIOS SECTION */}
      <div id="servicios" className="max-w-7xl mx-auto px-6 md:px-12 pt-28 -mt-16">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 block mb-2">LO QUE HACEMOS</span>
            <h3 className="text-2xl md:text-4xl font-display font-light text-white tracking-tight">
              Nuestros <strong className="font-semibold">Servicios</strong>
            </h3>
          </div>
          <p className="text-xs text-neutral-300 max-w-sm font-sans">
            Soluciones integrales para cada etapa de tu inversión inmobiliaria, con el respaldo y la experiencia que nos caracteriza.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios.map((srv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-3xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[280px]"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  <srv.icon size={20} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-display font-semibold tracking-tight text-white mb-3">
                  {srv.title}
                </h4>
                <p className="text-xs font-sans font-light text-neutral-400 line-clamp-3 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
              
              <a
                href={`https://wa.me/5491168091223?text=${encodeURIComponent(`Hola Ivana Molina Bienes Raíces. Me comunico desde su sitio web porque estoy interesado en el servicio de ${srv.title}. Quisiera recibir más información.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/70 group-hover:text-white transition-colors mt-6 w-max"
              >
                Consultar ahora 
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
