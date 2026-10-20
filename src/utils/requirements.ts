import { Property } from '../types';

/**
 * Returns the standalone requirements URL for a given property.
 * Example: "/requisitos/castro-646.html"
 */
export function getRequirementsUrl(property: Property): string {
  if (property.requirementsSlug) {
    return `/requisitos/${property.requirementsSlug}.html`;
  }
  const slug = property.id.replace(/^prop-/, '');
  return `/requisitos/${slug}.html`;
}
export function isPetFriendlyProperty(property: Property): boolean {
  if (property.category === 'locales') return false;
  if (!property.features || !Array.isArray(property.features)) return true;
  return !property.features.some(f => {
    const lower = f.toLowerCase();
    return lower.includes('no se permiten mascotas') || lower.includes('no se aceptan mascotas');
  });
}
