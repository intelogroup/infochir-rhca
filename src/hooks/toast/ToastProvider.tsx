
import * as React from "react";
import { ToastContextValue, ToasterToast } from "./types";
import { clearToasts, genId, setDispatch } from "./utils";
import { reducer } from "./toast-reducer";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  React.useEffect(() => {
    console.log('[ToastProvider] Initializing');
    setDispatch(dispatch);
    return () => {
      clearToasts();
    };
  }, []);

  const toast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = genId();
    const newToast: ToasterToast = {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dispatch({ type: "DISMISS_TOAST", toastId: id });
      },
    };
    
    dispatch({ type: "ADD_TOAST", toast: newToast });
    return {
      id,
      dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
      update: (props: ToasterToast) => 
        dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }),
    };
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, []);

  const contextValue = React.useMemo(() => ({
    toasts: state.toasts,
    toast,
    dismiss
  }), [state.toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={contextValue}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    console.error('[useToast] Toast context not found');
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

