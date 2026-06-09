import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bed, ShowerHead, Eye, Calendar, User, Mail, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { Property } from '../types';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [mediaType, setMediaType] = useState<'photos' | 'video'>('photos');
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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (property) {
      setCurrentImgIndex(0);
      setMediaType('photos');
      setIsSuccess(false);
      setFormData({
        name: '',
        email: '',
        date: '',
        time: '11:00',
        type: 'presencial',
      });
    }
  }, [property?.id]);

  if (!property) return null;

  const imagesList = property.images && property.images.length > 0 ? property.images : [property.image];

  // Dynamic assignment of video tour based on property ID
  const isOddProperty = parseInt(property.id.replace('prop-', '')) % 2 !== 0;
  const videoSrc = isOddProperty ? '/video-tour-3d/videotour1.mp4' : '/video-tour-3d/videotour2.mp4';

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

  // Touch handlers for swipe gesture on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (mediaType !== 'photos') return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (mediaType !== 'photos' || touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const threshold = 40; // minimum swipe distance in px

    if (diff > threshold) {
      // Swipe left -> Next image
      setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
    } else if (diff < -threshold) {
      // Swipe right -> Prev image
      setCurrentImgIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
    }
    setTouchStartX(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
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
          className="relative w-full max-w-5xl rounded-3xl bg-neutral-950 border border-white/10 text-white overflow-hidden z-10 shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] no-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-colors cursor-pointer shadow-sm"
            id="close-modal-btn"
          >
            <X size={20} />
          </button>

          {/* Left panel: Image/Video Slider & Media Selector */}
          <div className="w-full md:w-1/2 h-[52vh] md:h-auto relative bg-neutral-900/40 group/slider shrink-0">
            <div 
              className="h-full w-full relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Media Display */}
              {mediaType === 'video' ? (
                <div className="absolute inset-0 w-full h-full bg-black">
                  <video
                    src={videoSrc}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
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
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/25 to-transparent z-10 pointer-events-none" />
              
              {/* Media Type Switcher Pill */}
              <div className="absolute top-4 left-4 z-20 flex gap-1.5 p-1 bg-black/75 border border-white/10 rounded-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setMediaType('photos')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                    mediaType === 'photos'
                      ? 'bg-emerald-500 text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Fotos
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    mediaType === 'video'
                      ? 'bg-emerald-500 text-white font-semibold'
                      : 'text-gray-450 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse inline-block" />
                  Video Tour
                </button>
              </div>

              {/* Photo Counter Badge */}
              {mediaType === 'photos' && imagesList.length > 1 && (
                <div className="absolute top-4 right-16 z-20 px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-[9px] font-mono tracking-widest uppercase text-gray-300 select-none">
                  {currentImgIndex + 1} / {imagesList.length}
                </div>
              )}

              {/* Slider Controls (Desktop only) */}
              {mediaType === 'photos' && imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/60 border border-white/10 items-center justify-center text-white hover:bg-emerald-600 transition-colors cursor-pointer select-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/60 border border-white/10 items-center justify-center text-white hover:bg-emerald-600 transition-colors cursor-pointer select-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Over image info */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                {/* Dot Indicators */}
                {mediaType === 'photos' && imagesList.length > 1 && (
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
                <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1 text-white">
                  {property.title}
                </h1>
                <p className="text-emerald-450 font-mono text-sm tracking-wide font-semibold">
                  {property.price}
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Details & Scheduler (Scrollable) */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto no-scrollbar flex flex-col justify-between">
            <div className="space-y-6">
              {/* Heading */}
              <div>
                <h2 className="text-xs font-mono tracking-widest uppercase text-emerald-400">Detalles de la Propiedad</h2>
                <div className="w-8 h-0.5 bg-emerald-500/50 mt-1 rounded-full" />
              </div>

              {/* Location */}
              <div>
                <p className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-1">Ubicación</p>
                <p className="text-white font-medium text-sm">📍 {property.location}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-450 text-xs font-mono tracking-widest uppercase mb-1">Descripción</p>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light font-sans">
                  {property.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-3 border-y border-white/5 py-4">
                <div className="text-center">
                  <span className="text-gray-400 text-[10px] font-mono block mb-1 uppercase">Dormitorios</span>
                  <div className="flex items-center justify-center gap-1.5 text-white">
                    <Bed size={15} className="text-emerald-400" />
                    <span className="font-mono text-xs font-medium">{property.beds || '—'}</span>
                  </div>
                </div>
                <div className="text-center border-x border-white/5">
                  <span className="text-gray-400 text-[10px] font-mono block mb-1 uppercase">Baños</span>
                  <div className="flex items-center justify-center gap-1.5 text-white">
                    <ShowerHead size={15} className="text-emerald-400" />
                    <span className="font-mono text-xs font-medium">{property.baths || '—'}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 text-[10px] font-mono block mb-1 uppercase">Superficie</span>
                  <div className="flex items-center justify-center gap-1.5 text-white">
                    <Eye size={15} className="text-emerald-400" />
                    <span className="font-mono text-[11px] font-medium whitespace-nowrap">{property.area}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-[10px] font-mono tracking-widest uppercase text-gray-450 mb-2.5">Características del Inmueble</h3>
                <div className="flex flex-wrap gap-1.5">
                  {property.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-sans font-light"
                    >
                      ✦ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Private Tour Booking Widget */}
            <div className="mt-8 border-t border-white/5 pt-6">
              <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                <Clock size={14} className="text-emerald-400" />
                Agendar una Visita Privada
              </h3>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                >
                  <CheckCircle className="text-emerald-450 w-10 h-10 mx-auto mb-3 animate-bounce" />
                  <h4 className="text-sm font-display font-medium text-white mb-1">¡Visita Solicitada!</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Uno de nuestros asesores VIP se contactará para coordinar el día y horario de la visita.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Name */}
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-9 text-xs focus:border-emerald-500/65 focus:outline-none transition-all placeholder-gray-450 font-sans text-white focus:bg-white/10"
                      />
                    </div>
                    {/* Email */}
                    <div className="relative">
                      <Mail size={13} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Correo VIP"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-9 text-xs focus:border-emerald-500/65 focus:outline-none transition-all placeholder-gray-450 font-sans text-white focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Date */}
                    <div className="col-span-2 relative">
                      <Calendar size={13} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-2 text-xs focus:border-emerald-500/65 focus:outline-none transition-all font-mono text-white focus:bg-white/10"
                      />
                    </div>
                    {/* Type selection */}
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-2 text-xs focus:border-emerald-500/65 focus:outline-none transition-all font-sans text-white focus:bg-white/10 [&_option]:bg-[#0c0c0c] [&_option]:text-white"
                    >
                      <option className="bg-[#0c0c0c] text-white" value="presencial">Presencial</option>
                      <option className="bg-[#0c0c0c] text-white" value="virtual">Videollamada</option>
                    </select>
                  </div>

                  {errorMessage && (
                    <div className="text-rose-500 text-[10px] flex items-center gap-1.5 font-mono">
                      <ShieldAlert size={12} />
                      {errorMessage}
                    </div>
                  )}

                  {/* Submission Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-emerald-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 overflow-hidden relative shadow-lg hover:shadow-emerald-500/20 interactive-hover"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Confirmar Visita'
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
