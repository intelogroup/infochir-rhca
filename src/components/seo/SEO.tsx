import * as React from "react";
import { Helmet } from "react-helmet";

export const SITE_URL = "https://info-chir.org";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png`;

interface SEOProps {
  /** Page title, under 60 characters. */
  title: string;
  /** Meta description, 50-160 characters. */
  description: string;
  /** Route path, e.g. "/about". Used for canonical and og:url. */
  path: string;
  /** Absolute image URL for social previews. */
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  /** One or more JSON-LD objects to embed. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Per-page head metadata. Each page owns its own title, description,
 * self-referencing canonical, social preview tags and structured data.
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
}) => {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Info CHIR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Info CHIR",
  alternateName: "Infochir-RHCA",
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  description:
    "Organisation haïtienne de publication scientifique médicale et chirurgicale.",
  areaServed: "HT",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Info CHIR",
  url: SITE_URL,
  inLanguage: "fr",
  publisher: { "@type": "Organization", name: "Info CHIR", url: SITE_URL },
};

export const collectionPageSchema = (
  name: string,
  description: string,
  path: string,
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: `${SITE_URL}${path}`,
  inLanguage: "fr",
  isPartOf: { "@type": "WebSite", name: "Info CHIR", url: SITE_URL },
});
