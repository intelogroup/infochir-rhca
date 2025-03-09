export const getErrorMessage = (error: Error) => {
  // Make sure we have a valid error message
  if (!error.message) {
    error.message = "Unknown error";
  }

  const isChunkError = error.message.includes('Failed to fetch dynamically imported module');
  const isStripeError = error.message.includes('Stripe') || 
                       error.message.includes('stripe.com') || 
                       error.message.includes('ERR_BLOCKED_BY_CLIENT');
  const isDownloadError = error.message.includes('download') || 
                          error.message.includes('fetch') ||
                          error.message.includes('network') ||
                          error.message.includes('Failed to fetch');
                          
  // Enhanced router error detection
  const isRouterError = (error.stack && (
                        error.stack.includes('router.js') || 
                        error.stack.includes('react-router') ||
                        error.stack.includes('index.js:1374') ||
                        error.stack.includes('assets/react-vendor') ||
                        error.message.includes('route') ||
                        error.message.includes('navigation'))) ||
                        error.name === 'NavigationError';
  
  if (isRouterError) {
    return {
      title: "Erreur de navigation",
      message: "Un problème est survenu lors de la navigation. Veuillez réessayer.",
      type: "router_error",
      details: [
        "Essayez de rafraîchir la page",
        "Vérifiez l'URL que vous essayez d'atteindre",
        "Retournez à la page d'accueil et réessayez"
      ]
    };
  }

  if (isChunkError) {
    return {
      title: "Erreur de chargement",
      message: "Le chargement de la page a échoué. Veuillez réessayer.",
      type: "chunk_error"
    };
  }

  if (isStripeError) {
    return {
      title: "Erreur de paiement",
      message: "Le système de paiement est temporairement indisponible. Veuillez désactiver votre bloqueur de publicités si vous en utilisez un.",
      type: "stripe_error",
      details: [
        "Vérifiez que votre bloqueur de publicités est désactivé",
        "Vérifiez votre connexion internet",
        "Rafraîchissez la page"
      ]
    };
  }
  
  if (isDownloadError) {
    return {
      title: "Erreur de téléchargement",
      message: "Le téléchargement du fichier a échoué. Veuillez vérifier votre connexion et réessayer.",
      type: "download_error",
      details: [
        "Vérifiez votre connexion internet",
        "Assurez-vous que le fichier existe toujours",
        "Essayez de rafraîchir la page et réessayez"
      ]
    };
  }

  return {
    title: "Une erreur est survenue",
    message: error.message || "Une erreur inattendue s'est produite.",
    type: "generic_error"
  };
};
