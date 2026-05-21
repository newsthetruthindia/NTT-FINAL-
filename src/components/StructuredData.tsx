import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';

export default function StructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'NTT',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon-512.png`,
    },
    sameAs: [
      'https://www.facebook.com/newsthetruthindia',
      'https://twitter.com/newsthetruth',
    ],
  };

  const webSiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NTT',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteData) }}
      />
    </>
  );
}
