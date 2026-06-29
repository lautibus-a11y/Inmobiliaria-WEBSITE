export interface Property {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  priceNumeric: number;
  location: string;
  streets?: string;
  mercadoLibreLink?: string;
  category: 'casas' | 'departamentos' | 'terrenos' | 'casas-quinta';
  transactionType: 'venta' | 'alquiler';
  image: string;
  images?: string[];
  description: string;
  beds: number;
  baths: number;
  area: string; // e.g., "450 m²"
  features: string[];
  coordinates: { x: number; y: number }; // Percentage coordinates on our elegant custom map [0-100]
  isFeatured: boolean;
  isMostWanted: boolean;
}



export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}
