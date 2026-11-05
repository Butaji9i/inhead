// `path` is the page's path without its language prefix ('/', '/privacy/'); `homeUrl` is the home page in the
// page's language. The Organization, WebSite and app are one entity each, whichever language describes them.
export function buildJsonLd({
  siteUrl, path, name, description, pageTitle, contactEmail, storeUrl,
  lang = 'en', homeUrl = `${siteUrl}/`, homeName = 'Home', crumbName, languages = ['en', 'ru', 'cs'],
}) {
  const root = `${siteUrl}/`;
  const graph = [];
  if (path === '/') {
    const org = {
      '@type': 'Organization',
      '@id': `${root}#organization`,
      name,
      url: root,
      logo: `${siteUrl}/icon-512.png`,
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: contactEmail },
    };
    graph.push(org, {
      '@type': 'WebSite',
      '@id': `${root}#website`,
      url: root,
      name,
      inLanguage: languages,
      publisher: { '@id': org['@id'] },
    });
    if (storeUrl) {
      graph.push({
        '@type': 'MobileApplication',
        '@id': `${root}#app`,
        name,
        url: storeUrl,
        description,
        inLanguage: lang,
        operatingSystem: 'iOS',
        applicationCategory: 'HealthApplication',
        installUrl: storeUrl,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': org['@id'] },
      });
    }
  } else {
    const url = homeUrl.replace(/\/$/, '') + path;
    const crumb = crumbName ?? path.replace(/\//g, '').replace(/^./, (c) => c.toUpperCase());
    graph.push(
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: pageTitle ?? name,
        inLanguage: lang,
        isPartOf: { '@type': 'WebSite', '@id': `${root}#website`, url: root, name },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: homeName, item: homeUrl },
          { '@type': 'ListItem', position: 2, name: crumb, item: url },
        ],
      },
    );
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
