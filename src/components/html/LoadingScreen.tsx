
export const LoadingScreen = () => {
  return (
    <>
      {/* Initial visible loader */}
      <div id="initial-loader">
        <div style={{ textAlign: 'center' }}>
          <div className="loader-spinner"></div>
          <p className="loader-text">Chargement de l'application...</p>
        </div>
      </div>
      
      {/* Nav placeholder to prevent layout shift */}
      <div className="nav-placeholder" aria-hidden="true"></div>
      
      {/* No JavaScript fallback */}
      <div className="no-js-warning">
        <h1>JavaScript Required</h1>
        <p>We're sorry, but this application requires JavaScript to function properly. Please enable JavaScript in your browser settings and reload the page.</p>
        <p>If you cannot enable JavaScript, you can:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>Contact us at support@infochir.com</li>
          <li>Visit our static content at static.infochir.com</li>
          <li>Call us at +1234567890</li>
        </ul>
      </div>
    </>
  );
};
