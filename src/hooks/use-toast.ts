
import { toast as sonnerToast } from "sonner";
export { useToast, ToastProvider } from "./toast/ToastProvider";
export type { ToasterToast } from "./toast/types";

// Re-export toast function
export const toast = sonnerToast;
