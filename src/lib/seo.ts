const SITE = 'https://dgmconstructionllc.com'

export const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  name: 'DGM Construction LLC',
  image: `${SITE}/images/roofing-1.jpg`,
  url: SITE,
  telephone: '+17322315321',
  email: 'info@dgmconstructionllc.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2009 Greenwood Ave',
    addressLocality: 'Neptune City',
    addressRegion: 'NJ',
    postalCode: '07753',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Neptune City, NJ' },
    { '@type': 'AdministrativeArea', name: 'Monmouth County, NJ' },
    { '@type': 'State', name: 'New Jersey' },
  ],
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  sameAs: [SITE],
  description:
    'Licensed residential roofing, siding, gutter services, and exterior restoration for Monmouth County and New Jersey. Free inspections within a 50-mile radius.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Exterior Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Roof Replacement' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Roof Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Siding Services' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gutter Services & Maintenance' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Detailed Roof Inspection' } },
    ],
  },
} as const
