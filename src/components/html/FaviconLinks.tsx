
import { Helmet } from 'react-helmet';

export const FaviconLinks = () => {
  // Add cache-busting timestamp for favicon refresh
  const cacheVersion = Date.now();
  const faviconUrl = `/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png?v=${cacheVersion}`;
  
  return (
    <Helmet>
      <link rel="icon" href={faviconUrl} type="image/png" />
      <link rel="shortcut icon" href={faviconUrl} type="image/png" />
      <link rel="apple-touch-icon" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="57x57" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="60x60" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="72x72" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="76x76" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="114x114" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="120x120" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="144x144" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="152x152" href={faviconUrl} />
      <link rel="apple-touch-icon" sizes="180x180" href={faviconUrl} />
      <link rel="icon" type="image/png" sizes="16x16" href={faviconUrl} />
      <link rel="icon" type="image/png" sizes="32x32" href={faviconUrl} />
      <link rel="icon" type="image/png" sizes="96x96" href={faviconUrl} />
      <link rel="icon" type="image/png" sizes="192x192" href={faviconUrl} />
      <meta name="msapplication-TileImage" content={faviconUrl} />
      <meta name="msapplication-TileColor" content="#1E40AF" />
    </Helmet>
  );
};
