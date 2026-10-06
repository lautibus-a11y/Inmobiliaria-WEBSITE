import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bed, ShowerHead, Eye, PawPrint, FileText, MapPin, ExternalLink, X } from 'lucide-react';

import { properties } from '../data';
import { getRequirementsUrl } from '../utils/requirements';

function getEmbedVideoUrl(url?: string): string | null {
  if (!url) return null;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
  }
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
  }
  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch) {
    return `https://www.youtube.com/embed/${youtuBeMatch[1]}?autoplay=1&rel=0`;
  }
  return url;
}

export default function PropertyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [mediaType, setMediaType] = useState<'photos' | 'video'>('photos');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mediaType !== 'photos') return;
    setTouchStartX(e.touches[0].clientX);
  };

  const property = properties.find(p => p.id === slug);

  // Dynamic SEO metadata when a property is viewed
  useEffect(() => {
    if (!property) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

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

  if (!property) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-32">
        <h2 className="text-3xl font-bold mb-4">Propiedad no encontrada</h2>
        <p className="text-neutral-400 mb-8 font-mono">La propiedad que buscas no existe o ya no está disponible.</p>
        <Link to="/" className="px-6 py-3 bg-white text-black font-semibold rounded-xl text-sm font-mono tracking-widest uppercase hover:bg-neutral-200 transition-colors">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const imagesList = property.images && property.images.length > 0 
    ? [property.image, ...property.images.filter(img => img !== property.image)] 
    : [property.image];

  const rawVideoUrls: string[] = property.videoUrls && property.videoUrls.length > 0
    ? property.videoUrls
    : property.videoUrl
      ? [property.videoUrl]
      : [];

  const videoSources = rawVideoUrls.map((url) => getEmbedVideoUrl(url)).filter(Boolean) as string[];
  const hasVideo = videoSources.length > 0;
  const currentVideoSrc = videoSources[currentVideoIndex] || videoSources[0];



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

  const renderDescription = () => (
    <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md">
      <h2 className="text-xl font-display font-semibold mb-6">Descripción</h2>
      <div className="text-gray-300 text-sm md:text-base leading-relaxed font-sans whitespace-pre-line">
        {property.description}
      </div>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/5">
          <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-4">Características del Inmueble</h3>
          <div className="flex flex-wrap gap-2">
            {property.features.map((feat, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-gray-200 font-sans"
              >
                ✦ {feat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white z-50 transition-colors"
            >
              <X size={24} />
            </button>

            {mediaType === 'photos' && imagesList.length > 1 && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase text-white shadow-lg z-50 pointer-events-none">
                {currentImgIndex + 1} / {imagesList.length}
              </div>
            )}

            <div 
              className="relative w-full h-full flex items-center justify-center touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {mediaType === 'video' && currentVideoSrc ? (
                <div className="w-full max-w-5xl aspect-video px-4">
                  {currentVideoSrc.includes('youtube.com/embed') ? (
                    <iframe
                      key={currentVideoSrc}
                      src={currentVideoSrc}
                      className="w-full h-full border-0 rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={currentVideoSrc}
                      src={currentVideoSrc}
                      autoPlay
                      controls
                      playsInline
                      className="w-full h-full object-contain rounded-xl"
                    />
                  )}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImgIndex}
                    src={imagesList[currentImgIndex]}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full object-contain px-2 md:px-16"
                  />
                </AnimatePresence>
              )}

              {/* Slider Arrows (Fullscreen) */}
              {mediaType === 'photos' && imagesList.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1)); }}
                    className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 z-50"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1)); }}
                    className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 z-50"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1] // Apple-like custom ease curve
        }}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10"
      >
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => {
              if (window.history.length > 2) navigate(-1);
              else navigate('/');
            }} 
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-white transition-colors group cursor-pointer bg-transparent border-none p-0"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="tracking-widest uppercase">Volver</span>
          </button>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/90 text-[10px] tracking-widest uppercase font-mono rounded-lg font-semibold">
              {property.category === 'casas-quinta' ? 'Casas Quinta' : property.category}
            </span>
            <span className={`px-3 py-1.5 border text-[10px] tracking-widest uppercase font-mono rounded-lg font-semibold ${
              property.transactionType === 'venta' ? 'bg-neutral-900 text-white border-white/20' : 'bg-white text-black border-transparent'
            }`}>
              {property.transactionType}
            </span>
            {property.status && (
              <span className={`hidden sm:inline-block px-3 py-1.5 border text-[10px] tracking-widest uppercase font-mono rounded-lg font-semibold ${
                property.status === 'alquilada' ? 'bg-red-500/90 text-white border-red-600/50' : property.status === 'reservada' ? 'bg-orange-500/90 text-white border-orange-600/50' : 'bg-white/90 text-neutral-900 border-neutral-200'
              }`}>
                {property.status}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
        
          {/* Left Column: Gallery & Details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            {/* Gallery Container */}
            <div className="w-full rounded-2xl border border-white/10 overflow-hidden bg-neutral-950/50 backdrop-blur-sm relative group">
              
              <div 
                className="aspect-[4/3] md:aspect-[16/9] relative bg-black flex items-center justify-center overflow-hidden touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {mediaType === 'video' && currentVideoSrc ? (
                  currentVideoSrc.includes('youtube.com/embed') ? (
                    <iframe
                      key={currentVideoSrc}
                      src={currentVideoSrc}
                      title={`Video Tour - ${property.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={currentVideoSrc}
                      src={currentVideoSrc}
                      autoPlay
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImgIndex}
                      src={imagesList[currentImgIndex]}
                      alt={`${property.title} - Foto ${currentImgIndex + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setIsFullscreen(true)}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </AnimatePresence>
                )}

                {/* Slider Arrows */}
                {mediaType === 'photos' && imagesList.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 z-10"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 z-10"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Counter Pill */}
                {mediaType === 'photos' && imagesList.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 border border-white/10 backdrop-blur-md rounded-lg text-[10px] font-mono tracking-widest uppercase text-white shadow-lg pointer-events-none z-10">
                    {currentImgIndex + 1} / {imagesList.length}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails (Mobile & Desktop) */}
              <div className="flex p-3 md:p-4 gap-2 overflow-x-auto no-scrollbar border-t border-white/5 snap-x">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setMediaType('photos'); setCurrentImgIndex(idx); }}
                    className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                      mediaType === 'photos' && currentImgIndex === idx ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {hasVideo && videoSources.map((_, idx) => (
                  <button
                    key={`vid-${idx}`}
                    onClick={() => { setMediaType('video'); setCurrentVideoIndex(idx); }}
                    className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all bg-neutral-900 flex flex-col items-center justify-center gap-1 snap-start ${
                      mediaType === 'video' && currentVideoIndex === idx ? 'border-emerald-500' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${mediaType === 'video' && currentVideoIndex === idx ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`} />
                    <span className="text-[8px] font-mono uppercase text-white">Video {idx + 1}</span>
                  </button>
                ))}
              </div>
              
            </div>

            {/* Detailed Info Section (Visible on Desktop only here, so it aligns below gallery) */}
            <div className="hidden lg:block">
              {renderDescription()}
            </div>
          </div>

          {/* Right Column: Title, Price, Specs, Contact */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 md:p-8 sticky top-24 shadow-2xl backdrop-blur-xl">
            <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <MapPin size={12} /> {property.location}
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-4">
              {property.title}
            </h1>
            <p className="text-3xl md:text-4xl font-light text-white mb-8 tracking-tight">
              {property.price}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">Superficie</span>
                <div className="flex items-center gap-2 text-white">
                  <Eye size={16} className="text-white/50" />
                  <span className="font-semibold text-sm">{property.area}</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">Dormitorios</span>
                <div className="flex items-center gap-2 text-white">
                  <Bed size={16} className="text-white/50" />
                  <span className="font-semibold text-sm">{property.beds || '-'}</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">Baños</span>
                <div className="flex items-center gap-2 text-white">
                  <ShowerHead size={16} className="text-white/50" />
                  <span className="font-semibold text-sm">{property.baths || '-'}</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">Mascotas</span>
                <div className="flex items-center gap-2 text-white">
                  <PawPrint size={16} className="text-white/50" />
                  <span className="font-semibold text-sm">
                    {property.category !== 'locales' && (!property.features || !property.features.some(f => f.toLowerCase().includes('no se permiten mascotas'))) ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {property.streets && (
              <div className="mb-8 pt-4 border-t border-white/5">
                <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1">Dirección Referencial</p>
                <p className="text-white font-medium text-sm">{property.streets}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/5491168091223?text=${encodeURIComponent(`Hola Ivana Molina Bienes Raíces. Me comunico desde su sitio web porque me interesa la propiedad: ${property.title} (${window.location.href}). Quisiera recibir más información y agendar una visita.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-white text-neutral-950 font-bold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02]"
              >
                Contactar por WhatsApp
              </a>

              {property.transactionType === 'alquiler' && (
                <a
                  href={getRequirementsUrl(property)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-neutral-900 border border-white/10 text-white font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText size={14} /> Requisitos
                </a>
              )}

              {property.mercadoLibreLink && (
                <a
                  href={property.mercadoLibreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#FFE600] text-[#2D3277] font-bold text-xs tracking-widest uppercase hover:bg-[#FFD100] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-[#FFE600]/20"
                >
                  Ver en Mercado Libre <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info Section (Visible on Mobile only here, so it aligns below the info card) */}
        <div className="block lg:hidden mt-2">
          {renderDescription()}
        </div>
      </div>
    </motion.div>
    </>
  );
}
