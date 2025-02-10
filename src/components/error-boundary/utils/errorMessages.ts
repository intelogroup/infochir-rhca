
export const getErrorMessage = (error: Error) => {
  const isChunkError = error.message.includes('Failed to fetch dynamically imported module');
  const isStripeError = error.message.includes('Stripe') || 
                       error.message.includes('stripe.com') || 
                       error.message.includes('ERR_BLOCKED_BY_CLIENT');

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

  return {
    title: "Une erreur est survenue",
    message: error.message || "Une erreur inattendue s'est produite.",
    type: "generic_error"
  };
};
