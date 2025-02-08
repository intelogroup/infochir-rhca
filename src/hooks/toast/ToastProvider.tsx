
import * as React from "react";
import { ToastContextValue, ToasterToast } from "./types";
import { clearToasts, genId, setDispatch } from "./utils";
import { reducer } from "./toast-reducer";

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  React.useEffect(() => {
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

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
