
import { Helmet } from 'react-helmet';

export const InitScripts = () => {
  return (
    <Helmet>
      <script>{`
        (function() {
          document.documentElement.classList.remove('no-js');
          document.documentElement.classList.add('js');
          
          // Add performance marks for measuring load times
          if (window.performance && window.performance.mark) {
            window.performance.mark('app-init-start');
            performance.clearMarks = performance.clearMarks || function(){};
            performance.clearMeasures = performance.clearMeasures || function(){};
            performance.measure = performance.measure || function(){};
            performance.getEntriesByType = performance.getEntriesByType || function(){ return []; };
          }
          
          // Register service worker eagerly
          if ('serviceWorker' in navigator) {
            try {
              navigator.serviceWorker.register('/sw.js')
                .catch(function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
            } catch (e) {
              console.error('Service worker registration error:', e);
            }
          }
        })();
      `}</script>
    </Helmet>
  );
};
