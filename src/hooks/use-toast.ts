
// Re-export sonner toast directly
import { toast } from "sonner";

// Export toast for consistent usage across the app
export { toast };

// Also provide a useToast hook for compatibility
export const useToast = () => {
  return { toast };
};
