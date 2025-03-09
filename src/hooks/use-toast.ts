
// Re-export sonner toast directly
import { toast } from "sonner";
import { logError } from "@/lib/error-logger";

// Export toast for consistent usage across the app
export { toast };

// Add error toast helper that includes logging
export const errorToast = (message: string, error?: unknown) => {
  if (error) {
    logError(error, 'toast-error', { message });
  }
  
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

// Add success toast with default configuration
export const successToast = (message: string) => {
  return toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};
