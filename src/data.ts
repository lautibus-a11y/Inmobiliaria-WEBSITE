import { Property, Testimonial, Stat } from './types';

export const properties: Property[] = [
  {
    id: 'prop-1',
    transactionType: 'venta',
    title: 'Manuel Antonio Castro',
    subtitle: 'Ante esquina Paso de los Libres',
    price: 'Consultar Precio',
    priceNumeric: 0,
    location: '20 de Junio, La Matanza',
    streets: 'Manuel A. Castro y Paso de los Libres',
    mercadoLibreLink: 'https://terreno.mercadolibre.com.ar/MLA-2627762324-terreno-en-venta-20-de-junio-_JM',
    category: 'terrenos',
    image: '/venta/terrenos/Terreno-Manual-Antonio-Castro-y-1200-PasodeLoslibres--PORTADA--.webp',
    images: [
      '/venta/terrenos/Terreno-Manual-Antonio-Castro-y-1200-PasodeLoslibres--PORTADA--.webp',
      '/venta/terrenos/Terreno-Manual-Antonio-Castro-y-1200-PasodeLoslibres--1--.webp',
      '/venta/terrenos/Terreno-Manual-Antonio-Castro-y-1200-PasodeLoslibres--2--.webp'
    ],
    description: 'Terreno en Venta – Parcela 9 (Ante esquina)\nUbicación: Manuel Castro, 20 de Junio, La Matanza.\n\nExcelente oportunidad de inversión en una de las zonas más buscadas de 20 de Junio. La parcela se encuentra ubicada en ante esquina entre Manuel Castro y Paso de los Libres, a solo una cuadra del asfalto, con un entorno óptimo y vecinos linderos que cuentan principalmente con casas quintas, aportando tranquilidad y buena convivencia.\n\nDimensiones y características:\n• Frente: 27 metros\n• Fondo: 55 metros\n• Superficie total: 1.500 m²\n\nPosee una arboleda frondosa, destacándose varias acacias que brindan una sombra natural ideal para disfrutar del espacio verde. El lote ofrece una superficie amplia y aprovechable para diversos proyectos.\n\nIdeal para vivienda, descanso de fin de semana o inversión a futuro.\n\nIVANA MOLINA & ASOC. BIENES RAÍCES\nMAT 1048\nCDMDLM',
    beds: 0,
    baths: 0,
    area: '1,500 m²',
    features: ['Arboleda Frondosa', 'Zona Residencial (Quintas)', 'A 100m del asfalto', 'Inversión Segura'],
    coordinates: { x: 35, y: 40 },
    isFeatured: true,
    isMostWanted: true,
  },
  {
    id: 'prop-2',
    transactionType: 'venta',
    title: 'Lote en Alejo Castex',
    subtitle: 'Dos terrenos contiguos (3000 m²)',
    price: 'Consultar Precio',
    priceNumeric: 0,
    location: '20 de Junio, La Matanza',
    streets: 'Alejo Castex y Manuel A. Castro',
    mercadoLibreLink: 'https://terreno.mercadolibre.com.ar/MLA-2587214160-dos-terrenos-a-la-venta-20-de-junio-_JM',
    category: 'terrenos',
    image: '/venta/terrenos/Terreno-alejo-castex-portada.webp',
    images: [
      '/venta/terrenos/Terreno-alejo-castex-portada.webp',
      '/venta/terrenos/Terreno-Alejo-Castex-1.webp'
    ],
    description: 'TERRENO 3000 m² ALEJO CASTEX, 20 DE JUNIO, LA MATANZA\n\nSe venden dos terrenos contiguos, cada uno con salida a distintas calles, ofreciendo una ubicación estratégica y múltiple accesibilidad.\n• Terreno 1 con frente a Alejo Castex\n• Terreno 2 con frente a Manuel Castro\n\nAmbos lotes se encuentran parquizados, alambrados y arbolados, ideales para quienes buscan un entorno natural y listo para proyectar.\n\nCada terreno posee:\n• 27,50 metros de frente\n• 55 metros de fondo\n• Superficie total aproximada: 1.512 m² por lote\n\nLa ubicación es excelente: zona tranquila, en pleno centro de 20 de Junio, con cercanía a comercios, transporte y rápido acceso a las principales arterias. Perfectos para proyecto residencial, emprendimiento o inversión.\n\nIVANA MOLINA & ASOC. BIENES RAÍCES\nMAT 1048\nCDMDLM',
    beds: 0,
    baths: 0,
    area: '3,000 m²',
    features: ['Doble Acceso por Calles Diferentes', 'Parquizado y Alambrado', 'Ubicación Estratégica Céntrica', 'Lotes Subdividibles'],
    coordinates: { x: 58, y: 25 },
    isFeatured: true,
    isMostWanted: true,
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alexander Sterling',
    role: 'Inversor en Tecnología Financiera',
    text: '“La reserva y el nivel de detalle en su asesoría superaron mis expectativas. Consiguieron una residencia brutalista exclusiva fuera del mercado y concretaron la compra en pocos días con total discreción.”',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Dra. Elena Rostova',
    role: 'Coleccionista de Arte y Filántropa',
    text: '“Vila Lumina es una obra de arte y una extensión de mi galería. La luz natural y la amplitud de los espacios son extraordinarias. Su servicio personalizado es clave para adquirir propiedades de verdadero prestigio internacional.”',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Kenji y Sakura Sato',
    role: 'Inversores en Bienes de Lujo',
    text: '“Adquirir el lote Terra Sanctum con planos aprobados fue nuestra mejor decisión del año. Su comprensión del mercado premium y su acompañamiento legal y técnico simplificaron una operación compleja con absoluta seguridad.”',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
];

export const stats: Stat[] = [
  {
    id: 'stat-1',
    label: 'Inversiones Concretadas',
    value: 124,
    suffix: 'M+',
    prefix: '$',
  },
  {
    id: 'stat-2',
    label: 'Clientes Satisfechos',
    value: 85,
    suffix: '',
  },
  {
    id: 'stat-3',
    label: 'Años de Trayectoria',
    value: 12,
    suffix: '+',
  },
  {
    id: 'stat-4',
    label: 'Transacciones Exitosas',
    value: 99.4,
    suffix: '%',
  },
];
