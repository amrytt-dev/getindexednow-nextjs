import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PublicSeoPage } from '@/utils/seoApi';

interface SeoHeadProps {
  seoData: PublicSeoPage | null;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ seoData }) => {
  if (!seoData) {
    return null;
  }

  return (
    <Helmet>
      <title>{seoData.title}</title>
      {seoData.description && <meta name="description" content={seoData.description} />}
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      {seoData.canonicalUrl && <link rel="canonical" href={seoData.canonicalUrl} />}
      {seoData.metaRobots && <meta name="robots" content={seoData.metaRobots} />}
      
      {/* Open Graph */}
      {seoData.ogTitle && <meta property="og:title" content={seoData.ogTitle} />}
      {seoData.ogDescription && <meta property="og:description" content={seoData.ogDescription} />}
      {seoData.ogImageUrl && <meta property="og:image" content={seoData.ogImageUrl} />}
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      {seoData.twitterCard && <meta name="twitter:card" content={seoData.twitterCard} />}
      {seoData.ogImageUrl && <meta name="twitter:image" content={seoData.ogImageUrl} />}
      
      {/* JSON-LD Structured Data */}
      {seoData.jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
