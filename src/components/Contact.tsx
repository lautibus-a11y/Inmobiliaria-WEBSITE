import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Landmark, Send, CheckCircle, ShieldAlert, Navigation } from 'lucide-react';
import { properties } from '../data';
import { Property } from '../types';

interface ContactProps {
  onSelectProperty: (property: Property) => void;
}

export default function Contact({ onSelectProperty }: ContactProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    vipEmail: '',
    telephone: '',
    investmentRange: '1-5m',
    message: '',
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Track hovered node on custom futuristic map to display tooltips
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  const ranges = [
    { label: '$1,000,000 - $5,000,000 USD', value: '1-5m' },
    { label: '$5,000,000 - $10,000,000 USD', value: '5-10m' },
    { label: '$10,000,000 - $25,000,000 USD', value: '10-25m' },
    { label: 'Colecciones Privadas ($25M+ USD)', value: '25m+' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.vipEmail.trim() || !formData.message.trim()) {
      setErrorMessage('Por favor, completá todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (    <section
      id="contacto"
      className="py-24 px-6 md:px-12 text-neutral-900 relative overflow-hidden border-t border-neutral-200/50 dynamic-light-lilac-gradient"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-mono tracking-[0.25em] text-emerald-700 uppercase font-semibold">Contacto Directo</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-light tracking-tight text-neutral-900">
            Escribinos tu <strong className="font-semibold">Consulta</strong>
          </h2>
          <p className="text-neutral-600 text-sm mt-3 font-sans font-light">
            Nuestro equipo de asesores está a disposición para acompañarte y responder a tus consultas de manera inmediata.
          </p>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Panel: Luxury Location Map Overlay */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="mb-6">
              <span className="text-[10px] font-mono tracking-widest text-emerald-700 block mb-2 uppercase">Ubicaciones Destacadas</span>
              <h3 className="text-xl md:text-2xl font-display font-light mb-4">
                Nuestra <strong className="font-semibold">Presencia</strong>
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans max-w-md">
                Explorá nuestro mapa interactivo de ubicaciones. Deslizá el cursor sobre cada punto para ver la propiedad y hacé clic para conocer más detalles.
              </p>
            </div>

            {/* Custom Interactive Vector Map Frame */}
            <div className="relative w-full h-[400px] md:h-[450px] rounded-3xl bg-white/70 backdrop-blur-xl border border-neutral-200/80 overflow-hidden flex items-center justify-center select-none group/map mb-6 shadow-xl shadow-emerald-500/5">
              
              {/* Subtle tech background grids */}
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(185, 142, 235, 0.25) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              
              {/* Styled digital compass overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[9px] text-neutral-500 z-10">
                <Navigation size={10} className="text-emerald-600 rotate-45" />
                <span>PORTAFOLIO DE PROPIEDADES ACTIVO</span>
              </div>

              {/* Simple stylized world coordinate lines SVG background */}
              <svg className="absolute inset-0 w-full h-full text-neutral-900/[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,200 L 800,200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 400,0 L 400,600" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="400" cy="200" r="120" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                <circle cx="400" cy="200" r="220" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
              </svg>

              {/* Coordinate Nodes mapping */}
              {properties.map((p) => {
                return (
                  <div
                    key={p.id}
                    className="absolute cursor-pointer"
                    style={{ left: `${p.coordinates.x}%`, top: `${p.coordinates.y}%` }}
                    onMouseEnter={() => !isMobile && setHoveredProperty(p)}
                    onMouseLeave={() => !isMobile && setHoveredProperty(null)}
                    onClick={() => onSelectProperty(p)}
                  >
                    {/* Glowing outer circle indicator */}
                    <div className="relative flex items-center justify-center w-8 h-8">
                      <motion.div
                        animate={isMobile ? {} : { scale: [1, 2, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={isMobile ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() }}
                        className={`absolute w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 ${isMobile ? 'animate-pulse' : ''}`}
                      />
                      <div className="relative w-2 h-2 rounded-full bg-emerald-500 group-hover/map:bg-emerald-600 border border-white shadow-lg shadow-emerald-500/30" />
                    </div>
                  </div>
                );
              })}

              {/* Floating Glass dossiers tooltips */}
              <AnimatePresence>
                {hoveredProperty && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-6 mx-auto bg-white/95 backdrop-blur-xl p-4 rounded-2xl w-72 text-neutral-900 flex gap-3 shadow-2xl z-20 pointer-events-auto cursor-pointer border border-emerald-500/20"
                    onClick={() => onSelectProperty(hoveredProperty)}
                  >
                    <img
                      src={hoveredProperty.image}
                      alt={hoveredProperty.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-mono tracking-widest text-emerald-700 block uppercase">
                        {hoveredProperty.category}
                      </span>
                      <h4 className="text-xs font-display font-semibold truncate text-neutral-900">{hoveredProperty.title}</h4>
                      <p className="text-[10px] text-neutral-500 truncate">📍 {hoveredProperty.location.split(',')[0]}</p>
                      <span className="text-xs font-mono font-medium text-emerald-600 block mt-1">{hoveredProperty.price}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct contact points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm shadow-emerald-500/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">CORREO ELECTRÓNICO</span>
                  <p className="text-xs font-mono tracking-tight text-neutral-800 hover:text-emerald-700">contacto@aureliapropiedades.com.ar</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm shadow-emerald-500/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">TELÉFONO DE CONTACTO</span>
                  <p className="text-xs font-mono tracking-tight text-neutral-800">+54 11 7202-3171</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Glassmorphic Contact Form */}
          <div className="lg:col-span-5">
            <div className="h-full rounded-3xl bg-white/80 backdrop-blur-xl border border-neutral-200/85 p-6 md:p-8 flex flex-col justify-between shadow-2xl shadow-emerald-500/5 relative">
              {/* Background gradient lighting inside form container */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.015] to-transparent pointer-events-none rounded-3xl" />
              
              <div>
                <div className="flex gap-2 items-center text-neutral-500 mb-6 border-b border-neutral-100 pb-4">
                  <Landmark size={16} className="text-emerald-600" />
                  <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-neutral-800">Formulario de Contacto</span>
                </div>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center py-16"
                  >
                    <CheckCircle className="text-emerald-650 w-12 h-12 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-lg font-display font-semibold text-emerald-800 mb-2">Consulta Enviada con Éxito</h3>
                    <p className="text-neutral-600 text-xs leading-relaxed font-light">
                      Recibimos tu mensaje de manera segura. Uno de nuestros asesores especializados se comunicará con vos a la brevedad para brindarte una atención personalizada.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase block mb-1.5 pl-1">
                        Nombre y Apellido
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Alessandra Moretti"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-emerald-500/60 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans shadow-xs"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase block mb-1.5 pl-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ej. moretti@aureliapropiedades.com.ar"
                        value={formData.vipEmail}
                        onChange={(e) => setFormData({ ...formData, vipEmail: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-emerald-500/60 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans shadow-xs"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase block mb-1.5 pl-1">
                        Teléfono de Contacto
                      </label>
                      <input
                        type="tel"
                        placeholder="ej. +54 9 11 7202-3171"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-emerald-500/60 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans shadow-xs"
                      />
                    </div>

                    {/* Investment Range Select */}
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase block mb-1.5 pl-1">
                        Rango de Inversión Estimado
                      </label>
                      <select
                        value={formData.investmentRange}
                        onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-emerald-500/60 focus:bg-white focus:outline-none transition-all text-neutral-900 font-sans shadow-xs"
                      >
                        {ranges.map((rn) => (
                          <option key={rn.value} value={rn.value} className="bg-white text-neutral-900 leading-loose select-none">
                            {rn.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase block mb-1.5 pl-1">
                        Mensaje / Propiedades de tu interés
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Contanos qué tipo de propiedad estás buscando o cuál es tu consulta específica..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-emerald-500/60 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans resize-none shadow-xs"
                      />
                    </div>

                    {errorMessage && (
                      <div className="text-rose-600 text-xs pl-1 font-mono flex items-center gap-1.5">
                        <ShieldAlert size={12} />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-emerald-600 text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 overflow-hidden relative shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 interactive-hover"
                    >
                      {isSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={12} />
                          <span>Enviar Mensaje</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Secure footer indicators */}
              <div className="hidden sm:block text-[9px] font-mono text-neutral-400 text-center border-t border-neutral-100 pt-4 mt-4 tracking-wide">
                <span>🔒 TUS DATOS SE ENCUENTRAN PROTEGIDOS CON TOTAL CONFIDENCIALIDAD</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
