import { useNavigate, useOutletContext } from 'react-router-dom';

import Hero from '../components/Hero';
import { Property } from '../types';

import FeaturedProperties from '../components/FeaturedProperties';
import AboutUs from '../components/AboutUs';
import MostWanted from '../components/MostWanted';
import AllProperties from '../components/AllProperties';
import CinematicCTA from '../components/CinematicCTA';
import Contact from '../components/Contact';

export default function Home() {
  const navigate = useNavigate();
  const { isAppLoaded } = useOutletContext<{ isAppLoaded: boolean }>();

  const handleOpenProperty = (property: Property) => {
    navigate(`/propiedades/${property.id}`);
  };

  return (
    <>
      <Hero isAppLoaded={isAppLoaded} />
      <FeaturedProperties onSelectProperty={handleOpenProperty} />
      <AboutUs />
      <MostWanted onSelectProperty={handleOpenProperty} />
      <AllProperties onSelectProperty={handleOpenProperty} />
      <CinematicCTA />
      <Contact />
    </>
  );
}
