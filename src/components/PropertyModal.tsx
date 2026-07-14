import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Bed, ShowerHead, Eye, QrCode, PawPrint } from 'lucide-react';
import { Property } from '../types';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mediaType, setMediaType] = useState<'photos' | 'video'>('photos');

  // To activate the QR feature, set this to true
  const ENABLE_QR_DOWNLOAD = false;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Reset media state when a different property is selected
  // This pattern is intentional: we derive the reset from property.id change
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (property) {
      setCurrentImgIndex(0);
      setMediaType('photos');
    }
  }, [property?.id]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Dynamic SEO metadata when a property is viewed
  useEffect(() => {
    if (!property) return;

    const originalTitle = document.title;
    const ogTitle = document.getElementById('og-title') as HTMLMetaElement;
    const ogDescription = document.getElementById('og-description') as HTMLMetaElement;
    const ogImage = document.getElementById('og-image') as HTMLMetaElement;
    const twTitle = document.getElementById('tw-title') as HTMLMetaElement;
    const twDescription = document.getElementById('tw-description') as HTMLMetaElement;
    const twImage = document.getElementById('tw-image') as HTMLMetaElement;

    const origOgTitle = ogTitle?.content;
    const origOgDescription = ogDescription?.content;
    const origOgImage = ogImage?.content;
    const origTwTitle = twTitle?.content;
    const origTwDescription = twDescription?.content;
    const origTwImage = twImage?.content;

    const propertyImg = property.images && property.images.length > 0 ? property.images[0] : property.image;
    const newTitle = `${property.title} | Ivana Molina Bienes Raíces`;
    const newDesc = `${property.category === 'casas-quinta' ? 'Casa Quinta' : 'Propiedad'} en ${property.location}. ${property.description.substring(0, 120)}...`;

    document.title = newTitle;
    if (ogTitle) ogTitle.content = newTitle;
    if (ogDescription) ogDescription.content = newDesc;
    if (ogImage) ogImage.content = propertyImg || '/iavana-molina-favion-cabecera.webp';
    if (twTitle) twTitle.content = newTitle;
    if (twDescription) twDescription.content = newDesc;
    if (twImage) twImage.content = propertyImg || '/iavana-molina-favion-cabecera.webp';

    return () => {
      document.title = originalTitle;
      if (ogTitle) ogTitle.content = origOgTitle || '';
      if (ogDescription) ogDescription.content = origOgDescription || '';
      if (ogImage) ogImage.content = origOgImage || '';
      if (twTitle) twTitle.content = origTwTitle || '';
      if (twDescription) twDescription.content = origTwDescription || '';
      if (twImage) twImage.content = origTwImage || '';
    };
  }, [property]);

  if (!property) return null;

  const imagesList = property.images && property.images.length > 0 ? property.images : [property.image];

  // Assignment of video tour
  const videoSrc = '/video-tour-3d/videotour.mp4';

  const downloadQR = () => {
    if (!property) return;
    const canvas = document.getElementById(`qr-${property.id}`) as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-${property.title.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 30 }}
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
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.02 }}
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
                      ? 'bg-white text-neutral-950 font-semibold'
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
                      ? 'bg-white text-neutral-950 font-semibold'
                      : 'text-gray-450 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse inline-block" />
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
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/60 border border-white/10 items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer select-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/60 border border-white/10 items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer select-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
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
                          currentImgIndex === dotIdx ? 'bg-white w-4' : 'bg-white/30 w-2'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/10 border border-white/20 text-white/80 text-xs tracking-widest uppercase font-mono rounded-full inline-block font-semibold">
                    {property.category === 'casas-quinta' ? 'Casas Quinta' : property.category}
                  </span>
                  {property.status && (
                    <span className={`px-3 py-1 border text-xs tracking-widest uppercase font-mono rounded-full inline-block font-semibold ${
                      property.status === 'alquilada' ? 'bg-red-500/90 text-white border-red-600/50' : property.status === 'reservada' ? 'bg-orange-500/90 text-white border-orange-600/50' : 'bg-white/90 text-neutral-900 border-neutral-200'
                    }`}>
                      {property.status}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1 text-white">
                  {property.title}
                </h1>
                <p className="text-white/70 font-mono text-sm tracking-wide font-semibold">
                  {property.price}
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Details & Scheduler (Scrollable) */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Heading */}
              <div>
                <h2 className="text-xs font-mono tracking-widest uppercase text-white/50">Detalles de la Propiedad</h2>
                <div className="w-8 h-0.5 bg-white/20 mt-1 rounded-full" />
              </div>

              {/* Location */}
              <div>
                <p className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-1">Ubicación</p>
                <p className="text-white font-medium text-sm">📍 {property.location}</p>
              </div>

              {/* Streets */}
              {property.streets && (
                <div>
                  <p className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-1">Calles</p>
                  <p className="text-white font-medium text-sm">🛣️ {property.streets}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-gray-455 text-xs font-mono tracking-widest uppercase mb-1">Descripción</p>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light font-sans whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-4 gap-3 border-y border-white/5 py-4">
                <div className="text-center">
                  <span className="text-gray-400 text-[10px] font-mono block mb-1 uppercase">Dormitorios</span>
                  <div className="flex items-center justify-center gap-1.5 text-white">
                    <Bed size={15} className="text-white/60" />
                    <span className="font-mono text-xs font-medium">{property.beds || '—'}</span>
                  </div>
                </div>
                <div className="text-center border-x border-white/5">
                  <span className="text-gray-400 text-[10px] font-mono block mb-1 uppercase">Baños</span>
                  <div className="flex items-center justify-center gap-1.5 text-white">
                    <ShowerHead size={15} className="text-white/60" />
                    <span className="font-mono text-xs font-medium">{property.baths || '—'}</span>
                  </div>
                </div>
                <div className="text-center border-r border-white/5">
                  <span className="text-gray-400 text-[10px] font-mono block mb-1 uppercase">Superficie</span>
                  <div className="flex items-center justify-center gap-1.5 text-white">
                    <Eye size={15} className="text-white/60" />
                    <span className="font-mono text-[11px] font-medium whitespace-nowrap">{property.area}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 text-[10px] font-mono block mb-1 uppercase">Mascotas</span>
                  {property.category !== 'locales' ? (
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <PawPrint size={15} className="text-white/60" />
                      <span className="font-mono text-xs font-medium">Sí</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 text-white/50">
                      <PawPrint size={15} className="text-white/30" />
                      <span className="font-mono text-xs font-medium">No</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-[10px] font-mono tracking-widest uppercase text-gray-455 mb-2.5">Características del Inmueble</h3>
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

            {/* Action Buttons Widget */}
            <div className="mt-8 border-t border-white/5 pt-6 flex flex-col gap-3">
              <a
                href={`https://wa.me/5491168091223?text=${encodeURIComponent(`Hola Ivana Molina Bienes Raíces. Me comunico desde su sitio web porque me interesa la propiedad: ${property.title}. Quisiera recibir más información y agendar una visita.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs tracking-widest uppercase hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-black/20"
              >
                Agendar una Visita
              </a>

              {property.mercadoLibreLink && (
                <a
                  href={property.mercadoLibreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#FFE600] text-[#2D3277] font-bold text-xs tracking-widest uppercase hover:bg-[#FFD100] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-[#FFE600]/20"
                >
                  Ver en Mercado Libre
                </a>
              )}

              {/* TODO: REMOVE THIS BUTTON ONCE ALL QRs ARE DOWNLOADED - Requested by user */}
              {/* TODO: REMOVE THIS BUTTON ONCE ALL QRs ARE DOWNLOADED - Requested by user */}
              {ENABLE_QR_DOWNLOAD && (
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-white/5">
                  <div style={{ display: 'none' }}>
                    <QRCodeCanvas
                      id={`qr-${property.id}`}
                      value={`${window.location.origin}/?prop=${property.id}`}
                      size={1024}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={downloadQR}
                    className="w-full py-3 rounded-xl bg-purple-600/20 border border-purple-500/50 text-purple-200 font-bold text-xs tracking-widest uppercase hover:bg-purple-600/40 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <QrCode size={16} />
                    Descargar QR (PNG)
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
