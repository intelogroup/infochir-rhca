
import { Action } from "./types";

let count = 0;
export const TOAST_REMOVE_DELAY = 1000000;

export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId));
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const clearToasts = () => {
  toastTimeouts.forEach((timeout) => {
    clearTimeout(timeout);
  });
  toastTimeouts.clear();
};

export let dispatch: (action: Action) => void = () => {};

export const setDispatch = (newDispatch: (action: Action) => void) => {
  dispatch = newDispatch;
};
