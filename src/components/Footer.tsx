import { Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent text-white py-16 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Background soft lighting */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4 select-none group cursor-pointer">
              <img
                src="/iavana-molina-favion-cabecera.webp"
                alt="IVANA MOLINA & ASOC. BIENES RAICES"
                loading="lazy"
                className="h-8 md:h-9 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-lg font-display tracking-[0.2em] font-bold text-white uppercase group-hover:text-white/80 transition-colors">IVANA MOLINA & ASOC. BIENES RAICES</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans font-light">
              Transacciones confidenciales en el mercado inmobiliario de alta categoría.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4 font-semibold">Navegación</h4>
            <ul className="space-y-2.5 text-xs font-sans text-gray-400 font-light">
              <li>
                <a href="#propiedades-destacadas" className="hover:text-white transition-colors">Propiedades Destacadas</a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a>
              </li>
              <li>
                <a href="#mas-cotizadas" className="hover:text-white transition-colors">Las Más Codiciadas</a>
              </li>
              <li>
                <a href="#todas-propiedades" className="hover:text-white transition-colors">Catálogo Completo</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal indexes */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4 font-semibold">Servicios</h4>
            <ul className="space-y-2.5 text-xs font-sans text-gray-400 font-light">
              <li>
                <a href="#nosotros" className="hover:text-white transition-colors">Asesoramiento Legal</a>
              </li>
              <li>
                <span className="opacity-50">Políticas de Privacidad</span>
              </li>
              <li>
                <span className="opacity-50">Inversiones y Tasaciones</span>
              </li>
              <li>
                <span className="opacity-50">Administración de Alquileres</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4 font-semibold">Nuestra Oficina</h4>
            <p className="text-xs text-gray-400 font-sans leading-relaxed mb-1 font-light">
              Pablo Ceretti 739,
            </p>
            <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4 font-light">
              20 de Junio, La Matanza.
            </p>
            <div className="flex gap-3 text-white/60">
              <span className="text-[10px] font-mono whitespace-nowrap bg-white/10 border border-white/20 px-2 py-0.5 rounded text-white/70">ZONA OESTE</span>
              <span className="text-[10px] font-mono whitespace-nowrap bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">ÚNICA OFICINA</span>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-400">
          <div>
            <p>Desarrollado por Broadcastweb desing © 2026</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-white/50" />
              Seguridad Garantizada
            </span>
            <span>|</span>
            <span>Desarrollo Profesional</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
