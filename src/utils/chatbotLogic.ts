import { properties } from '../data';
import { Property } from '../types';
import chatbotData from '../data/chatbotData.json';

// Utility to normalize strings (remove accents and make lowercase)
const normalize = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export interface ChatbotResponse {
  text: string;
  properties?: Property[];
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

  // 2.5 Detección de Preguntas Frecuentes y Calificación
  
  // Mascotas
  if (normMessage.match(/mascota|perro|gato/)) {
    return { text: "**¿Tienen mascotas?**\n\n* Sí\n* No\n\n> Aclaración: Muchos propietarios no aceptan mascotas, por eso necesitamos conocer esta información para ofrecerte las opciones adecuadas." };
  }

  // Presupuesto compra
  if (normMessage.match(/usd|dolar|dolares|invertir/)) {
    return { text: "**¿Dentro de qué valor o rango de precios aproximado estás buscando invertir?**\n\n* Hasta USD 30.000\n* Entre USD 30.000 y USD 60.000\n* Entre USD 60.000 y USD 100.000\n* Más de USD 100.000\n* Otro presupuesto" };
  }

  // Presupuesto alquiler
  if (normMessage.match(/presupuesto|economico|pago hasta|precio|cuanto sale/)) {
    return { text: "**¿Dentro de qué presupuesto mensual aproximado estás buscando?**\n\n* Hasta $300.000\n* Entre $300.000 y $500.000\n* Entre $500.000 y $700.000\n* Más de $700.000\n* Otro presupuesto" };
  }

  // Mudanza
  if (normMessage.match(/mudar|pronto|mes/)) {
    return { text: "**¿Para cuándo necesitás mudarte?**\n\n* Lo antes posible\n* Dentro de 1 a 3 meses\n* Solo estoy consultando" };
  }

  // Garantia
  if (normMessage.match(/garantia|finaer|caucion/)) {
    return { text: "**¿Contás con garantía?**\n\n* Sí, garantía propietaria\n* Sí, seguro de caución (Finaer, Premium, etc.)\n* No tengo garantía todavía" };
  }

  // Tamaño de lote
  if (normMessage.match(/metros|lote grande|m2|tamaño/)) {
    return { text: "**¿De cuántos metros cuadrados (m²) aproximadamente te gustaría que sea el terreno?**\n\n* Hasta 300 m²\n* Entre 300 y 600 m²\n* Más de 600 m²\n* No tengo una medida definida" };
  }

  // Método de pago
  if (normMessage.match(/contado|credito|financia|efectivo|metodo|pagar|pago/)) {
    return { text: "**¿Cuál es tu método de pago / estado financiero?**\n\n* Cuento con el efectivo disponible\n* Necesito financiar una parte\n* Tengo que vender una propiedad primero" };
  }

  // Intención general de Compra
  if (normMessage.match(/comprar|compro|venta|vender/)) {
    return { text: "**¿Estás buscando comprar una casa o un terreno/lote?**\n\n* Casa\n* Terreno/Lote\n* Departamento\n* PH\n* Local comercial\n* Otra propiedad" };
  }

  // Intención general de Alquiler o Búsqueda
  if (normMessage.match(/alquilar|alquiler|propiedades tienen|busco|quiero/)) {
    return { text: "**¿Qué tipo de propiedad buscás y para cuántos integrantes sería la familia?**\n\n**Tipo de propiedad:**\n* Casa\n* Departamento\n* PH\n* Local comercial\n* Terreno\n* Otro\n\n**Cantidad de integrantes:**\n* 1 persona\n* 2 personas\n* 3 personas\n* 4 personas\n* 5 o más personas" };
  }

  // 3. Check for properties filtering
  let filteredProps = properties;
  let isSearchingProperties = false;
  const searchIntent: string[] = [];

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
    filteredProps = filteredProps.filter(p => p.category === ('locales' as unknown as Property['category']));
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
    let extraText = '';
    
    if (searchIntent.includes('en alquiler')) {
      extraText = '\n\nPara poder asesorarte mejor con el alquiler, contame:\n1. ¿Qué tipo de propiedad buscás y para cuántos integrantes sería la familia?\n2. ¿Tienen mascotas?\n3. ¿Dentro de qué presupuesto mensual aproximado estás buscando?\n4. ¿Para cuándo necesitás mudarte? (Lo antes posible / 1 a 3 meses / Solo consultando)\n5. ¿Contás con garantía? (Propietaria / Caución / No tengo)';
    } else if (searchIntent.includes('en venta')) {
      extraText = '\n\nPara poder asesorarte mejor con la compra, contame:\n1. ¿Cuál es tu método de pago / estado financiero? (Efectivo / Financiación / Venta previa)';
    }

    if (filteredProps.length > 0) {
      const intentDesc = searchIntent.length > 0 ? searchIntent.join(', ') : 'tus criterios';
      return {
        text: `Encontré ${filteredProps.length} propiedades ${intentDesc}. Aquí te muestro algunas de las mejores opciones:${extraText}`,
        properties: filteredProps.slice(0, 3) // Return top 3 matches
      };
    } else {
      return {
        text: `Lo siento, en este momento no tenemos propiedades disponibles que coincidan exactamente con tu búsqueda. ¡Pero entran nuevas constantemente! Podés dejarnos tu contacto.${extraText}`
      };
    }
  }

  // 4. Default Fallback
  return {
    text: "En este momento no encontré información específica sobre tu consulta. Si querés, podés comunicarte con uno de nuestros asesores para recibir ayuda personalizada."
  };
}
