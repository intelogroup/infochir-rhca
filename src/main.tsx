
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { ImageProvider } from './contexts/ImageContext'
import ResourcePreloader from './components/resource-loader/ResourcePreloader'

// Add preload hints for critical fonts
const addFontPreload = () => {
  const fontUrls = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  ];
  
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'style';
    document.head.appendChild(link);
    
    // Also add the actual stylesheet
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = url;
    style.setAttribute('media', 'print');
    style.setAttribute('onload', "this.media='all'");
    document.head.appendChild(style);
  });
  
  // Add font-display CSS
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400 700;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Execute font preloading
addFontPreload();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ImageProvider>
        <ResourcePreloader />
        <App />
      </ImageProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
