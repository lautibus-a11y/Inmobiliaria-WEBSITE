import fs from 'fs';

const newProp = `  {
    id: 'prop-juan-pio-gana',
    transactionType: 'venta',
    title: 'Casa con Gran Fondo Libre y Renta Activa',
    subtitle: 'González Catán – Terreno irregular > 300 m²',
    price: 'USD 38.000',
    priceNumeric: 38000,
    location: 'González Catán',
    streets: 'Juan Pio Gana 4400',
    mercadoLibreLink: '',
    category: 'casas',
    image: '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.36.jpeg',
    images: [
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.36.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.37 (1).jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.37.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.38.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.40.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.41 (1).jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.41.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.43 (1).jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.43.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.45.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_WhatsApp Image 2026-02-18 at 10.17.47.jpeg',
      '/venta/casas-quinta/Juan Pio Gana 4400/Juan pio gana_D_705244-MLA89580743718_082025-F.webp'
    ],
    description: 'CASA CON GRAN FONDO LIBRE Y RENTA ACTIVA EN GONZÁLEZ CATÁN\\n\\nDescubrí esta propiedad llena de potencial, ubicada sobre un terreno único de más de 300 m² que se ensancha hacia el fondo. Perfecta para quienes buscan un proyecto de reciclaje para vivienda propia o una inversión rentable desde el primer día.\\n\\nCaracterísticas principales:\\n\\n• Living, cocina y comedor integrados de distribución práctica.\\n• Dos amplias habitaciones con espacio suficiente para gran capacidad de guardado.\\n• Baño completo.\\n• Gran patio trasero con árboles frutales, ideal para disfrutar de la naturaleza en casa.\\n\\nMedidas del lote:\\n10 metros de frente por 31 metros de profundidad, abriéndose en el contrafrente a un ancho aproximado de 12 metros. Esta forma irregular aprovecha al máximo la superficie trasera para un jardín espacioso y privado.\\n\\nCondiciones:\\nExcelente oportunidad para refaccionar y jerarquizar. Se encuentra con renta vigente, convirtiéndola en una alternativa ideal para inversores que buscan capitalización y flujo de fondos inmediato.\\n\\nIVANA MOLINA & ASOC. BIENES RAÍCES\\nMAT 1048 CDMDLM',
    beds: 2,
    baths: 1,
    area: '300 m²',
    features: ['Terreno > 300 m²', 'Renta activa', 'Árboles frutales', 'Oportunidad de inversión'],
    coordinates: { x: 50, y: 50 },
    isFeatured: true,
    isMostWanted: false,
  },`;

let data = fs.readFileSync('src/data.ts', 'utf-8');
const searchString = 'export const properties: Property[] = [';
const insertIndex = data.indexOf(searchString) + searchString.length;

if (insertIndex > searchString.length) {
  const result = data.slice(0, insertIndex) + '\\n' + newProp + data.slice(insertIndex);
  fs.writeFileSync('src/data.ts', result);
  console.log('Propiedad agregada.');
} else {
  console.log('Error encontrando el array.');
}
