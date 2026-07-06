import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Shield } from 'lucide-react';

import Hero from './components/Hero';
import CinematicReveal from './components/CinematicReveal';

// Lazy-loaded modules for optimized bundle size & TTI
const FeaturedProperties = lazy(() => import('./components/FeaturedProperties'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const MostWanted = lazy(() => import('./components/MostWanted'));
const AllProperties = lazy(() => import('./components/AllProperties'));
const CinematicCTA = lazy(() => import('./components/CinematicCTA'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const PropertyModal = lazy(() => import('./components/PropertyModal'));
const Chatbot = lazy(() => import('./components/Chatbot/Chatbot'));
// Type references
import { Property } from './types';

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverLightSection, setIsOverLightSection] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // Monitor scroll for float styles & use IntersectionObserver to detect section theme without reflows
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection observer detects overlay of light sections on the header area
    const lightSectionIds = ['propiedades-destacadas', 'mas-cotizadas', 'todas-propiedades', 'contacto'];
    const activeIntersections = new Set<string>();

    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px -92% 0px', // Scanning zone at the height of the fixed navigation bar
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeIntersections.add(entry.target.id);
        } else {
          activeIntersections.delete(entry.target.id);
        }
      });
      setIsOverLightSection(activeIntersections.size > 0);
    }, observerOptions);

    lightSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navLinks = [
    { label: 'Destacadas', href: '#propiedades-destacadas' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Catálogo', href: '#todas-propiedades' },
  ];

  const handleOpenProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseProperty = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white font-sans selection:bg-white/20 selection:text-white">
      {/* Cinematic Reveal Loader */}
      {!isAppLoaded && (
        <CinematicReveal onComplete={() => setIsAppLoaded(true)} />
      )}


      {/* Global Shifting Aurora Mesh Backdrop */}
      <div className="aurora-bg-mesh">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="aurora-glow-3" />
      </div>

      {/* 2. Elegant Glass-Blurred Floating Navigation Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[88%] max-w-6xl z-45 rounded-2xl transition-all duration-500 border ${
          isScrolled 
            ? isOverLightSection
              ? 'py-3.5 bg-white/70 backdrop-blur-xl border-neutral-200/80 shadow-2xl shadow-black/5'
              : 'py-3.5 bg-neutral-950/75 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/5'
            : 'py-4.5 bg-transparent border-transparent'
        }`}
      >
        <div className="w-full px-6 md:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 z-50 select-none group">
            <img
              src="/iavana-molina-favion-cabecera.webp"
              alt="IVANA MOLINA & ASOC. BIENES RAICES"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className={`text-[9px] sm:text-[11px] md:text-xs font-display tracking-[0.12em] sm:tracking-[0.18em] font-bold uppercase group-hover:text-white/70 transition-colors ${
              isOverLightSection ? 'text-neutral-900' : 'text-white'
            }`}>
              IVANA MOLINA & ASOC. BIENES RAICES
            </span>
          </a>

          {/* Desktop Navigation links directly on the main header glass */}
          <nav 
            className="hidden lg:flex items-center gap-2"
            onMouseLeave={() => setHoveredTab(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredTab(link.href)}
                className={`relative px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-colors duration-200 z-10 ${
                  hoveredTab === link.href 
                    ? (isOverLightSection ? 'text-neutral-950 font-medium' : 'text-white') 
                    : (isOverLightSection ? 'text-neutral-500 hover:text-neutral-950' : 'text-gray-400 hover:text-white')
                }`}
              >
                <span className="relative z-20">{link.label.toUpperCase()}</span>
                {hoveredTab === link.href && (
                  <motion.span
                    layoutId="slidingNavIndicator"
                    className={`absolute inset-0 border rounded-lg ${
                      isOverLightSection 
                        ? 'bg-neutral-900/5 border-neutral-900/10' 
                        : 'bg-white/10 border-white/10'
                    }`}
                    style={{ originY: '0px' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Action indicator button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#contacto"
              className={`px-6 py-2.5 rounded-xl border transition-all text-xs font-mono tracking-wider uppercase interactive-hover ${
                isOverLightSection
                  ? 'border-neutral-200 bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'border-white/10 bg-white/5 text-white hover:bg-white hover:text-black'
              }`}
            >
              Consultas
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors z-50 cursor-pointer ${
              isOverLightSection
                ? 'bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-950'
                : 'glass-panel text-gray-400 hover:text-white'
            }`}
            id="mobile-menu-toggle"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* 3. Mobile Navigation Drawer (Glass Slideover) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-[80vw] sm:w-[50vw] bg-neutral-950/95 backdrop-blur-2xl border-l border-white/10 z-30 p-10 flex flex-col justify-between"
          >
            {/* Nav content inside mobile drawer */}
            <div className="flex flex-col gap-8 mt-16 text-sm font-mono tracking-widest">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white py-1 transition-colors block border-b border-white/5"
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
            </div>

            {/* Private contact metrics inside mobile drawer */}
            <div className="border-t border-white/5 pt-6 text-xs text-gray-400 space-y-3 font-mono">
              <p className="flex items-center gap-2">
                <Shield size={14} className="text-white/60" />
                <span>Contacto Directo</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-white/60" />
                <span>+54 11 7202-3171</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Page Sections layout */}
      <main>
        {/* Fullscreen Hero parallax */}
        <Hero isAppLoaded={isAppLoaded} />

        <Suspense fallback={
          <div className="py-32 text-center text-xs font-mono text-neutral-400 tracking-widest uppercase">
            Cargando residencias exclusivas...
          </div>
        }>
          {/* Featured Properties Stagger section */}
          <FeaturedProperties onSelectProperty={handleOpenProperty} />

          {/* About Section with double-stacked image animations */}
          <AboutUs />

          {/* Horizontal scroll properties section */}
          <MostWanted onSelectProperty={handleOpenProperty} />

          {/* Tabs filtered Properties section */}
          <AllProperties onSelectProperty={handleOpenProperty} />


          {/* Cinematic premium ScrollTrigger CTA */}
          <CinematicCTA />

          {/* VIP Contact form & virtual coordinate interactive Map */}
          <Contact />

          {/* 5. Clean footer block */}
          <Footer />

          {/* 6. Dynamic responsive property details Modal */}
          <PropertyModal property={selectedProperty} onClose={handleCloseProperty} />
          
          {/* 7. Chatbot */}
          <Chatbot />
          
          {/* Floating WhatsApp Button */}
          <AnimatePresence>
            {isAppLoaded && (
              <motion.a
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ delay: 1, duration: 0.5, type: 'spring' }}
                href="https://wa.me/5491168091223?text=Hola%2C%20me%20comunico%20desde%20la%20web%20de%20Ivana%20Molina%20Bienes%20Ra%C3%ADces.%20Quisiera%20recibir%20m%C3%A1s%20informaci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[60] bg-neutral-900 text-white p-3.5 rounded-full shadow-2xl hover:bg-neutral-700 hover:scale-110 transition-all group flex items-center justify-center"
                aria-label="Contactar por WhatsApp"
              >
                {/* Tooltip */}
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-max max-w-[200px] bg-white text-neutral-900 text-xs font-sans p-3 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-neutral-100">
                  <span className="block font-semibold mb-0.5">¡Hola, bienvenidos! 👋</span>
                  ¿En qué podemos asesorarte?
                  <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-neutral-100"></span>
                </span>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </motion.a>
            )}
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}
