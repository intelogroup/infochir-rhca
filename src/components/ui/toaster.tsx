
"use client"

import { Toaster as SonnerToaster } from "sonner";

// This component is now a simple wrapper around Sonner's Toaster
// for backward compatibility
export function Toaster() {
  return (
    <SonnerToaster 
      position="top-center"
      richColors
    />
  );
}
