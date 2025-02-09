
type ErrorType = 'network_error' | 'timeout_error' | 'chunk_error' | 'stripe_error' | 'generic_error';

interface ErrorDetails {
  title: string;
  message: string;
  type: ErrorType;
  details?: string[];
}

export const getErrorMessage = (error: Error): ErrorDetails => {
  // Network errors
  const isNetworkError = error.message.includes('Failed to fetch') || 
                        error.message.includes('NetworkError') ||
                        error.message.includes('network error');
                        
  // Timeout errors                    
  const isTimeoutError = error.message.includes('timeout') || 
                        error.message.includes('ETIMEDOUT') ||
                        error.name === 'TimeoutError';
                        
  // Chunk loading errors
  const isChunkError = error.message.includes('Failed to fetch dynamically imported module');
  
  // Stripe errors
  const isStripeError = error.message.includes('Stripe') || 
                       error.message.includes('stripe.com') || 
                       error.message.includes('ERR_BLOCKED_BY_CLIENT');

  if (isNetworkError) {
    return {
      title: "Erreur de connexion",
      message: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
      type: "network_error",
      details: [
        "Vérifiez votre connexion internet",
        "Assurez-vous que le serveur est accessible",
        "Réessayez dans quelques instants"
      ]
    };
  }

  if (isTimeoutError) {
    return {
      title: "Délai d'attente dépassé",
      message: "La requête a pris trop de temps. Veuillez réessayer.",
      type: "timeout_error",
      details: [
        "Le serveur met trop de temps à répondre",
        "Réessayez plus tard",
        "Si le problème persiste, contactez le support"
      ]
    };
  }

  if (isChunkError) {
    return {
      title: "Erreur de chargement",
      message: "Le chargement de la page a échoué. Veuillez réessayer.",
      type: "chunk_error",
      details: [
        "Videz le cache de votre navigateur",
        "Rafraîchissez la page",
        "Si le problème persiste, videz le cache et les cookies"
      ]
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

  return {
    title: "Une erreur est survenue",
    message: error.message || "Une erreur inattendue s'est produite.",
    type: "generic_error",
    details: error.stack ? [error.stack] : undefined
  };
};

