import { properties } from '../data';
import chatbotData from '../data/chatbotData.json';

// Utility to normalize strings (remove accents and make lowercase)
const normalize = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export interface ChatbotResponse {
  text: string;
  properties?: any[];
}

export function processChatbotMessage(message: string): ChatbotResponse {
  const normMessage = normalize(message);

  // 1. Check FAQ
  for (const faq of chatbotData.faq) {
    const isMatch = faq.keywords.some((kw: string) => normMessage.includes(normalize(kw)));
    if (isMatch) {
      return { text: faq.answer };
    }
  }

  // 2. Check for general info
  if (normMessage.includes('telefono') || normMessage.includes('whatsapp') || normMessage.includes('contacto') || normMessage.includes('llamar')) {
    return { text: `Podés comunicarte con nosotros por teléfono o WhatsApp al ${chatbotData.generalInfo.phone} o por correo a ${chatbotData.generalInfo.email}.` };
  }
  if (normMessage.includes('servicios') || normMessage.includes('ofrecen') || normMessage.includes('hacen')) {
    return { text: `Nuestros servicios incluyen: ${chatbotData.services.join(', ')}.` };
  }

  // 3. Check for properties filtering
  let filteredProps = properties;
  let isSearchingProperties = false;
  let searchIntent = [];

  // Transaction type
  if (normMessage.includes('alquiler') || normMessage.includes('alquilar')) {
    filteredProps = filteredProps.filter(p => p.transactionType === 'alquiler');
    isSearchingProperties = true;
    searchIntent.push('en alquiler');
  } else if (normMessage.includes('venta') || normMessage.includes('comprar')) {
    filteredProps = filteredProps.filter(p => p.transactionType === 'venta');
    isSearchingProperties = true;
    searchIntent.push('en venta');
  }

  // Category
  if (normMessage.includes('casa')) {
    filteredProps = filteredProps.filter(p => p.category === 'casas');
    isSearchingProperties = true;
    searchIntent.push('casas');
  } else if (normMessage.includes('departamento') || normMessage.includes('depto')) {
    filteredProps = filteredProps.filter(p => p.category === 'departamentos');
    isSearchingProperties = true;
    searchIntent.push('departamentos');
  } else if (normMessage.includes('terreno') || normMessage.includes('lote')) {
    filteredProps = filteredProps.filter(p => p.category === 'terrenos');
    isSearchingProperties = true;
    searchIntent.push('terrenos');
  } else if (normMessage.includes('quinta')) {
    filteredProps = filteredProps.filter(p => p.category === 'casas-quinta');
    isSearchingProperties = true;
    searchIntent.push('quintas');
  } else if (normMessage.includes('local') || normMessage.includes('comercial')) {
    filteredProps = filteredProps.filter(p => p.category === ('locales' as any));
    isSearchingProperties = true;
    searchIntent.push('locales comerciales');
  }

  // Specific features
  if (normMessage.includes('credito') || normMessage.includes('apto credito')) {
    filteredProps = filteredProps.filter(p => normalize(p.description).includes('credito') || p.features.some(f => normalize(f).includes('credito')));
    isSearchingProperties = true;
    searchIntent.push('aptas crédito');
  }
  if (normMessage.includes('pileta') || normMessage.includes('piscina')) {
    filteredProps = filteredProps.filter(p => p.features.some(f => normalize(f).includes('pileta') || normalize(f).includes('piscina')) || normalize(p.description).includes('pileta'));
    isSearchingProperties = true;
    searchIntent.push('con pileta');
  }
  if (normMessage.includes('cochera') || normMessage.includes('garage') || normMessage.includes('auto')) {
    filteredProps = filteredProps.filter(p => p.features.some(f => normalize(f).includes('cochera') || normalize(f).includes('garage')) || normalize(p.description).includes('cochera'));
    isSearchingProperties = true;
    searchIntent.push('con cochera');
  }

  // Rooms
  const matchDorm = normMessage.match(/(\d+)\s*(dormitorio|habitacion|habitaciones)/);
  if (matchDorm) {
    const num = parseInt(matchDorm[1]);
    filteredProps = filteredProps.filter(p => p.beds >= num);
    isSearchingProperties = true;
    searchIntent.push(`con ${num} dormitorios`);
  }

  // Location filtering dynamically based on the available locations in data
  const locations = Array.from(new Set(properties.map(p => p.location)));
  for (const loc of locations) {
    if (normMessage.includes(normalize(loc))) {
      filteredProps = filteredProps.filter(p => p.location === loc);
      isSearchingProperties = true;
      searchIntent.push(`en ${loc}`);
      break;
    }
  }

  if (isSearchingProperties) {
    if (filteredProps.length > 0) {
      const intentDesc = searchIntent.length > 0 ? searchIntent.join(', ') : 'tus criterios';
      return {
        text: `Encontré ${filteredProps.length} propiedades ${intentDesc}. Aquí te muestro algunas de las mejores opciones:`,
        properties: filteredProps.slice(0, 3) // Return top 3 matches
      };
    } else {
      return {
        text: `Lo siento, en este momento no tenemos propiedades disponibles que coincidan exactamente con tu búsqueda. ¡Pero entran nuevas constantemente! Podés dejarnos tu contacto.`
      };
    }
  }

  // 4. Default Fallback
  return {
    text: "En este momento no encontré información específica sobre tu consulta. Si querés, podés comunicarte con uno de nuestros asesores para recibir ayuda personalizada."
  };
}
