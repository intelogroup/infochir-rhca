
import { Helmet } from 'react-helmet';

export const ResourceHints = () => {
  return (
    <Helmet>
      {/* Resource hints for fast loading */}
      <link rel="preconnect" href="https://llxzstqejdrplmxdjxlu.supabase.co" crossOrigin="" />
      <link rel="dns-prefetch" href="https://llxzstqejdrplmxdjxlu.supabase.co" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://cdn.gpteng.co" crossOrigin="" />
      
      {/* Preload critical assets */}
      <link rel="preload" href="/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png" as="image" fetchPriority="high" />
      <link rel="preload" href="/src/index.css" as="style" />
      <link rel="preload" href="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png" as="image" />
      
      {/* Prefetch primary routes */}
      <link rel="prefetch" href="/about" as="document" />
      <link rel="prefetch" href="/rhca" as="document" />
      <link rel="prefetch" href="/igm" as="document" />
    </Helmet>
  );
};
