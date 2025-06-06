
import { Helmet } from 'react-helmet';

export const MetaTags = () => {
  // Add cache-busting timestamp for favicon
  const cacheVersion = Date.now();
  
  return (
    <Helmet>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Infochir-RHCA | Votre Espace Scientifique En Ligne</title>
      <meta name="description" content="Votre Espace Scientifique En Ligne - Ressources médicales et scientifiques pour les professionnels de la santé en Haïti et dans la Caraïbe." />
      <meta name="author" content="Infochir-RHCA" />
      
      {/* Content Security Policy - Updated to allow localhost for browser extensions */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' wss://*.lovable.ai https://*.supabase.co https://*.stripe.com vitals.vercel-insights.com https://ingesteer.services-prod.nsvcs.net wss://*.supabase.co http://localhost:* https://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://m.stripe.network https://cdn.gpteng.co https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; frame-src 'self' https://*.stripe.com https://*.supabase.co; media-src 'self' data:; object-src 'none'; worker-src 'self' blob:;" />
      
      {/* Open Graph tags - Updated to use INFOCHIR logo */}
      <meta property="og:title" content="Infochir-RHCA | Votre Espace Scientifique En Ligne" />
      <meta property="og:description" content="Votre Espace Scientifique En Ligne - Ressources médicales et scientifiques pour les professionnels de la santé en Haïti et dans la Caraïbe." />
      <meta property="og:image" content="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png" />
      <meta property="og:url" content="https://info-chir.org" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Infochir-RHCA | Votre Espace Scientifique En Ligne" />
      <meta name="twitter:description" content="Votre Espace Scientifique En Ligne - Ressources médicales et scientifiques pour les professionnels de la santé en Haïti et dans la Caraïbe." />
      <meta name="twitter:image" content="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="keywords" content="Infochir, RHCA, médecine, chirurgie, anesthésiologie, Haïti, science médicale, formation médicale, recherche" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://info-chir.org" />
      
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
