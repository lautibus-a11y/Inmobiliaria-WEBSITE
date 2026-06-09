import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Hexagon, Phone, Shield } from 'lucide-react';

import Hero from './components/Hero';
import CinematicReveal from './components/CinematicReveal';

// Lazy-loaded modules for optimized bundle size & TTI
const FeaturedProperties = lazy(() => import('./components/FeaturedProperties'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const MostWanted = lazy(() => import('./components/MostWanted'));
const AllProperties = lazy(() => import('./components/AllProperties'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const CinematicCTA = lazy(() => import('./components/CinematicCTA'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const PropertyModal = lazy(() => import('./components/PropertyModal'));

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
    { label: 'Más Buscadas', href: '#mas-cotizadas' },
    { label: 'Catálogo', href: '#todas-propiedades' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const handleOpenProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseProperty = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 selection:text-white">
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
              ? 'py-3.5 bg-white/70 backdrop-blur-xl border-neutral-200/80 shadow-2xl shadow-emerald-500/5'
              : 'py-3.5 bg-neutral-950/75 backdrop-blur-xl border-white/10 shadow-2xl shadow-emerald-500/5'
            : 'py-4.5 bg-transparent border-transparent'
        }`}
      >
        <div className="w-full px-6 md:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-2.5 z-50 select-none group">
            <Hexagon 
              size={22} 
              className="text-emerald-500 transform group-hover:rotate-180 transition-transform duration-700 ease-in-out" 
            />
            <span className={`text-xl font-display tracking-[0.25em] font-bold uppercase group-hover:text-emerald-500 transition-colors ${
              isOverLightSection ? 'text-neutral-900' : 'text-white'
            }`}>
              AURELIA
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
                  className="text-gray-300 hover:text-emerald-400 py-1 transition-colors block border-b border-white/5"
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
            </div>

            {/* Private contact metrics inside mobile drawer */}
            <div className="border-t border-white/5 pt-6 text-xs text-gray-400 space-y-3 font-mono">
              <p className="flex items-center gap-2">
                <Shield size={14} className="text-emerald-400" />
                <span>Contacto Directo</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400" />
                <span>+54 11 7202-3171</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Page Sections layout */}
      <main>
        {/* Fullscreen Hero parallax */}
        <Hero />

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

          {/* Client testimonial infinite marquee track */}
          <Testimonials />

          {/* Cinematic premium ScrollTrigger CTA */}
          <CinematicCTA />

          {/* VIP Contact form & virtual coordinate interactive Map */}
          <Contact />

          {/* 5. Clean footer block */}
          <Footer />

          {/* 6. Dynamic responsive property details Modal */}
          <PropertyModal property={selectedProperty} onClose={handleCloseProperty} />
        </Suspense>
      </main>
    </div>
  );
}
