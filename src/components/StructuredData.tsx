import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';

export default function StructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': 'https://newsthetruth.com/#organization',
    name: 'NTT',
    url: SITE_URL,
    description:
      'NTT (News The Truth) is an independent investigative journalism platform covering India, World, Politics, and breaking news with a focus on citizen journalism and authentic storytelling.',
    foundingDate: '2023',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon-512.png`,
    },
    publishingPrinciples: 'https://newsthetruth.com/editorial-policy',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      url: 'https://newsthetruth.com/contact',
    },
    sameAs: [
      'https://www.facebook.com/newsthetruthh/',
      'https://x.com/newsthetruthin',
      'https://www.instagram.com/newsthetruthindia',
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
