
import { Helmet } from 'react-helmet';

export const CriticalCSS = () => {
  return (
    <Helmet>
      <style>{`
        /* Critical CSS for initial render */
        :root { --bg-main: #f8fafc; --text-main: #1f2937; --blue-primary: #1E40AF; --transition-default: all 0.3s ease; }
        body { margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: var(--bg-main); color: var(--text-main); }
        .no-js-warning { display: none; }
        .no-js .no-js-warning { display: block; padding: 20px; text-align: center; background: var(--bg-main); color: var(--text-main); }
        .js-content { display: block; }
        .no-js .js-content { display: none; }
        #initial-loader { display: flex; position: fixed; inset: 0; justify-content: center; align-items: center; background: linear-gradient(to bottom, var(--bg-main), #ffffff); z-index: 9999; opacity: 1; transition: opacity 0.3s ease; }
        .loader-spinner { border: 4px solid #f3f3f3; border-top: 4px solid var(--blue-primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loader-text { font-family: sans-serif; color: #666; }
        
        /* Nav placeholder to prevent layout shift */
        .nav-placeholder { height: 64px; width: 100%; }
        
        /* Hero section minimal styles */
        .hero-placeholder { min-height: 400px; background: linear-gradient(to right, #f9fafb, #f3f4f6); display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        
        /* Animate content when it loads */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
      `}</style>
    </Helmet>
  );
};
