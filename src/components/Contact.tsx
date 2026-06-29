import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mail, Phone, Landmark, Send, CheckCircle, ShieldAlert, Instagram, Facebook, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    fullName: '',
    vipEmail: '',
    telephone: '',
    investmentRange: '1-5m',
    message: '',
  });

  // Initialize synchronously to avoid layout flash on mobile
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  return (
    <section
      id="contacto"
      className={`py-24 px-6 md:px-12 text-neutral-900 relative overflow-hidden border-t border-neutral-200/50 ${!isMobile ? 'dynamic-light-lilac-gradient' : ''}`}
      style={{
        backgroundColor: isMobile ? '#ffffff' : undefined,
        backgroundImage: isMobile ? 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%)' : undefined
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -50px 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-mono tracking-[0.25em] text-neutral-500 uppercase font-semibold">Contacto Directo</span>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
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
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 block mb-2 uppercase">Ubicaciones Destacadas</span>
              <h3 className="text-xl md:text-2xl font-display font-light mb-4">
                Nuestra <strong className="font-semibold">Presencia</strong>
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans max-w-md">
                Explorá nuestro mapa interactivo de ubicaciones. Deslizá el cursor sobre cada punto para ver la propiedad y hacé clic para conocer más detalles.
              </p>
            </div>

            {/* Google Maps Embed Classic with lila border */}
            <div className="relative w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden border border-neutral-200/60 shadow-xl shadow-black/5 mb-6">
              <iframe
                title="Google Maps Ivana Molina Propiedades"
                src="https://maps.google.com/maps?q=Pablo%20Ceretti%20739,%2020%20de%20Junio,%20La%20Matanza&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-[0.85] contrast-[0.95]"
              />
            </div>

            {/* Direct contact points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm shadow-black/5 flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center text-neutral-600">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">TELÉFONO / WHATSAPP</span>
                  <p className="text-xs font-mono tracking-tight text-neutral-800">1168091223</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm shadow-black/5 flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center text-neutral-600">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">CORREO ELECTRÓNICO</span>
                  <p className="text-xs font-mono tracking-tight text-neutral-800 hover:text-neutral-600 break-all">info@molinaivana.com.ar</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm shadow-black/5 flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center text-neutral-600">
                  <Instagram size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">INSTAGRAM</span>
                  <p className="text-xs font-mono tracking-tight text-neutral-800 hover:text-neutral-600">@molinaivana_bienesraices</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm shadow-black/5 flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center text-neutral-600">
                  <Facebook size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">FACEBOOK</span>
                  <p className="text-xs font-mono tracking-tight text-neutral-800 hover:text-neutral-600">Molina Ivana</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm shadow-black/5 flex items-center gap-3 md:col-span-2">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center text-neutral-600">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">UBICACIÓN DE LA OFICINA</span>
                  <p className="text-xs font-sans font-medium tracking-tight text-neutral-800">Pablo Ceretti 739, 20 de Junio, La Matanza</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5491168091223"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-4 rounded-2xl bg-neutral-900 text-white font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-black/10 interactive-hover"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Consultanos por WhatsApp
              </a>
            </div>

            <div className="mt-6">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 block mb-3 uppercase">Enlaces de Interés</span>
              <div className="flex flex-col gap-2">
                <a
                  href="https://arquiler.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcASud39leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAacey9UnfLnROGV0jUgrMTJbf3EByNTLbyA8_6id2ksXTJUU6OeZKyK64v1x5A_aem__neI0hM5uaAm0BOafFfc-g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-sans font-medium text-neutral-700 hover:text-neutral-900 transition-colors p-3 rounded-xl bg-neutral-100/50 border border-neutral-200/50 hover:bg-neutral-100"
                >
                  <ExternalLink size={14} className="text-neutral-500" />
                  Calculadora de Alquileres
                </a>
                <a
                  href="https://www.boletinoficial.gob.ar/detalleAviso/primera/231429/20200630?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcASud0xleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAacey9UnfLnROGV0jUgrMTJbf3EByNTLbyA8_6id2ksXTJUU6OeZKyK64v1x5A_aem__neI0hM5uaAm0BOafFfc-g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-sans font-medium text-neutral-700 hover:text-neutral-900 transition-colors p-3 rounded-xl bg-neutral-100/50 border border-neutral-200/50 hover:bg-neutral-100"
                >
                  <ExternalLink size={14} className="text-neutral-500" />
                  Código Civil y Comercial de la Nación
                </a>
              </div>
            </div>
          </div>

          {/* Right Panel: Glassmorphic Contact Form */}
          <div className="lg:col-span-5">
            <div className="h-full rounded-3xl bg-white/80 backdrop-blur-xl border border-neutral-200/85 p-6 md:p-8 flex flex-col justify-between shadow-2xl shadow-black/5 relative">
              {/* Background gradient lighting inside form container */}
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/30 to-transparent pointer-events-none rounded-3xl" />
              
              <div>
                <div className="flex gap-2 items-center text-neutral-500 mb-6 border-b border-neutral-100 pb-4">
                  <Landmark size={16} className="text-neutral-500" />
                  <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-neutral-800">Formulario de Contacto</span>
                </div>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 text-center py-16"
                  >
                    <CheckCircle className="text-neutral-700 w-12 h-12 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">Consulta Enviada con Éxito</h3>
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
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-neutral-400 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans shadow-xs"
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
                        placeholder="ej. moretti@ivanamolinapropiedades.com.ar"
                        value={formData.vipEmail}
                        onChange={(e) => setFormData({ ...formData, vipEmail: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-neutral-400 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans shadow-xs"
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
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-neutral-400 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans shadow-xs"
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
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-neutral-400 focus:bg-white focus:outline-none transition-all text-neutral-900 font-sans shadow-xs"
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
                        className="w-full bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs focus:border-neutral-400 focus:bg-white focus:outline-none transition-all placeholder-neutral-400 text-neutral-900 font-sans resize-none shadow-xs"
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
                      className="w-full py-3.5 bg-neutral-900 text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-700 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 overflow-hidden relative shadow-lg shadow-black/10 hover:shadow-black/20 interactive-hover"
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
    </section>
  );
}
