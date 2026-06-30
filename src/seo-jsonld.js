const seoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'New Line Cargo',
  description: 'Транспортно-логистическая компания. Авиа, Ж/Д, авто и морские перевозки грузов по России и миру.',
  url: 'https://newlinecargo.ru',
  telephone: '+79636948738',
  email: 'newlinecargo2003@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Москва',
    streetAddress: 'Новая Басманная улица, 12с2А',
    addressCountry: 'RU',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '10:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '10:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '10:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '10:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '10:00', closes: '19:00' },
  ],
  sameAs: [],
};

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `https://newlinecargo.ru${item.href}` : undefined,
    })),
  };
}

export default seoJsonLd;
