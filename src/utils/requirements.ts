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
