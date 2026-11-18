// `path` is the page's path without its language prefix ('/', '/privacy/'); `homeUrl` is the home page in the
// page's language. The Organization, WebSite and app are one entity each, whichever language describes them.
// `faq` is the page's visible questions and answers ({ q, a }), given as FAQPage markup word for word;
// `features` the app's features, as its featureList.
export function buildJsonLd({
  siteUrl, path, name, description, pageTitle, contactEmail, storeUrl,
  lang = 'en', homeUrl = `${siteUrl}/`, homeName = 'Home', crumbName, languages = ['en', 'ru', 'cs'],
  faq = [], features = [],
}) {
  const root = `${siteUrl}/`;
  const graph = [];
  const pageUrl = path === '/' ? homeUrl : homeUrl.replace(/\/$/, '') + path;
  if (path === '/') {
    const org = {
      '@type': 'Organization',
      '@id': `${root}#organization`,
      name,
      url: root,
      logo: `${siteUrl}/icon-512.png`,
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: contactEmail },
      ...(storeUrl ? { sameAs: [storeUrl] } : {}),
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
        softwareRequirements: 'iOS or iPadOS 26 or later',
        availableOnDevice: 'iPhone, iPad',
        applicationCategory: 'HealthApplication',
        ...(features.length ? { featureList: features } : {}),
        installUrl: storeUrl,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': org['@id'] },
      });
    }
  } else {
    const url = pageUrl;
    const crumb = crumbName ?? path.replace(/\//g, '').replace(/^./, (c) => c.toUpperCase());
    graph.push(
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: pageTitle ?? name,
        inLanguage: lang,
        isPartOf: { '@type': 'WebSite', '@id': `${root}#website`, url: root, name },
        ...(storeUrl ? { about: { '@id': `${root}#app` } } : {}),
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
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      url: pageUrl,
      inLanguage: lang,
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
