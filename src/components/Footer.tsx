import { Landmark, Compass, Shield, Hexagon } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent text-white py-16 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Background soft lighting */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.04] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4 select-none">
              <Hexagon size={24} className="text-emerald-400 rotate-90" />
              <span className="text-lg font-display tracking-[0.2em] font-bold text-white uppercase">AURELIA</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans font-light">
              Asesoramiento exclusivo y transacciones confidenciales en el mercado inmobiliario de alta categoría.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-4 font-semibold">Navegación</h4>
            <ul className="space-y-2.5 text-xs font-sans text-gray-400 font-light">
              <li>
                <a href="#propiedades-destacadas" className="hover:text-emerald-400 transition-colors">Propiedades Destacadas</a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-emerald-400 transition-colors">Sobre Nosotros</a>
              </li>
              <li>
                <a href="#mas-cotizadas" className="hover:text-emerald-400 transition-colors">Las Más Codiciadas</a>
              </li>
              <li>
                <a href="#todas-propiedades" className="hover:text-emerald-400 transition-colors">Catálogo Completo</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal indexes */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-4 font-semibold">Servicios</h4>
            <ul className="space-y-2.5 text-xs font-sans text-gray-400 font-light">
              <li>
                <a href="#nosotros" className="hover:text-emerald-400 transition-colors">Asesoramiento Legal</a>
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
            <h4 className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-4 font-semibold">Nuestras Oficinas</h4>
            <p className="text-xs text-gray-400 font-sans leading-relaxed mb-1 font-light">
              Av. del Libertador 2400,
            </p>
            <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4 font-light">
              Buenos Aires, Argentina.
            </p>
            <div className="flex gap-3 text-emerald-400">
              <span className="text-[10px] font-mono whitespace-nowrap bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-400">BUENOS AIRES</span>
              <span className="text-[10px] font-mono whitespace-nowrap bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">EDIFICIO LIBERTADOR</span>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-400">
          <div>
            <p>© {currentYear} Aurelia Propiedades de Categoría. Todos los derechos reservados.</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-emerald-400" />
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
