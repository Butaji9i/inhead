export function buildJsonLd({ siteUrl, path, name, description, pageTitle, contactEmail, storeUrl }) {
  const home = `${siteUrl}/`;
  const graph = [];
  if (path === '/') {
    const org = {
      '@type': 'Organization',
      '@id': `${home}#organization`,
      name,
      url: home,
      logo: `${siteUrl}/icon-512.png`,
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: contactEmail },
    };
    graph.push(org, {
      '@type': 'WebSite',
      '@id': `${home}#website`,
      url: home,
      name,
      inLanguage: 'en',
      publisher: { '@id': org['@id'] },
    });
    if (storeUrl) {
      graph.push({
        '@type': 'MobileApplication',
        name,
        description,
        operatingSystem: 'iOS',
        applicationCategory: 'HealthApplication',
        installUrl: storeUrl,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': org['@id'] },
      });
    }
  } else {
    const url = `${siteUrl}${path}`;
    const crumbName = path.replace(/\//g, '').replace(/^./, (c) => c.toUpperCase());
    graph.push(
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: pageTitle ?? name,
        isPartOf: { '@type': 'WebSite', url: home, name },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: home },
          { '@type': 'ListItem', position: 2, name: crumbName, item: url },
        ],
      },
    );
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
