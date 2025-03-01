
// Re-export sonner toast directly to avoid unnecessary wrapping
import { toast } from "sonner";

// Export it to provide consistent API
export { toast };

// If you still need the custom ToastProvider functionality, uncomment this:
// export { ToastProvider } from "./toast/ToastProvider";
// export type { ToasterToast } from "./toast/types";
