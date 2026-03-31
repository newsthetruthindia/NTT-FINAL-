import React from 'react';

export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "NTT",
    "url": "https://newsthetruth.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ntt-final.vercel.app/icon-512.png"
    },
    "sameAs": [
      "https://facebook.com/newsthetruth india",
      "https://twitter.com/newsthetruth"
    ]
  };

  const webSiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NTT",
    "url": "https://ntt-final.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ntt-final.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
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
