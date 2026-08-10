
import { Helmet } from 'react-helmet';

/**
 * Sitewide, non-page-specific head tags only.
 * Page titles, descriptions, canonicals, social previews and JSON-LD are
 * owned per route by <SEO /> (src/components/seo/SEO.tsx).
 */
export const MetaTags = () => {
  // Add cache-busting timestamp for favicon
  const cacheVersion = Date.now();
  
  return (
    <Helmet>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Infochir-RHCA" />
      
      {/* Content Security Policy - Updated to allow localhost for browser extensions */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' wss://*.lovable.ai https://*.supabase.co https://*.stripe.com vitals.vercel-insights.com https://ingesteer.services-prod.nsvcs.net wss://*.supabase.co http://localhost:* https://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://m.stripe.network https://cdn.gpteng.co https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; frame-src 'self' https://*.stripe.com https://*.supabase.co; media-src 'self' data:; object-src 'none'; worker-src 'self' blob:;" />
      
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="keywords" content="Infochir, RHCA, médecine, chirurgie, anesthésiologie, Haïti, science médicale, formation médicale, recherche" />
      
      {/* Web App Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Cache control meta tags */}
      <meta httpEquiv="Cache-Control" content="max-age=3600, must-revalidate" />
      
      {/* Additional favicon meta for better search engine recognition */}
      <meta name="msapplication-TileImage" content={`/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png?v=${cacheVersion}`} />
      <meta name="msapplication-TileColor" content="#1E40AF" />
    </Helmet>
  );
};
