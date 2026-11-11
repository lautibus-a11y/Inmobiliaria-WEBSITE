import { useNavigate } from 'react-router-dom';

import Hero from '../components/Hero';
import { Property } from '../types';
import { saveHomeScrollPosition } from '../utils/scrollRestoration';

import FeaturedProperties from '../components/FeaturedProperties';
import AboutUs from '../components/AboutUs';
import MostWanted from '../components/MostWanted';
import AllProperties from '../components/AllProperties';
import CinematicCTA from '../components/CinematicCTA';
import Contact from '../components/Contact';

export default function Home() {
  const navigate = useNavigate();

  const handleOpenProperty = (property: Property) => {
    saveHomeScrollPosition(window.scrollY);
    navigate(`/propiedades/${property.id}`);
  };

  return (
    <>
      <Hero />
      <FeaturedProperties onSelectProperty={handleOpenProperty} />
      <AboutUs />
      <MostWanted onSelectProperty={handleOpenProperty} />
      <AllProperties onSelectProperty={handleOpenProperty} />
      <CinematicCTA />
      <Contact />
    </>
  );
}
