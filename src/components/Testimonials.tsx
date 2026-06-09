import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data';

export default function Testimonials() {
  // Let's multiply testimonials to simulate a fluent, continuous, infinite marquee track
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <motion.section
      id="testimonios"
      className="py-24 relative overflow-hidden text-white border-t border-white/5"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      style={{
        backgroundColor: "#030303",
        backgroundImage: "linear-gradient(135deg, #030303 0%, #030303 25%, #120921 50%, #030303 75%, #030303 100%)",
        backgroundSize: "400% 400%"
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-emerald-400 font-medium">Opiniones de Clientes</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight">
          Clientes que <strong className="font-semibold">confían en nosotros</strong>
        </h2>
      </div>

      {/* Infinite Autoplay Marquee row */}
      <div className="relative w-full overflow-hidden py-4 flex flex-col gap-6">
        {/* Row 1 Track scrolling Left */}
        <div className="flex w-max gap-6 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
          {duplicatedTestimonials.map((test, index) => (
            <div
              key={`${test.id}-${index}`}
              className="w-[350px] md:w-[420px] p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-emerald-500/5 text-white hover:bg-white/10 transition-all hover:border-emerald-500/30 h-64 flex flex-col justify-between"
            >
              {/* Star header & Quote */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1 text-emerald-400">
                  {Array.from({ length: test.rating }).map((_, rIdx) => (
                    <Star key={rIdx} size={14} fill="currentColor" className="stroke-none" />
                  ))}
                </div>
                <Quote size={20} className="text-emerald-400/20" />
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
