import { motion, useReducedMotion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data';

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  // Let's multiply testimonials to simulate a fluent, continuous, infinite marquee track
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <motion.section
      id="testimonios"
      className="py-24 relative overflow-hidden text-white border-t border-white/5 dynamic-lilac-gradient"
      style={{
        backgroundColor: "#030303",
        backgroundImage: "linear-gradient(135deg, #030303 0%, #0d0d0d 25%, #1a1a1a 50%, #0d0d0d 75%, #030303 100%)",
        backgroundSize: "400% 400%"
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/50 font-medium">Opiniones de Clientes</span>
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
        <motion.h2
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -50px 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl md:text-5xl font-display font-light text-white tracking-tight mb-4"
        >
          Clientes <strong className="font-semibold text-white">Satisfechos</strong>
        </motion.h2>
      </div>

      {/* Infinite Autoplay Marquee row */}
      <div className="relative w-full overflow-hidden py-4 flex flex-col gap-6">
        {/* Row 1 Track scrolling Left */}
        <div
          className={`flex w-max gap-6 animate-[marquee_40s_linear_infinite] cursor-pointer ${
            shouldReduceMotion ? '[animation-play-state:paused]' : 'hover:[animation-play-state:paused]'
          }`}
        >
          {duplicatedTestimonials.map((test, index) => (
            <div
              key={`${test.id}-${index}`}
              className="w-[350px] md:w-[420px] p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/10 text-white hover:bg-white/10 transition-all hover:border-white/20 h-64 flex flex-col justify-between"
            >
              {/* Star header & Quote */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1 text-white/70">
                  {Array.from({ length: test.rating }).map((_, rIdx) => (
                    <Star key={rIdx} size={14} fill="currentColor" className="stroke-none" />
                  ))}
                </div>
                <Quote size={20} className="text-white/15" />
              </div>

              {/* Text content details */}
              <p className="text-neutral-300 text-xs md:text-sm italic leading-relaxed line-clamp-4 font-sans font-light mb-4">
                "{test.text}"
              </p>

              {/* Client Profile */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <img
                  src={test.avatar}
                  alt={test.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-sm font-display font-semibold tracking-tight text-white">{test.name}</h4>
                  <p className="text-[10px] font-mono uppercase text-neutral-450 tracking-wide">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styled animation keyframes inside an embedded block */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </motion.section>
  );
}
