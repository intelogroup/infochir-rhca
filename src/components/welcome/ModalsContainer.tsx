
import React from "react";
import { WelcomeModal } from "./WelcomeModal";
import { ProductInfoModal } from "./ProductInfoModal";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

export const ModalsContainer = () => {
  // Check if modals should be shown - don't show on initial load
  const [shouldShowModals, setShouldShowModals] = React.useState(false);

  React.useEffect(() => {
    // Initialize the flag first
    if (!sessionStorage.getItem('modalInitialized')) {
      sessionStorage.setItem('modalInitialized', 'true');
      // Skip showing modals on initial load
    } else {
      // Set to true to allow modals after navigation
      setShouldShowModals(true);
    }
  }, []);

  if (!shouldShowModals) return null;

  return (
    <ErrorBoundary name="Modals">
      <WelcomeModal />
      <ProductInfoModal />
    </ErrorBoundary>
  );
};
