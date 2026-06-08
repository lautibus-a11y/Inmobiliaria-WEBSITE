import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bed, ShowerHead, Eye, Calendar, User, Mail, ShieldAlert, CheckCircle, Clock, Play, Video } from 'lucide-react';
import { Property } from '../types';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'tour3d'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '11:00',
    type: 'presencial', // presencial or virtual
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (property) {
      setCurrentImgIndex(0);
      setActiveTab('info');
    }
  }, [property?.id]);

  if (!property) return null;

  const imagesList = property.images && property.images.length > 0 ? property.images : [property.image];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.date) {
      setErrorMessage('Por favor, completá todos los campos obligatorios.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate high-end server confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-5xl rounded-3xl bg-neutral-950 border border-white/10 text-white overflow-hidden z-10 shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] no-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-colors cursor-pointer shadow-sm"
            id="close-modal-btn"
          >
            <X size={20} />
          </button>

          {/* Left panel: Image Slider & Specs */}
          <div className="w-full md:w-1/2 relative bg-neutral-900/40 group/slider">
            <div className="h-64 md:h-full relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImgIndex}
                  src={imagesList[currentImgIndex]}
                  alt={`${property.title} - Foto ${currentImgIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent z-10 pointer-events-none" />
              
              {/* Photo Counter Badge */}
              {imagesList.length > 1 && (
                <div className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-black/60 border border-white/10 rounded-lg text-[9px] font-mono tracking-widest uppercase text-gray-300 select-none">
                  Foto {currentImgIndex + 1} de {imagesList.length}
                </div>
              )}

              {/* Slider Controls */}
              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors cursor-pointer select-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors cursor-pointer select-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Over image info */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                {/* Dot Indicators */}
                {imagesList.length > 1 && (
                  <div className="flex gap-1 mb-4 select-none">
                    {imagesList.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentImgIndex(dotIdx)}
                        className={`h-1 rounded-full transition-all cursor-pointer ${
                          currentImgIndex === dotIdx ? 'bg-emerald-400 w-4' : 'bg-white/30 w-2'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs tracking-widest uppercase font-mono rounded-full mb-3 inline-block font-semibold">
                  {property.category === 'premium' ? 'Colección Premium' : property.category}
                </span>
                <h1 className="text-3xl font-display font-bold tracking-tight mb-1 text-white">
                  {property.title}
                </h1>
                <p className="text-emerald-400 font-mono text-sm tracking-wide font-semibold">
                  {property.price}
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Details & Scheduler (Scrollable) */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto no-scrollbar flex flex-col justify-between">
            <div>
              {/* Interactive Section Selector Tabs */}
              <div className="flex gap-2 border-b border-white/5 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                    activeTab === 'info'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 font-medium'
                      : 'bg-white/5 border border-transparent text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Detalles de la Propiedad
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tour3d')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'tour3d'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 font-medium'
                      : 'bg-white/5 border border-transparent text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Recorrido Virtual
                </button>
              </div>

              {activeTab === 'info' ? (
                <div>
                  {/* Subheading location */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs font-mono tracking-widest uppercase">Ubicación</p>
                    <p className="text-white font-medium">{property.location}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                    {property.description}
                  </p>

                  {/* Row Specs */}
                  <div className="grid grid-cols-3 gap-4 mb-6 border-y border-white/5 py-4">
                    <div className="text-center">
                      <span className="text-gray-400 text-xs font-mono block mb-1">Dormitorios</span>
                      <div className="flex items-center justify-center gap-1.5 text-white">
                        <Bed size={16} className="text-emerald-400" />
                        <span className="font-mono font-medium">{property.beds || '—'}</span>
                      </div>
                    </div>
                    <div className="text-center border-x border-white/5">
                      <span className="text-gray-400 text-xs font-mono block mb-1">Baños</span>
                      <div className="flex items-center justify-center gap-1.5 text-white">
                        <ShowerHead size={16} className="text-emerald-400" />
                        <span className="font-mono font-medium">{property.baths || '—'}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-400 text-xs font-mono block mb-1">Superficie</span>
                      <div className="flex items-center justify-center gap-1.5 text-white">
                        <Eye size={16} className="text-emerald-400" />
                        <span className="font-mono font-medium text-xs whitespace-nowrap">{property.area}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenidades de Lujo */}
                  <div className="mb-8">
                    <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-3">Características del Inmueble</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-sans tracking-wide"
                        >
                          ✦ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn pb-6">
                  {/* Highly polished video playback preview frames */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 bg-neutral-950/80 group">
                    <img
                      src={property.image}
                      alt="Tour Preview"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-xs group-hover:scale-105 transition-transform duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-neutral-900/50" />
                    
                    {/* Aesthetics overlays */}
                    <div className="absolute top-3 left-3 flex gap-2 items-center text-[9px] font-mono tracking-widest text-emerald-400 uppercase bg-black/75 px-2 py-1 rounded border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      RECORRIDO CINEMÁTICO
                    </div>
                    <div className="absolute top-3 right-3 text-[9px] font-mono tracking-widest text-emerald-400 bg-black/75 px-2 py-1 rounded border border-emerald-500/20 font-semibold">
                      IMÁGENES DE ALTA CALIDAD
                    </div>

                    {/* Central Play/Interactive Reticle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center relative bg-white/5 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-400/50">
                        <Play size={18} className="text-white fill-white/10 ml-0.5 group-hover:text-emerald-400 group-hover:fill-emerald-400/10 transition-colors" />
                        <div className="absolute -inset-2 border border-emerald-500/10 rounded-full animate-spin [animation-duration:15s]" />
                      </div>
                    </div>

                    {/* Grid Overlay for elegant alignment feel */}
                    <div className="absolute inset-0 pointer-events-none border border-white/5 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute bottom-3 left-3 text-[9px] font-mono text-gray-200">
                      VISTA COMPLETA
                    </div>
                  </div>

                  {/* Pre-upload notification box */}
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-emerald-500/[0.03] blur-[40px] pointer-events-none" />
                    <Video className="text-emerald-400 w-7 h-7 mx-auto mb-3 animate-pulse" />
                    <h4 className="text-sm font-display font-semibold text-white tracking-wider uppercase mb-1.5">
                      Próximamente Recorrido Virtual 3D
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans font-light">
                      Estamos procesando los videos cinemáticos de alta definición y el recorrido virtual 3D para brindarte la mejor experiencia visual sin perder detalles.
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-center gap-4 text-[9px] font-mono text-emerald-400 tracking-wider">
                      <span>✦ TOMAS AÉREAS</span>
                      <span>✦ DETALLE DE AMBIENTES</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Private Tour Booking Widget */}
            <div className="mt-auto border-t border-white/5 pt-6">
              <h3 className="text-sm font-display font-medium tracking-wide text-white mb-4 flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" />
                Agendar una Visita
              </h3>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                >
                  <CheckCircle className="text-emerald-400 w-10 h-10 mx-auto mb-3 animate-bounce" />
                  <h4 className="text-base font-display font-medium text-white mb-1">¡Visita Solicitada!</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Uno de nuestros asesores se contactará con vos para coordinar el día y horario de la visita.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Name */}
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nombre y Apellido"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-9 text-xs focus:border-emerald-500/60 focus:outline-none transition-all placeholder-gray-400 font-sans text-white focus:bg-white/10"
                      />
                    </div>
                    {/* Email */}
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Correo Electrónico"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-9 text-xs focus:border-emerald-500/60 focus:outline-none transition-all placeholder-gray-400 font-sans text-white focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Date */}
                    <div className="col-span-2 relative">
                      <Calendar size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-2 text-xs focus:border-emerald-500/60 focus:outline-none transition-all font-mono text-white focus:bg-white/10"
                      />
                    </div>
                    {/* Type selection */}
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-2 text-xs focus:border-emerald-500/60 focus:outline-none transition-all font-sans text-white focus:bg-white/10 [&_option]:bg-[#0c0c0c] [&_option]:text-white"
                    >
                      <option className="bg-[#0c0c0c] text-white" value="presencial">Presencial</option>
                      <option className="bg-[#0c0c0c] text-white" value="virtual">Videollamada</option>
                    </select>
                  </div>

                  {errorMessage && (
                    <div className="text-rose-650 text-xs flex items-center gap-1.5 font-mono">
                      <ShieldAlert size={12} />
                      {errorMessage}
                    </div>
                  )}

                  {/* Submission Glass Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-emerald-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 overflow-hidden relative shadow-lg hover:shadow-emerald-500/20 interactive-hover"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Confirmar Solicitud'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
